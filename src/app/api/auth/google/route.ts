import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { cfEnv } from "@/lib/admin/env";
import { OAUTH_STATE_COOKIE, googleAuthUrl } from "@/lib/admin/google";
import { LOGIN_PATH } from "@/lib/admin/session";

/** Bắt đầu đăng nhập Google: chuyển sang trang chọn tài khoản của Google. */
export async function GET(req: NextRequest) {
  const env = await cfEnv();
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?loi=chua-cau-hinh`, req.nextUrl));
  }
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  const state = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  (await cookies()).set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 600,
  });
  const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
  return NextResponse.redirect(googleAuthUrl(env.GOOGLE_CLIENT_ID, redirectUri, state));
}
