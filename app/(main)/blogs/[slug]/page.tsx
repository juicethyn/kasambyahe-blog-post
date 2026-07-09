import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

	const comments = await getCommentsByPostId(post.id);

	return (
		<section className="flex flex-col">
			<div className="relative w-full max-w-4xl">
				<AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
					<Image
						src={post.coverImageUrl || "https://avatar.vercel.sh/shadcn1"}
						alt="Photo"
						fill
						className="w-full rounded-xl object-cover grayscale dark:brightness-20"
					/>
				</AspectRatio>
			</div>

			<h1>{post.title}</h1>

			<hr />
			<div>
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
			</div>
			<hr />

			<p>{post.content}</p>

			{/* Comments */}
			<div className="space-y-4">
				<h2 className="text-2xl font-semibold">Comments</h2>

				{comments.length === 0 ? (
					<p className="text-muted-foreground">No comments yet.</p>
				) : (
					<div className="space-y-4">
						{comments.map((comment) => (
							<div
								key={comment.id}
								className="rounded-lg border border-border bg-card p-4"
							>
								<div className="mb-2 flex items-center gap-3">
									<Image
										src={
											comment.author.imageUrl ||
											"https://avatar.vercel.sh/shadcn1"
										}
										height={100}
										width={100}
										alt={comment.author.displayName}
										className="h-10 w-10 rounded-full object-cover"
									/>
									<div>
										<p className="font-medium">{comment.author.displayName}</p>
										<p className="text-sm text-muted-foreground">
											{comment.author.username}
										</p>
									</div>
								</div>

								<p className="text-sm leading-7">{comment.content}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
