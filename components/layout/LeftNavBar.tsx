"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigations";
import { cn } from "@/lib/utils";

interface LeftNavBarProps {
	isOpen: boolean;
	onRequiresAuth?: () => void;
}

export default function LeftNavBar({ isOpen }: LeftNavBarProps) {
	const pathname = usePathname();
	const { userId } = useAuth();
	const { openSignIn } = useClerk();

	return (
		<aside
			className={cn(
				"hidden h-full shrink-0 transition-all duration-300 ease-in-out lg:block",
				isOpen
					? "w-64 border-r-2 border-r-[FFF8F0] opacity-100"
					: "w-0 overflow-hidden border-r border-r-[FFF8F0] opacity-0",
			)}
		>
			<div className="px-4 py-6 flex h-full flex-col gap-2">
				{NAV_LINKS.map((link) => {
					const isActive = pathname === link.href;
					const isProtected = link.requiresAuth && !userId;
					const isSignedIn = Boolean(userId);

					const baseClass = cn(
						"flex items-center gap-2 rounded-md p-2 text-left transition-colors cursor-pointer",
						isActive ? "text-primary" : "text-foreground hover:text-primary",
					);

					if (isProtected && !isSignedIn) {
						return (
							<button
								key={link.id}
								type="button"
								onClick={() => openSignIn()}
								className={baseClass}
							>
								<link.icon className="size-6" strokeWidth={1.5} />
								<span className="ml-2">{link.label}</span>
							</button>
						);
					}

					return (
						<Link key={link.id} href={link.href} className={baseClass}>
							<link.icon className="size-6" strokeWidth={1.5} />
							<span className="ml-2">{link.label}</span>
						</Link>
					);
				})}
			</div>
		</aside>
	);
}
