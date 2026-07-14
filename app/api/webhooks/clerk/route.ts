import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import {
	createUser,
	deleteUserByClerkUserId,
	getUserByClerkUserId,
	updateUserByClerkUserId,
} from "@/lib/db/queries/users";

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req);

		switch (evt.type) {
			case "user.created": {
				const user = evt.data;

				const email = user.email_addresses?.[0]?.email_address ?? null;

				const username =
					user.username ?? email?.split("@")[0] ?? `user_${user.id.slice(-6)}`;

				const displayName =
					[user.first_name, user.last_name].filter(Boolean).join(" ") ||
					username;

				const existingUser = await getUserByClerkUserId(user.id);

				if (!existingUser) {
					await createUser({
						clerkUserId: user.id,
						clerkUsername: username,
						displayName: displayName,
						imageUrl: user.image_url ?? null,
					});
				}

				break;
			}
			case "user.updated": {
				const user = evt.data;

				const email = user.email_addresses?.[0]?.email_address ?? null;

				const username =
					user.username ?? email?.split("@")[0] ?? `user_${user.id.slice(-6)}`;

				const displayName =
					[user.first_name, user.last_name].filter(Boolean).join(" ") ||
					username;

				await updateUserByClerkUserId({
					clerkUserId: user.id,
					clerkUsername: username,
					displayName: displayName,
					imageUrl: user.image_url ?? null,
				});

				break;
			}
			case "user.deleted": {
				if (evt.data.id) {
					await deleteUserByClerkUserId(evt.data.id);
				}
				break;
			}
		}

		return new Response("Webhook received", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
