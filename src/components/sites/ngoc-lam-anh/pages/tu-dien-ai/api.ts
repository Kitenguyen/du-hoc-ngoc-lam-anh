// Lớp gọi máy chủ cho Từ điển AI Việt ⇄ Trung.
// Dự án hiện CHƯA có máy chủ AI. Khi trung tâm có backend, đặt AI_ENDPOINT (vd "/api/tu-dien-ai")
// — máy chủ nhận POST JSON { q, dir } và trả về AiAnswer bên dưới.

export type AiDirection = "auto" | "vt" | "tv";

export type AiAnswer = {
  /** Bản dịch chính */
  translation: { zh?: string; pinyin?: string; vi?: string };
  /** Các nghĩa / cách dùng (nếu là một từ) */
  entries?: { zh: string; pinyin?: string; pos?: string; vi: string }[];
  /** Câu ví dụ */
  examples?: { zh: string; pinyin?: string; vi: string }[];
  note?: string;
};

export type AiResult = { ok: true; answer: AiAnswer } | { ok: false; reason: "not-connected" | "error"; message: string };

/** Địa chỉ API AI. Để trống = chưa kết nối. */
export const AI_ENDPOINT = "";

export async function askAiDictionary(q: string, dir: AiDirection): Promise<AiResult> {
  if (!AI_ENDPOINT) {
    return {
      ok: false,
      reason: "not-connected",
      message: "Từ điển AI chưa được kết nối máy chủ – trung tâm sẽ bật tính năng này sau.",
    };
  }
  try {
    const r = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, dir }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const answer = (await r.json()) as AiAnswer;
    return { ok: true, answer };
  } catch (e) {
    return { ok: false, reason: "error", message: `Không gọi được máy chủ AI (${e instanceof Error ? e.message : "lỗi"}).` };
  }
}
