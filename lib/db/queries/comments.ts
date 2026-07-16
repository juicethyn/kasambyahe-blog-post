import { asc, count, eq } from "drizzle-orm";
import type { PostComment } from "@/lib/types/comment";
import { db } from "../index";
import { comments, posts, users } from "../schema";

export async function getCommentsByPostId(
	postId: string,
	_page = 1,
	_pageSize = 10,
	options?: { includeHidden?: boolean },
): Promise<PostComment[]> {
	const offset = (_page - 1) * _pageSize;

	const rows = await db
		.select({
			id: comments.id,
			content: comments.content,
			approved: comments.approved,
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
		.where(
			options?.includeHidden
				? eq(comments.postId, postId)
				: eq(comments.approved, true),
		)
		.orderBy(asc(comments.createdAt))
		.offset(offset)
		.limit(_pageSize);

	return rows.map((row) => ({
		id: row.id,
		content: row.content,
		approved: row.approved,
		createdAt: row.createdAt,
		author: {
			id: row.author.id,
			displayName: row.author.displayName,
			username: row.author.username,
			imageUrl: row.author.imageUrl,
		},
	}));
}

export async function getCommentCountByPostId(
	postId: string,
	options?: { includeHidden?: boolean },
): Promise<number> {
	const [result] = await db
		.select({
			count: count(),
		})
		.from(comments)
		.where(
			options?.includeHidden
				? eq(comments.postId, postId)
				: eq(comments.approved, true),
		)
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

export async function getCommentWithPostAuthorId(
	commentId: string,
): Promise<{ id: string; postAuthorId: string } | null> {
	const [row] = await db
		.select({
			id: comments.id,
			postAuthorId: posts.authorId,
		})
		.from(comments)
		.innerJoin(posts, eq(comments.postId, posts.id))
		.where(eq(comments.id, commentId));

	return row ?? null;
}

export async function getCommentWithPostInfo(commentId: string): Promise<{
	id: string;
	postId: string;
	postAuthorId: string;
	postSlug: string;
} | null> {
	const [row] = await db
		.select({
			id: comments.id,
			postId: comments.postId,
			postAuthorId: posts.authorId,
			postSlug: posts.slug,
		})
		.from(comments)
		.innerJoin(posts, eq(comments.postId, posts.id))
		.where(eq(comments.id, commentId));

	return row ?? null;
}

export async function updateCommentApproval(
	commentId: string,
	approved: boolean,
) {
	await db.update(comments).set({ approved }).where(eq(comments.id, commentId));
}

export async function deleteCommentById(commentId: string) {
	await db.delete(comments).where(eq(comments.id, commentId));
}
