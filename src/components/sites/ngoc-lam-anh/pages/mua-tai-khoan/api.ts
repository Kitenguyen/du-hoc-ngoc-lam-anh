// Lớp gọi máy chủ cho đăng ký mua tài khoản. Hiện CHƯA có máy chủ và KHÔNG xử lý thanh toán:
// submitAccountRequest() trả { ok: false, reason: "no-server" } → trang chuyển sang bước "chép nội dung & nhắn Zalo".
// Khi có backend: đặt NEXT_PUBLIC_NLA_API và làm POST <API>/account-register nhận JSON bên dưới
// (receipt = ảnh biên lai dạng data URL JPEG), trả { ok: true } hoặc { ok: false, error }.
import { postJson, type ApiResult } from "../dang-ky/api";

export type AccountRequest = {
  full_name: string;
  address: string;
  phone: string;
  password: string;
  level: string;
  receipt: string;
  note: string;
};

export function submitAccountRequest(data: AccountRequest): Promise<ApiResult> {
  return postJson("/account-register", data);
}
