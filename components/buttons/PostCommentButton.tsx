import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCommentButtonProps {
	commentCount: number;
	onClick?: () => void;
}

export default function PostCommentButton({
	commentCount,
	onClick,
}: PostCommentButtonProps) {
	return (
		<div className="flex items-center gap-1">
			<Button type="button" variant="ghost" size="icon" onClick={onClick}>
				<MessageCircle className="size-6" />
			</Button>
			<span>{commentCount}</span>
		</div>
	);
}
