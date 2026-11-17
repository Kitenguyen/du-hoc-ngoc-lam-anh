"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pinyinKeys, type HskWord } from "../../lib/hsk-vocab";
import { canSpeak, lsGet, lsSet, sample, shuffle, speakZh } from "./utils";

export type QuizKind = "h2m" | "m2h" | "audio" | "type";

export const QUIZ_KINDS: { id: QuizKind; label: string; hint: string }[] = [
  { id: "h2m", label: "Nhìn chữ chọn nghĩa", hint: "Xem chữ Hán, chọn nghĩa tiếng Việt đúng" },
  { id: "m2h", label: "Nhìn nghĩa chọn chữ", hint: "Xem nghĩa tiếng Việt, chọn chữ Hán đúng" },
  { id: "audio", label: "Nghe chọn chữ", hint: "Nghe phát âm, chọn chữ Hán đúng" },
  { id: "type", label: "Gõ phiên âm", hint: "Xem chữ Hán, gõ phiên âm không dấu (vd 学习 → xuexi)" },
];

type Question = { w: HskWord; kind: QuizKind; options: HskWord[] };
type Answer = { q: Question; ok: boolean; given: string };

function makeQuestion(w: HskWord, kind: QuizKind, pool: HskWord[]): Question {
  const k: QuizKind = kind === "audio" && !canSpeak() ? "m2h" : kind;
  const others = sample(
    pool.filter((x) => x.h !== w.h && x.m !== w.m),
    3,
  );
  return { w, kind: k, options: k === "type" ? [] : shuffle([w, ...others]) };
}

function normTyped(v: string): string {
  return v.toLowerCase().replace(/ü/g, "v").replace(/[^a-z㐀-鿿]/g, "");
}

type Props = {
  /** từ dùng để ra câu hỏi */
  words: HskWord[];
  /** kho từ để lấy phương án nhiễu (thường là cả cấp) */
  pool: HskWord[];
  /** game = chơi theo vòng 10 câu, chọn dạng; test = 30 câu trộn dạng, lưu điểm cao nhất */
  mode: "game" | "test";
  /** khóa lưu điểm cao nhất */
  bestKey: string;
};

export function VocabQuiz({ words, pool, mode, bestKey }: Props) {
  const [kind, setKind] = useState<QuizKind>("h2m");
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [best, setBest] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const build = useCallback(
    (src: HskWord[], k: QuizKind) => {
      const n = mode === "test" ? 30 : 10;
      const kinds: QuizKind[] = ["h2m", "m2h", "audio", "type"];
      const list = shuffle(src).slice(0, n);
      return list.map((w, idx) => makeQuestion(w, mode === "test" ? kinds[idx % kinds.length] : k, pool));
    },
    [mode, pool],
  );

  const restart = useCallback(
    (src: HskWord[] = words, k: QuizKind = kind) => {
      setQs(shuffle(build(src, k)));
      setI(0);
      setAnswers([]);
      setPicked(null);
      setTyped("");
    },
    [build, kind, words],
  );

  useEffect(() => {
    setBest(lsGet<number>(bestKey, 0));
  }, [bestKey]);

  // dựng bộ câu khi đổi nhóm từ / dạng (nạp phía trình duyệt vì có ngẫu nhiên)
  useEffect(() => {
    restart(words, kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, kind, mode]);

  const q = qs[i];
  const finished = qs.length > 0 && i >= qs.length;

  // câu nghe: tự đọc khi hiện câu
  useEffect(() => {
    if (q && q.kind === "audio" && picked === null) speakZh(q.w.h);
    if (q && q.kind === "type" && picked === null) inputRef.current?.focus();
  }, [q, picked]);

  useEffect(() => {
    if (picked !== null) nextRef.current?.focus();
  }, [picked]);

  const answer = (given: string, ok: boolean) => {
    if (!q || picked !== null) return;
    setPicked(given);
    setAnswers((a) => [...a, { q, ok, given }]);
    if (q.kind !== "audio") speakZh(q.w.h);
  };

  const pick = (o: HskWord) => answer(o.id, o.id === q.w.id);

  const submitTyped = () => {
    if (!q || picked !== null) return;
    const v = normTyped(typed);
    if (!v) return;
    const ok = v === q.w.h || pinyinKeys(q.w.h, q.w.p).includes(v);
    answer(typed, ok);
  };

  const next = () => {
    setI((x) => x + 1);
    setPicked(null);
    setTyped("");
  };

  // lưu điểm cao nhất khi xong bài kiểm tra
  const score = answers.filter((a) => a.ok).length;
  useEffect(() => {
    if (!finished || mode !== "test" || !qs.length) return;
    const pct = Math.round((score / qs.length) * 100);
    if (pct > best) {
      setBest(pct);
      lsSet(bestKey, pct);
    }
  }, [finished, mode, score, qs.length, best, bestKey]);

  const wrong = useMemo(() => {
    const seen = new Set<string>();
    return answers.filter((a) => !a.ok && !seen.has(a.q.w.id) && seen.add(a.q.w.id)).map((a) => a.q.w);
  }, [answers]);

  if (!words.length) return <p className="tv-note">Nhóm này chưa có từ.</p>;

  return (
    <div className="tv-quiz">
      {mode === "game" && (
        <div className="tv-kinds" role="tablist" aria-label="Chọn dạng trò chơi">
          {QUIZ_KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kind === k.id}
              className={kind === k.id ? "on" : ""}
              onClick={() => setKind(k.id)}
            >
              {k.label}
            </button>
          ))}
        </div>
      )}
      {mode === "test" && (
        <p className="tv-note">
          Kiểm tra tổng hợp {qs.length} câu, trộn 4 dạng (chọn nghĩa, chọn chữ, nghe, gõ phiên âm).
          {best > 0 && (
            <>
              {" "}
              Điểm cao nhất của bạn: <b>{best}%</b>.
            </>
          )}
        </p>
      )}

      {!finished && q && (
        <div className="tv-qcard">
          <div className="tv-qtop">
            <span>
              Câu {i + 1} / {qs.length}
            </span>
            <span>
              ✓ {score} · ✗ {answers.length - score}
            </span>
          </div>
          <div className="tv-bar">
            <i style={{ width: `${(i / qs.length) * 100}%` }} />
          </div>
          <p className="tv-qhint">{QUIZ_KINDS.find((k) => k.id === q.kind)?.hint}</p>

          {(q.kind === "h2m" || q.kind === "type") && <div className="tv-han">{q.w.h}</div>}
          {q.kind === "m2h" && <div className="tv-mean">{q.w.m}</div>}
          {q.kind === "audio" && (
            <button type="button" className="tv-listen" onClick={() => speakZh(q.w.h)} aria-label="Nghe lại">
              🔊 Nghe lại
            </button>
          )}

          {q.kind !== "type" ? (
            <div className={`tv-opts${q.kind === "h2m" ? " vi" : " zh"}`}>
              {q.options.map((o) => {
                const st = picked === null ? "" : o.id === q.w.id ? " ok" : o.id === picked ? " bad" : " dim";
                return (
                  <button key={o.id} type="button" className={`tv-opt${st}`} onClick={() => pick(o)} disabled={picked !== null}>
                    {q.kind === "h2m" ? o.m : o.h}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              className="tv-type"
              onSubmit={(e) => {
                e.preventDefault();
                if (picked === null) submitTyped();
                else next();
              }}
            >
              <input
                ref={inputRef}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Gõ phiên âm không dấu…"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                readOnly={picked !== null}
                aria-label="Gõ phiên âm"
              />
              {picked === null && (
                <button type="submit" className="btn pri sm">
                  Kiểm tra
                </button>
              )}
            </form>
          )}

          {picked !== null && (
            <div className={`tv-fb ${answers[answers.length - 1]?.ok ? "ok" : "bad"}`}>
              <b>{answers[answers.length - 1]?.ok ? "✓ Chính xác!" : "✗ Chưa đúng"}</b>
              <span className="tv-fbw">
                <span className="h">{q.w.h}</span> <span className="p">{q.w.p}</span> <span className="m">{q.w.m}</span>
              </span>
              <button ref={nextRef} type="button" className="btn pri sm" onClick={next}>
                {i + 1 < qs.length ? "Câu tiếp →" : "Xem kết quả"}
              </button>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="tv-qcard tv-result">
          <div className="tv-big">
            {score} / {qs.length} câu đúng · {Math.round((score / qs.length) * 100)}%
          </div>
          {mode === "test" && <p className="tv-note center">Điểm cao nhất (lưu trên máy này): {best}%</p>}
          {wrong.length ? (
            <>
              <h4>Từ cần ôn lại ({wrong.length})</h4>
              <div className="tv-miss">
                {wrong.map((w) => (
                  <div key={w.id}>
                    <button type="button" className="h" onClick={() => speakZh(w.h)} title="Nghe">
                      {w.h}
                    </button>
                    <span className="p">{w.p}</span>
                    <span className="m">{w.m}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="tv-note center">Tuyệt vời! Bạn trả lời đúng tất cả. 🎉</p>
          )}
          <div className="tv-acts">
            {wrong.length > 0 && (
              <button type="button" className="btn pri sm" onClick={() => restart(wrong)}>
                ↻ Ôn lại câu sai
              </button>
            )}
            <button type="button" className="btn sm" onClick={() => restart()}>
              {mode === "game" ? "Chơi vòng mới" : "Làm bài mới"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
