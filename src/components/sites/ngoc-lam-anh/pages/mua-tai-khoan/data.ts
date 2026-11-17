// ⚠️ TRUNG TÂM ĐIỀN: các gói tài khoản học online, giá, thời hạn và thông tin chuyển khoản.
// Mọi giá trị dạng "[...]" là ô giữ chỗ — chưa phải thông tin thật của Ngọc Lâm Anh.
// Khi `bank.accountNumber` còn là ô giữ chỗ, nút "Sao chép" bị tắt và không hiện mã QR.

export type Package = {
  id: string;
  name: string;
  /** Giá hiển thị, ví dụ "1.500.000đ". Để "[Giá gói]" khi chưa có. */
  price: string;
};

/** Cấp độ HSK là chuẩn chung; trung tâm sửa/bớt/thêm gói tại đây. */
export const PACKAGES: Package[] = [
  { id: "hsk1", name: "HSK1 – Sơ cấp", price: "[Giá gói]" },
  { id: "hsk2", name: "HSK2", price: "[Giá gói]" },
  { id: "hsk3", name: "HSK3", price: "[Giá gói]" },
  { id: "hsk4", name: "HSK4", price: "[Giá gói]" },
  { id: "hsk5", name: "HSK5", price: "[Giá gói]" },
  { id: "hsk6", name: "HSK6", price: "[Giá gói]" },
];

/** Thời hạn tài khoản, ví dụ "1 năm" */
export const DURATION = "[Thời hạn]";

export const BANK = {
  /** Đường dẫn ảnh QR (vd "/sites/ngoc-lam-anh/mua-tai-khoan/qr.png"); để trống khi chưa có */
  qrSrc: "",
  accountName: "[Thông tin chuyển khoản]",
  accountNumber: "[Số tài khoản]",
  bankName: "[Ngân hàng – chi nhánh]",
  /** Tiền tố nội dung chuyển khoản, ghép với số điện thoại */
  notePrefix: "NLA",
};

export function isPlaceholder(v: string): boolean {
  return !v || /^\[.*\]$/.test(v.trim());
}
