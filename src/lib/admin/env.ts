import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Biến môi trường và binding Cloudflare (D1, secret…) của request hiện tại. */
export async function cfEnv(): Promise<CloudflareEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export async function db(): Promise<D1Database> {
  const env = await cfEnv();
  if (!env.DB) throw new Error("Chưa cấu hình cơ sở dữ liệu D1 (binding DB) trong wrangler.jsonc");
  return env.DB;
}

/** Đăng nhập thử không qua Google – chỉ khi chạy `next dev` trên máy và .dev.vars có DEV_LOGIN=1. */
export async function devLoginEnabled(): Promise<boolean> {
  if (process.env.NODE_ENV !== "development") return false;
  const env = await cfEnv();
  return String((env as unknown as Record<string, unknown>).DEV_LOGIN ?? "") === "1";
}

export function nowIso(): string {
  return new Date().toISOString();
}
