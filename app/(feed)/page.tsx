import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Suspense } from "react";
import PostGrid from "@/components/PostGrid";
import PostGridBoundary from "@/components/PostGridBoundary";
import PostGridControls from "@/components/PostGridControls";
import PostGridControlsSkeleton from "@/components/skeletons/PostGridControlsSkeleton";
import PostGridSkeleton from "@/components/skeletons/PostGridSkeleton";

interface HomeProps {
	searchParams: Promise<{ sort?: string; view?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	return (
		<div>
			{/* Header Message */}
			<div className="text-center my-8 lg:my-16">
				<h1 className="text-3xl lg:text-4xl text-primary font-bold font-merriweather">
					KasamByahe
				</h1>
				<h2 className="text-base lg:text-xl text-foreground mt-1">
					Discover route guides, travel tips, and community-shared posts to help
					you navigate <br className="hidden lg:block" /> destinations with more
					confidence.
				</h2>
			</div>

			<Suspense fallback={<PostGridControlsSkeleton />}>
				<PostGridControls />
			</Suspense>

			<Suspense fallback={<PostGridSkeleton view="2" />}>
				<PostGridBoundary>
					<PostGrid searchParams={searchParams} />
				</PostGridBoundary>
			</Suspense>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Home",
};
