// Video giảng dạy của Trung tâm Ngọc Lâm Anh — trang /video-giang-day.
//
// ⚠️ Ô GIỮ CHỖ — trung tâm điền danh sách video thật.
//  - `open: true` → ai cũng xem được giáo trình này (không cần mở bằng họ tên). Mặc định false: video dành cho
//    học viên/giáo viên, việc kiểm tra họ tên + giáo trình cần máy chủ (chưa có) nên các bài hiện khóa.
//  - `src`: đường dẫn video mp4 (vd "/sites/ngoc-lam-anh/video-giang-day/<id>/bai-01.mp4").

export type VideoLesson = { n?: number; zh: string; vi: string; dur?: string; teacher?: string; src?: string };

export type VideoBook = {
  id: string;
  lv: "hsk1" | "hsk2" | "hsk3" | "hsk4" | "hsk5" | "hsk6";
  zh: string;
  vi: string;
  teacher?: string;
  open?: boolean;
  lessons: VideoLesson[];
};

export const LEVEL_NAMES: Record<VideoBook["lv"], string> = {
  hsk1: "HSK 1",
  hsk2: "HSK 2",
  hsk3: "HSK 3",
  hsk4: "HSK 4",
  hsk5: "HSK 5",
  hsk6: "HSK 6",
};

export const VIDEO_BOOKS: VideoBook[] = [
  {
    id: "video-hsk1-1",
    lv: "hsk1",
    zh: "[教材名称]",
    vi: "[Tên giáo trình HSK 1]",
    teacher: "[Tên giáo viên]",
    lessons: [
      { n: 1, zh: "[课文标题]", vi: "[Tên bài]", dur: "Đang cập nhật" },
      { n: 2, zh: "[课文标题]", vi: "[Tên bài]", dur: "Đang cập nhật" },
      { n: 3, zh: "[课文标题]", vi: "[Tên bài]", dur: "Đang cập nhật" },
    ],
  },
  {
    id: "video-hsk2-1",
    lv: "hsk2",
    zh: "[教材名称]",
    vi: "[Tên giáo trình HSK 2]",
    teacher: "[Tên giáo viên]",
    lessons: [
      { n: 1, zh: "[课文标题]", vi: "[Tên bài]", dur: "Đang cập nhật" },
      { n: 2, zh: "[课文标题]", vi: "[Tên bài]", dur: "Đang cập nhật" },
    ],
  },
];
