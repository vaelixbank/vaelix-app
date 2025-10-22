import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for dynamic routes with client components
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
