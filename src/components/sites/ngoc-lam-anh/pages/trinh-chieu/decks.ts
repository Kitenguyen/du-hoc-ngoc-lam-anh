// Bài giảng trình chiếu — DỮ LIỆU MẪU do trung tâm Ngọc Lâm Anh tự soạn (2 bài HSK 1 ngắn).
// Thêm bài mới: tạo một object `Deck` theo cấu trúc dưới đây rồi thêm vào mảng DECKS.
//
// Mỗi slide có `type`:
//   cover     – bìa bài học (lấy tiêu đề từ deck)
//   goals     – mục tiêu bài học
//   vocab     – bảng từ mới (bấm dòng để nghe, xem ví dụ)
//   text      – bài khóa / hội thoại (bấm câu để nghe, bật pinyin / nghĩa)
//   grammar   – điểm ngữ pháp: công thức + ví dụ
//   practice  – luyện tập: sắp xếp câu (order), chọn câu đúng (choose), đúng/sai (tf)
//   match     – trò chơi nối từ (dùng từ vựng của deck)
//   homework  – bài tập về nhà
//   end       – kết thúc
// `tips` (không bắt buộc): gợi ý dạy hiện trong khung "Ghi chú giáo viên".

export type Sent = { zh: string; py: string; vi: string };
export type Word = { h: string; p: string; t: string; m: string; ex?: Sent };
export type Line = Sent & { sp?: string; sp_py?: string };
export type Tips = { t?: string; how?: string[]; ask?: string[] };

export type Slide =
  | { type: "cover"; tips?: Tips }
  | { type: "goals"; items: { title: string; text: string; zh?: string }[]; tips?: Tips }
  | { type: "vocab"; title: string; words: Word[]; tips?: Tips }
  | { type: "text"; title: string; title_zh: string; title_vi: string; lines: Line[]; tips?: Tips }
  | {
      type: "grammar";
      title: string;
      title_zh: string;
      usage_zh: string;
      usage_vi: string;
      structures: { f_zh: string; f_vi: string; ex: Sent[] }[];
      tips?: Tips;
    }
  | {
      type: "practice";
      title: string;
      sub: string;
      order?: { vi: string; tiles: string[]; ans: string }[];
      choose?: { vi: string; opts: string[]; a: number }[];
      tf?: { s: string; ok: boolean; fix: string }[];
      tips?: Tips;
    }
  | { type: "match"; title: string; sub?: string; tips?: Tips }
  | { type: "homework"; items: [title: string, text: string][]; tips?: Tips }
  | { type: "end" };

export type Deck = {
  id: string;
  level: string;
  lesson: number;
  title_zh: string;
  title_py: string;
  title_vi: string;
  vocab: Word[];
  slides: Slide[];
};

export const SECTIONS: [key: string, label: string][] = [
  ["kd", "Khởi động"],
  ["tm", "Từ mới"],
  ["bk", "Bài khóa"],
  ["np", "Ngữ pháp"],
  ["lt", "Luyện tập"],
  ["tc", "Trò chơi"],
  ["bt", "BTVN"],
];

export const SECTION_OF: Record<Slide["type"], string> = {
  cover: "kd",
  goals: "kd",
  vocab: "tm",
  text: "bk",
  grammar: "np",
  practice: "lt",
  match: "tc",
  homework: "bt",
  end: "bt",
};

const V1: Word[] = [
  { h: "你", p: "nǐ", t: "đại từ", m: "bạn, anh, chị (ngôi thứ hai)", ex: { zh: "你好！", py: "Nǐ hǎo!", vi: "Chào bạn!" } },
  { h: "好", p: "hǎo", t: "tính từ", m: "tốt, khỏe, hay", ex: { zh: "很好。", py: "Hěn hǎo.", vi: "Rất tốt." } },
  { h: "您", p: "nín", t: "đại từ", m: "ngài, ông, bà (kính trọng)", ex: { zh: "您好！", py: "Nín hǎo!", vi: "Chào ông / bà ạ!" } },
  { h: "你们", p: "nǐmen", t: "đại từ", m: "các bạn", ex: { zh: "你们好！", py: "Nǐmen hǎo!", vi: "Chào các bạn!" } },
  { h: "老师", p: "lǎoshī", t: "danh từ", m: "giáo viên, thầy / cô", ex: { zh: "老师好！", py: "Lǎoshī hǎo!", vi: "Em chào thầy / cô ạ!" } },
  { h: "谢谢", p: "xièxie", t: "động từ", m: "cảm ơn", ex: { zh: "谢谢你！", py: "Xièxie nǐ!", vi: "Cảm ơn bạn!" } },
  { h: "不客气", p: "bú kèqi", t: "cụm từ", m: "đừng khách sáo, không có gì" },
  { h: "对不起", p: "duìbuqǐ", t: "động từ", m: "xin lỗi" },
  { h: "没关系", p: "méi guānxi", t: "cụm từ", m: "không sao, không có gì" },
  { h: "再见", p: "zàijiàn", t: "động từ", m: "tạm biệt", ex: { zh: "老师，再见！", py: "Lǎoshī, zàijiàn!", vi: "Em chào thầy / cô ạ! (khi về)" } },
];

const V2: Word[] = [
  { h: "家", p: "jiā", t: "danh từ", m: "nhà, gia đình", ex: { zh: "我家在河内。", py: "Wǒ jiā zài Hénèi.", vi: "Nhà tôi ở Hà Nội." } },
  { h: "有", p: "yǒu", t: "động từ", m: "có", ex: { zh: "我有一个哥哥。", py: "Wǒ yǒu yí ge gēge.", vi: "Tôi có một anh trai." } },
  { h: "没有", p: "méiyǒu", t: "động từ", m: "không có", ex: { zh: "我没有妹妹。", py: "Wǒ méiyǒu mèimei.", vi: "Tôi không có em gái." } },
  { h: "几", p: "jǐ", t: "đại từ", m: "mấy (hỏi số lượng nhỏ)", ex: { zh: "你有几个妹妹？", py: "Nǐ yǒu jǐ ge mèimei?", vi: "Bạn có mấy em gái?" } },
  { h: "口", p: "kǒu", t: "lượng từ", m: "(lượng từ đếm người trong gia đình)", ex: { zh: "我家有三口人。", py: "Wǒ jiā yǒu sān kǒu rén.", vi: "Nhà tôi có ba người." } },
  { h: "人", p: "rén", t: "danh từ", m: "người" },
  { h: "谁", p: "shéi", t: "đại từ", m: "ai", ex: { zh: "他是谁？", py: "Tā shì shéi?", vi: "Anh ấy là ai?" } },
  { h: "都", p: "dōu", t: "phó từ", m: "đều, tất cả" },
  { h: "爸爸", p: "bàba", t: "danh từ", m: "bố" },
  { h: "妈妈", p: "māma", t: "danh từ", m: "mẹ" },
  { h: "哥哥", p: "gēge", t: "danh từ", m: "anh trai" },
  { h: "妹妹", p: "mèimei", t: "danh từ", m: "em gái" },
  { h: "和", p: "hé", t: "liên từ", m: "và" },
];

export const DECKS: Deck[] = [
  {
    id: "hsk1-chao-hoi",
    level: "HSK 1",
    lesson: 1,
    title_zh: "你好！",
    title_py: "Nǐ hǎo!",
    title_vi: "Xin chào!",
    vocab: V1,
    slides: [
      {
        type: "cover",
        tips: { t: "2 phút", how: ["Chào lớp bằng tiếng Trung, cho cả lớp đọc theo tên bài 2 lần.", "Giới thiệu: hôm nay học cách chào hỏi, cảm ơn, xin lỗi, tạm biệt."], ask: ["你好！"] },
      },
      {
        type: "goals",
        items: [
          { title: "Giao tiếp", text: "Chào hỏi bạn bè, thầy cô; cảm ơn – đáp lời cảm ơn; xin lỗi – đáp lời xin lỗi; chào tạm biệt.", zh: "你好！· 谢谢！· 对不起！· 再见！" },
          { title: "Từ vựng", text: "10 từ và cụm từ giao tiếp cơ bản.", zh: "你 · 好 · 您 · 老师 · 谢谢 …" },
          { title: "Ngữ pháp", text: "Mẫu câu chào: danh xưng + 好.", zh: "老师好！" },
        ],
      },
      {
        type: "vocab",
        title: "Từ mới · 生词",
        words: V1,
        tips: { t: "8 phút", how: ["Lượt 1: bấm “Nghe từ mới”, học viên nghe và nhìn.", "Lượt 2: giáo viên đọc, cả lớp đọc theo; gọi tên ngẫu nhiên đọc lại.", "Bấm từng dòng để hiện ví dụ."] },
      },
      {
        type: "text",
        title: "Bài khóa · 课文",
        title_zh: "在教室",
        title_vi: "Trong lớp học",
        lines: [
          { sp: "学生", sp_py: "xuésheng", zh: "老师好！", py: "Lǎoshī hǎo!", vi: "Em chào cô ạ!" },
          { sp: "老师", sp_py: "lǎoshī", zh: "你们好！", py: "Nǐmen hǎo!", vi: "Chào các em!" },
          { sp: "小林", sp_py: "Xiǎo Lín", zh: "对不起！", py: "Duìbuqǐ!", vi: "Xin lỗi!" },
          { sp: "小英", sp_py: "Xiǎo Yīng", zh: "没关系。", py: "Méi guānxi.", vi: "Không sao." },
          { sp: "小林", sp_py: "Xiǎo Lín", zh: "谢谢！", py: "Xièxie!", vi: "Cảm ơn!" },
          { sp: "小英", sp_py: "Xiǎo Yīng", zh: "不客气。再见！", py: "Bú kèqi. Zàijiàn!", vi: "Không có gì. Tạm biệt!" },
        ],
        tips: { t: "10 phút", how: ["Nghe toàn bài, không bật pinyin / nghĩa.", "Bấm từng câu: nghe và đọc theo.", "Phân vai đọc: dùng “Gọi tên” chọn 2 học viên."] },
      },
      {
        type: "grammar",
        title: "Ngữ pháp · Lời chào với 好",
        title_zh: "称呼 + 好！",
        usage_zh: "见面打招呼时，在称呼后面加“好”。",
        usage_vi: "Khi gặp mặt chào hỏi, thêm 好 sau danh xưng của người được chào.",
        structures: [
          {
            f_zh: "你 / 您 / 你们 + 好！",
            f_vi: "Chào một người / người lớn tuổi (kính trọng) / nhiều người",
            ex: [
              { zh: "您好！", py: "Nín hǎo!", vi: "Chào ông / bà ạ!" },
              { zh: "你们好！", py: "Nǐmen hǎo!", vi: "Chào các bạn!" },
            ],
          },
          {
            f_zh: "称呼 + 好！",
            f_vi: "Danh xưng (老师, 大家…) + 好",
            ex: [
              { zh: "老师好！", py: "Lǎoshī hǎo!", vi: "Em chào thầy / cô ạ!" },
              { zh: "大家好！", py: "Dàjiā hǎo!", vi: "Chào mọi người!" },
            ],
          },
        ],
        tips: { t: "8 phút", how: ["Cho học viên đoán quy tắc từ bài khóa.", "Mỗi học viên chào 1 người khác trong lớp theo công thức."] },
      },
      {
        type: "practice",
        title: "Luyện tập",
        sub: "Sắp xếp câu · chọn câu đáp · đúng hay sai",
        order: [
          { vi: "Chào các em!", tiles: ["好", "你们"], ans: "你们好" },
          { vi: "Không sao.", tiles: ["关系", "没"], ans: "没关系" },
          { vi: "Tạm biệt thầy ạ!", tiles: ["再见", "老师"], ans: "老师再见" },
        ],
        choose: [
          { vi: "A：谢谢！ B：……", opts: ["不客气。", "对不起。", "你好！"], a: 0 },
          { vi: "A：对不起！ B：……", opts: ["再见！", "没关系。", "谢谢！"], a: 1 },
        ],
        tf: [
          { s: "A：谢谢！ B：没关系。", ok: false, fix: "Đáp lời cảm ơn dùng 不客气；没关系 dùng để đáp lời xin lỗi." },
          { s: "学生：老师好！", ok: true, fix: "Đúng: học sinh chào giáo viên." },
        ],
        tips: { t: "8 phút", how: ["Chia 2 đội, đội làm đúng trước được +1 điểm (nút Điểm)."] },
      },
      { type: "match", title: "Trò chơi · Nối từ", sub: "Bấm chữ Hán, rồi bấm nghĩa đúng", tips: { t: "4 phút", how: ["Gọi 2 đội lên thi, đội nhanh và ít sai hơn thắng."] } },
      {
        type: "homework",
        items: [
          ["Từ mới", "Mỗi từ viết 1 dòng chữ Hán kèm phiên âm."],
          ["Đọc bài khóa", "Đọc to bài khóa 3 lần, ghi âm 1 lần gửi giáo viên."],
          ["Đóng vai", "Cùng bạn luyện chào hỏi – cảm ơn – xin lỗi – tạm biệt."],
        ],
      },
      { type: "end" },
    ],
  },
  {
    id: "hsk1-gia-dinh",
    level: "HSK 1",
    lesson: 2,
    title_zh: "你家有几口人？",
    title_py: "Nǐ jiā yǒu jǐ kǒu rén?",
    title_vi: "Nhà bạn có mấy người?",
    vocab: V2,
    slides: [
      { type: "cover", tips: { t: "2 phút", how: ["Hỏi nhanh: 你家有几口人？ — cho học viên đoán nghĩa."] } },
      {
        type: "goals",
        items: [
          { title: "Giao tiếp", text: "Hỏi và trả lời về số người, các thành viên trong gia đình.", zh: "你家有几口人？" },
          { title: "Từ vựng", text: "13 từ về gia đình và số lượng.", zh: "家 · 有 · 几 · 口 · 爸爸 · 妈妈 …" },
          { title: "Ngữ pháp", text: "Câu có 有 / 没有; hỏi số lượng bằng 几.", zh: "我没有妹妹。" },
        ],
      },
      { type: "vocab", title: "Từ mới · 生词", words: V2 },
      {
        type: "text",
        title: "Bài khóa · 课文",
        title_zh: "我的家",
        title_vi: "Gia đình tôi",
        lines: [
          { sp: "小林", sp_py: "Xiǎo Lín", zh: "你家有几口人？", py: "Nǐ jiā yǒu jǐ kǒu rén?", vi: "Nhà bạn có mấy người?" },
          { sp: "小英", sp_py: "Xiǎo Yīng", zh: "我家有四口人。", py: "Wǒ jiā yǒu sì kǒu rén.", vi: "Nhà mình có bốn người." },
          { sp: "小林", sp_py: "Xiǎo Lín", zh: "都有谁？", py: "Dōu yǒu shéi?", vi: "Gồm những ai?" },
          { sp: "小英", sp_py: "Xiǎo Yīng", zh: "爸爸、妈妈、哥哥和我。你有妹妹吗？", py: "Bàba, māma, gēge hé wǒ. Nǐ yǒu mèimei ma?", vi: "Bố, mẹ, anh trai và mình. Bạn có em gái không?" },
          { sp: "小林", sp_py: "Xiǎo Lín", zh: "我没有妹妹，我有一个哥哥。", py: "Wǒ méiyǒu mèimei, wǒ yǒu yí ge gēge.", vi: "Mình không có em gái, mình có một anh trai." },
        ],
      },
      {
        type: "grammar",
        title: "Ngữ pháp 1 · 有 / 没有",
        title_zh: "有 / 没有",
        usage_zh: "“有”表示拥有；否定用“没有”，不说“不有”。",
        usage_vi: "有 = có; phủ định là 没有, không nói 不有.",
        structures: [
          { f_zh: "主语 + 有 + 名词", f_vi: "Chủ ngữ + 有 + danh từ", ex: [{ zh: "我有一个哥哥。", py: "Wǒ yǒu yí ge gēge.", vi: "Tôi có một anh trai." }] },
          { f_zh: "主语 + 没有 + 名词", f_vi: "Chủ ngữ + 没有 + danh từ", ex: [{ zh: "我没有妹妹。", py: "Wǒ méiyǒu mèimei.", vi: "Tôi không có em gái." }] },
        ],
      },
      {
        type: "grammar",
        title: "Ngữ pháp 2 · Hỏi số lượng với 几",
        title_zh: "几 + 量词 + 名词？",
        usage_zh: "“几”用来问十以下的数量，后面要加量词。",
        usage_vi: "几 hỏi số lượng nhỏ (thường dưới 10), phía sau cần lượng từ.",
        structures: [
          {
            f_zh: "几 + 量词 + 名词？",
            f_vi: "Mấy + lượng từ + danh từ?",
            ex: [
              { zh: "你家有几口人？", py: "Nǐ jiā yǒu jǐ kǒu rén?", vi: "Nhà bạn có mấy người?" },
              { zh: "你有几个妹妹？", py: "Nǐ yǒu jǐ ge mèimei?", vi: "Bạn có mấy em gái?" },
            ],
          },
        ],
      },
      {
        type: "practice",
        title: "Luyện tập",
        sub: "有 / 没有 · 几",
        order: [
          { vi: "Nhà tôi có ba người.", tiles: ["三口人", "我家", "有"], ans: "我家有三口人" },
          { vi: "Bạn có mấy anh trai?", tiles: ["几个", "你", "哥哥", "有"], ans: "你有几个哥哥" },
        ],
        choose: [{ vi: "Tôi không có em gái.", opts: ["我不有妹妹。", "我没有妹妹。", "我妹妹没有。"], a: 1 }],
        tf: [
          { s: "我不有哥哥。", ok: false, fix: "我没有哥哥。— phủ định của 有 là 没有." },
          { s: "你家有几口人？", ok: true, fix: "Đúng: 几 + 口 + 人." },
        ],
      },
      { type: "match", title: "Trò chơi · Nối từ", sub: "Bấm chữ Hán, rồi bấm nghĩa đúng" },
      {
        type: "homework",
        items: [
          ["Từ mới", "Học thuộc 13 từ mới, mỗi từ viết 1 dòng."],
          ["Giới thiệu gia đình", "Viết 4–5 câu giới thiệu gia đình em, dùng 有 / 没有."],
          ["Hỏi bạn", "Hỏi 3 bạn trong lớp: 你家有几口人？ và ghi lại câu trả lời."],
        ],
      },
      { type: "end" },
    ],
  },
];
