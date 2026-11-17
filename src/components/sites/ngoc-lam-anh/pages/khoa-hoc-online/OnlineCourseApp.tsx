"use client";

import { useEffect, useMemo, useState } from "react";
import { BRAND, href } from "../../data";
import { NEEDS_SERVER_MSG, courseList, courseMe, ytId, type CourseMe } from "./api";
import { CAP_LABEL, CAP_ORDER, PRACTICE_TILES, type CapDo, type OnlineLesson } from "./data";
import "./khoa-hoc-online.css";

const PERSON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="4.2" />
    <path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" />
  </svg>
);

function VideoModal({ row, onClose }: { row: OnlineLesson; onClose: () => void }) {
  const vid = ytId(row.yt);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="ko-modal"
      role="dialog"
      aria-modal="true"
      aria-label={row.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ko-box">
        <div className="ko-vhead">
          <b>{row.title}</b>
          <button type="button" onClick={onClose}>
            ✕ Đóng
          </button>
        </div>
        <div className="ko-ratio">
          {vid ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1`}
              title={row.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="ko-novid">
              <span className="ko-novid-ic" aria-hidden="true">
                ▶
              </span>
              <b>[Video bài giảng]</b>
              <small>Đang cập nhật</small>
            </div>
          )}
        </div>
        <div className="ko-mbody">
          <div className="ko-bar">
            <i style={{ width: "0%" }} />
          </div>
          <div className="ko-mnote">
            {vid
              ? "Đã xem 0%. Xem hết video (đến cuối) để mở các mục luyện tập. Chỉ được bấm dừng, không tua nhanh."
              : "Video của bài này đang cập nhật. Khi có video, xem hết video để mở các mục luyện tập."}
          </div>
          <div className="ko-tiles">
            {PRACTICE_TILES.map((t) => (
              <button type="button" className="ko-tile lock" disabled key={t.k}>
                <span>🔒 {t.title}</span>
                <small>Xem hết video để mở</small>
              </button>
            ))}
          </div>
          <div className="ko-hist">
            <b>Lịch sử xem:</b> chưa có. <span>{NEEDS_SERVER_MSG}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnlineCourseApp() {
  const [me, setMe] = useState<CourseMe | null>(null);
  const [rows, setRows] = useState<OnlineLesson[]>([]);
  const [cap, setCap] = useState<"" | CapDo>("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<OnlineLesson | null>(null);

  useEffect(() => {
    let alive = true;
    courseMe().then((m) => alive && setMe(m));
    courseList().then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    return rows.filter((x) => (!cap || x.capDo === cap) && (!t || `${x.giaoTrinh} ${x.title}`.toLowerCase().includes(t)));
  }, [rows, cap, q]);

  const byGt = useMemo(() => {
    const m = new Map<string, OnlineLesson[]>();
    filtered.forEach((x) => m.set(x.giaoTrinh, [...(m.get(x.giaoTrinh) ?? []), x]));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const loggedIn = me?.ok === true;

  return (
    <div className="pg-khoa-hoc-online">
      <header className="ko-header">
        <span className="ko-han">{BRAND.zh}</span>
        <h1>Khóa học online</h1>
        <span className="ko-spacer" />
        {loggedIn && (
          <>
            <span className="ko-av big">{PERSON}</span>
            <span className="ko-who">Xin chào, {me.name}</span>
          </>
        )}
        <a className="ko-home" href={href("tai-lieu.html")}>
          ← Tài liệu
        </a>
      </header>

      <div className="ko-wrap">
        {me && !me.ok && (
          <div className="ko-gate">
            <h2>Khóa học online</h2>
            <p>Bạn cần đăng nhập để xem khóa học.</p>
            <p className="ko-gate-note">{me.err}</p>
            <a className="ko-btn" href={href("dang-nhap.html?next=khoa-hoc-online.html")}>
              Đăng nhập
            </a>
          </div>
        )}

        <div className="ko-note">
          Xem trước cấu trúc khóa học: video bài giảng theo giáo trình và cấp độ HSK. Danh sách bài đang cập nhật. Xem hết video mới mở được
          các mục luyện tập.
        </div>

        <div className="ko-toolbar">
          <select value={cap} onChange={(e) => setCap(e.target.value as "" | CapDo)} aria-label="Lọc theo cấp độ">
            <option value="">Tất cả cấp độ</option>
            {CAP_ORDER.map((c) => (
              <option value={c} key={c}>
                {CAP_LABEL[c]}
              </option>
            ))}
          </select>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm giáo trình / tên bài…" aria-label="Tìm bài" />
          <span className="ko-spacer" />
          <span className="ko-count">{filtered.length} video</span>
        </div>

        {byGt.length === 0 ? (
          <div className="ko-empty">Chưa có video nào cho cấp độ này.</div>
        ) : (
          byGt.map(([gt, items]) => (
            <div className="ko-course" key={gt}>
              <div className="ko-gt-head">
                <span>📘 {gt}</span>
                <span className="ko-gt-count">{items.length} video</span>
              </div>
              {CAP_ORDER.filter((c) => items.some((x) => x.capDo === c)).map((c) => {
                const ls = items.filter((x) => x.capDo === c).sort((a, b) => a.baiNo - b.baiNo || a.id - b.id);
                return (
                  <div className="ko-level" key={c}>
                    <div className="ko-lv-head">
                      <span className="ko-badge">{CAP_LABEL[c]}</span>
                      <span className="ko-lv-n">{ls.length} bài</span>
                    </div>
                    <div className="ko-lessons">
                      {ls.map((x) => (
                        <div className="ko-lesson" key={x.id}>
                          <div className="ko-idx">{x.baiNo || "•"}</div>
                          <div className="ko-ti">
                            <b>{x.title}</b>
                            <small>
                              {gt} · {CAP_LABEL[c]}
                              {ytId(x.yt) ? "" : " · Đang cập nhật"}
                            </small>
                            <div className="ko-prog none">Chưa xem</div>
                          </div>
                          <div className="ko-act">
                            <button type="button" className="ko-play" onClick={() => setOpen(x)}>
                              ▶ Xem bài giảng
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {open && <VideoModal row={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
