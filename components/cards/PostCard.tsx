import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { FeedPost } from "@/lib/types/post";
import { formatRelativeDate } from "@/lib/utils/format-relative-date";

interface PostCardProps {
	post: FeedPost;
}
export default function PostCard({ post }: PostCardProps) {
	function truncateText(text: string, maxLength = 100): string {
		if (text.length <= maxLength) {
			return text;
		}
		return `${text.slice(0, maxLength)}...`;
	}

	return (
		<Card className="w-full overflow-hidden bg-background text-foreground pt-0">
			<div className="relative h-56 w-full">
				<Image
					src={post.coverImageUrl || "https://avatar.vercel.sh/shadcn1"}
					alt="KasamByahe cover"
					className="h-full w-full object-cover grayscale "
					width={500}
					height={300}
				/>
			</div>

			<CardHeader>
				<CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
				<CardDescription className="text-base text-foreground">
					{truncateText(post.content, 100)}
				</CardDescription>
				<hr className="mt-4" />
			</CardHeader>
			<CardFooter className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					<Image
						src={post.author.imageUrl || "https://avatar.vercel.sh/shadcn1"}
						alt="KasamByahe cover"
						className="max-w-xs lg:max-w-lg rounded-full object-cover"
						width={50}
						height={50}
					/>
					<div className="flex flex-col">
						<p className="font-bold font-merriweather text-base">
							{post.author.displayName}
						</p>
						<p className="text-sm text-muted-foreground">
							{formatRelativeDate(post.createdAt)}
						</p>
					</div>
				</div>
				<div className="flex gap-6 text-sm text-muted-foreground">
					<Heart className="size-6" />
					<MessageCircle className="size-6" />
					<Bookmark className="size-6" />
					<Share2 className="size-6" />
				</div>
			</CardFooter>
		</Card>
	);
}
