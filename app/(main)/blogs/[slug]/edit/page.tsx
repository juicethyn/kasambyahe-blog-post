import { notFound, redirect } from "next/navigation";
import PostEditorForm from "@/components/posts/PostEditorForm";
import { getCurrentDbUserOrNull } from "@/lib/auth/get-current-db-user";
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

	const dbUser = await getCurrentDbUserOrNull();

	if (!dbUser || dbUser.id !== post.author.id) {
		redirect(`/blogs/${slug}`);
	}

	return (
		<section>
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
