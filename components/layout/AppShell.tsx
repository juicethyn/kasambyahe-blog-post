"use client";

import { Suspense, useState } from "react";
import BottomNavBar from "./BottomNavBar";
import LeftNavBar from "./LeftNavBar";
import RightBar from "./RightBar";
import TopNavbar from "./TopNavBar";

interface AppShellProps {
	children: React.ReactNode;
	showRightBar?: boolean;
}

export default function AppShell({
	children,
	showRightBar = false,
}: AppShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	function toggleSidebar() {
		setSidebarOpen(!sidebarOpen);
	}

	return (
		<div className="flex h-screen flex-col">
			<TopNavbar onToggleSidebar={toggleSidebar} />
			<div className="flex flex-1 overflow-hidden">
				<Suspense fallback={<div>Loading...</div>}>
					<LeftNavBar isOpen={sidebarOpen} />
				</Suspense>
				<main className="scrollbar-hide min-w-0 flex-1 overflow-y-auto p-3 pb-20 lg:p-6">
					{children}
				</main>
				{showRightBar ? <RightBar /> : null}
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<BottomNavBar />
			</Suspense>
		</div>
	);
}
