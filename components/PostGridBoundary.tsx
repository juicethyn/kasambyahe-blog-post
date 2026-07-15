"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import PostGridSkeleton from "@/components/skeletons/PostGridSkeleton";

export default function PostGridBoundary({
	children,
}: {
	children: ReactNode;
}) {
	const searchParams = useSearchParams();
	const view = searchParams.get("view") === "1" ? "1" : "2";

	return (
		<Suspense key={view} fallback={<PostGridSkeleton view={view} />}>
			{children}
		</Suspense>
	);
}
