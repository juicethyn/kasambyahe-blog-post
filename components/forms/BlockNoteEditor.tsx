"use client"; // this registers <Editor> as a Client Component

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

interface BlockNoteEditorProps {
	initialContent?: string;
	onChange?: (content: string) => void;
}

export default function BlockNoteEditor({
	initialContent,
	onChange,
}: BlockNoteEditorProps) {
	const editor = useCreateBlockNote({
		initialContent: initialContent ? JSON.parse(initialContent) : undefined,
	});
	return (
		<BlockNoteView
			editor={editor}
			onChange={(content) => {
				const blocks = content.document;
				onChange?.(JSON.stringify(blocks));
			}}
			theme="light"
		/>
	);
}
