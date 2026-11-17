import "server-only";
import { db } from "./env";

export const MAX_IMAGE_BYTES = 900 * 1024;
const MIMES = ["image/webp", "image/jpeg", "image/png", "image/gif"];

export async function saveImage(file: File, uploaderId: number, size?: { w: number; h: number }): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!MIMES.includes(file.type)) return { ok: false, error: "Chỉ nhận ảnh JPG, PNG, WebP hoặc GIF." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Ảnh quá lớn (tối đa 900 KB sau khi nén)." };
  const b = new Uint8Array(9);
  crypto.getRandomValues(b);
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const key = `${Date.now().toString(36)}-${Array.from(b, (x) => x.toString(36)).join("").slice(0, 10)}.${ext}`;
  await (await db())
    .prepare("INSERT INTO media (key, mime, size, width, height, data, uploader_id) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(key, file.type, file.size, size?.w ?? null, size?.h ?? null, await file.arrayBuffer(), uploaderId)
    .run();
  return { ok: true, url: `/media/${key}` };
}

export async function readImage(key: string): Promise<{ mime: string; data: ArrayBuffer } | null> {
  const r = await (await db()).prepare("SELECT mime, data FROM media WHERE key = ?").bind(key).first<{ mime: string; data: ArrayBuffer | number[] }>();
  if (!r) return null;
  const data = r.data instanceof ArrayBuffer ? r.data : new Uint8Array(r.data).buffer;
  return { mime: r.mime, data };
}
