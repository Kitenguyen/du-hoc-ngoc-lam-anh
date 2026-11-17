"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { logoutAction } from "@/app/quan-tri/actions";

export type NavEntry = { href: string; label: string; ic: string; count?: number };

export function AdminShell({
  nav,
  user,
  logo,
  children,
}: {
  nav: NavEntry[];
  user: { name: string; email: string; avatar: string | null; roleLabel: string };
  logo: string;
  children: ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  // Đóng menu điện thoại khi chuyển trang
  // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ trạng thái menu với đường dẫn
  useEffect(() => setOpen(false), [path]);

  const isOn = (href: string) => (href === "/quan-tri" ? path === href : path.startsWith(href));

  return (
    <div className={`adm${open ? " nav-open" : ""}`}>
      <aside className="side" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <Link className="logo" href="/quan-tri">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" />
          <span>
            <b>NGỌC LÂM ANH</b>
            <small>Quản trị website</small>
          </span>
        </Link>
        <nav>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={isOn(n.href) ? "on" : undefined}>
              <span className="ic" aria-hidden="true">
                {n.ic}
              </span>
              {n.label}
              {n.count ? <span className="count">{n.count}</span> : null}
            </Link>
          ))}
        </nav>
        <a className="site-link" href="/" target="_blank" rel="noopener">
          ↗ Xem trang web
        </a>
        <div className="who">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="av">{user.name.charAt(0).toUpperCase()}</span>
          )}
          <span style={{ minWidth: 0 }}>
            <b>{user.name}</b>
            {user.roleLabel}
          </span>
          <form action={logoutAction}>
            <button type="submit" title="Đăng xuất">
              Thoát
            </button>
          </form>
        </div>
      </aside>
      <div className="main">
        <button type="button" className="btn sec sm menu-toggle" onClick={() => setOpen(true)} style={{ marginBottom: 12 }}>
          ☰ Menu
        </button>
        {children}
      </div>
    </div>
  );
}
