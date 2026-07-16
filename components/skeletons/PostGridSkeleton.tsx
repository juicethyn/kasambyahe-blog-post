import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import type { ViewOption } from "@/lib/types/post";

interface PostGridSkeletonProps {
	view: ViewOption;
}

export default function PostGridSkeleton({ view }: PostGridSkeletonProps) {
	const count = view === "1" ? 2 : 4;

	const skeletonIds = Array.from({ length: count }, (_, i) => i + 1);

	return (
		<div
			className={
				view === "1"
					? "grid grid-cols-1 gap-4"
					: "grid grid-cols-1 lg:grid-cols-2 gap-4"
			}
		>
			{skeletonIds.map((id) => (
				<PostCardSkeleton key={id} />
			))}
		</div>
	);
}
