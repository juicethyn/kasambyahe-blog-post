import type { PostComment } from "@/lib/types/comment";
import CommentItem from "./CommentItem";

interface CommentProps {
	comments: PostComment[];
	postAuthorId: string;
}

export default function CommentsList({ comments, postAuthorId }: CommentProps) {
	return (
		<div className="space-y-4">
			{comments.length === 0 ? (
				<p className="text-muted-foreground">No comments yet.</p>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => {
						const _isPostAuthor = comment.author.id === postAuthorId;

						return (
							<CommentItem
								key={comment.id}
								comment={comment}
								postAuthorId={postAuthorId}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
