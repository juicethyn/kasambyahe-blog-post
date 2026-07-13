import { asc, count, eq } from "drizzle-orm";
import type { PostComment } from "@/lib/types/comment";
import { db } from "../index";
import { comments, users } from "../schema";

export async function getCommentsByPostId(
	postId: string,
	_page = 1,
	_pageSize = 10,
): Promise<PostComment[]> {
	const offset = (_page - 1) * _pageSize;

	const rows = await db
		.select({
			id: comments.id,
			content: comments.content,
			createdAt: comments.createdAt,
			author: {
				id: users.id,
				displayName: users.displayName,
				username: users.clerkUsername,
				imageUrl: users.imageUrl,
			},
		})
		.from(comments)
		.innerJoin(users, eq(comments.authorId, users.id))
		.where(eq(comments.postId, postId))
		.orderBy(asc(comments.createdAt))
		.offset(offset)
		.limit(_pageSize);

	return rows.map((row) => ({
		id: row.id,
		content: row.content,
		createdAt: row.createdAt,
		author: {
			id: row.author.id,
			displayName: row.author.displayName,
			username: row.author.username,
			imageUrl: row.author.imageUrl,
		},
	}));
}

export async function getCommentCountByPostId(postId: string): Promise<number> {
	const [result] = await db
		.select({
			count: count(),
		})
		.from(comments)
		.where(eq(comments.postId, postId))
		.execute();

	return result?.count ?? 0;
}

export async function createComment({
	postId,
	authorId,
	content,
}: {
	postId: string;
	authorId: string;
	content: string;
}) {
	const [comment] = await db
		.insert(comments)
		.values({
			postId,
			authorId,
			content,
		})
		.returning();

	return comment;
}
