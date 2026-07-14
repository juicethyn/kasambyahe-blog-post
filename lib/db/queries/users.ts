import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema";

export async function getUserByClerkUserId(clerkUserId: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.clerkUserId, clerkUserId))
		.limit(1);
	return user ?? null;
}

interface CreateUserParams {
	clerkUserId: string;
	clerkUsername: string;
	displayName: string;
	imageUrl?: string | null;
	bio?: string | null;
	role?: "user" | "admin";
}

export async function createUser(input: CreateUserParams) {
	const [newUser] = await db
		.insert(users)
		.values({
			clerkUserId: input.clerkUserId,
			clerkUsername: input.clerkUsername,
			displayName: input.displayName,
			imageUrl: input.imageUrl,
			bio: input.bio,
			role: input.role,
		})
		.returning();
	return newUser;
}

export async function updateUserByClerkUserId(input: CreateUserParams) {
	const [user] = await db
		.update(users)
		.set({
			clerkUsername: input.clerkUsername,
			displayName: input.displayName,
			imageUrl: input.imageUrl,
			bio: input.bio,
			role: input.role,
		})
		.where(eq(users.clerkUserId, input.clerkUserId))
		.returning();
	return user;
}

export async function deleteUserByClerkUserId(clerkUserId: string) {
	await db.delete(users).where(eq(users.clerkUserId, clerkUserId));
}
