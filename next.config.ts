import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg packages ship native binaries and use dynamic require() — they must
  // be resolved at runtime, not bundled by webpack/turbopack.
  serverExternalPackages: ["fluent-ffmpeg", "@ffmpeg-installer/ffmpeg"],
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      console.warn("⚠️ NEXT_PUBLIC_API_BASE_URL is not set, skipping rewrites");
      return [];
    }
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiBaseUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
