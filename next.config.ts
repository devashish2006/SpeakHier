import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TS build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors
  },
};

export default nextConfig;
