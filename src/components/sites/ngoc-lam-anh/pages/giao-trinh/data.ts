// Danh mục giáo trình của Trung tâm Du học Ngọc Lâm Anh.
// Dùng chung cho /tai-lieu (Giáo án giảng dạy, Tài liệu giáo trình, Tài liệu chuyên ngành) và /giao-trinh?b=<id>.
//
// ⚠️ CÁC MỤC DƯỚI ĐÂY LÀ Ô GIỮ CHỖ — trung tâm thay bằng giáo trình thật:
//  - Chữ trong ngoặc vuông "[...]" là chỗ cần điền.
//  - `status: "soon"` hiện nhãn "Đang cập nhật"; đổi thành "ok" khi đã có tài liệu.
//  - `file`: đường dẫn tệp mở được ngay (vd "/sites/ngoc-lam-anh/giao-trinh/<id>/bai-01.pdf").
//    Để trống → bài hiện khóa (cần đăng nhập học viên, tính năng cần máy chủ).
//  - `free: true`: khách được mở bài đó (trang mẫu cho khách học thử bài đầu tiên).

export type LevelId = "hsk1" | "hsk2" | "hsk3" | "hsk4" | "hsk5" | "hsk6" | "giao-tiep" | "cn";

export const LEVELS: { id: LevelId; zh: string; title: string }[] = [
  { id: "hsk1", zh: "初级", title: "LỚP HSK 1" },
  { id: "hsk2", zh: "初级", title: "LỚP HSK 2" },
  { id: "hsk3", zh: "初级", title: "HSK 3" },
  { id: "hsk4", zh: "中级", title: "HSK 4" },
  { id: "hsk5", zh: "高级", title: "HSK 5" },
  { id: "hsk6", zh: "高级", title: "HSK 6" },
  { id: "giao-tiep", zh: "口语", title: "GIAO TIẾP" },
];

export type Lesson = {
  n: number;
  zh: string;
  py: string;
  vi: string;
  meta: string;
  file?: string;
  free?: boolean;
};

export type OrigPart = { title: string; file?: string };

export type Textbook = {
  id: string;
  level: LevelId;
  zh: string;
  vi: string;
  /** Tên đầy đủ hiện ở đầu trang giáo trình */
  name?: string;
  status: "ok" | "soon";
  /** Các dòng mô tả nhỏ trên thẻ ở mục "Giáo án giảng dạy" */
  parts: string[];
  /** Số từ mới của cả giáo trình (để trống nếu chưa có) */
  words?: number;
  lessons: Lesson[];
  /** Sách gốc xem theo từng phần */
  orig: OrigPart[];
  /** Có bản PDF sách gốc trong kho "Tài liệu tiếng Trung" (id cuốn ở /sach-tieng-trung) */
  shopId?: string;
  /** Số đề kiểm tra cuối khóa đã soạn xong (0–10) */
  ckReady: number;
  /** Số bài kiểm tra theo đợt đã soạn xong */
  dotReady: number;
  /** Chỉ xem trực tuyến, không bán/tải PDF */
  onlineOnly?: boolean;
};

const placeholderLessons = (count: number): Lesson[] =>
  Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    zh: "[课文标题]",
    py: "[pinyin]",
    vi: "[Tên bài]",
    meta: "Đang cập nhật",
    free: i === 0,
  }));

const placeholderOrig: OrigPart[] = [{ title: "[Phần 1 – tên phần sách gốc]" }, { title: "[Phần 2 – tên phần sách gốc]" }];

function placeholderBook(level: LevelId, n: number, label: string): Textbook {
  return {
    id: `${level}-${n}`,
    level,
    zh: "[教材名称]",
    vi: `[Tên giáo trình ${label}]`,
    status: "soon",
    parts: ["Giáo án giảng dạy", "Kiểm tra cuối khóa"],
    lessons: placeholderLessons(3),
    orig: placeholderOrig,
    shopId: `sach-${level}-${n}`,
    ckReady: 0,
    dotReady: 0,
  };
}

export const TEXTBOOKS: Textbook[] = [
  placeholderBook("hsk1", 1, "HSK 1"),
  placeholderBook("hsk2", 1, "HSK 2"),
  placeholderBook("hsk3", 1, "HSK 3"),
  placeholderBook("hsk4", 1, "HSK 4"),
  placeholderBook("hsk5", 1, "HSK 5"),
  placeholderBook("hsk6", 1, "HSK 6"),
  {
    // Giáo trình giao tiếp của trung tâm (theo tiengtrungchuongmy.com: 160 hội thoại, chuẩn Đại học Bắc Kinh)
    id: "giao-tiep-160",
    level: "giao-tiep",
    zh: "[汉语口语教材]",
    vi: "Giáo trình 160 hội thoại giao tiếp",
    name: "Giáo trình 160 hội thoại giao tiếp",
    status: "soon",
    parts: ["160 hội thoại giao tiếp thực tế", "Biên soạn theo chuẩn Đại học Bắc Kinh", "Giáo án giảng dạy"],
    lessons: placeholderLessons(3),
    orig: placeholderOrig,
    ckReady: 0,
    dotReady: 0,
    onlineOnly: true,
  },
  {
    id: "cn-1",
    level: "cn",
    zh: "[专业汉语教材]",
    vi: "[Tên giáo trình chuyên ngành]",
    status: "soon",
    parts: ["Từ vựng · bài khóa · ngữ pháp", "Học viên chuyên ngành: đăng nhập để xem"],
    lessons: placeholderLessons(3),
    orig: placeholderOrig,
    ckReady: 0,
    dotReady: 0,
    onlineOnly: true,
  },
];

export function findTextbook(id: string | null | undefined): Textbook | undefined {
  return id ? TEXTBOOKS.find((b) => b.id === id) : undefined;
}

/** Số đề kiểm tra cuối khóa của mỗi giáo trình (như trang mẫu) */
export const CK_TOTAL = 10;
/** Số bài trong mỗi đợt kiểm tra */
export const DOT_SIZE = 5;
