"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CALL_HREF, CONTACT, PHONE_LABEL, ZALO_HREF } from "../../data";
import "./handoff.css";

/** Sao chép chữ vào bộ nhớ tạm; trả về true nếu chép được. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // thử cách dự phòng bên dưới
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Ghép các dòng "Nhãn: giá trị", bỏ dòng trống. */
export function buildSummary(title: string, rows: Array<[string, string | undefined]>): string {
  const lines = rows.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${(v ?? "").trim()}`);
  return [title, ...lines].join("\n");
}

const HAS_ZALO = Boolean(CONTACT.zalo || CONTACT.phone);
const HAS_PHONE = Boolean(CONTACT.phone);

/**
 * Bước "gửi cho trung tâm" khi chưa có máy chủ: hiện nội dung đã soạn,
 * bấm nút thì chép nội dung rồi mở Zalo / gọi điện. Không báo "gửi thành công".
 */
export function Handoff({
  heading,
  text,
  onEdit,
  onCopied,
  extra,
}: {
  heading: string;
  text: string;
  onEdit: () => void;
  onCopied?: () => void;
  extra?: ReactNode;
}) {
  const [status, setStatus] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  async function doCopy(then: string) {
    const ok = await copyText(text);
    setStatus(ok ? `Đã chép nội dung. ${then}` : "Trình duyệt không cho chép tự động – bạn hãy bôi đen nội dung ở trên để chép.");
    if (ok) onCopied?.();
  }

  return (
    <div ref={boxRef} className="handoff" role="region" aria-label={heading}>
      <div className="handoff-note">
        <b className="handoff-title">{heading}</b>
        <p>
          Website chưa kết nối máy chủ nên <b>thông tin chưa được gửi tự động</b> tới trung tâm. Bạn bấm một nút bên dưới:
          nội dung sẽ được chép sẵn, chỉ cần dán vào tin nhắn{HAS_PHONE ? " hoặc đọc khi gọi" : ""}.
        </p>
      </div>
      <pre className="handoff-text" tabIndex={0}>
        {text}
      </pre>
      {extra}
      <div className="handoff-actions">
        <a
          className="btn pri"
          href={ZALO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => void doCopy(HAS_ZALO ? "Dán vào khung chat Zalo để gửi." : "Dán vào tin nhắn Facebook để gửi.")}
        >
          💬 {HAS_ZALO ? "Chép & nhắn Zalo" : "Chép & nhắn qua Facebook"}
        </a>
        {HAS_PHONE && (
          <a className="btn" href={CALL_HREF} onClick={() => void doCopy("Đang mở cuộc gọi.")}>
            ☎ Chép & gọi {PHONE_LABEL}
          </a>
        )}
        <button type="button" className="btn" onClick={() => void doCopy("Bạn có thể dán vào bất kỳ kênh liên hệ nào.")}>
          📋 Chỉ chép nội dung
        </button>
        <button type="button" className="btn light-ghost" onClick={onEdit}>
          ← Sửa lại thông tin
        </button>
      </div>
      <p className="handoff-status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
