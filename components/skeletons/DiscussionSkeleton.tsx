import { Skeleton } from "@/components/ui/skeleton";

export default function DiscussionSkeleton() {
	const skeletonItems = ["1", "2", "3"];

	return (
		<div className="space-y-6">
			<Skeleton className="h-7 w-40" />

			{Array.from({ length: 3 }).map((_, i) => (
				<div key={skeletonItems[i]} className="flex gap-3">
					<Skeleton className="size-10 rounded-full" />

					<div className="flex-1 space-y-2">
						<div className="flex gap-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-20" />
						</div>

						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-[90%]" />

						<div className="flex gap-4 pt-2">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-20" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
