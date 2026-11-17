// Bộ từ vựng chuyên ngành (PDF) của Trung tâm Ngọc Lâm Anh — trang /tu-vung-chuyen-nganh.
//
// ⚠️ Ô GIỮ CHỖ — trung tâm thay bằng tài liệu thật:
//  - `title`: tên tài liệu / chủ đề; `count`: số từ (để trống nếu chưa đếm).
//  - `file`: đường dẫn PDF xem được, đặt trong /public/sites/ngoc-lam-anh/tu-vung-chuyen-nganh/<tên>.pdf
//    rồi ghi "/sites/ngoc-lam-anh/tu-vung-chuyen-nganh/<tên>.pdf". Để trống → nút "Xem" báo "Đang cập nhật".
//  - `download: true` cho phép hiện nút "⬇ Tải PDF" (trang mẫu chỉ cho quản trị viên tải).

export type VocabDoc = { title: string; count?: number; file?: string; download?: boolean };

export const DOCS: VocabDoc[] = [
  { title: "[Tên tài liệu 1] – ví dụ: Từ vựng chuyên ngành …" },
  { title: "[Tên tài liệu 2]" },
  { title: "[Tên tài liệu 3]" },
  { title: "[Tên tài liệu 4]" },
];
