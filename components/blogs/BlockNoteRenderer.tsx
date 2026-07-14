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
		<div className="bn-content prose prose-neutral max-w-none">
			<BlockNoteView
				editor={editor}
				editable={false}
				theme={{
					colors: {
						editor: {
							background: "#FFF8F0",
							text: "#000000",
						},
					},
				}}
				data-my-editor
			/>
		</div>
	);
}
