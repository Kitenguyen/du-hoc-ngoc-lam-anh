// Tiện ích dùng chung cho các công cụ học (từ vựng, trò chơi, luyện nói) — chỉ chạy trên trình duyệt.

/** Đọc localStorage (JSON), lỗi/không có thì trả giá trị mặc định */
export function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

/** Ghi localStorage (JSON), bỏ qua lỗi (chế độ riêng tư, đầy bộ nhớ…) */
export function lsSet(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bỏ qua */
  }
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Lấy n phần tử ngẫu nhiên khác `exclude` */
export function sample<T>(arr: readonly T[], n: number, exclude?: T): T[] {
  return shuffle(arr.filter((x) => x !== exclude)).slice(0, n);
}

let zhVoice: SpeechSynthesisVoice | null | undefined;
function pickVoice(): SpeechSynthesisVoice | null {
  if (zhVoice) return zhVoice;
  try {
    const list = window.speechSynthesis.getVoices().filter((v) => /zh[-_]CN|cmn/i.test(v.lang));
    zhVoice = list.find((v) => /Xiaoxiao|Yunxi|Google|Microsoft/i.test(v.name)) ?? list[0] ?? null;
  } catch {
    zhVoice = null;
  }
  return zhVoice;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Đọc to tiếng Trung (zh-CN) bằng speechSynthesis của trình duyệt */
export function speakZh(text: string, rate = 0.85, onEnd?: () => void): void {
  if (!canSpeak()) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = rate;
    const v = pickVoice();
    if (v) u.voice = v;
    let done = false;
    const fin = () => {
      if (done) return;
      done = true;
      onEnd?.();
    };
    u.onend = fin;
    u.onerror = fin;
    window.speechSynthesis.speak(u);
  } catch {
    onEnd?.();
  }
}

export function stopSpeak(): void {
  try {
    if (canSpeak()) window.speechSynthesis.cancel();
  } catch {
    /* bỏ qua */
  }
}
