// Lớp gọi máy chủ cho đăng ký học viên (tự tạo tài khoản). Hiện CHƯA có máy chủ:
// submitStudent() trả { ok: false, reason: "no-server" } → trang chuyển sang bước "chép nội dung & nhắn Zalo".
// Khi có backend: đặt NEXT_PUBLIC_NLA_API và làm POST <API>/student-register nhận JSON bên dưới
// (photo = ảnh 4×6 600×900 dạng data URL JPEG), tạo tài khoản chờ duyệt, trả { ok: true } hoặc { ok: false, error }.
import { postJson, type ApiResult } from "../dang-ky/api";

export type ScheduleSlot = { d: string; t1: string; t2: string };

export type StudentRequest = {
  full_name: string;
  phone: string;
  teacher: string;
  password: string;
  mode: string;
  campus: string;
  method: string;
  sched: ScheduleSlot[];
  address: string;
  photo: string;
};

export function submitStudent(data: StudentRequest): Promise<ApiResult> {
  return postJson("/student-register", data);
}
