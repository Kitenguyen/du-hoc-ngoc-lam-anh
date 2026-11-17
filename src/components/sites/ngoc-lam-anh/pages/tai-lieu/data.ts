// Nội dung trang /tai-lieu. Danh mục giáo trình nằm ở ../giao-trinh/data.ts (dùng chung).
// Chữ trong "[...]" là ô giữ chỗ để trung tâm điền.

export const TAI_LIEU_HEAD = {
  zh: "教学资料",
  title: "Tài liệu",
  intro:
    "Giáo án giảng dạy, tài liệu giáo trình HSK1–HSK6 và tài liệu chuyên ngành của Trung tâm Du học Ngọc Lâm Anh.",
};

export const TAI_LIEU_JUMP = [
  { label: "Giáo án giảng dạy", href: "#giao-an" },
  { label: "Tài liệu giáo trình", href: "#giao-trinh" },
  { label: "Tài liệu chuyên ngành", href: "#chuyen-nganh" },
  { label: "Tài liệu tiếng Trung", href: "#tieng-trung" },
  { label: "Tra lượng từ", href: "#tra-luong-tu" },
];

export const SECTION_TEXT = {
  traLuongTu:
    "Bảng lượng từ (量词) tiếng Trung thông dụng — mỗi lượng từ dùng cho nhóm danh từ/động tác nào, cách dùng và ví dụ cụ thể. Tìm nhanh theo chữ Hán, pinyin hoặc nghĩa tiếng Việt.",
  video:
    "Video bài giảng theo từng bài. Học viên nhập họ tên + giáo trình đang học; giáo viên nhập tên + cấp độ để mở. Danh sách video: Đang cập nhật.",
  giaoTrinh:
    "Sách giáo trình gốc dạng điện tử, xem trực tuyến theo từng bài. Học viên của trung tâm xem và tải miễn phí; người ngoài xem thử phần đầu sách, mua bộ trong mục",
  chuyenNganh:
    "Tài liệu tiếng Trung chuyên ngành của Trung tâm Ngọc Lâm Anh: bộ từ vựng theo ngành, giáo trình dịch thuật và giáo trình chuyên ngành.",
  tiengTrung:
    "Kho sách tiếng Trung bản PDF, sắp theo từng bộ. Học viên của trung tâm tải miễn phí; người ngoài [Phí / cuốn]; ai cũng được xem thử phần đầu sách.",
};

export type ExtraCard = {
  zh: string;
  vi: string;
  meta: string;
  status: "ok" | "soon";
  parts: string[];
  btn: string;
  href: string;
};

/** Thẻ cố định ở mục "Tài liệu chuyên ngành" (ngoài các giáo trình chuyên ngành trong ../giao-trinh/data.ts) */
export const SPECIALTY_CARDS: ExtraCard[] = [
  {
    zh: "专业词汇",
    vi: "Từ vựng chuyên ngành (PDF)",
    meta: "Bộ từ vựng theo ngành",
    status: "soon",
    parts: ["Chữ Hán · Phiên âm · Nghĩa tiếng Việt", "Xem trực tuyến", "Tìm theo chủ đề"],
    btn: "Mở danh mục",
    href: "tu-vung-chuyen-nganh.html",
  },
  {
    zh: "商务汉语 · 翻译",
    vi: "Giáo trình Tiếng Trung Thương mại – Dịch thuật",
    meta: "Bài khóa · từ vựng · khung dịch",
    status: "soon",
    parts: ["Bài khóa tiếng Trung", "Bảng từ vựng", "Khung dịch lưu nháp trên máy"],
    btn: "Mở giáo trình",
    href: "giao-trinh-dich-thuat.html",
  },
  {
    zh: "专业汉语词典",
    vi: "Từ điển chuyên ngành",
    meta: "Tra cứu theo ngành",
    status: "soon",
    parts: ["Tra cứu theo ngành, phòng ban", "Mẫu câu · hội thoại"],
    btn: "Tra từ điển",
    href: "tu-dien.html",
  },
];

export const BOOKSHOP_CARD: ExtraCard = {
  zh: "中文书库",
  vi: "Tài liệu tiếng Trung",
  meta: "Sách PDF · Xem thử phần đầu",
  status: "ok",
  parts: ["Học viên trung tâm: miễn phí", "Người ngoài: [Phí / cuốn]"],
  btn: "Mở kho tài liệu",
  href: "sach-tieng-trung.html",
};
