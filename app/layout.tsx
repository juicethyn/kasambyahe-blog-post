import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppShell from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const merriweatherHeading = Merriweather({
	subsets: ["latin"],
	variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: {
		default: "KasamByahe",
		template: "%s | KasamByahe",
	},
	description:
		"A travel and route guide platform for new motorcycle riders and car owners in the Philippines",
	applicationName: "KasamByahe",
	keywords: [
		"KasamByahe",
		"Philippines travel blog",
		"motorcycle travel guide",
		"car travel guide",
		"route guide Philippines",
		"road trip blog",
		"beginner rider tips",
		"new car owner guide",
		"commute and route tips",
	],
	authors: [
		{ name: "Juzzthyn Perez", url: "https://juzzthynperez.vercel.app" },
	],
	creator: "KasamByahe Team",
	publisher: "KasamByahe Team",
	metadataBase: new URL("https://kasambyahe.vercel.app"),
	openGraph: {
		title: "KasamByahe",
		description:
			"A travel and route guide platform for new motorcycle riders and car owners in the Philippines",
		url: "https://kasambyahe.vercel.app",
		siteName: "KasamByahe",
		locale: "en_PH",
		type: "website",
	},
	icons: {
		icon: "/icon.svg",
		shortcut: "/icon.svg",
		apple: "/icon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				"font-sans",
				inter.variable,
				merriweatherHeading.variable,
			)}
		>
			<body className="min-h-screen overflow-hidden bg-background text-foreground">
				<ClerkProvider>
					<AppShell>{children}</AppShell>
				</ClerkProvider>
			</body>
		</html>
	);
}
