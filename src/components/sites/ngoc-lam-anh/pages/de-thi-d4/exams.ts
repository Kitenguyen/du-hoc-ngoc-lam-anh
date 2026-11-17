// Đề luyện thi tiếng Trung THPT khối D4 của Trung tâm Du học Ngọc Lâm Anh.
// Đề mẫu dưới đây do trung tâm tự soạn (ngắn, để làm quen dạng bài) — thêm đề mới vào mảng D4_EXAMS.
//
// Văn bản đề: {{n}} = chỗ trống câu n; [[n|từ]] = từ được hỏi nghĩa ở câu n (giống quy ước của trang mẫu).
// Mỗi câu: q = câu hỏi, o = 4 phương án, a = vị trí đáp án đúng (0 = A),
//          g = giải thích chung, w = giải thích từng phương án (để trống "" nếu không cần).

export type D4Question = { n: number; q?: string; o: string[]; a: number; g?: string; w?: string[] };
export type D4Part = { h?: string; p?: string; src?: string; q: D4Question[] };
export type D4Exam = { id: string; t: string; time: number; parts: D4Part[] };

const DE_001: D4Exam = {
  id: "001",
  t: "ĐỀ LUYỆN SỐ 001 (đề mẫu rút gọn)",
  time: 15,
  parts: [
    {
      h: "Chọn phương án (A, B, C hoặc D) có phiên âm đúng của từ in đậm trong mỗi câu sau.",
      q: [
        {
          n: 1,
          q: "我每天晚上都在家【学习】。",
          o: ["xuéxí", "xuēxí", "xuéxì", "xüéxí"],
          a: 0,
          g: "学习 đọc là xuéxí (thanh 2 – thanh 2): học tập.",
          w: ["Đúng.", "学 mang thanh 2, không phải thanh 1.", "习 mang thanh 2, không phải thanh 4.", "Sau x không viết ü có hai chấm, phiên âm đúng là xué."],
        },
        {
          n: 2,
          q: "我妈妈在【银行】工作。",
          o: ["yínxíng", "yínháng", "yíngháng", "yìnháng"],
          a: 1,
          g: "行 là chữ đa âm: xíng (đi, được) và háng (hàng, ngành). 银行 (ngân hàng) đọc yínháng.",
          w: ["行 trong 银行 đọc háng, không đọc xíng.", "Đúng.", "银 kết thúc bằng -n (yín), không phải -ng.", "银 mang thanh 2, không phải thanh 4."],
        },
        {
          n: 3,
          q: "我【觉得】这本书很有意思。",
          o: ["juéde", "jiàode", "juédé", "jiàodé"],
          a: 0,
          g: "觉 có hai âm: jué (cảm thấy) và jiào (giấc ngủ – 睡觉). 觉得 đọc juéde, 得 đọc thanh nhẹ.",
          w: ["Đúng.", "jiào chỉ dùng trong 睡觉.", "得 trong 觉得 đọc thanh nhẹ (de).", "Sai cả âm 觉 và thanh của 得."],
        },
      ],
    },
    {
      h: "Chọn phương án đúng (A, B, C hoặc D) để hoàn thành mỗi câu sau.",
      q: [
        {
          n: 4,
          q: "我们每天上午都＿＿教室里上课。",
          o: ["在", "从", "给", "对"],
          a: 0,
          g: "在 + nơi chốn + động từ: diễn tả nơi xảy ra hành động – học trong lớp.",
          w: ["Đúng.", "从 = từ (điểm xuất phát), không hợp nghĩa.", "给 = cho, tặng – không đi với nơi chốn.", "对 = đối với – không đi với nơi chốn."],
        },
        {
          n: 5,
          q: "你＿＿过长城吗？——去过，去年夏天去的。",
          o: ["在", "去", "把", "给"],
          a: 1,
          g: "Động từ + 过 diễn tả trải nghiệm đã từng; câu trả lời 去过 cho thấy động từ là 去.",
          w: ["在过 không đúng ngữ pháp trong câu này.", "Đúng.", "把 là giới từ, không đi với 过.", "给 không hợp nghĩa."],
        },
        {
          n: 6,
          q: "如果明天不下雨，我们＿＿去爬山。",
          o: ["才", "还", "就", "又"],
          a: 2,
          g: "Cấu trúc 如果……就…… : nếu … thì …",
          w: ["才 = mới (điều kiện chặt), không đi với 如果.", "还 = vẫn/còn, không hợp cấu trúc.", "Đúng.", "又 = lại (lặp lại), không hợp nghĩa."],
        },
        {
          n: 7,
          q: "请你＿＿门关上，外面太冷了。",
          o: ["被", "让", "给", "把"],
          a: 3,
          g: "Câu chữ 把: 把 + tân ngữ + động từ + thành phần khác (关上) – xử lý đối tượng.",
          w: ["被 dùng cho câu bị động, không hợp câu cầu khiến này.", "让 = để/bảo (ai làm gì), sau 让 phải là người.", "给 không tạo được cấu trúc này.", "Đúng."],
        },
        {
          n: 8,
          q: "为了身体健康，他每天早上都＿＿跑步。",
          o: ["坚持", "坚决", "保持", "维持"],
          a: 0,
          g: "坚持 + động từ: kiên trì làm việc gì đó đều đặn.",
          w: ["Đúng.", "坚决 = kiên quyết (thái độ), thường đi với 反对/要求…", "保持 + trạng thái (保持健康), không đi trực tiếp với 跑步.", "维持 = duy trì (trật tự, sự sống), không hợp nghĩa."],
        },
      ],
    },
    {
      h: "Đọc đoạn văn sau và chọn phương án đúng (A, B, C hoặc D) cho mỗi câu hỏi.",
      p: "我的家乡在越南中部，那里一年四季都很温暖。每年春节，我们全家{{9}}回老家看望爷爷奶奶。爷爷喜欢种花，他的院子里有{{10}}多漂亮的花。今年我考上了大学，以后不能常常回家了，[[11|但是]]我会经常给爷爷奶奶打电话。",
      src: "（Trung tâm tự soạn）",
      q: [
        {
          n: 9,
          o: ["都", "也", "还", "才"],
          a: 0,
          g: "全家都… : cả nhà đều … — 都 đi sau chủ ngữ số nhiều để bao quát.",
          w: ["Đúng.", "也 = cũng, cần có đối tượng so sánh phía trước.", "还 = vẫn, không hợp nghĩa.", "才 = mới, không hợp nghĩa."],
        },
        {
          n: 10,
          o: ["太", "很", "真", "最"],
          a: 1,
          g: "很多 + danh từ: rất nhiều … (很多漂亮的花).",
          w: ["太多 mang nghĩa quá nhiều (thường kèm 了), không hợp.", "Đúng.", "真多 thường đứng cuối câu làm vị ngữ, không đứng trước danh từ.", "最多 = nhiều nhất, không hợp nghĩa."],
        },
        {
          n: 11,
          q: "Từ gạch chân 但是 trong đoạn văn gần nghĩa nhất với từ nào?",
          o: ["所以", "因为", "可是", "而且"],
          a: 2,
          g: "但是 và 可是 đều là liên từ chuyển ý: nhưng.",
          w: ["所以 = vì vậy (kết quả).", "因为 = bởi vì (nguyên nhân).", "Đúng.", "而且 = hơn nữa (tăng tiến)."],
        },
        {
          n: 12,
          q: "根据短文，下面哪一项是正确的？",
          o: ["作者的家乡很冷。", "作者今年考上了大学。", "爷爷不喜欢种花。", "作者每天都回老家。"],
          a: 1,
          g: "Câu 今年我考上了大学 – năm nay tôi thi đỗ đại học.",
          w: ["Đoạn văn nói quê ấm áp quanh năm (很温暖).", "Đúng.", "Đoạn văn nói 爷爷喜欢种花.", "Tác giả chỉ về quê vào dịp Tết, sau này còn ít về hơn."],
        },
      ],
    },
  ],
};

export const D4_EXAMS: D4Exam[] = [DE_001];

/** Mô tả cấu trúc đề thi thật (thông tin công khai) */
export const D4_FORMAT = "Đề thi tốt nghiệp THPT môn tiếng Trung: 40 câu trắc nghiệm · 50 phút";

export function findD4(id: string | undefined): D4Exam | undefined {
  const clean = (id ?? "").replace(/\D/g, "").slice(0, 3);
  return clean ? D4_EXAMS.find((e) => e.id === clean) : undefined;
}

export function allQuestions(d: D4Exam): D4Question[] {
  return d.parts.flatMap((p) => p.q);
}
