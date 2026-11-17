"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lsGet, lsSet, speakZh, stopSpeak } from "../tu-vung/utils";
import type { Line } from "./data";
import { getSR, gradeAnswer, han, listen, loadPinyin, matchRepeat, type ListenHandle, type RepeatResult } from "./speech";

export type SessionItem = { line: Line; refs: string[]; keys: string[] };
type Res = { item: SessionItem; said: string; ok: boolean; comment: string; marks?: RepeatResult["marks"] };
type Hist = { t: number; c: number; n: number };

type Props = {
  kind: "answer" | "repeat";
  items: SessionItem[];
  rate: number;
  showQ: boolean;
  histKey: string;
};

function sayAsync(text: string, rate: number): Promise<void> {
  return new Promise((ok) => {
    let done = false;
    const fin = () => {
      if (done) return;
      done = true;
      ok();
    };
    // phòng khi trình duyệt không báo onend
    setTimeout(fin, Math.max(3000, han(text).length * 450 + 2500));
    speakZh(text, rate, fin);
  });
}
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function SpeakSession({ kind, items, rate, showQ, histKey }: Props) {
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [k, setK] = useState(0);
  const [stage, setStage] = useState<"hear" | "answer" | "between">("hear");
  const [left, setLeft] = useState(0);
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");
  const [results, setResults] = useState<Res[]>([]);
  const [err, setErr] = useState("");
  const [hist, setHist] = useState<Hist[]>([]);
  const [hasSR, setHasSR] = useState(true);
  const runId = useRef(0);
  const handle = useRef<ListenHandle | null>(null);
  const typedDone = useRef<(() => void) | null>(null);
  const typedVal = useRef("");
  const timer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rid = runId;
    const hd = handle;
    const tmr = timer;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kiểm tra API trình duyệt và đọc dữ liệu lưu trên máy sau khi mount, tránh lệch khi hydrate
    setHasSR(!!getSR());
    setHist(lsGet<Hist[]>(histKey, []));
    if (kind === "repeat") void loadPinyin();
    return () => {
      rid.current++;
      hd.current?.abort();
      if (tmr.current) clearInterval(tmr.current);
      stopSpeak();
    };
  }, [histKey, kind]);

  const finish = useCallback(
    (res: Res[]) => {
      setPhase("done");
      setResults(res);
      if (!res.length) return;
      const c = res.filter((r) => r.ok).length;
      const h = [{ t: Date.now(), c, n: items.length }, ...lsGet<Hist[]>(histKey, [])].slice(0, 10);
      lsSet(histKey, h);
      setHist(h);
    },
    [histKey, items.length],
  );

  const typedAnswer = (sec: number) =>
    new Promise<string>((ok) => {
      typedVal.current = "";
      setTyped("");
      let n = sec;
      setLeft(n);
      const end = () => {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        typedDone.current = null;
        ok(typedVal.current);
      };
      typedDone.current = end;
      timer.current = window.setInterval(() => {
        n--;
        setLeft(Math.max(0, n));
        if (n <= 0) end();
      }, 1000);
      setTimeout(() => inputRef.current?.focus(), 30);
    });

  const run = async () => {
    const my = ++runId.current;
    const sr = hasSR;
    const res: Res[] = [];
    if (sr) setErr("");
    setResults([]);
    setPhase("run");
    for (let i = 0; i < items.length; i++) {
      if (runId.current !== my) return;
      const it = items[i];
      setK(i);
      setStage("hear");
      setHeard("");
      await sayAsync(it.line.zh, rate);
      if (runId.current !== my) return;
      setStage("answer");
      const sec = kind === "repeat" ? Math.min(14, Math.max(5, Math.ceil(han(it.line.zh).length * 0.55) + 4)) : 10;
      let said = "";
      if (sr) {
        setLeft(sec);
        const h = listen(sec, { tick: setLeft, text: setHeard });
        handle.current = h;
        const r = await h.promise;
        handle.current = null;
        if (runId.current !== my) return;
        if (r.err) {
          setErr(r.err);
          setHasSR(false);
          runId.current++;
          setPhase("intro");
          return;
        }
        said = r.text;
      } else {
        said = await typedAnswer(sec + (kind === "repeat" ? 6 : 10));
        if (runId.current !== my) return;
      }
      setHeard(said);
      if (kind === "repeat") {
        const m = await matchRepeat(said, it.line.zh);
        res.push({ item: it, said, ok: m.ok, comment: m.ok ? "Đúng 100%" : `Khớp ${m.pct}%`, marks: m.marks });
      } else {
        const g = gradeAnswer(said, it.refs, it.keys);
        res.push({ item: it, said, ok: g.ok, comment: g.comment });
      }
      setResults(res.slice());
      setStage("between");
      await sleep(1000);
    }
    if (runId.current === my) finish(res);
  };

  const stop = () => {
    runId.current++;
    handle.current?.abort();
    handle.current = null;
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    typedDone.current = null;
    stopSpeak();
    finish(results);
  };

  const answered = () => {
    if (handle.current) handle.current.stop();
    else typedDone.current?.();
  };

  const it = items[k];
  const last = results[results.length - 1];
  const title = kind === "repeat" ? "Nghe và nhắc lại" : "Nghe & trả lời";

  return (
    <div>
      {!hasSR && !err && (
        <div className="ln-warn">
          ⚠ Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy mở trang bằng <b>Google Chrome</b> hoặc <b>Edge</b> (máy tính / điện
          thoại Android) và cho phép dùng micro. Tạm thời bạn có thể <b>gõ câu trả lời</b> bằng chữ Hán.
        </div>
      )}
      {err && (
        <div className="ln-warn">
          Chưa dùng được micro ({err}). Hãy cho phép trang dùng micro (biểu tượng ổ khóa cạnh địa chỉ trang) rồi tải lại trang. Tạm thời bạn có thể bấm <b>Bắt đầu</b> để làm bằng cách gõ chữ Hán.
        </div>
      )}

      {phase !== "run" && (
        <div className="ln-card">
          {kind === "repeat" ? (
            <p className="ln-p">
              <b>Nghe và nhắc lại ({items.length} câu).</b> Mỗi câu chỉ nghe <b>một lần</b>, micro tự bật, bạn nhắc lại{" "}
              <b>nguyên văn</b> câu vừa nghe. Câu đạt khi nói đúng <b>100% các chữ</b> (chấp nhận chữ đồng âm do máy nhận dạng).
            </p>
          ) : (
            <p className="ln-p">
              <b>Cách làm:</b> máy đọc lần lượt {items.length} câu hỏi. Nghe xong, micro tự bật: bạn có <b>10 giây</b> trả lời
              thành tiếng. Không có đáp án cố định – trả lời đúng điều câu hỏi hỏi là đạt. Máy chấm <b>gần đúng</b> theo từ khóa và
              độ giống câu mẫu; giáo viên có thể chấm lại.
            </p>
          )}
          <button type="button" className="ln-btn pri" onClick={() => void run()}>
            ▶ {phase === "done" ? "Làm lại" : "Bắt đầu"}
          </button>
          {hist.length > 0 && (
            <div className="ln-hist">
              Lần làm gần đây (lưu trên máy này):{" "}
              {hist
                .slice(0, 5)
                .map((h) => `${new Date(h.t).toLocaleDateString("vi-VN")} – ${h.c}/${h.n}`)
                .join(" · ")}
            </div>
          )}
        </div>
      )}

      {phase === "run" && it && (
        <div className="ln-flash">
          <div className="k">
            {title} · Câu {k + 1} / {items.length}
          </div>
          <div className="ln-bar">
            <i style={{ width: `${(k / items.length) * 100}%` }} />
          </div>
          {stage === "hear" ? (
            <div className="ln-q ln-wait">🔊 Nghe {kind === "repeat" ? "…" : "câu hỏi…"}</div>
          ) : (
            <>
              {kind === "repeat" && stage === "answer" && <div className="ln-q ln-wait">🎙 Nhắc lại câu vừa nghe</div>}
              {(kind === "repeat" ? stage === "between" : showQ) && (
                <div>
                  <div className="ln-q">{it.line.zh}</div>
                  <div className="py">{it.line.py}</div>
                  <div className="vi">{it.line.vi}</div>
                </div>
              )}
            </>
          )}
          {stage === "answer" && (
            <div>
              {hasSR ? (
                <span className="ln-mic">
                  <i /> Đang ghi âm – {kind === "repeat" ? "nói ngay" : "trả lời ngay"}
                </span>
              ) : null}{" "}
              <span className="ln-timer">{left}</span>
            </div>
          )}
          {stage === "answer" && !hasSR && (
            <input
              ref={inputRef}
              className="ln-essay ln-one"
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                typedVal.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) typedDone.current?.();
              }}
              placeholder={kind === "repeat" ? "Gõ lại câu vừa nghe (chữ Hán)" : "Gõ câu trả lời bằng chữ Hán"}
              aria-label="Câu trả lời"
            />
          )}
          <div className="ln-heard">
            {stage === "between" && last ? (
              <>
                <span className={last.ok ? "ok" : "bad"}>{last.ok ? "✓ " : "✗ "}</span>
                {last.said || <span className="muted">(không nghe thấy câu trả lời)</span>}
              </>
            ) : (
              heard
            )}
          </div>
          <div>
            {stage === "answer" && (
              <button type="button" className="ln-btn" onClick={answered}>
                {kind === "repeat" ? "Nói xong →" : "Trả lời xong →"}
              </button>
            )}
            <button type="button" className="ln-btn" onClick={stop}>
              ⏹ Dừng phiên
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="ln-card">
          {results.length ? (
            <>
              <div className="ln-big">
                {results.filter((r) => r.ok).length} / {items.length} câu đạt ·{" "}
                {Math.round((results.filter((r) => r.ok).length / items.length) * 100)} điểm
              </div>
              <div className="ln-scroll">
                <table className="ln-tbl ln-res">
                  <thead>
                    <tr>
                      <th>{kind === "repeat" ? "Câu gốc" : "Câu hỏi"}</th>
                      <th>Bạn {hasSR ? "nói" : "trả lời"}</th>
                      <th>{kind === "repeat" ? "" : "Nhận xét · gợi ý"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <div className="ln-z">
                            {r.marks
                              ? r.marks.map((m, j) => (
                                  <span key={j} className={m.ok ? undefined : "ln-miss"}>
                                    {m.ch}
                                  </span>
                                ))
                              : r.item.line.zh}
                          </div>
                          <div className="py">{r.item.line.py}</div>
                          <div className="vi">{r.item.line.vi}</div>
                        </td>
                        <td className="ln-z">{r.said || "—"}</td>
                        <td>
                          <span className={r.ok ? "ok" : "bad"}>{r.ok ? "✓ Đạt" : "✗ Chưa đạt"}</span> {r.comment}
                          {kind === "answer" && r.item.refs[0] && (
                            <div className="vi ln-sample">Mẫu: {r.item.refs.join(" / ")}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {kind === "repeat" && (
                <p className="ln-info">
                  Chữ <span className="ln-miss">tô đỏ</span> là chữ thiếu hoặc sai so với câu gốc.
                </p>
              )}
            </>
          ) : (
            <p className="ln-p">Chưa trả lời câu nào.</p>
          )}
        </div>
      )}
    </div>
  );
}
