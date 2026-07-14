import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkUserId } from "@/lib/db/queries/users";

export async function getCurrentDbUserOrNull() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		return null;
	}

	return await getUserByClerkUserId(clerkUser.id);
}
