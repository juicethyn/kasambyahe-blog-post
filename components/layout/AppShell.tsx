"use client";

import { useState } from "react";
import BottomNavBar from "./BottomNavBar";
import LeftNavBar from "./LeftNavBar";
import TopNavbar from "./TopNavBar";

interface AppShellProps {
	children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	function toggleSidebar() {
		setSidebarOpen(!sidebarOpen);
	}

	return (
		<div className="flex h-screen flex-col">
			<TopNavbar onToggleSidebar={toggleSidebar} />
			<div className="flex flex-1 overflow-hidden">
				<LeftNavBar isOpen={sidebarOpen} />
				<main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
			</div>
			<BottomNavBar />
		</div>
	);
}
