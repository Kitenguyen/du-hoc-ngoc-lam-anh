import { CONTACT } from "../../data";

// Danh sách giáo viên lấy từ trang chủ tiengtrungchuongmy.com (mục đội ngũ giáo viên).
// Trung tâm sửa/thêm tên tại đây (viết IN HOA như trang mẫu).
export const TEACHERS = [
  "BÙI THỊ KIỀU TRANG",
  "KHUẤT THỊ XUÂN MAI",
  "LÊ THỊ MAI HƯƠNG",
  "NGUYỄN LAM ANH",
  "NGUYỄN THỊ QUỲNH ANH",
  "NGUYỄN THỊ THÚY",
  "NGUYỄN THỊ TRANG",
  "TỐNG THỊ THU HẰNG",
];

/** Cơ sở học trực tiếp — sửa địa chỉ trong data.ts › CONTACT.address hoặc thêm cơ sở tại đây. */
export const CAMPUSES = [CONTACT.address];

export const MODES = [
  { value: "truc-tiep", label: "Học trực tiếp" },
  { value: "online", label: "Học online" },
];

export const METHODS = [
  { value: "lop", label: "Học theo lớp" },
  { value: "kem", label: "Kèm 1:1" },
];

export const DAYS = [
  { value: "1", label: "Thứ 2" },
  { value: "2", label: "Thứ 3" },
  { value: "3", label: "Thứ 4" },
  { value: "4", label: "Thứ 5" },
  { value: "5", label: "Thứ 6" },
  { value: "6", label: "Thứ 7" },
  { value: "7", label: "Chủ nhật" },
];

/** 00:00 → 23:30, bước 30 phút (như trang mẫu) */
export const TIMES = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
