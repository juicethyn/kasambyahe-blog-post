import { redirect } from "next/navigation";
import { Suspense } from "react";
import PostGridBoundary from "@/components/PostGridBoundary";
import PostGridControls from "@/components/PostGridControls";
import PostGridControlsSkeleton from "@/components/skeletons/PostGridControlsSkeleton";
import PostGridSkeleton from "@/components/skeletons/PostGridSkeleton";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
import ProfileHeader from "./ProfileHeader";
import ProfilePostGrid from "./ProfilePostGrid";

interface ProfilePageProps {
	searchParams: Promise<{ sort?: string; view?: string }>;
}
export default async function ProfilePage({ searchParams }: ProfilePageProps) {
	const dbUser = await getCurrentDbUserOrNull();

	if (!dbUser) {
		redirect("/");
	}

	return (
		<div>
			<ProfileHeader user={dbUser} />

			<Suspense fallback={<PostGridControlsSkeleton />}>
				<PostGridControls />
			</Suspense>

			<Suspense fallback={<PostGridSkeleton view="2" />}>
				<PostGridBoundary>
					<ProfilePostGrid authorId={dbUser.id} searchParams={searchParams} />
				</PostGridBoundary>
			</Suspense>
		</div>
	);
}
