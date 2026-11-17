"use client";

import { useEffect, useState } from "react";
import { BRAND, href } from "../../data";
import { SERVER_NOTICE } from "../tai-lieu/api";
import { DOCS, type VocabDoc } from "./data";
import "./tu-vung-chuyen-nganh.css";

export function TuVungChuyenNganhPage() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<VocabDoc | null>(null);

  useEffect(() => {
    if (!view) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [view]);

  const needle = q.toLowerCase().trim();
  const rows = DOCS.filter((d) => !needle || d.title.toLowerCase().includes(needle));

  return (
    <div className="pg-tu-vung-chuyen-nganh">
      <header>
        <span className="han">{BRAND.zh}</span>
        <h1>Từ vựng chuyên ngành (PDF)</h1>
        <span className="sp" />
        <span className="who">Khách</span>
        <a className="home" href={href("tai-lieu.html")}>
          ← Tài liệu
        </a>
      </header>
      <div className="x-wrap">
        <div className="note">
          Bộ từ vựng chuyên ngành dạng PDF (Chữ Hán · Phiên âm · Nghĩa tiếng Việt) dành cho học viên của trung tâm. Bạn có
          thể <b>xem trực tuyến</b> các tài liệu đã đăng. Danh mục đang được trung tâm cập nhật.
        </div>
        <div className="toolbar">
          <input placeholder="Tìm chủ đề / tên tài liệu…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm tài liệu" />
          <span className="count">{rows.length} tài liệu</span>
        </div>
        <div className="x-grid">
          {rows.map((d) => (
            <div className="x-card" key={d.title}>
              <div className="t">{d.title}</div>
              <div className="m">{d.count ? `${d.count.toLocaleString("vi-VN")} từ` : "Đang cập nhật"}</div>
              <div className="row">
                <button className="x-btn view" type="button" onClick={() => setView(d)}>
                  👁 Xem
                </button>
                {d.file && d.download && (
                  <a className="x-btn dl" href={d.file} download>
                    ⬇ Tải PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {!rows.length && <div className="empty">Không tìm thấy tài liệu phù hợp.</div>}
      </div>

      <div
        className={`modal${view ? " on" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setView(null);
        }}
      >
        {view && (
          <div className="box" role="dialog" aria-modal="true" aria-label={view.title}>
            <div className="bar">
              <span className="ti">{view.title}</span>
              {view.file && view.download && (
                <a className="x-btn dl" href={view.file} target="_blank" rel="noopener">
                  ⬇ Tải PDF
                </a>
              )}
              <button className="x" type="button" onClick={() => setView(null)}>
                Đóng ✕
              </button>
            </div>
            {view.file ? (
              <iframe src={`${view.file}${view.download ? "" : "#toolbar=0&navpanes=0"}`} title={view.title} />
            ) : (
              <div className="tv-empty">
                <div style={{ fontSize: 36 }}>📄</div>
                <p>
                  <b>Tài liệu này đang được cập nhật.</b>
                </p>
                <p>Tài liệu dành cho học viên cần đăng nhập để xem. {SERVER_NOTICE}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
