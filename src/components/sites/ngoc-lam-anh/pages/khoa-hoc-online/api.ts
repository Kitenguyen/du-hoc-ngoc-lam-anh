// Lớp gọi máy chủ của Khóa học online (course.php ở trang mẫu). Dự án chưa có backend.
// Khi có máy chủ: trả về thông tin học viên thật + danh sách video theo cấp độ đã mở.

import { ONLINE_LESSONS, type CapDo, type OnlineLesson } from "./data";

export type CourseMe =
  | { ok: true; name: string; levels: CapDo[]; staff: boolean }
  | { ok: false; err: string };

export const NEEDS_SERVER_MSG = "Đăng nhập và lưu tiến trình học cần kết nối máy chủ – trung tâm sẽ bật sau.";

export async function courseMe(): Promise<CourseMe> {
  return { ok: false, err: NEEDS_SERVER_MSG };
}

/** Danh sách video (hiện là dữ liệu giữ chỗ trong data.ts) */
export async function courseList(): Promise<OnlineLesson[]> {
  return ONLINE_LESSONS;
}

/** Lấy mã video YouTube từ link */
export function ytId(u: string): string {
  const s = (u || "").trim();
  const m = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : "";
}
