"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BRAND, PHONE_LABEL, href } from "../../data";
import { D4_EXAMS, D4_FORMAT, allQuestions, findD4, type D4Exam } from "./exams";

// ---------- Lưu trên trình duyệt (bọc try/catch) ----------
const PREFIX = "nla_d4de_";
const EVENT = "nla-d4-storage";

function lsGet(k: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + k);
  } catch {
    return null;
  }
}
function lsSet(k: string, v: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + k, JSON.stringify(v));
  } catch {
    // bỏ qua
  }
  window.dispatchEvent(new Event(EVENT));
}
function lsDel(k: string): void {
  try {
    window.localStorage.removeItem(PREFIX + k);
  } catch {
    // bỏ qua
  }
  window.dispatchEvent(new Event(EVENT));
}
function parse<T>(raw: string | null, d: T): T {
  if (!raw) return d;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return d;
  }
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}
function useLS(k: string): string | null {
  return useSyncExternalStore(subscribe, () => lsGet(k), () => null);
}

type Best = Record<string, { diem: number; n: number }>;

const L = "ABCD";

function mmss(s: number): string {
  const v = Math.max(0, Math.round(s));
  return `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
}

/** {{n}} → chỗ trống, [[n|từ]] → từ gạch chân (giống hàm txt() của mẫu) */
function rich(s: string, key?: Record<number, string>): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\{\{(\d+)\}\}|\[\[(\d+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1]) {
      const n = Number(m[1]);
      out.push(
        key ? (
          <Fragment key={m.index}>
            <span className="bl ok" id={`b${n}`}>
              {key[n]}
            </span>
            <sup>（{n}）</sup>
          </Fragment>
        ) : (
          <span className="bl" id={`b${n}`} key={m.index}>
            （{n}）______
          </span>
        ),
      );
    } else {
      out.push(
        <Fragment key={m.index}>
          <u id={`b${m[2]}`}>{m[3]}</u>
          <sup>（{m[2]}）</sup>
        </Fragment>,
      );
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function PaperHead({ d, sub }: { d: D4Exam; sub: string }) {
  return (
    <div className="dx-hd">
      <p>
        <b>{BRAND.fullName.toUpperCase()}</b> · {PHONE_LABEL}
      </p>
      <h1>{d.t}</h1>
      <p>{sub}</p>
    </div>
  );
}

/** Chỉ hiện hướng dẫn khi khác hướng dẫn của phần trước (giống mẫu) */
function insFlags(d: D4Exam): boolean[] {
  let last = "";
  return d.parts.map((p) => {
    const show = Boolean(p.h) && p.h !== last;
    if (p.h) last = p.h;
    return show;
  });
}

// ---------- Danh sách đề ----------
function List() {
  const best = parse<Best>(useLS("best"), {});
  return (
    <div className="dx-paper">
      <div className="dx-hd">
        <h1>📝 Đề luyện thi tiếng Trung THPT · khối D4</h1>
        <p>
          {D4_EXAMS.length} đề · đề mẫu rút gọn theo cấu trúc đề thi tốt nghiệp THPT ({D4_FORMAT.split(": ")[1]})
        </p>
      </div>
      <p className="dx-gnote">
        📌 Đề do {BRAND.fullName} tự soạn để học sinh làm quen dạng bài. Chấm điểm và giải thích chạy ngay trên máy; kết
        quả lưu trên trình duyệt này. Lưu điểm vào tài khoản học viên cần máy chủ – trung tâm sẽ bật sau.
      </p>
      <div className="dx-list">
        {D4_EXAMS.map((x) => {
          const b = best[x.id];
          return (
            <div className="dx-it" key={x.id}>
              <a href={href(`de-thi-d4.html?d=${x.id}`)} className={b ? "done" : undefined}>
                <b>Đề {x.id}</b>
                <small>{b ? `Cao nhất: ${b.diem} đ · ${b.n} lần` : `${allQuestions(x).length} câu · ${x.time} phút`}</small>
              </a>
            </div>
          );
        })}
        <div className="dx-it">
          <span className="dx-soon">
            <b>Đề mới</b>
            <small>Đang cập nhật</small>
          </span>
        </div>
      </div>
      <p style={{ marginTop: 16 }}>
        <a href={href("luyen-thi-d4.html#de")}>← Về trang Luyện thi khối D4</a>
      </p>
    </div>
  );
}

// ---------- Làm bài ----------
type Result = { dung: number; tong: number; diem: number; sec: number; auto: boolean };

function Exam({ d }: { d: D4Exam }) {
  const qs = allQuestions(d);
  const savedT = parse<number>(useLS(`${d.id}_t`), 0);
  const [phase, setPhase] = useState<"intro" | "doing" | "done">("intro");
  const [ans, setAns] = useState<Record<string, number>>({});
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);
  const [armed, setArmed] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const finishRef = useRef<(auto: boolean) => void>(() => {});
  const armTimer = useRef<number | undefined>(undefined);
  const limit = d.time * 60;
  const left = limit - (now - t0) / 1000;

  useEffect(() => {
    if (phase !== "doing") return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (limit - (t - t0) / 1000 <= 0) finishRef.current(true);
    }, 1000);
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("beforeunload", warn);
    };
  }, [phase, t0, limit]);

  useEffect(() => () => window.clearTimeout(armTimer.current), []);

  function start() {
    const t = Date.now();
    const fresh = !savedT || t - savedT > limit * 1000 + 600000;
    const st = fresh ? t : savedT;
    const a = fresh ? {} : parse<Record<string, number>>(lsGet(`${d.id}_a`), {});
    if (fresh) {
      lsSet(`${d.id}_t`, st);
      lsSet(`${d.id}_a`, a);
    }
    setT0(st);
    setNow(t);
    setAns(a);
    setRes(null);
    setPhase("doing");
    window.scrollTo({ top: 0 });
  }

  function choose(n: number, i: number) {
    if (phase !== "doing") return;
    const next = { ...ans, [n]: i };
    setAns(next);
    lsSet(`${d.id}_a`, next);
  }

  function finish(auto: boolean) {
    if (phase !== "doing") return;
    const sec = Math.min(limit, Math.round((Date.now() - t0) / 1000));
    const dung = qs.filter((q) => ans[q.n] === q.a).length;
    const diem = Math.round((dung / qs.length) * 1000) / 100;
    const best = parse<Best>(lsGet("best"), {});
    const prev = best[d.id];
    best[d.id] = { diem: Math.max(prev?.diem ?? 0, diem), n: (prev?.n ?? 0) + 1 };
    lsSet("best", best);
    lsDel(`${d.id}_a`);
    lsDel(`${d.id}_t`);
    setRes({ dung, tong: qs.length, diem, sec, auto });
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    finishRef.current = finish;
  });

  function ask() {
    const miss = qs.filter((q) => ans[q.n] == null);
    if (!armed) {
      setArmed(true);
      window.clearTimeout(armTimer.current);
      armTimer.current = window.setTimeout(() => setArmed(false), 5000);
      if (miss.length) document.getElementById(`q${miss[0].n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    finish(false);
  }

  if (phase === "intro") {
    return (
      <div className="dx-paper" style={{ textAlign: "center" }}>
        <PaperHead d={d} sub="MÔN: TIẾNG TRUNG QUỐC" />
        <p style={{ fontSize: 18 }}>
          ⏱ Thời gian làm bài: <b>{d.time} phút</b> · <b>{qs.length} câu</b> trắc nghiệm A, B, C, D · thang điểm 10
        </p>
        <p className="muted">
          Đồng hồ bắt đầu chạy khi bấm “Bắt đầu”. Hết giờ bài được nộp tự động. Sau khi nộp sẽ có điểm và giải thích chi
          tiết từng câu.
        </p>
        <p style={{ marginTop: 14 }}>
          <button type="button" className="btn pri" onClick={start}>
            {savedT ? "▶ Làm tiếp (đồng hồ vẫn đang chạy)" : "▶ Bắt đầu làm bài"}
          </button>
        </p>
        <p style={{ marginTop: 10 }}>
          <a href={href("de-thi-d4.html")}>← Danh sách đề</a>
        </p>
      </div>
    );
  }

  const done = phase === "done";
  const count = qs.filter((q) => ans[q.n] != null).length;
  const missing = qs.length - count;
  const showIns = insFlags(d);
  const keyMap: Record<number, string> = Object.fromEntries(qs.map((q) => [q.n, q.o[q.a]]));

  return (
    <>
      <div className="dx-top">
        <b className="t">
          Đề {d.id} · {qs.length} câu
        </b>
        <span className={`dx-clock${!done && left < 300 ? " low" : ""}`}>{done ? "Đã nộp" : mmss(left)}</span>
        <span>
          Đã làm {count}/{qs.length}
        </span>
        {!done && (
          <button type="button" className="btn pri" onClick={ask}>
            {armed ? (missing ? `Còn ${missing} câu chưa làm – bấm lần nữa để nộp` : "Bấm lần nữa để nộp bài") : "📤 Nộp bài"}
          </button>
        )}
        <div className="dx-nav">
          {qs.map((q) => {
            const cls = done ? (ans[q.n] === q.a ? "ok" : "no") : ans[q.n] != null ? "d" : undefined;
            return (
              <a href={`#q${q.n}`} className={cls} key={q.n}>
                {q.n}
              </a>
            );
          })}
        </div>
      </div>
      <div className="dx-paper">
        <PaperHead d={d} sub={`MÔN: TIẾNG TRUNG QUỐC · Thời gian làm bài: ${d.time} phút`} />
        {done && res && (
          <div className="dx-res">
            {res.auto && <p>⏰ Hết giờ – bài đã được nộp tự động.</p>}
            <div className="sc">{res.diem} điểm</div>
            <p>
              Đúng <b>{res.dung}/{res.tong}</b> câu · thời gian làm {mmss(res.sec)}
            </p>
            <p>
              Kéo xuống để xem <b>giải thích chi tiết từng câu</b>. Câu sai được tô đỏ trên thanh số câu.
            </p>
            <p style={{ fontSize: 14.5, color: "#ffe0d9" }}>
              Điểm được lưu trên trình duyệt này. Lưu điểm vào tài khoản học viên cần máy chủ – trung tâm sẽ bật sau.
            </p>
            <p style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn gold" onClick={start}>
                ↻ Làm lại đề này
              </button>
              <a className="btn" style={{ background: "#fff", color: "#7e0a10" }} href={href("de-thi-d4.html")}>
                Danh sách đề
              </a>
            </p>
          </div>
        )}
        {d.parts.map((p, pi) => {
          return (
            <div className="dx-part" key={pi}>
              {showIns[pi] && <div className="dx-ins">{p.h}</div>}
              {p.p && <div className="dx-txt">{rich(p.p, done ? keyMap : undefined)}</div>}
              {p.p && p.src && <p className="dx-src">{p.src}</p>}
              {p.q.map((q) => {
                const me = ans[q.n];
                const ok = me === q.a;
                return (
                  <div className={`dx-q${done ? (ok ? " ok" : " no") : ""}`} id={`q${q.n}`} key={q.n}>
                    <div className="qq">
                      <b>Câu {q.n}.</b> {rich(q.q ?? "")}
                    </div>
                    <div className="dx-o">
                      {q.o.map((o, i) => {
                        let cls: string | undefined;
                        if (done) cls = i === q.a ? "right" : i === me ? "wrong" : undefined;
                        else if (me === i) cls = "sel";
                        return (
                          <label className={cls} key={i}>
                            <input
                              type="radio"
                              name={`c${q.n}`}
                              value={i}
                              checked={me === i}
                              disabled={done}
                              onChange={() => choose(q.n, i)}
                            />{" "}
                            <span>
                              <b>{L[i]}.</b> {o}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {done && (
                      <div className="dx-ex">
                        <div>
                          <b style={{ color: ok ? "#2b8a3e" : "#c92a2a" }}>
                            {ok ? "✓ Đúng" : me == null ? "✗ Chưa làm" : `✗ Sai – bạn chọn ${L[me]}`}
                          </b>{" "}
                          · Đáp án đúng: <b>{L[q.a]}</b>
                        </div>
                        {q.g && <div style={{ margin: "4px 0" }}>{q.g}</div>}
                        {(q.w ?? []).map((w, i) =>
                          w ? (
                            <div className={`w${i === q.a ? " c" : ""}`} key={i}>
                              <b>{L[i]}.</b> {w}
                            </div>
                          ) : null,
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {!done && (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            <button type="button" className="btn pri" onClick={ask}>
              {armed ? "Bấm lần nữa để nộp bài" : "📤 Nộp bài"}
            </button>
          </p>
        )}
        <p className="muted" style={{ textAlign: "center" }}>
          ------ HẾT ------
        </p>
      </div>
    </>
  );
}

/** Trang đề luyện thi D4: ?d=001 → làm đề, không có ?d → danh sách đề, ?giai=1 → chế độ giải đề (cần máy chủ) */
export function D4App({ id, giai }: { id?: string; giai?: boolean }) {
  const d = findD4(id);
  let body: ReactNode;
  if (!id) body = <List />;
  else if (!d)
    body = (
      <div className="dx-lock">
        <div style={{ fontSize: 42 }}>📄</div>
        <p>
          <b>Không tìm thấy đề {id}. Đề có thể chưa được cập nhật.</b>
        </p>
        <p style={{ marginTop: 10 }}>
          <a className="btn pri" href={href("de-thi-d4.html")}>
            Danh sách đề
          </a>
        </p>
      </div>
    );
  else if (giai)
    body = (
      <div className="dx-lock">
        <div style={{ fontSize: 42 }}>🔒</div>
        <p>
          <b>Chế độ giải đề dành cho giáo viên / quản trị cần đăng nhập trên máy chủ – trung tâm sẽ bật sau.</b>
        </p>
        <p className="muted">Học sinh làm đề rồi nộp bài sẽ xem được đáp án và giải thích chi tiết từng câu.</p>
        <p style={{ marginTop: 10 }}>
          <a className="btn pri" href={href(`de-thi-d4.html?d=${d.id}`)}>
            Làm đề
          </a>
        </p>
      </div>
    );
  else body = <Exam d={d} key={d.id} />;
  return (
    <div className="dx" id="dx">
      {body}
    </div>
  );
}
