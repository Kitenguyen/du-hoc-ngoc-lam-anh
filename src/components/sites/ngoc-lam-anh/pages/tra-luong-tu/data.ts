// Bảng lượng từ (量词) tiếng Trung thông dụng — dữ liệu phổ thông do website tự soạn.
// Thêm lượng từ: thêm một mục vào MEASURE_WORDS. Mỗi mục có một hay nhiều cách dùng (senses),
// mỗi cách dùng có danh từ thường gặp (nouns) và ví dụ (chữ Hán chứa đúng lượng từ để được tô đậm).

export type LtType = "Cá thể" | "Tập hợp" | "Đo lường" | "Vật chứa" | "Động lượng" | "Thời gian" | "Bất định";

export type LtExample = { emoji: string; zh: string; py: string; vi: string };
export type LtSense = { zh: string; vi: string; nouns: string; ex: LtExample[] };
export type MeasureWord = { mw: string; py: string; vi: string; types: LtType[]; senses: LtSense[] };

const e = (emoji: string, zh: string, py: string, vi: string): LtExample => ({ emoji, zh, py, vi });

export const MEASURE_WORDS: MeasureWord[] = [
  {
    mw: "个", py: "gè", vi: "cái, chiếc, người (lượng từ chung)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于没有专用量词的名词，也可用于人", vi: "Lượng từ dùng chung nhất: người, đồ vật, sự việc, khái niệm chưa có lượng từ riêng.",
        nouns: "人、苹果、问题、星期、国家",
        ex: [e("🧑", "一个人", "yí ge rén", "một người"), e("🍎", "两个苹果", "liǎng ge píngguǒ", "hai quả táo"), e("❓", "我有一个问题。", "Wǒ yǒu yí ge wèntí.", "Tôi có một câu hỏi.")],
      },
    ],
  },
  {
    mw: "位", py: "wèi", vi: "vị (người, lịch sự)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于人，含敬意", vi: "Dùng cho người, mang sắc thái tôn trọng, lịch sự.",
        nouns: "老师、客人、先生、女士",
        ex: [e("👩‍🏫", "一位老师", "yí wèi lǎoshī", "một thầy/cô giáo"), e("🧑‍💼", "三位客人", "sān wèi kèrén", "ba vị khách"), e("🍽️", "请问，几位？", "Qǐngwèn, jǐ wèi?", "Xin hỏi, mấy vị ạ?")],
      },
    ],
  },
  {
    mw: "名", py: "míng", vi: "người (trang trọng, theo nghề nghiệp/danh tính)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于有某种身份的人（多用于书面）", vi: "Dùng cho người có danh tính, nghề nghiệp; thường dùng trong văn viết.",
        nouns: "学生、医生、员工、工人",
        ex: [e("🎓", "一名学生", "yì míng xuésheng", "một học sinh"), e("🩺", "两名医生", "liǎng míng yīshēng", "hai bác sĩ"), e("🏭", "公司有五百名员工。", "Gōngsī yǒu wǔbǎi míng yuángōng.", "Công ty có năm trăm nhân viên.")],
      },
    ],
  },
  {
    mw: "口", py: "kǒu", vi: "nhân khẩu; cái (giếng, nồi)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于家庭人口", vi: "Đếm số người trong gia đình.",
        nouns: "人（家里的人）",
        ex: [e("👨‍👩‍👧‍👦", "我家有四口人。", "Wǒ jiā yǒu sì kǒu rén.", "Nhà tôi có bốn người.")],
      },
      {
        zh: "用于井、锅、猪等", vi: "Dùng cho giếng, nồi, con lợn…",
        nouns: "井、锅、猪",
        ex: [e("🪣", "一口井", "yì kǒu jǐng", "một cái giếng"), e("🍲", "一口锅", "yì kǒu guō", "một cái nồi")],
      },
    ],
  },
  {
    mw: "户", py: "hù", vi: "hộ (gia đình)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于家庭、住户", vi: "Đếm hộ gia đình.",
        nouns: "人家、居民",
        ex: [e("🏘️", "这个村有一百户人家。", "Zhège cūn yǒu yìbǎi hù rénjiā.", "Làng này có một trăm hộ gia đình.")],
      },
    ],
  },
  {
    mw: "只", py: "zhī", vi: "con (động vật nhỏ); chiếc (trong một đôi)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于某些动物（多为小动物、鸟类）", vi: "Dùng cho phần lớn động vật nhỏ, chim, côn trùng.",
        nouns: "猫、狗、鸟、鸡、老虎",
        ex: [e("🐱", "一只猫", "yì zhī māo", "một con mèo"), e("🐦", "两只鸟", "liǎng zhī niǎo", "hai con chim")],
      },
      {
        zh: "用于成对东西中的一个", vi: "Một chiếc trong vật đi thành đôi.",
        nouns: "手、脚、鞋、耳朵",
        ex: [e("✋", "一只手", "yì zhī shǒu", "một bàn tay"), e("👟", "一只鞋", "yì zhī xié", "một chiếc giày")],
      },
    ],
  },
  {
    mw: "头", py: "tóu", vi: "con (gia súc lớn)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于牛、猪、大象等较大的动物", vi: "Dùng cho động vật to: trâu bò, lợn, voi…",
        nouns: "牛、猪、大象、狮子",
        ex: [e("🐄", "一头牛", "yì tóu niú", "một con bò"), e("🐘", "两头大象", "liǎng tóu dàxiàng", "hai con voi")],
      },
    ],
  },
  {
    mw: "匹", py: "pǐ", vi: "con (ngựa); súc (vải)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于马、骡等；也用于整卷的布", vi: "Dùng cho ngựa, la; cũng dùng cho súc vải.",
        nouns: "马、骡子、布",
        ex: [e("🐎", "一匹马", "yì pǐ mǎ", "một con ngựa"), e("🧵", "一匹布", "yì pǐ bù", "một súc vải")],
      },
    ],
  },
  {
    mw: "条", py: "tiáo", vi: "con, cái, chiếc (vật dài); bản tin", types: ["Cá thể"],
    senses: [
      {
        zh: "用于细长的东西和某些动物", vi: "Vật dài, mảnh: sông, đường, quần, váy; cá, chó, rắn.",
        nouns: "鱼、狗、河、路、裤子、裙子",
        ex: [e("🐟", "一条鱼", "yì tiáo yú", "một con cá"), e("🏞️", "一条河", "yì tiáo hé", "một con sông"), e("👖", "一条裤子", "yì tiáo kùzi", "một chiếc quần")],
      },
      {
        zh: "用于消息、新闻、建议等", vi: "Dùng cho tin tức, tin nhắn, ý kiến, điều khoản.",
        nouns: "消息、新闻、短信、建议",
        ex: [e("📰", "一条新闻", "yì tiáo xīnwén", "một bản tin"), e("💬", "我收到一条短信。", "Wǒ shōudào yì tiáo duǎnxìn.", "Tôi nhận được một tin nhắn.")],
      },
    ],
  },
  {
    mw: "张", py: "zhāng", vi: "tờ, tấm, cái (vật có mặt phẳng)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于有平面的东西", vi: "Vật mỏng, phẳng hoặc có mặt phẳng: giấy, vé, ảnh, bàn, giường.",
        nouns: "纸、票、照片、桌子、床、地图",
        ex: [e("📄", "一张纸", "yì zhāng zhǐ", "một tờ giấy"), e("🎫", "两张票", "liǎng zhāng piào", "hai tấm vé"), e("🛏️", "一张床", "yì zhāng chuáng", "một cái giường")],
      },
      {
        zh: "用于脸、嘴", vi: "Dùng cho khuôn mặt, cái miệng.",
        nouns: "脸、嘴",
        ex: [e("🙂", "一张笑脸", "yì zhāng xiàoliǎn", "một gương mặt tươi cười")],
      },
    ],
  },
  {
    mw: "本", py: "běn", vi: "quyển, cuốn", types: ["Cá thể"],
    senses: [
      {
        zh: "用于书籍、本子", vi: "Dùng cho sách, vở, tạp chí.",
        nouns: "书、词典、杂志、本子",
        ex: [e("📕", "一本书", "yì běn shū", "một quyển sách"), e("📚", "两本词典", "liǎng běn cídiǎn", "hai cuốn từ điển")],
      },
    ],
  },
  {
    mw: "册", py: "cè", vi: "cuốn, tập", types: ["Cá thể"],
    senses: [
      {
        zh: "用于书籍（多指成套书中的一本）", vi: "Tập sách, thường là một tập trong bộ sách.",
        nouns: "书、画册",
        ex: [e("📚", "这套书共五册。", "Zhè tào shū gòng wǔ cè.", "Bộ sách này có tổng cộng năm tập.")],
      },
    ],
  },
  {
    mw: "支", py: "zhī", vi: "cây (bút); đội; bài (hát)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于杆状的东西", vi: "Vật hình que, thanh: bút, nến, thuốc lá.",
        nouns: "笔、蜡烛、烟、枪",
        ex: [e("🖊️", "一支笔", "yì zhī bǐ", "một cây bút"), e("🕯️", "三支蜡烛", "sān zhī làzhú", "ba cây nến")],
      },
      {
        zh: "用于队伍、歌曲", vi: "Dùng cho đội ngũ, đội quân; bài hát, bản nhạc.",
        nouns: "队伍、球队、歌",
        ex: [e("⚽", "一支球队", "yì zhī qiúduì", "một đội bóng"), e("🎵", "唱一支歌", "chàng yì zhī gē", "hát một bài hát")],
      },
    ],
  },
  {
    mw: "枝", py: "zhī", vi: "cành (hoa)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于带枝的花朵", vi: "Cành hoa (hoa còn cành).",
        nouns: "花、玫瑰",
        ex: [e("🌹", "一枝玫瑰", "yì zhī méigui", "một cành hoa hồng")],
      },
    ],
  },
  {
    mw: "把", py: "bǎ", vi: "cái (vật có tay cầm); nắm", types: ["Cá thể", "Đo lường", "Động lượng"],
    senses: [
      {
        zh: "用于有把手的器具", vi: "Đồ vật có tay cầm, chuôi: ghế, ô, dao, chìa khóa.",
        nouns: "椅子、伞、刀、钥匙、扇子",
        ex: [e("🪑", "一把椅子", "yì bǎ yǐzi", "một cái ghế"), e("☂️", "一把伞", "yì bǎ sǎn", "một cái ô"), e("🔑", "两把钥匙", "liǎng bǎ yàoshi", "hai chiếc chìa khóa")],
      },
      {
        zh: "用于一手抓起的数量", vi: "Lượng vừa một nắm tay.",
        nouns: "米、花生、土",
        ex: [e("🍚", "一把米", "yì bǎ mǐ", "một nắm gạo")],
      },
      {
        zh: "用于与手有关的动作", vi: "Dùng cho động tác bằng tay (giúp một tay…).",
        nouns: "帮、拉",
        ex: [e("🤝", "帮我一把。", "Bāng wǒ yì bǎ.", "Giúp tôi một tay.")],
      },
    ],
  },
  {
    mw: "件", py: "jiàn", vi: "chiếc (áo); việc; kiện", types: ["Cá thể"],
    senses: [
      {
        zh: "用于衣服（多为上衣）", vi: "Quần áo, chủ yếu là áo.",
        nouns: "衣服、衬衫、毛衣、大衣",
        ex: [e("👕", "一件衣服", "yí jiàn yīfu", "một bộ/chiếc áo"), e("🧥", "一件大衣", "yí jiàn dàyī", "một chiếc áo khoác")],
      },
      {
        zh: "用于事情、行李、礼物等", vi: "Sự việc; kiện hành lý; món quà.",
        nouns: "事、行李、礼物、家具",
        ex: [e("📝", "我有一件事想告诉你。", "Wǒ yǒu yí jiàn shì xiǎng gàosu nǐ.", "Tôi có một việc muốn nói với bạn."), e("🧳", "两件行李", "liǎng jiàn xíngli", "hai kiện hành lý")],
      },
    ],
  },
  {
    mw: "双", py: "shuāng", vi: "đôi", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成对的东西", vi: "Vật đi thành đôi.",
        nouns: "鞋、袜子、筷子、手、眼睛",
        ex: [e("👟", "一双鞋", "yì shuāng xié", "một đôi giày"), e("🥢", "一双筷子", "yì shuāng kuàizi", "một đôi đũa"), e("👀", "一双大眼睛", "yì shuāng dà yǎnjing", "một đôi mắt to")],
      },
    ],
  },
  {
    mw: "对", py: "duì", vi: "cặp, đôi", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于按性别、左右等配合成对的人或物", vi: "Cặp người hoặc vật ghép thành đôi (nam – nữ, trái – phải).",
        nouns: "夫妻、情侣、耳环、花瓶",
        ex: [e("💑", "一对夫妻", "yí duì fūqī", "một cặp vợ chồng"), e("💍", "一对耳环", "yí duì ěrhuán", "một đôi bông tai")],
      },
    ],
  },
  {
    mw: "副", py: "fù", vi: "cặp, bộ (kính, găng tay)", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成套或成对的东西", vi: "Vật thành bộ, thành cặp: kính, găng tay, bộ bài.",
        nouns: "眼镜、手套、扑克牌、对联",
        ex: [e("👓", "一副眼镜", "yí fù yǎnjìng", "một cặp kính"), e("🧤", "一副手套", "yí fù shǒutào", "một đôi găng tay")],
      },
    ],
  },
  {
    mw: "套", py: "tào", vi: "bộ; căn (hộ)", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成套的东西", vi: "Vật thành bộ: quần áo, sách, đồ nội thất; căn hộ.",
        nouns: "衣服、书、家具、房子、邮票",
        ex: [e("🤵", "一套西装", "yí tào xīzhuāng", "một bộ com-lê"), e("🏠", "他买了一套房子。", "Tā mǎi le yí tào fángzi.", "Anh ấy đã mua một căn hộ.")],
      },
    ],
  },
  {
    mw: "辆", py: "liàng", vi: "chiếc (xe)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于车辆", vi: "Dùng cho các loại xe.",
        nouns: "汽车、自行车、出租车、公共汽车",
        ex: [e("🚗", "一辆汽车", "yí liàng qìchē", "một chiếc ô tô"), e("🚲", "两辆自行车", "liǎng liàng zìxíngchē", "hai chiếc xe đạp")],
      },
    ],
  },
  {
    mw: "架", py: "jià", vi: "chiếc (máy bay, đàn piano)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于有支架的或机械的东西", vi: "Vật có khung, giá đỡ hoặc máy móc: máy bay, đàn piano, máy ảnh.",
        nouns: "飞机、钢琴、相机",
        ex: [e("✈️", "一架飞机", "yí jià fēijī", "một chiếc máy bay"), e("🎹", "一架钢琴", "yí jià gāngqín", "một cây đàn piano")],
      },
    ],
  },
  {
    mw: "艘", py: "sōu", vi: "chiếc (tàu, thuyền)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于船只", vi: "Dùng cho tàu thuyền.",
        nouns: "船、轮船、军舰",
        ex: [e("🚢", "一艘轮船", "yì sōu lúnchuán", "một chiếc tàu thủy"), e("⛵", "三艘小船", "sān sōu xiǎochuán", "ba chiếc thuyền nhỏ")],
      },
    ],
  },
  {
    mw: "台", py: "tái", vi: "chiếc (máy móc, thiết bị)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于机器、电器", vi: "Máy móc, thiết bị điện.",
        nouns: "电脑、电视、洗衣机、空调、机器",
        ex: [e("💻", "一台电脑", "yì tái diànnǎo", "một chiếc máy tính"), e("🧺", "一台洗衣机", "yì tái xǐyījī", "một chiếc máy giặt")],
      },
      {
        zh: "用于整场的演出", vi: "Một buổi biểu diễn, chương trình.",
        nouns: "晚会、节目、戏",
        ex: [e("🎭", "一台晚会", "yì tái wǎnhuì", "một buổi dạ hội")],
      },
    ],
  },
  {
    mw: "部", py: "bù", vi: "bộ (phim, tiểu thuyết); chiếc (điện thoại)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于书籍、影片、机器等", vi: "Tác phẩm (phim, sách dài); máy (điện thoại).",
        nouns: "电影、小说、电视剧、手机",
        ex: [e("🎬", "一部电影", "yí bù diànyǐng", "một bộ phim"), e("📱", "一部手机", "yí bù shǒujī", "một chiếc điện thoại")],
      },
    ],
  },
  {
    mw: "座", py: "zuò", vi: "ngọn, tòa, cây (vật to, cố định)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于较大而固定的东西", vi: "Vật lớn, cố định: núi, cầu, tòa nhà, thành phố.",
        nouns: "山、桥、楼、城市、寺庙",
        ex: [e("⛰️", "一座山", "yí zuò shān", "một ngọn núi"), e("🌉", "一座桥", "yí zuò qiáo", "một cây cầu"), e("🏙️", "一座美丽的城市", "yí zuò měilì de chéngshì", "một thành phố xinh đẹp")],
      },
    ],
  },
  {
    mw: "栋", py: "dòng", vi: "tòa, ngôi (nhà)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于房屋", vi: "Dùng cho nhà cửa, tòa nhà.",
        nouns: "楼、房子、别墅",
        ex: [e("🏢", "一栋楼", "yí dòng lóu", "một tòa nhà"), e("🏡", "一栋别墅", "yí dòng biéshù", "một căn biệt thự")],
      },
    ],
  },
  {
    mw: "间", py: "jiān", vi: "gian, phòng", types: ["Cá thể"],
    senses: [
      {
        zh: "用于房间", vi: "Dùng cho phòng, gian nhà.",
        nouns: "房间、教室、卧室、办公室",
        ex: [e("🏫", "一间教室", "yì jiān jiàoshì", "một phòng học"), e("🛏️", "两间卧室", "liǎng jiān wòshì", "hai phòng ngủ")],
      },
    ],
  },
  {
    mw: "家", py: "jiā", vi: "nhà, hãng, cửa hàng", types: ["Cá thể"],
    senses: [
      {
        zh: "用于家庭、企业、商店等", vi: "Gia đình, doanh nghiệp, cửa hàng, nhà hàng.",
        nouns: "公司、饭馆、商店、医院、银行",
        ex: [e("🏢", "一家公司", "yì jiā gōngsī", "một công ty"), e("🍜", "这家饭馆很好吃。", "Zhè jiā fànguǎn hěn hǎochī.", "Nhà hàng này rất ngon.")],
      },
    ],
  },
  {
    mw: "所", py: "suǒ", vi: "ngôi, cơ sở (trường, bệnh viện)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于学校、医院、房屋", vi: "Trường học, bệnh viện, ngôi nhà.",
        nouns: "学校、大学、医院、房子",
        ex: [e("🎓", "一所大学", "yì suǒ dàxué", "một trường đại học"), e("🏥", "一所医院", "yì suǒ yīyuàn", "một bệnh viện")],
      },
    ],
  },
  {
    mw: "处", py: "chù", vi: "chỗ, nơi", types: ["Cá thể"],
    senses: [
      {
        zh: "用于地方、处所", vi: "Địa điểm, chỗ (kể cả chỗ sai).",
        nouns: "地方、错误、房产、景点",
        ex: [e("✏️", "这篇作文有几处错误。", "Zhè piān zuòwén yǒu jǐ chù cuòwù.", "Bài văn này có vài chỗ sai.")],
      },
    ],
  },
  {
    mw: "棵", py: "kē", vi: "cây", types: ["Cá thể"],
    senses: [
      {
        zh: "用于植物", vi: "Dùng cho cây cối, rau (cả cây).",
        nouns: "树、草、白菜",
        ex: [e("🌳", "一棵树", "yì kē shù", "một cái cây"), e("🥬", "一棵白菜", "yì kē báicài", "một cây cải thảo")],
      },
    ],
  },
  {
    mw: "朵", py: "duǒ", vi: "bông, đóa (hoa); đám (mây)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于花、云", vi: "Bông hoa, đám mây.",
        nouns: "花、云",
        ex: [e("🌸", "一朵花", "yì duǒ huā", "một bông hoa"), e("☁️", "一朵白云", "yì duǒ báiyún", "một đám mây trắng")],
      },
    ],
  },
  {
    mw: "颗", py: "kē", vi: "hạt, viên, ngôi (vật nhỏ, tròn)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于颗粒状或圆形的东西", vi: "Vật nhỏ, tròn: sao, kẹo, răng, viên đá quý; trái tim.",
        nouns: "星星、糖、牙、珍珠、心",
        ex: [e("⭐", "一颗星星", "yì kē xīngxing", "một ngôi sao"), e("🍬", "一颗糖", "yì kē táng", "một viên kẹo"), e("❤️", "一颗心", "yì kē xīn", "một trái tim")],
      },
    ],
  },
  {
    mw: "粒", py: "lì", vi: "hạt, viên", types: ["Cá thể"],
    senses: [
      {
        zh: "用于小颗粒状的东西", vi: "Hạt rất nhỏ: gạo, cát, viên thuốc.",
        nouns: "米、沙子、药、种子",
        ex: [e("🍚", "一粒米", "yí lì mǐ", "một hạt gạo"), e("💊", "每次吃两粒药。", "Měi cì chī liǎng lì yào.", "Mỗi lần uống hai viên thuốc.")],
      },
    ],
  },
  {
    mw: "片", py: "piàn", vi: "miếng, lát, chiếc (lá); vùng", types: ["Cá thể", "Đo lường"],
    senses: [
      {
        zh: "用于平而薄的东西", vi: "Vật mỏng, dẹt: lát bánh mì, chiếc lá, viên thuốc dẹt.",
        nouns: "面包、树叶、药、肉",
        ex: [e("🍞", "一片面包", "yí piàn miànbāo", "một lát bánh mì"), e("🍃", "一片树叶", "yí piàn shùyè", "một chiếc lá")],
      },
      {
        zh: "用于地面、水面或景色、声音、心意", vi: "Một vùng, một khoảng rộng (đất, nước, cảnh); cả tấm lòng.",
        nouns: "森林、草地、海、心意",
        ex: [e("🌲", "一片森林", "yí piàn sēnlín", "một cánh rừng"), e("🎁", "这是我的一片心意。", "Zhè shì wǒ de yí piàn xīnyì.", "Đây là chút tấm lòng của tôi.")],
      },
    ],
  },
  {
    mw: "块", py: "kuài", vi: "miếng, cục, mảnh; đồng (tiền)", types: ["Cá thể", "Đo lường"],
    senses: [
      {
        zh: "用于块状或片状的东西", vi: "Vật thành khối, miếng: bánh, đá, xà phòng, đồng hồ đeo tay.",
        nouns: "蛋糕、石头、肥皂、手表、地",
        ex: [e("🍰", "一块蛋糕", "yí kuài dàngāo", "một miếng bánh ga-tô"), e("🪨", "一块石头", "yí kuài shítou", "một hòn đá"), e("⌚", "一块手表", "yí kuài shǒubiǎo", "một chiếc đồng hồ đeo tay")],
      },
      {
        zh: "用于货币（口语，等于“元”）", vi: "Đơn vị tiền trong khẩu ngữ (= 元).",
        nouns: "钱",
        ex: [e("💴", "这个十块钱。", "Zhège shí kuài qián.", "Cái này mười đồng.")],
      },
    ],
  },
  {
    mw: "根", py: "gēn", vi: "sợi, cây, que (vật dài, mảnh)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于细长的东西", vi: "Vật dài và mảnh: sợi tóc, que, dây, quả chuối.",
        nouns: "头发、绳子、香蕉、筷子、针",
        ex: [e("🍌", "一根香蕉", "yì gēn xiāngjiāo", "một quả chuối"), e("🪢", "一根绳子", "yì gēn shéngzi", "một sợi dây")],
      },
    ],
  },
  {
    mw: "面", py: "miàn", vi: "tấm, lá (vật dẹt có bề mặt)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于扁平的东西", vi: "Vật dẹt có một mặt: gương, cờ, trống, bức tường.",
        nouns: "镜子、旗子、鼓、墙",
        ex: [e("🪞", "一面镜子", "yí miàn jìngzi", "một tấm gương"), e("🚩", "一面旗子", "yí miàn qízi", "một lá cờ")],
      },
    ],
  },
  {
    mw: "扇", py: "shàn", vi: "cánh (cửa, cửa sổ)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于门窗等", vi: "Cánh cửa, cửa sổ, tấm bình phong.",
        nouns: "门、窗户、屏风",
        ex: [e("🚪", "一扇门", "yí shàn mén", "một cánh cửa"), e("🪟", "两扇窗户", "liǎng shàn chuānghu", "hai cánh cửa sổ")],
      },
    ],
  },
  {
    mw: "盏", py: "zhǎn", vi: "ngọn, chiếc (đèn)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于灯", vi: "Dùng cho đèn.",
        nouns: "灯、台灯",
        ex: [e("💡", "一盏灯", "yì zhǎn dēng", "một ngọn đèn"), e("🛋️", "桌上有一盏台灯。", "Zhuō shang yǒu yì zhǎn táidēng.", "Trên bàn có một chiếc đèn bàn.")],
      },
    ],
  },
  {
    mw: "顶", py: "dǐng", vi: "chiếc (mũ); cái (lều)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于有顶的东西", vi: "Vật có phần chóp: mũ, lều, màn.",
        nouns: "帽子、帐篷、蚊帐",
        ex: [e("🧢", "一顶帽子", "yì dǐng màozi", "một chiếc mũ"), e("⛺", "一顶帐篷", "yì dǐng zhàngpeng", "một cái lều")],
      },
    ],
  },
  {
    mw: "封", py: "fēng", vi: "bức, lá (thư)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于封起来的东西", vi: "Thư từ, thư điện tử, điện báo.",
        nouns: "信、邮件、电报",
        ex: [e("✉️", "一封信", "yì fēng xìn", "một bức thư"), e("📧", "我给你发了一封邮件。", "Wǒ gěi nǐ fā le yì fēng yóujiàn.", "Tôi đã gửi cho bạn một email.")],
      },
    ],
  },
  {
    mw: "份", py: "fèn", vi: "tờ, bản, phần, suất", types: ["Cá thể"],
    senses: [
      {
        zh: "用于报刊、文件、工作、礼物以及一人份的食物", vi: "Tờ báo, bản tài liệu, công việc, món quà, suất ăn.",
        nouns: "报纸、文件、工作、礼物、快餐",
        ex: [e("📰", "一份报纸", "yí fèn bàozhǐ", "một tờ báo"), e("💼", "他找到了一份好工作。", "Tā zhǎodào le yí fèn hǎo gōngzuò.", "Anh ấy đã tìm được một công việc tốt."), e("🍱", "两份炒饭", "liǎng fèn chǎofàn", "hai suất cơm rang")],
      },
    ],
  },
  {
    mw: "篇", py: "piān", vi: "bài (văn, báo)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于文章、论文", vi: "Bài văn, bài báo, luận văn.",
        nouns: "文章、作文、论文、日记",
        ex: [e("📝", "一篇文章", "yì piān wénzhāng", "một bài văn"), e("🎓", "写一篇论文", "xiě yì piān lùnwén", "viết một bài luận văn")],
      },
    ],
  },
  {
    mw: "首", py: "shǒu", vi: "bài (thơ, hát)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于诗词、歌曲", vi: "Bài thơ, bài hát.",
        nouns: "歌、诗、曲子",
        ex: [e("🎤", "一首歌", "yì shǒu gē", "một bài hát"), e("📜", "一首诗", "yì shǒu shī", "một bài thơ")],
      },
    ],
  },
  {
    mw: "幅", py: "fú", vi: "bức (tranh, bản đồ)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于字画、布帛等", vi: "Tranh, ảnh, bản đồ, câu đối.",
        nouns: "画、地图、照片、对联",
        ex: [e("🖼️", "一幅画", "yì fú huà", "một bức tranh"), e("🗺️", "一幅地图", "yì fú dìtú", "một tấm bản đồ")],
      },
    ],
  },
  {
    mw: "句", py: "jù", vi: "câu", types: ["Cá thể"],
    senses: [
      {
        zh: "用于语言", vi: "Câu nói, câu văn, câu thơ.",
        nouns: "话、句子、诗",
        ex: [e("💬", "我想说一句话。", "Wǒ xiǎng shuō yí jù huà.", "Tôi muốn nói một câu.")],
      },
    ],
  },
  {
    mw: "段", py: "duàn", vi: "đoạn, khoảng", types: ["Đo lường"],
    senses: [
      {
        zh: "用于时间、路程、文章的一部分", vi: "Một đoạn thời gian, quãng đường, đoạn văn, đoạn hội thoại.",
        nouns: "时间、路、话、文章、对话",
        ex: [e("⏳", "一段时间", "yí duàn shíjiān", "một khoảng thời gian"), e("🛣️", "走了一段路", "zǒu le yí duàn lù", "đi được một đoạn đường")],
      },
    ],
  },
  {
    mw: "道", py: "dào", vi: "câu (hỏi), món (ăn); cánh, tia, vệt", types: ["Cá thể"],
    senses: [
      {
        zh: "用于题目、命令、菜", vi: "Câu hỏi, đề bài, mệnh lệnh; món ăn.",
        nouns: "题、菜、命令",
        ex: [e("🧮", "一道数学题", "yí dào shùxué tí", "một bài toán"), e("🍲", "这道菜很辣。", "Zhè dào cài hěn là.", "Món này rất cay.")],
      },
      {
        zh: "用于门、墙、长条形的东西", vi: "Cánh cửa, bức tường; vật dài như tia sáng, vết.",
        nouns: "门、墙、光、伤口",
        ex: [e("🌈", "一道彩虹", "yí dào cǎihóng", "một dải cầu vồng"), e("🔦", "一道光", "yí dào guāng", "một tia sáng")],
      },
    ],
  },
  {
    mw: "门", py: "mén", vi: "môn (học, ngôn ngữ, kỹ thuật)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于课程、学科、技术、语言", vi: "Môn học, ngôn ngữ, nghề, kỹ thuật.",
        nouns: "课、语言、技术、学问",
        ex: [e("📘", "这学期我有五门课。", "Zhè xuéqī wǒ yǒu wǔ mén kè.", "Học kỳ này tôi có năm môn."), e("🗣️", "学一门外语", "xué yì mén wàiyǔ", "học một ngoại ngữ")],
      },
    ],
  },
  {
    mw: "项", py: "xiàng", vi: "hạng mục, khoản, nhiệm vụ", types: ["Cá thể"],
    senses: [
      {
        zh: "用于分项目的事物", vi: "Hạng mục công việc, nhiệm vụ, quy định, nghiên cứu.",
        nouns: "任务、工作、规定、研究、技术",
        ex: [e("📋", "一项新任务", "yí xiàng xīn rènwu", "một nhiệm vụ mới"), e("🔬", "一项研究", "yí xiàng yánjiū", "một công trình nghiên cứu")],
      },
    ],
  },
  {
    mw: "笔", py: "bǐ", vi: "khoản (tiền), vụ (làm ăn)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于款项、账目、生意", vi: "Khoản tiền, món nợ, vụ làm ăn.",
        nouns: "钱、生意、账、收入",
        ex: [e("💰", "一笔钱", "yì bǐ qián", "một khoản tiền"), e("🤝", "做成了一笔大生意", "zuòchéng le yì bǐ dà shēngyi", "làm xong một vụ làm ăn lớn")],
      },
    ],
  },
  {
    mw: "种", py: "zhǒng", vi: "loại, kiểu", types: ["Tập hợp"],
    senses: [
      {
        zh: "表示种类，用于人和任何事物", vi: "Chủng loại; dùng cho người, vật, cách thức.",
        nouns: "水果、方法、人、语言",
        ex: [e("🍇", "这种水果很甜。", "Zhè zhǒng shuǐguǒ hěn tián.", "Loại trái cây này rất ngọt."), e("🧩", "两种方法", "liǎng zhǒng fāngfǎ", "hai cách")],
      },
    ],
  },
  {
    mw: "样", py: "yàng", vi: "món, thứ, kiểu", types: ["Tập hợp"],
    senses: [
      {
        zh: "表示事物的种类", vi: "Đếm số thứ, số món khác nhau.",
        nouns: "菜、东西、水果",
        ex: [e("🍽️", "我们点了四样菜。", "Wǒmen diǎn le sì yàng cài.", "Chúng tôi gọi bốn món."), e("🛍️", "买了几样东西", "mǎi le jǐ yàng dōngxi", "mua vài thứ đồ")],
      },
    ],
  },
  {
    mw: "类", py: "lèi", vi: "loại, nhóm", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于性质或特征相同的人或事物", vi: "Nhóm có cùng tính chất, đặc điểm.",
        nouns: "问题、人、书",
        ex: [e("📂", "这类问题很常见。", "Zhè lèi wèntí hěn chángjiàn.", "Loại vấn đề này rất thường gặp.")],
      },
    ],
  },
  {
    mw: "群", py: "qún", vi: "đàn, bầy, nhóm", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于聚在一起的人或动物", vi: "Đám người, bầy động vật tụ lại.",
        nouns: "人、学生、羊、鸟、孩子",
        ex: [e("👧", "一群孩子", "yì qún háizi", "một đám trẻ"), e("🐑", "一群羊", "yì qún yáng", "một đàn cừu")],
      },
    ],
  },
  {
    mw: "批", py: "pī", vi: "lô, đợt, tốp", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于大宗的货物或成批的人", vi: "Lô hàng; tốp, lứa người.",
        nouns: "货、产品、学生、游客",
        ex: [e("📦", "这批货明天到。", "Zhè pī huò míngtiān dào.", "Lô hàng này ngày mai đến."), e("🎒", "第一批新生", "dì yī pī xīnshēng", "đợt tân sinh viên đầu tiên")],
      },
    ],
  },
  {
    mw: "堆", py: "duī", vi: "đống", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成堆的东西或人", vi: "Đống đồ vật; (khẩu ngữ) đám người, đống việc.",
        nouns: "衣服、垃圾、书、问题",
        ex: [e("👚", "一堆衣服", "yì duī yīfu", "một đống quần áo"), e("🗂️", "我有一堆工作要做。", "Wǒ yǒu yì duī gōngzuò yào zuò.", "Tôi có cả đống việc phải làm.")],
      },
    ],
  },
  {
    mw: "串", py: "chuàn", vi: "chùm, chuỗi, xiên", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于连贯起来的东西", vi: "Vật nối thành chùm, chuỗi.",
        nouns: "葡萄、钥匙、珍珠、羊肉串",
        ex: [e("🍇", "一串葡萄", "yí chuàn pútao", "một chùm nho"), e("🔑", "一串钥匙", "yí chuàn yàoshi", "một chùm chìa khóa")],
      },
    ],
  },
  {
    mw: "束", py: "shù", vi: "bó; chùm (tia sáng)", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于捆在一起的东西", vi: "Vật bó lại với nhau; chùm tia sáng.",
        nouns: "花、光",
        ex: [e("💐", "一束花", "yí shù huā", "một bó hoa"), e("🔆", "一束阳光", "yí shù yángguāng", "một chùm nắng")],
      },
    ],
  },
  {
    mw: "排", py: "pái", vi: "hàng, dãy", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成行列的东西", vi: "Vật xếp thành hàng ngang.",
        nouns: "椅子、树、房子、牙齿",
        ex: [e("🪑", "一排椅子", "yì pái yǐzi", "một hàng ghế"), e("🎦", "我们坐在第一排。", "Wǒmen zuò zài dì yī pái.", "Chúng tôi ngồi ở hàng đầu.")],
      },
    ],
  },
  {
    mw: "行", py: "háng", vi: "dòng, hàng", types: ["Tập hợp"],
    senses: [
      {
        zh: "用于成行的字或物", vi: "Dòng chữ; hàng (cây, người).",
        nouns: "字、树、眼泪",
        ex: [e("✍️", "一行字", "yì háng zì", "một dòng chữ"), e("😢", "两行眼泪", "liǎng háng yǎnlèi", "hai hàng nước mắt")],
      },
    ],
  },
  {
    mw: "层", py: "céng", vi: "tầng, lớp", types: ["Đo lường"],
    senses: [
      {
        zh: "用于重叠、积累的东西或楼层", vi: "Tầng nhà; lớp (bụi, giấy, ý nghĩa).",
        nouns: "楼、灰、纸、意思",
        ex: [e("🏢", "我住在三层。", "Wǒ zhù zài sān céng.", "Tôi sống ở tầng ba."), e("🌫️", "桌子上有一层灰。", "Zhuōzi shang yǒu yì céng huī.", "Trên bàn có một lớp bụi.")],
      },
    ],
  },
  {
    mw: "节", py: "jié", vi: "tiết (học); toa, đốt, cục (pin)", types: ["Cá thể"],
    senses: [
      {
        zh: "用于课时", vi: "Tiết học.",
        nouns: "课",
        ex: [e("🏫", "今天上午有四节课。", "Jīntiān shàngwǔ yǒu sì jié kè.", "Sáng nay có bốn tiết học.")],
      },
      {
        zh: "用于分段的东西", vi: "Vật chia thành từng đoạn: toa tàu, cục pin, đốt tre.",
        nouns: "车厢、电池、竹子",
        ex: [e("🚃", "一节车厢", "yì jié chēxiāng", "một toa tàu"), e("🔋", "两节电池", "liǎng jié diànchí", "hai cục pin")],
      },
    ],
  },
  {
    mw: "届", py: "jiè", vi: "khóa, kỳ, lần (định kỳ)", types: ["Thời gian"],
    senses: [
      {
        zh: "用于定期的会议、活动或毕业班级", vi: "Kỳ hội nghị, sự kiện định kỳ; khóa tốt nghiệp.",
        nouns: "会议、运动会、毕业生、世界杯",
        ex: [e("🏅", "第三届运动会", "dì sān jiè yùndònghuì", "đại hội thể thao lần thứ ba"), e("🎓", "这届毕业生", "zhè jiè bìyèshēng", "khóa sinh viên tốt nghiệp năm nay")],
      },
    ],
  },
  {
    mw: "期", py: "qī", vi: "kỳ, số (tạp chí), khóa", types: ["Thời gian"],
    senses: [
      {
        zh: "用于分期的事物", vi: "Số báo/tạp chí, khóa học, giai đoạn.",
        nouns: "杂志、培训班、工程",
        ex: [e("📖", "这期杂志", "zhè qī zázhì", "số tạp chí này"), e("🧑‍🏫", "第一期培训班", "dì yī qī péixùnbān", "khóa đào tạo đầu tiên")],
      },
    ],
  },
  {
    mw: "轮", py: "lún", vi: "vòng, lượt", types: ["Động lượng"],
    senses: [
      {
        zh: "用于循环的事物或动作", vi: "Vòng thi đấu, vòng đàm phán; vầng (trăng, mặt trời).",
        nouns: "比赛、谈判、明月",
        ex: [e("🏆", "第一轮比赛", "dì yī lún bǐsài", "vòng đấu đầu tiên"), e("🌕", "一轮明月", "yì lún míngyuè", "một vầng trăng sáng")],
      },
    ],
  },
  {
    mw: "打", py: "dá", vi: "tá (12 cái)", types: ["Tập hợp", "Đo lường"],
    senses: [
      {
        zh: "十二个为一打", vi: "Mười hai cái là một tá.",
        nouns: "鸡蛋、铅笔、啤酒",
        ex: [e("🥚", "一打鸡蛋", "yì dá jīdàn", "một tá trứng")],
      },
    ],
  },
  {
    mw: "箱", py: "xiāng", vi: "thùng, hòm", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在箱子里的东西", vi: "Đồ đựng trong thùng, hòm.",
        nouns: "水果、啤酒、书、衣服",
        ex: [e("🍺", "两箱啤酒", "liǎng xiāng píjiǔ", "hai thùng bia"), e("🍊", "一箱橙子", "yì xiāng chéngzi", "một thùng cam")],
      },
    ],
  },
  {
    mw: "包", py: "bāo", vi: "gói, bao", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于成包的东西", vi: "Đồ đóng gói, bao.",
        nouns: "饼干、烟、纸巾、茶叶",
        ex: [e("🍪", "一包饼干", "yì bāo bǐnggān", "một gói bánh quy"), e("🧻", "一包纸巾", "yì bāo zhǐjīn", "một gói khăn giấy")],
      },
    ],
  },
  {
    mw: "盒", py: "hé", vi: "hộp", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在盒子里的东西", vi: "Đồ đựng trong hộp.",
        nouns: "巧克力、牛奶、饭、药",
        ex: [e("🍫", "一盒巧克力", "yì hé qiǎokèlì", "một hộp sô-cô-la"), e("🥛", "两盒牛奶", "liǎng hé niúnǎi", "hai hộp sữa")],
      },
    ],
  },
  {
    mw: "瓶", py: "píng", vi: "chai, lọ", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在瓶子里的东西", vi: "Đồ đựng trong chai, lọ.",
        nouns: "水、啤酒、酒、可乐",
        ex: [e("💧", "一瓶水", "yì píng shuǐ", "một chai nước"), e("🍷", "一瓶葡萄酒", "yì píng pútaojiǔ", "một chai rượu vang")],
      },
    ],
  },
  {
    mw: "杯", py: "bēi", vi: "cốc, ly, chén", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在杯子里的东西", vi: "Đồ uống đựng trong cốc, ly.",
        nouns: "茶、咖啡、水、酒",
        ex: [e("🍵", "一杯茶", "yì bēi chá", "một cốc trà"), e("☕", "来两杯咖啡。", "Lái liǎng bēi kāfēi.", "Cho hai ly cà phê.")],
      },
    ],
  },
  {
    mw: "碗", py: "wǎn", vi: "bát, tô", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在碗里的东西", vi: "Đồ ăn đựng trong bát.",
        nouns: "米饭、汤、面条",
        ex: [e("🍚", "一碗米饭", "yì wǎn mǐfàn", "một bát cơm"), e("🍜", "一碗牛肉面", "yì wǎn niúròumiàn", "một bát mì bò")],
      },
    ],
  },
  {
    mw: "盘", py: "pán", vi: "đĩa; ván (cờ)", types: ["Vật chứa", "Động lượng"],
    senses: [
      {
        zh: "用于装在盘子里的东西", vi: "Đồ ăn đựng trong đĩa.",
        nouns: "饺子、菜、水果",
        ex: [e("🥟", "一盘饺子", "yì pán jiǎozi", "một đĩa sủi cảo")],
      },
      {
        zh: "用于棋类比赛", vi: "Ván cờ.",
        nouns: "棋",
        ex: [e("♟️", "下一盘棋", "xià yì pán qí", "chơi một ván cờ")],
      },
    ],
  },
  {
    mw: "袋", py: "dài", vi: "túi, bao", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在袋子里的东西", vi: "Đồ đựng trong túi, bao.",
        nouns: "大米、垃圾、面粉、奶粉",
        ex: [e("🌾", "一袋大米", "yí dài dàmǐ", "một bao gạo"), e("🗑️", "一袋垃圾", "yí dài lājī", "một túi rác")],
      },
    ],
  },
  {
    mw: "罐", py: "guàn", vi: "lon, hũ", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在罐子里的东西", vi: "Đồ đựng trong lon, hũ.",
        nouns: "可乐、啤酒、奶粉、蜂蜜",
        ex: [e("🥤", "一罐可乐", "yí guàn kělè", "một lon cô-ca"), e("🍯", "一罐蜂蜜", "yí guàn fēngmì", "một hũ mật ong")],
      },
    ],
  },
  {
    mw: "壶", py: "hú", vi: "ấm, bình", types: ["Vật chứa"],
    senses: [
      {
        zh: "用于装在壶里的液体", vi: "Chất lỏng đựng trong ấm, bình.",
        nouns: "茶、水、酒",
        ex: [e("🫖", "泡一壶茶", "pào yì hú chá", "pha một ấm trà")],
      },
    ],
  },
  {
    mw: "卷", py: "juǎn", vi: "cuộn", types: ["Cá thể"],
    senses: [
      {
        zh: "用于成卷的东西", vi: "Vật cuộn tròn.",
        nouns: "纸、胶带、卫生纸",
        ex: [e("🧻", "一卷卫生纸", "yì juǎn wèishēngzhǐ", "một cuộn giấy vệ sinh")],
      },
    ],
  },
  {
    mw: "滴", py: "dī", vi: "giọt", types: ["Đo lường"],
    senses: [
      {
        zh: "用于滴下的液体", vi: "Giọt chất lỏng.",
        nouns: "水、眼泪、汗、雨",
        ex: [e("💧", "一滴水", "yì dī shuǐ", "một giọt nước"), e("😢", "几滴眼泪", "jǐ dī yǎnlèi", "vài giọt nước mắt")],
      },
    ],
  },
  {
    mw: "斤", py: "jīn", vi: "cân Trung Quốc (= 0,5 kg)", types: ["Đo lường"],
    senses: [
      {
        zh: "重量单位，一斤等于五百克", vi: "Đơn vị trọng lượng, 1 cân = 500 gam (thường dùng khi mua bán ở chợ).",
        nouns: "苹果、肉、米",
        ex: [e("🍎", "苹果多少钱一斤？", "Píngguǒ duōshao qián yì jīn?", "Táo bao nhiêu tiền một cân?"), e("🥩", "两斤肉", "liǎng jīn ròu", "hai cân thịt (1 kg)")],
      },
    ],
  },
  {
    mw: "公斤", py: "gōngjīn", vi: "ki-lô-gam (kg)", types: ["Đo lường"],
    senses: [
      {
        zh: "重量单位，一公斤等于一千克", vi: "Đơn vị trọng lượng, 1 kg = 1000 gam.",
        nouns: "行李、体重",
        ex: [e("🧳", "这个箱子重二十公斤。", "Zhège xiāngzi zhòng èrshí gōngjīn.", "Chiếc vali này nặng 20 kg.")],
      },
    ],
  },
  {
    mw: "米", py: "mǐ", vi: "mét (m)", types: ["Đo lường"],
    senses: [
      {
        zh: "长度单位", vi: "Đơn vị chiều dài.",
        nouns: "身高、距离、布",
        ex: [e("📏", "他身高一米八。", "Tā shēngāo yì mǐ bā.", "Anh ấy cao một mét tám."), e("🏃", "一百米跑", "yìbǎi mǐ pǎo", "chạy 100 mét")],
      },
    ],
  },
  {
    mw: "公里", py: "gōnglǐ", vi: "ki-lô-mét (km)", types: ["Đo lường"],
    senses: [
      {
        zh: "长度单位，一公里等于一千米", vi: "Đơn vị chiều dài, 1 km = 1000 mét.",
        nouns: "路、距离",
        ex: [e("🛣️", "学校离我家五公里。", "Xuéxiào lí wǒ jiā wǔ gōnglǐ.", "Trường cách nhà tôi 5 km.")],
      },
    ],
  },
  {
    mw: "元", py: "yuán", vi: "tệ, đồng (đơn vị tiền)", types: ["Đo lường"],
    senses: [
      {
        zh: "货币单位（书面）", vi: "Đơn vị tiền tệ (văn viết; khẩu ngữ dùng 块).",
        nouns: "钱、人民币",
        ex: [e("🏷️", "这本书三十元。", "Zhè běn shū sānshí yuán.", "Quyển sách này 30 tệ.")],
      },
    ],
  },
  {
    mw: "毛", py: "máo", vi: "hào (1/10 tệ, khẩu ngữ)", types: ["Đo lường"],
    senses: [
      {
        zh: "货币单位（口语），一块等于十毛", vi: "Đơn vị tiền trong khẩu ngữ, 1 đồng (块) = 10 hào (毛); văn viết dùng 角.",
        nouns: "钱",
        ex: [e("🪙", "五毛钱", "wǔ máo qián", "năm hào"), e("💴", "三块五毛", "sān kuài wǔ máo", "ba đồng năm hào")],
      },
    ],
  },
  {
    mw: "次", py: "cì", vi: "lần", types: ["Động lượng"],
    senses: [
      {
        zh: "用于动作的次数", vi: "Số lần xảy ra một hành động, sự việc.",
        nouns: "去、来、见面、考试",
        ex: [e("🗼", "我去过一次北京。", "Wǒ qùguo yí cì Běijīng.", "Tôi đã đến Bắc Kinh một lần."), e("🥇", "第一次", "dì yī cì", "lần đầu tiên")],
      },
    ],
  },
  {
    mw: "回", py: "huí", vi: "lần (khẩu ngữ); hồi (truyện)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于动作的次数（口语）", vi: "Số lần (khẩu ngữ, gần nghĩa 次).",
        nouns: "去、来、事",
        ex: [e("🔁", "这本书我看了两回。", "Zhè běn shū wǒ kàn le liǎng huí.", "Quyển sách này tôi đọc hai lần rồi."), e("🤷", "这是怎么回事？", "Zhè shì zěnme huí shì?", "Chuyện này là thế nào?")],
      },
    ],
  },
  {
    mw: "遍", py: "biàn", vi: "lượt (từ đầu đến cuối)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于从开始到结束的整个过程", vi: "Một lượt trọn vẹn từ đầu đến cuối.",
        nouns: "说、读、看、听、写",
        ex: [e("🔊", "请再说一遍。", "Qǐng zài shuō yí biàn.", "Xin nói lại một lượt nữa."), e("📖", "课文我读了三遍。", "Kèwén wǒ dú le sān biàn.", "Tôi đã đọc bài khóa ba lượt.")],
      },
    ],
  },
  {
    mw: "趟", py: "tàng", vi: "chuyến", types: ["Động lượng"],
    senses: [
      {
        zh: "用于来回走动的次数；也用于车次", vi: "Chuyến đi (đi rồi về); chuyến tàu xe.",
        nouns: "去、来、跑、火车",
        ex: [e("🛒", "我去一趟超市。", "Wǒ qù yí tàng chāoshì.", "Tôi đi siêu thị một chuyến."), e("🚆", "末班车是哪一趟？", "Mòbānchē shì nǎ yí tàng?", "Chuyến xe cuối là chuyến nào?")],
      },
    ],
  },
  {
    mw: "下", py: "xià", vi: "cái, chút (động tác ngắn)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于短暂的动作", vi: "Động tác nhanh, ngắn; 一下 làm nhẹ ngữ khí.",
        nouns: "等、看、敲、试",
        ex: [e("⏱️", "请等一下。", "Qǐng děng yíxià.", "Xin đợi một chút."), e("🚪", "敲了三下门", "qiāo le sān xià mén", "gõ cửa ba cái")],
      },
    ],
  },
  {
    mw: "顿", py: "dùn", vi: "bữa (ăn); trận (mắng, đánh)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于吃饭、批评、打骂等", vi: "Bữa ăn; trận mắng, trận đòn.",
        nouns: "饭、骂、打",
        ex: [e("🍱", "一天吃三顿饭", "yì tiān chī sān dùn fàn", "một ngày ăn ba bữa"), e("😠", "他被妈妈骂了一顿。", "Tā bèi māma mà le yí dùn.", "Cậu ấy bị mẹ mắng một trận.")],
      },
    ],
  },
  {
    mw: "场", py: "chǎng", vi: "trận, buổi; cơn (mưa), trận (ốm)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于文娱、体育活动（读 chǎng）", vi: "Buổi biểu diễn, trận thi đấu, suất chiếu (đọc chǎng).",
        nouns: "比赛、电影、演出、考试",
        ex: [e("⚽", "一场足球比赛", "yì chǎng zúqiú bǐsài", "một trận bóng đá"), e("🎬", "看一场电影", "kàn yì chǎng diànyǐng", "xem một suất phim")],
      },
      {
        zh: "用于事情的经过，如下雨、生病（读 cháng）", vi: "Một trận, một cơn (mưa, ốm, chiến tranh) — đọc cháng.",
        nouns: "雨、病、战争",
        ex: [e("🌧️", "下了一场大雨。", "Xià le yì cháng dàyǔ.", "Đã có một trận mưa to."), e("🤒", "他生了一场病。", "Tā shēng le yì cháng bìng.", "Anh ấy đã ốm một trận.")],
      },
    ],
  },
  {
    mw: "阵", py: "zhèn", vi: "cơn, trận, tràng", types: ["Động lượng"],
    senses: [
      {
        zh: "用于延续一段时间的事情或动作", vi: "Hiện tượng, động tác kéo dài một lúc: cơn gió, tràng vỗ tay.",
        nouns: "风、雨、掌声、笑声",
        ex: [e("🌬️", "一阵风", "yí zhèn fēng", "một cơn gió"), e("👏", "一阵热烈的掌声", "yí zhèn rèliè de zhǎngshēng", "một tràng vỗ tay nồng nhiệt")],
      },
    ],
  },
  {
    mw: "声", py: "shēng", vi: "tiếng", types: ["Động lượng"],
    senses: [
      {
        zh: "用于发出声音的次数", vi: "Số lần phát ra âm thanh.",
        nouns: "叫、说、喊",
        ex: [e("📣", "走的时候说一声。", "Zǒu de shíhou shuō yì shēng.", "Lúc đi thì báo một tiếng."), e("🐕", "狗叫了两声。", "Gǒu jiào le liǎng shēng.", "Con chó sủa hai tiếng.")],
      },
    ],
  },
  {
    mw: "眼", py: "yǎn", vi: "cái (nhìn)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于看的次数", vi: "Số lần nhìn.",
        nouns: "看、瞧",
        ex: [e("👀", "他看了我一眼。", "Tā kàn le wǒ yì yǎn.", "Anh ấy liếc nhìn tôi một cái.")],
      },
    ],
  },
  {
    mw: "番", py: "fān", vi: "phen, lượt (công phu)", types: ["Động lượng"],
    senses: [
      {
        zh: "用于费时较多、费力较大或过程完整的行为", vi: "Một phen, một lượt (tốn công, trọn vẹn); 一番话: một tràng lời.",
        nouns: "话、努力、考虑、打扮",
        ex: [e("🤔", "他认真地考虑了一番。", "Tā rènzhēn de kǎolǜ le yì fān.", "Anh ấy đã cân nhắc kỹ một phen."), e("🗨️", "听了他的一番话", "tīng le tā de yì fān huà", "nghe một tràng lời của anh ấy")],
      },
    ],
  },
  {
    mw: "天", py: "tiān", vi: "ngày", types: ["Thời gian"],
    senses: [
      {
        zh: "计算日子的单位（不加别的量词）", vi: "Đơn vị đếm ngày, đứng thẳng sau số từ (không thêm 个).",
        nouns: "—",
        ex: [e("📅", "我在北京住了三天。", "Wǒ zài Běijīng zhù le sān tiān.", "Tôi ở Bắc Kinh ba ngày.")],
      },
    ],
  },
  {
    mw: "年", py: "nián", vi: "năm", types: ["Thời gian"],
    senses: [
      {
        zh: "计算年份的单位（不加别的量词）", vi: "Đơn vị đếm năm, đứng thẳng sau số từ (không thêm 个).",
        nouns: "—",
        ex: [e("🗓️", "我学了两年汉语。", "Wǒ xué le liǎng nián Hànyǔ.", "Tôi đã học tiếng Trung hai năm.")],
      },
    ],
  },
  {
    mw: "些", py: "xiē", vi: "một vài, một số (số lượng không xác định)", types: ["Bất định"],
    senses: [
      {
        zh: "表示不定的数量，常与“一、这、那、哪”连用", vi: "Số lượng không xác định; hay đi với 一、这、那、哪.",
        nouns: "人、书、东西、问题",
        ex: [e("👥", "一些人", "yìxiē rén", "một số người"), e("📚", "这些书是谁的？", "Zhèxiē shū shì shéi de?", "Những quyển sách này là của ai?")],
      },
    ],
  },
  {
    mw: "点", py: "diǎn", vi: "một chút, một ít", types: ["Bất định"],
    senses: [
      {
        zh: "表示少量，常说“（一）点儿”", vi: "Lượng nhỏ, một chút; thường nói (一)点儿.",
        nouns: "水、东西、时间、事",
        ex: [e("🥤", "喝点儿水吧。", "Hē diǎnr shuǐ ba.", "Uống chút nước đi."), e("⏰", "我还有一点事。", "Wǒ hái yǒu yìdiǎn shì.", "Tôi còn chút việc.")],
      },
    ],
  },
];

/** Chữ cái đầu của pinyin (bỏ dấu thanh) để chia nhóm A–Z */
export function letterOf(py: string): string {
  return py.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase() || "#";
}

export const TYPE_ORDER: LtType[] = ["Cá thể", "Tập hợp", "Vật chứa", "Đo lường", "Động lượng", "Thời gian", "Bất định"];
