"use client";

import { useEffect, useMemo, useState } from "react";
import type { HskWord } from "../../lib/hsk-vocab";
import { shuffle, speakZh } from "./utils";

type Props = {
  words: HskWord[];
  known: Set<string>;
  onToggleKnown: (id: string) => void;
};

/** Thẻ học: lật thẻ, nghe phát âm, đánh dấu từ đã thuộc */
export function Flashcards({ words, known, onToggleKnown }: Props) {
  const [order, setOrder] = useState<HskWord[]>(words);
  const [hideKnown, setHideKnown] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const [prevWords, setPrevWords] = useState(words);
  if (prevWords !== words) {
    setPrevWords(words);
    setOrder(words);
    setIdx(0);
    setFlipped(false);
  }

  const list = useMemo(() => (hideKnown ? order.filter((w) => !known.has(w.id)) : order), [order, hideKnown, known]);
  const cur = list[Math.min(idx, Math.max(0, list.length - 1))];
  const learned = words.filter((w) => known.has(w.id)).length;

  const go = (d: number) => {
    if (!list.length) return;
    setIdx((i) => (Math.min(i, list.length - 1) + d + list.length) % list.length);
    setFlipped(false);
  };

  useEffect(() => {
    if (cur && autoSpeak && flipped) speakZh(cur.h);
  }, [cur, flipped, autoSpeak]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(t.tagName) && e.key === " ") return;
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " " || e.key === "Enter") {
        if (t && /^(BUTTON|SELECT)$/.test(t.tagName)) return;
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="tv-fc">
      <div className="tv-fc-opts">
        <span>
          Đã thuộc <b>{learned}</b> / {words.length} từ
        </span>
        <label>
          <input type="checkbox" checked={hideKnown} onChange={(e) => {
              setHideKnown(e.target.checked);
              setIdx(0);
            }}
          /> Ẩn từ đã
          thuộc
        </label>
        <label>
          <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} /> Tự đọc khi lật
        </label>
        <button
          type="button"
          className="tv-mini"
          onClick={() => {
            setOrder(shuffle(words));
            setIdx(0);
            setFlipped(false);
          }}
        >
          🔀 Trộn thẻ
        </button>
        <button
          type="button"
          className="tv-mini"
          onClick={() => {
            setOrder(words);
            setIdx(0);
            setFlipped(false);
          }}
        >
          ↺ Thứ tự gốc
        </button>
      </div>

      {!cur ? (
        <div className="tv-qcard center">
          <div className="tv-big">🎉 Bạn đã thuộc hết từ trong nhóm này!</div>
          <p className="tv-note center">Bỏ chọn “Ẩn từ đã thuộc” để xem lại.</p>
        </div>
      ) : (
        <>
          <div className="tv-bar">
            <i style={{ width: `${((Math.min(idx, list.length - 1) + 1) / list.length) * 100}%` }} />
          </div>
          <button
            type="button"
            className={`tv-card${flipped ? " flip" : ""}${known.has(cur.id) ? " known" : ""}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? "Lật về mặt chữ Hán" : "Lật thẻ xem nghĩa"}
          >
            <span className="tv-card-in">
              <span className="tv-face front">
                <span className="tv-han">{cur.h}</span>
                <small>Chạm để lật thẻ</small>
              </span>
              <span className="tv-face back">
                <span className="tv-han sm">{cur.h}</span>
                <span className="tv-py">{cur.p}</span>
                <span className="tv-mean">{cur.m}</span>
              </span>
            </span>
            {known.has(cur.id) && <span className="tv-badge">✓ Đã thuộc</span>}
          </button>
          <div className="tv-count">
            Thẻ {Math.min(idx, list.length - 1) + 1} / {list.length}
          </div>
          <div className="tv-fc-acts">
            <button type="button" className="btn sm" onClick={() => go(-1)} aria-label="Thẻ trước">
              ← Trước
            </button>
            <button type="button" className="btn sm" onClick={() => speakZh(cur.h)}>
              🔊 Nghe
            </button>
            <button type="button" className={`btn sm${known.has(cur.id) ? " gold" : " pri"}`} onClick={() => onToggleKnown(cur.id)}>
              {known.has(cur.id) ? "↺ Chưa thuộc" : "✓ Đã thuộc"}
            </button>
            <button type="button" className="btn sm" onClick={() => go(1)} aria-label="Thẻ sau">
              Sau →
            </button>
          </div>
          <p className="tv-note center">Phím tắt: Space/Enter lật thẻ · ← → chuyển thẻ.</p>
        </>
      )}
    </div>
  );
}
