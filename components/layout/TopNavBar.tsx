"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "../ui/button";

interface TopNavBarProps {
	onToggleSidebar?: () => void;
}

export default function TopNavBar({ onToggleSidebar }: TopNavBarProps) {
	return (
		<nav className="lg:sticky lg:top-0 px-3 lg:px-6 min-h-14 lg:h-16 z-50 flex justify-between border-b border-b-[FFF8F0] bg-background">
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon-lg"
					className="hidden lg:flex"
					onClick={onToggleSidebar}
				>
					<RxHamburgerMenu className="size-6" />
				</Button>
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/icons/kasambyahe_logo.svg"
						alt="KasamByahe Logo"
						width={32}
						height={32}
					/>
					<p className="hidden lg:block lg:text-base lg:font-bold text-primary font-heading">
						KasamByahe
					</p>
				</Link>
			</div>

			<div className="flex justify-center items-center gap-4">
				<Show when="signed-out">
					<SignInButton mode="modal">
						<Button variant="outline" size="sm">
							Sign in
						</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button size="sm">Sign up</Button>
					</SignUpButton>
				</Show>

				<Show when="signed-in">
					<UserButton />
				</Show>
			</div>
		</nav>
	);
}
