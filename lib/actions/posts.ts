"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { slugify } from "@/lib/utils/slug";
import {
	type CreatePostFormState,
	createPostSchema,
} from "@/lib/validations/post";

export async function createPostAction(
	_prevState: CreatePostFormState,
	formData: FormData,
): Promise<CreatePostFormState> {
	const { userId: clerkUserId } = await auth();

	if (!clerkUserId) {
		return {
			success: false,
			message: "You must be logged in to create a post.",
		};
	}

	const rawValues = {
		title: String(formData.get("title") ?? ""),
		excerpt: String(formData.get("excerpt") ?? ""),
		coverImageUrl: String(formData.get("coverImageUrl") ?? ""),
		content: String(formData.get("content") ?? ""),
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
		content: JSON.parse(content),
		authorId: dbUser.id,
	});

	revalidatePath("/");
	redirect(`/blogs/${slug}`);

	return {
		success: true,
		message: "Post created successfully.",
	};
}
