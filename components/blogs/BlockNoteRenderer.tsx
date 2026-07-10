"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PostContent } from "@/lib/types/post";

interface BlockNoteRendererProps {
	content: PostContent;
}

export default function BlockNoteRenderer({ content }: BlockNoteRendererProps) {
	const editor = useCreateBlockNote({
		initialContent: content,
	});

	return (
		<div className="prose prose-neutral dark:prose-invert max-w-none">
			<BlockNoteView editor={editor} editable={false} theme="light" />
		</div>
	);
}
