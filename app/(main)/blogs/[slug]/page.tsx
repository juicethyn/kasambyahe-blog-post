import {
	ArrowLeft,
	Bookmark,
	Heart,
	MessageCircle,
	MoreHorizontal,
	Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlockNoteRenderer } from "@/components/blogs/DynamicEditor";
import DiscussionSection from "@/components/comments/DiscussionSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
import {
	getCommentCountByPostId,
	getCommentsByPostId,
} from "@/lib/db/queries/comments";
import { getPostBySlug } from "@/lib/db/queries/posts";
import { formatRelativeDate } from "@/lib/utils/format-relative-date";
import Loading from "./loading";

interface BlogSlugPageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const [dbUser, comments, commentCount] = await Promise.all([
		getCurrentDbUserOrNull(),
		getCommentsByPostId(post.id),
		getCommentCountByPostId(post.id),
	]);

	return (
		<Suspense fallback={<Loading />}>
			<section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex gap-2">
						<ArrowLeft />
						<p>Back to Home</p>
					</Link>

					{dbUser?.id === post.author.id && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent
								align="end"
								className="bg-background text-foreground"
							>
								<DropdownMenuItem asChild>
									<Link href={`/blogs/${post.slug}/edit`}>Edit Post</Link>
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem className="text-destructive focus:text-destructive">
									Delete Post
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				<div className="mx-auto w-full lg:max-w-8xl">
					<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl">
						<Image
							src={post.coverImageUrl || "https://avatar.vercel.sh/shadcn1"}
							alt={post.title}
							fill
							className="object-cover"
						/>
					</AspectRatio>
				</div>

				<div className="max-w-4xl">
					<h1 className="font-merriweather text-2xl lg:text-4xl font-bold wrap-break-word">
						{post.title}
					</h1>
				</div>

				{/* Author Details */}
				<div>
					<hr />
					<div className="flex items-center justify-between text-sm text-muted-foreground py-4">
						<div className="flex items-center gap-3">
							<Image
								src={post.author.imageUrl || "https://avatar.vercel.sh/shadcn1"}
								alt={post.author.displayName}
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
					</div>
					<hr />
				</div>

				<BlockNoteRenderer content={post.content} />

				<Separator />

				{/* Discussion Section*/}
				<Suspense fallback={<div>Loading comments...</div>}>
					<DiscussionSection
						postId={post.id}
						postAuthorId={post.author.id}
						commentCount={commentCount}
						comments={comments}
					/>
				</Suspense>
			</section>
		</Suspense>
	);
}
