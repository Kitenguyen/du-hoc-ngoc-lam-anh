"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import type { VocabMode, Word } from "./data";

const KNOWN_KEY = "nla-d4-known";

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function speak(text: string) {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch {
    /* trình duyệt không hỗ trợ đọc */
  }
}

/** "xuéxí" → "xuexi" để so sánh khi học viên gõ pinyin không dấu */
function plainPinyin(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ü/g, "v")
    .replace(/[^a-z]/gi, "")
    .toLowerCase();
}

function readKnown(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KNOWN_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeKnown(list: string[]) {
  try {
    localStorage.setItem(KNOWN_KEY, JSON.stringify(list));
  } catch {
    /* bỏ qua khi không lưu được */
  }
}

/* ---------------- Thẻ học ---------------- */
function Flashcards({ words }: { words: Word[] }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  // Thẻ học chỉ hiện sau khi người xem bấm (không render phía máy chủ) → đọc localStorage ngay khi khởi tạo
  const [known, setKnown] = useState<string[]>(readKnown);
  const w = words[i];
  const isKnown = known.includes(w.hz);
  const go = (d: number) => {
    setFlip(false);
    setI((x) => (x + d + words.length) % words.length);
  };
  const toggleKnown = () => {
    const next = isKnown ? known.filter((x) => x !== w.hz) : [...known, w.hz];
    setKnown(next);
    writeKnown(next);
  };
  return (
    <div className="vp-card-wrap">
      <button type="button" className={`vp-flash${flip ? " back" : ""}`} onClick={() => setFlip((f) => !f)} aria-label="Lật thẻ">
        <span className="hz">{w.hz}</span>
        {flip ? (
          <span className="ans">
            <span className="py">{w.py}</span>
            <span className="vi">{w.vi}</span>
          </span>
        ) : (
          <span className="hint">Bấm để lật thẻ</span>
        )}
        {isKnown && <span className="known">✔ Đã thuộc</span>}
      </button>
      <div className="vp-row">
        <button type="button" className="btn sm" onClick={() => go(-1)}>
          ◀ Trước
        </button>
        <button type="button" className="btn sm" onClick={() => speak(w.hz)}>
          🔊 Nghe
        </button>
        <button type="button" className={`btn sm${isKnown ? " pri" : ""}`} onClick={toggleKnown}>
          {isKnown ? "✔ Đã thuộc" : "Đánh dấu đã thuộc"}
        </button>
        <button type="button" className="btn sm" onClick={() => go(1)}>
          Sau ▶
        </button>
      </div>
      <p className="muted vp-count">
        Thẻ {i + 1}/{words.length} · đã thuộc {known.filter((k) => words.some((x) => x.hz === k)).length}/{words.length} từ
      </p>
    </div>
  );
}

/* ---------------- Trò chơi chọn / gõ ---------------- */
type Q = { w: Word; opts: Word[] };

function makeQuestions(pool: Word[], all: Word[], n: number): Q[] {
  return shuffle(pool)
    .slice(0, Math.min(n, pool.length))
    .map((w) => ({ w, opts: shuffle([w, ...shuffle(all.filter((x) => x.hz !== w.hz)).slice(0, 3)]) }));
}

function Quiz({ words, mode }: { words: Word[]; mode: "g1" | "g2" | "g3" | "r30" }) {
  const total = mode === "r30" ? 30 : 10;
  const [seed, setSeed] = useState(0);
  const [pool, setPool] = useState<Word[] | null>(null);
  const qs = useMemo(() => {
    void seed;
    return makeQuestions(pool ?? words, words, total);
  }, [pool, words, total, seed]);
  const [k, setK] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [wrong, setWrong] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const done = k >= qs.length;
  const q = qs[k];
  // r30: xen kẽ "nhìn nghĩa chọn chữ" và "nhìn chữ chọn nghĩa"
  const kind: "g1" | "g2" | "g3" = mode === "r30" ? (k % 2 ? "g1" : "g2") : mode;

  const restart = useCallback((only?: Word[]) => {
    setPool(only && only.length ? only : null);
    setSeed((s) => s + 1);
    setK(0);
    setPicked(null);
    setTyped("");
    setWrong([]);
    setScore(0);
  }, []);

  const answer = (ok: boolean, key: string) => {
    if (picked) return;
    setPicked(key);
    if (ok) setScore((s) => s + 1);
    else setWrong((w) => [...w, q.w]);
    speak(q.w.hz);
  };
  const onType = (e: FormEvent) => {
    e.preventDefault();
    if (picked || !typed.trim()) return;
    const t = typed.trim();
    answer(t === q.w.hz || plainPinyin(t) === plainPinyin(q.w.py), t);
  };
  const next = () => {
    setPicked(null);
    setTyped("");
    setK((x) => x + 1);
  };

  if (done) {
    return (
      <div className="vp-result">
        <div className="vp-score">
          {score}/{qs.length}
        </div>
        <p>{score === qs.length ? "Xuất sắc! Bạn trả lời đúng tất cả." : `Bạn trả lời sai ${wrong.length} câu.`}</p>
        {wrong.length > 0 && (
          <ul className="vp-wrong">
            {wrong.map((w) => (
              <li key={w.hz}>
                <b>{w.hz}</b> <span>{w.py}</span> – {w.vi}
              </li>
            ))}
          </ul>
        )}
        <div className="vp-row">
          {wrong.length > 0 && (
            <button type="button" className="btn pri sm" onClick={() => restart(wrong)}>
              Ôn lại câu sai
            </button>
          )}
          <button type="button" className="btn sm" onClick={() => restart()}>
            Làm lượt mới
          </button>
        </div>
      </div>
    );
  }

  const correct = picked !== null;
  return (
    <div className="vp-quiz">
      <div className="vp-prog">
        <span>
          Câu {k + 1}/{qs.length}
        </span>
        <span>Đúng {score}</span>
      </div>
      <div className="d4-bar">
        <i style={{ width: `${(k / qs.length) * 100}%` }} />
      </div>
      <div className="vp-ask">
        {kind === "g1" ? (
          <>
            <span className="hz">{q.w.hz}</span>
            <button type="button" className="btn sm" onClick={() => speak(q.w.hz)}>
              🔊
            </button>
          </>
        ) : (
          <span className="vi">{q.w.vi}</span>
        )}
      </div>
      {kind === "g3" ? (
        <form className="vp-type" onSubmit={onType}>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Gõ chữ Hán hoặc pinyin"
            disabled={correct}
            autoFocus
            lang="zh"
          />
          <button className="btn pri sm" type="submit" disabled={correct}>
            Kiểm tra
          </button>
        </form>
      ) : (
        <div className="vp-opts">
          {q.opts.map((o) => {
            const isRight = o.hz === q.w.hz;
            const cls = picked ? (isRight ? " ok" : picked === o.hz ? " no" : "") : "";
            return (
              <button type="button" key={o.hz} className={`vp-opt${cls}`} onClick={() => answer(isRight, o.hz)} disabled={correct}>
                {kind === "g1" ? o.vi : <span className="hz">{o.hz}</span>}
              </button>
            );
          })}
        </div>
      )}
      {picked && (
        <div className="vp-feedback">
          <span>
            <b>{q.w.hz}</b> {q.w.py} – {q.w.vi}
          </span>
          <button type="button" className="btn pri sm" onClick={next}>
            {k + 1 < qs.length ? "Câu tiếp →" : "Xem kết quả"}
          </button>
        </div>
      )}
    </div>
  );
}

const TITLES: Record<VocabMode, string> = {
  card: "📇 Thẻ học",
  g1: "🎮 Nhìn chữ chọn nghĩa",
  g2: "🎯 Nhìn nghĩa chọn chữ Hán",
  g3: "⌨️ Nhìn nghĩa gõ chữ Hán",
  r30: "📝 Kiểm tra tổng hợp",
};

export function VocabPractice({ mode, words, onClose }: { mode: VocabMode; words: Word[]; onClose: () => void }) {
  return (
    <div className="vp" id="tv-play">
      <div className="vp-head">
        <b>{TITLES[mode]}</b>
        <button type="button" className="btn sm" onClick={onClose}>
          ✕ Đóng
        </button>
      </div>
      {mode === "card" ? <Flashcards words={words} /> : <Quiz key={mode} words={words} mode={mode} />}
    </div>
  );
}
