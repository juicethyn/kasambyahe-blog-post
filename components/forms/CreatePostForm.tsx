"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction } from "@/lib/actions/posts";
import type { CreatePostFormState } from "@/lib/validations/post";
import BlockNoteEditor from "./BlockNoteEditor";

const initialState: CreatePostFormState = {
	success: false,
	errors: {},
};

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Creating..." : "Create Post"}
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

export default function CreatePostForm() {
	const [content, setContent] = useState<string>("");
	const [state, formAction] = useActionState(createPostAction, initialState);

	return (
		<form
			action={formAction}
			className="mx-auto flex w-full max-w-5xl flex-col gap-8"
		>
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
							<BlockNoteEditor onChange={setContent} />
						</div>

						<input type="hidden" name="content" value={content} />
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
						<SubmitButton />
					</div>
				</div>
			</div>
		</form>
	);
}
