import { ImagePlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import CoverImageUpload from "./CoverImageUpload";

interface CoverImageToggleProps {
	coverImage?: { url: string; key: string } | null;
	setCoverImage: (payload: { url: string; key: string } | null) => void;
	initialCoverKey?: string | null;
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
					<CoverImageUpload value={coverImage} onChange={setCoverImage} />
				</div>
			</motion.div>
		</>
	);
}
