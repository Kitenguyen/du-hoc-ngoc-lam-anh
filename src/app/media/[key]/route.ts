import { readImage } from "@/lib/admin/media";

/** Ảnh tải lên từ dashboard (lưu trong D1). Tên tệp là duy nhất nên cache lâu được. */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!/^[a-z0-9-]+\.(webp|jpg|png|gif)$/.test(key)) return new Response("Not found", { status: 404 });
  const img = await readImage(key);
  if (!img) return new Response("Not found", { status: 404 });
  return new Response(img.data, {
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
