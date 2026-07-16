import Image from "next/image";

interface ProfileHeaderProps {
	user: {
		displayName: string;
		clerkUsername: string | null;
		imageUrl: string | null;
	};
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
	return (
		<div className="flex flex-col items-center gap-3 text-center my-8 lg:my-16">
			<Image
				src={user.imageUrl || "https://avatar.vercel.sh/shadcn1"}
				alt={user.displayName}
				width={96}
				height={96}
				className="h-24 w-24 rounded-full object-cover"
			/>
			<h1 className="text-2xl lg:text-3xl font-bold font-merriweather">
				{user.displayName}
			</h1>
			{user.clerkUsername && (
				<p className="text-muted-foreground">@{user.clerkUsername}</p>
			)}
		</div>
	);
}
