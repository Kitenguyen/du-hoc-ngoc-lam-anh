import "server-only";
import { db, nowIso } from "./env";

export type LeadStatus = "new" | "contacted" | "enrolled" | "closed";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  enrolled: "Đã đăng ký học",
  closed: "Không tiếp tục",
};

export type Lead = {
  id: number;
  full_name: string;
  phone: string;
  birth: string;
  address: string;
  course: string;
  shift: string;
  branch: string;
  note: string;
  source: string;
  status: LeadStatus;
  assignee_id: number | null;
  assignee_name?: string | null;
  staff_note: string;
  created_at: string;
  updated_at: string;
};

export type LeadInput = Pick<Lead, "full_name" | "phone" | "birth" | "address" | "course" | "shift" | "branch" | "note" | "source">;

const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

/** Lưu đăng ký từ form công khai (giới hạn 5 lần/giờ cho mỗi IP). */
export async function createLead(input: Partial<LeadInput>, ip: string): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const full_name = clip(input.full_name, 120);
  const phone = clip(input.phone, 30);
  if (!full_name) return { ok: false, error: "Vui lòng nhập họ tên." };
  if (!/^[+\d][\d\s.-]{7,}$/.test(phone)) return { ok: false, error: "Số điện thoại chưa đúng." };
  const d = await db();
  const hour = new Date(Date.now() - 3600e3).toISOString();
  const recent = await d.prepare("SELECT COUNT(*) AS n FROM leads WHERE ip = ? AND created_at > ?").bind(ip, hour).first<{ n: number }>();
  if ((recent?.n ?? 0) >= 5) return { ok: false, error: "Bạn đã gửi nhiều lần, vui lòng gọi hoặc nhắn Zalo cho trung tâm." };
  const row = await d
    .prepare(
      `INSERT INTO leads (full_name, phone, birth, address, course, shift, branch, note, source, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(
      full_name,
      phone,
      clip(input.birth, 20),
      clip(input.address, 200),
      clip(input.course, 80),
      clip(input.shift, 80),
      clip(input.branch, 200),
      clip(input.note, 1000),
      clip(input.source, 40) || "dang-ky",
      ip,
    )
    .first<{ id: number }>();
  return { ok: true, id: row?.id ?? 0 };
}

export async function listLeads(opts: { status?: LeadStatus; q?: string; limit?: number }): Promise<Lead[]> {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (opts.status) {
    where.push("l.status = ?");
    args.push(opts.status);
  }
  if (opts.q) {
    where.push("(l.full_name LIKE ? OR l.phone LIKE ? OR l.note LIKE ?)");
    const like = `%${opts.q}%`;
    args.push(like, like, like);
  }
  const sql = `SELECT l.*, u.name AS assignee_name FROM leads l LEFT JOIN users u ON u.id = l.assignee_id
               ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY l.created_at DESC LIMIT ?`;
  const { results } = await (await db()).prepare(sql).bind(...args, opts.limit ?? 300).all<Lead>();
  return results;
}

export async function updateLead(id: number, patch: { status: LeadStatus; staff_note: string; assignee_id: number | null }): Promise<void> {
  await (await db())
    .prepare("UPDATE leads SET status=?, staff_note=?, assignee_id=?, updated_at=? WHERE id=?")
    .bind(patch.status, patch.staff_note.slice(0, 2000), patch.assignee_id, nowIso(), id)
    .run();
}

export async function deleteLead(id: number): Promise<void> {
  await (await db()).prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
}

export async function leadCounts(): Promise<Record<LeadStatus, number>> {
  const { results } = await (await db()).prepare("SELECT status, COUNT(*) AS n FROM leads GROUP BY status").all<{ status: LeadStatus; n: number }>();
  const out: Record<LeadStatus, number> = { new: 0, contacted: 0, enrolled: 0, closed: 0 };
  for (const r of results) out[r.status] = r.n;
  return out;
}
