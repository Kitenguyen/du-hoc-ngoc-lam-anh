"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND, href } from "../../data";
import { hanChars, loadHanziWriter, speak, toPinyin, type HanziWriterInstance } from "../tu-dien/hanzi";

type Tool = "pen" | "eraser";
type GridKind = "none" | "tian" | "mi" | "line";

const COLORS = [
  { c: "#f5f1e6", n: "Trắng" },
  { c: "#ffd54a", n: "Vàng" },
  { c: "#ff8a80", n: "Hồng" },
  { c: "#80d8ff", n: "Xanh dương" },
  { c: "#b9f6ca", n: "Xanh lá" },
  { c: "#ffab40", n: "Cam" },
];
const BOARD_BG = "#1f3a2c";
const CELLS: Record<string, number> = { S: 90, M: 140, L: 200 };
const MAX_UNDO = 40;

function drawGrid(cv: HTMLCanvasElement, kind: GridKind, cell: number) {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  const dpr = cv.width / cv.clientWidth || 1;
  const w = cv.clientWidth;
  const h = cv.clientHeight;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BOARD_BG;
  ctx.fillRect(0, 0, w, h);
  // vệt phấn mờ cho nền bảng
  const g = ctx.createRadialGradient(w * 0.3, h * 0.25, 10, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
  g.addColorStop(0, "rgba(255,255,255,.05)");
  g.addColorStop(1, "rgba(0,0,0,.18)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (kind === "none") return;
  ctx.lineWidth = 1;
  if (kind === "line") {
    ctx.strokeStyle = "rgba(255,255,255,.22)";
    for (let y = cell * 0.6; y < h; y += cell * 0.6) {
      ctx.beginPath();
      ctx.moveTo(0, Math.round(y) + 0.5);
      ctx.lineTo(w, Math.round(y) + 0.5);
      ctx.stroke();
    }
    return;
  }
  const cols = Math.max(1, Math.floor((w - 20) / cell));
  const rows = Math.max(1, Math.floor((h - 20) / cell));
  const x0 = Math.round((w - cols * cell) / 2);
  const y0 = Math.round((h - rows * cell) / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * cell;
      const y = y0 + r * cell;
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.beginPath();
      ctx.moveTo(x + cell / 2, y);
      ctx.lineTo(x + cell / 2, y + cell);
      ctx.moveTo(x, y + cell / 2);
      ctx.lineTo(x + cell, y + cell / 2);
      if (kind === "mi") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y + cell);
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x, y + cell);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(255,255,255,.42)";
      ctx.strokeRect(x + 0.5, y + 0.5, cell, cell);
    }
  }
}

export function Blackboard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const undo = useRef<ImageData[]>([]);
  const redo = useRef<ImageData[]>([]);
  const drawing = useRef<{ last: [number, number]; mid: [number, number] } | null>(null);
  const gridKindRef = useRef<GridKind>("none");
  const cellRef = useRef("M");

  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0].c);
  const [size, setSize] = useState(5);
  const [grid, setGrid] = useState<GridKind>("none");
  const [cell, setCell] = useState("M");
  const [hist, setHist] = useState({ u: 0, r: 0 });
  const [word, setWord] = useState("");
  const [shown, setShown] = useState("");
  const [toast, setToast] = useState("");

  const say = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((t) => (t === m ? "" : t)), 1900);
  }, []);

  // Kích thước canvas theo khung bảng (giữ nét đã vẽ khi đổi cỡ)
  useEffect(() => {
    const board = boardRef.current;
    const gcv = gridRef.current;
    const icv = inkRef.current;
    if (!board || !gcv || !icv) return;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = board.clientWidth;
      const h = board.clientHeight;
      const tmp = document.createElement("canvas");
      tmp.width = icv.width;
      tmp.height = icv.height;
      tmp.getContext("2d")?.drawImage(icv, 0, 0);
      for (const cv of [gcv, icv]) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        cv.style.width = w + "px";
        cv.style.height = h + "px";
      }
      icv.getContext("2d")?.drawImage(tmp, 0, 0);
      drawGrid(gcv, gridKindRef.current, CELLS[cellRef.current]);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(board);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    gridKindRef.current = grid;
    cellRef.current = cell;
    if (gridRef.current) drawGrid(gridRef.current, grid, CELLS[cell]);
  }, [grid, cell]);

  const ctx = () => inkRef.current?.getContext("2d") ?? null;

  const snapshot = useCallback(() => {
    const c = ctx();
    const cv = inkRef.current;
    if (!c || !cv) return;
    undo.current.push(c.getImageData(0, 0, cv.width, cv.height));
    if (undo.current.length > MAX_UNDO) undo.current.shift();
    redo.current = [];
    setHist({ u: undo.current.length, r: 0 });
  }, []);

  const doUndo = useCallback(() => {
    const c = ctx();
    const cv = inkRef.current;
    const prev = undo.current.pop();
    if (!c || !cv || !prev) return;
    redo.current.push(c.getImageData(0, 0, cv.width, cv.height));
    c.putImageData(prev, 0, 0);
    setHist({ u: undo.current.length, r: redo.current.length });
  }, []);

  const doRedo = useCallback(() => {
    const c = ctx();
    const cv = inkRef.current;
    const nx = redo.current.pop();
    if (!c || !cv || !nx) return;
    undo.current.push(c.getImageData(0, 0, cv.width, cv.height));
    c.putImageData(nx, 0, 0);
    setHist({ u: undo.current.length, r: redo.current.length });
  }, []);

  const clearBoard = useCallback(() => {
    const c = ctx();
    const cv = inkRef.current;
    if (!c || !cv) return;
    snapshot();
    c.clearRect(0, 0, cv.width, cv.height);
    say("Đã xóa bảng — bấm Hoàn tác nếu lỡ tay");
  }, [snapshot, say]);

  // Phím tắt
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)) return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "z") {
        e.preventDefault();
        if (e.shiftKey) doRedo();
        else doUndo();
      } else if ((e.ctrlKey || e.metaKey) && k === "y") {
        e.preventDefault();
        doRedo();
      } else if (!e.ctrlKey && !e.metaKey && k === "p") setTool("pen");
      else if (!e.ctrlKey && !e.metaKey && k === "e") setTool("eraser");
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [doUndo, doRedo]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const cv = e.currentTarget;
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height];
  }

  function style(c: CanvasRenderingContext2D) {
    const dpr = (inkRef.current?.width || 1) / (inkRef.current?.clientWidth || 1);
    c.lineCap = "round";
    c.lineJoin = "round";
    if (tool === "eraser") {
      c.globalCompositeOperation = "destination-out";
      c.lineWidth = size * 6 * dpr;
      c.shadowBlur = 0;
    } else {
      c.globalCompositeOperation = "source-over";
      c.strokeStyle = color;
      c.fillStyle = color;
      c.lineWidth = size * dpr;
      c.shadowColor = color;
      c.shadowBlur = 1.5 * dpr;
    }
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = ctx();
    if (!c || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    snapshot();
    const p = pos(e);
    drawing.current = { last: p, mid: p };
    style(c);
    c.beginPath();
    c.arc(p[0], p[1], c.lineWidth / 2, 0, Math.PI * 2);
    if (tool === "eraser") c.fillStyle = "#000";
    c.fill();
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = ctx();
    const d = drawing.current;
    if (!c || !d) return;
    const p = pos(e);
    const mid: [number, number] = [(d.last[0] + p[0]) / 2, (d.last[1] + p[1]) / 2];
    style(c);
    c.beginPath();
    c.moveTo(d.mid[0], d.mid[1]);
    c.quadraticCurveTo(d.last[0], d.last[1], mid[0], mid[1]);
    c.stroke();
    drawing.current = { last: p, mid };
  }

  function up() {
    drawing.current = null;
  }

  function savePng() {
    const g = gridRef.current;
    const i = inkRef.current;
    if (!g || !i) return;
    const out = document.createElement("canvas");
    out.width = g.width;
    out.height = g.height;
    const c = out.getContext("2d");
    if (!c) return;
    c.drawImage(g, 0, 0);
    c.drawImage(i, 0, 0);
    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    const d = new Date();
    a.download = `bang-den_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}.png`;
    a.click();
    say("Đã lưu ảnh bảng ✓");
  }

  function toggleFull() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch {
      say("Trình duyệt không hỗ trợ toàn màn hình");
    }
  }

  function showWord() {
    const chars = hanChars(word);
    if (!chars.length) {
      say("Gõ chữ Hán để xem thứ tự nét");
      return;
    }
    setShown(chars.slice(0, 6).join(""));
  }

  return (
    <div className="bd-app">
      <div className="bd-bar" role="toolbar" aria-label="Công cụ bảng đen">
        <a className="bd-brand" href={href("index.html")} title="Về trang chủ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND.logoMark} alt="" width={30} height={30} />
          <span>
            Bảng đen
            <small>{BRAND.headerName}</small>
          </span>
        </a>
        <span className="bd-sep" />
        <button type="button" className={`bd-b${tool === "pen" ? " on" : ""}`} onClick={() => setTool("pen")} title="Phấn (P)">
          ✏️ Phấn
        </button>
        <button type="button" className={`bd-b${tool === "eraser" ? " on" : ""}`} onClick={() => setTool("eraser")} title="Tẩy (E)">
          🧽 Tẩy
        </button>
        <span className="bd-colors">
          {COLORS.map((x) => (
            <button
              key={x.c}
              type="button"
              className={`bd-c${color === x.c && tool === "pen" ? " on" : ""}`}
              style={{ background: x.c }}
              aria-label={`Màu ${x.n}`}
              title={x.n}
              onClick={() => {
                setColor(x.c);
                setTool("pen");
              }}
            />
          ))}
        </span>
        <label className="bd-size" title="Cỡ nét">
          <span>Cỡ</span>
          <input type="range" min={2} max={24} value={size} onChange={(e) => setSize(+e.target.value)} aria-label="Cỡ nét" />
          <i style={{ width: Math.max(4, size), height: Math.max(4, size), background: tool === "pen" ? color : "#fff" }} />
        </label>
        <span className="bd-sep" />
        <label className="bd-sel">
          Nền
          <select value={grid} onChange={(e) => setGrid(e.target.value as GridKind)}>
            <option value="none">Bảng trơn</option>
            <option value="tian">Ô 田字格</option>
            <option value="mi">Ô 米字格</option>
            <option value="line">Dòng kẻ</option>
          </select>
        </label>
        {(grid === "tian" || grid === "mi" || grid === "line") && (
          <label className="bd-sel">
            Ô
            <select value={cell} onChange={(e) => setCell(e.target.value)}>
              <option value="S">Nhỏ</option>
              <option value="M">Vừa</option>
              <option value="L">Lớn</option>
            </select>
          </label>
        )}
        <span className="bd-sep" />
        <button type="button" className="bd-b" onClick={doUndo} disabled={!hist.u} title="Hoàn tác (Ctrl+Z)">
          ↶ Hoàn tác
        </button>
        <button type="button" className="bd-b" onClick={doRedo} disabled={!hist.r} title="Làm lại (Ctrl+Y)">
          ↷
        </button>
        <button type="button" className="bd-b" onClick={clearBoard} title="Xóa toàn bộ bảng">
          🗑 Xóa bảng
        </button>
        <span className="bd-sep" />
        <form
          className="bd-word"
          onSubmit={(e) => {
            e.preventDefault();
            showWord();
          }}
        >
          <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Chữ Hán, vd 学习" aria-label="Chữ Hán cần xem nét" />
          <button type="submit" className="bd-b pri">
            ✍ Xem nét
          </button>
        </form>
        <span className="bd-grow" />
        <button type="button" className="bd-b" onClick={savePng} title="Lưu ảnh bảng (PNG)">
          💾 Lưu ảnh
        </button>
        <button type="button" className="bd-b" onClick={toggleFull} title="Toàn màn hình">
          ⛶
        </button>
      </div>
      <div className="bd-board" ref={boardRef}>
        <canvas ref={gridRef} className="bd-grid" aria-hidden="true" />
        <canvas
          ref={inkRef}
          className={`bd-ink ${tool}`}
          aria-label="Bảng đen để viết"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) up();
          }}
        />
        {shown && <StrokePanel key={shown} text={shown} onClose={() => setShown("")} />}
        {toast && <div className="bd-toast">{toast}</div>}
      </div>
    </div>
  );
}

/** Bảng thứ tự nét (hanzi-writer) nổi trên bảng đen */
function StrokePanel({ text, onClose }: { text: string; onClose: () => void }) {
  const chars = Array.from(text);
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const writers = useRef<HanziWriterInstance[]>([]);
  const [py, setPy] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [big, setBig] = useState(true);
  const loopTok = useRef(0);
  const [cellPx] = useState(() => Math.max(90, Math.min(200, Math.floor((window.innerWidth - 60) / Math.min(chars.length, 3)) - 16)));

  useEffect(() => {
    let alive = true;
    const els = boxes.current;
    const size = cellPx;
    const tok = loopTok;
    toPinyin(text).then((p) => alive && setPy(p.split(/\s+/)));
    loadHanziWriter()
      .then(async (HW) => {
        if (!alive) return;
        writers.current = Array.from(text).map((c, i) => {
          const el = els[i] as HTMLDivElement;
          el.innerHTML = "";
          return HW.create(el, c, {
            width: size,
            height: size,
            padding: 8,
            showCharacter: false,
            showOutline: true,
            strokeColor: "#f5f1e6",
            radicalColor: "#ffd54a",
            outlineColor: "rgba(255,255,255,.16)",
            drawingColor: "#ffffff",
            highlightColor: "#80d8ff",
            drawingWidth: 8,
            strokeAnimationSpeed: 0.9,
            delayBetweenStrokes: 250,
            onLoadCharDataError: () => setMsg("Không tải được dữ liệu nét chữ (cần mạng Internet)."),
          });
        });
        for (const w of writers.current) {
          if (!alive) return;
          await w.animateCharacter();
        }
      })
      .catch(() => setMsg("Không tải được thư viện viết chữ."));
    return () => {
      alive = false;
      tok.current++;
      els.forEach((b) => {
        if (b) b.innerHTML = "";
      });
    };
  }, [text, cellPx]);

  async function replay(loop = false) {
    setMsg(loop ? "Đang lặp lại thứ tự nét…" : "");
    const tok = ++loopTok.current;
    do {
      for (const w of writers.current) {
        if (tok !== loopTok.current) return;
        try {
          w.cancelQuiz();
          w.hideCharacter();
          await w.animateCharacter();
        } catch {
          /* bỏ qua */
        }
      }
      if (loop) await new Promise((r) => setTimeout(r, 1200));
    } while (loop && tok === loopTok.current);
  }

  function quiz() {
    loopTok.current++;
    setMsg("Học viên viết từng nét vào ô — viết sai 3 lần sẽ có gợi ý.");
    writers.current.forEach((w) => {
      w.hideCharacter();
      w.quiz({ onComplete: (s) => setMsg(`“${s.character}” xong · sai ${s.totalMistakes} nét`) });
    });
  }

  return (
    <div className={`bd-panel${big ? "" : " mini"}`}>
      <div className="bd-ph">
        <b>✍ Thứ tự nét · {text}</b>
        <span className="bd-grow" />
        <button type="button" onClick={() => replay(false)} title="Viết lại">
          ▶
        </button>
        <button type="button" onClick={() => replay(true)} title="Lặp lại liên tục">
          🔁
        </button>
        <button type="button" onClick={quiz} title="Tập viết theo nét">
          ✍ Tập viết
        </button>
        <button type="button" onClick={() => speak(text)} title="Đọc to">
          🔊
        </button>
        <button type="button" onClick={() => setBig((b) => !b)} title={big ? "Thu nhỏ" : "Phóng to"}>
          {big ? "–" : "□"}
        </button>
        <button type="button" onClick={onClose} title="Đóng" aria-label="Đóng">
          ✕
        </button>
      </div>
      <div className="bd-chars">
        {chars.map((c, i) => (
          <div className="bd-ch" key={`${c}${i}`}>
            <div className="bd-py">{py[i] || " "}</div>
            <div className="bd-cell" style={{ width: cellPx, height: cellPx }}>
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <rect x="1" y="1" width="98" height="98" />
                <path d="M0 50H100M50 0V100M0 0L100 100M100 0L0 100" />
              </svg>
              <div
                className="bd-w"
                ref={(el) => {
                  boxes.current[i] = el;
                }}
                aria-label={`Thứ tự nét chữ ${c}`}
              />
            </div>
          </div>
        ))}
      </div>
      {msg && <div className="bd-msg">{msg}</div>}
    </div>
  );
}
