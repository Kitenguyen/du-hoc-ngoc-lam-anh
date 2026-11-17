// Lớp gọi máy chủ cho đăng nhập. Hiện CHƯA có máy chủ → login() trả { ok: false, reason: "no-server" }.
// Khi có backend: đặt NEXT_PUBLIC_NLA_API và làm endpoint POST <API>/login
// nhận { username, password }, đặt cookie phiên, trả { ok: true, user: { name, role } } hoặc { ok: false, error }.
import { href } from "../../data";

export type User = { name: string; role: string };
export type LoginResult = { ok: true; user: User; redirect: string } | { ok: false; reason: "no-server" | "error"; message: string };

export const API_BASE = process.env.NEXT_PUBLIC_NLA_API ?? "";

export const NO_SERVER_MESSAGE =
  "Đăng nhập cần kết nối máy chủ – trung tâm sẽ bật tính năng này sau. Hiện bạn vẫn dùng được các trang luyện tập, thi thử và từ vựng mà không cần đăng nhập.";

/**
 * Trang chuyển tới sau khi đăng nhập. Chỉ nhận tên trang nội bộ dạng "tai-lieu", "tai-lieu.html",
 * "thi-thu.html#hskk" (giống trang mẫu) — chặn chuyển hướng ra ngoài.
 */
export function safeNext(next: string | undefined): string {
  if (next && /^[a-z0-9-]+(\.(html|php))?([?#][\w=&#.-]*)?$/i.test(next)) return href(next);
  // Trang mẫu đưa quản trị viên tới khu quản trị; dự án này chưa có nên mọi vai trò về Tài liệu.
  return href("tai-lieu.html");
}

export async function login(username: string, password: string, next?: string): Promise<LoginResult> {
  if (!API_BASE) return { ok: false, reason: "no-server", message: NO_SERVER_MESSAGE };
  try {
    const r = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const j = (await r.json()) as { ok?: boolean; error?: string; user?: User };
    if (j.ok && j.user) return { ok: true, user: j.user, redirect: safeNext(next) };
    return { ok: false, reason: "error", message: j.error || "Sai tên đăng nhập hoặc mật khẩu." };
  } catch {
    return { ok: false, reason: "error", message: "Lỗi kết nối, chưa đăng nhập được." };
  }
}
