import { currentUser } from "@clerk/nextjs/server";
import { createUser, getUserByClerkUserId } from "@/lib/db/queries/users";

function fallbackUsernameFromEmail(email: string): string {
	if (!email) return `user_${crypto.randomUUID().slice(0, 8)}`;
	return email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
}

export async function syncUser() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		throw new Error("No authenticated user found.");
	}

	const existingUser = await getUserByClerkUserId(clerkUser.id);

	if (existingUser) {
		return existingUser;
	}

	const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
	const username =
		clerkUser.username ??
		fallbackUsernameFromEmail(email ?? `user_${clerkUser.id.slice(-6)}`);

	const displayName =
		[clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
		username;

	const newUser = await createUser({
		clerkUserId: clerkUser.id,
		clerkUsername: username,
		displayName: displayName,
		imageUrl: clerkUser.imageUrl ?? null,
		role: "user",
	});

	return newUser;
}
