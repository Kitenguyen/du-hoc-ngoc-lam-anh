"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND, href } from "../../data";
import { stopSpeak } from "../tu-dien/hanzi";
import { DECKS, SECTIONS, SECTION_OF, type Deck, type Slide } from "./decks";
import { beep, ding, SlideView, slideTitle, type Show } from "./slides";

/* ---------- Lưu trên máy (localStorage, bọc try/catch) ---------- */
const LS = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem("nla_tc_" + k);
      return v == null ? d : (JSON.parse(v) as T);
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem("nla_tc_" + k, JSON.stringify(v));
    } catch {
      /* bỏ qua */
    }
  },
};

type Pop = "call" | "score" | "rec" | "note" | null;
type Team = { n: string; s: number };
const TCOL = ["#d32f2f", "#1d5fb8", "#1f8a4c", "#c46a12"];
const INK_W = 1600;
const INK_H = 758;

/* ---------- Chọn bài ---------- */
function Chooser({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div id="load">
      <div>
        <p className="ld-nav">
          <a href={href("index.html")}>← {BRAND.headerName}</a> · <a href={href("tai-lieu.html#giao-an")}>Giáo án giảng dạy</a>
        </p>
        <h1>📽 Bài giảng trình chiếu</h1>
        <p className="hint">Chọn bài để trình chiếu trên lớp. Dùng phím ← → để chuyển slide, F toàn màn hình, B bút vẽ.</p>
        <div className="bk">
          {DECKS.map((d) => (
            <a
              key={d.id}
              href={`?d=${d.id}`}
              onClick={(e) => {
                e.preventDefault();
                onPick(d.id);
              }}
            >
              <b>
                第{d.lesson}课 {d.title_zh}
              </b>
              <span className="hint">
                {d.level} · {d.title_vi} · {d.slides.length} slide
              </span>
            </a>
          ))}
        </div>
        <p className="hint">Bài mẫu do trung tâm soạn — thêm bài mới trong tệp dữ liệu trình chiếu (decks.ts).</p>
      </div>
    </div>
  );
}

/* ---------- Trình chiếu ---------- */
export function Player() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("d");
    // Đọc bài từ địa chỉ trang (?d=…) — chỉ có ở trình duyệt
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id && DECKS.some((d) => d.id === id)) setDeckId(id);
    setReady(true);
    const onPop = () => setDeckId(new URLSearchParams(window.location.search).get("d"));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const pick = (id: string | null) => {
    window.history.pushState(null, "", id ? `?d=${id}` : window.location.pathname);
    setDeckId(id);
  };

  const deck = DECKS.find((d) => d.id === deckId);
  if (!ready) return <div id="load" />;
  if (!deck) return <Chooser onPick={pick} />;
  return <Stage key={deck.id} deck={deck} onExit={() => pick(null)} />;
}

function Stage({ deck, onExit }: { deck: Deck; onExit: () => void }) {
  const slides = deck.slides;
  const [cur, setCur] = useState(() => Math.min(LS.get(`pos_${deck.id}`, 0), slides.length - 1));
  const [scale, setScale] = useState(1);
  const [show, setShow] = useState<Show>({ py: false, vi: false, nw: true });
  const [rate, setRate] = useState(1);
  const [pop, setPop] = useState<Pop>(null);
  const [pen, setPen] = useState(false);
  const [spot, setSpot] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [toast, setToast] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const say = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((t) => (t === m ? "" : t)), 2400);
  }, []);

  /* co giãn sân khấu 1600×900 theo cửa sổ */
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const go = useCallback(
    (i: number) => {
      if (i < 0 || i >= slides.length) return;
      stopSpeak();
      setCur(i);
      LS.set(`pos_${deck.id}`, i);
    },
    [slides.length, deck.id],
  );

  const step = useCallback(
    (d: number) => {
      stopSpeak();
      setCur((c) => {
        const n = Math.max(0, Math.min(slides.length - 1, c + d));
        LS.set(`pos_${deck.id}`, n);
        return n;
      });
    },
    [slides.length, deck.id],
  );

  const toggleFull = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else rootRef.current?.requestFullscreen();
    } catch {
      say("Trình duyệt không hỗ trợ toàn màn hình");
    }
  }, [say]);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) {
        step(1);
        e.preventDefault();
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        step(-1);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setPop(null);
        setPen(false);
        setSpot(false);
      } else if (e.key === "f" || e.key === "F") toggleFull();
      else if (e.key === "b" || e.key === "B") setPen((p) => !p);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [step, toggleFull]);

  const s = slides[cur];
  const sec = SECTION_OF[s.type];
  const { title, sub } = slideTitle(s, deck);
  const secs = SECTIONS.filter(([k]) => slides.some((x) => SECTION_OF[x.type] === k));
  const cls = s.type === "cover" ? "cover" : s.type === "end" ? "endsl" : "";

  const onGo = (type: Slide["type"]) => {
    const i = slides.findIndex((x) => x.type === type);
    if (i >= 0) go(i);
  };

  const togglePop = (p: Exclude<Pop, null>) => setPop((x) => (x === p ? null : p));

  return (
    <div id="wrap" ref={rootRef}>
      <div id="stage" style={{ transform: `translate(-50%,-50%) scale(${scale})` }}>
        <header id="hd">
          <span className="badge">BÀI {deck.lesson}</span>
          <div className="ttl">
            <b>{title}</b>
            <small>{sub}</small>
          </div>
          <nav id="nav">
            {secs.map(([k, n]) => (
              <button key={k} type="button" className={k === sec ? "on" : ""} onClick={() => go(slides.findIndex((x) => SECTION_OF[x.type] === k))}>
                {n}
              </button>
            ))}
          </nav>
          <Teams />
          <span id="brand">{BRAND.headerName}</span>
        </header>
        <main id="body">
          <section key={cur} className={`slide on ${cls}`}>
            <SlideView s={s} deck={deck} show={show} setShow={setShow} rate={rate} setRate={setRate} onGo={onGo} />
          </section>
          <Ink on={pen} cur={cur} onDone={() => setPen(false)} />
          <Spotlight on={spot} onOff={() => setSpot(false)} />
        </main>
        <footer id="ft">
          <button className="nb" type="button" onClick={onExit} title="Chọn bài khác">
            ☰
          </button>
          <button className="nb" type="button" onClick={() => step(-1)} title="Slide trước (←)">
            ‹
          </button>
          <span id="cnt">
            {cur + 1}/{slides.length}
          </span>
          <button className="nb" type="button" onClick={() => step(1)} title="Slide sau (→)">
            ›
          </button>
          <div id="prog">
            {slides.map((x, i) => (
              <i key={i} title={slideTitle(x, deck).title} className={i < cur ? "done" : i === cur ? "cur" : ""} onClick={() => go(i)} />
            ))}
          </div>
          <div className="tools">
            <button type="button" className={pop === "call" ? "on" : ""} onClick={() => togglePop("call")}>
              🎯 Gọi tên
            </button>
            <button type="button" className={timerOn ? "on" : ""} onClick={() => setTimerOn((t) => !t)}>
              ⏱ Hẹn giờ
            </button>
            <button type="button" className={pop === "score" ? "on" : ""} onClick={() => togglePop("score")}>
              🏆 Điểm
            </button>
            <button type="button" className={pen ? "on" : ""} onClick={() => setPen((p) => !p)}>
              ✏️ Bút
            </button>
            <button type="button" className={spot ? "on" : ""} onClick={() => setSpot((p) => !p)}>
              🔦 Đèn chiếu
            </button>
            <button type="button" className={pop === "rec" ? "on" : ""} onClick={() => togglePop("rec")}>
              🎙 Ghi âm
            </button>
            <button type="button" className={pop === "note" ? "on" : ""} onClick={() => togglePop("note")}>
              📝 Ghi chú
            </button>
            <button type="button" onClick={toggleFull}>
              ⛶ Toàn màn hình
            </button>
          </div>
        </footer>
        {timerOn && <Timer onClose={() => setTimerOn(false)} />}
        {pop === "call" && <CallPop onClose={() => setPop(null)} />}
        {pop === "score" && <ScorePop onClose={() => setPop(null)} />}
        {pop === "rec" && <RecPop onClose={() => setPop(null)} say={say} />}
        {pop === "note" && <NotePop key={cur} deck={deck} cur={cur} onClose={() => setPop(null)} />}
        {toast && <div id="toast">{toast}</div>}
      </div>
    </div>
  );
}

/* ---------- Đội thi đua (chip trên header + bảng điểm) ---------- */
const TEAM_EVT = "nla-tc-teams";
function useTeams(): [Team[], (t: Team[]) => void] {
  const [teams, setTeams] = useState<Team[]>(() =>
    LS.get<Team[]>("teams", [
      { n: "Đội 1", s: 0 },
      { n: "Đội 2", s: 0 },
    ]),
  );
  useEffect(() => {
    const on = () => setTeams(LS.get<Team[]>("teams", []));
    window.addEventListener(TEAM_EVT, on);
    return () => window.removeEventListener(TEAM_EVT, on);
  }, []);
  const update = (t: Team[]) => {
    LS.set("teams", t);
    setTeams(t);
    window.dispatchEvent(new Event(TEAM_EVT));
  };
  return [teams, update];
}

function Teams() {
  const [teams] = useTeams();
  return (
    <div id="teams">
      {teams.map((t, i) => (
        <span className="tchip" key={i}>
          <i style={{ background: TCOL[i] }} />
          {t.n} <span>{t.s}</span>
        </span>
      ))}
    </div>
  );
}

function ScorePop({ onClose }: { onClose: () => void }) {
  const [teams, setTeams] = useTeams();
  return (
    <div className="pop on" style={{ right: 20, top: 96 }}>
      <h6>
        🏆 Điểm thi đua{" "}
        <button type="button" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </h6>
      <div style={{ display: "grid", gap: 8 }}>
        {teams.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: TCOL[i] }} />
            <input type="text" value={t.n} onChange={(e) => setTeams(teams.map((x, j) => (j === i ? { ...x, n: e.target.value } : x)))} style={{ flex: 1 }} aria-label="Tên đội" />
            <button type="button" className="tbtn sm" onClick={() => setTeams(teams.map((x, j) => (j === i ? { ...x, s: x.s - 1 } : x)))}>
              −
            </button>
            <b style={{ fontSize: 24, minWidth: 34, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{t.s}</b>
            <button
              type="button"
              className="tbtn sm red"
              onClick={() => {
                ding();
                setTeams(teams.map((x, j) => (j === i ? { ...x, s: x.s + 1 } : x)));
              }}
            >
              +
            </button>
          </div>
        ))}
      </div>
      <div className="row-b" style={{ marginTop: 10 }}>
        <button type="button" className="tbtn sm" onClick={() => teams.length < 4 && setTeams([...teams, { n: `Đội ${teams.length + 1}`, s: 0 }])}>
          + Thêm đội
        </button>
        <button type="button" className="tbtn sm" onClick={() => teams.length > 1 && setTeams(teams.slice(0, -1))}>
          − Bớt đội
        </button>
        <button type="button" className="tbtn sm" onClick={() => setTeams(teams.map((x) => ({ ...x, s: 0 })))}>
          ↺ Về 0
        </button>
      </div>
      <p className="hint" style={{ margin: "8px 0 0" }}>
        Bảng điểm luôn hiện ở góc trên bên phải.
      </p>
    </div>
  );
}

/* ---------- Gọi tên ngẫu nhiên ---------- */
function CallPop({ onClose }: { onClose: () => void }) {
  const [names, setNames] = useState<string[]>(() => LS.get<string[]>("names", []));
  const [called, setCalled] = useState<string[]>([]);
  const [out, setOut] = useState("Bấm “Quay”");
  const [noRep, setNoRep] = useState(true);
  const [input, setInput] = useState("");
  const [sure, setSure] = useState(false);
  const save = (n: string[]) => {
    setNames(n);
    LS.set("names", n);
  };
  const add = (text: string) => {
    const v = text
      .split(/[\n,;]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    save([...names, ...v.filter((x, i) => !names.includes(x) && v.indexOf(x) === i)]);
    setInput("");
  };
  const spin = () => {
    if (!names.length) {
      setOut("Thêm tên học viên trước");
      return;
    }
    let pool = names.filter((n) => !noRep || !called.includes(n));
    let cl = called;
    if (!pool.length) {
      pool = [...names];
      cl = [];
    }
    const win = pool[Math.floor(Math.random() * pool.length)];
    let k = 0;
    const steps = 22;
    const run = () => {
      setOut(names[Math.floor(Math.random() * names.length)]);
      beep(500 + k * 20, 0.03, 0.06);
      if (++k < steps) setTimeout(run, 40 + k * k * 0.6);
      else {
        setOut("🎉 " + win);
        setCalled([...cl, win]);
        ding();
      }
    };
    run();
  };
  return (
    <div className="pop on" style={{ right: 20, bottom: 70 }}>
      <h6>
        🎯 Gọi tên ngẫu nhiên{" "}
        <button type="button" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </h6>
      <div className="spin">{out}</div>
      <div className="row-b" style={{ marginTop: 10 }}>
        <button type="button" className="tbtn red" onClick={spin}>
          🎲 Quay
        </button>
        <button
          type="button"
          className="tbtn"
          onClick={() => {
            setCalled([]);
            setOut("Bấm “Quay”");
          }}
        >
          ↺ Lượt mới
        </button>
        <label className="hint" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={noRep} onChange={(e) => setNoRep(e.target.checked)} /> Không gọi lặp
        </label>
      </div>
      <div className="hint" style={{ marginTop: 10 }}>
        Danh sách lớp · {names.length} học viên
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
        <input
          type="text"
          value={input}
          placeholder="Gõ tên rồi Enter (dán nhiều tên, mỗi dòng 1 tên)"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add(input)}
          onPaste={(e) => {
            const t = e.clipboardData.getData("text");
            if (/\n/.test(t)) {
              e.preventDefault();
              add(t);
            }
          }}
          aria-label="Tên học viên"
        />
        <button type="button" className="tbtn sm red" onClick={() => add(input)}>
          + Thêm
        </button>
      </div>
      <div className="names">
        {names.map((n, i) => (
          <span key={n} className={called.includes(n) ? "out" : ""}>
            {n}
            <b onClick={() => save(names.filter((_, j) => j !== i))}>×</b>
          </span>
        ))}
      </div>
      <button
        type="button"
        className="tbtn sm"
        onClick={() => {
          if (sure) {
            save([]);
            setCalled([]);
            setSure(false);
          } else setSure(true);
        }}
      >
        {sure ? "Bấm lần nữa để xóa hết" : "🗑 Xóa hết danh sách"}
      </button>
    </div>
  );
}

/* ---------- Hẹn giờ ---------- */
function Timer({ onClose }: { onClose: () => void }) {
  const [left, setLeft] = useState(60);
  const [run, setRun] = useState(false);
  const [end, setEnd] = useState(false);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => {
      setLeft((l) => {
        const n = l - 1;
        if (n <= 3 && n > 0) beep(660, 0.1);
        if (n <= 0) {
          setRun(false);
          setEnd(true);
          beep(988, 0.4, 0.25);
          setTimeout(() => beep(988, 0.6, 0.25), 450);
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [run]);
  const mm = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  return (
    <div id="timer" className={`on${end ? " end" : ""}`}>
      <b>{mm}</b>
      {[30, 60, 120, 180, 300].map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => {
            setRun(false);
            setEnd(false);
            setLeft(t);
          }}
        >
          {t < 60 ? `${t}s` : `${t / 60}'`}
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          setEnd(false);
          if (left > 0) setRun((r) => !r);
        }}
      >
        {run ? "❚❚" : "▶"}
      </button>
      <button type="button" onClick={onClose} aria-label="Đóng">
        ✕
      </button>
    </div>
  );
}

/* ---------- Bút vẽ trên slide ---------- */
function Ink({ on, cur, onDone }: { on: boolean; cur: number; onDone: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const store = useRef<Record<number, ImageData>>({});
  const last = useRef<[number, number] | null>(null);
  const prevCur = useRef(cur);
  const [pen, setPenStyle] = useState({ c: "#d32f2f", w: 6, hl: false, er: false });

  useEffect(() => {
    const c = cv.current?.getContext("2d");
    if (!c) return;
    const old = prevCur.current;
    if (old !== cur) {
      store.current[old] = c.getImageData(0, 0, INK_W, INK_H);
      prevCur.current = cur;
    }
    c.clearRect(0, 0, INK_W, INK_H);
    const d = store.current[cur];
    if (d) c.putImageData(d, 0, 0);
  }, [cur]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) * INK_W) / r.width, ((e.clientY - r.top) * INK_H) / r.height];
  };

  return (
    <>
      <canvas
        id="ink"
        ref={cv}
        width={INK_W}
        height={INK_H}
        className={on ? "on" : ""}
        onPointerDown={(e) => {
          last.current = pos(e);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const c = e.currentTarget.getContext("2d");
          if (!c || !last.current) return;
          const p = pos(e);
          c.globalCompositeOperation = pen.er ? "destination-out" : "source-over";
          c.strokeStyle = pen.hl ? pen.c + "55" : pen.c;
          c.lineWidth = pen.er ? 30 : pen.hl ? 22 : pen.w;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.beginPath();
          c.moveTo(last.current[0], last.current[1]);
          c.lineTo(p[0], p[1]);
          c.stroke();
          last.current = p;
        }}
        onPointerUp={() => (last.current = null)}
      />
      {on && (
        <div id="penbar" className="on">
          {[
            ["#d32f2f", "Đỏ"],
            ["#1d5fb8", "Xanh"],
            ["#f2b134", "Vàng"],
            ["#1f1716", "Đen"],
          ].map(([c, n]) => (
            <button
              key={c}
              type="button"
              className={`c${pen.c === c && !pen.er ? " on" : ""}`}
              style={{ background: c }}
              aria-label={n}
              onClick={() => setPenStyle({ ...pen, c, er: false })}
            />
          ))}
          {[
            [3, "Mảnh"],
            [6, "Vừa"],
            [12, "Đậm"],
          ].map(([w, n]) => (
            <button key={n} type="button" className={`s${pen.w === w && !pen.hl && !pen.er ? " on" : ""}`} onClick={() => setPenStyle({ ...pen, w: w as number, hl: false, er: false })}>
              {n}
            </button>
          ))}
          <button type="button" className={`s${pen.hl ? " on" : ""}`} onClick={() => setPenStyle({ ...pen, hl: !pen.hl, er: false })}>
            Bút dạ
          </button>
          <button type="button" className={`s${pen.er ? " on" : ""}`} onClick={() => setPenStyle({ ...pen, er: !pen.er })}>
            Tẩy
          </button>
          <button
            type="button"
            className="s"
            onClick={() => {
              cv.current?.getContext("2d")?.clearRect(0, 0, INK_W, INK_H);
              delete store.current[cur];
            }}
          >
            Xóa hết
          </button>
          <button type="button" className="s done" onClick={onDone}>
            Xong
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- Đèn chiếu ---------- */
function Spotlight({ on, onOff }: { on: boolean; onOff: () => void }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const sp = useRef({ x: 800, y: 380, r: 180 });
  const draw = useCallback(() => {
    const c = cv.current?.getContext("2d");
    if (!c) return;
    const { x, y, r } = sp.current;
    c.globalCompositeOperation = "source-over";
    c.clearRect(0, 0, INK_W, INK_H);
    c.fillStyle = "rgba(10,6,6,.82)";
    c.fillRect(0, 0, INK_W, INK_H);
    const g = c.createRadialGradient(x, y, r * 0.8, x, y, r);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, 7);
    c.fill();
    c.globalCompositeOperation = "source-over";
  }, []);
  useEffect(() => {
    if (on) draw();
  }, [on, draw]);
  useEffect(() => {
    const el = cv.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      sp.current.r = Math.max(60, Math.min(520, sp.current.r - e.deltaY * 0.3));
      draw();
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [draw]);
  return (
    <canvas
      id="spot"
      ref={cv}
      width={INK_W}
      height={INK_H}
      className={on ? "on" : ""}
      title="Di chuột để soi · lăn chuột đổi cỡ · nhấp đúp để tắt"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        sp.current.x = ((e.clientX - r.left) * INK_W) / r.width;
        sp.current.y = ((e.clientY - r.top) * INK_H) / r.height;
        draw();
      }}
      onDoubleClick={onOff}
    />
  );
}

/* ---------- Ghi âm học viên (micro máy này) ---------- */
function RecPop({ onClose, say }: { onClose: () => void; say: (m: string) => void }) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [clips, setClips] = useState<{ url: string; at: string }[]>([]);
  const clipsRef = useRef(clips);
  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);
  useEffect(() => () => clipsRef.current.forEach((c) => URL.revokeObjectURL(c.url)), []);

  async function toggle() {
    if (rec) {
      rec.stop();
      setRec(null);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
        const d = new Date();
        setClips((c) => [{ url, at: `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}` }, ...c].slice(0, 10));
      };
      mr.start();
      setRec(mr);
    } catch {
      say("Không mở được micro — hãy cho phép trình duyệt dùng micro.");
    }
  }

  return (
    <div className="pop on" style={{ right: 20, bottom: 70 }}>
      <h6>
        🎙 Ghi âm học viên{" "}
        <button type="button" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </h6>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <button type="button" className={`rec-btn${rec ? " on" : ""}`} onClick={toggle} aria-label={rec ? "Dừng ghi âm" : "Ghi âm"} />
        <div className="hint">{rec ? "Đang thu… bấm lại để dừng." : "Bấm nút đỏ để thu bằng micro máy này. Bấm lại để dừng, nghe lại ngay bên dưới."}</div>
      </div>
      <div className="clips">
        {clips.map((c) => (
          <div key={c.url}>
            <span>{c.at}</span>
            <audio controls src={c.url} />
            <a href={c.url} download={`ghi-am_${c.at.replace(/:/g, "")}.webm`} title="Tải về">
              ⬇
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Ghi chú giáo viên + gợi ý dạy ---------- */
function NotePop({ deck, cur, onClose }: { deck: Deck; cur: number; onClose: () => void }) {
  const key = `note_${deck.id}_${cur}`;
  const [text, setText] = useState(() => LS.get(key, ""));
  const [all, setAll] = useState(false);
  const s = deck.slides[cur];
  const tips = "tips" in s ? s.tips : undefined;
  const allNotes = () =>
    deck.slides
      .map((x, i) => {
        const v = LS.get(`note_${deck.id}_${i}`, "");
        return v ? `Slide ${i + 1} · ${slideTitle(x, deck).title}\n${v}\n` : "";
      })
      .filter(Boolean)
      .join("\n");
  return (
    <div className="pop on" style={{ right: 20, bottom: 70, width: 420 }}>
      <h6>
        📝 Ghi chú giáo viên{" "}
        <button type="button" onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </h6>
      <div className="hint">
        Slide {cur + 1} · {slideTitle(s, deck).title}
      </div>
      <textarea
        key={key}
        rows={4}
        value={text}
        placeholder="Ghi chú cho slide này: câu hỏi muốn hỏi, học viên cần chú ý… (tự lưu trên máy này)"
        onChange={(e) => {
          setText(e.target.value);
          LS.set(key, e.target.value);
        }}
      />
      <div className="row-b" style={{ marginTop: 6 }}>
        <button type="button" className="tbtn sm" onClick={() => setAll((a) => !a)}>
          👁 {all ? "Gợi ý slide này" : "Xem tất cả ghi chú"}
        </button>
        <button
          type="button"
          className="tbtn sm"
          onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([`Ghi chú giáo viên · Bài ${deck.lesson} ${deck.title_zh}\n\n${allNotes()}`], { type: "text/plain;charset=utf-8" }));
            a.download = `ghi-chu-bai-${deck.lesson}.txt`;
            a.click();
          }}
        >
          ⬇ Tải về (.txt)
        </button>
      </div>
      <div className="tipbox">
        {all ? (
          <>
            <b>Tất cả ghi chú của bài</b>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "6px 0 0" }}>{allNotes() || "Chưa có ghi chú nào."}</pre>
          </>
        ) : (
          <>
            <b>💡 Gợi ý soạn sẵn cho slide này</b>
            {!tips && <div>Chưa có gợi ý cho slide này.</div>}
            {tips?.t && (
              <div>
                ⏱ Thời lượng gợi ý: <b>{tips.t}</b>
              </div>
            )}
            {!!tips?.how?.length && (
              <div style={{ marginTop: 6 }}>
                <b>CÁCH DẠY</b>
                <ul>
                  {tips.how.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!tips?.ask?.length && (
              <div>
                <b>CÂU HỎI GỢI MỞ</b>
                <ul>
                  {tips.ask.map((x) => (
                    <li key={x} className="zh">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
