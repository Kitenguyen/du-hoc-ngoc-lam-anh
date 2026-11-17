import "server-only";
import { db } from "./env";
import { parsePerms, type Perms, type Role } from "./perms";

export type UserRecord = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: Role;
  perms: Perms;
  active: boolean;
  created_at: string;
  last_login: string | null;
};

type Row = Omit<UserRecord, "perms" | "active"> & { perms: string; active: number };

const toUser = (r: Row): UserRecord => ({ ...r, perms: parsePerms(r.perms), active: !!r.active });

export async function listUsers(): Promise<UserRecord[]> {
  const { results } = await (await db())
    .prepare("SELECT id, email, name, avatar, role, perms, active, created_at, last_login FROM users ORDER BY role, name, email")
    .all<Row>();
  return results.map(toUser);
}

export async function getUser(id: number): Promise<UserRecord | null> {
  const r = await (await db()).prepare("SELECT id, email, name, avatar, role, perms, active, created_at, last_login FROM users WHERE id = ?").bind(id).first<Row>();
  return r ? toUser(r) : null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createUser(input: { email: string; name: string; role: Role; perms: Perms }): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, error: "Email chưa đúng định dạng." };
  const d = await db();
  const exists = await d.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return { ok: false, error: "Email này đã có tài khoản." };
  await d
    .prepare("INSERT INTO users (email, name, role, perms) VALUES (?, ?, ?, ?)")
    .bind(email, input.name.trim().slice(0, 80), input.role, JSON.stringify(input.perms))
    .run();
  return { ok: true };
}

async function adminCount(exceptId: number): Promise<number> {
  const r = await (await db()).prepare("SELECT COUNT(*) AS n FROM users WHERE role='admin' AND active=1 AND id != ?").bind(exceptId).first<{ n: number }>();
  return r?.n ?? 0;
}

export async function updateUser(
  actorId: number,
  id: number,
  patch: { name: string; role: Role; perms: Perms; active: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const target = await getUser(id);
  if (!target) return { ok: false, error: "Không tìm thấy tài khoản." };
  const losingAdmin = target.role === "admin" && target.active && (patch.role !== "admin" || !patch.active);
  if (losingAdmin && (await adminCount(id)) === 0) return { ok: false, error: "Phải còn ít nhất một admin đang hoạt động." };
  if (id === actorId && !patch.active) return { ok: false, error: "Bạn không thể tự khóa tài khoản của mình." };
  const d = await db();
  await d.batch([
    d.prepare("UPDATE users SET name=?, role=?, perms=?, active=? WHERE id=?").bind(patch.name.trim().slice(0, 80), patch.role, JSON.stringify(patch.perms), patch.active ? 1 : 0, id),
    // Khóa tài khoản → đăng xuất mọi phiên
    ...(patch.active ? [] : [d.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id)]),
  ]);
  return { ok: true };
}

export async function deleteUser(actorId: number, id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  if (id === actorId) return { ok: false, error: "Bạn không thể tự xóa tài khoản của mình." };
  const target = await getUser(id);
  if (!target) return { ok: false, error: "Không tìm thấy tài khoản." };
  if (target.role === "admin" && (await adminCount(id)) === 0) return { ok: false, error: "Phải còn ít nhất một admin." };
  await (await db()).prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return { ok: true };
}
