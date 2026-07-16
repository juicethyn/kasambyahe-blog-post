import type { PostComment } from "@/lib/types/comment";
import { Button } from "../ui/button";
import CommentsSheet from "./CommentsSheet";
import DiscussionPreview from "./DiscussionPreview";

interface DiscussionSectionProps {
	postId: string;
	postAuthorId: string;
	commentCount: number;
	comments: PostComment[];
	canModerate: boolean;
}

export default function DiscussionSection({
	postId,
	postAuthorId,
	commentCount,
	comments,
	canModerate,
}: DiscussionSectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="font-merriweather text-2xl font-semibold">
				Discussion ({commentCount})
			</h2>

			<p className="text-sm text-muted-foreground">
				See what fellow travelers are saying about this guide.
			</p>
			<DiscussionPreview comments={comments} postAuthorId={postAuthorId} />

			<CommentsSheet
				key={postId}
				postId={postId}
				postAuthorId={postAuthorId}
				commentCount={commentCount}
				initialComments={comments}
				trigger={
					<Button variant="ghost" className="text-center">
						{" "}
						View all {commentCount} discussions →{" "}
					</Button>
				}
				canModerate={canModerate}
			/>
		</section>
	);
}
