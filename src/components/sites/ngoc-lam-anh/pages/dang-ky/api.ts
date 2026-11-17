// Gửi form đăng ký về dashboard quản trị (POST /api/dang-ky, lưu vào cơ sở dữ liệu D1).
// Nếu máy chủ lỗi hoặc mất kết nối, giao diện chuyển sang bước "chép nội dung & nhắn Zalo / gọi điện"
// để không mất đăng ký của học viên.

export type ApiResult = { ok: true } | { ok: false; reason: "no-server" | "error"; message: string };

export const API_BASE = process.env.NEXT_PUBLIC_NLA_API ?? "/api";

export const NO_SERVER_MESSAGE = "Chưa gửi được tự động – bạn gửi giúp trung tâm qua Zalo hoặc gọi điện nhé.";

/** POST JSON tới máy chủ (dùng chung cho các trang đăng ký). */
export async function postJson(path: string, body: unknown): Promise<ApiResult> {
  try {
    const r = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.status >= 500 || r.status === 404) return { ok: false, reason: "no-server", message: NO_SERVER_MESSAGE };
    const j = (await r.json()) as { ok?: boolean; error?: string };
    if (j.ok) return { ok: true };
    return { ok: false, reason: "error", message: j.error || "Gửi chưa được." };
  } catch {
    return { ok: false, reason: "no-server", message: NO_SERVER_MESSAGE };
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
  return postJson("/dang-ky", { ...data, source: "dang-ky" });
}
