"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteUploadthingFileAction(key: string) {
	if (!key) return { success: false };

	try {
		await utapi.deleteFiles(key);
		return { success: true };
	} catch (error) {
		console.error("Failed to delete UploadThing file:", error);
		return { success: false };
	}
}
