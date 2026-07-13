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
			<div className="mb-2 flex items-center gap-3">
				<Image
					src={comment.author.imageUrl || "https://avatar.vercel.sh/shadcn1"}
					height={100}
					width={100}
					alt={comment.author.displayName}
					className="h-10 w-10 rounded-full object-cover"
				/>

				<div className="flex items-center gap-2">
					<p className="font-medium">{comment.author.displayName}</p>
					<p className="text-sm text-muted-foreground">
						• {formatRelativeDate(comment.createdAt)}
					</p>
				</div>
				{isPostAuthor && <Badge variant="secondary">Author</Badge>}
			</div>
			<p className="text-sm leading-7">{comment.content}</p>
			<div className="space-y-3" />
			<div className="flex items-center gap-4 text-sm text-muted-foreground">
				<p>Likes</p>
				<p className="hover:underline cursor-pointer">Show Replies</p>
				<p className="hover:underline cursor-pointer">Reply</p>
			</div>
		</div>
	);
}
