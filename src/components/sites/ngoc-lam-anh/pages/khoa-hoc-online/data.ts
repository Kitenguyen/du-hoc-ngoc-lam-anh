// Trang "Khóa học online" (ứng dụng toàn màn hình, không có header/footer chung của site).
// Chưa có video bài giảng của Ngọc Lâm Anh → danh sách dưới đây là ô giữ chỗ.
// Thêm bài: { id, giaoTrinh, capDo, baiNo, title, yt: "link YouTube (nên để Unlisted)" }.

export const CAP_LABEL = {
  hsk1: "HSK1 · Sơ cấp 1",
  hsk2: "HSK2 · Sơ cấp 2",
  hsk3: "HSK3 · Trung cấp 1",
  hsk4: "HSK4 · Trung cấp 2",
  hsk5: "HSK5 · Cao cấp 1",
  hsk6: "HSK6 · Cao cấp 2",
} as const;

export type CapDo = keyof typeof CAP_LABEL;
export const CAP_ORDER = Object.keys(CAP_LABEL) as CapDo[];

export type OnlineLesson = {
  id: number;
  giaoTrinh: string;
  capDo: CapDo;
  baiNo: number;
  title: string;
  /** Link YouTube; để trống = video đang cập nhật */
  yt: string;
};

export const ONLINE_LESSONS: OnlineLesson[] = [
  { id: 1, giaoTrinh: "[Tên giáo trình 1]", capDo: "hsk1", baiNo: 1, title: "[Tên bài giảng]", yt: "" },
  { id: 2, giaoTrinh: "[Tên giáo trình 1]", capDo: "hsk1", baiNo: 2, title: "[Tên bài giảng]", yt: "" },
  { id: 3, giaoTrinh: "[Tên giáo trình 1]", capDo: "hsk1", baiNo: 3, title: "[Tên bài giảng]", yt: "" },
  { id: 4, giaoTrinh: "[Tên giáo trình 1]", capDo: "hsk2", baiNo: 1, title: "[Tên bài giảng]", yt: "" },
  { id: 5, giaoTrinh: "[Tên giáo trình 1]", capDo: "hsk2", baiNo: 2, title: "[Tên bài giảng]", yt: "" },
  { id: 6, giaoTrinh: "[Tên giáo trình 2]", capDo: "hsk3", baiNo: 1, title: "[Tên bài giảng]", yt: "" },
  { id: 7, giaoTrinh: "[Tên giáo trình 2]", capDo: "hsk3", baiNo: 2, title: "[Tên bài giảng]", yt: "" },
];

/** 5 mục luyện tập mở sau khi xem hết video */
export const PRACTICE_TILES = [
  { k: "tv", title: "📝 Luyện từ vựng", open: "Từ vựng trong giáo án" },
  { k: "kt", title: "✅ Kiểm tra từ vựng", open: "Bài kiểm tra của bài" },
  { k: "th", title: "🧩 Bài tập tổng hợp", open: "Luyện tập trong giáo án" },
  { k: "hw", title: "🏠 Bài tập về nhà", open: "Dịch Trung ⇄ Việt, viết văn" },
  { k: "sp", title: "🎤 Luyện nói", open: "Nghe & trả lời, bấm giờ" },
];
