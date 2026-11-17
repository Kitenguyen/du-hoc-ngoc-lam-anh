import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, nowIso } from "./env";
import { can, parsePerms, type Perm, type Role, type SessionUser } from "./perms";

export const SESSION_COOKIE = "nla_admin";
const SESSION_DAYS = 14;
export const LOGIN_PATH = "/quan-tri/dang-nhap";

function randomToken(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export async function sha256(text: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(d), (x) => x.toString(16).padStart(2, "0")).join("");
}

type UserRow = { id: number; email: string; name: string; avatar: string | null; role: Role; perms: string; active: number };

function toSessionUser(r: UserRow): SessionUser {
  return { id: r.id, email: r.email, name: r.name || r.email, avatar: r.avatar, role: r.role, perms: parsePerms(r.perms) };
}

/** Tạo phiên đăng nhập và đặt cookie (gọi trong Route Handler / Server Action). */
export async function createSession(userId: number): Promise<void> {
  const token = randomToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  const d = await db();
  await d.batch([
    d.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(await sha256(token), userId, expires.toISOString()),
    d.prepare("UPDATE users SET last_login = ? WHERE id = ?").bind(nowIso(), userId),
    d.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(nowIso()),
  ]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await (await db()).prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  store.delete(SESSION_COOKIE);
}

/** Người dùng đang đăng nhập (null nếu chưa đăng nhập, hết hạn hoặc bị khóa). Dùng chung trong một request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await (await db())
    .prepare(
      `SELECT u.id, u.email, u.name, u.avatar, u.role, u.perms, u.active
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(await sha256(token), nowIso())
    .first<UserRow>();
  if (!row || !row.active) return null;
  return toSessionUser(row);
});

/** Bắt buộc đăng nhập (và có quyền `perm` nếu truyền vào); nếu không thì chuyển hướng. */
export async function requireUser(perm?: Perm): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  if (perm && !can(user, perm)) redirect("/quan-tri?loi=khong-co-quyen");
  return user;
}

/**
 * Tìm tài khoản theo email sau khi Google xác thực.
 * Email nằm trong ADMIN_EMAILS mà chưa có tài khoản → tự tạo admin (lần đầu dựng hệ thống).
 */
export async function findOrBootstrapUser(
  email: string,
  profile: { name?: string; avatar?: string },
  adminEmails: string,
): Promise<{ user: SessionUser } | { error: "not-allowed" | "locked" }> {
  const d = await db();
  let row = await d.prepare("SELECT id, email, name, avatar, role, perms, active FROM users WHERE email = ?").bind(email).first<UserRow>();
  const admins = adminEmails
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!row && admins.includes(email.toLowerCase())) {
    row = await d
      .prepare("INSERT INTO users (email, name, avatar, role, perms) VALUES (?, ?, ?, 'admin', '{}') RETURNING id, email, name, avatar, role, perms, active")
      .bind(email, profile.name ?? "", profile.avatar ?? null)
      .first<UserRow>();
  }
  if (!row) return { error: "not-allowed" };
  if (!row.active) return { error: "locked" };
  if ((profile.name && !row.name) || (profile.avatar && profile.avatar !== row.avatar)) {
    await d
      .prepare("UPDATE users SET name = CASE WHEN name = '' THEN ? ELSE name END, avatar = ? WHERE id = ?")
      .bind(profile.name ?? "", profile.avatar ?? row.avatar, row.id)
      .run();
  }
  return { user: toSessionUser(row) };
}
