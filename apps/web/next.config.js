/** @type {import('next').NextConfig} */
process.env.npm_config_user_agent = process.env.npm_config_user_agent || "npm";
const nextConfig = {
	transpilePackages: ["@repo/ui", "@repo/store", "@repo/db"],
};

export default nextConfig;
