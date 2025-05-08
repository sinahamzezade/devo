import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"],
  },
  reactStrictMode: true,
  devIndicators: false,
};

export default nextConfig;
