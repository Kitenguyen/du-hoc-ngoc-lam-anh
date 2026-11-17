// Trang "Luyện thi khối D4". Trung tâm chưa công bố khóa D4 → mọi thông tin khóa/giá để ở dạng ô giữ chỗ "[...]".
// Từ vựng mẫu bên dưới là từ vựng phổ thông (chuẩn HSK 1 – 3) tự soạn; trung tâm thay/bổ sung bằng danh sách D4 thật.

export const D4_HEAD = {
  zh: "高考汉语 · D4",
  title: "Luyện thi khối D4",
  intro: "Tiếng Trung THPT khối D4: bài giảng, từ vựng ôn tập và luyện đề.",
};

/** Giá gói và thời hạn — chưa công bố */
export const D4_PACKAGE = {
  fee: "[Giá gói]",
  term: "[Thời hạn gói]",
  /** Số từ vựng của bộ D4 thật — đang cập nhật; trang hiển thị số từ mẫu hiện có. */
  vocabTotal: "[Số từ]",
};

/** Thông tin chuyển khoản — trung tâm điền khi mở bán gói */
export const D4_PAY = {
  bank: "[Ngân hàng]",
  account: "[Số tài khoản]",
  holder: "[Chủ tài khoản]",
  memo: "D4 + số điện thoại của bạn",
};

export type D4Item = {
  id: string;
  kind: "bai" | "de";
  title: string;
  ext: "mp4" | "pdf" | "docx";
  meta: string;
};

/** Bài giảng / đề do giáo viên đăng — hiện là ô giữ chỗ */
export const D4_ITEMS: D4Item[] = [
  { id: "b1", kind: "bai", title: "[Tên bài giảng 1]", ext: "mp4", meta: "MP4 · Đang cập nhật" },
  { id: "b2", kind: "bai", title: "[Tên bài giảng 2]", ext: "mp4", meta: "MP4 · Đang cập nhật" },
  { id: "b3", kind: "bai", title: "[Tài liệu bài giảng]", ext: "pdf", meta: "PDF · Đang cập nhật" },
  { id: "d1", kind: "de", title: "[Tên đề luyện 1]", ext: "pdf", meta: "PDF · Đang cập nhật" },
  { id: "d2", kind: "de", title: "[Tên đề luyện 2]", ext: "docx", meta: "DOCX · Đang cập nhật" },
];

export type Word = { hz: string; py: string; vi: string };

/** Bộ từ mẫu công khai (HSK 1 – 3). Thêm từ: { hz: "chữ Hán", py: "pīnyīn", vi: "nghĩa" } */
export const D4_SAMPLE_WORDS: Word[] = [
  { hz: "学习", py: "xuéxí", vi: "học tập" },
  { hz: "学校", py: "xuéxiào", vi: "trường học" },
  { hz: "老师", py: "lǎoshī", vi: "giáo viên" },
  { hz: "学生", py: "xuésheng", vi: "học sinh" },
  { hz: "同学", py: "tóngxué", vi: "bạn học" },
  { hz: "考试", py: "kǎoshì", vi: "thi, kỳ thi" },
  { hz: "作业", py: "zuòyè", vi: "bài tập về nhà" },
  { hz: "问题", py: "wèntí", vi: "câu hỏi, vấn đề" },
  { hz: "回答", py: "huídá", vi: "trả lời" },
  { hz: "认真", py: "rènzhēn", vi: "chăm chỉ, nghiêm túc" },
  { hz: "努力", py: "nǔlì", vi: "cố gắng" },
  { hz: "成绩", py: "chéngjì", vi: "thành tích, điểm số" },
  { hz: "简单", py: "jiǎndān", vi: "đơn giản" },
  { hz: "容易", py: "róngyì", vi: "dễ" },
  { hz: "明白", py: "míngbai", vi: "hiểu, rõ ràng" },
  { hz: "知道", py: "zhīdào", vi: "biết" },
  { hz: "准备", py: "zhǔnbèi", vi: "chuẩn bị" },
  { hz: "开始", py: "kāishǐ", vi: "bắt đầu" },
  { hz: "结束", py: "jiéshù", vi: "kết thúc" },
  { hz: "时间", py: "shíjiān", vi: "thời gian" },
  { hz: "今天", py: "jīntiān", vi: "hôm nay" },
  { hz: "明天", py: "míngtiān", vi: "ngày mai" },
  { hz: "昨天", py: "zuótiān", vi: "hôm qua" },
  { hz: "周末", py: "zhōumò", vi: "cuối tuần" },
  { hz: "家人", py: "jiārén", vi: "người nhà" },
  { hz: "朋友", py: "péngyou", vi: "bạn bè" },
  { hz: "医生", py: "yīshēng", vi: "bác sĩ" },
  { hz: "医院", py: "yīyuàn", vi: "bệnh viện" },
  { hz: "图书馆", py: "túshūguǎn", vi: "thư viện" },
  { hz: "超市", py: "chāoshì", vi: "siêu thị" },
  { hz: "天气", py: "tiānqì", vi: "thời tiết" },
  { hz: "运动", py: "yùndòng", vi: "vận động, thể thao" },
  { hz: "旅游", py: "lǚyóu", vi: "du lịch" },
  { hz: "喜欢", py: "xǐhuan", vi: "thích" },
  { hz: "希望", py: "xīwàng", vi: "hy vọng" },
  { hz: "觉得", py: "juéde", vi: "cảm thấy" },
  { hz: "帮助", py: "bāngzhù", vi: "giúp đỡ" },
  { hz: "需要", py: "xūyào", vi: "cần" },
  { hz: "重要", py: "zhòngyào", vi: "quan trọng" },
  { hz: "办法", py: "bànfǎ", vi: "cách, biện pháp" },
];

export type VocabMode = "card" | "g1" | "g2" | "g3" | "r30";

export const VOCAB_ACTIONS: { mode: VocabMode | "shoot"; title: string; text: string; href?: string }[] = [
  { mode: "card", title: "📇 Thẻ học", text: "Lật thẻ, nghe phát âm, đánh dấu từ đã thuộc" },
  { mode: "g1", title: "🎮 Nhìn chữ chọn nghĩa", text: "Trò chơi chọn nghĩa đúng của chữ Hán" },
  { mode: "g2", title: "🎯 Nhìn nghĩa chọn chữ Hán", text: "Trò chơi chọn đúng chữ Hán theo nghĩa" },
  { mode: "g3", title: "⌨️ Nhìn nghĩa gõ chữ Hán", text: "Luyện viết / gõ chữ Hán (gõ pinyin không dấu cũng được)" },
  { mode: "r30", title: "📝 Kiểm tra tổng hợp", text: "30 từ ngẫu nhiên, chấm điểm, ôn lại câu sai" },
  { mode: "shoot", title: "🔫 Trò chơi bắn chữ Hán", text: "Gõ phiên âm bắn chữ rơi – tốc độ giữ nguyên", href: "tro-choi.html" },
];

export const D4_EXAM = {
  intro:
    "Đề luyện thi tiếng Trung THPT khối D4 theo cấu trúc đề thi tốt nghiệp: 40 câu · 50 phút · nộp bài chấm điểm ngay và giải thích chi tiết từng câu.",
  href: "de-thi-d4.html",
};
