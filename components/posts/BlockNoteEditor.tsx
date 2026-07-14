"use client"; // this registers <Editor> as a Client Component

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useEffect } from "react";
import type { PostContent } from "@/lib/types/post";

interface BlockNoteEditorProps {
	initialContent?: PostContent;
	onChange?: (content: PostContent) => void;
}

const DEFAULT_POST_CONTENT: PostContent = [
	{
		type: "paragraph",
		content: "",
	},
];

export default function BlockNoteEditor({
	initialContent,
	onChange,
}: BlockNoteEditorProps) {
	const editor = useCreateBlockNote({
		initialContent: initialContent ? initialContent : DEFAULT_POST_CONTENT,
	});

	useEffect(() => {
		if (!onChange) return;

		onChange(editor.document as PostContent);
	}, [editor, onChange]);

	return (
		<BlockNoteView
			editor={editor}
			onChange={(content) => {
				const _blocks = content.document;
				onChange?.(editor.document as PostContent);
			}}
			theme={{
				colors: {
					editor: {
						background: "#FFF8F0",
						text: "#000000",
					},
				},
			}}
		/>
	);
}
