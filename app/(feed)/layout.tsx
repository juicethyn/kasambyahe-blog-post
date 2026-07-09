import type { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";

export default function FeedLayout({ children }: { children: ReactNode }) {
	return <AppShell showRightBar>{children}</AppShell>;
}
