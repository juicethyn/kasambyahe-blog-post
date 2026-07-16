"use client";

import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
			<h1 className="text-family-mono text-4xl font-bold">
				Something went wrong.
			</h1>

			<p className="text-family-mono text-muted-foreground">
				An unexpected error occurred while loading this page.
			</p>

			<button
				type="button"
				onClick={() => reset()}
				className="rounded-md border px-4 py-2"
			>
				Try again
			</button>
		</div>
	);
}
