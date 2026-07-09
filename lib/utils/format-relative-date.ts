export function formatRelativeDate(date: Date) {
	const now = new Date();

	// Remove time part so day comparison is cleaner
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	const diffInMs = today.getTime() - target.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays <= 0) return "Today";
	if (diffInDays === 1) return "Yesterday";
	if (diffInDays < 7) return `${diffInDays} days ago`;

	return date.toLocaleDateString("en-PH", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
