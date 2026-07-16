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
				title:
					"Weekend Ride to Tagaytay: A Beginner's Guide to Your First Scenic Ride",
				slug: "weekend-ride-to-tagaytay-beginner-guide",
				excerpt:
					"Planning your first ride to Tagaytay? Here's a beginner-friendly guide covering the best departure time, recommended routes, fuel stops, parking tips, and must-visit cafés for a relaxing weekend escape.",
				content: tagaytayRide(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk5I3Ya5LWykHB9sqN41PaiLQ5fOKzhCJdFGMrg",
				coverImageKey: "1Q0Zj8paxwk5I3Ya5LWykHB9sqN41PaiLQ5fOKzhCJdFGMrg",
			},
			{
				title:
					"Marilaque Sunrise Ride: A Beginner's Guide to Riding Responsibly",
				slug: "marilaque-sunrise-ride-beginner-guide",
				excerpt:
					"Marilaque is one of the Philippines' most iconic riding destinations. Learn the best time to leave, must-visit stops, and essential safety reminders to enjoy the mountain roads responsibly.",
				content: marilaqueRide(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk55qiEyVXx3DoeluEiORcFWvIw1QJy92h7N0KG",
				coverImageKey: "1Q0Zj8paxwk55qiEyVXx3DoeluEiORcFWvIw1QJy92h7N0KG",
			},
			{
				title: "Top 5 Rider-Friendly Food Stops Along Marilaque",
				slug: "top-5-rider-friendly-food-stops-along-marilaque",
				excerpt:
					"A good ride isn't complete without great food. Here are five rider-favorite cafés and eateries along Marilaque where you can rest, refuel, and enjoy the view before continuing your journey.",
				content: marilaqueFoodStops(),
				authorId: author.id,
				coverImageUrl:
					"https://b5xxp82q3r.ufs.sh/f/1Q0Zj8paxwk5qR9rVLh09E2M8kzXL1Np5HbfxgTICAnBWtoj",
				coverImageKey: "1Q0Zj8paxwk5qR9rVLh09E2M8kzXL1Np5HbfxgTICAnBWtoj",
			},
		] as NewPost[])
		.returning();

	if (insertedPosts.length >= 3) {
		await db.insert(comments).values([
			{
				postId: insertedPosts[0].id,
				authorId: author.id,
				content:
					"I usually leave around 5:30 AM and the roads are still pretty clear. Definitely makes the ride more relaxing.",
			},
			{
				postId: insertedPosts[0].id,
				authorId: rider1.id,
				content:
					"Mahogany Market is always my first stop. Nothing beats hot bulalo after an early morning ride.",
			},
			{
				postId: insertedPosts[0].id,
				authorId: rider2.id,
				content:
					"Great reminder about the afternoon fog. It gets surprisingly thick near People's Park.",
			},
			{
				postId: insertedPosts[0].id,
				authorId: rider3.id,
				content:
					"Tagaytay is overrated. Complete waste of gas. Don't even bother going.",
			},

			{
				postId: insertedPosts[1].id,
				authorId: author.id,
				content:
					"Marilaque is beautiful, but it's much more enjoyable when everyone rides responsibly.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: rider3.id,
				content:
					"I've started riding there on weekdays instead of Sundays. Less traffic and a much more peaceful experience.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: rider1.id,
				content:
					"Full riding gear and defensive riding should always come first, especially on the mountain curves.",
			},
			{
				postId: insertedPosts[1].id,
				authorId: rider2.id,
				content: "Forget the speed limit. Just send it if the road is clear 😂",
			},

			{
				postId: insertedPosts[2].id,
				authorId: rider2.id,
				content:
					"Jariel's Peak has become our group's default breakfast stop every Sunday ride.",
			},
			{
				postId: insertedPosts[2].id,
				authorId: author.id,
				content:
					"I'd also recommend trying the local eateries once you reach Infanta. Fresh seafood after a long ride is hard to beat.",
			},
			{
				postId: insertedPosts[2].id,
				authorId: rider3.id,
				content:
					"Kape Natividad serves great coffee. Perfect place to cool down before heading back home.",
			},
			{
				postId: insertedPosts[2].id,
				authorId: rider1.id,
				content:
					"🔥 SELLING CHEAP HELMETS 🔥 Message me on Facebook for discounts!!",
			},
		]);
	}

	await db.insert(likes).values([
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
			"Tagaytay is one of the most beginner-friendly destinations for riders and drivers coming from Metro Manila. With its cool climate, scenic mountain roads, and breathtaking views of Taal Volcano, it's the perfect place to escape the city's busy streets for a relaxing weekend ride.",
		),

		heading("Best Time to Leave", 2),

		bullet("Leave between 5:30 AM and 6:30 AM to avoid heavy traffic."),
		bullet("Take the SLEX → Santa Rosa Exit route for a smoother ride."),
		bullet("Avoid Aguinaldo Highway after 8:00 AM on weekends."),
		bullet("Fill up your tank before entering Tagaytay proper."),

		divider(),

		heading("Things to Bring", 2),

		bullet("Driver's License and OR/CR"),
		bullet("Rain gear (weather changes quickly in Tagaytay)"),
		bullet("Cash for parking, tolls, and local eateries"),
		bullet("Power bank and phone mount for navigation"),
		bullet("Drinking water"),

		divider(),

		heading("Recommended Stops", 2),

		numbered("Mahogany Beef Market for an affordable breakfast."),
		numbered("People's Park in the Sky for panoramic mountain views."),
		numbered("Crosswinds for a relaxing coffee break."),
		numbered("Sky Ranch for families and sunset views."),
		numbered("Picnic Grove for sightseeing and fresh air."),

		divider(),

		heading("Ride Safety Tips", 2),

		bullet("Maintain a safe following distance on downhill roads."),
		bullet("Reduce speed when roads are wet or foggy."),
		bullet("Use engine braking instead of relying only on your brakes."),
		bullet("Ride within your comfort zone, especially on blind corners."),

		quote(
			"The goal isn't to get there first—it's to get there safely and enjoy every kilometer of the journey.",
		),
	];
}

function marilaqueRide(): PostContent {
	return [
		heading("Marilaque Sunrise Ride"),

		paragraph(
			"Stretching across Rizal and Quezon, Marilaque Highway has become one of the most popular riding destinations in the Philippines. The winding mountain roads, cool morning breeze, and scenic viewpoints attract thousands of riders every weekend. Whether it's your first visit or your tenth, riding responsibly is what makes the journey enjoyable for everyone.",
		),

		heading("Best Time to Leave", 2),

		bullet("Leave between 4:30 AM and 5:30 AM."),
		bullet("Expect heavier traffic after 8:00 AM."),
		bullet("Ride before the sun gets too hot."),
		bullet("Check weather conditions before heading out."),

		divider(),

		heading("Things to Bring", 2),

		bullet("Full riding gear"),
		bullet("Rain gear"),
		bullet("Cash for food and parking"),
		bullet("Hydration bottle"),
		bullet("Portable tire inflator or repair kit"),

		divider(),

		heading("Recommended Stops", 2),

		numbered("Jariel's Peak for breakfast and coffee."),
		numbered("The Monkey Point viewpoint for scenic photos."),
		numbered("Sierra Madre Hotel for a quick rest."),
		numbered("Local eateries in Infanta if continuing the ride."),

		divider(),

		heading("Ride Responsibly", 2),

		bullet("Stay within your lane at all times."),
		bullet("Avoid overtaking on blind corners."),
		bullet("Respect fellow riders, cyclists, and motorists."),
		bullet("Never race on public roads."),
		bullet("Ride according to your skill level."),

		quote(
			"Marilaque isn't famous because of speed—it's famous because of the incredible roads and scenery. Ride safe so you can always come back for another sunrise.",
		),
	];
}

function marilaqueFoodStops(): PostContent {
	return [
		heading("Top 5 Rider-Friendly Food Stops Along Marilaque"),

		paragraph(
			"One of the best parts of riding Marilaque isn't just the winding roads—it's discovering cafés and restaurants where riders gather to rest, grab breakfast, and enjoy the mountain scenery. Whether you're riding solo or with friends, these stops are worth adding to your itinerary.",
		),

		heading("1. Jariel's Peak", 2),

		paragraph(
			"A classic stop for riders. Enjoy affordable meals, hot coffee, and one of the best mountain views along the highway.",
		),

		heading("2. Kape Natividad", 2),

		paragraph(
			"A cozy café perfect for relaxing after the twisty roads. Their brewed coffee pairs perfectly with the cool mountain weather.",
		),

		heading("3. Sierra Madre Hotel", 2),

		paragraph(
			"A quiet place to stretch, grab refreshments, and enjoy the surrounding scenery before continuing your ride.",
		),

		heading("4. Local Carinderias in Infanta", 2),

		paragraph(
			"If you're continuing all the way to Infanta, you'll find plenty of affordable seafood and local Filipino dishes that are perfect after a long ride.",
		),

		heading("5. Roadside Coffee Stops", 2),

		paragraph(
			"Several small coffee stalls have popped up along Marilaque. They're inexpensive, rider-friendly, and offer great places to meet fellow enthusiasts.",
		),

		divider(),

		heading("Rider Tips", 2),

		bullet("Bring cash—many small cafés don't accept digital payments."),
		bullet("Park only in designated areas."),
		bullet("Support local businesses whenever possible."),
		bullet("Stay hydrated before continuing your ride."),

		quote(
			"Sometimes the best memories aren't made at the destination—but over coffee with fellow riders along the way.",
		),
	];
}
