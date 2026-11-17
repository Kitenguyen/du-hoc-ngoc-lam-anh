import "server-only";
import BUNDLED from "@/content/site.json";
import { cfEnv } from "./env";

// Nội dung trang web (liên hệ, ưu đãi, học phí) nằm trong src/content/site.json của kho GitHub.
// Dashboard đọc/ghi file đó qua GitHub API; mỗi lần lưu tạo một commit → Cloudflare tự build lại (vài phút).
// Cần secret GITHUB_TOKEN: fine-grained token chỉ cho kho này, quyền "Contents: Read and write".

export const CONTENT_PATH = "src/content/site.json";

export type SiteContent = typeof BUNDLED;

type GhFile = { content: string; sha: string };

function b64ToUtf8(b64: string): string {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function utf8ToB64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function gh() {
  const env = await cfEnv();
  const token = (env as unknown as Record<string, string | undefined>).GITHUB_TOKEN ?? "";
  return { token, repo: env.GITHUB_REPO, branch: env.GITHUB_BRANCH || "main" };
}

export async function githubConfigured(): Promise<boolean> {
  const g = await gh();
  return Boolean(g.token && g.repo);
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "nla-dashboard",
  };
}

/** Nội dung mới nhất trên GitHub (kể cả bản vừa lưu nhưng web chưa build xong). Không có token → bản đang chạy. */
export async function readContent(): Promise<{ content: SiteContent; sha: string | null; source: "github" | "bundled" }> {
  const g = await gh();
  if (!g.token || !g.repo) return { content: BUNDLED, sha: null, source: "bundled" };
  const res = await fetch(`https://api.github.com/repos/${g.repo}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(g.branch)}`, {
    headers: headers(g.token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub trả lỗi ${res.status} khi đọc nội dung`);
  const f = (await res.json()) as GhFile;
  return { content: JSON.parse(b64ToUtf8(f.content)) as SiteContent, sha: f.sha, source: "github" };
}

export async function writeContent(content: SiteContent, sha: string, message: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const g = await gh();
  if (!g.token || !g.repo) return { ok: false, error: "Chưa cấu hình GITHUB_TOKEN nên chưa lưu được." };
  const res = await fetch(`https://api.github.com/repos/${g.repo}/contents/${CONTENT_PATH}`, {
    method: "PUT",
    headers: { ...headers(g.token), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: utf8ToB64(`${JSON.stringify(content, null, 2)}\n`), sha, branch: g.branch }),
  });
  if (res.status === 409 || res.status === 422) return { ok: false, error: "Nội dung vừa được người khác sửa – tải lại trang rồi lưu lại." };
  if (!res.ok) return { ok: false, error: `GitHub trả lỗi ${res.status} khi lưu.` };
  return { ok: true };
}
