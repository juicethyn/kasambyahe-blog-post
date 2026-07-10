export type PostContent = Record<string, unknown>[];
export interface FeedPost {
	id: string;
	title: string;
	coverImageUrl: string | null;
	slug: string;
	excerpt: string;
	content: PostContent;
	createdAt: Date;
	author: {
		id: string;
		username: string;
		displayName: string;
		imageUrl: string | null;
	};
}
