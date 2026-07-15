"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { getCurrentDbUserOrNull } from "../auth/get-current-db-user";
import { db } from "../db";
import { likes } from "../db/schema";

export async function togglePostLikeAction(postId: string) {
	const dbUser = await getCurrentDbUserOrNull();

	if (!dbUser) {
		throw new Error("User not authenticated");
	}

	const liked = await isPostLikedByUser(postId, dbUser.id);

	if (liked) {
		await unlikePost(postId, dbUser.id);
	} else {
		await likePost(postId, dbUser.id);
	}

	revalidatePath("/");

	return { success: true };
}

export async function likePost(postId: string, userId: string) {
	await db.insert(likes).values({
		postId,
		userId,
	});
}

export async function unlikePost(postId: string, userId: string) {
	await db
		.delete(likes)
		.where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
}

export async function getLikedPostIds(userId: string): Promise<Set<string>> {
	const rows = await db
		.select({
			postId: likes.postId,
		})
		.from(likes)
		.where(eq(likes.userId, userId));

	return new Set(rows.map((row) => row.postId));
}

export async function getPostLikesCount(postId: string): Promise<number> {
	const result = await db
		.select({
			count: count(),
		})
		.from(likes)
		.where(eq(likes.postId, postId));

	return result[0]?.count ?? 0;
}

export async function isPostLikedByUser(
	postId: string,
	userId: string,
): Promise<boolean> {
	const result = await db
		.select({
			id: likes.id,
		})
		.from(likes)
		.where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
		.limit(1);

	return result.length > 0;
}
