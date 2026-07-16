export interface PostComment {
	id: string;
	content: string;
	approved: boolean;
	createdAt: Date;
	author: {
		id: string;
		displayName: string;
		username: string | null;
		imageUrl: string | null;
	};
}
