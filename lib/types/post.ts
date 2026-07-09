export interface FeedPost {
	id: string;
	title: string;
	coverImageUrl: string | null;
	slug: string;
	content: string;
	createdAt: Date;
	author: {
		id: string;
		username: string;
		displayName: string;
		imageUrl: string | null;
	};
}
