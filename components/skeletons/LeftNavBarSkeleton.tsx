import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LeftNavBarSkeletonProps {
	isOpen: boolean;
}

export default function LeftNavBarSkeleton({
	isOpen,
}: LeftNavBarSkeletonProps) {
	return (
		<aside
			className={cn(
				"hidden h-full shrink-0 transition-all duration-300 ease-in-out lg:block",
				isOpen
					? "w-64 border-r border-border opacity-100"
					: "w-0 overflow-hidden border-r border-border opacity-0",
			)}
		>
			<div className="flex h-full flex-col gap-2 px-4 py-6">
				{["home", "explore", "write", "profile", "saved"].map((id) => (
					<div key={id} className="flex items-center gap-4 rounded-md p-2">
						<Skeleton className="size-6 rounded-md" />

						<Skeleton className="h-4 flex-1 max-w-28" />
					</div>
				))}
			</div>
		</aside>
	);
}
