// components/posts/PostActionsMenu.tsx
"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePostAction } from "@/lib/actions/posts";

interface PostActionsMenuProps {
	postId: string;
	slug: string;
}

export default function PostActionsMenu({
	postId,
	slug,
}: PostActionsMenuProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					className="bg-background text-foreground"
				>
					<DropdownMenuItem asChild>
						<Link href={`/blogs/${slug}/edit`}>Edit Post</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						// prevent the dropdown from closing/eating the click before
						// the dialog has a chance to open
						onSelect={(e) => {
							e.preventDefault();
							setShowDeleteDialog(true);
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Hidden form reuses your existing server action untouched */}
			<form ref={formRef} action={deletePostAction} className="hidden">
				<input type="hidden" name="postId" value={postId} />
			</form>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-destructive">
							Delete this post?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							post.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/90">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={() => formRef.current?.requestSubmit()}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
