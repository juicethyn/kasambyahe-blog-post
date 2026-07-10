"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction, updatePostAction } from "@/lib/actions/posts";
import type { PostContent, PostFormValues } from "@/lib/types/post";
import type { PostFormState } from "@/lib/validations/post";
import BlockNoteEditor from "./BlockNoteEditor";

const initialState: PostFormState = {
	success: false,
	errors: {},
};

interface SubmitButtonProps {
	mode: "create" | "edit";
}

function SubmitButton({ mode }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	const label = mode === "create" ? "Create Post" : "Save Changes";
	const pendingLabel = mode === "create" ? "Creating..." : "Saving...";

	return (
		<Button type="submit" disabled={pending}>
			{pending ? pendingLabel : label}
		</Button>
	);
}

interface FieldErrorProps {
	error?: string;
}

function FieldError({ error }: FieldErrorProps) {
	if (!error) return null;

	return <p className="text-sm text-red-500">{error}</p>;
}

interface PostEditorFormProps {
	mode: "create" | "edit";
	initialValues?: PostFormValues;
	postId?: string;
}

const DEFAULT_POST_CONTENT: PostContent = [
	{
		type: "paragraph",
		content: "",
	},
];

export default function PostEditorForm({
	mode,
	initialValues,
	postId,
}: PostEditorFormProps) {
	const defaults = useMemo<PostFormValues>(
		() => ({
			title: initialValues?.title ?? "",
			excerpt: initialValues?.excerpt ?? "",
			coverImageUrl: initialValues?.coverImageUrl ?? "",
			content: initialValues?.content ?? DEFAULT_POST_CONTENT,
		}),
		[initialValues],
	);

	const [content, setContent] = useState<PostContent>(defaults.content);
	const action = mode === "create" ? createPostAction : updatePostAction;
	const [state, formAction] = useActionState(action, initialState);

	return (
		<form
			action={formAction}
			className="mx-auto flex w-full max-w-5xl flex-col gap-8"
		>
			{mode === "edit" && postId ? (
				<input type="hidden" name="postId" value={postId} />
			) : null}

			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Write a post</h1>
				<p className="text-sm text-muted-foreground">
					Share a route guide, commute tip, or travel story for KasamByahe.
				</p>
			</div>

			{/* Main form container */}
			<div className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
				<div className="flex flex-col gap-6">
					{/* Title */}
					<div className="space-y-2">
						<label htmlFor="title" className="text-sm font-medium">
							Title
						</label>
						<Input
							id="title"
							name="title"
							placeholder="e.g. My first ride to Tagaytay at 5AM"
							defaultValue={defaults.title}
						/>
						<FieldError error={state.errors?.title?.[0]} />
					</div>

					{/* Excerpt */}
					<div className="space-y-2">
						<label htmlFor="excerpt" className="text-sm font-medium">
							Excerpt
						</label>
						<Textarea
							id="excerpt"
							name="excerpt"
							defaultValue={defaults.excerpt}
							placeholder="Write a short preview for the feed..."
							className="min-h-28 resize-none"
						/>
						<p className="text-xs text-muted-foreground">
							This is the short preview shown on the feed card.
						</p>
						<FieldError error={state.errors?.excerpt?.[0]} />
					</div>

					{/* Cover image URL */}
					<div className="space-y-2">
						<label htmlFor="coverImageUrl" className="text-sm font-medium">
							Cover image URL
						</label>
						<Input
							id="coverImageUrl"
							name="coverImageUrl"
							placeholder="https://example.com/cover.jpg"
							defaultValue={defaults.coverImageUrl ?? ""}
						/>
						<p className="text-xs text-muted-foreground">
							Optional. Add a cover image for the feed card and post header.
						</p>
						<FieldError error={state.errors?.coverImageUrl?.[0]} />
					</div>

					{/* Editor */}
					<div className="space-y-3">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">
								Write the main body of your route guide, travel note, or commute
								experience.
							</p>
						</div>

						<div className="overflow-hidden rounded-2xl border bg-background">
							<BlockNoteEditor
								initialContent={defaults.content}
								onChange={setContent}
							/>
						</div>

						<input
							type="hidden"
							name="content"
							value={JSON.stringify(content)}
						/>
						<FieldError error={state.errors?.content?.[0]} />
					</div>

					{/* General action error */}
					{state.message ? (
						<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
							<p className="text-sm text-destructive">{state.message}</p>
						</div>
					) : null}

					{/* Actions */}
					<div className="flex items-center justify-end gap-3 border-t pt-4">
						<SubmitButton mode={mode} />
					</div>
				</div>
			</div>
		</form>
	);
}
