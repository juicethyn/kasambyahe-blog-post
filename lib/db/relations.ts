import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		posts: r.many.posts(),
		comments: r.many.comments(),
		likes: r.many.likes(),
		savedPosts: r.many.savedPosts(),
	},

	posts: {
		author: r.one.users({
			from: r.posts.authorId,
			to: r.users.id,
		}),
		comments: r.many.comments(),
		likes: r.many.likes(),
		savedPosts: r.many.savedPosts(),
	},

	comments: {
		post: r.one.posts({
			from: r.comments.postId,
			to: r.posts.id,
		}),
		author: r.one.users({
			from: r.comments.authorId,
			to: r.users.id,
		}),
	},

	likes: {
		post: r.one.posts({
			from: r.likes.postId,
			to: r.posts.id,
		}),
		user: r.one.users({
			from: r.likes.userId,
			to: r.users.id,
		}),
	},

	savedPosts: {
		post: r.one.posts({
			from: r.savedPosts.postId,
			to: r.posts.id,
		}),
		user: r.one.users({
			from: r.savedPosts.userId,
			to: r.users.id,
		}),
	},
}));
