"use client";

import { useEffect, type ReactNode } from "react";

export type ViewerState = {
  title: string;
  /** Đường dẫn tệp xem được ngay (ví dụ PDF trong /public). Không có → hiện `notice`. */
  url?: string | null;
  notice?: ReactNode;
  newTab?: boolean;
};

/**
 * Khung xem toàn màn hình giống `HD.open` của trang mẫu (#hdview trong site.css):
 * thanh tiêu đề đỏ + nút "Mở tab mới" + "Đóng ✕", nội dung là iframe hoặc thông báo.
 */
export function HdViewer({ view, onClose }: { view: ViewerState | null; onClose: () => void }) {
  useEffect(() => {
    if (!view) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [view, onClose]);

  if (!view) return null;
  return (
    <div id="hdview" className="on" role="dialog" aria-modal="true" aria-label={view.title}>
      <div className="hv-bar">
        <b className="hv-t">{view.title}</b>
        {view.url && view.newTab !== false && (
          <a className="hv-n btn sm ghost" target="_blank" rel="noopener" href={view.url}>
            Mở tab mới ↗
          </a>
        )}
        <button className="btn sm gold hv-x" type="button" onClick={onClose} autoFocus>
          Đóng ✕
        </button>
      </div>
      {view.url ? (
        <iframe className="hv-f" src={view.url} title={view.title} allow="autoplay; fullscreen" />
      ) : (
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 20, background: "var(--cream)" }}>
          <div className="infobox" style={{ maxWidth: 560, textAlign: "center", margin: 0 }}>
            <div style={{ fontSize: 36 }}>🔒</div>
            {view.notice}
          </div>
        </div>
      )}
    </div>
  );
}
