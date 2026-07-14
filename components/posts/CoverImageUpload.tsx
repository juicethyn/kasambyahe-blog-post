"use client";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";

interface CoverImageUploadProps {
	value?: string;
	onChange: (payload: { url: string; key: string } | null) => void;
}

export default function CoverImageUpload({
	value,
	onChange,
}: CoverImageUploadProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [previewUrl, setPreviewUrl] = useState(value ?? "");
	const [isUploading, setIsUploading] = useState(false);

	const { startUpload } = useUploadThing("postCoverImage", {
		onClientUploadComplete: (res) => {
			const uploaded = res?.[0];
			if (!uploaded) return;

			setPreviewUrl(uploaded.url);
			onChange({
				url: uploaded.url,
				key: uploaded.key,
			});
			setIsUploading(false);
		},
		onUploadError: (error) => {
			console.error("Upload failed:", error);
			setIsUploading(false);
		},
	});

	async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);

		try {
			await startUpload([file]);
		} catch (error) {
			console.error(error);
			setIsUploading(false);
		}
	}

	function handleRemove() {
		setPreviewUrl("");
		onChange(null);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	return (
		<div className="space-y-3">
			<div className="rounded-2xl p-4 bg-background">
				{previewUrl ? (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							{previewUrl ? (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleRemove}
									className="text-destructive hover:bg-destructive/10"
								>
									<X className="mr-2 size-4" />
									Remove
								</Button>
							) : null}

							<Button
								type="button"
								variant="secondary"
								onClick={() => inputRef.current?.click()}
								disabled={isUploading}
							>
								{isUploading ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="mr-2 size-4" />
										Replace image
									</>
								)}
							</Button>
						</div>

						<div className="relative aspect-video w-full overflow-hidden rounded-xl border">
							<Image
								src={previewUrl}
								alt="Cover preview"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-3 bg-background rounded-xl border border-dashed px-6 py-10 text-center">
						<Upload className="size-8 text-muted-foreground" />
						<div className="space-y-1">
							<p className="text-sm font-medium">Upload a cover image</p>
							<p className="text-xs text-muted-foreground">
								PNG, JPG, or WEBP up to 4MB
							</p>
						</div>

						<Button
							type="button"
							variant="secondary"
							onClick={() => inputRef.current?.click()}
							disabled={isUploading}
						>
							{isUploading ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Uploading...
								</>
							) : (
								"Choose image"
							)}
						</Button>
					</div>
				)}

				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>
		</div>
	);
}
