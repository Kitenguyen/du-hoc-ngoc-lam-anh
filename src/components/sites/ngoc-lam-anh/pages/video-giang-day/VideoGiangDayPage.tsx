"use client";

import { useRef, useState, type FormEvent } from "react";
import { PageHead, PageShell } from "../../PageShell";
import { callServer } from "../tai-lieu/api";
import { LEVEL_NAMES, VIDEO_BOOKS, type VideoBook } from "./data";
import "./video-giang-day.css";

type Playing = { book: VideoBook; k: number };

function readMax(key: string): number {
  try {
    return Number(window.localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}
function saveMax(key: string, v: number) {
  try {
    window.localStorage.setItem(key, String(Math.floor(v)));
  } catch {
    // bỏ qua
  }
}

function Gate() {
  const [mode, setMode] = useState<"hv" | "gv">("hv");
  const [msg, setMsg] = useState<{ text: string; err: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const levels = [...new Set(VIDEO_BOOKS.map((b) => b.lv))];
  const anyOpen = VIDEO_BOOKS.some((b) => b.open);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d: Record<string, string> = { mode };
    new FormData(e.currentTarget).forEach((v, k) => {
      d[k] = String(v).trim();
    });
    setBusy(true);
    setMsg({ text: "Đang kiểm tra…", err: false });
    const r = await callServer("video-open", d);
    setMsg({ text: r.message, err: true });
    setBusy(false);
  };

  return (
    <div className="vd-gate">
      <h2>🎬 Mở video giảng dạy</h2>
      <p className="muted">{anyOpen ? "Mở thêm giáo trình khác." : "Nhập đúng thông tin để xem video bài giảng."}</p>
      <div className="vd-tabs">
        {(
          [
            ["hv", "Học viên"],
            ["gv", "Giáo viên"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            className={mode === m ? "on" : ""}
            onClick={() => {
              setMode(m);
              setMsg(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <form className="vd-f" onSubmit={onSubmit} autoComplete="on" key={mode}>
        {mode === "hv" ? (
          <>
            <label>
              Họ và tên (đầy đủ, có dấu, như khi đăng ký học)
              <input name="name" required maxLength={80} autoComplete="name" placeholder="Ví dụ: NGUYỄN VĂN A" />
            </label>
            <label>
              Giáo trình đang học
              <select name="book" required defaultValue="">
                <option value="">— Chọn giáo trình —</option>
                {VIDEO_BOOKS.map((b) => (
                  <option value={b.id} key={b.id}>
                    {b.vi} · {b.zh}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <>
            <label>
              Tên giáo viên
              <input name="name" required maxLength={80} placeholder="Ví dụ: Cô Lan, Thầy Minh" />
            </label>
            <label>
              Cấp độ đăng ký dạy
              <select name="level" required defaultValue="">
                <option value="">— Chọn cấp độ —</option>
                {levels.map((l) => (
                  <option value={l} key={l}>
                    {LEVEL_NAMES[l]} ·{" "}
                    {VIDEO_BOOKS.filter((b) => b.lv === l)
                      .map((b) => b.vi)
                      .join(", ")}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <button className="btn pri" type="submit" disabled={busy}>
          Mở video
        </button>
        <div className={`vd-msg${msg?.err ? " err" : ""}`} role="status">
          {msg?.text}
        </div>
      </form>
    </div>
  );
}

export function VideoGiangDayPage() {
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [noFF, setNoFF] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const track = useRef({ key: "", max: 0, last: 0 });
  const noffTimer = useRef<number | undefined>(undefined);
  const allOpen = VIDEO_BOOKS.every((b) => b.open);
  const openBooks = VIDEO_BOOKS.filter((b) => b.open);

  const play = (book: VideoBook, k: number) => {
    setPlaying({ book, k });
    requestAnimationFrame(() => {
      const el = playRef.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
      videoRef.current?.play().catch(() => {});
    });
  };
  const stop = () => {
    const v = videoRef.current;
    if (v) v.pause();
    setPlaying(null);
  };

  const cur = playing ? playing.book.lessons[playing.k] : null;

  // Học viên chỉ xem / tạm dừng / xem lại phần đã xem — không tua nhanh, không tăng tốc (như trang mẫu)
  const onMeta = () => {
    const v = videoRef.current;
    if (!v || !cur?.src) return;
    const key = `nla_vid:${cur.src}`;
    const m = readMax(key);
    track.current = { key, max: m, last: 0 };
    if (m > 5 && m < v.duration - 3) {
      v.currentTime = m;
      track.current.last = m;
    }
  };
  const onTime = () => {
    const v = videoRef.current;
    if (!v || v.seeking) return;
    const t = v.currentTime;
    const tr = track.current;
    if (t - tr.last <= 1.5 && t > tr.max) {
      tr.max = t;
      if (Math.round(t) % 5 === 0) saveMax(tr.key, tr.max);
    }
    tr.last = t;
  };
  const onSeeking = () => {
    const v = videoRef.current;
    const tr = track.current;
    if (!v || v.currentTime <= tr.max + 1) return;
    v.currentTime = tr.max;
    tr.last = tr.max;
    setNoFF(true);
    window.clearTimeout(noffTimer.current);
    noffTimer.current = window.setTimeout(() => setNoFF(false), 2200);
  };

  return (
    <PageShell active="video-giang-day">
      <div className="pg-video-giang-day">
        <PageHead
          zh="教学视频"
          title="Video giảng dạy"
          intro="Video bài giảng theo từng bài của giáo trình, do giáo viên Trung tâm Tiếng Trung Ngọc Lâm Anh giảng. Dành riêng cho học viên và giáo viên của trung tâm."
        />
        <section className="block light" style={{ paddingTop: 18 }}>
          <div className="wrap">
            {!allOpen && <Gate />}
            {openBooks.length > 0 && (
              <div className="vd-who">
                <span>✔ Đã mở: {openBooks.map((b) => b.vi).join(", ")}</span>
              </div>
            )}
            <div className="vd-play" ref={playRef} hidden={!cur}>
              <div className="vd-ph">
                <div>
                  <b>{cur ? `${cur.n ? `第${cur.n}课 ` : ""}${cur.zh}` : ""}</b>
                  <span className="muted">
                    {cur && playing ? ` · ${playing.book.vi}${cur.n ? ` · Bài ${cur.n}` : ""}: ${cur.vi}` : ""}
                  </span>
                </div>
                <button type="button" className="btn sm" onClick={stop}>
                  Đóng ✕
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <video
                  ref={videoRef}
                  src={cur?.src}
                  controls
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  onLoadedMetadata={onMeta}
                  onTimeUpdate={onTime}
                  onSeeking={onSeeking}
                  onRateChange={(e) => {
                    if (e.currentTarget.playbackRate !== 1) e.currentTarget.playbackRate = 1;
                  }}
                  onEnded={(e) => saveMax(track.current.key, e.currentTarget.duration)}
                />
                {noFF && <div className="vd-noff">⏩ Không tua nhanh được — học viên xem lần lượt hết video.</div>}
              </div>
            </div>
            <div id="vlist">
              {VIDEO_BOOKS.map((b) => {
                const ok = !!b.open;
                return (
                  <div className="vd-bk" key={b.id}>
                    <div className="vd-bh">
                      <span className="zh">{b.zh}</span>
                      <h2>{b.vi}</h2>
                      <span className="muted">
                        {b.lessons.length} video{b.teacher ? ` · ${b.teacher}` : ""}
                      </span>
                    </div>
                    <div className="vd-ls">
                      {b.lessons.map((l, k) => {
                        const can = ok && !!l.src;
                        const on = playing?.book.id === b.id && playing.k === k;
                        return (
                          <button
                            key={k}
                            type="button"
                            className={`vd-l${can ? "" : " lock"}${on ? " on" : ""}`}
                            disabled={!can}
                            onClick={() => play(b, k)}
                          >
                            <span className="vd-n">{can ? (l.n ?? "🎥") : "🔒"}</span>
                            <span className="vd-t">
                              <b>
                                {l.n ? `第${l.n}课 ` : ""}
                                {l.zh}
                              </b>
                              <span>
                                Bài {l.n}: {l.vi}
                              </span>
                              <small>
                                {l.dur}
                                {l.teacher ? ` · GV ${l.teacher}` : ""}
                                {!ok ? " · cần mở video" : !l.src ? " · video đang cập nhật" : ""}
                              </small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
