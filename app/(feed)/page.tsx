import PostGrid from "@/components/PostGrid";

export default async function Home() {
	return (
		<div>
			{/* Header Message */}
			<div className="text-center my-8 lg:my-16">
				<h1 className="text-3xl lg:text-4xl text-primary font-bold font-merriweather">
					KasamByahe
				</h1>
				<h2 className="text-base lg:text-xl text-foreground mt-1">
					Discover route guides, travel tips, and community-shared posts to help
					you navigate <br className="hidden lg:block" /> destinations with more
					confidence.
				</h2>
			</div>
			{/* Filtering and Sorting Options Turn - Make it a Client Component because it uses Button*/}
			<div className="flex justify-between items-center mb-4 font-merriweather font-medium">
				<div className="flex gap-4">
					<p>Latest</p>
					<p>Popular</p>
					<p>Old</p>
				</div>
				<div>
					<p>Filtering Here</p>
				</div>
			</div>

			<PostGrid />
		</div>
	);
}
