"use cache";

import { Suspense } from "react";
import PostCards from "@/components/cards/PostCard";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import { getFeedPosts } from "@/lib/db/queries/posts";

export default async function PostGrid() {
	const posts = await getFeedPosts();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{posts.map((post) => (
				<Suspense fallback={<PostCardSkeleton />} key={post.id}>
					<PostCards post={post} />
				</Suspense>
			))}
		</div>
	);
}
