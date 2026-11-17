"use client";

import { useEffect, useState } from "react";
import { href } from "../../data";
import type { FlatEntry } from "../tu-dien/data";
import { hasHan, searchDict, speak, toPinyin } from "../tu-dien/hanzi";
import { StrokeChars } from "../tu-dien/StrokeChars";
import { askAiDictionary, type AiAnswer, type AiDirection } from "./api";

const DIRS: { key: AiDirection; label: string }[] = [
  { key: "auto", label: "Tự nhận diện" },
  { key: "vt", label: "Việt → Trung" },
  { key: "tv", label: "Trung → Việt" },
];

const EXAMPLES = ["tăng ca", "hóa đơn", "返工", "kiểm kê", "báo giá", "请假"];
const HISTORY_KEY = "nla_tu_dien_ai_history";

function loadHistory(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 12) : [];
  } catch {
    return [];
  }
}

function saveHistory(list: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 12)));
  } catch {
    /* bỏ qua */
  }
}

type Result = {
  q: string;
  dir: AiDirection;
  ai: AiAnswer | null;
  aiMsg: string;
  matches: FlatEntry[];
  pinyin: string;
};

export function AiDictionaryTool() {
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<AiDirection>("auto");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [hist, setHist] = useState<string[]>([]);

  useEffect(() => {
    // Đọc lịch sử tra cứu đã lưu trên máy này (chỉ có ở trình duyệt)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHist(loadHistory());
  }, []);

  async function run(text = q) {
    const query = text.trim();
    if (!query) return;
    setQ(query);
    setBusy(true);
    const isZh = dir === "tv" || (dir === "auto" && hasHan(query));
    const [ai, py] = await Promise.all([askAiDictionary(query, dir), isZh ? toPinyin(query) : Promise.resolve("")]);
    const matches = searchDict(query).slice(0, 8);
    setRes({ q: query, dir, ai: ai.ok ? ai.answer : null, aiMsg: ai.ok ? "" : ai.message, matches, pinyin: py });
    const nh = [query, ...hist.filter((h) => h !== query)].slice(0, 12);
    setHist(nh);
    saveHistory(nh);
    setBusy(false);
  }

  const first = res?.matches[0];

  return (
    <div className="ai-grid">
      <div className="ai-card ai-in">
        <div className="ai-dirs" role="group" aria-label="Chiều dịch">
          {DIRS.map((d) => (
            <button key={d.key} type="button" className={dir === d.key ? "on" : ""} onClick={() => setDir(d.key)}>
              {d.label}
            </button>
          ))}
        </div>
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run();
            }
          }}
          rows={4}
          placeholder="Gõ từ / câu tiếng Việt hoặc chữ Hán…  vd: tăng ca, 返工, kiểm kê hàng tồn kho"
          aria-label="Nội dung cần tra"
        />
        <div className="ai-row">
          <button type="button" className="btn pri sm" onClick={() => run()} disabled={busy || !q.trim()}>
            {busy ? "Đang tra…" : "🔎 Tra / dịch"}
          </button>
          {q && (
            <button type="button" className="btn sm" onClick={() => setQ("")}>
              Xóa
            </button>
          )}
          <span className="muted ai-hint">Enter để tra · Shift+Enter xuống dòng</span>
        </div>
        <div className="ai-ex">
          <span className="muted">Thử:</span>
          {EXAMPLES.map((x) => (
            <button key={x} type="button" onClick={() => run(x)}>
              {x}
            </button>
          ))}
        </div>
        {!!hist.length && (
          <div className="ai-ex">
            <span className="muted">Đã tra:</span>
            {hist.map((x) => (
              <button key={x} type="button" onClick={() => run(x)}>
                {x}
              </button>
            ))}
            <button
              type="button"
              className="ai-clear"
              onClick={() => {
                setHist([]);
                saveHistory([]);
              }}
            >
              Xóa lịch sử
            </button>
          </div>
        )}
      </div>

      <div className="ai-card ai-out" aria-live="polite">
        {!res ? (
          <div className="ai-empty">
            <div className="i">🤖</div>
            <p>
              Kết quả tra cứu hiện ở đây: bản dịch, phiên âm, các nghĩa và ví dụ. Hiện tại AI <b>chưa được kết nối</b>; trang sẽ tra trong{" "}
              <a href={href("tu-dien.html")}>Từ điển chuyên ngành</a> của trung tâm.
            </p>
          </div>
        ) : (
          <>
            <div className="ai-q">
              <span className="muted">Tra:</span> <b className={hasHan(res.q) ? "z" : ""}>{res.q}</b>
              {hasHan(res.q) && (
                <button type="button" className="ai-say" onClick={() => speak(res.q)} aria-label="Nghe">
                  🔊
                </button>
              )}
              {res.pinyin && <div className="ai-py">{res.pinyin}</div>}
            </div>

            {res.ai ? (
              <div className="ai-ans">
                {res.ai.translation.zh && <div className="z big">{res.ai.translation.zh}</div>}
                {res.ai.translation.pinyin && <div className="ai-py">{res.ai.translation.pinyin}</div>}
                {res.ai.translation.vi && <div className="vi">{res.ai.translation.vi}</div>}
                {res.ai.entries?.map((e) => (
                  <div className="ai-m" key={e.zh + e.vi}>
                    <b className="z">{e.zh}</b> <span className="ai-py">{e.pinyin}</span> <i className="muted">{e.pos}</i> — {e.vi}
                  </div>
                ))}
                {res.ai.examples?.map((x) => (
                  <div className="ai-exs" key={x.zh}>
                    <div className="z">{x.zh}</div>
                    <div className="ai-py">{x.pinyin}</div>
                    <div>{x.vi}</div>
                  </div>
                ))}
                {res.ai.note && <p className="muted">{res.ai.note}</p>}
              </div>
            ) : (
              <div className="ai-off">
                <b>⚠ Chưa kết nối AI.</b> {res.aiMsg} Dưới đây là kết quả tra trong từ điển chuyên ngành của trung tâm.
              </div>
            )}

            <h3 className="ai-h">Trong từ điển chuyên ngành</h3>
            {res.matches.length ? (
              <div className="ai-list">
                {res.matches.map((e) => (
                  <div className="ai-m" key={e.code}>
                    <div>
                      <b className="z">{e.zh}</b> <span className="ai-py">{e.py}</span> <i className="muted">{e.pos}</i>
                      <button type="button" className="ai-say" onClick={() => speak(e.zh)} aria-label={`Nghe ${e.zh}`}>
                        🔊
                      </button>
                    </div>
                    <div>{e.vi}</div>
                    {e.ex && (
                      <div className="ai-exs">
                        <div className="z">{e.ex[0]}</div>
                        <div className="ai-py">{e.ex[1]}</div>
                        <div>{e.ex[2]}</div>
                      </div>
                    )}
                    <a className="ai-link" href={href(`tu-dien.html#${e.sec}/v/${e.code}`)}>
                      {e.secVi} →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Chưa có “{res.q}” trong từ điển mẫu. Khi AI được kết nối, trang sẽ dịch tự do mọi từ và câu.</p>
            )}

            {(first || hasHan(res.q)) && (
              <>
                <h3 className="ai-h">Cách viết</h3>
                <StrokeChars text={first && !hasHan(res.q) ? first.zh : res.q} size={80} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
