"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePostLikeAction } from "@/lib/actions/post-likes";
import { cn } from "@/lib/utils";

interface PostLikeButtonProps {
	postId: string;
	liked: boolean;
	likeCount: number;
}

export default function PostLikeButton({
	postId,
	liked,
	likeCount,
}: PostLikeButtonProps) {
	const [pending, startTransition] = useTransition();

	type LikeState = {
		liked: boolean;
		likeCount: number;
	};

	type LikeAction = "toggle";

	const [optimistic, setOptimistic] = useOptimistic(
		{
			liked,
			likeCount,
		},
		(state: LikeState, action: LikeAction) => {
			if (action === "toggle") {
				return {
					liked: !state.liked,
					likeCount: state.liked ? state.likeCount - 1 : state.likeCount + 1,
				};
			}
			return state;
		},
	);

	const { userId } = useAuth();
	const { openSignIn } = useClerk();

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="icon"
				disabled={pending}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					if (!userId) {
						openSignIn();
						return;
					}

					startTransition(async () => {
						setOptimistic("toggle");
						await togglePostLikeAction(postId);
					});
				}}
			>
				<Heart
					className={cn(
						"size-6 transition-all duration-200 hover:scale-110",
						optimistic.liked
							? "fill-red-500 text-red-500"
							: "fill-none text-muted-foreground hover:text-red-500",
					)}
				/>
			</Button>
			<span>{optimistic.likeCount}</span>
		</div>
	);
}
