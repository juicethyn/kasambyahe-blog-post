import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
	return (
		<Card className="w-full overflow-hidden bg-background pt-0 text-foreground">
			<div className="relative h-56 w-full">
				<Skeleton className="h-full w-full" />
			</div>

			<CardHeader className="space-y-3">
				<Skeleton className="h-8 w-3/4" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-11/12" />
					<Skeleton className="h-4 w-2/3" />
				</div>
				<Skeleton className="mt-2 h-px w-full" />
			</CardHeader>

			<CardFooter className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Skeleton className="size-12.5 rounded-full" />

					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-3 w-20" />
					</div>
				</div>

				<div className="flex gap-4">
					<Skeleton className="size-6 rounded-md" />
					<Skeleton className="size-6 rounded-md" />
					<Skeleton className="size-6 rounded-md" />
					<Skeleton className="size-6 rounded-md" />
				</div>
			</CardFooter>
		</Card>
	);
}
