// Đề thi thử HSK / HSKK của Trung tâm Tiếng Trung Ngọc Lâm Anh.
// Toàn bộ câu hỏi dưới đây do trung tâm tự soạn để luyện tập (không lấy từ đề của đơn vị khác).
// Thêm đề mới: thêm một phần tử vào mảng `exams` của cấp tương ứng trong EXAMS — trang tự cập nhật.
//
// Kiểu câu hỏi:
//  - "choice": trắc nghiệm (cả câu Đúng/Sai). `audio` = câu tiếng Trung được đọc to bằng giọng máy (speechSynthesis).
//  - "speak": câu thi nói HSKK — nghe/đọc đề rồi ghi âm câu trả lời; chấm điểm nói cần máy chủ.

export type ChoiceQuestion = {
  type: "choice";
  /** Câu hỏi / câu cần điền (chữ Hán), có thể để trống nếu chỉ nghe */
  prompt?: string;
  /** Phiên âm hiển thị dưới câu hỏi (cấp HSK 1–2 có pinyin) */
  pinyin?: string;
  /** Lời thoại phần nghe — được đọc bằng giọng máy, hiện ra khi xem lại bài */
  audio?: string;
  options: string[];
  /** Vị trí đáp án đúng (0 = A) */
  answer: number;
  /** Giải thích bằng tiếng Việt */
  explain: string;
};

export type SpeakQuestion = {
  type: "speak";
  /** Đề hiển thị (chữ Hán); có thể ẩn ở phần nghe nhắc lại */
  prompt?: string;
  pinyin?: string;
  /** Câu được đọc bằng giọng máy */
  audio?: string;
  /** Số giây ghi âm tối đa */
  recordSeconds: number;
  /** Bài nói mẫu để tự đối chiếu */
  sample: string;
  sampleVi?: string;
};

export type Question = ChoiceQuestion | SpeakQuestion;

export type ExamSection = {
  /** "listening" | "reading" | "speaking" — dùng để tính điểm từng phần */
  kind: "listening" | "reading" | "speaking";
  zh: string;
  title: string;
  /** Hướng dẫn chung cho phần này */
  instructions: string;
  /** Câu hỏi được nhóm theo từng dạng bài, mỗi nhóm có hướng dẫn riêng */
  groups: { instructions: string; questions: Question[] }[];
};

export type Exam = {
  id: string;
  title: string;
  minutes: number;
  /** Điểm đạt tối thiểu trên thang `scale` (để trống nếu không áp dụng) */
  pass?: number;
  /** Thang điểm quy đổi (HSK 1–2: 200 điểm) */
  scale?: number;
  sections: ExamSection[];
};

export type Level = {
  id: string;
  /** Tên cấp, vd "HSK 1 · chuẩn 2.0" */
  name: string;
  /** Mô tả cấu trúc đề thi thật (thông tin công khai) */
  format: string;
  speaking?: boolean;
  exams: Exam[];
};

const TRUE_FALSE = ["✔ Đúng", "✘ Sai"];

const HSK1_DE01: Exam = {
  id: "de01",
  title: "Đề luyện số 1",
  minutes: 20,
  pass: 120,
  scale: 200,
  sections: [
    {
      kind: "listening",
      zh: "一、听力",
      title: "Phần nghe",
      instructions: "Bấm 🔊 để nghe. Mỗi câu được nghe tối đa 2 lần, như khi thi thật.",
      groups: [
        {
          instructions: "Nghe cụm từ, phán đoán nội dung in trên đề là ĐÚNG hay SAI.",
          questions: [
            { type: "choice", audio: "喝茶", prompt: "喝茶", pinyin: "hē chá", options: TRUE_FALSE, answer: 0, explain: "Nghe: 喝茶 (hē chá – uống trà), trùng với nội dung trên đề." },
            { type: "choice", audio: "看书", prompt: "写字", pinyin: "xiě zì", options: TRUE_FALSE, answer: 1, explain: "Nghe: 看书 (kàn shū – đọc sách), đề in 写字 (viết chữ) nên SAI." },
            { type: "choice", audio: "三个苹果", prompt: "三个苹果", pinyin: "sān gè píngguǒ", options: TRUE_FALSE, answer: 0, explain: "Nghe: 三个苹果 – ba quả táo, khớp với đề." },
            { type: "choice", audio: "坐飞机", prompt: "坐出租车", pinyin: "zuò chūzūchē", options: TRUE_FALSE, answer: 1, explain: "Nghe: 坐飞机 (đi máy bay), đề in 坐出租车 (đi taxi) nên SAI." },
            { type: "choice", audio: "下雨了", prompt: "下雨", pinyin: "xià yǔ", options: TRUE_FALSE, answer: 0, explain: "Nghe: 下雨了 – trời mưa rồi, khớp với 下雨." },
          ],
        },
        {
          instructions: "Nghe đoạn hội thoại và câu hỏi, chọn đáp án đúng.",
          questions: [
            { type: "choice", audio: "女：你叫什么名字？男：我叫李明。问：男的叫什么名字？", options: ["李明 Lǐ Míng", "王明 Wáng Míng", "李月 Lǐ Yuè"], answer: 0, explain: "Người nam nói 我叫李明 – tôi tên là Lý Minh." },
            { type: "choice", audio: "男：今天星期几？女：今天星期三。问：今天星期几？", options: ["星期一 thứ Hai", "星期三 thứ Tư", "星期五 thứ Sáu"], answer: 1, explain: "星期三 là thứ Tư (星期一 = thứ Hai, cộng thêm 1)." },
            { type: "choice", audio: "女：你家有几口人？男：我家有四口人。问：他家有几口人？", options: ["三口人 3 người", "四口人 4 người", "五口人 5 người"], answer: 1, explain: "我家有四口人 – nhà tôi có bốn người. 口 là lượng từ đếm người trong gia đình." },
            { type: "choice", audio: "男：你明天去哪儿？女：我明天去医院看朋友。问：女的明天去哪儿？", options: ["学校 trường học", "商店 cửa hàng", "医院 bệnh viện"], answer: 2, explain: "我明天去医院看朋友 – mai tôi đến bệnh viện thăm bạn." },
            { type: "choice", audio: "女：现在几点？男：现在八点十分。问：现在几点？", options: ["8:10", "8:30", "10:08"], answer: 0, explain: "八点十分 = 8 giờ 10 phút. Chú ý thứ tự: giờ (点) trước, phút (分) sau." },
          ],
        },
      ],
    },
    {
      kind: "reading",
      zh: "二、阅读",
      title: "Phần đọc",
      instructions: "Đọc kỹ câu hỏi rồi chọn đáp án đúng.",
      groups: [
        {
          instructions: "Chọn từ thích hợp điền vào chỗ trống.",
          questions: [
            { type: "choice", prompt: "我＿＿中国人。", pinyin: "Wǒ ＿＿ Zhōngguó rén.", options: ["是 shì", "有 yǒu", "在 zài"], answer: 0, explain: "Câu giới thiệu “tôi là người Trung Quốc” dùng 是 (là). 有 = có, 在 = ở." },
            { type: "choice", prompt: "这＿＿书是我的。", pinyin: "Zhè ＿＿ shū shì wǒ de.", options: ["个 gè", "口 kǒu", "本 běn"], answer: 2, explain: "Lượng từ của sách là 本: 一本书, 这本书." },
            { type: "choice", prompt: "我想＿＿米饭。", pinyin: "Wǒ xiǎng ＿＿ mǐfàn.", options: ["喝 hē", "吃 chī", "看 kàn"], answer: 1, explain: "米饭 (cơm) đi với động từ 吃 (ăn). 喝 dùng cho đồ uống." },
            { type: "choice", prompt: "他在学校＿＿汉语。", pinyin: "Tā zài xuéxiào ＿＿ Hànyǔ.", options: ["睡觉 shuìjiào", "开 kāi", "学习 xuéxí"], answer: 2, explain: "学习汉语 – học tiếng Trung ở trường." },
            { type: "choice", prompt: "你＿＿吗？——我很好，谢谢！", pinyin: "Nǐ ＿＿ ma? — Wǒ hěn hǎo, xièxie!", options: ["好 hǎo", "去 qù", "叫 jiào"], answer: 0, explain: "你好吗？– Bạn có khỏe không? Câu trả lời 我很好 cho thấy đáp án là 好." },
          ],
        },
        {
          instructions: "Chọn câu trả lời phù hợp với câu hỏi.",
          questions: [
            { type: "choice", prompt: "你是老师吗？", pinyin: "Nǐ shì lǎoshī ma?", options: ["不是，我是学生。", "我去商店。", "三块钱。"], answer: 0, explain: "Hỏi “bạn là giáo viên à?” → “không, tôi là học sinh”." },
            { type: "choice", prompt: "这个杯子多少钱？", pinyin: "Zhège bēizi duōshao qián?", options: ["在桌子上。", "三十块。", "我很喜欢。"], answer: 1, explain: "多少钱 hỏi giá → 三十块 (ba mươi tệ)." },
            { type: "choice", prompt: "你爸爸在哪儿工作？", pinyin: "Nǐ bàba zài nǎr gōngzuò?", options: ["他是医生，在医院工作。", "他今年四十岁。", "他很忙。"], answer: 0, explain: "哪儿 hỏi nơi chốn → 在医院工作 (làm ở bệnh viện)." },
            { type: "choice", prompt: "你会说汉语吗？", pinyin: "Nǐ huì shuō Hànyǔ ma?", options: ["我叫大卫。", "明天见。", "会一点儿。"], answer: 2, explain: "会…吗 hỏi khả năng → 会一点儿 (biết một chút)." },
            { type: "choice", prompt: "明天天气怎么样？", pinyin: "Míngtiān tiānqì zěnmeyàng?", options: ["明天星期六。", "明天很热。", "我明天不去。"], answer: 1, explain: "Hỏi thời tiết (天气怎么样) → 明天很热 (ngày mai rất nóng)." },
          ],
        },
      ],
    },
  ],
};

const HSK2_DE01: Exam = {
  id: "de01",
  title: "Đề luyện số 1",
  minutes: 25,
  pass: 120,
  scale: 200,
  sections: [
    {
      kind: "listening",
      zh: "一、听力",
      title: "Phần nghe",
      instructions: "Bấm 🔊 để nghe. Mỗi câu được nghe tối đa 2 lần.",
      groups: [
        {
          instructions: "Nghe câu nói, phán đoán câu có dấu ★ là ĐÚNG hay SAI.",
          questions: [
            { type: "choice", audio: "我每天早上六点起床。", prompt: "★ 他每天六点起床。", pinyin: "Tā měitiān liù diǎn qǐchuáng.", options: TRUE_FALSE, answer: 0, explain: "Nghe: 我每天早上六点起床 – sáng nào tôi cũng dậy lúc 6 giờ → ĐÚNG." },
            { type: "choice", audio: "这件衣服太贵了，我不买了。", prompt: "★ 他买了那件衣服。", pinyin: "Tā mǎi le nà jiàn yīfu.", options: TRUE_FALSE, answer: 1, explain: "Nghe: 太贵了，我不买了 – đắt quá, tôi không mua nữa → SAI." },
            { type: "choice", audio: "我哥哥比我高，他今年二十岁。", prompt: "★ 哥哥比他高。", pinyin: "Gēge bǐ tā gāo.", options: TRUE_FALSE, answer: 0, explain: "我哥哥比我高 – anh trai cao hơn tôi → ĐÚNG." },
            { type: "choice", audio: "路上车很多，我们走路去吧，很近。", prompt: "★ 他们要坐出租车。", pinyin: "Tāmen yào zuò chūzūchē.", options: TRUE_FALSE, answer: 1, explain: "我们走路去吧 – chúng ta đi bộ đi → không đi taxi, SAI." },
          ],
        },
        {
          instructions: "Nghe đoạn hội thoại và câu hỏi, chọn đáp án đúng.",
          questions: [
            { type: "choice", audio: "男：你怎么还没吃饭？女：我等妈妈回来一起吃。问：女的在等谁？", options: ["爸爸", "妈妈", "姐姐"], answer: 1, explain: "我等妈妈回来一起吃 – tôi đợi mẹ về cùng ăn." },
            { type: "choice", audio: "女：你的手机找到了吗？男：找到了，在桌子上。问：手机在哪儿？", options: ["椅子下面", "桌子上", "包里"], answer: 1, explain: "在桌子上 – ở trên bàn." },
            { type: "choice", audio: "男：你今天怎么这么高兴？女：我考试考得很好。问：女的为什么高兴？", options: ["考试考得好", "买了新衣服", "要去旅游"], answer: 0, explain: "我考试考得很好 – tôi thi rất tốt. Bổ ngữ trạng thái: động từ + 得 + 很好." },
            { type: "choice", audio: "女：医生说你要多休息。男：好的，我这两天不去公司了。问：男的怎么了？", options: ["生病了", "很忙", "要出差"], answer: 0, explain: "Bác sĩ dặn nghỉ ngơi nhiều → người nam bị ốm (生病了)." },
          ],
        },
      ],
    },
    {
      kind: "reading",
      zh: "二、阅读",
      title: "Phần đọc",
      instructions: "Đọc kỹ câu hỏi rồi chọn đáp án đúng.",
      groups: [
        {
          instructions: "Chọn từ thích hợp điền vào chỗ trống.",
          questions: [
            { type: "choice", prompt: "他＿＿去北京了，下个月回来。", options: ["已经", "正在", "可能"], answer: 0, explain: "已经…了 – đã … rồi: anh ấy đã đi Bắc Kinh, tháng sau về." },
            { type: "choice", prompt: "＿＿今天下雨，所以我们不去公园了。", options: ["虽然", "因为", "但是"], answer: 1, explain: "Cặp liên từ 因为…所以… – vì … nên …" },
            { type: "choice", prompt: "你的汉语说＿＿真好！", options: ["的", "地", "得"], answer: 2, explain: "Động từ + 得 + bổ ngữ trạng thái: 说得真好 – nói thật hay." },
            { type: "choice", prompt: "这个房间＿＿那个房间大。", options: ["跟", "比", "和"], answer: 1, explain: "Câu so sánh: A 比 B + tính từ – phòng này lớn hơn phòng kia." },
            { type: "choice", prompt: "我昨天看＿＿两个小时的电视。", options: ["了", "过", "着"], answer: 0, explain: "Động từ + 了 + thời lượng: 看了两个小时 – đã xem hai tiếng." },
          ],
        },
        {
          instructions: "Đọc đoạn văn, phán đoán câu có dấu ★ là ĐÚNG hay SAI.",
          questions: [
            { type: "choice", prompt: "我叫王小雨，是一名大学生。我每天骑自行车去学校，大概要二十分钟。\n★ 王小雨每天走路去学校。", options: TRUE_FALSE, answer: 1, explain: "Đoạn văn nói 骑自行车 (đi xe đạp), không phải 走路 (đi bộ) → SAI." },
            { type: "choice", prompt: "今天是妹妹的生日，爸爸妈妈给她买了一个大蛋糕，还送了她一件红色的衣服。\n★ 妹妹收到了生日礼物。", options: TRUE_FALSE, answer: 0, explain: "Em gái được tặng bánh kem và áo đỏ → có quà sinh nhật, ĐÚNG." },
            { type: "choice", prompt: "这家饭店的菜很好吃，也不贵，所以每天来吃饭的人都很多。\n★ 这家饭店人很少。", options: TRUE_FALSE, answer: 1, explain: "每天来吃饭的人都很多 – ngày nào cũng đông khách → SAI." },
            { type: "choice", prompt: "我上午九点有考试，现在已经八点半了，我得快点儿走。\n★ 考试还没开始。", options: TRUE_FALSE, answer: 0, explain: "Bây giờ 8 giờ 30, 9 giờ mới thi → kỳ thi chưa bắt đầu, ĐÚNG." },
          ],
        },
        {
          instructions: "Đọc đoạn văn và trả lời câu hỏi.",
          questions: [
            { type: "choice", prompt: "小王，明天上午的会改到下午三点了，你别忘了。\n问：会议什么时候开？", options: ["明天上午", "明天下午", "今天下午"], answer: 1, explain: "改到下午三点 – dời sang 3 giờ chiều mai." },
            { type: "choice", prompt: "我喜欢运动，以前每天跑步，现在工作太忙了，只能周末去游泳。\n问：他现在什么时候运动？", options: ["每天", "周末", "晚上"], answer: 1, explain: "只能周末去游泳 – chỉ có thể đi bơi vào cuối tuần. 以前 (trước đây) mới chạy bộ hằng ngày." },
            { type: "choice", prompt: "这本书是我从图书馆借的，下星期一要还，你看完了就给我吧。\n问：这本书是谁的？", options: ["说话人的", "图书馆的", "朋友的"], answer: 1, explain: "从图书馆借的 – mượn của thư viện, nên sách là của thư viện." },
          ],
        },
      ],
    },
  ],
};

const HSKK1_DE01: Exam = {
  id: "de01",
  title: "Đề luyện số 1",
  minutes: 15,
  sections: [
    {
      kind: "speaking",
      zh: "第一部分 · 听后重复",
      title: "Nghe – nhắc lại",
      instructions: "Nghe câu (không hiện chữ), sau đó bấm Ghi âm và nhắc lại thật chính xác.",
      groups: [
        {
          instructions: "Nghe và nhắc lại câu vừa nghe.",
          questions: [
            { type: "speak", audio: "我喜欢喝咖啡。", recordSeconds: 10, sample: "我喜欢喝咖啡。", sampleVi: "Tôi thích uống cà phê." },
            { type: "speak", audio: "今天天气很好。", recordSeconds: 10, sample: "今天天气很好。", sampleVi: "Hôm nay thời tiết rất đẹp." },
            { type: "speak", audio: "他是我的同学。", recordSeconds: 10, sample: "他是我的同学。", sampleVi: "Cậu ấy là bạn học của tôi." },
            { type: "speak", audio: "我们一起去吃饭吧。", recordSeconds: 10, sample: "我们一起去吃饭吧。", sampleVi: "Chúng ta cùng đi ăn cơm nhé." },
          ],
        },
      ],
    },
    {
      kind: "speaking",
      zh: "第二部分 · 听后回答",
      title: "Nghe – trả lời",
      instructions: "Nghe câu hỏi rồi trả lời ngắn gọn, đúng ý.",
      groups: [
        {
          instructions: "Nghe câu hỏi và trả lời.",
          questions: [
            { type: "speak", audio: "你叫什么名字？", recordSeconds: 15, sample: "我叫阮兰。", sampleVi: "Tôi tên là Nguyễn Lan." },
            { type: "speak", audio: "你喜欢什么颜色？", recordSeconds: 15, sample: "我喜欢红色。", sampleVi: "Tôi thích màu đỏ." },
            { type: "speak", audio: "你周末常常做什么？", recordSeconds: 15, sample: "我周末常常在家看书，有时候和朋友去公园。", sampleVi: "Cuối tuần tôi thường ở nhà đọc sách, đôi khi đi công viên với bạn." },
          ],
        },
      ],
    },
    {
      kind: "speaking",
      zh: "第三部分 · 回答问题",
      title: "Trả lời câu hỏi",
      instructions: "Đọc câu hỏi, nói ít nhất 5 câu liên quan đến chủ đề.",
      groups: [
        {
          instructions: "Trả lời câu hỏi (nói khoảng 1 phút).",
          questions: [
            {
              type: "speak",
              prompt: "请介绍一下你的家。",
              pinyin: "Qǐng jièshào yíxià nǐ de jiā.",
              audio: "请介绍一下你的家。",
              recordSeconds: 60,
              sample: "我家有四口人：爸爸、妈妈、哥哥和我。爸爸是医生，妈妈是老师。哥哥在大学学习汉语。我是高中生。我很爱我的家。",
              sampleVi: "Nhà tôi có bốn người: bố, mẹ, anh trai và tôi. Bố là bác sĩ, mẹ là giáo viên. Anh trai học tiếng Trung ở đại học. Tôi là học sinh cấp ba. Tôi rất yêu gia đình mình.",
            },
            {
              type: "speak",
              prompt: "你喜欢什么运动？为什么？",
              pinyin: "Nǐ xǐhuan shénme yùndòng? Wèi shénme?",
              audio: "你喜欢什么运动？为什么？",
              recordSeconds: 60,
              sample: "我喜欢游泳。夏天天气很热，游泳很舒服。游泳对身体也很好。我每个星期去游泳两次。有时候我和朋友一起去。",
              sampleVi: "Tôi thích bơi. Mùa hè trời nóng, bơi rất dễ chịu. Bơi cũng tốt cho sức khỏe. Mỗi tuần tôi đi bơi hai lần. Đôi khi tôi đi cùng bạn bè.",
            },
          ],
        },
      ],
    },
  ],
};

/** Các cấp thi thử — `format` là cấu trúc đề thi thật (thông tin công khai), `exams` là đề của trung tâm */
export const LEVELS: Level[] = [
  { id: "hsk20-1", name: "HSK 1 · chuẩn 2.0", format: "Đề thật: 40 câu · khoảng 40 phút", exams: [HSK1_DE01] },
  { id: "hsk20-2", name: "HSK 2 · chuẩn 2.0", format: "Đề thật: 60 câu · khoảng 50 phút", exams: [HSK2_DE01] },
  { id: "hsk20-3", name: "HSK 3 · chuẩn 2.0", format: "Đề thật: 80 câu · nghe – đọc – viết · khoảng 90 phút", exams: [] },
  { id: "hsk20-4", name: "HSK 4 · chuẩn 2.0", format: "Đề thật: 100 câu · nghe – đọc – viết · khoảng 105 phút", exams: [] },
  { id: "hsk20-5", name: "HSK 5 · chuẩn 2.0", format: "Đề thật: 100 câu · nghe – đọc – viết · khoảng 125 phút", exams: [] },
  { id: "hsk20-6", name: "HSK 6 · chuẩn 2.0", format: "Đề thật: 101 câu · nghe – đọc – viết · khoảng 140 phút", exams: [] },
  { id: "hskk-1", name: "HSKK sơ cấp (thi nói) · 2.0", format: "Đề thật: 27 câu · nghe nhắc lại – nghe trả lời – trả lời câu hỏi · khoảng 20 phút", speaking: true, exams: [HSKK1_DE01] },
  { id: "hskk-2", name: "HSKK trung cấp (thi nói) · 2.0", format: "Đề thật: 14 câu · nghe nhắc lại – nhìn tranh nói – trả lời câu hỏi · khoảng 21 phút", speaking: true, exams: [] },
  { id: "hskk-3", name: "HSKK cao cấp (thi nói) · 2.0", format: "Đề thật: 6 câu · nghe nhắc lại – đọc thành tiếng – trả lời câu hỏi · khoảng 24 phút", speaking: true, exams: [] },
  { id: "hsk30-1", name: "HSK 1 · chuẩn 3.0", format: "Nghe – đọc · 500 từ vựng", exams: [] },
  { id: "hsk30-2", name: "HSK 2 · chuẩn 3.0", format: "Nghe – đọc – viết · 1.272 từ vựng", exams: [] },
  { id: "hsk30-3", name: "HSK 3 · chuẩn 3.0", format: "Nghe – đọc – viết · 2.245 từ vựng", exams: [] },
  { id: "hsk30-4", name: "HSK 4 · chuẩn 3.0", format: "Nghe – đọc – viết · 3.245 từ vựng", exams: [] },
  { id: "hsk30-5", name: "HSK 5 · chuẩn 3.0", format: "Nghe – đọc – viết · 4.316 từ vựng", exams: [] },
  { id: "hskk30-3", name: "Thi nói HSK 3.0 · cấp 3", format: "Nghe nhắc lại – nhìn tranh nói – trả lời câu hỏi", speaking: true, exams: [] },
  { id: "hskk30-4", name: "Thi nói HSK 3.0 · cấp 4", format: "Nghe kể lại – nhìn tranh nói – trả lời câu hỏi", speaking: true, exams: [] },
  { id: "hskk30-5", name: "Thi nói HSK 3.0 · cấp 5", format: "Nghe kể lại – nhìn tranh nói – trả lời câu hỏi", speaking: true, exams: [] },
  { id: "hskk30-6", name: "Thi nói HSK 3.0 · cấp 6", format: "Nghe kể lại – nhìn tranh nói – trả lời câu hỏi", speaking: true, exams: [] },
];

export function findLevel(id: string | undefined): Level | undefined {
  return id ? LEVELS.find((l) => l.id === id) : undefined;
}

export function countQuestions(exam: Exam): number {
  return exam.sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.questions.length, 0), 0);
}

/** Danh sách câu hỏi phẳng, đánh số liên tục từ 1 */
export function flatQuestions(exam: Exam): { no: number; section: number; group: number; q: Question }[] {
  const out: { no: number; section: number; group: number; q: Question }[] = [];
  exam.sections.forEach((s, si) =>
    s.groups.forEach((g, gi) => g.questions.forEach((q) => out.push({ no: out.length + 1, section: si, group: gi, q }))),
  );
  return out;
}
