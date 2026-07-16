"use server";

import { and, count, desc, eq, inArray } from "drizzle-orm";
import { getPostLikesCount, isPostLikedByUser } from "@/lib/actions/post-likes";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
import type { FeedPost, SortOption } from "@/lib/types/post";
import { db } from "../index";
import { comments, likes, posts, users } from "../schema";

export async function getFeedPosts(
	sort: SortOption,
	options?: { authorId?: string },
): Promise<FeedPost[]> {
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

	if (options?.authorId) {
		query.where(eq(posts.authorId, options.authorId));
	}

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

	const postIds = rows.map((row) => row.id);

	const allLikes = await db
		.select({
			postId: likes.postId,
			userId: likes.userId,
		})
		.from(likes)
		.where(inArray(likes.postId, postIds));

	const allComments = await db
		.select({
			postId: comments.postId,
		})
		.from(comments)
		.where(and(inArray(comments.postId, postIds), eq(comments.approved, true)));

	const dbUser = await getCurrentDbUserOrNull();

	const likesByPost = new Map<
		string,
		{
			count: number;
			likedByCurrentUser: boolean;
		}
	>();

	for (const like of allLikes) {
		const current = likesByPost.get(like.postId) ?? {
			count: 0,
			likedByCurrentUser: false,
		};

		current.count++;

		if (dbUser && like.userId === dbUser.id) {
			current.likedByCurrentUser = true;
		}

		likesByPost.set(like.postId, current);
	}

	const commentCountMap = new Map<string, number>();

	for (const comment of allComments) {
		commentCountMap.set(
			comment.postId,
			(commentCountMap.get(comment.postId) ?? 0) + 1,
		);
	}

	const feed = rows.map((row) => {
		const metadata = likesByPost.get(row.id);

		return {
			id: row.id,
			title: row.title,
			slug: row.slug,
			coverImageUrl: row.coverImageUrl,
			coverImageKey: row.coverImageKey,
			excerpt: row.excerpt,
			content: row.content,
			createdAt: row.createdAt,

			author: {
				id: row.author.id,
				username: row.author.username,
				displayName: row.author.displayName,
				imageUrl: row.author.imageUrl,
			},

			likesCount: metadata?.count ?? 0,
			likedByCurrentUser: metadata?.likedByCurrentUser ?? false,
			commentCount: commentCountMap.get(row.id) ?? 0,
		};
	});

	if (sort === "popular") {
		feed.sort((a, b) => {
			if (b.likesCount !== a.likesCount) {
				return b.likesCount - a.likesCount;
			}

			return b.createdAt.getTime() - a.createdAt.getTime();
		});
	}

	return feed;
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

	const dbUser = await getCurrentDbUserOrNull();

	const [likesCount, commentResult, likedByCurrentUser] = await Promise.all([
		getPostLikesCount(row.id),

		db
			.select({
				count: count(),
			})
			.from(comments)
			.where(eq(comments.postId, row.id)),

		dbUser ? isPostLikedByUser(row.id, dbUser.id) : Promise.resolve(false),
	]);

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
		likesCount,
		likedByCurrentUser,
		commentCount: commentResult[0]?.count ?? 0,
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
