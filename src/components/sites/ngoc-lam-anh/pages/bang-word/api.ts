// Dịch đoạn bằng AI cho Bảng Word — cần máy chủ. Hiện CHƯA kết nối.
// Khi có backend: đặt TRANSLATE_ENDPOINT, máy chủ nhận POST { text, dir } và trả về { zh?, pinyin?, vi? }.

export type TranslateDir = "auto" | "vt" | "tv";
export type TranslateResult = { ok: true; zh?: string; pinyin?: string; vi?: string } | { ok: false; message: string };

export const TRANSLATE_ENDPOINT = "";

export async function translateText(text: string, dir: TranslateDir): Promise<TranslateResult> {
  if (!TRANSLATE_ENDPOINT) {
    return { ok: false, message: "Dịch đoạn bằng AI cần kết nối máy chủ – trung tâm sẽ bật sau." };
  }
  try {
    const r = await fetch(TRANSLATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, dir }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = (await r.json()) as { zh?: string; pinyin?: string; vi?: string };
    return { ok: true, ...j };
  } catch (e) {
    return { ok: false, message: `Không gọi được máy chủ dịch (${e instanceof Error ? e.message : "lỗi"}).` };
  }
}
