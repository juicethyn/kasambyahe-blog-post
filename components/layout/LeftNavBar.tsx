"use client";

import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigations";
import { cn } from "@/lib/utils";

interface LeftNavBarProps {
	isOpen: boolean;
}

export default function LeftNavBar({ isOpen }: LeftNavBarProps) {
	const pathname = usePathname();

	return (
		<aside
			className={cn(
				"hidden h-full shrink-0 transition-all duration-300 ease-in-out lg:block",
				isOpen
					? "w-64 border-r-2 border-r-[FFF8F0] opacity-100"
					: "w-0 overflow-hidden border-r-0 opacity-0",
			)}
		>
			<div className="px-4 py-6 flex h-full flex-col gap-2">
				{NAV_LINKS.map((link) => (
					<Link
						key={link.id}
						href={link.href}
						className={`flex items-center gap-2 p-2 rounded-md ${pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"}`}
					>
						<link.icon className="size-6" />
						<span className="ml-2">{link.label}</span>
					</Link>
				))}
			</div>
		</aside>
	);
}
