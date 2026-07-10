import { z } from "zod";

const postContentSchema = z.array(z.record(z.string(), z.unknown()));

const basePostSchema = z.object({
	title: z
		.string()
		.trim()
		.min(5, "Title must be at least 5 characters long")
		.max(120, "Title must be at most 120 characters long"),

	excerpt: z
		.string()
		.trim()
		.min(20, "Excerpt must be at least 20 characters long")
		.max(1000, "Excerpt must be at most 1000 characters long"),

	coverImageUrl: z
		.string()
		.trim()
		.optional()
		.refine((value) => !value || URL.canParse(value), {
			message: "Cover image must be a valid URL",
		})
		.transform((value) => (value ? value : undefined)),

	coverImageKey: z
		.string()
		.trim()
		.optional()
		.transform((value) => (value ? value : undefined)),

	content: postContentSchema,
});

export const createPostSchema = basePostSchema;

export const updatePostSchema = basePostSchema.extend({
	postId: z.string().uuid("Invalid post ID"),
});

export const deletePostSchema = z.object({
	postId: z.string().uuid("Invalid post ID"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;

export type PostFormState = {
	success: boolean;
	message?: string;
	errors?: Partial<
		Record<keyof (CreatePostFormValues & { postId?: string }), string[]>
	>;
};
