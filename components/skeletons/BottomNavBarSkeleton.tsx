import { Skeleton } from "@/components/ui/skeleton";

export default function BottomNavBarSkeleton() {
	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur lg:hidden">
			<div className="grid h-16 grid-cols-4">
				{["home", "explore", "write", "profile"].map((id) => (
					<div
						key={id}
						className="flex flex-col items-center justify-center gap-2"
					>
						<Skeleton className="size-5 rounded-md" />
						<Skeleton className="h-3 w-10 rounded-full" />
					</div>
				))}
			</div>
		</nav>
	);
}
