// Lớp gọi máy chủ cho trang tư vấn tuyển sinh (dành cho nhân viên).
// Hiện CHƯA có máy chủ → getStaffSession() trả { ok: false, reason: "no-server" } và trang hiện thông báo.
// Khi có backend: đặt NEXT_PUBLIC_NLA_API và làm các endpoint (cookie phiên, credentials: include):
//   POST <API>/me                 → { ok, name, admin, grants: string[] }
//   POST <API>/tv-regs            → { ok, rows: Registration[] }
//   POST <API>/tv-reg-update      ← { id, status, staff_note } → { ok } | { ok: false, error }

export type RegStatus = "new" | "called" | "enrolled" | "cancel";

export const STATUS_LABEL: Record<RegStatus, string> = {
  new: "Mới",
  called: "Đã gọi",
  enrolled: "Đã nhập học",
  cancel: "Hủy",
};

export const STATUSES = Object.keys(STATUS_LABEL) as RegStatus[];

export type Registration = {
  id: number;
  full_name?: string;
  phone?: string;
  course?: string;
  shift?: string;
  branch?: string;
  birth?: string;
  address?: string;
  created_at?: string;
  note?: string;
  status?: RegStatus;
  staff_note?: string;
};

export type StaffSession = { name: string; canConsult: boolean };

type Fail = { ok: false; reason: "no-server" | "login" | "error"; message: string };

export const API_BASE = process.env.NEXT_PUBLIC_NLA_API ?? "";

export const NO_SERVER_MESSAGE =
  "Danh sách hồ sơ đăng ký được lưu trên máy chủ của trung tâm. Website chưa kết nối máy chủ – trung tâm sẽ bật trang này sau.";

async function call<T>(path: string, body: unknown): Promise<({ ok: true } & T) | Fail> {
  if (!API_BASE) return { ok: false, reason: "no-server", message: NO_SERVER_MESSAGE };
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body ?? {}),
    });
    if (r.status === 401) return { ok: false, reason: "login", message: "Bạn cần đăng nhập." };
    const j = (await r.json()) as { ok?: boolean; error?: string } & T;
    if (j.ok) return { ...j, ok: true };
    return { ok: false, reason: "error", message: j.error || "Lỗi" };
  } catch {
    return { ok: false, reason: "error", message: "Lỗi kết nối." };
  }
}

export async function getStaffSession(): Promise<({ ok: true } & StaffSession) | Fail> {
  const r = await call<{ name?: string; admin?: boolean; grants?: string[] }>("/me", {});
  if (!r.ok) return r;
  return { ok: true, name: r.name ?? "", canConsult: Boolean(r.admin || r.grants?.includes("tuvan")) };
}

export async function listRegistrations(): Promise<Registration[]> {
  const r = await call<{ rows?: Registration[] }>("/tv-regs", {});
  return r.ok ? (r.rows ?? []) : [];
}

export async function updateRegistration(id: number, status: RegStatus, staffNote: string): Promise<{ ok: true } | Fail> {
  return call<object>("/tv-reg-update", { id, status, staff_note: staffNote });
}
