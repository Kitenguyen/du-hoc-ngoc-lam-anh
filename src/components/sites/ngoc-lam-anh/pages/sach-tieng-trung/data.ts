// Kho "Tài liệu tiếng Trung" (sách PDF) của Trung tâm Ngọc Lâm Anh — trang /sach-tieng-trung.
//
// ⚠️ Ô GIỮ CHỖ — trung tâm điền:
//  - FEE: phí mỗi cuốn (số, đơn vị đồng). Để null → hiện "[Phí / cuốn]" và không tính tổng tiền.
//  - Mỗi cuốn: tên đúng trên bìa (`zh`, `vi`), số trang, ảnh bìa và ảnh các trang xem thử
//    (đặt trong /public/sites/ngoc-lam-anh/sach-tieng-trung/<id>/cover.jpg, 01.jpg, 02.jpg…).
//  - `id` của cuốn có thể được trang /giao-trinh trỏ tới (`shopId`).
// Thông tin chuyển khoản KHÔNG ghi ở đây: trang hướng dẫn người mua liên hệ trung tâm qua Zalo/điện thoại.

export const FEE = null as number | null;
export const FEE_LABEL = "[Phí / cuốn]";

export function money(n: number): string {
  return `${n.toLocaleString("vi-VN")}đ`;
}

/** Phí hiển thị: "100.000đ / cuốn" khi đã điền FEE, ngược lại là ô giữ chỗ */
export const FEE_TEXT = FEE === null ? FEE_LABEL : `${money(FEE)} / cuốn`;

export type BookFile = { label: string; mb?: number };

export type ShopBook = {
  id: string;
  zh: string;
  vi?: string;
  en?: string;
  pages?: number;
  cover?: string;
  /** Ảnh các trang xem thử theo thứ tự */
  preview: string[];
  files: BookFile[];
  status: "ok" | "soon";
};

export type ShopGroup = { id: string; zh: string; name: string; note: string; books: ShopBook[] };

const placeholder = (id: string, n: number): ShopBook => ({
  id,
  zh: "[书名]",
  vi: `[Tên sách ${n} – đúng như trên bìa]`,
  preview: [],
  files: [{ label: "PDF" }],
  status: "soon",
});

export const GROUPS: ShopGroup[] = [
  {
    id: "bo-hsk",
    zh: "[汉语水平考试]",
    name: "[Tên bộ sách] — giáo trình HSK",
    note: "Đang cập nhật — trung tâm sẽ bổ sung các cuốn sách theo từng cấp HSK.",
    books: [
      placeholder("sach-hsk1-1", 1),
      placeholder("sach-hsk2-1", 2),
      placeholder("sach-hsk3-1", 3),
      placeholder("sach-hsk4-1", 4),
      placeholder("sach-hsk5-1", 5),
      placeholder("sach-hsk6-1", 6),
    ],
  },
  {
    id: "bo-giao-tiep",
    zh: "[汉语口语]",
    name: "[Tên bộ sách] — giao tiếp",
    note: "Đang cập nhật.",
    books: [placeholder("sach-giao-tiep-1", 1), placeholder("sach-giao-tiep-2", 2)],
  },
];

export const RULES = [
  { title: "🎓 Học viên của trung tâm", text: "Đăng nhập tài khoản học viên: xem và tải miễn phí tất cả tài liệu." },
  { title: "📥 Người ngoài trung tâm", text: `Phí ${FEE_TEXT} (sách PDF). Liên hệ trung tâm để chuyển khoản, trung tâm mở tài khoản tải về.` },
  { title: "👀 Chưa đăng ký", text: "Mỗi cuốn được xem thử các trang đầu." },
];
