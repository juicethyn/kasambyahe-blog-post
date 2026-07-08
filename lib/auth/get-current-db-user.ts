import { syncUser } from "@/lib/auth/sync-user";

export async function getCurrentDbUser() {
	const user = await syncUser();

	if (!user) {
		throw new Error("Unauthorized.");
	}

	return user;
}
