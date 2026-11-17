// Nhận dạng giọng nói (Web Speech API) + chấm điểm cục bộ cho trang Luyện nói.
// Không gửi dữ liệu lên máy chủ của trung tâm. (Lưu ý: Chrome tự xử lý giọng nói qua dịch vụ của Google.)

/* ---------- kiểu tối thiểu cho SpeechRecognition (TypeScript chưa có sẵn) ---------- */
type SRAlternative = { transcript: string };
type SRResult = { isFinal: boolean; length: number; [i: number]: SRAlternative };
type SRResultList = { length: number; [i: number]: SRResult };
type SREvent = { resultIndex: number; results: SRResultList };
type SRErrorEvent = { error: string };
type SRInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SRCtor = new () => SRInstance;
type SRWindow = Window & { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };

export function getSR(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as SRWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type ListenUI = { start?: () => void; tick?: (left: number) => void; text?: (t: string) => void };
export type ListenResult = { text: string; err: string };
export type ListenHandle = { promise: Promise<ListenResult>; stop: () => void; abort: () => void };

/** Nghe liên tục tối đa `sec` giây (tự bật lại khi trình duyệt ngắt sớm) */
export function listen(sec: number, ui: ListenUI = {}): ListenHandle {
  const SR = getSR();
  let stopFn = () => undefined as void;
  let abortFn = () => undefined as void;
  const promise = new Promise<ListenResult>((ok) => {
    if (!SR) {
      ok({ text: "", err: "nosr" });
      return;
    }
    const r = new SR();
    const fin: string[] = [];
    let interim = "";
    let ended = false;
    let stopped = false;
    let err = "";
    let tries = 0;
    const t0 = Date.now();
    r.lang = "zh-CN";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const x = e.results[i];
        if (x.isFinal) fin.push(x[0].transcript);
        else interim += x[0].transcript;
      }
      ui.text?.(fin.join("") + interim);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
        err = e.error;
        stopped = true;
      }
    };
    const done = () => {
      if (ended) return;
      ended = true;
      clearTimeout(tm);
      clearInterval(ti);
      if (interim) fin.push(interim);
      ok({ text: fin.join(""), err });
    };
    r.onend = () => {
      if (!stopped && Date.now() - t0 < sec * 1000 - 400 && tries < 8) {
        tries++;
        try {
          r.start();
          return;
        } catch {
          /* rơi xuống done */
        }
      }
      done();
    };
    stopFn = () => {
      if (stopped) return;
      stopped = true;
      try {
        r.stop();
      } catch {
        /* bỏ qua */
      }
      setTimeout(done, 1500);
    };
    abortFn = () => {
      stopped = true;
      try {
        r.abort();
      } catch {
        /* bỏ qua */
      }
      done();
    };
    let n = sec;
    const tm = setTimeout(() => stopFn(), sec * 1000);
    const ti = setInterval(() => {
      n--;
      ui.tick?.(Math.max(0, n));
    }, 1000);
    try {
      r.start();
      ui.start?.();
    } catch {
      done();
    }
  });
  return { promise, stop: () => stopFn(), abort: () => abortFn() };
}

/* ---------- chuẩn hóa chữ Hán, số ---------- */
const HZ = /[㐀-鿿]/g;
export function han(s: string): string {
  return (s.match(HZ) ?? []).join("");
}
const DG = "零一二三四五六七八九";
function n2z(n: number): string {
  if (n < 10) return DG[n];
  if (n < 20) return `十${n % 10 ? DG[n % 10] : ""}`;
  if (n < 100) return `${DG[Math.floor(n / 10)]}十${n % 10 ? DG[n % 10] : ""}`;
  if (n < 1000) {
    const r = n % 100;
    return `${DG[Math.floor(n / 100)]}百${r ? (r < 10 ? `零${DG[r]}` : (r < 20 ? "一" : "") + n2z(r)) : ""}`;
  }
  if (n < 10000) {
    const r = n % 1000;
    return `${DG[Math.floor(n / 1000)]}千${r ? (r < 100 ? `零${n2z(r)}` : n2z(r)) : ""}`;
  }
  return String(n);
}
/** Đổi chữ số (máy nhận dạng hay trả "8点") sang chữ Hán rồi chỉ giữ chữ Hán */
export function norm(s: string): string {
  const z = s.replace(/\d+/g, (m) => (m.length > 1 && m[0] === "0" ? m.split("").map((d) => DG[+d]).join("") : n2z(+m)));
  return han(z);
}

/** Độ giống nhau 0–1 theo dãy con chung dài nhất */
export function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return (2 * dp[a.length][b.length]) / (a.length + b.length);
}

export type QaGrade = { ok: boolean; comment: string };

/** Chấm gần đúng câu trả lời tự do: có từ khóa phù hợp hoặc giống câu mẫu ≥ 50% */
export function gradeAnswer(answer: string, refs: string[], keys: string[]): QaGrade {
  const a = norm(answer);
  if (!a) return { ok: false, comment: "Không nghe thấy câu trả lời." };
  if (a.length < 2) return { ok: false, comment: "Câu trả lời quá ngắn – hãy nói thành câu đầy đủ." };
  const sim = Math.max(...refs.map((r) => similarity(a, norm(r))));
  const hit = keys.filter((k) => a.includes(norm(k)));
  if (sim >= 0.5) return { ok: true, comment: `Đạt – giống câu mẫu ${Math.round(sim * 100)}%.` };
  if (hit.length) return { ok: true, comment: `Đạt – có dùng từ khóa đúng ý: ${hit.join("、")}.` };
  return { ok: false, comment: "Chưa đúng trọng tâm câu hỏi – xem câu trả lời mẫu." };
}

/* ---------- so khớp nhắc lại (chấp nhận chữ đồng âm do máy nhận dạng) ---------- */
type PinyinFn = (s: string, o: { toneType: "none"; type: "array" }) => string[];
let pinyinFn: Promise<PinyinFn | null> | null = null;
export function loadPinyin(): Promise<PinyinFn | null> {
  if (!pinyinFn)
    pinyinFn = import("pinyin-pro")
      .then((m) => m.pinyin as unknown as PinyinFn)
      .catch(() => null);
  return pinyinFn;
}

export type RepeatResult = { ok: boolean; pct: number; marks: { ch: string; ok: boolean }[] };

/** So câu nói lại với câu gốc: đúng 100% chữ (hoặc đúng âm) mới đạt; đánh dấu chữ thiếu/sai */
export async function matchRepeat(said: string, ref: string): Promise<RepeatResult> {
  const r = norm(ref);
  const s = norm(said);
  const P = await loadPinyin();
  const toPy = (x: string) => (P ? P(x, { toneType: "none", type: "array" }).map((y) => y.replace(/ü/g, "v")) : x.split(""));
  const rp = toPy(r);
  const sp = toPy(s);
  // dãy con chung dài nhất theo âm, rồi truy vết để đánh dấu chữ gốc nào khớp
  const dp = Array.from({ length: rp.length + 1 }, () => new Array<number>(sp.length + 1).fill(0));
  for (let i = 1; i <= rp.length; i++)
    for (let j = 1; j <= sp.length; j++)
      dp[i][j] = rp[i - 1] === sp[j - 1] || r[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const okIdx = new Set<number>();
  let i = rp.length;
  let j = sp.length;
  while (i > 0 && j > 0) {
    if ((rp[i - 1] === sp[j - 1] || r[i - 1] === s[j - 1]) && dp[i][j] === dp[i - 1][j - 1] + 1) {
      okIdx.add(i - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  const marks = r.split("").map((ch, k) => ({ ch, ok: okIdx.has(k) }));
  const pct = r.length ? Math.round((okIdx.size / r.length) * 100) : 0;
  const extra = sp.length - okIdx.size;
  return { ok: pct === 100 && extra <= 1, pct, marks };
}
