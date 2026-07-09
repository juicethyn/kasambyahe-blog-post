import PostCards from "@/components/cards/PostCard";
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

			<PostCards post={posts[0]} />

			{/* Posts List
			<div>
				{posts.map((post) => (
					<div key={post.id}>
						<h3>{post.title}</h3>
						<p>{post.content}</p>
						<p>By {post.author.displayName}</p>
						<Image
							src={post.author.imageUrl || "/default-profile.png"}
							alt={post.author.displayName}
							width={50}
							height={50}
						/>
					</div>
				))}
			</div> */}
		</div>
	);
}
