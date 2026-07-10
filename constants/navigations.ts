import { Bookmark, CircleUser, House, SquarePen } from "lucide-react";

export const NAV_LINKS = [
	{ id: "home", label: "Home", href: "/", icon: House, requiresAuth: false },
	{
		id: "saved",
		label: "Saved",
		href: "/saved",
		icon: Bookmark,
		requiresAuth: true,
	},
	{
		id: "write",
		label: "Write",
		href: "/write",
		icon: SquarePen,
		requiresAuth: true,
	},
	{
		id: "profile",
		label: "Profile",
		href: "/profile",
		icon: CircleUser,
		requiresAuth: true,
	},
];
