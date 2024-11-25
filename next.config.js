/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	images: {
		domains: [
			"www.facebook.com",
			"www.gstatic.com",
			"ssl.gstatic.com",
			"static-00.iconduck.com",
		],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lawinzo-profile-dev.s3.ap-south-1.amazonaws.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "www.facebook.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "plp-home-ui.s3.ap-south-1.amazonaws.com",
				port: "",
			},
		],
	},
};

module.exports = nextConfig;
