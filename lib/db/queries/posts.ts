"use cache";

import { desc, eq } from "drizzle-orm";
import type { FeedPost, SortOption } from "@/lib/types/post";
import { db } from "../index";
import { posts, users } from "../schema";

export async function getFeedPosts(sort: SortOption): Promise<FeedPost[]> {
	const query = db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			coverImageUrl: posts.coverImageUrl,
			coverImageKey: posts.coverImageKey,
			excerpt: posts.excerpt,
			content: posts.content,
			createdAt: posts.createdAt,
			author: {
				id: users.id,
				username: users.clerkUsername,
				displayName: users.displayName,
				imageUrl: users.imageUrl,
			},
		})
		.from(posts)
		.innerJoin(users, eq(posts.authorId, users.id));

	switch (sort) {
		case "latest":
			query.orderBy(desc(posts.createdAt));
			break;
		case "old":
			query.orderBy(posts.createdAt);
			break;
		case "popular":
			query.orderBy(desc(posts.createdAt));
			break;
	}

	const rows = await query;

	return rows.map((row) => ({
		id: row.id,
		title: row.title,
		coverImageUrl: row.coverImageUrl,
		coverImageKey: row.coverImageKey,
		slug: row.slug,
		excerpt: row.excerpt,
		content: row.content,
		createdAt: row.createdAt,
		author: {
			id: row.author.id,
			username: row.author.username,
			displayName: row.author.displayName,
			imageUrl: row.author.imageUrl,
		},
	}));
}

export async function getPostBySlug(slug: string): Promise<FeedPost | null> {
	const [row] = await db
		.select({
			id: posts.id,
			title: posts.title,
			slug: posts.slug,
			coverImageUrl: posts.coverImageUrl,
			coverImageKey: posts.coverImageKey,
			excerpt: posts.excerpt,
			content: posts.content,
			createdAt: posts.createdAt,
			author: {
				id: users.id,
				username: users.clerkUsername,
				displayName: users.displayName,
				imageUrl: users.imageUrl,
			},
		})
		.from(posts)
		.innerJoin(users, eq(posts.authorId, users.id))
		.where(eq(posts.slug, slug));

	if (!row) {
		return null;
	}

	return {
		id: row.id,
		title: row.title,
		coverImageUrl: row.coverImageUrl,
		coverImageKey: row.coverImageKey,
		slug: row.slug,
		excerpt: row.excerpt,
		content: row.content,
		createdAt: row.createdAt,
		author: {
			id: row.author.id,
			username: row.author.username,
			displayName: row.author.displayName,
			imageUrl: row.author.imageUrl,
		},
	};
}

export async function getPostById(postId: string) {
	const [row] = await db
		.select({
			id: posts.id,
			authorId: posts.authorId,
			slug: posts.slug,
			coverImageUrl: posts.coverImageUrl,
			coverImageKey: posts.coverImageKey,
		})
		.from(posts)
		.where(eq(posts.id, postId))
		.limit(1);

	return row ?? null;
}
