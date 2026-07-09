import { Suspense } from "react";
import PostCards from "@/components/cards/PostCard";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import { getFeedPosts } from "@/lib/db/queries/posts";

export default async function Home() {
	const posts = await getFeedPosts();

	return (
		<div>
			{/* Header Message */}
			<div className="text-center my-8 lg:my-16">
				<h1 className="text-3xl lg:text-4xl text-primary font-bold font-merriweather">
					KasamByahe
				</h1>
				<h2 className="text-base lg:text-xl text-foreground mt-1">
					Discover route guides, travel tips, and community-shared posts to help
					you navigate <br className="hidden lg:block" /> destinations with more
					confidence.
				</h2>
			</div>
			{/* Filtering and Sorting Options Turn - Make it a Client Component because it uses Button*/}
			<div className="flex justify-between items-center mb-4 font-merriweather font-medium">
				<div className="flex gap-4">
					<p>Latest</p>
					<p>Popular</p>
					<p>Old</p>
				</div>
				<div>
					<p>Filtering Here</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{posts.map((post) => (
					<Suspense fallback={<PostCardSkeleton />} key={post.id}>
						<PostCards post={post} />
					</Suspense>
				))}
			</div>
		</div>
	);
}
