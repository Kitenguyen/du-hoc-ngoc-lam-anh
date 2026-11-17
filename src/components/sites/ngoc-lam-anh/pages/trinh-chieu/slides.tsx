"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { BRAND } from "../../data";
import { speak, stopSpeak } from "../tu-dien/hanzi";
import type { Deck, Line, Sent, Slide, Word } from "./decks";

/* ---------- Âm thanh hiệu ứng ---------- */
let AC: AudioContext | null = null;
function actx(): AudioContext | null {
  try {
    if (!AC) AC = new AudioContext();
    if (AC.state === "suspended") AC.resume();
  } catch {
    return null;
  }
  return AC;
}
export function beep(f = 880, d = 0.12, v = 0.15, type: OscillatorType = "sine") {
  const c = actx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = f;
  g.gain.value = v;
  o.connect(g);
  g.connect(c.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d);
  o.stop(c.currentTime + d);
}
export const ding = () => {
  beep(880, 0.12);
  setTimeout(() => beep(1320, 0.18), 110);
};
export const buzz = () => beep(160, 0.25, 0.18, "square");

export function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const zhClean = (s: string) => s.replace(/[\s，。！？、；：“”‘’《》（）()!?,.;:"']/g, "");
const SPCOL = ["#b8121f", "#1d5fb8", "#1f8a4c", "#6b3fc4", "#c46a12"];

export type Show = { py: boolean; vi: boolean; nw: boolean };
export type SlideProps = { deck: Deck; show: Show; setShow: (s: Show) => void; rate: number; setRate: (r: number) => void };

/* ---------- Đọc lần lượt ---------- */
function useSeq() {
  const tok = useRef(0);
  const [idx, setIdx] = useState(-1);
  useEffect(() => {
    const t = tok;
    return () => {
      t.current++;
      stopSpeak();
    };
  }, []);
  async function play(items: string[], rate: number) {
    const my = ++tok.current;
    for (let i = 0; i < items.length; i++) {
      if (my !== tok.current) return;
      setIdx(i);
      await speak(items[i], 0.9 * rate);
      await new Promise((r) => setTimeout(r, 350));
    }
    if (my === tok.current) setIdx(-1);
  }
  function stop() {
    tok.current++;
    stopSpeak();
    setIdx(-1);
  }
  return { idx, play, stop };
}

function RateSelect({ rate, setRate }: { rate: number; setRate: (r: number) => void }) {
  return (
    <select value={rate} onChange={(e) => setRate(+e.target.value)} aria-label="Tốc độ đọc">
      <option value={1}>1×</option>
      <option value={0.8}>0.8×</option>
      <option value={0.6}>0.6×</option>
    </select>
  );
}

/** Câu bấm để nghe; pinyin/nghĩa hiện khi mở hoặc khi bật nút */
export function SentView({ o, cls = "", show, children }: { o: Sent; cls?: string; show: Show; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  return (
    <div
      className={`sent ${cls}${open ? " open" : ""}${playing ? " playing" : ""}`}
      onClick={() => {
        setOpen((x) => !x);
        setPlaying(true);
        speak(o.zh).then(() => setPlaying(false));
      }}
    >
      <span className="s-zh">{children ?? o.zh}</span>
      {(open || show.py) && o.py && <span className="s-py">{o.py}</span>}
      {(open || show.vi) && o.vi && <span className="s-vi">{o.vi}</span>}
    </div>
  );
}

function Toggles({ show, setShow }: { show: Show; setShow: (s: Show) => void }) {
  return (
    <>
      <button type="button" className={`tog${show.py ? " on" : ""}`} onClick={() => setShow({ ...show, py: !show.py })}>
        Pinyin
      </button>
      <button type="button" className={`tog${show.vi ? " on" : ""}`} onClick={() => setShow({ ...show, vi: !show.vi })}>
        Nghĩa
      </button>
      <button type="button" className={`tog${show.nw ? " on" : ""}`} onClick={() => setShow({ ...show, nw: !show.nw })}>
        Từ mới
      </button>
    </>
  );
}

/* ---------- Bìa ---------- */
function Cover({ deck, onGo }: { deck: Deck; onGo: (type: Slide["type"]) => void }) {
  const show: Show = { py: false, vi: false, nw: false };
  const cards: { k: string; z: string; v: string; type: Slide["type"]; cls?: string }[] = [];
  deck.slides.forEach((s) => {
    if (s.type === "text") cards.push({ k: "课文 · BÀI KHÓA", z: s.title_zh, v: s.title_vi, type: "text" });
  });
  const gr = deck.slides.filter((s) => s.type === "grammar");
  if (gr.length)
    cards.push({
      k: "语法 · NGỮ PHÁP",
      z: gr.map((g) => (g.type === "grammar" ? g.title_zh : "")).join(" · "),
      v: `${gr.length} điểm ngữ pháp`,
      type: "grammar",
      cls: "gram",
    });
  cards.push({ k: "生词 · TỪ MỚI", z: deck.vocab.slice(0, 5).map((v) => v.h).join(" · ") + " …", v: `${deck.vocab.length} từ mới`, type: "vocab" });
  return (
    <>
      <div className="cv-top">
        <div className="cv-eyebrow">
          {deck.level} · 第{deck.lesson}课 · BÀI {deck.lesson}
        </div>
        <SentView o={{ zh: deck.title_zh, py: "", vi: "" }} cls="cv-title" show={show} />
        <div className="cv-py">{deck.title_py}</div>
        <div className="cv-vi">{deck.title_vi}</div>
        <div className="cv-seal">
          <div>
            <div className="n">{deck.lesson}</div>
            <div className="k">第{deck.lesson}课</div>
          </div>
          <div className="b">{BRAND.headerName}</div>
        </div>
      </div>
      <div className="cv-cards" style={{ gridTemplateColumns: `repeat(${cards.length},1fr)` }}>
        {cards.map((c) => (
          <div key={c.k + c.z} className={`cv-card ${c.cls || ""}`} onClick={() => onGo(c.type)}>
            <div className="k">{c.k}</div>
            <div className="z">{c.z}</div>
            <div className="v">{c.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Mục tiêu ---------- */
function Goals({ deck, s }: { deck: Deck; s: Extract<Slide, { type: "goals" }> }) {
  const nText = deck.slides.filter((x) => x.type === "text").length;
  const nGr = deck.slides.filter((x) => x.type === "grammar").length;
  const nPr = deck.slides.filter((x) => x.type === "practice").length;
  return (
    <div className="goals">
      <div className="goal-hero">
        <span className="lbl" style={{ color: "#fff", opacity: 0.8 }}>
          第{deck.lesson}课 · 学习目标
        </span>
        <div className="z">{deck.title_zh}</div>
        <div style={{ fontSize: 17, opacity: 0.9 }}>{deck.title_vi}</div>
        <div className="goal-stats">
          <div>
            <b>{deck.vocab.length}</b>từ mới
          </div>
          <div>
            <b>{nGr}</b>ngữ pháp
          </div>
          <div>
            <b>{nText}</b>bài khóa
          </div>
          <div>
            <b>{nPr}</b>luyện tập
          </div>
        </div>
      </div>
      <div className="goal-list">
        {s.items.map((g, i) => (
          <div className="goal-item tcard" key={g.title}>
            <div className="no">{i + 1}</div>
            <div>
              <h4>{g.title}</h4>
              <p>{g.text}</p>
              {g.zh && (
                <div className="zh" style={{ marginTop: 6 }}>
                  {g.zh}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Từ mới ---------- */
function Vocab({ s, show, rate, setRate }: { s: Extract<Slide, { type: "vocab" }> } & SlideProps) {
  const [sel, setSel] = useState(-1);
  const seq = useSeq();
  const hl = seq.idx >= 0 ? seq.idx : sel;
  const ws = s.words;
  const big = ws.length > 8;
  return (
    <>
      <div className="vtop">
        <div className="player">
          <button type="button" className="pb" onClick={() => (seq.idx >= 0 ? seq.stop() : seq.play(ws.map((w) => w.h), rate))}>
            {seq.idx >= 0 ? "■" : "▶"}
          </button>
          <b style={{ fontSize: 14 }}>Nghe từ mới</b>
          <RateSelect rate={rate} setRate={setRate} />
        </div>
        <span className="hint">Bấm vào một dòng để nghe và xem ví dụ · Bấm lại để ẩn</span>
      </div>
      <div className={`vgrid${big ? " two" : ""}`}>
        {(big ? [ws.slice(0, Math.ceil(ws.length / 2)), ws.slice(Math.ceil(ws.length / 2))] : [ws]).map((part, pi) => (
          <table className="vt" key={pi}>
            <thead>
              <tr>
                <th>STT</th>
                <th>CHỮ HÁN</th>
                <th>PHIÊN ÂM</th>
                <th>TỪ LOẠI</th>
                <th>NGHĨA</th>
              </tr>
            </thead>
            <tbody>
              {part.map((v) => {
                const i = ws.indexOf(v);
                return (
                  <tr
                    key={v.h}
                    className={hl === i ? "hl" : ""}
                    onClick={() => {
                      seq.stop();
                      if (sel === i) setSel(-1);
                      else {
                        setSel(i);
                        speak(v.h, 0.9 * rate);
                      }
                    }}
                  >
                    <td>{i + 1}</td>
                    <td className="h">{v.h}</td>
                    <td className="p">{v.p}</td>
                    <td className="t">{v.t}</td>
                    <td>{v.m}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ))}
      </div>
      {sel >= 0 && seq.idx < 0 && ws[sel].ex && (
        <div className="vdet tcard">
          <span className="k">例句</span>
          <div>
            <SentView o={ws[sel].ex as Sent} show={show} />
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Bài khóa ---------- */
function markWords(z: string, words: string[], on: boolean): ReactNode {
  if (!on) return z;
  const ws = [...words].filter(Boolean).sort((a, b) => b.length - a.length);
  const out: ReactNode[] = [];
  let i = 0;
  let buf = "";
  while (i < z.length) {
    const w = ws.find((x) => z.startsWith(x, i));
    if (w) {
      if (buf) out.push(buf);
      buf = "";
      out.push(
        <mark className="nw" key={i}>
          {w}
        </mark>,
      );
      i += w.length;
    } else {
      buf += z[i];
      i++;
    }
  }
  if (buf) out.push(buf);
  return out.map((x, k) => <Fragment key={k}>{x}</Fragment>);
}

function TextSlide({ s, deck, show, setShow, rate, setRate }: { s: Extract<Slide, { type: "text" }> } & SlideProps) {
  const seq = useSeq();
  const speakers = [...new Set(s.lines.map((l) => l.sp).filter(Boolean))] as string[];
  const narr = !speakers.length;
  const words = deck.vocab.map((v) => v.h);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (seq.idx >= 0) box.current?.querySelector(`[data-i="${seq.idx}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [seq.idx]);
  const ln = (l: Line, i: number) => {
    const si = l.sp ? speakers.indexOf(l.sp) : 0;
    const bub = (
      <div className={`bub${seq.idx === i ? " playing" : ""}`} data-i={i}>
        <SentView o={l} show={show}>
          {markWords(l.zh, words, show.nw)}
        </SentView>
      </div>
    );
    if (narr)
      return (
        <div className="ln nar" key={i}>
          {bub}
        </div>
      );
    return (
      <div className={`ln${si % 2 ? " alt" : ""}`} key={i}>
        <div className="av">
          <i style={{ background: SPCOL[si % 5] }}>{Array.from(l.sp || "")[0]}</i>
          {l.sp}
        </div>
        {bub}
      </div>
    );
  };
  return (
    <div className="tx">
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="tx-bar">
          <Toggles show={show} setShow={setShow} />
          <div className="player" style={{ marginLeft: "auto" }}>
            <button type="button" className="pb" onClick={() => (seq.idx >= 0 ? seq.stop() : seq.play(s.lines.map((l) => l.zh), rate))}>
              {seq.idx >= 0 ? "■" : "▶"}
            </button>
            <b style={{ fontSize: 14 }}>Nghe bài khóa</b>
            <RateSelect rate={rate} setRate={setRate} />
          </div>
        </div>
        <div className="dlg scroll" ref={box}>
          {s.lines.map(ln)}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="tcard scene">
          <div className="scene-art">{narr ? "短文" : "对话"}</div>
          <span className="lbl">情景 · Bối cảnh</span>
          <div className="z">{s.title_zh}</div>
          <div className="v">{s.title_vi}</div>
        </div>
        {!!speakers.length && (
          <div className="tcard scene">
            <span className="lbl">人物 · Nhân vật</span>
            {speakers.map((sp, i) => (
              <div key={sp} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <i style={{ width: 28, height: 28, borderRadius: "50%", background: SPCOL[i % 5], display: "inline-block" }} />
                <b className="zh" style={{ fontSize: 18 }}>
                  {sp}
                </b>
                <span className="py">{s.lines.find((l) => l.sp === sp)?.sp_py}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Ngữ pháp ---------- */
function Grammar({ s, show, setShow }: { s: Extract<Slide, { type: "grammar" }> } & SlideProps) {
  return (
    <div className="gr">
      <div className="gr-l scroll">
        <span className="lbl" style={{ color: "#fff", opacity: 0.75 }}>
          语法 · NGỮ PHÁP
        </span>
        <div className="z">{s.title_zh}</div>
        <div className="u">{s.usage_zh}</div>
        {show.vi && <div className="uv">{s.usage_vi}</div>}
        <button type="button" className={`tog${show.vi ? " on" : ""}`} style={{ alignSelf: "flex-start", marginTop: "auto" }} onClick={() => setShow({ ...show, vi: !show.vi })}>
          {show.vi ? "Ẩn nghĩa tiếng Việt" : "Hiện nghĩa tiếng Việt"}
        </button>
      </div>
      <div className="gr-r scroll">
        {s.structures.map((st, i) => (
          <div className="tcard st" key={st.f_zh}>
            <span className="pill">公式 {i + 1}</span>
            <div style={{ marginTop: 8 }}>
              <span className="formula">{st.f_zh}</span>
            </div>
            <div className="fvi">{st.f_vi}</div>
            {st.ex.map((x) => (
              <SentView o={x} cls="ex" show={show} key={x.zh} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Luyện tập ---------- */
function OrderCard({ o, n }: { o: { vi: string; tiles: string[]; ans: string }; n: number }) {
  const [tiles] = useState(() => shuffle(o.tiles.map((t, i) => ({ t, i }))));
  const [picked, setPicked] = useState<number[]>([]);
  const [state, setState] = useState<"" | "ok" | "no" | "show">("");
  return (
    <div className="tcard ord">
      <div className="v">
        <b>{n}.</b> {o.vi}
      </div>
      <div className={`slot ${state === "show" ? "ok" : state}`}>
        {state === "show" ? (
          <span className="zh" style={{ fontSize: 22, color: "var(--green)" }}>
            {o.ans}。
          </span>
        ) : (
          picked.map((i) => (
            <button
              key={i}
              type="button"
              className="tile"
              onClick={() => {
                setPicked((p) => p.filter((x) => x !== i));
                setState("");
              }}
            >
              {o.tiles[i]}
            </button>
          ))
        )}
      </div>
      <div className="tiles">
        {tiles.map(({ t, i }) => (
          <button
            key={i}
            type="button"
            className={`tile${picked.includes(i) || state === "show" ? " used" : ""}`}
            onClick={() => {
              setPicked((p) => [...p, i]);
              setState("");
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="row-b" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="tbtn sm"
          onClick={() => {
            setPicked([]);
            setState("");
          }}
        >
          ↺ Làm lại
        </button>
        <button
          type="button"
          className="tbtn sm green"
          onClick={() => {
            const ok = zhClean(picked.map((i) => o.tiles[i]).join("")) === zhClean(o.ans);
            setState(ok ? "ok" : "no");
            if (ok) ding();
            else buzz();
          }}
        >
          ✓ Kiểm tra
        </button>
        <button type="button" className="tbtn sm" onClick={() => setState("show")}>
          👁 Đáp án
        </button>
      </div>
    </div>
  );
}

function ChooseCard({ c, n }: { c: { vi: string; opts: string[]; a: number }; n: number }) {
  const [res, setRes] = useState<Record<number, "ok" | "no">>({});
  return (
    <div className="tcard qz">
      <div className="qh">
        <span className="qn" style={{ background: "var(--red)" }}>
          {n}
        </span>
        <div className="q" style={{ fontSize: 18 }}>
          {c.vi}
        </div>
      </div>
      <div className="opts" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        {c.opts.map((o, j) => (
          <button
            key={o}
            type="button"
            className={`opt ${res[j] || ""}`}
            onClick={() => {
              const ok = j === c.a;
              setRes((r) => ({ ...r, [j]: ok ? "ok" : "no" }));
              if (ok) ding();
              else buzz();
            }}
          >
            <em>{"ABC"[j]}</em>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TfCard({ t }: { t: { s: string; ok: boolean; fix: string } }) {
  const [ans, setAns] = useState<boolean | null>(null);
  const right = ans === t.ok;
  return (
    <div className={`tcard tf${ans !== null ? ` done ${right ? "right" : "wrong"}` : ""}`}>
      <div className="s">{t.s}</div>
      <div className="yn">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => {
              setAns(v);
              if (v === t.ok) ding();
              else buzz();
            }}
          >
            {v ? "✓" : "✗"}
          </button>
        ))}
      </div>
      {ans !== null && <div className="fix">{t.fix}</div>}
    </div>
  );
}

function Practice({ s }: { s: Extract<Slide, { type: "practice" }> }) {
  const blocks: [string, ReactNode][] = [];
  if (s.order) blocks.push(["Sắp xếp thành câu đúng · 连词成句", s.order.map((o, i) => <OrderCard key={o.ans} o={o} n={i + 1} />)]);
  if (s.choose) blocks.push(["Chọn câu đúng · 选择", s.choose.map((c, i) => <ChooseCard key={c.vi} c={c} n={i + 1} />)]);
  if (s.tf) blocks.push(["Đúng hay sai? · 判断对错", s.tf.map((t) => <TfCard key={t.s} t={t} />)]);
  const half = Math.ceil(blocks.length / 2);
  const col = (bs: [string, ReactNode][], off: number) =>
    bs.map((b, i) => (
      <Fragment key={b[0]}>
        <div className="pr-h">
          <i>{off + i + 1}</i>
          {b[0]}
        </div>
        {b[1]}
      </Fragment>
    ));
  return (
    <div className="pr">
      <div className="pr-col scroll">{col(blocks.slice(0, half), 0)}</div>
      <div className="pr-col scroll">{col(blocks.slice(half), half)}</div>
    </div>
  );
}

/* ---------- Nối từ ---------- */
function Match({ deck }: { deck: Deck }) {
  const [game, setGame] = useState(() => ({ round: 0, words: shuffle(deck.vocab).slice(0, 8) }));
  return <MatchBoard key={game.round} words={game.words} again={() => setGame((g) => ({ round: g.round + 1, words: shuffle(deck.vocab).slice(0, 8) }))} />;
}

function MatchBoard({ words, again }: { words: Word[]; again: () => void }) {
  const [right] = useState(() => shuffle(words.map((_, i) => i)));
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [bad, setBad] = useState<number | null>(null);
  const [errs, setErrs] = useState(0);
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const board = useRef<HTMLDivElement>(null);
  const finished = done.length === words.length;

  useEffect(() => {
    if (!t0 || finished) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [t0, finished]);

  useLayoutEffect(() => {
    const b = board.current;
    if (!b) return;
    const br = b.getBoundingClientRect();
    const sc = br.width / b.offsetWidth || 1;
    // Vẽ đường nối cho các cặp đã đúng (tọa độ theo khung chưa co giãn)
    setLines(
      done.map((i) => {
        const a = b.querySelector(`[data-l="${i}"]`)?.getBoundingClientRect();
        const r = b.querySelector(`[data-r="${i}"]`)?.getBoundingClientRect();
        if (!a || !r) return "";
        const x1 = (a.right - br.left) / sc;
        const y1 = (a.top + a.height / 2 - br.top) / sc;
        const x2 = (r.left - br.left) / sc;
        const y2 = (r.top + r.height / 2 - br.top) / sc;
        return `${x1},${y1},${x2},${y2}`;
      }),
    );
  }, [done]);

  const secs = t0 ? Math.max(0, Math.floor((now - t0) / 1000)) : 0;
  const tm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="mt">
      <div className="mt-l">
        <div style={{ fontSize: 32 }}>🔗</div>
        <b style={{ fontSize: 22 }}>Nối từ</b>
        <span style={{ opacity: 0.85, fontSize: 14 }}>Bấm chữ Hán, rồi bấm nghĩa đúng</span>
        <div className="ring" style={{ ["--p" as string]: `${(done.length / words.length) * 100}%` }}>
          <b>
            {done.length}/{words.length}
          </b>
        </div>
        <div className="mstats">
          <div>
            Thời gian<b>{tm}</b>
          </div>
          <div>
            Nối sai<b>{errs}</b>
          </div>
        </div>
        <button type="button" className="tbtn" style={{ marginTop: "auto" }} onClick={again}>
          🎲 Ván mới
        </button>
      </div>
      <div className="mt-board" ref={board}>
        <svg>
          {lines.filter(Boolean).map((l, k) => {
            const [x1, y1, x2, y2] = l.split(",").map(Number);
            return (
              <g key={k}>
                <path d={`M${x1} ${y1} C${x1 + 90} ${y1},${x2 - 90} ${y2},${x2} ${y2}`} stroke="#1f8a4c" strokeWidth="3" fill="none" />
                <circle cx={x1} cy={y1} r="5" fill="#1f8a4c" />
                <circle cx={x2} cy={y2} r="5" fill="#1f8a4c" />
              </g>
            );
          })}
        </svg>
        <div className="mcol">
          {words.map((v, i) => (
            <button
              key={v.h}
              type="button"
              data-l={i}
              className={`mi l${done.includes(i) ? " ok" : sel === i ? " sel" : ""}`}
              onClick={() => {
                if (done.includes(i)) return;
                if (!t0) {
                  setT0(Date.now());
                  setNow(Date.now());
                }
                setSel(i);
                speak(v.h);
              }}
            >
              <span className="zh">{v.h}</span>
              <small>{v.p}</small>
            </button>
          ))}
        </div>
        <div className="mcol">
          {right.map((i) => (
            <button
              key={i}
              type="button"
              data-r={i}
              className={`mi r${done.includes(i) ? " ok" : bad === i ? " no" : ""}`}
              onClick={() => {
                if (sel === null || done.includes(i)) return;
                if (sel === i) {
                  setDone((d) => [...d, i]);
                  setSel(null);
                  setNow(Date.now());
                  ding();
                } else {
                  setErrs((e) => e + 1);
                  setBad(i);
                  setTimeout(() => setBad(null), 400);
                  buzz();
                }
              }}
            >
              {words[i].m}
            </button>
          ))}
        </div>
        <div className={`done-msg${finished ? " on" : ""}`}>
          <div>
            <b>🎉 Hoàn thành!</b>
            <div className="hint" style={{ fontSize: 18 }}>
              Thời gian {tm} · nối sai {errs} lần
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- BTVN & kết thúc ---------- */
function Homework({ deck, s }: { deck: Deck; s: Extract<Slide, { type: "homework" }> }) {
  return (
    <div className="hw">
      <div className="hw-l">
        <span className="lbl" style={{ color: "#fff", opacity: 0.75 }}>
          课后作业
        </span>
        <div className="z">作业</div>
        <div style={{ fontSize: 19 }}>
          Bài tập về nhà
          <br />
          Bài {deck.lesson}: {deck.title_zh}
        </div>
        <p style={{ marginTop: "auto", fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>Nộp trước buổi học sau. Bài ghi âm gửi qua nhóm lớp.</p>
      </div>
      <div className="hw-grid">
        {s.items.map((h, i) => (
          <div className="tcard hw-it" key={h[0]}>
            <div className="no">{i + 1}</div>
            <div>
              <h4>{h[0]}</h4>
              <p>{h[1]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function End() {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="z">谢谢！下课！</div>
      <div style={{ fontSize: 26, opacity: 0.9 }}>Cảm ơn các em · Hẹn gặp lại buổi sau</div>
      <div style={{ marginTop: 28, fontSize: 18, opacity: 0.75, letterSpacing: ".2em", fontWeight: 700 }}>{BRAND.headerName}</div>
    </div>
  );
}

/* ---------- Bộ chọn slide ---------- */
export function slideTitle(s: Slide, deck: Deck): { title: string; sub: string } {
  switch (s.type) {
    case "cover":
      return { title: "Bìa bài học", sub: `${deck.level} · 第${deck.lesson}课` };
    case "goals":
      return { title: "Mục tiêu bài học", sub: "学习目标" };
    case "vocab":
      return { title: s.title, sub: `生词 · ${s.words.length} từ` };
    case "text":
      return { title: s.title, sub: `${s.title_zh} · ${s.title_vi}` };
    case "grammar":
      return { title: s.title, sub: s.title_zh };
    case "practice":
      return { title: s.title, sub: s.sub };
    case "match":
      return { title: s.title, sub: s.sub || "" };
    case "homework":
      return { title: "Bài tập về nhà", sub: `课后作业 · ${s.items.length} nhiệm vụ` };
    case "end":
      return { title: "Kết thúc", sub: "下课" };
  }
}

export function SlideView(props: SlideProps & { s: Slide; onGo: (type: Slide["type"]) => void }) {
  const { s, deck } = props;
  switch (s.type) {
    case "cover":
      return <Cover deck={deck} onGo={props.onGo} />;
    case "goals":
      return <Goals deck={deck} s={s} />;
    case "vocab":
      return <Vocab {...props} s={s} />;
    case "text":
      return <TextSlide {...props} s={s} />;
    case "grammar":
      return <Grammar {...props} s={s} />;
    case "practice":
      return <Practice s={s} />;
    case "match":
      return <Match deck={deck} />;
    case "homework":
      return <Homework deck={deck} s={s} />;
    case "end":
      return <End />;
  }
}
