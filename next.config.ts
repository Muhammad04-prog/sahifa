import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Prisma edge runtime workaround
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
