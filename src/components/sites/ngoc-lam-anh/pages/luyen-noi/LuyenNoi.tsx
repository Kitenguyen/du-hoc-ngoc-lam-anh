"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findWord } from "../../lib/hsk-vocab";
import { lsGet, lsSet, shuffle, speakZh, stopSpeak } from "../tu-vung/utils";
import { SPEAK_FILES, SPEAK_LEVELS, findTopic, type Line, type SpeakTopic } from "./data";
import { SpeakSession, type SessionItem } from "./SpeakSession";
import { gradeAnswer, norm } from "./speech";

type Tab = "tv" | "q" | "ht" | "ntl" | "kt1" | "ot" | "kt2";
const TABS: [Tab, string][] = [
  ["tv", "① Từ vựng"],
  ["q", "② Câu hỏi & trả lời"],
  ["ht", "③ Hội thoại"],
  ["ntl", "④ Nghe & trả lời"],
  ["kt1", "⑤ Nghe & nhắc lại"],
  ["ot", "⑥ Luyện từ vựng"],
  ["kt2", "⑦ Kiểm tra viết"],
];
type Opt = { py: boolean; vi: boolean; showq: boolean };
const DEFAULT_OPT: Opt = { py: true, vi: true, showq: true };

function Say({ text, rate }: { text: string; rate: number }) {
  return (
    <button type="button" className="ln-btn ln-say" onClick={() => speakZh(text, rate)} title="Nghe" aria-label="Nghe">
      🔊
    </button>
  );
}

function S({ x, big, rate }: { x: Line; big?: boolean; rate: number }) {
  return (
    <>
      <div className={big ? "ln-q" : "ln-z"}>
        {x.zh} <Say text={x.zh} rate={rate} />
      </div>
      <div className="py">{x.py}</div>
      <div className="vi">{x.vi}</div>
    </>
  );
}

function vocabOf(t: SpeakTopic) {
  const rows = t.vocab.map((h) => findWord(h)).filter((w): w is NonNullable<typeof w> => !!w);
  return [...rows.map((w) => ({ h: w.h, p: w.p, m: w.m })), ...(t.extra ?? [])];
}

/* ---------- các mục của một chủ đề ---------- */
function TabVocab({ t, rate }: { t: SpeakTopic; rate: number }) {
  const V = vocabOf(t);
  return (
    <>
      <p className="ln-info">
        Từ vựng chủ đề <b>{t.vi}</b> – {V.length} từ. Bấm 🔊 để nghe.
      </p>
      <div className="ln-scroll">
        <table className="ln-tbl">
          <thead>
            <tr>
              <th>Từ</th>
              <th>Pinyin</th>
              <th>Nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {V.map((v) => (
              <tr key={v.h}>
                <td className="ln-z">
                  {v.h} <Say text={v.h} rate={rate} />
                </td>
                <td className="py">{v.p}</td>
                <td>{v.m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Note({ k }: { k: string }) {
  const key = `nla_ln_note_${k}`;
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  const [st, setSt] = useState("");
  useEffect(() => {
    const s = lsGet<string>(key, "");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setV(s);
    setOpen(!!s);
  }, [key]);
  return (
    <>
      <button type="button" className={`ln-btn${v ? " has" : ""}`} onClick={() => setOpen((o) => !o)}>
        📝 Ghi chú
      </button>
      {open && (
        <div className="ln-nt">
          <textarea
            value={v}
            placeholder="Ghi chú: câu trả lời của bạn, lỗi cần sửa, ý mở rộng… (tự động lưu trên máy này)"
            onChange={(e) => {
              setV(e.target.value);
              lsSet(key, e.target.value);
              setSt("Đã lưu trên máy này");
            }}
          />
          <small>{st}</small>
        </div>
      )}
    </>
  );
}

function TabQ({ t, rate }: { t: SpeakTopic; rate: number }) {
  const [show, setShow] = useState<Record<number, boolean>>({});
  return (
    <>
      <p className="ln-info">
        Bấm 🔊 để nghe câu hỏi. <b>Gợi ý</b> là câu trả lời tham khảo – bạn được trả lời theo ý mình, miễn đúng câu hỏi. Nút{" "}
        <b>📝 Ghi chú</b> lưu ghi chú ngay trên máy này.
      </p>
      {t.q.map((q, i) => (
        <div className="ln-card" key={q.zh}>
          <div className="ln-code">Câu {i + 1}</div>
          <S x={q} big rate={rate} />
          <Note k={`${t.code}-${i + 1}`} />
          <button type="button" className="ln-btn" onClick={() => setShow((s) => ({ ...s, [i]: !s[i] }))}>
            💡 Gợi ý trả lời
          </button>
          {show[i] && (
            <div className="ln-ans">
              <h4>Trả lời ngắn</h4>
              <S x={q.short} rate={rate} />
              <h4>Trả lời mở rộng</h4>
              <S x={q.long} rate={rate} />
              {q.note && <div className="ln-note">{q.note}</div>}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function TabDialog({ t, rate }: { t: SpeakTopic; rate: number }) {
  const [now, setNow] = useState(-1);
  const run = useRef(0);
  useEffect(
    () => () => {
      run.current++;
      stopSpeak();
    },
    [],
  );
  const playAll = () => {
    const my = ++run.current;
    const step = (i: number) => {
      if (run.current !== my) return;
      if (i >= t.dialog.length) {
        setNow(-1);
        return;
      }
      setNow(i);
      speakZh(t.dialog[i].zh, rate, () => setTimeout(() => step(i + 1), 350));
    };
    step(0);
  };
  return (
    <>
      <p className="ln-info">Hội thoại giữa hai người. Bấm 🔊 để nghe từng câu, hoặc nghe cả bài rồi tập đóng vai A / B.</p>
      <div className="ln-card">
        {t.dialog.map((l, i) => (
          <div className={`ln-ln${now === i ? " now" : ""}`} key={i}>
            <div className={`sp ${l.sp === "A" ? "a" : "b"}`}>{l.sp}：</div>
            <div>
              <S x={l} rate={rate} />
            </div>
          </div>
        ))}
        <button type="button" className="ln-btn pri" onClick={playAll}>
          🔊 Nghe cả bài
        </button>
        {now >= 0 && (
          <button
            type="button"
            className="ln-btn"
            onClick={() => {
              run.current++;
              stopSpeak();
              setNow(-1);
            }}
          >
            ⏹ Dừng
          </button>
        )}
      </div>
    </>
  );
}

function TabFlash({ t, rate }: { t: SpeakTopic; rate: number }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <>
      <p className="ln-info">Nhìn chữ Hán, nhớ pinyin và nghĩa, rồi bấm “Hiện đáp án” để tự kiểm tra.</p>
      <div className="ln-fgrid">
        {vocabOf(t).map((v) => (
          <div className="ln-card center" key={v.h}>
            <div className="ln-z ln-zbig">
              {v.h} <Say text={v.h} rate={rate} />
            </div>
            <button type="button" className="ln-btn" onClick={() => setOpen((o) => ({ ...o, [v.h]: !o[v.h] }))}>
              {open[v.h] ? "Ẩn đáp án" : "Hiện đáp án"}
            </button>
            {open[v.h] && (
              <div className="ln-ans">
                <div className="py">{v.p}</div>
                <div className="vi">{v.m}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function KtCard({ q, i, n }: { q: SpeakTopic["q"][number]; i: number; n: number }) {
  const [qin, setQin] = useState("");
  const [ain, setAin] = useState("");
  const [res, setRes] = useState<{ qok: boolean; aok: boolean; c: string } | null>(null);
  return (
    <div className="ln-card">
      <div className="ln-code">
        Câu {i + 1} / {n}
      </div>
      <div className="ln-kvi">
        <b>Tiếng Việt:</b> {q.vi}
      </div>
      <label className="ln-lbl">
        Gõ câu hỏi (tiếng Trung):
        <input className="ln-essay ln-one" value={qin} onChange={(e) => setQin(e.target.value)} placeholder="…" />
      </label>
      <label className="ln-lbl">
        Gõ câu trả lời của bạn (tiếng Trung):
        <input className="ln-essay ln-one" value={ain} onChange={(e) => setAin(e.target.value)} placeholder="…" />
      </label>
      <button
        type="button"
        className="ln-btn pri"
        onClick={() => {
          const qok = !!norm(qin) && norm(qin).replace(/[吗呢]$/, "") === norm(q.zh).replace(/[吗呢]$/, "");
          const g = gradeAnswer(ain, [q.short.zh, q.long.zh], q.keys);
          setRes({ qok, aok: g.ok, c: g.comment });
        }}
      >
        Kiểm tra
      </button>
      {res && (
        <div className="ln-res">
          <div>{res.qok ? <span className="ok">✓ Câu hỏi đúng</span> : <span className="bad">✗ Câu hỏi chưa khớp</span>}</div>
          <div>
            Câu đúng: <span className="ln-z">{q.zh}</span> <span className="py">{q.py}</span>
          </div>
          <div className="ln-mt">
            {res.aok ? <span className="ok">✓ Câu trả lời đạt</span> : <span className="bad">✗ Câu trả lời chưa đạt</span>}{" "}
            <span className="muted">{res.c}</span>
          </div>
          <div>
            Trả lời tham khảo: <span className="ln-z">{q.short.zh}</span> <span className="py">{q.short.py}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TabKt2({ t }: { t: SpeakTopic }) {
  return (
    <>
      <p className="ln-info">
        Nhìn câu tiếng Việt, <b>gõ câu hỏi</b> bằng tiếng Trung, rồi <b>gõ câu trả lời</b> của bạn. Bấm “Kiểm tra” để so với đáp án
        (cần bộ gõ tiếng Trung trên máy).
      </p>
      {t.q.map((q, i) => (
        <KtCard key={q.zh} q={q} i={i} n={t.q.length} />
      ))}
    </>
  );
}

/* ---------- trang chính ---------- */
type Route = { lv: number; code: string | null; tab: Tab };

function parseHash(h: string, fallbackLv: number): Route {
  const [a, b] = h.replace(/^#/, "").split("/");
  const m = /^lv([1-6])$/.exec(a);
  if (m) return { lv: +m[1], code: null, tab: "tv" };
  const t = a ? findTopic(a) : undefined;
  if (t) {
    const lv = +t.code.charAt(3);
    const tab = TABS.some(([x]) => x === b) ? (b as Tab) : "tv";
    return { lv, code: t.code, tab };
  }
  return { lv: fallbackLv, code: null, tab: "tv" };
}

export function LuyenNoi() {
  const [route, setRoute] = useState<Route>({ lv: 1, code: null, tab: "tv" });
  const [opt, setOpt] = useState<Opt>(DEFAULT_OPT);
  const [rate, setRate] = useState(0.85);
  const mainRef = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    stopSpeak();
    setRoute(parseHash(window.location.hash, lsGet<number>("nla_ln_lv", 1)));
  }, []);

  useEffect(() => {
    setOpt({ ...DEFAULT_OPT, ...lsGet<Partial<Opt>>("nla_ln_opt", {}) });
    sync();
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      stopSpeak();
    };
  }, [sync]);

  useEffect(() => {
    lsSet("nla_ln_lv", route.lv);
  }, [route.lv]);

  const go = (hash: string) => {
    if (window.location.hash === hash) sync();
    else window.location.hash = hash;
  };

  const updOpt = (p: Partial<Opt>) =>
    setOpt((o) => {
      const n = { ...o, ...p };
      lsSet("nla_ln_opt", n);
      return n;
    });

  const level = SPEAK_LEVELS.find((l) => l.lv === route.lv) ?? SPEAK_LEVELS[0];
  const topic = route.code ? findTopic(route.code) : undefined;

  const totals = useMemo(() => {
    let nt = 0;
    let nq = 0;
    SPEAK_LEVELS.forEach((l) =>
      l.topics.forEach((t) => {
        nt++;
        nq += t.q.length;
      }),
    );
    return { nt, nq };
  }, []);

  const qaItems: SessionItem[] = useMemo(
    () => (topic ? topic.q.map((q) => ({ line: q, refs: [q.short.zh, q.long.zh], keys: q.keys })) : []),
    [topic],
  );
  // câu nhắc lại: câu hỏi + câu trả lời ngắn + câu hội thoại, lấy ngẫu nhiên tối đa 10 câu
  const repeatItems: SessionItem[] = useMemo(() => {
    if (!topic) return [];
    const lines: Line[] = [...topic.q.flatMap((q) => [q as Line, q.short]), ...topic.dialog];
    const seen = new Set<string>();
    const uniq = lines.filter((l) => !seen.has(l.zh) && !!seen.add(l.zh));
    return shuffle(uniq)
      .slice(0, 10)
      .map((l) => ({ line: { zh: l.zh, py: l.py, vi: l.vi }, refs: [l.zh], keys: [] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, route.tab]);

  return (
    <div className="pg-luyen-noi-main">
      <p className="ln-stat">
        {SPEAK_LEVELS.length} cấp · {totals.nt} chủ đề · <b>{totals.nq}</b> câu hỏi có đọc mẫu. Mỗi chủ đề: từ vựng, câu hỏi kèm gợi ý
        trả lời, hội thoại, nghe – trả lời 10 giây, nghe – nhắc lại, kiểm tra viết.
      </p>
      <div className="ln-lv" role="tablist">
        {SPEAK_LEVELS.map((l) => (
          <button key={l.lv} type="button" role="tab" aria-selected={l.lv === route.lv} className={l.lv === route.lv ? "on" : ""} onClick={() => go(`#lv${l.lv}`)}>
            Lớp HSK{l.lv}
            <small>{l.topics.length ? `${l.topics.length} chủ đề` : "đang biên soạn"}</small>
          </button>
        ))}
      </div>

      <div ref={mainRef} className="ln-main">
        {!topic && (
          <>
            <p className="ln-info">
              <b>{level.name}</b> <span className="ln-zh">{level.zh}</span> · {level.topics.length} chủ đề. Độ khó tăng dần theo cấp:
              câu hỏi dài hơn, câu trả lời cần mở rộng hơn. Tất cả chủ đề đều luyện miễn phí.
            </p>
            {level.topics.length ? (
              <div className="ln-grid">
                {level.topics.map((t) => (
                  <button
                    key={t.code}
                    type="button"
                    className="ln-t"
                    onClick={() => {
                      go(`#${t.code}`);
                      mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <span className="n">
                      Bài {t.no} · {t.code.toUpperCase()}
                    </span>
                    <b>{t.vi}</b>
                    <span className="z">{t.zh}</span>
                    <small>{t.q.length} câu hỏi · hội thoại · luyện nói</small>
                  </button>
                ))}
              </div>
            ) : (
              <div className="ln-lock">
                <div className="ln-ic">⏳</div>
                <p>
                  <b>Nội dung lớp HSK{level.lv} đang được trung tâm biên soạn.</b>
                </p>
                <p className="muted">Các bạn luyện trước lớp HSK1, HSK2 nhé – chủ đề mới sẽ được cập nhật sớm.</p>
              </div>
            )}
          </>
        )}

        {topic && (
          <>
            <button type="button" className="ln-back" onClick={() => go(`#lv${route.lv}`)}>
              ← Lớp HSK{route.lv} · danh sách chủ đề
            </button>
            <div className="ln-head">
              <div className="ln-code">
                Bài {topic.no} · {topic.code.toUpperCase()}
              </div>
              <h2>
                {topic.vi}
                <span className="z">{topic.zh}</span>
              </h2>
              <div className="py">{topic.py}</div>
            </div>
            <div className="ln-tabs" role="tablist">
              {TABS.map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={route.tab === id} className={route.tab === id ? "on" : ""} onClick={() => go(`#${topic.code}/${id}`)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="ln-opts">
              <label>
                <input type="checkbox" checked={opt.py} onChange={(e) => updOpt({ py: e.target.checked })} /> Hiện pinyin
              </label>
              <label>
                <input type="checkbox" checked={opt.vi} onChange={(e) => updOpt({ vi: e.target.checked })} /> Hiện nghĩa Việt
              </label>
              {route.tab === "ntl" && (
                <label>
                  <input type="checkbox" checked={opt.showq} onChange={(e) => updOpt({ showq: e.target.checked })} /> Hiện chữ câu hỏi
                  khi trả lời
                </label>
              )}
              <label>
                Tốc độ đọc
                <select value={String(rate)} onChange={(e) => setRate(+e.target.value)}>
                  <option value="0.7">chậm</option>
                  <option value="0.85">vừa</option>
                  <option value="1">nhanh</option>
                </select>
              </label>
            </div>
            <div className={`ln-body${opt.py ? "" : " hide-py"}${opt.vi ? "" : " hide-vi"}`}>
              {route.tab === "tv" && <TabVocab t={topic} rate={rate} />}
              {route.tab === "q" && <TabQ t={topic} rate={rate} />}
              {route.tab === "ht" && <TabDialog t={topic} rate={rate} />}
              {route.tab === "ntl" && (
                <SpeakSession key={`${topic.code}-ntl`} kind="answer" items={qaItems} rate={rate} showQ={opt.showq} histKey={`nla_ln_hist_${topic.code}_ntl`} />
              )}
              {route.tab === "kt1" && (
                <SpeakSession key={`${topic.code}-kt1`} kind="repeat" items={repeatItems} rate={rate} showQ histKey={`nla_ln_hist_${topic.code}_kt1`} />
              )}
              {route.tab === "ot" && <TabFlash t={topic} rate={rate} />}
              {route.tab === "kt2" && <TabKt2 t={topic} />}
            </div>
          </>
        )}
      </div>

      <div className="ln-dl" id="tai-lieu">
        <h2>Tải tài liệu</h2>
        <p className="muted">
          Sách PDF / Word kèm đề kiểm tra dành cho học viên của trung tâm. Tính năng tải tài liệu cần tài khoản học viên (kết nối máy
          chủ) – trung tâm sẽ bật sau.
        </p>
        <div className="ln-files">
          {SPEAK_FILES.map((f) => (
            <div className="ln-file" key={f.title}>
              <span>{f.title}</span>
              <span className="soon">{f.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
