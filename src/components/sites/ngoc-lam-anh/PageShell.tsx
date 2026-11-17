import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, TopBar } from "./SiteHeader";

/**
 * Khung chung của mọi trang có header/footer (giống trang mẫu):
 * thanh trên + header + <main> + hoa văn + footer + nút Gọi/Zalo.
 * `active` = slug của trang để tô sáng mục menu (vd "thi-thu"; trang chủ dùng "").
 */
export function PageShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <>
      <TopBar />
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

/** Dải tiêu đề đỏ đầu trang: chữ Hán nhỏ + H1 + mô tả */
export function PageHead({ zh, title, intro, children }: { zh?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="wrap">
        {zh && <div className="zh">{zh}</div>}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {children}
      </div>
    </div>
  );
}
