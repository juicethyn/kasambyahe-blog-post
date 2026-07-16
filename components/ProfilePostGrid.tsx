import { getFeedPosts } from "@/lib/db/queries/posts";
import { parseSort, parseView } from "@/lib/types/post";
import { PostGridView } from "./PostGridView";

interface ProfilePostGridProps {
	authorId: string;
	searchParams: Promise<{ sort?: string; view?: string }>;
}

export default async function ProfilePostGrid({
	authorId,
	searchParams,
}: ProfilePostGridProps) {
	const { sort, view } = await searchParams;
	const activeSort = parseSort(sort);
	const activeView = parseView(view);

	const posts = await getFeedPosts(activeSort, { authorId });

	return <PostGridView posts={posts} view={activeView} />;
}
