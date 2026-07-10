"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { slugify } from "@/lib/utils/slug";
import {
	createPostSchema,
	type PostFormState,
	updatePostSchema,
} from "@/lib/validations/post";
import { getCurrentDbUser } from "../auth/get-current-db-user";

export async function createPostAction(
	_prevState: PostFormState,
	formData: FormData,
): Promise<PostFormState> {
	const { userId: clerkUserId } = await auth();
	const rawContent = formData.get("content");

	if (!clerkUserId) {
		return {
			success: false,
			message: "You must be logged in to create a post.",
		};
	}

	let parsedContent: unknown;

	try {
		parsedContent = JSON.parse(String(rawContent));
	} catch {
		return {
			success: false,
			message: "Post content is invalid.",
		};
	}

	const rawValues = {
		title: String(formData.get("title") ?? ""),
		excerpt: String(formData.get("excerpt") ?? ""),
		coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
		content: parsedContent,
	};

	const validatedFields = createPostSchema.safeParse(rawValues);

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const [dbUser] = await db
		.select()
		.from(users)
		.where(eq(users.clerkUserId, clerkUserId))
		.limit(1);

	if (!dbUser) {
		return {
			success: false,
			message: "User not found in the database.",
		};
	}

	const { title, excerpt, coverImageUrl, content } = validatedFields.data;
	const slug = slugify(title);

	await db.insert(posts).values({
		title,
		slug,
		excerpt,
		coverImageUrl: coverImageUrl || null,
		content: content,
		authorId: dbUser.id,
	});

	revalidatePath("/");
	redirect(`/blogs/${slug}`);

	return {
		success: true,
		message: "Post created successfully.",
	};
}

export async function updatePostAction(
	_prevState: PostFormState,
	formData: FormData,
): Promise<PostFormState> {
	const rawContent = formData.get("content");
	const rawPostId = formData.get("postId");

	if (!rawContent || !rawPostId) {
		return {
			success: false,
			message: "Content and Post ID are required.",
		};
	}

	let parsedContent: unknown;

	try {
		parsedContent = JSON.parse(String(rawContent));
	} catch {
		return {
			success: false,
			message: "Invalid content format.",
		};
	}

	const validatedFields = updatePostSchema.safeParse({
		title: String(formData.get("title") ?? ""),
		excerpt: String(formData.get("excerpt") ?? ""),
		coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
		content: parsedContent,
		postId: String(rawPostId),
	});

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const data = validatedFields.data;

	const dbUser = await getCurrentDbUser();

	if (!dbUser) {
		return {
			success: false,
			message: "User not found in the database.",
		};
	}

	const [existingPost] = await db
		.select({
			id: posts.id,
			authorId: posts.authorId,
			slug: posts.slug,
		})
		.from(posts)
		.where(eq(posts.id, data.postId))
		.limit(1);

	if (!existingPost) {
		return {
			success: false,
			message: "Post not found.",
		};
	}

	if (existingPost.authorId !== dbUser.id) {
		return {
			success: false,
			message: "You are not authorized to edit this post.",
		};
	}

	await db
		.update(posts)
		.set({
			title: data.title,
			excerpt: data.excerpt,
			coverImageUrl: data.coverImageUrl || null,
			content: data.content,
			updatedAt: new Date(),
		})
		.where(eq(posts.id, data.postId));

	revalidatePath("/");
	revalidatePath(`/blogs/${existingPost.slug}`);
	revalidatePath(`/blogs/${existingPost.slug}/edit`);

	redirect(`/blogs/${existingPost.slug}`);
}
