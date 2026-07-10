import "dotenv/config";
import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments, likes, posts, savedPosts, users } from "@/lib/db/schema";
import type { PostContent } from "@/lib/types/post";

const seedClerkUserId = process.env.SEED_CLERK_USER_ID;

if (!seedClerkUserId) {
	throw new Error(
		"SEED_CLERK_USER_ID is not defined in the environment variables.",
	);
}

function paragraph(text: string): PostContent {
	return [
		{
			id: crypto.randomUUID(),
			type: "paragraph",
			props: {
				textColor: "default",
				backgroundColor: "default",
				textAlignment: "left",
			},
			content: [
				{
					type: "text",
					text,
					styles: {},
				},
			],
			children: [],
		},
	];
}

type NewPost = InferInsertModel<typeof posts>;

async function main() {
	const [author] = await db
		.select()
		.from(users)
		.where(eq(users.clerkUserId, seedClerkUserId as string))
		.limit(1);

	if (!author) {
		throw new Error(
			`No user found with clerkUserId: ${seedClerkUserId}. Please ensure the user exists in the database.`,
		);
	}

	await db.delete(likes);
	await db.delete(comments);
	await db.delete(savedPosts);
	await db.delete(posts);

	const insertedPosts = await db
		.insert(posts)
		.values([
			{
				title: "A Weekend Food Crawl in Binondo",
				slug: "weekend-food-crawl-binondo",
				excerpt:
					"A quick guide to spending a day eating your way through Binondo.",
				content: paragraph("Seeded body content here..."),
				authorId: author.id,
			},
			{
				title: "What I Learned from a Solo Trip to Siargao",
				slug: "solo-trip-siargao-learnings",
				excerpt: "Things I wish I knew before planning a solo island trip.",
				content: paragraph("Seeded body content here..."),
				authorId: author.id,
			},
			{
				title: "3 Cafes I’d Revisit in Baguio",
				slug: "three-cafes-baguio",
				excerpt:
					"A short list of cafes worth returning to for coffee and atmosphere.",
				content: paragraph("Seeded body content here..."),
				authorId: author.id,
			},
		] as NewPost[])
		.returning();

	if (insertedPosts.length >= 2) {
		await db.insert(comments).values([
			{
				postId: insertedPosts[0].id,
				authorId: author.id,
				content: "This is a seeded comment for the first post.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: author.id,
				content: "This is a seeded comment for the second post.",
			},
		]);
	}

	await db.insert(likes).values(
		insertedPosts.map((post) => ({
			postId: post.id,
			userId: author.id,
		})),
	);

	console.log("Database seeding completed successfully.");
}

main().catch((error) => {
	console.error("Error during database seeding:", error);
	process.exit(1);
});
