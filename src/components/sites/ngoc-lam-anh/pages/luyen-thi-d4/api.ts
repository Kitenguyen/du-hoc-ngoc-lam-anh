// Lớp gọi máy chủ cho trang Luyện thi D4. Dự án chưa có backend → các hàm trả về "cần máy chủ".
// Khi có máy chủ: thay phần thân hàm bằng fetch tới API thật (giữ nguyên kiểu trả về).

export type D4Session = {
  /** null = chưa đăng nhập */
  user: { name: string; username: string } | null;
  /** true = học viên trung tâm / đã mua gói → mở toàn bộ */
  can: boolean;
  /** Ngày hết hạn gói (yyyy-mm-dd) nếu có */
  until?: string;
};

export type ServerResult = { ok: true } | { ok: false; needsServer: true; message: string };

export const NEEDS_SERVER_MSG = "Tính năng này cần kết nối máy chủ – trung tâm sẽ bật sau.";

/** Trạng thái tài khoản / gói D4 của người xem */
export async function loadD4Session(): Promise<D4Session> {
  return { user: null, can: false };
}

export type D4PaymentForm = { fullName: string; phone: string; email: string; receipt: string; note: string };

/** Gửi xác nhận chuyển khoản mua gói D4 */
export async function submitD4Payment(form: D4PaymentForm): Promise<ServerResult> {
  void form;
  return { ok: false, needsServer: true, message: NEEDS_SERVER_MSG };
}

/** Nội dung soạn sẵn để gửi qua Zalo khi chưa có máy chủ */
export function paymentMessage(f: D4PaymentForm, fee: string): string {
  return [
    `Xác nhận chuyển khoản gói Luyện thi D4 (${fee})`,
    `Họ tên: ${f.fullName}`,
    `SĐT: ${f.phone}`,
    f.email && `Email: ${f.email}`,
    `Mã giao dịch: ${f.receipt}`,
    f.note && `Ghi chú: ${f.note}`,
  ]
    .filter(Boolean)
    .join("\n");
}
