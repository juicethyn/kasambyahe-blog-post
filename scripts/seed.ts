import "dotenv/config";
import { eq, type InferInsertModel, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments, likes, posts, users } from "@/lib/db/schema";
import type { PostContent } from "@/lib/types/post";

const seedClerkUserId = process.env.SEED_CLERK_USER_ID;

if (!seedClerkUserId) {
	throw new Error(
		"SEED_CLERK_USER_ID is not defined in the environment variables.",
	);
}

function text(text: string, styles = {}) {
	return {
		type: "text",
		text,
		styles,
	};
}

function heading(content: string, level: 1 | 2 | 3 = 1) {
	return {
		id: crypto.randomUUID(),
		type: "heading",
		props: {
			level,
			textAlignment: "left",
		},
		content: [text(content)],
		children: [],
	};
}

function paragraph(content: string) {
	return {
		id: crypto.randomUUID(),
		type: "paragraph",
		props: {
			textAlignment: "left",
			textColor: "default",
			backgroundColor: "default",
		},
		content: [text(content)],
		children: [],
	};
}

function bullet(content: string) {
	return {
		id: crypto.randomUUID(),
		type: "bulletListItem",
		props: {},
		content: [text(content)],
		children: [],
	};
}

function numbered(content: string) {
	return {
		id: crypto.randomUUID(),
		type: "numberedListItem",
		props: {},
		content: [text(content)],
		children: [],
	};
}

function quote(content: string) {
	return {
		id: crypto.randomUUID(),
		type: "quote",
		props: {},
		content: [text(content)],
		children: [],
	};
}

function divider() {
	return {
		id: crypto.randomUUID(),
		type: "divider",
		props: {},
		content: [],
		children: [],
	};
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

	const seedUsers = await db
		.select()
		.from(users)
		.where(
			inArray(users.clerkUserId, [
				"user_3GTv1xwWUOYEibsbgpnQpqbDaQw",
				"user_3GDGwVxFdOC8qfYfabwLH5lrYvr",
				"user_3GTzZZNMmyjGQp7cToTdzaunPNY",
			]),
		);

	const userMap = new Map(seedUsers.map((user) => [user.clerkUserId, user]));

	const rider1 = userMap.get("user_3GTv1xwWUOYEibsbgpnQpqbDaQw");
	const rider2 = userMap.get("user_3GDGwVxFdOC8qfYfabwLH5lrYvr");
	const rider3 = userMap.get("user_3GTzZZNMmyjGQp7cToTdzaunPNY");

	if (!rider1 || !rider2 || !rider3) {
		throw new Error("One or more seeded users were not found.");
	}

	await db.delete(likes);
	await db.delete(comments);
	await db.delete(posts);

	const insertedPosts = await db
		.insert(posts)
		.values([
			{
				title: "Weekend Ride to Tagaytay: A Beginner-Friendly Day Trip",
				slug: "weekend-ride-to-tagaytay-beginner-guide",
				excerpt:
					"Planning your first ride to Tagaytay? Here's a simple route, suggested departure time, scenic stops, and practical tips for a relaxing weekend escape.",
				content: tagaytayRide(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk5I3Ya5LWykHB9sqN41PaiLQ5fOKzhCJdFGMrg",
				coverImageKey: "1Q0Zj8paxwk5I3Ya5LWykHB9sqN41PaiLQ5fOKzhCJdFGMrg",
			},
			{
				title: "Marilaque Sunrise Ride: Enjoy the View, Ride Responsibly",
				slug: "marilaque-sunrise-ride-guide",
				excerpt:
					"Marilaque offers breathtaking mountain scenery, but it deserves respect. Here's how to enjoy one of the country's most popular riding roads safely.",
				content: marilaqueGuide(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk55qiEyVXx3DoeluEiORcFWvIw1QJy92h7N0KG",
				coverImageKey: "1Q0Zj8paxwk55qiEyVXx3DoeluEiORcFWvIw1QJy92h7N0KG",
			},
			{
				title: "A Weekend Food Crawl Through Binondo",
				slug: "weekend-food-crawl-binondo",
				excerpt:
					"Spend a day exploring the world's oldest Chinatown with this simple food crawl featuring classic dishes, hidden gems, and practical travel tips.",
				content: binondoFoodGuide(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk55zRoiOx3DoeluEiORcFWvIw1QJy92h7N0KGg",
				coverImageKey: "1Q0Zj8paxwk55zRoiOx3DoeluEiORcFWvIw1QJy92h7N0KGg",
			},
		] as NewPost[])
		.returning();

	if (insertedPosts.length >= 3) {
		await db.insert(comments).values([
			// Tagaytay
			{
				postId: insertedPosts[0].id,
				authorId: author.id,
				content:
					"I usually leave around 5 AM to avoid the traffic in Santa Rosa. Makes the ride much more enjoyable.",
			},
			{
				postId: insertedPosts[0].id,
				authorId: rider1.id,
				content:
					"Mahogany Market is definitely worth the stop. The bulalo is still one of my favorites.",
			},
			{
				postId: insertedPosts[0].id,
				authorId: rider2.id,
				content:
					"Thanks for mentioning the fog. I almost got caught riding there late afternoon once.",
			},

			// Marilaque
			{
				postId: insertedPosts[1].id,
				authorId: author.id,
				content:
					"Completely agree. The scenery is amazing, but people should ride within their limits.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: rider3.id,
				content:
					"I've started going on weekdays instead of weekends. Much less crowded.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: rider1.id,
				content: "Complete riding gear should always be non-negotiable.",
			},

			// Binondo
			{
				postId: insertedPosts[2].id,
				authorId: rider2.id,
				content:
					"I'd also recommend trying the fried siopao near Ongpin. It's underrated.",
			},
			{
				postId: insertedPosts[2].id,
				authorId: author.id,
				content:
					"Good tip about bringing cash. Some of the older restaurants still don't accept cards.",
			},
			{
				postId: insertedPosts[2].id,
				authorId: rider3.id,
				content:
					"I always end my food crawl with fresh hopia before heading home.",
			},
		]);
	}

	await db.insert(likes).values([
		// Tagaytay (4 likes)
		{
			postId: insertedPosts[0].id,
			userId: author.id,
		},
		{
			postId: insertedPosts[0].id,
			userId: rider1.id,
		},
		{
			postId: insertedPosts[0].id,
			userId: rider2.id,
		},
		{
			postId: insertedPosts[0].id,
			userId: rider3.id,
		},

		// Marilaque (3 likes)
		{
			postId: insertedPosts[1].id,
			userId: author.id,
		},
		{
			postId: insertedPosts[1].id,
			userId: rider1.id,
		},
		{
			postId: insertedPosts[1].id,
			userId: rider3.id,
		},

		// Binondo (2 likes)
		{
			postId: insertedPosts[2].id,
			userId: author.id,
		},
		{
			postId: insertedPosts[2].id,
			userId: rider2.id,
		},
	]);

	console.log("Database seeding completed successfully.");
}

main().catch((error) => {
	console.error("Error during database seeding:", error);
	process.exit(1);
});

function tagaytayRide(): PostContent {
	return [
		heading("Weekend Ride to Tagaytay"),

		paragraph(
			"Tagaytay remains one of the easiest weekend rides for riders coming from Metro Manila. The cool weather, scenic roads, and countless coffee shops make it a perfect destination.",
		),

		heading("Suggested Departure", 2),

		bullet("Leave between 5:30 AM and 6:30 AM"),
		bullet("Avoid Aguinaldo Highway after 8 AM"),
		bullet("Bring cash for parking and breakfast"),

		divider(),

		heading("Recommended Stops", 2),

		numbered("Breakfast at Mahogany Market"),
		numbered("People's Park in the Sky"),
		numbered("Coffee overlooking Taal Volcano"),

		quote(
			"Always check weather conditions before riding. Fog can reduce visibility in the afternoon.",
		),
	];
}

function marilaqueGuide(): PostContent {
	return [
		heading("Marilaque Sunrise Ride"),

		paragraph(
			"Marilaque Highway offers one of the most scenic roads near Metro Manila. Ride responsibly and respect fellow motorists.",
		),

		heading("Safety Reminder", 2),

		bullet("Never overspeed on blind corners"),
		bullet("Avoid racing"),
		bullet("Wear complete riding gear"),

		paragraph(
			"The best experience is arriving before sunrise when traffic is still light.",
		),

		quote("The mountain is not a racetrack. Ride home safely."),
	];
}

function binondoFoodGuide(): PostContent {
	return [
		heading("Weekend Food Crawl in Binondo"),

		paragraph(
			"Binondo is one of the oldest Chinatowns in the world. You can spend an entire day exploring hidden restaurants and local delicacies.",
		),

		heading("Must Try", 2),

		bullet("Fresh lumpia"),
		bullet("Xiao Long Bao"),
		bullet("Hopia"),
		bullet("Hand-pulled noodles"),

		paragraph("Most restaurants accept cash, so bring enough for the day."),

		quote("Come hungry. Every street has something worth trying."),
	];
}
