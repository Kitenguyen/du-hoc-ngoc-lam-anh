import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;

// Cho `next dev` dùng được các binding Cloudflare (getCloudflareContext)
initOpenNextCloudflareForDev();
