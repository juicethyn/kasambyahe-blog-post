"use client";

import dynamic from "next/dynamic";

export const BlockNoteRenderer = dynamic(() => import("./BlockNoteRenderer"), {
	ssr: false,
});

export const BlockNoteEditor = dynamic(
	() => import("../posts/BlockNoteEditor"),
	{
		ssr: false,
	},
);
