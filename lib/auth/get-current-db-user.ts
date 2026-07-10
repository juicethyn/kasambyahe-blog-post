import { syncUser } from "@/lib/auth/sync-user";

export async function getCurrentDbUserOrNull() {
	return await syncUser();
}

export async function getCurrentDbUser() {
	const user = await getCurrentDbUserOrNull();

	if (!user) {
		return null;
	}

	return user;
}
