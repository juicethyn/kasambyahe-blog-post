"use client";

import { useCallback, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { getCommentsPageAction } from "@/lib/actions/comments";
import type { PostComment } from "@/lib/types/comment";
import { Button } from "../ui/button";
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
}

export default function CommentsSheet({
	postId,
	postAuthorId,
	commentCount,
	initialComments,
}: CommentsSheetProps) {
	const [comments, setComments] = useState<PostComment[]>(initialComments);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(Math.ceil(commentCount / 10));
	const [isLoading, setIsLoading] = useState(false);
	const [count, setCount] = useState(commentCount);

	const loadPage = useCallback(
		async (page: number) => {
			setIsLoading(true);

			try {
				const result = await getCommentsPageAction(postId, page, 10);
				setComments(result.comments);
				setCurrentPage(result.page);
				setTotalPages(result.totalPages);
				setCount(result.totalCount);
			} catch (error) {
				console.error("Error loading comments:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[postId],
	);

	const handleCommentSubmit = useCallback(
		(newComment: PostComment) => {
			console.log("Adding comment:", newComment.id);
			if (currentPage === totalPages) {
				setComments((prev) => {
					if (prev.some((comment) => comment.id === newComment.id)) {
						return prev;
					}
					return [...prev, newComment];
				});
			}

			setCount((prev) => {
				const next = prev + 1;
				setTotalPages(Math.ceil(next / 10));
				return next;
			});
		},
		[currentPage, totalPages],
	);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" className="text-center">
					View all {count} discussions →
				</Button>
			</SheetTrigger>

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
							<CommentsList comments={comments} postAuthorId={postAuthorId} />
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
