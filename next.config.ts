import type { NextConfig } from "next";

// Static export: every page is prerendered to HTML at build time and served from the CDN.
// There is no server, so no request ever waits on a database (the old site waited 2.8 s).
const nextConfig: NextConfig = {
  output: "export",
  // Images are pre-optimized to AVIF/WebP by scripts/images.mjs; no runtime optimizer.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
