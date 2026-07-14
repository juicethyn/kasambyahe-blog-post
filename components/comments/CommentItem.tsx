import Image from "next/image";
import type { PostComment } from "@/lib/types/comment";
import { formatRelativeDate } from "@/lib/utils/format-relative-date";
import { Badge } from "../ui/badge";

interface CommentItemProps {
	comment: PostComment;
	postAuthorId: string;
}

export default function CommentItem({
	comment,
	postAuthorId,
}: CommentItemProps) {
	const isPostAuthor = comment.author.id === postAuthorId;

	return (
		<div key={comment.id} className="border-b py-5">
			<div className="flex gap-3">
				<Image
					src={comment.author.imageUrl || "https://avatar.vercel.sh/shadcn1"}
					width={40}
					height={40}
					alt={comment.author.displayName}
					className="size-10 rounded-full object-cover shrink-0"
				/>

				<div className="min-w-0 flex-1">
					{/* Header */}
					<div className="flex flex-wrap items-center gap-2">
						<p className="font-semibold">{comment.author.displayName}</p>

						{isPostAuthor && <Badge variant="secondary">Author</Badge>}

						<span className="text-muted-foreground">•</span>

						<p className="text-sm text-muted-foreground">
							{formatRelativeDate(comment.createdAt)}
						</p>
					</div>

					{/* Comment */}
					<p className="mt-2 whitespace-pre-wrap wrap-break-words leading-7">
						{comment.content}
					</p>

					{/* Actions */}
					<div className="mt-3 flex items-center gap-5 text-sm text-muted-foreground">
						<button
							type="button"
							className="hover:text-foreground transition-colors"
						>
							Like
						</button>

						<button
							type="button"
							className="hover:text-foreground transition-colors"
						>
							Reply
						</button>

						<button
							type="button"
							className="hover:text-foreground transition-colors"
						>
							Show replies
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
