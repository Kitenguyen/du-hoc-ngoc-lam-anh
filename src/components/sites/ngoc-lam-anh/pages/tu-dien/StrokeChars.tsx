"use client";

import { useEffect, useRef, useState } from "react";
import "./stroke-chars.css";
import { hanChars, loadHanziWriter, type HanziWriterInstance } from "./hanzi";

async function animateAll(ws: HanziWriterInstance[]) {
  for (const w of ws) {
    if (!w) continue;
    try {
      w.cancelQuiz();
      await w.animateCharacter();
    } catch {
      /* bỏ qua */
    }
  }
}

/** Ô 田字格 cho từng chữ Hán: xem thứ tự nét (hanzi-writer) và tập viết theo nét. */
export function StrokeChars({ text, size = 92, autoPlay = true }: { text: string; size?: number; autoPlay?: boolean }) {
  const chars = hanChars(text).slice(0, 8);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const writers = useRef<HanziWriterInstance[]>([]);
  const [failed, setFailed] = useState(false);
  const [msg, setMsg] = useState("");
  const key = chars.join("");

  useEffect(() => {
    let alive = true;
    const list = Array.from(key);
    const els = boxes.current;
    writers.current = [];
    loadHanziWriter()
      .then((HW) => {
        if (!alive) return;
        list.forEach((c, i) => {
          const el = els[i];
          if (!el) return;
          el.innerHTML = "";
          const w = HW.create(el, c, {
            width: size,
            height: size,
            padding: 6,
            showOutline: true,
            showCharacter: !autoPlay,
            strokeColor: "#2b1916",
            radicalColor: "#b5121b",
            outlineColor: "#efdcc8",
            strokeAnimationSpeed: 1.1,
            delayBetweenStrokes: 160,
            onLoadCharDataError: () => setFailed(true),
          });
          writers.current[i] = w;
        });
        if (autoPlay) animateAll(writers.current);
      })
      .catch(() => setFailed(true));
    return () => {
      alive = false;
      els.forEach((b) => {
        if (b) b.innerHTML = "";
      });
    };
  }, [key, size, autoPlay]);

  function playAll() {
    setMsg("");
    animateAll(writers.current);
  }
  function quiz() {
    setMsg("Viết theo thứ tự nét vào từng ô (dùng chuột hoặc ngón tay).");
    writers.current.forEach((w) => {
      try {
        w.hideCharacter();
        w.quiz({
          onComplete: (s) => setMsg(`Chữ ${s.character}: hoàn thành, sai ${s.totalMistakes} nét.`),
        });
      } catch {
        /* bỏ qua */
      }
    });
  }

  if (!chars.length) return null;
  return (
    <div className="sc">
      <div className="sc-row">
        {chars.map((c, i) => (
          <div key={`${c}${i}`} className="sc-box" style={{ width: size, height: size }}>
            <svg className="sc-grid" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M0 50H100M50 0V100M0 0L100 100M100 0L0 100" />
            </svg>
            <div
              className="sc-w"
              ref={(el) => {
                boxes.current[i] = el;
              }}
              aria-label={`Thứ tự nét chữ ${c}`}
            />
          </div>
        ))}
      </div>
      {failed ? (
        <p className="sc-msg">Không tải được dữ liệu nét chữ (cần mạng Internet).</p>
      ) : (
        <div className="sc-act">
          <button type="button" className="sc-btn" onClick={playAll}>
            ▶ Xem lại nét
          </button>
          <button type="button" className="sc-btn" onClick={quiz}>
            ✍ Tập viết
          </button>
          {msg && <span className="sc-msg">{msg}</span>}
        </div>
      )}
    </div>
  );
}
