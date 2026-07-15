"use client";

import { LayoutGrid, LayoutList } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseSort, parseView } from "@/lib/types/post";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: {
	label: string;
	value: string;
}[] = [
	{ label: "Latest", value: "latest" },
	{ label: "Popular", value: "popular" },
	{ label: "Old", value: "old" },
];

const VIEW_OPTIONS = [
	{ value: "1" as const, icon: LayoutList, label: "Single column view" },
	{ value: "2" as const, icon: LayoutGrid, label: "Two column view" },
];

export default function PostGridControls() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const activeSort = parseSort(searchParams.get("sort") ?? undefined);
	const activeView = parseView(searchParams.get("view") ?? undefined);

	function updateParams(key: "sort" | "view", value: string) {
		const params = new URLSearchParams(searchParams.toString());
		params.set(key, value);
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	}

	return (
		<div className="mb-4 flex items-center justify-between">
			<div className="flex gap-5">
				{SORT_OPTIONS.map((option) => (
					<button
						key={option.value}
						type="button"
						onClick={() => updateParams("sort", option.value)}
						className="relative pb-1"
					>
						<motion.span
							whileHover={{ y: -1 }}
							whileTap={{ scale: 0.94 }}
							className={cn(
								"inline-block font-merriweather transition-colors",
								activeSort === option.value
									? "font-semibold text-foreground"
									: "text-muted-foreground hover:text-foreground/80",
							)}
						>
							{option.label}
						</motion.span>

						{activeSort === option.value && (
							<motion.div
								layoutId="sort-underline"
								className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-foreground"
								transition={{ type: "spring", stiffness: 500, damping: 35 }}
							/>
						)}
					</button>
				))}
			</div>

			<div className="relative hidden sm:flex items-center gap-1 rounded-full bg-muted/60 p-1">
				{VIEW_OPTIONS.map(({ value, icon: Icon, label }) => (
					<button
						key={value}
						type="button"
						onClick={() => updateParams("view", value)}
						aria-label={label}
						className="relative z-10 rounded-full p-1.5"
					>
						{activeView === value && (
							<motion.div
								layoutId="view-bg"
								className="absolute inset-0 -z-10 rounded-full bg-background shadow-sm"
								transition={{ type: "spring", stiffness: 500, damping: 35 }}
							/>
						)}
						<motion.div
							whileHover={{ scale: 1.12 }}
							whileTap={{ scale: 0.9 }}
							className={cn(
								activeView === value
									? "text-foreground"
									: "text-muted-foreground",
							)}
						>
							<Icon className="size-4" />
						</motion.div>
					</button>
				))}
			</div>
		</div>
	);
}
