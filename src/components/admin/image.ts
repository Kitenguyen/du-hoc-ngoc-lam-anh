"use client";

/** Thu nhỏ & nén ảnh trên trình duyệt trước khi tải lên (cạnh dài tối đa 1600px, WebP ≤ ~900 KB). */
export async function compressImage(file: File): Promise<{ blob: Blob; w: number; h: number }> {
  if (file.type === "image/gif") return { blob: file, w: 0, h: 0 };
  const bmp = await createImageBitmap(file);
  let max = 1600;
  for (let attempt = 0; attempt < 5; attempt++) {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", attempt < 2 ? 0.82 : 0.7));
    if (blob && blob.size <= 880 * 1024) return { blob, w, h };
    max = Math.round(max * 0.75);
  }
  throw new Error("Ảnh quá lớn, không nén được xuống dưới 900 KB.");
}
