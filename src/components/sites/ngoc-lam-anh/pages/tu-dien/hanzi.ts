// Tiện ích chữ Hán dùng chung cho các công cụ (từ điển, bảng đen, bảng Word, trình chiếu).
// Chỉ gọi các hàm này ở phía trình duyệt (trong effect / sự kiện).
import type HanziWriterType from "hanzi-writer";
import { ALL_ENTRIES, type FlatEntry } from "./data";

export type HanziWriterClass = typeof HanziWriterType;
export type HanziWriterInstance = InstanceType<HanziWriterClass>;

const HAN_RE = /[㐀-鿿]/;

export const isHan = (c: string) => HAN_RE.test(c);
export const hasHan = (s: string) => HAN_RE.test(s);
export const hanChars = (s: string) => Array.from(s).filter(isHan);

/** Bỏ dấu, chữ thường, đ→d, ü→v — để tìm pinyin/tiếng Việt không dấu */
export function fold(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/ü/g, "v");
}

let hwPromise: Promise<HanziWriterClass> | null = null;
/** Nạp thư viện hanzi-writer (chỉ phía trình duyệt) */
export function loadHanziWriter(): Promise<HanziWriterClass> {
  if (!hwPromise) hwPromise = import("hanzi-writer").then((m) => m.default);
  return hwPromise;
}

type PinyinFn = (text: string, opts?: Record<string, unknown>) => string | string[];
let pyPromise: Promise<PinyinFn> | null = null;
/** Nạp pinyin-pro (chỉ phía trình duyệt) */
export function loadPinyin(): Promise<PinyinFn> {
  if (!pyPromise) pyPromise = import("pinyin-pro").then((m) => m.pinyin as unknown as PinyinFn);
  return pyPromise;
}

/** Phiên âm cả câu dạng chuỗi (có dấu thanh) */
export async function toPinyin(text: string): Promise<string> {
  try {
    const pinyin = await loadPinyin();
    return String(pinyin(text, { toneType: "symbol", type: "string" }));
  } catch {
    return "";
  }
}

function zhVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const vs = window.speechSynthesis.getVoices().filter((v) => /^zh([-_](CN|Hans))?/i.test(v.lang) || /Chinese|中文|普通话/i.test(v.name));
  return vs.find((v) => /zh[-_]CN/i.test(v.lang)) || vs[0] || null;
}

/** Đọc to bằng giọng đọc tiếng Trung của máy (speechSynthesis, zh-CN) */
export function speak(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (typeof window === "undefined" || !window.speechSynthesis || !text) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN";
      u.rate = rate;
      const v = zhVoice();
      if (v) u.voice = v;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    } catch {
      resolve();
    }
  });
}

export function stopSpeak() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* bỏ qua */
  }
}

/** Tìm trong từ điển mẫu: khớp chữ Hán, pinyin (có/không dấu) hoặc nghĩa tiếng Việt. Trả về danh sách đã xếp hạng. */
export function searchDict(q: string, list: FlatEntry[] = ALL_ENTRIES): FlatEntry[] {
  const query = q.trim();
  if (!query) return [];
  const han = hasHan(query);
  const fq = fold(query);
  const pq = fq.replace(/[\s']/g, "");
  const res: [number, FlatEntry][] = [];
  for (const e of list) {
    let sc = 0;
    if (han) {
      if (e.zh === query) sc = 100;
      else if (e.zh.startsWith(query)) sc = 60;
      else if (e.zh.includes(query)) sc = 40;
      else if (query.includes(e.zh)) sc = 30;
    } else {
      const ep = fold(e.py).replace(/[\s']/g, "");
      const ev = fold(e.vi);
      if (ep === pq) sc = 90;
      else if (pq.length > 1 && ep.startsWith(pq)) sc = 55;
      if (fq.length > 1) {
        const i = ev.indexOf(fq);
        if (i >= 0) sc = Math.max(sc, i === 0 || /[\s,(;]/.test(ev.charAt(i - 1)) ? 70 : 30);
      }
      if (e.vi.toLowerCase() === query.toLowerCase()) sc = 100;
    }
    if (sc) res.push([sc, e]);
  }
  res.sort((a, b) => b[0] - a[0] || a[1].zh.length - b[1].zh.length);
  return res.map((r) => r[1]);
}

/** Tra nhanh một từ chữ Hán trong từ điển mẫu */
export function lookupZh(zh: string): FlatEntry | undefined {
  return ALL_ENTRIES.find((e) => e.zh === zh);
}
