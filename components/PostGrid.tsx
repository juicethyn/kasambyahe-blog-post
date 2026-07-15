import PostCards from "@/components/cards/PostCard";
import { getFeedPosts } from "@/lib/db/queries/posts";
import { parseSort, parseView } from "@/lib/types/post";

interface PostGridProps {
	searchParams: Promise<{ sort?: string; view?: string }>;
}

export default async function PostGrid({ searchParams }: PostGridProps) {
	const { sort, view } = await searchParams;

	const activeSort = parseSort(sort);
	const activeView = parseView(view);

	const posts = await getFeedPosts(activeSort);

	return (
		<div
			className={
				activeView === "1"
					? "grid grid-cols-1 gap-4"
					: "grid grid-cols-1 lg:grid-cols-2 gap-4"
			}
		>
			{posts.map((post) => (
				<PostCards key={post.id} post={post} />
			))}
		</div>
	);
}
