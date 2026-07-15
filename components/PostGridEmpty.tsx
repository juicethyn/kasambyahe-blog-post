import { FileQuestion } from "lucide-react";

export default function PostGridEmpty() {
	return (
		<div className="flex flex-col items-center justify-center text-center py-16 lg:py-24 gap-3">
			<div className="rounded-full bg-muted p-4">
				<FileQuestion className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold text-foreground">No posts yet</h3>
			<p className="text-sm text-muted-foreground max-w-sm">
				Be the first to share a route guide, travel tip, or experience with the
				community.
			</p>
		</div>
	);
}
