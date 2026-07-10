import { z } from "zod";

export const createPostSchema = z.object({
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
		.url("Cover image must be a valid URL")
		.optional()
		.or(z.literal("").transform(() => undefined)), // Allow empty string to be treated as undefined
	content: z
		.string()
		.trim()
		.min(2, "Content must be at least 2 characters long")
		.refine((value) => {
			try {
				JSON.parse(value);
				return true;
			} catch {
				return false;
			}
		}, "Content must be valid JSON"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export type CreatePostFormState = {
	success: boolean;
	message?: string;
	errors?: Partial<Record<keyof CreatePostFormValues, string[]>>;
};
