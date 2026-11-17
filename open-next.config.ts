import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Trang hầu hết là tĩnh nên chưa cần bộ nhớ đệm R2 (xem https://opennext.js.org/cloudflare/caching).
const config = {
  ...defineCloudflareConfig(),
  // `npm run build` gọi OpenNext; OpenNext chạy bước build Next.js bằng lệnh này
  buildCommand: "npm run build:next",
};

export default config;
