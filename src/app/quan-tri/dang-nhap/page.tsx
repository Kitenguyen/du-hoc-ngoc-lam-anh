import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DevLoginForm } from "@/components/admin/DevLoginForm";
import { BRAND } from "@/components/sites/ngoc-lam-anh/data";
import { devLoginEnabled } from "@/lib/admin/env";
import { getCurrentUser } from "@/lib/admin/session";
import "../admin.css";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị · Du học Ngọc Lâm Anh",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  "chua-cau-hinh": "Đăng nhập Google chưa được cấu hình (thiếu GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).",
  "khong-co-tai-khoan": "Email Google này chưa được cấp quyền vào dashboard. Hãy nhờ admin thêm email của bạn.",
  "bi-khoa": "Tài khoản của bạn đã bị khóa. Liên hệ admin để mở lại.",
  "email-chua-xac-minh": "Email Google chưa được xác minh.",
  "phien-het-han": "Phiên đăng nhập đã hết hạn, vui lòng thử lại.",
  huy: "Bạn đã hủy đăng nhập Google.",
  google: "Không đăng nhập được với Google, vui lòng thử lại.",
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (await getCurrentUser()) redirect("/quan-tri");
  const { loi } = await searchParams;
  const err = typeof loi === "string" ? ERRORS[loi] : undefined;
  const dev = await devLoginEnabled();
  return (
    <div className="adm-login">
      <div className="box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND.logoMark} alt="" />
        <h1>Quản trị website</h1>
        <p>{BRAND.fullName}</p>
        {err && (
          <div className="err" role="alert">
            {err}
          </div>
        )}
        {/* Route Handler chuyển hướng sang Google – dùng thẻ a để tải lại toàn trang */}
        <a className="g-btn" href="/api/auth/google">
          <GoogleIcon /> Đăng nhập với Google
        </a>
        <small style={{ marginTop: 12 }}>Chỉ email đã được admin cấp quyền mới vào được.</small>
        {dev && <DevLoginForm />}
        <Link className="back" href="/">
          ← Về trang web
        </Link>
      </div>
    </div>
  );
}
