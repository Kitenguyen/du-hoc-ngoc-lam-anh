"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { HSK_LEVELS, cumulativeCount, type HskLevel } from "../../lib/hsk-vocab";
import { Flashcards } from "./Flashcards";
import { VocabQuiz } from "./VocabQuiz";
import { lsGet, lsSet, stopSpeak } from "./utils";

type Mode = "card" | "game" | "test";
const MODES: { id: Mode; label: string }[] = [
  { id: "card", label: "📇 Thẻ học" },
  { id: "game", label: "🎮 Trò chơi" },
  { id: "test", label: "📝 Kiểm tra" },
];
const KNOWN_KEY = "nla_vocab_known";

const fmt = (n: number) => n.toLocaleString("vi-VN");

/** Danh sách cấp HSK + cửa sổ học toàn màn hình (thẻ học / trò chơi / kiểm tra) */
export function VocabTools() {
  const [view, setView] = useState<{ level: number; mode: Mode } | null>(null);
  const [group, setGroup] = useState("all");
  const [known, setKnown] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    // nạp tiến độ đã lưu sau khi hiển thị (localStorage chỉ có trên trình duyệt)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setKnown(new Set(lsGet<string[]>(KNOWN_KEY, [])));
  }, []);

  const toggleKnown = useCallback((id: string) => {
    setKnown((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      lsSet(KNOWN_KEY, [...s]);
      return s;
    });
  }, []);

  const open = (level: number, mode: Mode) => {
    setGroup("all");
    setView({ level, mode });
  };
  const close = useCallback(() => {
    stopSpeak();
    setView(null);
  }, []);

  useEffect(() => {
    if (!view) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [view, close]);

  const lv: HskLevel | undefined = view ? HSK_LEVELS.find((l) => l.level === view.level) : undefined;
  const words = useMemo(() => {
    if (!lv) return [];
    return group === "all" ? lv.words : (lv.groups.find((g) => g.id === group)?.words ?? []);
  }, [lv, group]);

  return (
    <>
      <div className="vocs">
        {HSK_LEVELS.map((l) => {
          const ready = l.status !== "soon" && l.words.length > 0;
          const learned = ready ? l.words.filter((w) => known.has(w.id)).length : 0;
          return (
            <div className="voc" key={l.level}>
              <div className="voc-h">
                <b>{l.name}</b>
                <small>
                  {fmt(l.official)} từ mới · tổng {fmt(cumulativeCount(l.level))}
                </small>
              </div>
              <ul>
                <li>Học bằng thẻ: lật thẻ, nghe phát âm, đánh dấu từ đã thuộc</li>
                <li>Trò chơi: nhìn chữ chọn nghĩa, nhìn nghĩa chọn chữ, nghe chọn chữ, gõ phiên âm</li>
                <li>Kiểm tra tổng hợp: chấm điểm, ôn lại câu sai</li>
              </ul>
              {ready && (
                <p className="tv-prog">
                  {l.groups.length} nhóm · {l.words.length} từ · đã thuộc <b>{learned}</b>
                  <span className="tv-prog-bar">
                    <i style={{ width: `${(learned / l.words.length) * 100}%` }} />
                  </span>
                </p>
              )}
              <div className="voc-acts">
                {ready ? (
                  MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`btn sm${m.id === "card" ? " pri" : ""}`}
                      onClick={() => open(l.level, m.id)}
                    >
                      {m.label}
                    </button>
                  ))
                ) : (
                  <span className="soon">Đang cập nhật</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {view && lv && (
        <div className="tv-view" role="dialog" aria-modal="true" aria-label={`${lv.name} – ôn tập từ vựng`}>
          <div className="tv-vbar">
            <div className="tv-vt">
              {lv.name} · {MODES.find((m) => m.id === view.mode)?.label.replace(/^\S+\s/, "")}
            </div>
            <button type="button" className="btn sm gold" onClick={close}>
              Đóng ✕
            </button>
          </div>
          <div className="tv-vbody">
            <div className="tv-vin">
              <div className="tv-modes" role="tablist">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={view.mode === m.id}
                    className={view.mode === m.id ? "on" : ""}
                    onClick={() => {
                      stopSpeak();
                      setView({ level: lv.level, mode: m.id });
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <label className="tv-group">
                Nhóm từ:
                <select value={group} onChange={(e) => setGroup(e.target.value)}>
                  <option value="all">
                    Tất cả {lv.name} ({lv.words.length} từ)
                  </option>
                  {lv.groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      Nhóm {g.no}: {g.name} ({g.words.length} từ)
                    </option>
                  ))}
                </select>
              </label>
              {view.mode === "card" && <Flashcards words={words} known={known} onToggleKnown={toggleKnown} />}
              {view.mode === "game" && <VocabQuiz key={`g-${group}`} words={words} pool={lv.words} mode="game" bestKey={`nla_vocab_game_${lv.level}`} />}
              {view.mode === "test" && (
                <VocabQuiz key={`t-${group}`} words={words} pool={lv.words} mode="test" bestKey={`nla_vocab_best_${lv.level}_${group}`} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
