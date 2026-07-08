"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigations";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#FFF8F0] bg-background/95 backdrop-blur lg:hidden">
			<div className="grid h-16 grid-cols-4">
				{NAV_LINKS.slice(0, 4).map((link) => {
					const isActive = pathname === link.href;

					return (
						<Link
							key={link.id}
							href={link.href}
							className={cn(
								"flex flex-col items-center justify-center gap-1 text-xs",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-primary",
							)}
						>
							<link.icon className="size-5" />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
