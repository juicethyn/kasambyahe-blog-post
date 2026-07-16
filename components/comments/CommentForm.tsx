"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import addCommentAction from "@/lib/actions/comments";
import type { PostComment } from "@/lib/types/comment";
import type { CommentFormState } from "@/lib/validations/comment";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface CommentFormProps {
	postId: string;
	onCommentSubmit?: (comment: PostComment) => void;
}

const initialState: CommentFormState = {
	success: false,
	message: undefined,
	errors: {},
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button
			variant="default"
			size="sm"
			type="submit"
			disabled={pending}
			className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
		>
			{pending ? "Posting..." : "Post"}
		</Button>
	);
}

export default function CommentForm({
	postId,
	onCommentSubmit,
}: CommentFormProps) {
	const [state, formAction] = useActionState(addCommentAction, initialState);

	const formRef = useRef<HTMLFormElement>(null);

	const isSignedIn = useUser().isSignedIn;

	const handledCommentIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (
			state.success &&
			state.comment &&
			state.comment.id !== handledCommentIdRef.current
		) {
			handledCommentIdRef.current = state.comment.id;
			formRef.current?.reset();
			onCommentSubmit?.(state.comment);
		}
	}, [state, onCommentSubmit]);

	if (!isSignedIn) {
		return (
			<div className="flex flex-col items-center gap-3 bg-background p-6 text-center">
				<p className="text-sm text-muted-foreground">
					Sign in to join the discussion.
				</p>
				<SignInButton mode="modal">
					<Button
						variant="default"
						size="sm"
						className="bg-background text-accent-foreground border border-accent-foreground hover:bg-accent-foreground/80 hover:text-background"
					>
						Sign in
					</Button>
				</SignInButton>
			</div>
		);
	}

	return (
		<form action={formAction} ref={formRef} className="bg-background">
			<input type="hidden" name="postId" value={postId} />

			<div className="p-3 bg-background transition-colors focus-within:border-foreground/40">
				<Textarea
					name="content"
					placeholder="What's on your mind?"
					aria-label="Write a comment"
					className="min-h-0 resize-none border-none bg-transparent p-2 shadow-none focus-visible:ring-0"
				/>

				<div className="mt-3 flex items-center justify-end sm:justify-between gap-3">
					<p className="hidden text-xs text-muted-foreground sm:block">
						Be kind to fellow travelers.
					</p>
					<SubmitButton />
				</div>
			</div>

			<FieldError>{state.errors?.content?.[0]}</FieldError>
		</form>
	);
}
