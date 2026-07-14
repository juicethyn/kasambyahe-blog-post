import { ImagePlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import CoverImageUpload from "./CoverImageUpload";

interface CoverImageToggleProps {
	coverImage?: { url: string; key: string } | null;
	setCoverImage: (payload: { url: string; key: string } | null) => void;
}

export default function CoverImageToggle({
	coverImage,
	setCoverImage,
}: CoverImageToggleProps) {
	const [showCoverImageUpload, setShowCoverImageUpload] = useState<boolean>(
		Boolean(coverImage?.url),
	);

	return (
		<>
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => setShowCoverImageUpload((prev) => !prev)}
					className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
				>
					<ImagePlus className="size-4" />
					{showCoverImageUpload ? "Hide cover image" : "Add cover image"}
				</button>

				<AnimatePresence>
					{showCoverImageUpload && (
						<motion.button
							type="button"
							onClick={() => setShowCoverImageUpload(false)}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.15 }}
							className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						></motion.button>
					)}
				</AnimatePresence>
			</div>

			<motion.div
				initial={false}
				animate={{
					height: showCoverImageUpload ? "auto" : 0,
					opacity: showCoverImageUpload ? 1 : 0,
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="overflow-hidden"
			>
				<div className="pt-2">
					<CoverImageUpload
						value={coverImage?.url ?? ""}
						onChange={setCoverImage}
					/>
				</div>
			</motion.div>
		</>
	);
}
