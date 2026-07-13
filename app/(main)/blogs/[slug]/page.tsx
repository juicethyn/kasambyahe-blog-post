import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlockNoteRenderer } from "@/components/blogs/DynamicEditor";
import CommentForm from "@/components/comments/CommentForm";
import CommentsList from "@/components/comments/CommentsList";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
import { getCommentsByPostId } from "@/lib/db/queries/comments";
import { getPostBySlug } from "@/lib/db/queries/posts";
import { formatRelativeDate } from "@/lib/utils/format-relative-date";

interface BlogSlugPageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		return <div>Post not found</div>;
	}

	const dbUser = await getCurrentDbUserOrNull();
	const comments = await getCommentsByPostId(post.id);

	return (
		<section className="lg:mx-36 flex flex-col gap-6">
			{dbUser?.id === post.author.id ? (
				<Link href={`/blogs/${post.slug}/edit`}>Edit post</Link>
			) : null}
			<div className="mx-auto w-full lg:max-w-8xl">
				<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl">
					<Image
						src={post.coverImageUrl || "https://avatar.vercel.sh/shadcn1"}
						alt={post.title}
						fill
						className="object-cover grayscale dark:brightness-20"
					/>
				</AspectRatio>
			</div>

			{/* Title */}
			<h1 className="text-4xl font-bold font-merriweather">{post.title}</h1>

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

			{/* Comments */}
			<CommentForm postId={post.id} />
			<CommentsList comments={comments} postAuthorId={post.author.id} />
		</section>
	);
}
