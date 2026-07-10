import Image from "next/image";
import type { PostComment } from "@/lib/types/comment";
import { formatRelativeDate } from "@/lib/utils/format-relative-date";
import { Badge } from "../ui/badge";

interface CommentProps {
	comments: PostComment[];
	postAuthorId: string;
}

export default function CommentsList({ comments, postAuthorId }: CommentProps) {
	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-semibold font-merriweather">
				Comments ({comments.length})
			</h2>
			{comments.length === 0 ? (
				<p className="text-muted-foreground">No comments yet.</p>
			) : (
				<div className="space-y-4">
					{comments.map((comment) => {
						const isPostAuthor = comment.author.id === postAuthorId;

						return (
							<div key={comment.id} className="border-b p-4">
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

									<div className="flex items-center gap-2">
										<p className="font-medium">{comment.author.displayName}</p>
										<p className="text-sm text-muted-foreground">
											• {formatRelativeDate(comment.createdAt)}
										</p>
									</div>
									{isPostAuthor && <Badge variant="outline">Author</Badge>}
								</div>
								<p className="text-sm leading-7">{comment.content}</p>
								<br />
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<p>16 Likes</p>
									<p>3 replies</p>
									<p className="hover:underline cursor-pointer">Reply</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
