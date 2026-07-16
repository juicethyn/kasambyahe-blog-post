import type { FeedPost } from "@/lib/types/post";
import PostCard from "./cards/PostCard";
import PostGridEmpty from "./PostGridEmpty";

interface PostGridViewProps {
	posts: FeedPost[];
	view: "1" | "2";
}

export function PostGridView({ posts, view }: PostGridViewProps) {
	if (posts.length === 0) {
		return <PostGridEmpty />;
	}

	return (
		<div
			className={
				view === "1"
					? "grid grid-cols-1 gap-4"
					: "grid grid-cols-1 lg:grid-cols-2 gap-4"
			}
		>
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
