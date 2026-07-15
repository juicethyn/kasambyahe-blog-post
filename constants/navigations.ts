import { CircleUser, House, SquarePen } from "lucide-react";

export const NAV_LINKS = [
	{ id: "home", label: "Home", href: "/", icon: House, requiresAuth: false },
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
