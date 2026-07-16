"use client";

import { useCallback, useRef, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	getCommentsPageAction,
	moderateCommentAction,
} from "@/lib/actions/comments";
import type { PostComment } from "@/lib/types/comment";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "../ui/pagination";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

interface CommentsSheetProps {
	postId: string;
	postAuthorId: string;
	commentCount: number;
	initialComments: PostComment[];
	trigger?: React.ReactNode;
	defaultOpen?: boolean;
	canModerate: boolean;
}

export default function CommentsSheet({
	postId,
	postAuthorId,
	commentCount,
	initialComments,
	trigger,
	defaultOpen,
	canModerate,
}: CommentsSheetProps) {
	const [comments, setComments] = useState<PostComment[]>(initialComments);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [count, setCount] = useState(commentCount);
	const [open, setOpen] = useState(defaultOpen ?? false);

	const totalPages = Math.max(1, Math.ceil(count / 10));

	const pageInfoRef = useRef({ currentPage, totalPages });
	pageInfoRef.current = { currentPage, totalPages };

	const loadPage = useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const result = await getCommentsPageAction(postId, page, 10);
				setComments(result.comments);
				setCurrentPage(result.page);
				setCount(result.totalCount);
			} catch (error) {
				console.error("Error loading comments:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[postId],
	);

	const handleCommentSubmit = useCallback((newComment: PostComment) => {
		const { currentPage, totalPages } = pageInfoRef.current;

		if (currentPage === totalPages) {
			setComments((prev) =>
				prev.some((c) => c.id === newComment.id) ? prev : [...prev, newComment],
			);
		}

		setCount((prev) => prev + 1);
	}, []);

	const handleModerate = useCallback(
		async (commentId: string, approved: boolean) => {
			setComments((prev) =>
				prev.map((c) => (c.id === commentId ? { ...c, approved } : c)),
			);

			const result = await moderateCommentAction(commentId, approved);

			if (!result.success) {
				setComments((prev) =>
					prev.map((c) =>
						c.id === commentId ? { ...c, approved: !approved } : c,
					),
				);
				console.error(result.message);
				return;
			}

			await loadPage(pageInfoRef.current.currentPage);
		},
		[loadPage],
	);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			{trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

			<SheetContent className="flex h-full flex-col sm:max-w-2xl bg-background">
				<SheetHeader className="pt-6">
					<SheetTitle>Discussion ({count})</SheetTitle>
					<SheetDescription>Read and join the discussion.</SheetDescription>
				</SheetHeader>

				<div className="mt-6 flex flex-1 flex-col min-h-0 bg-background">
					<ScrollArea className="flex-1 min-h-0">
						{isLoading ? (
							<div className="text-center py-10">Loading comments...</div>
						) : (
							<CommentsList
								comments={comments}
								postAuthorId={postAuthorId}
								canModerate={canModerate}
								onModerate={handleModerate}
							/>
						)}
					</ScrollArea>

					<Separator className="shrink-0" />
					<CommentForm postId={postId} onCommentSubmit={handleCommentSubmit} />

					<Pagination className="shrink-0">
						<PaginationContent>
							<PaginationPrevious
								onClick={() => {
									if (currentPage > 1) {
										loadPage(currentPage - 1);
									}
								}}
								className={
									currentPage === 1 || isLoading
										? "opacity-50 pointer-events-none"
										: ""
								}
							/>
							<PaginationItem>
								Page {currentPage} of {totalPages}
							</PaginationItem>

							<PaginationNext
								onClick={() => {
									if (currentPage < totalPages) {
										loadPage(currentPage + 1);
									}
								}}
								className={
									currentPage === totalPages || isLoading
										? "opacity-50 pointer-events-none"
										: ""
								}
							/>
						</PaginationContent>
					</Pagination>
				</div>
			</SheetContent>
		</Sheet>
	);
}
