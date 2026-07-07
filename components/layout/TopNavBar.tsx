"use client";

import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "../ui/button";

export default function TopNavBar() {
	return (
		<nav className="lg:sticky lg:top-0 lg:left-0 lg:right-0 lg:px-6 lg:h-16 flex justify-between border-b-2 border-b-[FFF8F0] bg-background">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="icon-lg">
					<RxHamburgerMenu className="size-6" />
				</Button>
				<div className="flex items-center gap-2">
					<Image
						src="/icons/kasambyahe_logo.svg"
						alt="KasamByahe Logo"
						width={32}
						height={32}
					/>
					<p className="lg:text-base lg:font-bold text-primary font-heading">
						KasamByahe
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<Button variant="outline" size="sm">
					Sign in
				</Button>
				<Button
					onClick={() => {
						alert("Sign up clicked!");
					}}
					size="sm"
				>
					Sign up
				</Button>
			</div>
		</nav>
	);
}
