// Đọc / bóc tách từ vựng cho "Từ điển của tôi" — chạy hoàn toàn trên trình duyệt.
import type * as PdfJs from "pdfjs-dist";

export type MyWord = { id: string; zh: string; py: string; pos: string; vi: string; ex: string; at: number };
export type Draft = Omit<MyWord, "id" | "at">;

export const emptyDraft = (): Draft => ({ zh: "", py: "", pos: "", vi: "", ex: "" });

const HAN = /[㐀-鿿]/;
const VI_ONLY = /[ạảãắằẳẵặấầẩẫậẻẽẹếềểễệỉĩịỏõọốồổỗộớờởỡợủũụứừửữựỳýỷỹỵđăâêôơư]/i;
const PINYIN_TOKEN = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü'’·-]+$/i;
const POS_WORDS = [
  "danh từ", "động từ", "tính từ", "phó từ", "lượng từ", "giới từ", "liên từ", "trợ từ", "đại từ", "số từ", "thán từ",
  "danh động từ", "cụm từ", "thành ngữ",
];
const POS_SHORT = /^(dt|đt|tt|pt|lt|gt|n|v|adj|adv|名|动|形|副|量|介|连|助|代)[.:)]?$/i;

const SYL = "(?:[bpmfdtnlgkhjqxzcsrwy]|zh|ch|sh)?(?:i(?:a(?:o|ng|n)?|e|u|ng|n|ong|o)?|u(?:a(?:i|ng|n)?|o|i|n|e)?|v(?:e|n)?|a(?:i|o|ng|n)?|e(?:i|ng|n|r)?|o(?:u|ng)?|r)";
const PY_WORD = new RegExp(`^(?:${SYL}'?)+$`);

/** Token có phải phiên âm (pinyin) hợp lệ không: chỉ gồm các âm tiết pinyin, không có chữ cái riêng tiếng Việt */
function isPinyinToken(tok: string): boolean {
  const t = tok.replace(/[[\]/()’·-]/g, "");
  if (!t || VI_ONLY.test(t) || !PINYIN_TOKEN.test(t)) return false;
  const ascii = t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ü/g, "v").replace(/\d/g, "");
  return PY_WORD.test(ascii);
}

function startsWithPos(s: string): boolean {
  const low = s.toLowerCase();
  if (POS_WORDS.some((p) => low.startsWith(p))) return true;
  return POS_SHORT.test((low.split(" ")[0] || "").replace(/[()]/g, ""));
}

function clean(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

/** Tách một dòng tự do kiểu: "开心 kāixīn tính từ vui vẻ" */
export function parseLine(line: string): Draft | null {
  const t = clean(line).replace(/^\d+[.)、]\s*/, "");
  if (!t || !HAN.test(t)) return null;
  const m = t.match(/^([㐀-鿿·…（）]+)/);
  if (!m) return null;
  const zh = m[1].replace(/\s+/g, "");
  let rest = t.slice(m[0].length).replace(/^[\s:：\-–—=,，]+/, "");
  // Phiên âm: các token latinh không chứa chữ cái riêng tiếng Việt
  const toks = rest.split(" ");
  const py: string[] = [];
  const need = Array.from(zh).filter((c) => HAN.test(c)).length;
  let syl = 0;
  // Lấy token pinyin cho tới khi đủ số âm tiết bằng số chữ Hán
  while (toks.length && syl < need && isPinyinToken(toks[0]) && !startsWithPos(toks.join(" "))) {
    const tok = toks.shift() as string;
    py.push(tok);
    syl += (tok.normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[aeiouv]+/gi) || []).length;
  }
  rest = toks.join(" ").replace(/^[\s:：\-–—=,，]+/, "");
  // Từ loại
  let pos = "";
  const low = rest.toLowerCase();
  const full = POS_WORDS.find((p) => low.startsWith(p));
  if (full) {
    pos = rest.slice(0, full.length);
    rest = rest.slice(full.length);
  } else {
    const first = rest.split(" ")[0] || "";
    if (POS_SHORT.test(first.replace(/[()]/g, ""))) {
      pos = first.replace(/[()]/g, "");
      rest = rest.slice(first.length);
    }
  }
  rest = rest.replace(/^[\s:：\-–—=,，)]+/, "");
  // Ví dụ (sau "VD:", "Ví dụ:", "例:")
  let ex = "";
  const exm = rest.match(/\s*(?:vd|ví dụ|例|如)\s*[:：]\s*(.+)$/i);
  if (exm) {
    ex = exm[1].trim();
    rest = rest.slice(0, exm.index).trim();
  }
  return { zh, py: py.join(" "), pos, vi: rest.trim(), ex };
}

/** Bảng (Excel/CSV/dán tab): nhận diện cột theo tiêu đề; không có tiêu đề thì theo thứ tự Hán, phiên âm, loại, nghĩa, ví dụ */
export function parseRows(input: unknown[][]): Draft[] {
  const rows = input.map((r) => r.map(clean)).filter((r) => r.join("").trim() !== "");
  if (!rows.length) return [];
  let map: Partial<Record<keyof Draft, number>> = { zh: 0, py: 1, pos: 2, vi: 3, ex: 4 };
  let start = 0;
  const h = rows[0].map((c) => c.toLowerCase());
  const looksHeader = !h.some((c) => HAN.test(c) && !/汉|漢|中文|词|例/.test(c)) &&
    h.some((c) => /hán|han|chữ|pinyin|phiên|âm|nghĩa|nghia|loại|loai|ví dụ|vi du|từ|tu|word|mean/.test(c));
  if (looksHeader) {
    start = 1;
    const m: Partial<Record<keyof Draft, number>> = {};
    h.forEach((c, i) => {
      if (m.zh == null && /hán|han|汉|漢|中文|hanzi|chinese|^từ$|^tu$|word/.test(c)) m.zh = i;
      else if (m.py == null && /pinyin|phiên|phien|âm|bính/.test(c)) m.py = i;
      else if (m.pos == null && /loại|loai|词性|class|pos/.test(c)) m.pos = i;
      else if (m.vi == null && /nghĩa|nghia|dịch|dich|意思|意义|mean|việt/.test(c)) m.vi = i;
      else if (m.ex == null && /ví dụ|vi du|例|example|câu|cau/.test(c)) m.ex = i;
    });
    if (m.zh == null) m.zh = 0;
    if (m.vi == null) m.vi = m.zh === 0 ? (rows[0].length > 1 ? 1 : 0) : 0;
    map = m;
  }
  const get = (r: string[], k: keyof Draft) => (map[k] != null ? r[map[k] as number] ?? "" : "");
  const out: Draft[] = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i];
    const zh = get(r, "zh");
    if (!zh) continue;
    if (r.length === 1) {
      const p = parseLine(zh);
      if (p) out.push(p);
      continue;
    }
    out.push({ zh, py: get(r, "py"), pos: get(r, "pos"), vi: get(r, "vi"), ex: get(r, "ex") });
  }
  return out;
}

/** Văn bản dán / TXT / chữ trong PDF */
export function parseText(text: string): Draft[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const tabby = lines.length > 1 && lines.filter((l) => l.includes("\t")).length >= lines.length * 0.6;
  if (tabby) return parseRows(lines.map((l) => l.split("\t")));
  return lines.map(parseLine).filter((x): x is Draft => !!x);
}

export async function readSheet(file: File): Promise<Draft[]> {
  const XLSX = await import("xlsx");
  // CSV đọc dạng chữ UTF-8 (tránh lỗi font tiếng Việt / chữ Hán); Excel đọc nhị phân
  const wb = /\.csv$/i.test(file.name)
    ? XLSX.read((await file.text()).replace(/^﻿/, ""), { type: "string" })
    : XLSX.read(await file.arrayBuffer(), { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "" });
  return parseRows(rows);
}

const PDF_BASE = "/sites/ngoc-lam-anh/tu-dien-cua-toi/";
let pdfPromise: Promise<typeof PdfJs> | null = null;

/**
 * Nạp pdf.js (pdfjs-dist@3.11.174). Bản build của pdfjs v3 có nhánh Node `require("canvas")`
 * nên không cho bundler xử lý: dùng bản pdf.min.js + pdf.worker.min.js chép sẵn trong public/.
 */
function loadPdfJs(): Promise<typeof PdfJs> {
  const w = window as unknown as { pdfjsLib?: typeof PdfJs };
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib);
  if (!pdfPromise)
    pdfPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PDF_BASE + "pdf.min.js";
      s.onload = () => {
        if (!w.pdfjsLib) return reject(new Error("Không nạp được pdf.js"));
        w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_BASE + "pdf.worker.min.js";
        resolve(w.pdfjsLib);
      };
      s.onerror = () => {
        pdfPromise = null;
        reject(new Error("Không nạp được pdf.js"));
      };
      document.head.appendChild(s);
    });
  return pdfPromise;
}

/** Lấy chữ trong PDF (tối đa 60 trang), ghép theo dòng */
export async function readPdfText(file: File): Promise<string> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const all: string[] = [];
  const max = Math.min(pdf.numPages, 60);
  for (let p = 1; p <= max; p++) {
    const page = await pdf.getPage(p);
    const c = await page.getTextContent();
    let last: number | null = null;
    let line = "";
    for (const it of c.items) {
      if (!("str" in it)) continue;
      const y = it.transform[5] as number;
      if (last != null && Math.abs(y - last) > 4) {
        all.push(line);
        line = "";
      }
      line += it.str + " ";
      last = y;
    }
    if (line.trim()) all.push(line);
  }
  return all.join("\n");
}

/** Bổ sung phiên âm còn thiếu bằng pinyin-pro */
export async function fillPinyin(list: Draft[]): Promise<Draft[]> {
  if (!list.some((d) => !d.py && d.zh)) return list;
  const { pinyin } = await import("pinyin-pro");
  return list.map((d) => (d.py || !d.zh ? d : { ...d, py: pinyin(d.zh, { toneType: "symbol" }) }));
}
