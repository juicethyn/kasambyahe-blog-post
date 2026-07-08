import { getCurrentDbUser } from "@/lib/auth/get-current-db-user";

export default async function ProfilePage() {
	const user = await getCurrentDbUser();

	return (
		<div>
			<h1>{user.displayName}</h1>
			<h1>{user.displayName}</h1>
		</div>
	);
}
