import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Suspense } from "react";
import ProfilePage from "@/components/profile/ProfilePage";

interface ProfilePageProps {
	searchParams: Promise<{ sort?: string; view?: string }>;
}

export default async function Profile({ searchParams }: ProfilePageProps) {
	return (
		<Suspense>
			<ProfilePage searchParams={searchParams} />
		</Suspense>
	);
}

export const metadata: Metadata = {
	title: "Profile",
};
