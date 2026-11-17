"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND, CONTACT, PHONE_LABEL, href } from "../../data";
import { hasHan, isHan, loadHanziWriter, lookupZh, searchDict, speak, type HanziWriterInstance } from "../tu-dien/hanzi";
import { translateText, type TranslateDir } from "./api";

/* ---------- Kiểu & hằng ---------- */
type Meaning = { zh: string; py: string; pos: string; vi: string };
type Actions = {
  exec: (cmd: string, v?: string) => void;
  setSize: (px: number) => void;
  clear: () => void;
  translate: () => void;
  insert: (m: Meaning) => void;
  print: () => void;
  word: () => void;
  pdf: () => void;
};

const PAGE_H = 1386; // chiều cao 1 trang A4 theo bề rộng tờ 980px
const DRAFT_KEY = "nla_bang_word_draft_v1";
const MY_DICT_KEY = "nla_tu_dien_cua_toi_v1";
const EXRE = /^\s*(如[:：]|ví\s*dụ\s*[:：]|vd\s*[:：])/i;
const HIDE_SEL = ".p,.pos,.vi,.strokeseq,.sschar,.exlb";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

function download(b: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** Tra nghĩa: Từ điển của tôi (localStorage) → từ điển chuyên ngành mẫu */
function lookupWord(q: string): Meaning | null {
  const t = q.trim();
  if (!t) return null;
  try {
    const mine = JSON.parse(localStorage.getItem(MY_DICT_KEY) || "[]") as Meaning[];
    if (Array.isArray(mine)) {
      const hit = hasHan(t) ? mine.find((w) => w.zh === t) : mine.find((w) => w.vi && w.vi.toLowerCase().split(/[,;]/).map((x) => x.trim()).includes(t.toLowerCase()));
      if (hit) return { zh: hit.zh, py: hit.py || "", pos: hit.pos || "", vi: hit.vi || "" };
    }
  } catch {
    /* bỏ qua */
  }
  const e = hasHan(t) ? lookupZh(t) : searchDict(t)[0];
  return e ? { zh: e.zh, py: e.py, pos: e.pos, vi: e.vi } : null;
}

const WORD_TEXT = /[，。！？、,.!?;；]/;
function isWordLine(t: string) {
  if (!t || WORD_TEXT.test(t)) return false;
  if (hasHan(t)) return t.replace(/[^㐀-鿿]/g, "").length <= 4 && t.length <= 6;
  return t.split(/\s+/).length <= 3 && t.length <= 20;
}

/* ---------- Thẻ từ (bên phải) ---------- */
function WordCard({ m, onInsert }: { m: Meaning | null; onInsert: (m: Meaning) => void }) {
  const chars = m ? Array.from(m.zh).filter(isHan).slice(0, 6) : [];
  const key = chars.join("");
  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const writers = useRef<HanziWriterInstance[]>([]);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    const els = boxes.current;
    loadHanziWriter()
      .then((HW) => {
        if (!alive) return;
        writers.current = Array.from(key).map((c, i) => {
          const el = els[i] as HTMLDivElement;
          el.innerHTML = "";
          const w = HW.create(el, c, {
            width: 76,
            height: 76,
            padding: 4,
            showOutline: true,
            showCharacter: false,
            strokeAnimationSpeed: 1.1,
            delayBetweenStrokes: 140,
            strokeColor: "#1f2328",
            radicalColor: "#c0392b",
          });
          w.loopCharacterAnimation();
          return w;
        });
      })
      .catch(() => {
        Array.from(key).forEach((c, i) => {
          const el = els[i];
          if (el) el.textContent = c;
        });
      });
    return () => {
      alive = false;
      els.forEach((el) => {
        if (el) el.innerHTML = "";
      });
    };
  }, [key]);

  return (
    <div className="card-panel noprint">
      <div className="wcard">
        <h3>🃏 Thẻ từ · thứ tự nét</h3>
        <div className="card-body">
          {!m ? (
            <div className="cw-empty">
              Gõ một từ (chữ Hán hoặc tiếng Việt) trên một dòng của bảng — thẻ từ sẽ hiện nghĩa, phiên âm và cách viết. Nhấn <b>Enter</b> để chèn khung từ vựng kèm thứ tự nét.
            </div>
          ) : (
            <>
              <div className="cw-zh">{m.zh}</div>
              {m.py && <div className="cw-py">{m.py}</div>}
              {m.pos && <div className="cw-pos">{m.pos}</div>}
              {m.vi ? <div className="cw-vi">{m.vi}</div> : <div className="cw-hv">Chưa có nghĩa trong từ điển</div>}
              {!!chars.length && (
                <div className="strokes">
                  {chars.map((c, i) => (
                    <div
                      key={`${c}${i}`}
                      className="sw"
                      ref={(el) => {
                        boxes.current[i] = el;
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="cw-actions">
                <button type="button" className="ins" onClick={() => onInsert(m)}>
                  ➕ Chèn vào bảng
                </button>
                <button type="button" onClick={() => speak(m.zh)}>
                  🔊 Nghe
                </button>
                <button
                  type="button"
                  onClick={() =>
                    writers.current.forEach((w) => {
                      try {
                        w.animateCharacter();
                      } catch {
                        /* bỏ qua */
                      }
                    })
                  }
                >
                  ▶ Viết lại
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="cw-tip">
        Nghĩa lấy từ <a href={href("tu-dien-cua-toi.html")}>Từ điển của tôi</a> và <a href={href("tu-dien.html")}>Từ điển chuyên ngành</a>. Phiên âm chữ Hán tự thêm khi gõ.
      </p>
    </div>
  );
}

/* ---------- Ứng dụng ---------- */
export function BangWord() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const teacherRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLSpanElement>(null);
  const breaksRef = useRef<HTMLDivElement>(null);
  const actions = useRef<Actions | null>(null);

  const [toast, setToast] = useState("");
  const [pages, setPages] = useState(1);
  const [dir, setDir] = useState<TranslateDir>("auto");
  const dirRef = useRef<TranslateDir>("auto");
  const [card, setCard] = useState<Meaning | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    const editor = editorRef.current;
    const sheet = sheetRef.current;
    if (!editor || !sheet) return;
    let alive = true;
    let pyFn: ((t: string, o?: Record<string, unknown>) => string | string[]) | null = null;
    const timers: Record<string, number> = {};
    const later = (k: string, ms: number, fn: () => void) => {
      clearTimeout(timers[k]);
      timers[k] = window.setTimeout(fn, ms);
    };
    const say = (m: string) => {
      setToast(m);
      later("toast", 2200, () => setToast(""));
    };

    import("pinyin-pro").then((m) => {
      pyFn = m.pinyin as unknown as typeof pyFn;
      runPinyin(true);
    });
    const pyArr = (t: string): string[] => {
      try {
        return pyFn ? (pyFn(t, { toneType: "symbol", type: "array", nonZh: "removed" }) as string[]) : [];
      } catch {
        return [];
      }
    };

    /* --- khôi phục bản nháp --- */
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null") as { html?: string; title?: string; teacher?: string } | null;
      if (d?.html) editor.innerHTML = d.html;
      if (d?.title && titleRef.current) titleRef.current.textContent = d.title;
      if (d?.teacher && teacherRef.current) teacherRef.current.textContent = d.teacher;
    } catch {
      /* bỏ qua */
    }
    if (dateRef.current && !dateRef.current.textContent) {
      const d = new Date();
      dateRef.current.textContent = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }
    const saveDraft = () =>
      later("save", 600, () => {
        try {
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ html: editor.innerHTML, title: titleRef.current?.textContent || "", teacher: teacherRef.current?.textContent || "" }),
          );
        } catch {
          /* bỏ qua */
        }
      });

    /* --- khối / dòng hiện tại --- */
    const currentBlock = (): HTMLElement | null => {
      const s = window.getSelection();
      if (!s || !s.rangeCount) return null;
      let n: Node | null = s.anchorNode;
      if (!n || !editor.contains(n)) return null;
      if (n.nodeType === 3) n = n.parentNode;
      while (n && n !== editor && n.parentNode !== editor) n = n.parentNode;
      return n && n !== editor ? (n as HTMLElement) : null;
    };
    const ensureBlock = (): HTMLElement | null => {
      const b = currentBlock();
      if (b && b.nodeType === 1) return b;
      const s = window.getSelection();
      if (!s || !s.rangeCount) return null;
      const nodes: Node[] = [];
      for (const n of Array.from(editor.childNodes)) {
        if (n.nodeType === 1 && /^(DIV|P)$/.test((n as HTMLElement).tagName)) break;
        nodes.push(n);
      }
      if (!nodes.length) return null;
      const div = document.createElement("div");
      editor.insertBefore(div, nodes[0]);
      nodes.forEach((n) => div.appendChild(n));
      const r = document.createRange();
      r.selectNodeContents(div);
      r.collapse(false);
      s.removeAllRanges();
      s.addRange(r);
      return div;
    };
    const blockText = (b: Node): string => {
      const c = b.cloneNode(true) as HTMLElement;
      if (c.querySelectorAll) c.querySelectorAll(HIDE_SEL).forEach((x) => x.remove());
      return (c.textContent || "").replace(/​/g, "").trim();
    };
    const stripEx = (t: string) => t.replace(EXRE, "").trim();
    const caretTo = (el: Node) => {
      const s = window.getSelection();
      const r = document.createRange();
      r.setStart(el, 0);
      r.collapse(true);
      s?.removeAllRanges();
      s?.addRange(r);
      editor.focus();
    };
    const newLineAfter = (blk: Node | null) => {
      const nl = document.createElement("div");
      nl.appendChild(document.createElement("br"));
      if (blk && blk.parentNode === editor) editor.insertBefore(nl, blk.nextSibling);
      else editor.appendChild(nl);
      caretTo(nl);
    };

    /* --- phiên âm từng chữ: chữ Hán trên, phiên âm dưới --- */
    const annotateHTML = (text: string) => {
      const arr = pyArr(text);
      let k = 0;
      let out = "";
      for (const ch of Array.from(text)) {
        if (isHan(ch)) {
          out += `<span class="cc"><span class="h">${esc(ch)}</span><span class="p">${esc(arr[k] || "")}</span></span>`;
          k++;
        } else out += esc(ch);
      }
      return out;
    };
    const blocked = (n: Node) => {
      let el = n.parentNode as HTMLElement | null;
      while (el && el !== editor) {
        if (el.classList && (el.classList.contains("cc") || el.classList.contains("strokeseq") || el.classList.contains("sschar"))) return true;
        el = el.parentNode as HTMLElement | null;
      }
      return false;
    };
    const convertNode = (tn: Text) => {
      const t = tn.nodeValue || "";
      const arr = pyArr(t);
      let k = 0;
      const frag = document.createDocumentFragment();
      let buf = "";
      const flush = () => {
        if (buf) frag.appendChild(document.createTextNode(buf));
        buf = "";
      };
      for (const ch of Array.from(t)) {
        if (isHan(ch)) {
          flush();
          const cc = document.createElement("span");
          cc.className = "cc";
          cc.innerHTML = `<span class="h">${esc(ch)}</span><span class="p">${esc(arr[k] || "")}</span>`;
          k++;
          frag.appendChild(cc);
        } else buf += ch;
      }
      flush();
      tn.parentNode?.replaceChild(frag, tn);
    };
    function runPinyin(all: boolean) {
      if (!pyFn) return;
      let caret: Node | null = null;
      if (!all) {
        const s = window.getSelection();
        caret = s && s.rangeCount ? s.getRangeAt(0).endContainer : null;
      }
      const w = document.createTreeWalker(editor as HTMLElement, NodeFilter.SHOW_TEXT);
      const list: Text[] = [];
      let n: Node | null;
      while ((n = w.nextNode())) {
        if (caret && n === caret) continue;
        if (!/[㐀-鿿]/.test(n.nodeValue || "")) continue;
        if (blocked(n)) continue;
        list.push(n as Text);
      }
      if (!list.length) return;
      list.forEach(convertNode);
      paginate();
    }

    /* --- thứ tự nét (ảnh tĩnh để in/xuất file) --- */
    const strokeCache: Record<string, string[] | null> = {};
    const charStrokes = async (ch: string): Promise<string[] | null> => {
      if (ch in strokeCache) return strokeCache[ch];
      try {
        const HW = await loadHanziWriter();
        const d = await HW.loadCharacterData(ch);
        strokeCache[ch] = d ? d.strokes : null;
      } catch {
        strokeCache[ch] = null;
      }
      return strokeCache[ch];
    };
    const seqSVGs = (strokes: string[]) => {
      let o = "";
      for (let i = 0; i < strokes.length; i++) {
        let p = "";
        for (let j = 0; j <= i; j++) p += `<path d="${strokes[j]}" fill="${j === i ? "#c0392b" : "#1f2328"}"/>`;
        o += `<svg class="ssg" width="34" height="34" viewBox="0 0 1024 1024"><g transform="scale(1,-1) translate(0,-900)">${p}</g></svg>`;
      }
      return o;
    };
    const strokeBox = (zh: string) => {
      const chars = Array.from(zh).filter(isHan);
      const box = document.createElement("div");
      box.className = "strokeseq";
      box.setAttribute("contenteditable", "false");
      Promise.all(chars.map(charStrokes)).then((ds) => {
        box.innerHTML = ds.map((d, i) => (d ? `<div class="ssrow"><span class="sschar">${esc(chars[i])}</span>${seqSVGs(d)}</div>` : "")).join("");
        paginate();
        saveDraft();
      });
      return box;
    };
    const makeVocBox = (m: Meaning, isEx: boolean) => {
      const box = document.createElement("div");
      box.className = "vocbox" + (isEx ? " vd" : "");
      box.innerHTML = `<div class="vocline">${isEx ? '<span class="exlb">如：</span>' : ""}<span class="voczh">${annotateHTML(m.zh)}</span>${
        m.pos ? `<span class="pos">${esc(m.pos)}</span>` : ""
      }${m.vi ? `<span class="vi">${esc(m.vi)}</span>` : ""}</div>`;
      if (!isEx) box.appendChild(strokeBox(m.zh));
      return box;
    };

    /* --- chia trang A4 --- */
    function paginate() {
      later("pg", 250, () => {
        const ov = breaksRef.current;
        if (!ov || !sheet) return;
        ov.style.display = "none";
        const h = sheet.scrollHeight;
        ov.style.display = "";
        const n = Math.max(1, Math.ceil(h / PAGE_H));
        let html = "";
        for (let i = 1; i < n; i++) html += `<div class="pbreak" style="top:${i * PAGE_H}px"><span>Hết trang ${i} → trang ${i + 1}</span></div>`;
        ov.innerHTML = html;
        if (alive) setPages(n);
      });
    }

    /* --- tra từ / chèn khung từ vựng --- */
    const autoAnnotate = (blk: HTMLElement, raw: string) => {
      const core = stripEx(raw);
      const isEx = EXRE.test(raw);
      const m = lookupWord(core);
      const zh = m?.zh || (hasHan(core) ? (core.match(/[㐀-鿿]+/) || [""])[0] : "");
      if (!zh) {
        say(`Chưa có “${core}” trong từ điển — dịch tự do cần AI (chưa kết nối).`);
        newLineAfter(blk);
        return;
      }
      const box = makeVocBox(m || { zh, py: "", pos: "", vi: "" }, isEx);
      if (blk.parentNode === editor) editor.replaceChild(box, blk);
      else editor.appendChild(box);
      newLineAfter(box);
      paginate();
      saveDraft();
    };

    const insert = (m: Meaning) => {
      editor.focus();
      const box = makeVocBox(m, false);
      const blk = currentBlock();
      if (blk && blk.parentNode === editor) {
        if (!blockText(blk)) editor.replaceChild(box, blk);
        else editor.insertBefore(box, blk.nextSibling);
      } else editor.appendChild(box);
      newLineAfter(box);
      paginate();
      saveDraft();
      say(`Đã chèn ${m.zh} ✓`);
    };

    const translate = async () => {
      const s = window.getSelection();
      let text = "";
      if (s && s.rangeCount && !s.getRangeAt(0).collapsed && editor.contains(s.anchorNode)) {
        const tmp = document.createElement("div");
        tmp.appendChild(s.getRangeAt(0).cloneContents());
        tmp.querySelectorAll(HIDE_SEL).forEach((x) => x.remove());
        text = (tmp.textContent || "").replace(/\s+/g, " ").trim();
      } else {
        const b = currentBlock();
        text = b ? blockText(b) : "";
      }
      text = stripEx(text);
      if (!text) {
        say("Chưa có nội dung — đặt con trỏ vào dòng hoặc bôi đen câu cần dịch");
        return;
      }
      const m = isWordLine(text) ? lookupWord(text) : null;
      if (m) {
        insert(m);
        return;
      }
      setBusy(true);
      const r = await translateText(text, dirRef.current);
      setBusy(false);
      if (!r.ok) {
        say(r.message);
        return;
      }
      const wrap = document.createElement("div");
      wrap.className = "transblk";
      wrap.innerHTML = r.zh ? `<div class="voczh">${annotateHTML(r.zh)}</div>` : `<div class="vi">${esc(r.vi || "")}</div>`;
      const b = currentBlock();
      if (b && b.parentNode === editor) editor.insertBefore(wrap, b.nextSibling);
      else editor.appendChild(wrap);
      newLineAfter(wrap);
      paginate();
      saveDraft();
    };

    /* --- thẻ từ theo dòng đang gõ --- */
    let lastCard = "";
    const updCard = () =>
      later("card", 300, () => {
        const b = currentBlock();
        const line = b ? stripEx(blockText(b)) : "";
        if (!line || !isWordLine(line)) return;
        if (line === lastCard) return;
        lastCard = line;
        const m = lookupWord(line);
        if (m) setCard(m);
        else if (hasHan(line)) {
          const zh = (line.match(/[㐀-鿿]+/) || [""])[0];
          setCard({ zh, py: pyArr(zh).join(" "), pos: "", vi: "" });
        }
      });

    /* --- sự kiện soạn thảo --- */
    const onInput = () => {
      later("py", 300, () => runPinyin(false));
      updCard();
      paginate();
      saveDraft();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        translate();
        return;
      }
      if (e.key !== "Enter" || e.shiftKey) return;
      const blk = ensureBlock();
      if (!blk) return;
      const line = blockText(blk);
      const core = stripEx(line);
      if (core && isWordLine(core) && !blk.classList.contains("vocbox")) {
        e.preventDefault();
        autoAnnotate(blk, line);
      }
    };
    const onUp = () => {
      runPinyin(true);
      updCard();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (/Arrow/.test(e.key)) onUp();
    };
    const onBlur = () => runPinyin(true);
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const t = e.clipboardData?.getData("text/plain");
      if (t) document.execCommand("insertText", false, t);
    };
    editor.addEventListener("input", onInput);
    editor.addEventListener("keydown", onKey);
    editor.addEventListener("mouseup", onUp);
    editor.addEventListener("keyup", onKeyUp);
    editor.addEventListener("blur", onBlur);
    const plainTargets = [editor, titleRef.current, teacherRef.current, dateRef.current].filter(Boolean) as HTMLElement[];
    plainTargets.forEach((el) => el.addEventListener("paste", onPaste));
    [titleRef.current, teacherRef.current].forEach((el) => el?.addEventListener("input", saveDraft));

    /* --- thao tác cho thanh công cụ --- */
    actions.current = {
      exec: (cmd, v) => {
        document.execCommand(cmd, false, v);
        editor.focus();
        saveDraft();
      },
      setSize: (px) => {
        const s = window.getSelection();
        if (s && s.rangeCount && !s.getRangeAt(0).collapsed && editor.contains(s.anchorNode)) {
          const r = s.getRangeAt(0);
          const selLen = r.toString().replace(/\s/g, "").length;
          const allLen = (editor.textContent || "").replace(/\s/g, "").length;
          if (allLen > 0 && selLen >= allLen - 3) {
            editor.style.fontSize = px + "px";
            editor.querySelectorAll<HTMLElement>("[style*='font-size']").forEach((el) => (el.style.fontSize = ""));
          } else {
            const sp = document.createElement("span");
            sp.style.fontSize = px + "px";
            sp.appendChild(r.extractContents());
            r.insertNode(sp);
          }
        } else editor.style.fontSize = px + "px";
        paginate();
        saveDraft();
        editor.focus();
      },
      clear: () => {
        if (!window.confirm("Xóa toàn bộ nội dung bảng?")) return;
        editor.innerHTML = "";
        if (titleRef.current) titleRef.current.textContent = "";
        setCard(null);
        lastCard = "";
        paginate();
        saveDraft();
        editor.focus();
      },
      translate,
      insert,
      print: () => window.print(),
      word: () => {
        const el = sheet.cloneNode(true) as HTMLElement;
        el.querySelectorAll(".pagebreaks,.noprint,.pagefoot").forEach((x) => x.remove());
        const css =
          '@page Section1{size:595.3pt 841.9pt;margin:48pt 54pt 54pt 54pt}div.Section1{page:Section1}body{font-family:"Times New Roman",serif;font-size:13pt}.cc{display:inline-block;text-align:center;vertical-align:bottom}.cc .h{display:block;font-family:SimSun,宋体,serif}.cc .p{display:block;color:#1d6fd0;font-size:8pt}.voczh .h{font-size:15pt}.pos{color:#8a6d00;font-style:italic}.vi{color:#2b8a3e}.vocbox{display:block;padding:1pt 0}.ssg{width:26pt;height:26pt;border:0.5pt solid #e0cfc9}.sschar{font-family:SimSun,serif;font-size:14pt}.doc-head{text-align:center;border-bottom:2pt solid #c0392b;padding-bottom:6pt}.doc-head .ctr{font-weight:700;font-size:15pt;color:#c0392b}.doc-title{text-align:center;font-weight:700;font-size:13pt;margin:10pt 0}';
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><style>${css}</style></head><body><div class=Section1>${el.innerHTML}</div></body></html>`;
        download(new Blob(["﻿" + html], { type: "application/msword" }), `BangWord_${stamp()}.doc`);
        say("Đã tải Word ✓");
      },
      pdf: async () => {
        say("Đang tạo PDF…");
        setBusy(true);
        try {
          const html2pdf = (await import("html2pdf.js")).default;
          const el = sheet.cloneNode(true) as HTMLElement;
          el.querySelectorAll(".pagebreaks,.noprint,.pagefoot").forEach((x) => x.remove());
          el.querySelectorAll("[contenteditable]").forEach((x) => x.removeAttribute("contenteditable"));
          el.classList.add("pdfmode");
          el.style.cssText = "box-shadow:none;border:none;min-height:0;width:980px;max-width:none;";
          const holder = document.createElement("div");
          holder.className = "pg-bang-word";
          holder.style.cssText = "position:fixed;left:-10000px;top:0;width:980px;";
          holder.appendChild(el);
          document.body.appendChild(holder);
          const worker = html2pdf()
            .set({
              margin: 10,
              filename: `BangWord_${stamp()}.pdf`,
              image: { type: "jpeg", quality: 0.96 },
              html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
              pagebreak: { mode: ["css", "legacy"], avoid: [".vocbox", ".ssrow", ".cc"] },
            })
            .from(el)
            .toPdf();
          const pdf = await worker.get("pdf");
          const tot = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= tot; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(150);
            pdf.text(`Trang ${i} / ${tot}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 4, { align: "center" });
          }
          await worker.save();
          holder.remove();
          say("Đã tải PDF ✓");
        } catch {
          say("Không tạo được PDF — thử nút In rồi chọn “Lưu thành PDF”.");
        } finally {
          setBusy(false);
        }
      },
    };

    paginate();
    return () => {
      alive = false;
      Object.values(timers).forEach((t) => clearTimeout(t));
      editor.removeEventListener("input", onInput);
      editor.removeEventListener("keydown", onKey);
      editor.removeEventListener("mouseup", onUp);
      editor.removeEventListener("keyup", onKeyUp);
      editor.removeEventListener("blur", onBlur);
      plainTargets.forEach((el) => el.removeEventListener("paste", onPaste));
      actions.current = null;
    };
  }, []);

  const act = <K extends keyof Actions>(k: K) => actions.current?.[k];

  return (
    <div className="bw-app">
      <div className="topbar noprint">
        <div className="tb-row">
          <a className="brand" href={href("index.html")}>
            🖊 Bảng Word<small>{BRAND.headerName}</small>
          </a>
          <div className="sep" />
          <button className="bbtn pri" type="button" onClick={() => act("translate")?.()} title="Dịch đoạn (Ctrl+Enter)" disabled={busy}>
            ⇄ Dịch đoạn
          </button>
          <div className="selwrap">
            <select className="mini" value={dir} onChange={(e) => setDir(e.target.value as TranslateDir)} aria-label="Chiều dịch">
              <option value="auto">Tự nhận diện</option>
              <option value="vt">Việt → Trung</option>
              <option value="tv">Trung → Việt</option>
            </select>
          </div>
          <div className="sep" />
          <button className="bbtn" type="button" title="Đậm" onMouseDown={(e) => e.preventDefault()} onClick={() => act("exec")?.("bold")}>
            <b>B</b>
          </button>
          <button className="bbtn" type="button" title="Nghiêng" onMouseDown={(e) => e.preventDefault()} onClick={() => act("exec")?.("italic")}>
            <i>I</i>
          </button>
          <button className="bbtn" type="button" title="Gạch chân" onMouseDown={(e) => e.preventDefault()} onClick={() => act("exec")?.("underline")}>
            <u>U</u>
          </button>
          <label className="bbtn swatch" title="Màu chữ">
            A🎨
            <input type="color" defaultValue="#c0392b" onChange={(e) => act("exec")?.("foreColor", e.target.value)} />
          </label>
          <label className="bbtn swatch" title="Tô nền">
            🖍
            <input type="color" defaultValue="#fff3bf" onChange={(e) => act("exec")?.("hiliteColor", e.target.value)} />
          </label>
          <div className="selwrap">
            <span>Cỡ</span>
            <input
              className="sz"
              type="number"
              min={10}
              max={72}
              defaultValue={20}
              onChange={(e) => {
                const v = +e.target.value;
                if (v >= 10 && v <= 72) act("setSize")?.(v);
              }}
              aria-label="Cỡ chữ"
            />
            px
          </div>
          <div className="sep" />
          <button className="bbtn" type="button" onClick={() => act("print")?.()} title="In">
            🖨 In
          </button>
          <button className="bbtn" type="button" onClick={() => act("word")?.()} title="Tải Word">
            ⬇ Word
          </button>
          <button className="bbtn" type="button" onClick={() => act("pdf")?.()} title="Tải PDF" disabled={busy}>
            ⬇ PDF
          </button>
          <button className="bbtn" type="button" onClick={() => act("clear")?.()} title="Xóa hết">
            🗑
          </button>
        </div>
      </div>
      <div className="main">
        <div className="sheetwrap">
          <div className="sheet" ref={sheetRef}>
            <div className="doc-head">
              <div className="ctr">
                {BRAND.fullName.toUpperCase()} &nbsp;–&nbsp; {PHONE_LABEL}
              </div>
              <div className="addr">Địa chỉ: {CONTACT.address}</div>
              <div className="row2">
                <div>
                  Giáo viên: <span ref={teacherRef} contentEditable suppressContentEditableWarning className="edit" data-ph="………………" />
                </div>
                <div>
                  Ngày dạy: <span ref={dateRef} contentEditable suppressContentEditableWarning className="edit" />
                </div>
              </div>
            </div>
            <div className="doc-title" ref={titleRef} contentEditable suppressContentEditableWarning />
            <div
              id="bwEditor"
              className="editor"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              data-ph="Gõ chữ Hán: phiên âm tự hiện dưới mỗi chữ. Gõ một từ trên một dòng rồi Enter để chèn khung từ vựng (nghĩa + thứ tự nét). Ctrl+Enter: dịch đoạn."
            />
            <div className="pagebreaks noprint" ref={breaksRef} contentEditable={false} />
            <div className="pagefoot">— A4 · {pages} trang —</div>
          </div>
        </div>
        <WordCard m={card} onInsert={(m) => act("insert")?.(m)} />
      </div>
      <div className={`bw-toast${toast ? " show" : ""}`} role="status">
        {toast}
      </div>
    </div>
  );
}
