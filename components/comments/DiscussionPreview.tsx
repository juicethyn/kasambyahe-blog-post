import type { PostComment } from "@/lib/types/comment";
import CommentItem from "./CommentItem";

interface DiscussionPreviewProps {
	comments: PostComment[];
	postAuthorId: string;
}

export default function DiscussionPreview({
	comments,
	postAuthorId,
}: DiscussionPreviewProps) {
	const commentCount = comments.length;
	const previewComments = comments.slice(0, 3);

	if (commentCount === 0) {
		return (
			<div className="rounded-xl border border-dashed py-10 text-center">
				<h3 className="font-medium">No discussions yet</h3>

				<p className="mt-2 text-sm text-muted-foreground">
					Be the first traveler to share your experience about this route.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{previewComments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					postAuthorId={postAuthorId}
					canModerate={false}
					onModerate={() => {}}
				/>
			))}
		</div>
	);
}
