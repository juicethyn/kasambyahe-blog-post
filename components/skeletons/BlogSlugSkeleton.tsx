import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogSlugSkeleton() {
	const skeletonItems = ["1", "2", "3"];

	return (
		<section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
			{/* Top Navigation */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-9 w-9 rounded-md" />
			</div>

			{/* Cover Image */}
			<Skeleton className="aspect-video w-full rounded-xl" />

			{/* Title */}
			<div className="space-y-3 max-w-4xl">
				<Skeleton className="h-10 w-5/6" />
				<Skeleton className="h-10 w-3/5" />
			</div>

			{/* Author */}
			<div>
				<Separator />

				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-3">
						<Skeleton className="size-10 rounded-full" />

						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-24" />
						</div>
					</div>

					<div className="flex gap-4">
						<Skeleton className="h-8 w-16 rounded-full" />
						<Skeleton className="h-8 w-16 rounded-full" />
					</div>
				</div>

				<Separator />
			</div>

			{/* Blog Content */}
			<div className="space-y-4">
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-[95%]" />
				<Skeleton className="h-5 w-[90%]" />
				<Skeleton className="h-5 w-[98%]" />
				<Skeleton className="h-5 w-[82%]" />

				<div className="py-4" />

				<Skeleton className="h-5 w-[70%]" />
				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-[88%]" />
				<Skeleton className="h-5 w-[76%]" />

				<div className="py-2" />

				<Skeleton className="h-64 w-full rounded-lg" />

				<div className="py-2" />

				<Skeleton className="h-5 w-full" />
				<Skeleton className="h-5 w-[94%]" />
				<Skeleton className="h-5 w-[81%]" />
			</div>

			<Separator />

			{/* Discussion */}
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
		</section>
	);
}
