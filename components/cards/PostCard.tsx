import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
		<Link href={`/blogs/${post.slug}`}>
			<Card className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground pt-0">
				{/* Fixed-height, always-cropped cover image */}
				<div className="relative h-56 w-full shrink-0">
					<Image
						src={post.coverImageUrl || "https://avatar.vercel.sh/shadcn1"}
						alt={post.title}
						className="object-cover"
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
					/>
				</div>

				<CardHeader className="flex-1 gap-4">
					<div className="flex flex-col gap-2">
						<CardTitle className="line-clamp-2 text-2xl font-bold">
							{post.title}
						</CardTitle>
						<CardDescription className="line-clamp-2 text-base text-foreground">
							{truncateText(post.excerpt, 100)}
						</CardDescription>
					</div>
				</CardHeader>
				<hr />
				<CardFooter className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Image
							src={post.author.imageUrl || "https://avatar.vercel.sh/shadcn1"}
							alt={post.author.displayName}
							width={50}
							height={50}
							className="h-10 w-10 rounded-full object-cover"
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
		</Link>
	);
}
