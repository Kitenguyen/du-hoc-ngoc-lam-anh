// Lớp gọi máy chủ cho các form đăng ký. Hiện CHƯA có máy chủ:
// khi chưa đặt NEXT_PUBLIC_NLA_API, mọi hàm trả về { ok: false, reason: "no-server" }
// và giao diện chuyển sang bước "chép nội dung & nhắn Zalo / gọi điện".
// Khi trung tâm có backend: đặt NEXT_PUBLIC_NLA_API (vd "https://api.example.vn") và
// làm endpoint POST <API>/register nhận JSON bên dưới, trả { ok: true } hoặc { ok: false, error }.

export type ApiResult = { ok: true } | { ok: false; reason: "no-server" | "error"; message: string };

export const API_BASE = process.env.NEXT_PUBLIC_NLA_API ?? "";

export const NO_SERVER_MESSAGE = "Website chưa kết nối máy chủ – trung tâm sẽ bật tính năng gửi tự động sau.";

/** POST JSON tới máy chủ (dùng chung cho các trang đăng ký). */
export async function postJson(path: string, body: unknown): Promise<ApiResult> {
  if (!API_BASE) return { ok: false, reason: "no-server", message: NO_SERVER_MESSAGE };
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = (await r.json()) as { ok?: boolean; error?: string };
    if (j.ok) return { ok: true };
    return { ok: false, reason: "error", message: j.error || "Gửi chưa được." };
  } catch {
    return { ok: false, reason: "error", message: "Lỗi kết nối, gửi chưa được." };
  }
}

export type RegistrationData = {
  full_name: string;
  phone: string;
  birth: string;
  address: string;
  /** id khóa học trong COURSE_GROUPS, hoặc "tu-van" */
  course: string;
  shift: string;
  branch: string;
  note: string;
};

export function submitRegistration(data: RegistrationData): Promise<ApiResult> {
  return postJson("/register", data);
}
