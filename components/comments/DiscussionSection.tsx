import type { PostComment } from "@/lib/types/comment";
import CommentsSheet from "./CommentsSheet";
import DiscussionPreview from "./DiscussionPreview";

interface DiscussionSectionProps {
	postId: string;
	postAuthorId: string;
	commentCount: number;
	comments: PostComment[];
}

export default function DiscussionSection({
	postId,
	postAuthorId,
	commentCount,
	comments,
}: DiscussionSectionProps) {
	return (
		<section className="space-y-8">
			<h2 className="font-merriweather text-2xl font-semibold">
				Discussion ({commentCount})
			</h2>

			<p className="text-sm text-muted-foreground">
				See what fellow travelers are saying about this guide.
			</p>
			<DiscussionPreview comments={comments} postAuthorId={postAuthorId} />

			<CommentsSheet
				postId={postId}
				postAuthorId={postAuthorId}
				commentCount={commentCount}
				initialComments={comments}
			/>
		</section>
	);
}
