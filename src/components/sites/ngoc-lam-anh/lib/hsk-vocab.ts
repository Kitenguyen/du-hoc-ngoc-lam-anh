// Từ vựng HSK dùng chung cho các công cụ học: /tu-vung, /tro-choi, /luyen-noi.
// Danh sách từ theo chuẩn HSK công khai (HSK 2.0: cấp 1 = 150 từ, cấp 2 = 150 từ mới).
// Nghĩa tiếng Việt và cách chia nhóm do trung tâm Ngọc Lâm Anh tự soạn.
//
// THÊM DỮ LIỆU: mỗi nhóm là một mảng [chữ Hán, pinyin có dấu, nghĩa tiếng Việt].
// Muốn mở cấp mới (HSK3…), thêm các nhóm vào `RAW_GROUPS` với `level` tương ứng
// rồi đổi `status` của cấp đó trong `LEVEL_META` thành "ready" hoặc "partial".

export type HskLevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type HskWord = {
  /** id ổn định: "<cấp>-<chữ Hán>" */
  id: string;
  /** chữ Hán */
  h: string;
  /** pinyin có dấu thanh */
  p: string;
  /** nghĩa tiếng Việt */
  m: string;
  level: HskLevelId;
  /** id nhóm/bài */
  group: string;
};

export type HskGroup = {
  id: string;
  level: HskLevelId;
  /** số thứ tự nhóm trong cấp */
  no: number;
  name: string;
  zh: string;
  words: HskWord[];
};

export type HskLevel = {
  level: HskLevelId;
  name: string;
  zh: string;
  /** ready = đủ từ; partial = đang bổ sung; soon = chưa có dữ liệu */
  status: "ready" | "partial" | "soon";
  /** số từ mới của cấp theo chuẩn (để hiển thị) */
  official: number;
  groups: HskGroup[];
  words: HskWord[];
};

type Row = readonly [h: string, p: string, m: string];
type RawGroup = { level: HskLevelId; slug: string; name: string; zh: string; rows: Row[] };

const RAW_GROUPS: RawGroup[] = [
  /* ===================== HSK 1 ===================== */
  {
    level: 1,
    slug: "chao-hoi",
    name: "Chào hỏi – lịch sự",
    zh: "问候礼貌",
    rows: [
      ["你", "nǐ", "bạn, anh, chị (ngôi thứ hai)"],
      ["我", "wǒ", "tôi, mình"],
      ["他", "tā", "anh ấy, ông ấy"],
      ["她", "tā", "cô ấy, chị ấy"],
      ["我们", "wǒmen", "chúng tôi, chúng ta"],
      ["好", "hǎo", "tốt, khỏe, hay"],
      ["谢谢", "xièxie", "cảm ơn"],
      ["不客气", "bú kèqi", "không có gì, đừng khách sáo"],
      ["对不起", "duìbuqǐ", "xin lỗi"],
      ["没关系", "méi guānxi", "không sao, không có gì"],
      ["再见", "zàijiàn", "tạm biệt"],
      ["请", "qǐng", "mời; xin (lịch sự)"],
      ["喂", "wèi", "a lô (khi gọi điện)"],
    ],
  },
  {
    level: 1,
    slug: "con-nguoi",
    name: "Con người – gia đình",
    zh: "人和家庭",
    rows: [
      ["爸爸", "bàba", "bố, ba"],
      ["妈妈", "māma", "mẹ, má"],
      ["儿子", "érzi", "con trai"],
      ["女儿", "nǚ'ér", "con gái"],
      ["家", "jiā", "nhà, gia đình"],
      ["人", "rén", "người"],
      ["朋友", "péngyou", "bạn bè"],
      ["同学", "tóngxué", "bạn học"],
      ["老师", "lǎoshī", "thầy giáo, cô giáo"],
      ["学生", "xuésheng", "học sinh, sinh viên"],
      ["医生", "yīshēng", "bác sĩ"],
      ["先生", "xiānsheng", "ông, ngài; chồng"],
      ["小姐", "xiǎojiě", "cô (gọi phụ nữ trẻ)"],
      ["名字", "míngzi", "tên"],
      ["叫", "jiào", "gọi; tên là"],
      ["认识", "rènshi", "quen biết, nhận ra"],
    ],
  },
  {
    level: 1,
    slug: "so-dem",
    name: "Số đếm – lượng từ",
    zh: "数字量词",
    rows: [
      ["一", "yī", "một"],
      ["二", "èr", "hai"],
      ["三", "sān", "ba"],
      ["四", "sì", "bốn"],
      ["五", "wǔ", "năm"],
      ["六", "liù", "sáu"],
      ["七", "qī", "bảy"],
      ["八", "bā", "tám"],
      ["九", "jiǔ", "chín"],
      ["十", "shí", "mười"],
      ["零", "líng", "số không"],
      ["几", "jǐ", "mấy (hỏi số lượng nhỏ)"],
      ["多少", "duōshao", "bao nhiêu"],
      ["个", "gè", "cái, chiếc (lượng từ chung)"],
      ["本", "běn", "quyển, cuốn (lượng từ)"],
      ["块", "kuài", "đồng (tiền); miếng"],
      ["些", "xiē", "một vài, những"],
      ["岁", "suì", "tuổi"],
    ],
  },
  {
    level: 1,
    slug: "thoi-gian",
    name: "Ngày giờ – thời gian",
    zh: "时间日期",
    rows: [
      ["今天", "jīntiān", "hôm nay"],
      ["明天", "míngtiān", "ngày mai"],
      ["昨天", "zuótiān", "hôm qua"],
      ["年", "nián", "năm"],
      ["月", "yuè", "tháng; mặt trăng"],
      ["日", "rì", "ngày; mặt trời"],
      ["星期", "xīngqī", "tuần, thứ (trong tuần)"],
      ["点", "diǎn", "giờ; điểm, chấm"],
      ["分钟", "fēnzhōng", "phút"],
      ["现在", "xiànzài", "bây giờ"],
      ["时候", "shíhou", "lúc, khi"],
      ["上午", "shàngwǔ", "buổi sáng"],
      ["中午", "zhōngwǔ", "buổi trưa"],
      ["下午", "xiàwǔ", "buổi chiều"],
    ],
  },
  {
    level: 1,
    slug: "an-uong",
    name: "Ăn uống",
    zh: "吃喝",
    rows: [
      ["吃", "chī", "ăn"],
      ["喝", "hē", "uống"],
      ["菜", "cài", "món ăn; rau"],
      ["茶", "chá", "trà"],
      ["水", "shuǐ", "nước"],
      ["米饭", "mǐfàn", "cơm"],
      ["苹果", "píngguǒ", "quả táo"],
      ["水果", "shuǐguǒ", "hoa quả, trái cây"],
      ["杯子", "bēizi", "cái cốc, cái ly"],
      ["饭店", "fàndiàn", "nhà hàng; khách sạn"],
    ],
  },
  {
    level: 1,
    slug: "do-vat",
    name: "Mua sắm – đồ vật",
    zh: "购物用品",
    rows: [
      ["买", "mǎi", "mua"],
      ["钱", "qián", "tiền"],
      ["东西", "dōngxi", "đồ vật, đồ đạc"],
      ["衣服", "yīfu", "quần áo"],
      ["商店", "shāngdiàn", "cửa hàng"],
      ["桌子", "zhuōzi", "cái bàn"],
      ["椅子", "yǐzi", "cái ghế"],
      ["电脑", "diànnǎo", "máy tính"],
      ["电视", "diànshì", "ti vi"],
      ["书", "shū", "sách"],
      ["字", "zì", "chữ"],
    ],
  },
  {
    level: 1,
    slug: "noi-chon",
    name: "Nơi chốn – phương hướng",
    zh: "地点方位",
    rows: [
      ["北京", "Běijīng", "Bắc Kinh"],
      ["中国", "Zhōngguó", "Trung Quốc"],
      ["学校", "xuéxiào", "trường học"],
      ["医院", "yīyuàn", "bệnh viện"],
      ["火车站", "huǒchēzhàn", "ga tàu hỏa"],
      ["哪儿", "nǎr", "ở đâu"],
      ["那儿", "nàr", "chỗ kia, ở đó"],
      ["这儿", "zhèr", "chỗ này, ở đây"],
      ["里", "lǐ", "trong, bên trong"],
      ["上", "shàng", "trên; lên"],
      ["下", "xià", "dưới; xuống"],
      ["前面", "qiánmiàn", "phía trước"],
      ["后面", "hòumiàn", "phía sau"],
      ["在", "zài", "ở, tại; đang"],
      ["住", "zhù", "ở, sống"],
    ],
  },
  {
    level: 1,
    slug: "hoat-dong",
    name: "Đi lại – hoạt động",
    zh: "出行活动",
    rows: [
      ["去", "qù", "đi"],
      ["来", "lái", "đến, tới"],
      ["回", "huí", "về, trở về"],
      ["坐", "zuò", "ngồi; đi (xe, máy bay)"],
      ["开", "kāi", "mở; lái (xe)"],
      ["出租车", "chūzūchē", "xe taxi"],
      ["飞机", "fēijī", "máy bay"],
      ["打电话", "dǎ diànhuà", "gọi điện thoại"],
      ["看", "kàn", "xem, nhìn"],
      ["看见", "kànjiàn", "nhìn thấy"],
      ["听", "tīng", "nghe"],
      ["说", "shuō", "nói"],
      ["读", "dú", "đọc"],
      ["写", "xiě", "viết"],
      ["做", "zuò", "làm"],
      ["工作", "gōngzuò", "làm việc; công việc"],
      ["学习", "xuéxí", "học tập"],
      ["睡觉", "shuìjiào", "ngủ"],
    ],
  },
  {
    level: 1,
    slug: "cam-xuc",
    name: "Cảm xúc – thời tiết",
    zh: "感情天气",
    rows: [
      ["爱", "ài", "yêu"],
      ["喜欢", "xǐhuan", "thích"],
      ["想", "xiǎng", "muốn; nhớ; nghĩ"],
      ["高兴", "gāoxìng", "vui vẻ"],
      ["大", "dà", "to, lớn"],
      ["小", "xiǎo", "nhỏ, bé"],
      ["多", "duō", "nhiều"],
      ["少", "shǎo", "ít"],
      ["冷", "lěng", "lạnh"],
      ["热", "rè", "nóng"],
      ["漂亮", "piàoliang", "xinh đẹp"],
      ["天气", "tiānqì", "thời tiết"],
      ["下雨", "xià yǔ", "mưa (trời mưa)"],
      ["很", "hěn", "rất"],
      ["太", "tài", "quá, lắm"],
      ["猫", "māo", "con mèo"],
      ["狗", "gǒu", "con chó"],
      ["电影", "diànyǐng", "phim, điện ảnh"],
    ],
  },
  {
    level: 1,
    slug: "ngu-phap",
    name: "Từ để hỏi – từ ngữ pháp",
    zh: "疑问词虚词",
    rows: [
      ["是", "shì", "là"],
      ["有", "yǒu", "có"],
      ["没", "méi", "không (có), chưa"],
      ["不", "bù", "không"],
      ["的", "de", "của (trợ từ)"],
      ["了", "le", "rồi (trợ từ hoàn thành)"],
      ["吗", "ma", "không? (trợ từ nghi vấn)"],
      ["呢", "ne", "thì sao? (trợ từ hỏi)"],
      ["都", "dōu", "đều"],
      ["和", "hé", "và, với"],
      ["会", "huì", "biết (làm); sẽ"],
      ["能", "néng", "có thể"],
      ["什么", "shénme", "cái gì"],
      ["谁", "shéi", "ai"],
      ["哪", "nǎ", "nào"],
      ["那", "nà", "kia, đó"],
      ["这", "zhè", "này, đây"],
      ["怎么", "zěnme", "thế nào, sao"],
      ["怎么样", "zěnmeyàng", "thế nào, ra sao"],
      ["汉语", "Hànyǔ", "tiếng Hán, tiếng Trung"],
      ["一点儿", "yìdiǎnr", "một chút"],
    ],
  },

  /* ===================== HSK 2 ===================== */
  {
    level: 2,
    slug: "gia-dinh",
    name: "Gia đình – con người",
    zh: "家人身体",
    rows: [
      ["哥哥", "gēge", "anh trai"],
      ["姐姐", "jiějie", "chị gái"],
      ["弟弟", "dìdi", "em trai"],
      ["妹妹", "mèimei", "em gái"],
      ["丈夫", "zhàngfu", "chồng"],
      ["妻子", "qīzi", "vợ"],
      ["孩子", "háizi", "đứa trẻ, con"],
      ["男", "nán", "nam, đàn ông"],
      ["女", "nǚ", "nữ, phụ nữ"],
      ["大家", "dàjiā", "mọi người"],
      ["您", "nín", "ngài, ông, bà (kính trọng)"],
      ["它", "tā", "nó (đồ vật, con vật)"],
      ["服务员", "fúwùyuán", "nhân viên phục vụ"],
      ["身体", "shēntǐ", "cơ thể, sức khỏe"],
      ["眼睛", "yǎnjing", "mắt"],
    ],
  },
  {
    level: 2,
    slug: "thoi-gian-2",
    name: "Thời gian – tần suất",
    zh: "时间频率",
    rows: [
      ["早上", "zǎoshang", "buổi sáng sớm"],
      ["晚上", "wǎnshang", "buổi tối"],
      ["去年", "qùnián", "năm ngoái"],
      ["小时", "xiǎoshí", "tiếng, giờ đồng hồ"],
      ["时间", "shíjiān", "thời gian"],
      ["生日", "shēngrì", "sinh nhật"],
      ["号", "hào", "ngày (trong tháng); số"],
      ["每", "měi", "mỗi"],
      ["次", "cì", "lần (lượng từ)"],
      ["第一", "dì-yī", "thứ nhất"],
      ["已经", "yǐjīng", "đã"],
      ["正在", "zhèngzài", "đang"],
      ["开始", "kāishǐ", "bắt đầu"],
      ["完", "wán", "xong, hết"],
    ],
  },
  {
    level: 2,
    slug: "mua-ban",
    name: "Ăn uống – mua bán",
    zh: "饮食买卖",
    rows: [
      ["鸡蛋", "jīdàn", "trứng gà"],
      ["面条", "miàntiáo", "mì sợi"],
      ["牛奶", "niúnǎi", "sữa bò"],
      ["咖啡", "kāfēi", "cà phê"],
      ["羊肉", "yángròu", "thịt cừu"],
      ["鱼", "yú", "cá"],
      ["西瓜", "xīguā", "dưa hấu"],
      ["好吃", "hǎochī", "ngon"],
      ["卖", "mài", "bán"],
      ["贵", "guì", "đắt"],
      ["便宜", "piányi", "rẻ"],
      ["元", "yuán", "đồng (nhân dân tệ)"],
      ["件", "jiàn", "chiếc, việc (lượng từ)"],
      ["张", "zhāng", "tờ, tấm (lượng từ)"],
      ["票", "piào", "vé"],
    ],
  },
  {
    level: 2,
    slug: "mau-sac",
    name: "Màu sắc – thời tiết – tính chất",
    zh: "颜色天气",
    rows: [
      ["白", "bái", "trắng"],
      ["黑", "hēi", "đen"],
      ["红", "hóng", "đỏ"],
      ["颜色", "yánsè", "màu sắc"],
      ["晴", "qíng", "nắng, trời quang"],
      ["阴", "yīn", "râm, trời u ám"],
      ["雪", "xuě", "tuyết"],
      ["长", "cháng", "dài"],
      ["高", "gāo", "cao"],
      ["新", "xīn", "mới"],
      ["快", "kuài", "nhanh"],
      ["慢", "màn", "chậm"],
    ],
  },
  {
    level: 2,
    slug: "di-lai",
    name: "Đi lại – nơi chốn",
    zh: "交通地点",
    rows: [
      ["机场", "jīchǎng", "sân bay"],
      ["宾馆", "bīnguǎn", "khách sạn"],
      ["公司", "gōngsī", "công ty"],
      ["教室", "jiàoshì", "phòng học"],
      ["房间", "fángjiān", "phòng"],
      ["门", "mén", "cửa"],
      ["路", "lù", "đường"],
      ["公共汽车", "gōnggòng qìchē", "xe buýt"],
      ["自行车", "zìxíngchē", "xe đạp"],
      ["旁边", "pángbiān", "bên cạnh"],
      ["左边", "zuǒbian", "bên trái"],
      ["右边", "yòubian", "bên phải"],
      ["外", "wài", "ngoài, bên ngoài"],
      ["离", "lí", "cách (khoảng cách)"],
      ["远", "yuǎn", "xa"],
      ["近", "jìn", "gần"],
      ["走", "zǒu", "đi bộ; rời đi"],
      ["到", "dào", "đến"],
      ["出", "chū", "ra"],
      ["进", "jìn", "vào"],
      ["向", "xiàng", "hướng về, về phía"],
      ["从", "cóng", "từ"],
    ],
  },
  {
    level: 2,
    slug: "so-thich",
    name: "Sở thích – sinh hoạt",
    zh: "爱好生活",
    rows: [
      ["打篮球", "dǎ lánqiú", "chơi bóng rổ"],
      ["踢足球", "tī zúqiú", "đá bóng"],
      ["跑步", "pǎobù", "chạy bộ"],
      ["游泳", "yóuyǒng", "bơi"],
      ["跳舞", "tiàowǔ", "nhảy múa"],
      ["唱歌", "chànggē", "hát"],
      ["旅游", "lǚyóu", "du lịch"],
      ["运动", "yùndòng", "vận động, thể thao"],
      ["玩", "wán", "chơi"],
      ["休息", "xiūxi", "nghỉ ngơi"],
      ["起床", "qǐchuáng", "thức dậy"],
      ["上班", "shàngbān", "đi làm"],
      ["洗", "xǐ", "rửa, giặt"],
      ["穿", "chuān", "mặc, đi (giày)"],
      ["手表", "shǒubiǎo", "đồng hồ đeo tay"],
      ["手机", "shǒujī", "điện thoại di động"],
      ["报纸", "bàozhǐ", "báo giấy"],
    ],
  },
  {
    level: 2,
    slug: "hoc-tap",
    name: "Học tập – giao tiếp",
    zh: "学习交流",
    rows: [
      ["考试", "kǎoshì", "thi, kỳ thi"],
      ["课", "kè", "bài học, tiết học"],
      ["题", "tí", "đề, câu hỏi (bài tập)"],
      ["问题", "wèntí", "câu hỏi; vấn đề"],
      ["回答", "huídá", "trả lời"],
      ["问", "wèn", "hỏi"],
      ["告诉", "gàosu", "nói cho biết"],
      ["介绍", "jièshào", "giới thiệu"],
      ["懂", "dǒng", "hiểu"],
      ["知道", "zhīdào", "biết"],
      ["意思", "yìsi", "ý nghĩa"],
      ["错", "cuò", "sai"],
      ["对", "duì", "đúng; đối với"],
      ["帮助", "bāngzhù", "giúp đỡ"],
      ["准备", "zhǔnbèi", "chuẩn bị"],
      ["希望", "xīwàng", "hy vọng"],
      ["觉得", "juéde", "cảm thấy"],
      ["找", "zhǎo", "tìm"],
      ["送", "sòng", "tặng; tiễn"],
      ["给", "gěi", "cho, đưa"],
      ["让", "ràng", "để, bảo, khiến"],
      ["等", "děng", "đợi"],
      ["笑", "xiào", "cười"],
    ],
  },
  {
    level: 2,
    slug: "suc-khoe",
    name: "Sức khỏe – cảm xúc",
    zh: "健康心情",
    rows: [
      ["生病", "shēngbìng", "bị ốm"],
      ["药", "yào", "thuốc"],
      ["累", "lèi", "mệt"],
      ["忙", "máng", "bận"],
      ["快乐", "kuàilè", "vui vẻ, hạnh phúc"],
      ["欢迎", "huānyíng", "hoan nghênh, chào mừng"],
      ["事情", "shìqing", "sự việc, chuyện"],
      ["姓", "xìng", "họ (tên họ)"],
    ],
  },
  {
    level: 2,
    slug: "ngu-phap-2",
    name: "Từ ngữ pháp – số lớn",
    zh: "虚词数字",
    rows: [
      ["吧", "ba", "nhé, nhỉ (trợ từ)"],
      ["别", "bié", "đừng"],
      ["比", "bǐ", "so với, hơn"],
      ["得", "de", "(trợ từ bổ ngữ mức độ)"],
      ["过", "guo", "đã từng (trợ từ)"],
      ["着", "zhe", "đang, … (trợ từ tiếp diễn)"],
      ["还", "hái", "còn, vẫn"],
      ["就", "jiù", "thì, liền, ngay"],
      ["也", "yě", "cũng"],
      ["再", "zài", "lại, nữa"],
      ["最", "zuì", "nhất"],
      ["真", "zhēn", "thật, thật là"],
      ["非常", "fēicháng", "vô cùng, rất"],
      ["可能", "kěnéng", "có thể, có lẽ"],
      ["可以", "kěyǐ", "có thể, được phép"],
      ["要", "yào", "muốn; cần; sắp"],
      ["因为", "yīnwèi", "bởi vì"],
      ["所以", "suǒyǐ", "cho nên"],
      ["为什么", "wèi shénme", "tại sao"],
      ["一起", "yìqǐ", "cùng nhau"],
      ["两", "liǎng", "hai (dùng trước lượng từ)"],
      ["百", "bǎi", "trăm"],
      ["千", "qiān", "nghìn"],
    ],
  },
];

const LEVEL_META: { level: HskLevelId; name: string; zh: string; status: HskLevel["status"]; official: number }[] = [
  { level: 1, name: "HSK 1", zh: "一级", status: "ready", official: 150 },
  { level: 2, name: "HSK 2", zh: "二级", status: "ready", official: 150 },
  { level: 3, name: "HSK 3", zh: "三级", status: "soon", official: 300 },
  { level: 4, name: "HSK 4", zh: "四级", status: "soon", official: 600 },
  { level: 5, name: "HSK 5", zh: "五级", status: "soon", official: 1300 },
  { level: 6, name: "HSK 6", zh: "六级", status: "soon", official: 2500 },
];

function build(): HskLevel[] {
  return LEVEL_META.map((meta) => {
    const raws = RAW_GROUPS.filter((g) => g.level === meta.level);
    const groups: HskGroup[] = raws.map((g, i) => {
      const id = `hsk${meta.level}-${g.slug}`;
      return {
        id,
        level: meta.level,
        no: i + 1,
        name: g.name,
        zh: g.zh,
        words: g.rows.map(([h, p, m]) => ({ id: `${meta.level}-${h}`, h, p, m, level: meta.level, group: id })),
      };
    });
    return { ...meta, groups, words: groups.flatMap((g) => g.words) };
  });
}

/** Tất cả các cấp HSK (kể cả cấp chưa có dữ liệu, status "soon") */
export const HSK_LEVELS: HskLevel[] = build();

/** Toàn bộ từ đã có dữ liệu */
export const HSK_WORDS: HskWord[] = HSK_LEVELS.flatMap((l) => l.words);

export function getLevel(level: number): HskLevel | undefined {
  return HSK_LEVELS.find((l) => l.level === level);
}

export function getGroup(id: string): HskGroup | undefined {
  for (const l of HSK_LEVELS) {
    const g = l.groups.find((x) => x.id === id);
    if (g) return g;
  }
  return undefined;
}

/** Tìm từ theo chữ Hán (ưu tiên cấp thấp) */
export function findWord(h: string): HskWord | undefined {
  return HSK_WORDS.find((w) => w.h === h);
}

/** Số từ đã tính dồn đến hết cấp `level` */
export function cumulativeCount(level: number): number {
  return HSK_LEVELS.filter((l) => l.level <= level).reduce((n, l) => n + l.official, 0);
}

/** Pinyin có dấu → khóa gõ không dấu, chữ thường, ü = v ("nǚ'ér" → "nver") */
export function pinyinKey(p: string): string {
  return p
    .split("/")[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/ü/g, "v")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zv]/g, "");
}

/** Các cách gõ được chấp nhận: ü gõ v hoặc u; từ đuôi 儿 gõ "nar", "naer" hoặc "na" */
export function pinyinKeys(h: string, p: string): string[] {
  const out = new Set<string>();
  const add = (k: string) => {
    if (!k) return;
    out.add(k);
    out.add(k.replace(/v/g, "u"));
  };
  const k = pinyinKey(p);
  add(k);
  if (/儿$/.test(h) && /[^e]r$/.test(k)) {
    add(`${k.slice(0, -1)}er`);
    add(k.slice(0, -1));
  }
  return [...out];
}
