import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import type { PostContent } from "@/lib/types/post";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		clerkUserId: text("clerk_user_id").notNull().unique(),
		clerkUsername: text("clerk_username").notNull().unique(),
		role: userRoleEnum("role").default("user").notNull(),
		displayName: text("display_name").notNull(),
		imageUrl: text("image_url"),
		bio: text("bio"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		index("users_clerk_user_id_index").on(t.clerkUserId),
		index("users_clerk_username_index").on(t.clerkUsername),
	],
);

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	authorId: uuid("author_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	excerpt: text("excerpt").notNull(),
	coverImageUrl: text("cover_image_url"),
	content: jsonb("content").$type<PostContent>().notNull(), // The body of the content
	published: boolean("published").default(true).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id")
		.references(() => posts.id, { onDelete: "cascade" })
		.notNull(),
	authorId: uuid("author_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const likes = pgTable(
	"likes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [uniqueIndex("likes_post_user_unique").on(t.postId, t.userId)],
);

export const savedPosts = pgTable(
	"saved_posts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [uniqueIndex("saved_posts_post_user_unique").on(t.postId, t.userId)],
);
