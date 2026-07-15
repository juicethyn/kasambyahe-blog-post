import { Skeleton } from "@/components/ui/skeleton";

export default function PostGridControlsSkeleton() {
	return (
		<div className="mb-4 flex items-center justify-between">
			{/* Sort Options */}
			<div className="flex gap-5">
				<Skeleton className="h-6 w-12 rounded-md" />
				<Skeleton className="h-6 w-16 rounded-md" />
				<Skeleton className="h-6 w-10 rounded-md" />
			</div>

			{/* View Toggle */}
			<div className="hidden items-center gap-2 rounded-full bg-muted/60 p-1 sm:flex">
				<Skeleton className="size-8 rounded-full" />
				<Skeleton className="size-8 rounded-full" />
			</div>
		</div>
	);
}
