import { BsPerson } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { IoBookmarksOutline } from "react-icons/io5";
import { RxPencil2 } from "react-icons/rx";

export const NAV_LINKS = [
	{ id: "home", label: "Home", href: "/", icon: GoHome },
	{ id: "saved", label: "Saved", href: "/saved", icon: IoBookmarksOutline },
	{ id: "write", label: "Write", href: "/write", icon: RxPencil2 },
	{ id: "profile", label: "Profile", href: "/profile", icon: BsPerson },
];
