"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import addCommentAction from "@/lib/actions/comments";
import type { CommentFormState } from "@/lib/validations/comment";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface CommentFormProps {
	postId: string;
}

const initialState: CommentFormState = {
	success: false,
	message: undefined,
	errors: {},
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Posting..." : "Post Comment"}
		</Button>
	);
}

export default function CommentForm({ postId }: CommentFormProps) {
	const [state, formAction] = useActionState(addCommentAction, initialState);

	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success && formRef.current) {
			formRef.current.reset();
		}
	}, [state.success]);

	return (
		<form action={formAction}>
			<input type="hidden" name="postId" value={postId} />

			<Textarea name="content" placeholder="Share your thoughts..." />

			<FieldError>{state.errors?.content?.[0]}</FieldError>
			<SubmitButton />
		</form>
	);
}
