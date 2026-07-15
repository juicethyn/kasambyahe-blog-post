"use client";

import { useRouter } from "next/dist/client/components/navigation";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction, updatePostAction } from "@/lib/actions/posts";
import type { PostContent, PostFormValues } from "@/lib/types/post";
import type { PostFormState } from "@/lib/validations/post";
import { BlockNoteEditor } from "../blogs/DynamicEditor";
import CoverImageToggle from "./CoverImageToggle";

const initialState: PostFormState = {
	success: false,
	errors: {},
};

interface SubmitButtonProps {
	mode: "create" | "edit";
}

function SubmitButton({ mode }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	const label = mode === "create" ? "Publish" : "Save Changes";
	const pendingLabel = mode === "create" ? "Publishing..." : "Saving...";

	return (
		<Button
			type="submit"
			disabled={pending}
			className="bg-muted-foreground hover:bg-secondary-foreground"
		>
			{pending ? pendingLabel : label}
		</Button>
	);
}

function CancelButton() {
	const router = useRouter();
	const { pending } = useFormStatus();

	return (
		<Button
			type="button"
			variant="outline"
			disabled={pending}
			onClick={() => router.replace("/")}
		>
			Cancel
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
			coverImageKey: initialValues?.coverImageKey ?? "",
			content: initialValues?.content ?? DEFAULT_POST_CONTENT,
		}),
		[initialValues],
	);

	const [content, setContent] = useState<PostContent>(defaults.content);
	const action = mode === "create" ? createPostAction : updatePostAction;
	const [state, formAction] = useActionState(action, initialState);

	const [coverImage, setCoverImage] = useState<{
		url: string;
		key: string;
	} | null>(
		defaults.coverImageUrl
			? {
					url: defaults.coverImageUrl ?? "",
					key: defaults.coverImageKey ?? "",
				}
			: null,
	);

	return (
		<form
			action={formAction}
			className="mx-auto flex w-full max-w-5xl flex-col gap-8"
		>
			{mode === "edit" && postId ? (
				<input type="hidden" name="postId" value={postId} />
			) : null}

			{/* Main form container */}
			<div className="p-4 md:p-6">
				{/* Actions */}
				<div className="flex items-center justify-end gap-3 pt-4">
					<CancelButton />
					<SubmitButton mode={mode} />
				</div>
				<br />
				<div className="flex flex-col gap-6">
					{/* Cover Image */}
					<CoverImageToggle
						coverImage={coverImage}
						setCoverImage={setCoverImage}
					/>

					<input
						type="hidden"
						name="coverImageUrl"
						value={coverImage?.url ?? ""}
					/>
					<input
						type="hidden"
						name="coverImageKey"
						value={coverImage?.key ?? ""}
					/>

					<FieldError error={state.errors?.coverImageUrl?.[0]} />
					<FieldError error={state.errors?.coverImageKey?.[0]} />

					{/* Title */}
					<div className="space-y-2">
						<Input
							id="title"
							name="title"
							placeholder="Title"
							defaultValue={defaults.title}
							className="h-auto border-none bg-transparent px-0 py-2 text-3xl font-bold font-merriweather shadow-none focus-visible:ring-0 lg:text-5xl"
						/>
						<FieldError error={state.errors?.title?.[0]} />
					</div>

					{/* Excerpt */}
					<div className="space-y-2">
						<Textarea
							id="excerpt"
							name="excerpt"
							defaultValue={defaults.excerpt}
							placeholder="Write a short preview for the feed..."
							className="h-auto border-none bg-transparent px-0 py-2 text-xl font-bold font-merriweather shadow-none focus-visible:ring-0 lg:text-2xl"
						/>
						<FieldError error={state.errors?.excerpt?.[0]} />
					</div>

					{/* Editor */}
					<div className="space-y-3">
						<div className="overflow-hidden bg-background">
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
				</div>
			</div>
		</form>
	);
}
