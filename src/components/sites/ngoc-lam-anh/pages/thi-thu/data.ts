// Nội dung trang Thi thử HSK. Số đề lấy tự động từ dữ liệu đề thi (pages/de-thi/exams.ts).

export type LevelCard = {
  /** Mã cấp trong pages/de-thi/exams.ts — có mã thì hiện nút vào thi */
  levelId?: string;
  band: string;
  name: string;
  /** Ghi chú dưới tên cấp, vd "chuẩn 2.0" */
  note: string;
  cta?: string;
};

export const PAGE = {
  zh: "模拟考试",
  title: "Thi thử HSK online",
  intro: "Làm bài như thi thật, chấm điểm tự động, xem đáp án và giải thích từng câu.",
};

export const JUMPS = [
  { label: "HSK 2.0", href: "#hsk20" },
  { label: "HSKK (thi nói)", href: "#hskk" },
  { label: "HSK 3.0", href: "#hsk30" },
  { label: "Thi nói HSK 3.0", href: "#hskk30" },
];

export const HSK20 = {
  zh: "汉语水平考试",
  title: "Đề thi HSK 2.0 · 6 cấp",
  intro: "Hình thức thi HSK đang phổ biến: HSK1 – HSK6, kèm HSKK (thi nói) sơ – trung – cao cấp.",
  cards: [
    { levelId: "hsk20-1", band: "Sơ cấp", name: "HSK 1", note: "chuẩn 2.0" },
    { levelId: "hsk20-2", band: "Sơ cấp", name: "HSK 2", note: "chuẩn 2.0" },
    { levelId: "hsk20-3", band: "Trung cấp", name: "HSK 3", note: "chuẩn 2.0" },
    { levelId: "hsk20-4", band: "Trung cấp", name: "HSK 4", note: "chuẩn 2.0" },
    { levelId: "hsk20-5", band: "Cao cấp", name: "HSK 5", note: "chuẩn 2.0" },
    { band: "Cao cấp", name: "HSK 6", note: "Đề chuẩn 2.0" },
  ] satisfies LevelCard[],
};

export const HSKK = {
  zh: "汉语水平口语考试",
  title: "Đề thi nói HSKK · 3 cấp",
  intro:
    "Thi nói trên máy như thi thật: nghe – nhắc lại, nghe – trả lời, trả lời câu hỏi. Micro ghi âm để bạn nghe lại bài nói và đối chiếu bài nói mẫu.",
  cards: [
    { levelId: "hskk-1", band: "Sơ cấp", name: "HSKK sơ cấp", note: "có ghi âm" },
    { levelId: "hskk-2", band: "Trung cấp", name: "HSKK trung cấp", note: "có ghi âm" },
    { band: "Cao cấp", name: "HSKK cao cấp", note: "Đề chuẩn 2.0" },
  ] satisfies LevelCard[],
};

export const HSK30 = {
  zh: "新汉语水平考试",
  title: "Đề thi HSK 3.0 · 9 cấp",
  intro: "Chuẩn trình độ tiếng Trung quốc tế mới: 3 giai đoạn sơ – trung – cao, gồm 9 cấp.",
  columns: [
    {
      zh: "初等",
      title: "Sơ cấp",
      cards: [
        { levelId: "hsk30-1", band: "Sơ cấp", name: "Cấp 1", note: "500 từ · chuẩn 3.0" },
        { levelId: "hsk30-2", band: "Sơ cấp", name: "Cấp 2", note: "1.272 từ · chuẩn 3.0" },
        { levelId: "hsk30-3", band: "Sơ cấp", name: "Cấp 3", note: "2.245 từ · chuẩn 3.0" },
      ],
    },
    {
      zh: "中等",
      title: "Trung cấp",
      cards: [
        { levelId: "hsk30-4", band: "Trung cấp", name: "Cấp 4", note: "3.245 từ · chuẩn 3.0" },
        { levelId: "hsk30-5", band: "Trung cấp", name: "Cấp 5", note: "4.316 từ · chuẩn 3.0" },
        { band: "Trung cấp", name: "Cấp 6", note: "5.456 từ · chuẩn 3.0" },
      ],
    },
    {
      zh: "高等",
      title: "Cao cấp",
      cards: [{ band: "Cao cấp", name: "Cấp 7 – 9", note: "11.092 từ · chuẩn 3.0" }],
    },
  ] satisfies { zh: string; title: string; cards: LevelCard[] }[],
};

export const HSKK30 = {
  zh: "HSK 口语考试 · 3.0",
  title: "Thi nói HSK 3.0 · cấp 3 – 6",
  intro:
    "Theo cấu trúc thi nói HSK 3.0: nghe nhắc lại / nghe kể lại – nhìn tranh nói – trả lời câu hỏi. Micro ghi âm và có bài nói mẫu để đối chiếu.",
  cards: [
    { levelId: "hskk30-3", band: "Sơ cấp", name: "Nói cấp 3", note: "HSK三级口语", cta: "Vào thi nói" },
    { levelId: "hskk30-4", band: "Trung cấp", name: "Nói cấp 4", note: "HSK四级口语", cta: "Vào thi nói" },
    { levelId: "hskk30-5", band: "Trung cấp", name: "Nói cấp 5", note: "HSK五级口语", cta: "Vào thi nói" },
    { levelId: "hskk30-6", band: "Trung cấp", name: "Nói cấp 6", note: "HSK六级口语", cta: "Vào thi nói" },
  ] satisfies LevelCard[],
};
