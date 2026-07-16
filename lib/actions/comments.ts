"use server";

import { revalidatePath } from "next/cache";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
import {
	createComment,
	getCommentCountByPostId,
	getCommentsByPostId,
	getCommentWithPostInfo,
	updateCommentApproval,
} from "@/lib/db/queries/comments";
import { getPostById } from "@/lib/db/queries/posts";
import {
	addCommentSchema,
	type CommentFormState,
} from "@/lib/validations/comment";

export default async function addCommentAction(
	_prevState: CommentFormState,
	formData: FormData,
): Promise<CommentFormState> {
	try {
		const validatedFields = addCommentSchema.safeParse({
			postId: String(formData.get("postId") ?? ""),
			content: String(formData.get("content") ?? ""),
		});

		if (!validatedFields.success) {
			return {
				success: false,
				message: "Invalid form data.",
				errors: validatedFields.error.flatten().fieldErrors as Record<
					string,
					string
				>,
			};
		}

		const dbUser = await getCurrentDbUserOrNull();

		if (!dbUser) {
			return {
				success: false,
				message: "You must be logged in to add a comment.",
			};
		}

		const { postId, content } = validatedFields.data;

		const post = await getPostById(postId);

		if (!post) {
			return {
				success: false,
				message: "The post you are trying to comment on does not exist.",
			};
		}

		const newComment = await createComment({
			postId,
			authorId: dbUser.id,
			content,
		});

		revalidatePath(`/`);
		revalidatePath(`/blogs/${post.slug}`);

		return {
			success: true,
			message: "Comment added successfully.",
			errors: {},
			comment: {
				id: newComment.id,
				content: newComment.content,
				approved: newComment.approved,
				createdAt: newComment.createdAt,
				author: {
					id: dbUser.id,
					displayName: dbUser.displayName,
					username: dbUser.clerkUsername,
					imageUrl: dbUser.imageUrl,
				},
			},
		};
	} catch (error) {
		console.error(error);
	}

	return {
		success: false,
		message: "An error occurred while adding the comment.",
	};
}

export async function getCommentsPageAction(
	postId: string,
	page: number,
	pageSize = 10,
) {
	const [dbUser, post] = await Promise.all([
		getCurrentDbUserOrNull(),
		getPostById(postId),
	]);

	const isOwner = Boolean(dbUser && post && dbUser.id === post.authorId);

	const [comments, totalCount] = await Promise.all([
		getCommentsByPostId(postId, page, pageSize, { includeHidden: isOwner }),
		getCommentCountByPostId(postId, { includeHidden: isOwner }),
	]);

	return {
		comments,
		totalCount,
		page,
		pageSize,
		totalPages: Math.ceil(totalCount / pageSize),
	};
}

export async function moderateCommentAction(
	commentId: string,
	approved: boolean,
): Promise<{ success: boolean; message?: string }> {
	try {
		const dbUser = await getCurrentDbUserOrNull();

		if (!dbUser) {
			return { success: false, message: "You must be logged in to do this." };
		}

		const commentInfo = await getCommentWithPostInfo(commentId);

		if (!commentInfo) {
			return { success: false, message: "Comment not found." };
		}

		if (commentInfo.postAuthorId !== dbUser.id) {
			return {
				success: false,
				message: "You can only moderate comments on your own posts.",
			};
		}

		await updateCommentApproval(commentId, approved);

		revalidatePath(`/`);
		revalidatePath(`/blogs/${commentInfo.postSlug}`);

		return { success: true };
	} catch (error) {
		console.error(error);
	}

	return {
		success: false,
		message: "An error occurred while updating the comment.",
	};
}
