"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { href } from "../../data";
import { fold, speak } from "../tu-dien/hanzi";
import { emptyDraft, fillPinyin, parseText, readPdfText, readSheet, type Draft, type MyWord } from "./parse";

const STORE_KEY = "nla_tu_dien_cua_toi_v1";
const PER = 50;
const COLS: { k: keyof Draft; label: string; w?: number }[] = [
  { k: "zh", label: "Chữ Hán", w: 120 },
  { k: "py", label: "Phiên âm", w: 130 },
  { k: "pos", label: "Loại từ", w: 90 },
  { k: "vi", label: "Nghĩa" },
  { k: "ex", label: "Ví dụ" },
];

type Status = { cls: "" | "ok" | "err"; text: string; spin?: boolean };

function loadWords(): MyWord[] {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    return Array.isArray(v) ? (v as MyWord[]).filter((w) => w && typeof w.zh === "string") : [];
  } catch {
    return [];
  }
}

function saveWords(list: MyWord[]): boolean {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function StatusLine({ s }: { s: Status }) {
  return (
    <div className={`status ${s.cls}`} role="status">
      {s.spin && <span className="spin" />} {s.text}
    </div>
  );
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

export function MyDictionaryApp() {
  const [words, setWords] = useState<MyWord[]>([]);
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [paste, setPaste] = useState("");
  const [preview, setPreview] = useState<Draft[]>([]);
  const [st1, setSt1] = useState<Status>({ cls: "", text: "" });
  const [st2, setSt2] = useState<Status>({ cls: "", text: "" });
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>(emptyDraft());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Đọc dữ liệu đã lưu trên máy (localStorage chỉ có ở trình duyệt)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc dữ liệu lưu trên máy sau khi mount, tránh lệch khi hydrate
    setWords(loadWords());
    setReady(true);
  }, []);

  function commit(list: MyWord[]): boolean {
    setWords(list);
    return saveWords(list);
  }

  async function onParse() {
    setSt1({ cls: "", text: "" });
    try {
      let out: Draft[] = [];
      if (file) {
        const nm = file.name.toLowerCase();
        if (/\.(xlsx|xls|csv|ods)$/.test(nm)) {
          setSt1({ cls: "", text: "Đang đọc bảng…", spin: true });
          out = await readSheet(file);
        } else if (/\.pdf$/.test(nm)) {
          setSt1({ cls: "", text: "Đang đọc chữ trong PDF…", spin: true });
          const txt = await readPdfText(file);
          if (!txt.trim()) {
            setSt1({ cls: "err", text: "PDF không có lớp chữ (có thể là ảnh scan). Hãy dùng file Excel hoặc dán chữ." });
            return;
          }
          out = parseText(txt);
        } else if (/\.txt$/.test(nm)) {
          out = parseText(await file.text());
        } else {
          setSt1({ cls: "err", text: "Định dạng file chưa hỗ trợ (chọn PDF, Excel, CSV hoặc TXT)." });
          return;
        }
      } else {
        if (!paste.trim()) {
          setSt1({ cls: "err", text: "Hãy chọn file hoặc dán nội dung trước." });
          return;
        }
        out = parseText(paste);
      }
      out = await fillPinyin(out);
      setPreview(out);
      if (!out.length) setSt1({ cls: "err", text: "Không tìm thấy dòng nào có chữ Hán. Thử dán dạng bảng (mỗi cột cách nhau bằng Tab) hoặc dùng Excel." });
      else setSt1({ cls: "ok", text: `Đã tách ${out.length} dòng. Soát lại rồi bấm Lưu.` });
    } catch (err) {
      setSt1({ cls: "err", text: `Lỗi: ${err instanceof Error ? err.message : String(err)}` });
    }
  }

  function onSave() {
    const items = preview.filter((it) => it.zh.trim() && it.vi.trim());
    if (!items.length) {
      setSt2({ cls: "err", text: "Cần ít nhất 1 dòng có đủ Chữ Hán và Nghĩa." });
      return;
    }
    const seen = new Set(words.map((w) => `${w.zh}|${w.vi}`));
    const now = Date.now();
    const add: MyWord[] = [];
    items.forEach((it, i) => {
      const k = `${it.zh.trim()}|${it.vi.trim()}`;
      if (seen.has(k)) return;
      seen.add(k);
      add.push({ id: uid(), at: now + i, zh: it.zh.trim(), py: it.py.trim(), pos: it.pos.trim(), vi: it.vi.trim(), ex: it.ex.trim() });
    });
    const ok = commit([...add, ...words]);
    if (!ok) {
      setSt2({ cls: "err", text: "Không lưu được vào trình duyệt (bộ nhớ đầy hoặc đang ở chế độ ẩn danh)." });
      return;
    }
    const skipped = items.length - add.length;
    setSt2({ cls: "ok", text: `Đã lưu ${add.length} từ${skipped ? ` (bỏ ${skipped} từ trùng)` : ""}.` });
    setPreview([]);
    setPaste("");
    setFile(null);
    setSt1({ cls: "", text: "" });
    if (fileRef.current) fileRef.current.value = "";
  }

  const filtered = useMemo(() => {
    const t = q.trim();
    if (!t) return words;
    const f = fold(t);
    const fp = f.replace(/\s/g, "");
    return words.filter(
      (w) => w.zh.includes(t) || fold(w.vi).includes(f) || fold(w.py).replace(/\s/g, "").includes(fp) || w.ex.includes(t),
    );
  }, [words, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * PER, cur * PER);

  function del(w: MyWord) {
    if (!window.confirm(`Xóa từ "${w.zh}" khỏi từ điển của bạn?`)) return;
    commit(words.filter((x) => x.id !== w.id));
  }

  function saveEdit() {
    if (!editId) return;
    if (!edit.zh.trim() || !edit.vi.trim()) return;
    commit(words.map((w) => (w.id === editId ? { ...w, ...edit } : w)));
    setEditId(null);
  }

  async function exportXlsx(csv = false) {
    const XLSX = await import("xlsx");
    const data = words.map((w) => ({ "Chữ Hán": w.zh, "Phiên âm": w.py, "Loại từ": w.pos, "Nghĩa": w.vi, "Ví dụ": w.ex }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tu dien cua toi");
    XLSX.writeFile(wb, `tu-dien-cua-toi_${stamp()}.${csv ? "csv" : "xlsx"}`, csv ? { bookType: "csv" } : undefined);
  }

  function clearAll() {
    if (!words.length) return;
    if (!window.confirm(`Xóa toàn bộ ${words.length} từ đã lưu trên máy này? Không thể hoàn tác — nên bấm "Tải Excel" để giữ bản sao trước.`)) return;
    commit([]);
  }

  return (
    <>
      <div className="top">
        <span className="ti">📒 Từ điển của tôi</span>
        <span className="pill">{ready ? `${words.length} từ` : "—"}</span>
        <span className="sp" />
        <a href={href("tai-lieu.html")}>← Tài liệu</a>
        <a href={href("tu-dien.html")}>Từ điển chuyên ngành</a>
        <a href={href("bang-word.html")}>Bảng Word</a>
      </div>
      <div className="mwrap">
        <p className="note">
          Sổ từ vựng riêng của bạn, lưu ngay trên trình duyệt của máy này (không gửi đi đâu). Đổi máy hoặc xóa dữ liệu trình duyệt sẽ mất — hãy “Tải Excel” để giữ bản sao.
        </p>

        <div className="card">
          <div className="hd">➕ Thêm từ vựng (tải lên rồi xem trước mới lưu)</div>
          <div className="bd">
            <div className="row">
              <label className="btn sec file">
                📄 Chọn file (PDF / Excel / CSV / TXT)
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,.ods,.txt"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="muted">{file ? file.name : "Chưa chọn file"}</span>
              {file && (
                <button
                  type="button"
                  className="x"
                  title="Bỏ file"
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <label className="fld" htmlFor="mdPaste">
              …hoặc dán danh sách từ vựng vào đây (mỗi từ một dòng, hoặc dạng bảng):
            </label>
            <textarea
              id="mdPaste"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder={"Ví dụ:\n开心 kāixīn tính từ vui vẻ\n办理 bànlǐ động từ làm thủ tục, xử lý\n…"}
            />
            <div className="row" style={{ marginTop: 10 }}>
              <button type="button" className="btn" onClick={onParse}>
                🔎 Bóc tách để xem trước
              </button>
              <button
                type="button"
                className="btn sec"
                onClick={() => {
                  setPreview((p) => [...p, emptyDraft()]);
                  setSt2({ cls: "", text: "" });
                }}
              >
                ✍ Thêm từng từ
              </button>
              <span className="muted">
                Excel/CSV lấy theo cột; PDF và chữ dán được tách theo dòng “chữ Hán – phiên âm – loại từ – nghĩa”. Thiếu phiên âm sẽ tự điền.
              </span>
            </div>
            <StatusLine s={st1} />
          </div>
        </div>

        {preview.length > 0 && (
          <div className="card">
            <div className="hd">👀 Xem trước — soát/sửa rồi bấm Lưu</div>
            <div className="bd">
              <div className="muted" style={{ marginBottom: 8 }}>
                Sửa trực tiếp trong ô. Bỏ dòng sai bằng dấu ✕. Cột <b>Chữ Hán</b> và <b>Nghĩa</b> là bắt buộc.
              </div>
              <div className="tbox">
                <table>
                  <thead>
                    <tr>
                      {COLS.map((c) => (
                        <th key={c.k} style={c.w ? { width: c.w } : undefined}>
                          {c.label}
                        </th>
                      ))}
                      <th className="del" />
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((it, idx) => (
                      <tr key={idx}>
                        {COLS.map((c) => (
                          <td key={c.k} className={c.k === "zh" ? "zh" : undefined}>
                            <input
                              value={it[c.k]}
                              aria-label={c.label}
                              onChange={(e) => setPreview((p) => p.map((x, i) => (i === idx ? { ...x, [c.k]: e.target.value } : x)))}
                            />
                          </td>
                        ))}
                        <td className="del">
                          <button type="button" className="x" title="Bỏ dòng" onClick={() => setPreview((p) => p.filter((_, i) => i !== idx))}>
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <button type="button" className="btn gr" onClick={onSave}>
                  💾 Lưu vào từ điển
                </button>
                <button type="button" className="btn sec" onClick={() => setPreview((p) => [...p, emptyDraft()])}>
                  + Thêm dòng
                </button>
                <button type="button" className="btn sec" onClick={async () => setPreview(await fillPinyin(preview))}>
                  Điền phiên âm còn thiếu
                </button>
                <button type="button" className="btn sec" onClick={() => setPreview([])}>
                  Bỏ
                </button>
              </div>
              <StatusLine s={st2} />
            </div>
          </div>
        )}
        {!preview.length && st2.text && <StatusLine s={st2} />}

        <div className="card">
          <div className="hd">🔎 Tra cứu &amp; quản lý từ đã lưu</div>
          <div className="bd">
            <div className="row">
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Gõ chữ Hán, pinyin hoặc nghĩa tiếng Việt để tìm…"
                style={{ flex: 1, minWidth: 200 }}
                aria-label="Tìm trong từ điển của tôi"
              />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button type="button" className="btn sec" onClick={() => exportXlsx(false)} disabled={!words.length}>
                ⬇ Tải Excel
              </button>
              <button type="button" className="btn sec" onClick={() => exportXlsx(true)} disabled={!words.length}>
                ⬇ Tải CSV
              </button>
              <button type="button" className="btn sec danger" onClick={clearAll} disabled={!words.length}>
                🗑 Xóa tất cả
              </button>
            </div>
            {ready && !words.length && <div className="status">Chưa có từ nào. Thêm từ ở khung phía trên.</div>}
            {!!words.length && !filtered.length && <div className="status">Không có kết quả.</div>}
            {!!rows.length && (
              <div className="tbox" style={{ marginTop: 10 }}>
                <table>
                  <thead>
                    <tr>
                      {COLS.map((c) => (
                        <th key={c.k} style={c.w ? { width: c.w } : undefined}>
                          {c.label}
                        </th>
                      ))}
                      <th className="act" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((w) =>
                      editId === w.id ? (
                        <tr key={w.id} className="editing">
                          {COLS.map((c) => (
                            <td key={c.k} className={c.k === "zh" ? "zh" : undefined}>
                              <input
                                value={edit[c.k]}
                                aria-label={c.label}
                                onChange={(e) => setEdit((d) => ({ ...d, [c.k]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit();
                                  if (e.key === "Escape") setEditId(null);
                                }}
                              />
                            </td>
                          ))}
                          <td className="act">
                            <button type="button" className="x ok" title="Lưu" onClick={saveEdit}>
                              💾
                            </button>
                            <button type="button" className="x" title="Hủy" onClick={() => setEditId(null)}>
                              ↩
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={w.id}>
                          <td className="zh" style={{ fontSize: 18 }}>
                            {w.zh}
                          </td>
                          <td style={{ color: "var(--blue)" }}>{w.py}</td>
                          <td style={{ color: "var(--muted)" }}>{w.pos}</td>
                          <td>{w.vi}</td>
                          <td style={{ color: "var(--muted)", fontSize: 12.5 }}>{w.ex}</td>
                          <td className="act">
                            <button type="button" className="x" title="Nghe" onClick={() => speak(w.zh)}>
                              🔊
                            </button>
                            <button
                              type="button"
                              className="x"
                              title="Sửa"
                              onClick={() => {
                                setEditId(w.id);
                                setEdit({ zh: w.zh, py: w.py, pos: w.pos, vi: w.vi, ex: w.ex });
                              }}
                            >
                              ✏
                            </button>
                            <button type="button" className="x" title="Xóa" onClick={() => del(w)}>
                              🗑
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {!!filtered.length && (
              <div className="row" style={{ marginTop: 10 }}>
                <span className="muted">
                  {pages > 1 ? `Trang ${cur}/${pages} · ` : ""}
                  {filtered.length} từ
                </span>
                {cur > 1 && (
                  <button type="button" className="btn sec" onClick={() => setPage(cur - 1)}>
                    ‹ Trước
                  </button>
                )}
                {cur < pages && (
                  <button type="button" className="btn sec" onClick={() => setPage(cur + 1)}>
                    Sau ›
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
