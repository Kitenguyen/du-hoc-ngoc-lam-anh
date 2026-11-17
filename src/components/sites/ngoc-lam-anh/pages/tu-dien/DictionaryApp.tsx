"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALL_ENTRIES,
  DICT_FILES,
  DICT_GROUPS,
  DICT_SECTIONS,
  LEVELS,
  type DictEntry,
  type FlatEntry,
  type Level,
} from "./data";
import { searchDict, speak } from "./hanzi";
import { StrokeChars } from "./StrokeChars";

type Tab = "v" | "s" | "g";

function LvBadge({ l }: { l?: Level }) {
  if (!l) return null;
  return (
    <b className={`lv lv${l}`} title={`Cấp độ ${l}`}>
      {l}
    </b>
  );
}

function setHash(h: string) {
  window.history.pushState(null, "", h || window.location.pathname + window.location.search);
}

function readHash(): { sec: string; tab: Tab; code: string } {
  if (typeof window === "undefined") return { sec: "", tab: "v", code: "" };
  const [sec = "", tab = "v", code = ""] = decodeURIComponent(window.location.hash.slice(1)).split("/");
  return { sec, tab: (["v", "s", "g"].includes(tab) ? tab : "v") as Tab, code };
}

function EntryRow({ e, initiallyOpen, extra }: { e: DictEntry & { code?: string }; initiallyOpen?: boolean; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(!!initiallyOpen);
  return (
    <div className={`td-e${open ? " open" : ""}`} id={e.code ? `e-${e.code}` : undefined}>
      <button className="td-eh" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="w">{e.zh}</span>
        <span>
          <span className="p">{e.py}</span>
          <span className="m">{e.vi}</span>
        </span>
        <span>
          <LvBadge l={e.lv} />
        </span>
        <span className="c">
          {e.pos}
          {extra}
        </span>
      </button>
      {open && (
        <div className="td-d">
          <div>
            <button type="button" className="td-btn" onClick={() => speak(e.zh)}>
              🔊 Nghe từ
            </button>
            {e.ex && (
              <button type="button" className="td-btn" onClick={() => speak(e.ex ? e.ex[0] : "")}>
                🔊 Nghe ví dụ
              </button>
            )}
          </div>
          <dl>
            <dt>Từ loại</dt>
            <dd>{e.pos}</dd>
            <dt>Nghĩa</dt>
            <dd>
              <b>{e.vi}</b>
            </dd>
            {e.note && (
              <>
                <dt>Ghi chú</dt>
                <dd>{e.note}</dd>
              </>
            )}
            <dt>Cấp độ</dt>
            <dd>
              <LvBadge l={e.lv} />
            </dd>
          </dl>
          {e.ex && (
            <div className="td-ex">
              <div className="z">{e.ex[0]}</div>
              <div className="py">{e.ex[1]}</div>
              <div className="v">{e.ex[2]}</div>
            </div>
          )}
          <div className="hzx">
            <div className="hzx-l">✍ Cách viết (thứ tự nét)</div>
            <StrokeChars text={e.zh} size={84} />
          </div>
        </div>
      )}
    </div>
  );
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

type QuizQ = { e: DictEntry; opts: DictEntry[] };

function makeQuiz(words: DictEntry[], pool: DictEntry[]): QuizQ[] {
  return shuffle(words).map((e) => {
    const others = shuffle(pool.filter((x) => x.zh !== e.zh && x.vi !== e.vi)).slice(0, 3);
    return { e, opts: shuffle([e, ...others]) };
  });
}

function QuizGame({ words }: { words: DictEntry[] }) {
  const pool = useMemo(() => ALL_ENTRIES, []);
  const [mode, setMode] = useState<"mean" | "han">("mean");
  const [qs, setQs] = useState<QuizQ[]>(() => makeQuiz(words, pool));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const restart = useCallback(
    (m = mode) => {
      setMode(m);
      setQs(makeQuiz(words, pool));
      setI(0);
      setPicked(null);
      setScore(0);
    },
    [mode, words, pool],
  );

  const done = i >= qs.length;
  const q = qs[i];

  function pick(o: DictEntry) {
    if (picked || !q) return;
    setPicked(o.zh);
    if (o.zh === q.e.zh) setScore((s) => s + 1);
    speak(q.e.zh);
  }

  return (
    <div className="td-game">
      <div className="td-tabs">
        <button type="button" className={mode === "mean" ? "on" : ""} onClick={() => restart("mean")}>
          Nhìn chữ Hán chọn nghĩa
        </button>
        <button type="button" className={mode === "han" ? "on" : ""} onClick={() => restart("han")}>
          Nhìn nghĩa chọn chữ Hán
        </button>
      </div>
      <div className="td-qbox">
        {done ? (
          <div>
            <div className="td-qbig">🎉</div>
            <p>
              Hoàn thành: đúng <b>{score}</b>/{qs.length} từ.
            </p>
            <button type="button" className="btn pri sm" onClick={() => restart()}>
              ↺ Chơi lại
            </button>
          </div>
        ) : (
          q && (
            <>
              <div className="td-qtop">
                <span>
                  Câu {i + 1}/{qs.length}
                </span>
                <span>Đúng: {score}</span>
              </div>
              {mode === "mean" ? (
                <>
                  <div className="td-qhan">{q.e.zh}</div>
                  <div className="td-qpy">{picked ? q.e.py : " "}</div>
                </>
              ) : (
                <div className="td-qmean">{q.e.vi}</div>
              )}
              <div className="td-qopts">
                {q.opts.map((o) => {
                  const cls = picked ? (o.zh === q.e.zh ? "ok" : o.zh === picked ? "no" : "") : "";
                  return (
                    <button key={o.zh} type="button" className={cls} onClick={() => pick(o)}>
                      {mode === "mean" ? o.vi : <span className="z">{o.zh}</span>}
                    </button>
                  );
                })}
              </div>
              {picked && (
                <button
                  type="button"
                  className="btn pri sm td-next"
                  onClick={() => {
                    setPicked(null);
                    setI((n) => n + 1);
                  }}
                >
                  Câu tiếp →
                </button>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}

async function exportExcel() {
  const XLSX = await import("xlsx");
  const rows = ALL_ENTRIES.map((e) => ({
    "Ngành / phòng ban": e.secVi,
    "Chữ Hán": e.zh,
    "Phiên âm": e.py,
    "Từ loại": e.pos,
    "Nghĩa": e.vi,
    "Cấp độ": e.lv,
    "Ví dụ": e.ex ? `${e.ex[0]} ${e.ex[1]} — ${e.ex[2]}` : "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tu dien");
  XLSX.writeFile(wb, "tu-dien-chuyen-nganh-mau.xlsx");
}

export function DictionaryApp() {
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [group, setGroup] = useState("");
  const [secSel, setSecSel] = useState("");
  const [lv, setLv] = useState<Level | "">("");
  const [route, setRoute] = useState<{ sec: string; tab: Tab; code: string }>({ sec: "", tab: "v", code: "" });

  useEffect(() => {
    const on = () => {
      const r = readHash();
      setRoute(r);
      if (r.sec) {
        const s = DICT_SECTIONS.find((x) => x.key === r.sec);
        if (s) {
          setSecSel(s.key);
          setGroup(s.group);
        }
      }
    };
    on();
    window.addEventListener("hashchange", on);
    window.addEventListener("popstate", on);
    return () => {
      window.removeEventListener("hashchange", on);
      window.removeEventListener("popstate", on);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDq(q.trim()), 180);
    return () => clearTimeout(t);
  }, [q]);

  const go = (sec: string, tab: Tab = "v", code = "") => {
    setHash(sec ? `#${sec}${tab !== "v" || code ? `/${tab}` : ""}${code ? `/${code}` : ""}` : "");
    setRoute({ sec, tab, code });
    const s = DICT_SECTIONS.find((x) => x.key === sec);
    setSecSel(s ? s.key : "");
    if (s) setGroup(s.group);
  };

  const sections = DICT_SECTIONS.filter((s) => !group || s.group === group);
  const section = DICT_SECTIONS.find((s) => s.key === route.sec);

  useEffect(() => {
    if (route.code) {
      const t = setTimeout(() => document.getElementById(`e-${route.code}`)?.scrollIntoView({ block: "center", behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
  }, [route]);

  const results = useMemo(() => {
    if (!dq) return [];
    let list: FlatEntry[] = ALL_ENTRIES;
    if (secSel) list = list.filter((e) => e.sec === secSel);
    else if (group) list = list.filter((e) => DICT_SECTIONS.find((s) => s.key === e.sec)?.group === group);
    return searchDict(dq, list)
      .filter((e) => !lv || e.lv === lv)
      .slice(0, 120);
  }, [dq, secSel, group, lv]);

  let body: React.ReactNode;
  if (dq) {
    body = (
      <>
        <div className="td-res-h">
          {results.length ? (
            <>
              Tìm thấy <b>{results.length}</b> mục cho “{dq}”. Bấm vào từ để xem chi tiết, nghe và xem cách viết.
            </>
          ) : (
            <>Không tìm thấy “{dq}”. Thử gõ ít chữ hơn, pinyin không dấu hoặc bỏ bộ lọc.</>
          )}
        </div>
        <div className="td-list">
          {results.map((e) => (
            <EntryRow
              key={e.code}
              e={e}
              initiallyOpen={results.length === 1}
              extra={
                <>
                  {" · "}
                  <a
                    href={`#${e.sec}/v/${e.code}`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setQ("");
                      setDq("");
                    }}
                  >
                    {e.secVi} →
                  </a>
                </>
              }
            />
          ))}
        </div>
      </>
    );
  } else if (section) {
    const tab = route.tab === "s" && !section.sentences?.length ? "v" : route.tab;
    const entries = section.entries
      .map((e, i) => ({ ...e, code: `${section.key}-${i + 1}` }))
      .filter((e) => !lv || e.lv === lv);
    const grp = DICT_GROUPS.find((g) => g.key === section.group);
    body = (
      <>
        <button className="td-back" type="button" onClick={() => go("")}>
          ← Tất cả ngành và phòng ban
        </button>
        <div className="td-head">
          <div className="muted" style={{ fontSize: 13 }}>
            {grp?.vi}
          </div>
          <h2>
            {section.vi}
            <span className="z">{section.zh}</span>
          </h2>
          <div className="alt">{section.py}</div>
          <p>{section.intro}</p>
        </div>
        <div className="td-tabs">
          <button type="button" className={tab === "v" ? "on" : ""} onClick={() => go(section.key, "v")}>
            Từ vựng ({section.entries.length})
          </button>
          {!!section.sentences?.length && (
            <button type="button" className={tab === "s" ? "on" : ""} onClick={() => go(section.key, "s")}>
              Mẫu câu ({section.sentences.length})
            </button>
          )}
          <button type="button" className={tab === "g" ? "on" : ""} onClick={() => go(section.key, "g")}>
            🎮 Trò chơi ôn tập
          </button>
        </div>
        {tab === "v" && (
          <div className="td-g">
            <div className="td-list">
              {entries.length ? (
                entries.map((e) => <EntryRow key={e.code === route.code ? `${e.code}-o` : e.code} e={e}initiallyOpen={e.code === route.code} />)
              ) : (
                <p>Không có mục từ ở cấp độ này.</p>
              )}
            </div>
          </div>
        )}
        {tab === "s" &&
          section.sentences?.map((x) => (
            <div className="td-s" key={x[0]}>
              <div className="z">
                {x[0]}{" "}
                <button type="button" className="td-btn" onClick={() => speak(x[0])} aria-label="Nghe">
                  🔊
                </button>
              </div>
              <div className="py">{x[1]}</div>
              <div className="v">{x[2]}</div>
            </div>
          ))}
        {tab === "g" && (
          <>
            <p className="muted" style={{ margin: "0 0 8px" }}>
              Ôn {section.entries.length} từ của ngành này: nhìn chữ Hán chọn nghĩa, hoặc nhìn nghĩa chọn chữ Hán. Mỗi lần chọn, máy đọc to từ đúng.
            </p>
            <QuizGame key={section.key} words={section.entries} />
          </>
        )}
      </>
    );
  } else {
    body = (
      <div className="td-taps">
        {DICT_GROUPS.filter((g) => !group || g.key === group).map((g) => (
          <div className="td-tap" key={g.key}>
            <h2>
              {g.vi}
              <small>{g.zh}</small>
            </h2>
            <div className="td-secs">
              {DICT_SECTIONS.filter((s) => s.group === g.key).map((s) => (
                <button
                  type="button"
                  className="td-sec"
                  key={s.key}
                  onClick={() => {
                    go(s.key);
                    window.scrollTo({ top: (document.getElementById("tdMain")?.offsetTop ?? 0) - 90, behavior: "smooth" });
                  }}
                >
                  <b>{s.vi}</b>
                  <span className="z">{s.zh}</span>
                  <small>
                    {s.entries.length} mục từ{s.sentences?.length ? ` · ${s.sentences.length} mẫu câu` : ""}
                  </small>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="td-search">
        <input
          id="tdQ"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Gõ chữ Hán, pinyin (có/không dấu) hoặc nghĩa tiếng Việt…  vd: 返工, fangong, làm lại"
          autoComplete="off"
          aria-label="Tìm từ"
        />
        <div className="td-f">
          <select
            aria-label="Nhóm"
            value={group}
            onChange={(e) => {
              setGroup(e.target.value);
              const s = DICT_SECTIONS.find((x) => x.key === secSel);
              if (s && e.target.value && s.group !== e.target.value) setSecSel("");
            }}
          >
            <option value="">Tất cả các nhóm</option>
            {DICT_GROUPS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.vi}
              </option>
            ))}
          </select>
          <select
            aria-label="Ngành / phòng ban"
            value={secSel}
            onChange={(e) => {
              setSecSel(e.target.value);
              if (!q.trim()) go(e.target.value);
            }}
          >
            <option value="">Tất cả ngành / phòng ban</option>
            {sections.map((s) => (
              <option key={s.key} value={s.key}>
                {s.vi} {s.zh}
              </option>
            ))}
          </select>
          <select aria-label="Cấp độ" value={lv} onChange={(e) => setLv(e.target.value as Level | "")}>
            <option value="">Mọi cấp độ</option>
            {LEVELS.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="td-legend">
        Cấp độ:{" "}
        {LEVELS.map((l, i) => (
          <span key={l.key}>
            <LvBadge l={l.key} /> {l.hint}
            {i < LEVELS.length - 1 ? " · " : ""}
          </span>
        ))}
        . Bấm vào từ để nghe phát âm và xem cách viết từng nét.
      </div>
      <div id="tdMain">{body}</div>
      <div className="td-dl" id="tai-ve">
        <h2>Tải bộ từ điển</h2>
        <p className="muted">Tải bảng Excel các từ đang có trong từ điển để in, lọc hoặc ôn tập. Bản PDF/Word đầy đủ của trung tâm sẽ cập nhật sau.</p>
        <div className="td-files">
          <div className="td-file">
            <span>Bảng Excel · {ALL_ENTRIES.length} mục từ mẫu</span>
            <button type="button" className="td-btn" onClick={() => exportExcel()}>
              ⬇ Tải Excel
            </button>
          </div>
          {DICT_FILES.map((f) => (
            <div className="td-file" key={f.title}>
              <span>{f.title}</span>
              <span className="muted">{f.note}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
