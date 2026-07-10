import { syncUser } from "@/lib/auth/sync-user";

export default async function TestPage() {
	try {
		await syncUser();

		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<h1 className="text-2xl font-bold">User synced</h1>
				<p className="mt-2 text-center text-muted-foreground">
					Your Clerk user was synced to the database successfully.
				</p>
			</div>
		);
	} catch (error) {
		console.error("Failed to sync user:", error);

		return (
			<div className="flex min-h-screen flex-col items-center justify-center p-4">
				<h1 className="text-2xl font-bold">Sync failed</h1>
				<p className="mt-2 text-center text-muted-foreground">
					There was a problem syncing your user to the database.
				</p>
			</div>
		);
	}
}
