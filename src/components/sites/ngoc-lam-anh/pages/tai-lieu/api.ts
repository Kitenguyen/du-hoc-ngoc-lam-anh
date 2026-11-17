// Lớp gọi máy chủ cho nhóm trang Tài liệu (tai-lieu, giao-trinh, sach-tieng-trung, video-giang-day,
// giao-trinh-dich-thuat, tu-vung-chuyen-nganh). Dự án CHƯA có máy chủ: mọi hàm trả về thông báo trung thực.
// Khi nối backend, chỉ cần sửa file này (giữ nguyên chữ ký hàm).

export const SERVER_NOTICE = "Tính năng này cần kết nối máy chủ – trung tâm sẽ bật sau.";

export type ServerAction =
  | "login" // đăng nhập học viên / giáo viên
  | "open-file" // mở tệp có kiểm tra quyền (xem.php)
  | "ck10" // mật khẩu đề thi cuối khóa
  | "video-open" // mở video theo họ tên + giáo trình
  | "book-register" // xác nhận chuyển khoản mua tài liệu
  | "lesson-full"; // bản phân tích đầy đủ (giáo trình dịch thuật)

export type ServerResult = { ok: false; message: string };

/** Gọi máy chủ — hiện luôn trả về `ok: false` kèm thông báo, không giả vờ thành công. */
export async function callServer(action: ServerAction, payload?: Record<string, unknown>): Promise<ServerResult> {
  void action;
  void payload;
  return { ok: false, message: SERVER_NOTICE };
}
