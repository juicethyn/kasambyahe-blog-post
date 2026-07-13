import { notFound, redirect } from "next/navigation";
import PostEditorForm from "@/components/posts/PostEditorForm";
import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/lib/actions/posts";
import { getCurrentDbUser } from "@/lib/auth/get-current-db-user";
import { getPostBySlug } from "@/lib/db/queries/posts";

interface EditPostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
	const { slug } = await params;

	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const dbUser = await getCurrentDbUser();

	if (!dbUser || dbUser.id !== post.author.id) {
		redirect(`/blogs/${slug}`);
	}

	return (
		<section className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Edit post</h1>
				<p className="text-muted-foreground">
					Update your post details and content.
				</p>
			</div>

			<form action={deletePostAction}>
				<input type="hidden" name="postId" value={post.id} />
				<Button type="submit" variant="destructive">
					Delete post
				</Button>
			</form>

			<PostEditorForm
				mode="edit"
				postId={post.id}
				initialValues={{
					title: post.title,
					excerpt: post.excerpt,
					coverImageUrl: post.coverImageUrl,
					coverImageKey: post.coverImageKey,
					content: post.content,
				}}
			/>
		</section>
	);
}
