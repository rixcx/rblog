import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/images/articles/**',
      },
    ],
  },
};

export default nextConfig;
