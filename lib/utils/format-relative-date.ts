export function formatRelativeDate(date: Date) {
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();

	const minute = 1000 * 60;
	const hour = minute * 60;
	const day = hour * 24;

	if (diffInMs < minute) {
		return "just now";
	}

	if (diffInMs < hour) {
		const minutes = Math.floor(diffInMs / minute);
		return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
	}

	if (diffInMs < day) {
		const hours = Math.floor(diffInMs / hour);
		return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
	}

	if (diffInMs < day * 7) {
		const days = Math.floor(diffInMs / day);
		return `${days} ${days === 1 ? "day" : "days"} ago`;
	}

	return date.toLocaleDateString("en-PH", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
