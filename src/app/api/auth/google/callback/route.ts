import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { audit } from "@/lib/admin/audit";
import { cfEnv } from "@/lib/admin/env";
import { OAUTH_STATE_COOKIE, exchangeCode } from "@/lib/admin/google";
import { LOGIN_PATH, createSession, findOrBootstrapUser } from "@/lib/admin/session";

/** Google gọi lại sau khi người dùng chọn tài khoản. */
export async function GET(req: NextRequest) {
  const fail = (code: string) => NextResponse.redirect(new URL(`${LOGIN_PATH}?loi=${code}`, req.nextUrl));
  const store = await cookies();
  const expected = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete({ name: OAUTH_STATE_COOKIE, path: "/api/auth/google" });

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (req.nextUrl.searchParams.get("error")) return fail("huy");
  if (!code || !state || !expected || state !== expected) return fail("phien-het-han");

  const env = await cfEnv();
  try {
    const redirectUri = new URL("/api/auth/google/callback", req.nextUrl.origin).toString();
    const profile = await exchangeCode(code, env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);
    if (!profile.email || !profile.emailVerified) return fail("email-chua-xac-minh");
    const r = await findOrBootstrapUser(profile.email, { name: profile.name, avatar: profile.picture }, env.ADMIN_EMAILS ?? "");
    if ("error" in r) {
      await audit(null, "login.denied", profile.email, r.error);
      return fail(r.error === "locked" ? "bi-khoa" : "khong-co-tai-khoan");
    }
    await createSession(r.user.id);
    await audit(r.user.id, "login", r.user.email);
    return NextResponse.redirect(new URL("/quan-tri", req.nextUrl));
  } catch {
    return fail("google");
  }
}
