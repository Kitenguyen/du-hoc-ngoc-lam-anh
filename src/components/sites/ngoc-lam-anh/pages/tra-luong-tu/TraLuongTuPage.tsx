"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PageHead, PageShell } from "../../PageShell";
import { useLocationHash } from "../tai-lieu/hooks";
import { MEASURE_WORDS, TYPE_ORDER, letterOf, type LtType, type MeasureWord } from "./data";
import "./tra-luong-tu.css";

const CIRC = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

const strip = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

const DATA = [...MEASURE_WORDS].sort((a, b) => strip(a.py).localeCompare(strip(b.py)) || a.py.localeCompare(b.py));

// raw: mọi chữ (chữ Hán, nghĩa tiếng Việt…); flat: pinyin bỏ dấu thanh để gõ "ge" cũng ra 个
const HAY = new Map<MeasureWord, { raw: string; flat: string }>(
  DATA.map((it) => {
    const raw = [
      it.mw,
      it.py,
      it.vi,
      ...it.senses.flatMap((s) => [s.zh, s.vi, s.nouns, ...s.ex.flatMap((x) => [x.zh, x.py, x.vi])]),
    ]
      .join(" ")
      .toLowerCase();
    const flat = strip([it.py, ...it.senses.flatMap((s) => s.ex.map((x) => x.py))].join(" "));
    return [it, { raw, flat }];
  }),
);

const TYPES: LtType[] = TYPE_ORDER.filter((t) => DATA.some((it) => it.types.includes(t)));

function say(text: string) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    // trình duyệt không hỗ trợ đọc to
  }
}

function hl(zh: string, mw: string): ReactNode {
  const parts = zh.split(mw);
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <b>{mw}</b>}
    </span>
  ));
}

function Detail({ it, onBack }: { it: MeasureWord; onBack: () => void }) {
  return (
    <div className="lt-detail" style={{ display: "block" }}>
      <button className="lt-back" type="button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="lt-head">
        <div className="py">{it.py}</div>
        <div className="hz">
          {it.mw}
          <button className="say" type="button" onClick={() => say(it.mw)} aria-label={`Đọc ${it.mw}`}>
            🔊
          </button>
        </div>
        <div className="lt-vi">{it.vi}</div>
        <span className="tp">{it.types.join(" · ")}</span>
      </div>
      <div className="lt-sectitle">用法说明 · Cách dùng</div>
      {it.senses.map((s, i) => (
        <div className="lt-sense" key={i}>
          <div className="sz">
            {CIRC[i] ?? `(${i + 1})`} {s.zh}
          </div>
          <div className="sv">{s.vi}</div>
          {s.nouns !== "—" && (
            <div className="lt-nouns">
              Thường đi với: <span>{s.nouns}</span>
            </div>
          )}
          <div className="lt-exs">
            {s.ex.map((x) => (
              <div className="lt-exc" key={x.zh}>
                <div className="emo">{x.emoji}</div>
                <div className="tx">
                  <div className="epy">{x.py}</div>
                  <div className="ezh">{hl(x.zh, it.mw)}</div>
                  <div className="evi">{x.vi}</div>
                </div>
                <button className="say" type="button" onClick={() => say(x.zh)} aria-label={`Đọc ${x.zh}`}>
                  🔊
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TraLuongTuPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LtType | "all">("all");
  const hash = useLocationHash();
  const [pick, setPick] = useState<string | null | undefined>(undefined);
  const current = pick !== undefined ? pick : hash;
  const detail = current ? DATA.find((x) => x.mw === current) : undefined;

  // Hash đổi từ bên ngoài (nút Back của trình duyệt, link #个) → theo hash
  useEffect(() => {
    const onHash = () => setPick(undefined);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const list = useMemo(() => {
    const raw = q.trim().toLowerCase();
    const flat = strip(raw);
    return DATA.filter((it) => {
      if (filter !== "all" && !it.types.includes(filter)) return false;
      if (!raw) return true;
      const h = HAY.get(it);
      return !!h && (h.raw.includes(raw) || h.flat.includes(flat));
    });
  }, [q, filter]);

  const groups = useMemo(() => {
    const by = new Map<string, MeasureWord[]>();
    for (const it of list) {
      const L = letterOf(it.py);
      by.set(L, [...(by.get(L) ?? []), it]);
    }
    return [...by.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [list]);

  const open = (mw: string) => {
    setPick(mw);
    history.replaceState(null, "", `#${encodeURIComponent(mw)}`);
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setPick(null);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0 });
  };

  return (
    <PageShell active="tra-luong-tu">
      <div className="pg-tra-luong-tu">
        <PageHead
          zh="量词"
          title="Tra lượng từ"
          intro="Chọn lượng từ để xem cách dùng và ví dụ cụ thể. Gõ chữ Hán, pinyin hoặc nghĩa tiếng Việt để tìm."
        />
        <section className="block light" style={{ paddingTop: 8 }}>
          <div className="lt-wrap">
            {detail ? (
              <Detail it={detail} onBack={back} />
            ) : (
              <div>
                <div className="lt-tools">
                  <input
                    className="lt-search"
                    type="search"
                    placeholder="Danh từ tiếng Trung, lượng từ, pinyin, nghĩa tiếng Việt…"
                    autoComplete="off"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Tìm lượng từ"
                  />
                  <div className="lt-chips">
                    {(["all", ...TYPES] as const).map((t) => (
                      <button key={t} type="button" className={`lt-chip${t === filter ? " on" : ""}`} onClick={() => setFilter(t)}>
                        {t === "all" ? "Tất cả" : t}
                      </button>
                    ))}
                  </div>
                  <div className="lt-total">Tổng {list.length} lượng từ</div>
                </div>
                {!list.length ? (
                  <div className="infobox">Không tìm thấy lượng từ phù hợp.</div>
                ) : (
                  groups.map(([L, items]) => (
                    <div key={L}>
                      <div className="lt-grp">
                        {L}
                        <span className="n">{items.length}</span>
                      </div>
                      <div className="lt-grid">
                        {items.map((it) => (
                          <button type="button" className="lt-tile" key={it.mw} onClick={() => open(it.mw)}>
                            <div className="py">{it.py}</div>
                            <div className="hz">{it.mw}</div>
                            <span className="tag">{it.vi}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
