"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BRAND, CONTACT } from "../../data";
import { HSK_LEVELS, pinyinKey, pinyinKeys, type HskGroup } from "../../lib/hsk-vocab";
import { lsGet, lsSet, speakZh, stopSpeak } from "../tu-vung/utils";
import { LEVEL_WORDS, ShooterEngine, audio, beep, type EndStats, type GameWord, type Hud } from "./engine";
import { GUNS, HEROES, drawGun, drawHero, type GunId, type HeroId } from "./sprites";

/* ---------- bộ từ ---------- */
type GameSet = { id: string; title: string; zh: string; tag: string; groups: HskGroup[]; ready: boolean };

const SETS: GameSet[] = [
  ...HSK_LEVELS.map((l) => ({
    id: `hsk${l.level}`,
    title: `Từ vựng ${l.name}`,
    zh: `汉语水平考试${l.zh}`,
    tag: l.status === "soon" || !l.words.length ? "Đang cập nhật" : `${l.words.length} từ`,
    groups: l.groups,
    ready: l.status !== "soon" && l.words.length > 0,
  })),
];
const combined = HSK_LEVELS.filter((l) => l.status !== "soon" && l.words.length);
if (combined.length > 1) {
  SETS.splice(combined.length, 0, {
    id: "hsk-mix",
    title: `Tổng hợp HSK ${combined.map((l) => l.level).join(" + ")}`,
    zh: "综合复习",
    tag: `${combined.reduce((n, l) => n + l.words.length, 0)} từ`,
    groups: combined.flatMap((l) => l.groups.map((g) => ({ ...g, name: `${l.name} · ${g.name}` }))),
    ready: true,
  });
}

type Opt = { hero: HeroId; gun: GunId; mean: boolean; speak: boolean };
const DEFAULT_OPT: Opt = { hero: "panda", gun: "laser", mean: true, speak: true };
const BRAND_LINE = `TRUNG TÂM ${BRAND.headerName.replace(/^TRUNG TÂM\s*/i, "")}${CONTACT.phone ? ` - ${CONTACT.phone}` : ""}`;

function toGameWords(groups: HskGroup[]): GameWord[] {
  const seen = new Set<string>();
  const out: GameWord[] = [];
  for (const g of groups)
    for (const w of g.words) {
      if (seen.has(w.h)) continue;
      seen.add(w.h);
      const k = pinyinKey(w.p);
      if (k) out.push({ h: w.h, p: w.p, m: w.m, k, ks: pinyinKeys(w.h, w.p) });
    }
  return out;
}

/* ---------- ô vẽ nhân vật / súng trong bảng chọn ---------- */
function HeroIcon({ id }: { id: HeroId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const x = cv?.getContext("2d");
    const hero = HEROES.find((h) => h.id === id);
    if (!cv || !x || !hero) return;
    const d = window.devicePixelRatio || 1;
    cv.width = 120 * d;
    cv.height = 80 * d;
    x.scale(d, d);
    x.translate(60, 32);
    drawHero(x, hero, 0.95);
  }, [id]);
  return <canvas ref={ref} aria-hidden="true" />;
}
function GunIcon({ id }: { id: GunId }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const x = cv?.getContext("2d");
    const gun = GUNS.find((g) => g.id === id);
    if (!cv || !x || !gun) return;
    const d = window.devicePixelRatio || 1;
    cv.width = 120 * d;
    cv.height = 80 * d;
    x.scale(d, d);
    x.translate(60, 54);
    drawGun(x, gun, -Math.PI / 2 + 0.9, 1.15, 0);
  }, [id]);
  return <canvas ref={ref} aria-hidden="true" />;
}

/* ---------- màn chơi ---------- */
type PlayProps = {
  words: GameWord[];
  setKey: string;
  label: string;
  opt: Opt;
  onExit: () => void;
};

function PlayScreen({ words, setKey, label, opt, onExit }: PlayProps) {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const inRef = useRef<HTMLInputElement>(null);
  const ovRef = useRef<HTMLDivElement>(null);
  const engRef = useRef<ShooterEngine | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [hud, setHud] = useState<Hud>({ level: 1, score: 0, lives: 3, done: 0, paused: false });
  const [end, setEnd] = useState<EndStats | null>(null);
  const [run, setRun] = useState(0);

  const focusIn = useCallback(() => {
    const i = inRef.current;
    if (i && document.activeElement !== i) {
      try {
        i.focus({ preventScroll: true });
      } catch {
        i.focus();
      }
    }
  }, []);

  useEffect(() => {
    const m = lsGet<boolean>("nla_game_mute", false);
    mutedRef.current = m;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMuted(m);
  }, []);

  // khởi tạo / chơi lại
  useEffect(() => {
    const cv = cvRef.current;
    const inp = inRef.current;
    if (!cv || !inp) return;
    const hero = HEROES.find((h) => h.id === opt.hero) ?? HEROES[0];
    const gun = GUNS.find((g) => g.id === opt.gun) ?? GUNS[0];
    const bestKey = `nla_game_best_${setKey}`;
    const eng = new ShooterEngine(
      cv,
      inp,
      words,
      {
        hero,
        gun,
        mean: opt.mean,
        speak: opt.speak,
        label,
        brand: BRAND_LINE,
        best: lsGet<number>(bestKey, 0),
        muted: () => mutedRef.current,
      },
      {
        onHud: setHud,
        onEnd: (s) => {
          lsSet(bestKey, s.best);
          setEnd(s);
          try {
            (document.activeElement as HTMLElement | null)?.blur();
          } catch {
            /* bỏ qua */
          }
        },
        onSpeak: (h) => speakZh(h, 0.9),
      },
    );
    engRef.current = eng;
    inp.value = "";
    eng.start();
    focusIn();
    audio();
    return () => {
      eng.destroy();
      engRef.current = null;
    };
  }, [words, setKey, label, opt, run, focusIn]);

  // khung toàn màn hình theo visualViewport (bàn phím điện thoại)
  useEffect(() => {
    const fit = () => {
      const ov = ovRef.current;
      const vv = window.visualViewport;
      if (ov) {
        if (vv) {
          ov.style.height = `${vv.height}px`;
          ov.style.top = `${vv.offsetTop}px`;
        } else {
          ov.style.height = "";
          ov.style.top = "0";
        }
      }
      engRef.current?.resize();
    };
    fit();
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("scroll", fit);
    const vis = () => {
      if (document.hidden) engRef.current?.setPaused(true);
    };
    document.addEventListener("visibilitychange", vis);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("scroll", fit);
      document.removeEventListener("visibilitychange", vis);
      document.body.style.overflow = prev;
      stopSpeak();
    };
  }, []);

  // gõ phím khi ô gõ không có focus → chuyển vào ô gõ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const eng = engRef.current;
      const i = inRef.current;
      if (!eng || !i || eng.isOver() || document.activeElement === i) return;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      focusIn();
      i.value += e.key;
      eng.type(i.value, false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusIn]);

  const toggleMute = () => {
    const m = !mutedRef.current;
    mutedRef.current = m;
    setMuted(m);
    lsSet("nla_game_mute", m);
    if (m) stopSpeak();
    focusIn();
  };
  const togglePause = (v?: boolean) => {
    engRef.current?.setPaused(v);
    if (!engRef.current?.isPaused()) focusIn();
  };

  const composing = useRef(false);

  return (
    <div className="g-ov" ref={ovRef}>
      <div className="g-top">
        <div className="s">
          <small>Lv</small>
          <span>{hud.level}</span>
        </div>
        <div className="s">
          <small>⭐</small>
          <span>{hud.score}</span>
        </div>
        <span className="g-hp" aria-label={`${hud.lives} mạng`}>
          {"❤️".repeat(Math.max(0, hud.lives))}
          {"🤍".repeat(Math.max(0, 3 - hud.lives))}
        </span>
        <span className="g-brand">{BRAND_LINE}</span>
        <div className="bar" aria-label="Tiến độ level">
          <i style={{ width: `${(hud.done / LEVEL_WORDS) * 100}%` }} />
        </div>
        <button type="button" title="Bật/tắt âm thanh" aria-label="Bật/tắt âm thanh" onClick={toggleMute}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button type="button" title="Tạm dừng" aria-label="Tạm dừng" onClick={() => togglePause()}>
          ⏸
        </button>
        <button type="button" title="Thoát" aria-label="Thoát" onClick={onExit}>
          ✕
        </button>
      </div>
      <canvas
        className="g-cv"
        ref={cvRef}
        onPointerDown={() => {
          focusIn();
          audio();
        }}
      />
      <form
        className="g-bot"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const i = inRef.current;
          if (i) engRef.current?.type(i.value, true);
          focusIn();
        }}
      >
        <input
          ref={inRef}
          className="g-in"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          inputMode="text"
          placeholder="Gõ phiên âm…"
          aria-label="Gõ phiên âm"
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={(e) => {
            composing.current = false;
            engRef.current?.type(e.currentTarget.value, false);
          }}
          onInput={(e) => {
            if (!composing.current) engRef.current?.type(e.currentTarget.value, false);
          }}
          onKeyDown={(e) => {
            const i = e.currentTarget;
            if (e.key === "Escape") {
              e.preventDefault();
              if (i.value) i.value = "";
              else togglePause();
            } else if (e.key === " " && !e.nativeEvent.isComposing) {
              e.preventDefault();
              engRef.current?.type(i.value, true);
            }
          }}
        />
        <button type="submit" className="g-fire">
          🔫 Bắn
        </button>
      </form>

      {hud.paused && !end && (
        <div className="g-modal">
          <div className="g-box center">
            <h3>⏸ Tạm dừng</h3>
            <div className="g-acts">
              <button type="button" className="btn pri" onClick={() => togglePause(false)}>
                ▶ Chơi tiếp
              </button>
              <button type="button" className="btn" onClick={onExit}>
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {end && (
        <div className="g-modal">
          <div className="g-box">
            <p className="g-brand2">{BRAND_LINE}</p>
            <h3>💥 Kết thúc</h3>
            <div className="g-stats">
              <div>
                <b>{end.score}</b>
                <span>Điểm{end.newBest ? " 🏆 kỷ lục mới!" : ""}</span>
              </div>
              <div>
                <b>{end.level}</b>
                <span>Level</span>
              </div>
              <div>
                <b>{end.hit}</b>
                <span>Từ bắn trúng</span>
              </div>
              <div>
                <b>{end.acc}%</b>
                <span>Gõ chính xác</span>
              </div>
            </div>
            <p className="g-best">
              Kỷ lục của bạn với bộ từ này: <b>{end.best}</b> điểm
            </p>
            {end.missed.length ? (
              <>
                <h4>Từ cần ôn lại ({end.missed.length})</h4>
                <div className="g-miss">
                  {end.missed.map((w) => (
                    <div key={w.h}>
                      <span className="h">{w.h}</span>
                      <span className="p">{w.p}</span>
                      <span className="m">{w.m}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>Tuyệt vời! Bạn không để rơi từ nào. 🎉</p>
            )}
            <div className="g-acts">
              <button
                type="button"
                className="btn pri"
                onClick={() => {
                  setEnd(null);
                  setHud({ level: 1, score: 0, lives: 3, done: 0, paused: false });
                  setRun((r) => r + 1);
                }}
              >
                ↻ Chơi lại
              </button>
              <button type="button" className="btn" onClick={onExit}>
                Đổi bộ từ / nhân vật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- màn chọn ---------- */
export function ShooterGame() {
  const [setId, setSetId] = useState<string | null>(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [opt, setOpt] = useState<Opt>(DEFAULT_OPT);
  const [playing, setPlaying] = useState<{ words: GameWord[]; key: string; label: string } | null>(null);
  const step2 = useRef<HTMLElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpt({ ...DEFAULT_OPT, ...lsGet<Partial<Opt>>("nla_game_opt", {}) });
  }, []);

  const updOpt = (p: Partial<Opt>) => {
    setOpt((o) => {
      const n = { ...o, ...p };
      lsSet("nla_game_opt", n);
      return n;
    });
  };

  const cur = SETS.find((s) => s.id === setId) ?? null;
  const count = useMemo(() => (cur ? toGameWords(cur.groups.slice(from, to + 1)).length : 0), [cur, from, to]);

  const pick = (s: GameSet) => {
    setSetId(s.id);
    setFrom(0);
    setTo(s.groups.length - 1);
    requestAnimationFrame(() => step2.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const start = () => {
    if (!cur) return;
    const words = toGameWords(cur.groups.slice(from, to + 1));
    if (!words.length) return;
    const all = from === 0 && to === cur.groups.length - 1;
    const label = `${cur.title}${all ? " · cả bộ" : ` · nhóm ${from + 1}${to > from ? `–${to + 1}` : ""}`}`;
    audio();
    setPlaying({ words, key: `${cur.id}:${from}-${to}`, label });
  };

  return (
    <div className="g-wrap">
      <section className="g-card">
        <h2>
          <span className="n">1</span>Chọn bộ từ vựng
        </h2>
        <p className="g-hi">
          Chơi miễn phí, không cần đăng nhập. Kỷ lục được lưu trên máy bạn đang dùng.
        </p>
        <h3>🏅 Từ vựng HSK</h3>
        <div className="g-grid hsk">
          {SETS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`g-set${s.id === setId ? " on" : ""}${s.ready ? "" : " lock"}`}
              disabled={!s.ready}
              onClick={() => pick(s)}
            >
              <b>{s.title}</b>
              <span className="zh">{s.zh}</span>
              <span className="lv">{s.tag}</span>
            </button>
          ))}
        </div>
        <div className="g-login">
          <div className="ic">📚</div>
          <p>
            <b>Bộ từ theo giáo trình của lớp</b> (ôn tập từ vựng cuối khóa) sẽ được trung tâm bổ sung khi có hệ thống tài khoản học
            viên.
          </p>
        </div>
      </section>

      {cur && (
        <section className="g-card" ref={step2}>
          <h2>
            <span className="n">2</span>Chọn bài cần ôn
          </h2>
          <p className="g-cur">
            <b>{cur.title}</b> · {cur.groups.length} nhóm · {toGameWords(cur.groups).length} từ
          </p>
          <div className="g-range">
            <label>
              Từ
              <select
                value={from}
                onChange={(e) => {
                  const v = +e.target.value;
                  setFrom(v);
                  if (v > to) setTo(v);
                }}
              >
                {cur.groups.map((g, i) => (
                  <option key={g.id} value={i}>
                    {i + 1}. {g.name} ({g.words.length} từ)
                  </option>
                ))}
              </select>
            </label>
            <label>
              đến
              <select
                value={to}
                onChange={(e) => {
                  const v = +e.target.value;
                  setTo(v);
                  if (v < from) setFrom(v);
                }}
              >
                {cur.groups.map((g, i) => (
                  <option key={g.id} value={i}>
                    {i + 1}. {g.name} ({g.words.length} từ)
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                setFrom(0);
                setTo(cur.groups.length - 1);
              }}
            >
              Cả bộ
            </button>
          </div>
          <p className="g-note">Sẽ ôn {count} từ · mỗi level 10 từ, tốc độ giữ nguyên ở mọi level.</p>
        </section>
      )}

      {cur && (
        <section className="g-card">
          <h2>
            <span className="n">3</span>Chọn nhân vật và súng
          </h2>
          <h3>Nhân vật</h3>
          <div className="g-pick">
            {HEROES.map((h) => (
              <button
                key={h.id}
                type="button"
                className={`g-tile${opt.hero === h.id ? " on" : ""}`}
                aria-pressed={opt.hero === h.id}
                onClick={() => updOpt({ hero: h.id })}
              >
                <HeroIcon id={h.id} />
                <span>{h.name}</span>
              </button>
            ))}
          </div>
          <h3>Súng</h3>
          <div className="g-pick">
            {GUNS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`g-tile${opt.gun === g.id ? " on" : ""}`}
                aria-pressed={opt.gun === g.id}
                onClick={() => {
                  updOpt({ gun: g.id });
                  beep(g.snd[0], g.snd[1], 0.12, 0.06, 0.5);
                }}
              >
                <GunIcon id={g.id} />
                <span>{g.name}</span>
              </button>
            ))}
          </div>
          <div className="g-opts">
            <label>
              <input type="checkbox" checked={opt.mean} onChange={(e) => updOpt({ mean: e.target.checked })} /> Hiện nghĩa tiếng Việt
              dưới chữ
            </label>
            <label>
              <input type="checkbox" checked={opt.speak} onChange={(e) => updOpt({ speak: e.target.checked })} /> Đọc to chữ vừa bắn
            </label>
          </div>
          <div className="g-how">
            <div>
              <b>Cách chơi:</b> gõ đúng <b>phiên âm không dấu</b> của từ đang rơi là <b>bắn ngay</b> – chữ biến mất, ô gõ tự xóa (vd
              学习 → <b>xuexi</b>, 女 → <b>nv</b> hoặc <b>nu</b>). Bàn phím tiếng Việt (Telex) cũng gõ được.
            </div>
            <div>
              <b>Mỗi level 10 từ.</b> Cứ 3,3 giây ra 1 chữ, mỗi chữ rơi trong 10 giây; tốc độ giữ nguyên ở mọi level để luyện hết
              từ. Cứ 3 level được thêm 1 ❤️.
            </div>
            <div>
              <b>3 mạng.</b> Chữ chạm vạch đỏ là mất 1 mạng. Gõ sai thì xóa bớt (⌫) rồi gõ lại, hoặc bấm Enter để xóa cả ô.
            </div>
            <div>
              Hai từ có phần đầu giống nhau (是 shi / 时间 shijian) thì gõ tiếp, hoặc bấm <b>Enter</b> / dấu cách để bắn từ ngắn.
              <b> Esc</b> xóa ô gõ hoặc tạm dừng. Điện thoại: chạm vào màn chơi để hiện bàn phím.
            </div>
          </div>
          <div className="center">
            <button className="btn pri g-start" type="button" onClick={start} disabled={!count}>
              ▶ Bắt đầu chơi
            </button>
          </div>
        </section>
      )}

      {playing && (
        <PlayScreen
          words={playing.words}
          setKey={playing.key}
          label={playing.label}
          opt={opt}
          onExit={() => setPlaying(null)}
        />
      )}
    </div>
  );
}
