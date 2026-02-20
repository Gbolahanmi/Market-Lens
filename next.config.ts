import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // Enable Partial Pre-rendering with component caching
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
