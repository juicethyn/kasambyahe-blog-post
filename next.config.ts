import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https", // Use 'https' if your source is secured
				hostname: "img.clerk.com",
				port: "", // Leave empty unless the URL explicitly uses a port
				pathname: "/**", // Allows all image paths from this host
			},
			{
				protocol: "https", // Use 'https' if your source is secured
				hostname: "avatar.vercel.sh",
				port: "", // Leave empty unless the URL explicitly uses a port
				pathname: "/**", // Allows all image paths from this host
			},
			{
				protocol: "https", // Use 'https' if your source is secured
				hostname: "static.vecteezy.com",
				port: "", // Leave empty unless the URL explicitly uses a port
				pathname: "/**", // Allows all image paths from this host
			},
		],
	},
};

export default nextConfig;
