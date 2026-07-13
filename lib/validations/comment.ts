import { z } from "zod";
import type { PostComment } from "@/lib/types/comment";

export const addCommentSchema = z.object({
	postId: z.string().uuid("Invalid post ID"),

	content: z
		.string()
		.trim()
		.min(2, "Comment content is required")
		.max(500, "Comment content must be at most 500 characters long"),
});

export type AddCommentFormValues = z.infer<typeof addCommentSchema>;

export type CommentFormState = {
	success: boolean;
	message?: string;
	errors?: Partial<Record<keyof AddCommentFormValues, string>>;
	comment?: PostComment;
};
