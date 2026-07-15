export type PostContent = Record<string, unknown>[];
export interface FeedPost {
	id: string;
	title: string;
	coverImageUrl: string | null;
	coverImageKey: string | null;
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

export interface PostFormValues {
	title: string;
	excerpt: string;
	coverImageUrl: string | null;
	coverImageKey: string | null;
	content: PostContent;
}

export type SortOption = "latest" | "old" | "popular";
export type ViewOption = "1" | "2";

export function parseSort(sort?: string): SortOption {
	switch (sort) {
		case "old":
			return "old";
		case "popular":
			return "popular";
		default:
			return "latest";
	}
}

export function parseView(view?: string): ViewOption {
	return view === "1" ? "1" : "2";
}
