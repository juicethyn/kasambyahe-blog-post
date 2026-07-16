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
				<p className="text-muted-foreground px-3">No comments yet.</p>
			) : (
				<div className="space-y-4 px-3">
					{comments.map((comment) => {
						const _isPostAuthor = comment.author.id === postAuthorId;

						return (
							<div key={comment.id}>
								<CommentItem comment={comment} postAuthorId={postAuthorId} />
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
