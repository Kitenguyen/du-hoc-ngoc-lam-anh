// Dữ liệu "Luyện nói phản xạ" — câu hỏi, câu trả lời mẫu và hội thoại do trung tâm Ngọc Lâm Anh tự soạn.
// THÊM CHỦ ĐỀ: thêm một phần tử vào `topics` của cấp tương ứng trong SPEAK_LEVELS.
//   - vocab: chữ Hán lấy từ lib/hsk-vocab.ts (tự tra pinyin + nghĩa); từ ngoài danh sách HSK đặt trong `extra`.
//   - q: câu hỏi + câu trả lời ngắn / mở rộng; `keys` = từ khóa để máy chấm gần đúng câu trả lời của học viên.
//   - dialog: hội thoại 2 người (A/B).
// Cấp có `topics: []` hiển thị "Đang biên soạn".

export type Line = { zh: string; py: string; vi: string };
export type SpeakQuestion = Line & { short: Line; long: Line; keys: string[]; note?: string };
export type DialogLine = Line & { sp: "A" | "B" };
export type ExtraWord = { h: string; p: string; m: string };

export type SpeakTopic = {
  code: string;
  no: number;
  vi: string;
  zh: string;
  py: string;
  vocab: string[];
  extra?: ExtraWord[];
  q: SpeakQuestion[];
  dialog: DialogLine[];
};

export type SpeakLevel = { lv: number; name: string; zh: string; topics: SpeakTopic[] };

const L = (zh: string, py: string, vi: string): Line => ({ zh, py, vi });
const Q = (q: Line, short: Line, long: Line, keys: string[], note?: string): SpeakQuestion => ({ ...q, short, long, keys, note });
const A = (zh: string, py: string, vi: string): DialogLine => ({ sp: "A", zh, py, vi });
const B = (zh: string, py: string, vi: string): DialogLine => ({ sp: "B", zh, py, vi });

export const SPEAK_LEVELS: SpeakLevel[] = [
  {
    lv: 1,
    name: "HSK1 · Giao tiếp căn bản",
    zh: "基础口语",
    topics: [
      {
        code: "hsk1-01",
        no: 1,
        vi: "Chào hỏi – giới thiệu bản thân",
        zh: "问候与自我介绍",
        py: "wènhòu yǔ zìwǒ jièshào",
        vocab: ["你", "好", "叫", "名字", "什么", "是", "人", "中国", "认识", "高兴", "岁", "学生", "老师", "会", "说", "汉语", "再见"],
        extra: [{ h: "越南", p: "Yuènán", m: "Việt Nam" }],
        q: [
          Q(
            L("你好！你叫什么名字？", "Nǐ hǎo! Nǐ jiào shénme míngzi?", "Xin chào! Bạn tên là gì?"),
            L("我叫小明。", "Wǒ jiào Xiǎo Míng.", "Mình tên là Tiểu Minh."),
            L("你好！我叫小明，认识你很高兴。", "Nǐ hǎo! Wǒ jiào Xiǎo Míng, rènshi nǐ hěn gāoxìng.", "Chào bạn! Mình tên là Tiểu Minh, rất vui được làm quen với bạn."),
            ["叫", "名字", "我是"],
            "Thay “小明” bằng tên của bạn. Có thể đáp “我姓…，叫…”.",
          ),
          Q(
            L("你是哪国人？", "Nǐ shì nǎ guó rén?", "Bạn là người nước nào?"),
            L("我是越南人。", "Wǒ shì Yuènán rén.", "Mình là người Việt Nam."),
            L("我是越南人，我住在河内。", "Wǒ shì Yuènán rén, wǒ zhù zài Hénèi.", "Mình là người Việt Nam, mình sống ở Hà Nội."),
            ["人", "越南", "中国"],
          ),
          Q(
            L("你今年多大？", "Nǐ jīnnián duō dà?", "Năm nay bạn bao nhiêu tuổi?"),
            L("我今年二十岁。", "Wǒ jīnnián èrshí suì.", "Năm nay mình hai mươi tuổi."),
            L("我今年二十岁，我是大学生。", "Wǒ jīnnián èrshí suì, wǒ shì dàxuéshēng.", "Năm nay mình hai mươi tuổi, mình là sinh viên đại học."),
            ["岁"],
          ),
          Q(
            L("你是学生吗？", "Nǐ shì xuésheng ma?", "Bạn là học sinh phải không?"),
            L("是，我是学生。", "Shì, wǒ shì xuésheng.", "Đúng, mình là học sinh."),
            L("不是，我是老师，我在学校工作。", "Bú shì, wǒ shì lǎoshī, wǒ zài xuéxiào gōngzuò.", "Không, mình là giáo viên, mình làm việc ở trường học."),
            ["是", "学生", "老师", "工作"],
          ),
          Q(
            L("你会说汉语吗？", "Nǐ huì shuō Hànyǔ ma?", "Bạn biết nói tiếng Trung không?"),
            L("我会说一点儿。", "Wǒ huì shuō yìdiǎnr.", "Mình biết nói một chút."),
            L("我会说一点儿汉语，我很喜欢学习汉语。", "Wǒ huì shuō yìdiǎnr Hànyǔ, wǒ hěn xǐhuan xuéxí Hànyǔ.", "Mình biết nói một chút tiếng Trung, mình rất thích học tiếng Trung."),
            ["会", "一点儿", "说", "汉语"],
          ),
        ],
        dialog: [
          A("你好！", "Nǐ hǎo!", "Xin chào!"),
          B("你好！你叫什么名字？", "Nǐ hǎo! Nǐ jiào shénme míngzi?", "Xin chào! Bạn tên là gì?"),
          A("我叫小明。你呢？", "Wǒ jiào Xiǎo Míng. Nǐ ne?", "Mình tên là Tiểu Minh. Còn bạn?"),
          B("我叫小红，我是中国人。", "Wǒ jiào Xiǎo Hóng, wǒ shì Zhōngguó rén.", "Mình tên là Tiểu Hồng, mình là người Trung Quốc."),
          A("认识你很高兴！", "Rènshi nǐ hěn gāoxìng!", "Rất vui được làm quen với bạn!"),
          B("我也很高兴。再见！", "Wǒ yě hěn gāoxìng. Zàijiàn!", "Mình cũng rất vui. Tạm biệt!"),
        ],
      },
      {
        code: "hsk1-02",
        no: 2,
        vi: "Gia đình tôi",
        zh: "我的家",
        py: "wǒ de jiā",
        vocab: ["家", "爸爸", "妈妈", "儿子", "女儿", "有", "几", "个", "工作", "医生", "老师", "医院", "岁", "漂亮", "在", "狗", "猫", "喜欢"],
        extra: [
          { h: "口", p: "kǒu", m: "(lượng từ đếm người trong nhà)" },
          { h: "只", p: "zhī", m: "con (lượng từ cho con vật)" },
        ],
        q: [
          Q(
            L("你家有几口人？", "Nǐ jiā yǒu jǐ kǒu rén?", "Nhà bạn có mấy người?"),
            L("我家有四口人。", "Wǒ jiā yǒu sì kǒu rén.", "Nhà mình có bốn người."),
            L("我家有四口人：爸爸、妈妈、哥哥和我。", "Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.", "Nhà mình có bốn người: bố, mẹ, anh trai và mình."),
            ["口人", "有"],
          ),
          Q(
            L("你爸爸做什么工作？", "Nǐ bàba zuò shénme gōngzuò?", "Bố bạn làm nghề gì?"),
            L("他是医生。", "Tā shì yīshēng.", "Bố mình là bác sĩ."),
            L("我爸爸是医生，他在医院工作。", "Wǒ bàba shì yīshēng, tā zài yīyuàn gōngzuò.", "Bố mình là bác sĩ, bố làm việc ở bệnh viện."),
            ["是", "工作", "在"],
          ),
          Q(
            L("你妈妈多大了？", "Nǐ māma duō dà le?", "Mẹ bạn bao nhiêu tuổi rồi?"),
            L("她四十五岁。", "Tā sìshíwǔ suì.", "Mẹ mình bốn mươi lăm tuổi."),
            L("我妈妈今年四十五岁，她很漂亮。", "Wǒ māma jīnnián sìshíwǔ suì, tā hěn piàoliang.", "Mẹ mình năm nay bốn mươi lăm tuổi, mẹ rất đẹp."),
            ["岁"],
          ),
          Q(
            L("你家在哪儿？", "Nǐ jiā zài nǎr?", "Nhà bạn ở đâu?"),
            L("我家在河内。", "Wǒ jiā zài Hénèi.", "Nhà mình ở Hà Nội."),
            L("我家在河内，在学校后面。", "Wǒ jiā zài Hénèi, zài xuéxiào hòumiàn.", "Nhà mình ở Hà Nội, ở phía sau trường học."),
            ["在"],
          ),
          Q(
            L("你家有狗吗？", "Nǐ jiā yǒu gǒu ma?", "Nhà bạn có nuôi chó không?"),
            L("有，我家有一只狗。", "Yǒu, wǒ jiā yǒu yì zhī gǒu.", "Có, nhà mình có một con chó."),
            L("没有狗，我家有两只猫，我很喜欢猫。", "Méiyǒu gǒu, wǒ jiā yǒu liǎng zhī māo, wǒ hěn xǐhuan māo.", "Không có chó, nhà mình có hai con mèo, mình rất thích mèo."),
            ["有", "没有", "狗", "猫"],
          ),
        ],
        dialog: [
          A("这是你的家人吗？", "Zhè shì nǐ de jiārén ma?", "Đây là người nhà của bạn à?"),
          B("是，这是我爸爸，那是我妈妈。", "Shì, zhè shì wǒ bàba, nà shì wǒ māma.", "Đúng, đây là bố mình, kia là mẹ mình."),
          A("你爸爸做什么工作？", "Nǐ bàba zuò shénme gōngzuò?", "Bố bạn làm nghề gì?"),
          B("他是老师。", "Tā shì lǎoshī.", "Bố mình là giáo viên."),
          A("她是谁？", "Tā shì shéi?", "Cô bé này là ai?"),
          B("她是我女儿，她五岁了。", "Tā shì wǒ nǚ'ér, tā wǔ suì le.", "Đó là con gái mình, bé năm tuổi rồi."),
        ],
      },
      {
        code: "hsk1-03",
        no: 3,
        vi: "Ngày tháng – giờ giấc",
        zh: "时间和日期",
        py: "shíjiān hé rìqī",
        vocab: ["今天", "明天", "昨天", "星期", "月", "日", "点", "分钟", "现在", "几", "时候", "上午", "中午", "下午", "去", "回", "学校"],
        q: [
          Q(
            L("今天星期几？", "Jīntiān xīngqī jǐ?", "Hôm nay thứ mấy?"),
            L("今天星期三。", "Jīntiān xīngqī sān.", "Hôm nay thứ tư."),
            L("今天星期三，明天星期四。", "Jīntiān xīngqī sān, míngtiān xīngqī sì.", "Hôm nay thứ tư, ngày mai thứ năm."),
            ["星期"],
            "Lưu ý: 星期一 = thứ hai, 星期三 = thứ tư, 星期天 = chủ nhật.",
          ),
          Q(
            L("现在几点？", "Xiànzài jǐ diǎn?", "Bây giờ là mấy giờ?"),
            L("现在八点。", "Xiànzài bā diǎn.", "Bây giờ là tám giờ."),
            L("现在上午八点十分。", "Xiànzài shàngwǔ bā diǎn shí fēn.", "Bây giờ là tám giờ mười phút sáng."),
            ["点"],
          ),
          Q(
            L("今天几月几号？", "Jīntiān jǐ yuè jǐ hào?", "Hôm nay là ngày mấy tháng mấy?"),
            L("今天十月九号。", "Jīntiān shí yuè jiǔ hào.", "Hôm nay là ngày chín tháng mười."),
            L("今天十月九号，是我朋友的生日。", "Jīntiān shí yuè jiǔ hào, shì wǒ péngyou de shēngrì.", "Hôm nay là ngày chín tháng mười, là sinh nhật bạn mình."),
            ["月", "号", "日"],
          ),
          Q(
            L("你什么时候去学校？", "Nǐ shénme shíhou qù xuéxiào?", "Khi nào bạn đến trường?"),
            L("我上午去学校。", "Wǒ shàngwǔ qù xuéxiào.", "Mình đến trường vào buổi sáng."),
            L("我每天上午七点去学校，下午五点回家。", "Wǒ měitiān shàngwǔ qī diǎn qù xuéxiào, xiàwǔ wǔ diǎn huí jiā.", "Mỗi ngày mình đến trường lúc bảy giờ sáng, năm giờ chiều về nhà."),
            ["去", "点", "上午", "下午", "今天", "明天"],
          ),
          Q(
            L("你中午几点吃饭？", "Nǐ zhōngwǔ jǐ diǎn chī fàn?", "Buổi trưa bạn ăn cơm lúc mấy giờ?"),
            L("我十二点吃饭。", "Wǒ shí'èr diǎn chī fàn.", "Mình ăn cơm lúc mười hai giờ."),
            L("我中午十二点吃饭，一点睡觉。", "Wǒ zhōngwǔ shí'èr diǎn chī fàn, yī diǎn shuìjiào.", "Buổi trưa mình ăn cơm lúc mười hai giờ, một giờ đi ngủ."),
            ["点"],
          ),
        ],
        dialog: [
          A("明天你去哪儿？", "Míngtiān nǐ qù nǎr?", "Ngày mai bạn đi đâu?"),
          B("明天我去北京。", "Míngtiān wǒ qù Běijīng.", "Ngày mai mình đi Bắc Kinh."),
          A("你几点去？", "Nǐ jǐ diǎn qù?", "Mấy giờ bạn đi?"),
          B("上午九点。", "Shàngwǔ jiǔ diǎn.", "Chín giờ sáng."),
          A("什么时候回来？", "Shénme shíhou huílai?", "Khi nào bạn về?"),
          B("星期六回来。", "Xīngqī liù huílai.", "Thứ bảy mình về."),
        ],
      },
      {
        code: "hsk1-04",
        no: 4,
        vi: "Ăn uống",
        zh: "吃饭",
        py: "chī fàn",
        vocab: ["吃", "喝", "想", "菜", "茶", "水", "米饭", "苹果", "水果", "杯子", "饭店", "喜欢", "多少", "钱", "块", "请", "坐"],
        q: [
          Q(
            L("你想吃什么？", "Nǐ xiǎng chī shénme?", "Bạn muốn ăn gì?"),
            L("我想吃米饭。", "Wǒ xiǎng chī mǐfàn.", "Mình muốn ăn cơm."),
            L("我想吃米饭和中国菜。", "Wǒ xiǎng chī mǐfàn hé Zhōngguó cài.", "Mình muốn ăn cơm và món Trung Quốc."),
            ["吃", "想"],
          ),
          Q(
            L("你想喝什么？", "Nǐ xiǎng hē shénme?", "Bạn muốn uống gì?"),
            L("我想喝茶。", "Wǒ xiǎng hē chá.", "Mình muốn uống trà."),
            L("天气很热，我想喝一杯水。", "Tiānqì hěn rè, wǒ xiǎng hē yì bēi shuǐ.", "Trời rất nóng, mình muốn uống một cốc nước."),
            ["喝"],
          ),
          Q(
            L("你喜欢吃水果吗？", "Nǐ xǐhuan chī shuǐguǒ ma?", "Bạn có thích ăn hoa quả không?"),
            L("喜欢，我喜欢吃苹果。", "Xǐhuan, wǒ xǐhuan chī píngguǒ.", "Thích, mình thích ăn táo."),
            L("很喜欢，我每天都吃苹果。", "Hěn xǐhuan, wǒ měitiān dōu chī píngguǒ.", "Rất thích, ngày nào mình cũng ăn táo."),
            ["喜欢", "吃"],
          ),
          Q(
            L("中午你在哪儿吃饭？", "Zhōngwǔ nǐ zài nǎr chī fàn?", "Buổi trưa bạn ăn cơm ở đâu?"),
            L("我在饭店吃饭。", "Wǒ zài fàndiàn chī fàn.", "Mình ăn ở nhà hàng."),
            L("我中午在学校吃饭，那儿的菜很好吃。", "Wǒ zhōngwǔ zài xuéxiào chī fàn, nàr de cài hěn hǎochī.", "Buổi trưa mình ăn ở trường, đồ ăn ở đó rất ngon."),
            ["在", "吃"],
          ),
          Q(
            L("一杯茶多少钱？", "Yì bēi chá duōshao qián?", "Một cốc trà bao nhiêu tiền?"),
            L("十块钱。", "Shí kuài qián.", "Mười đồng."),
            L("一杯茶十块钱，不贵。", "Yì bēi chá shí kuài qián, bú guì.", "Một cốc trà mười đồng, không đắt."),
            ["块", "钱"],
          ),
        ],
        dialog: [
          A("你好，请坐。你想吃什么？", "Nǐ hǎo, qǐng zuò. Nǐ xiǎng chī shénme?", "Xin chào, mời ngồi. Bạn muốn ăn gì?"),
          B("我想吃米饭。", "Wǒ xiǎng chī mǐfàn.", "Tôi muốn ăn cơm."),
          A("喝什么？", "Hē shénme?", "Uống gì ạ?"),
          B("一杯茶，谢谢。", "Yì bēi chá, xièxie.", "Một cốc trà, cảm ơn."),
          A("好的，请等一下。", "Hǎo de, qǐng děng yíxià.", "Vâng, xin đợi một chút."),
          B("多少钱？", "Duōshao qián?", "Bao nhiêu tiền?"),
          A("三十五块。", "Sānshíwǔ kuài.", "Ba mươi lăm đồng."),
        ],
      },
      {
        code: "hsk1-05",
        no: 5,
        vi: "Mua sắm",
        zh: "买东西",
        py: "mǎi dōngxi",
        vocab: ["买", "东西", "商店", "衣服", "多少", "钱", "块", "太", "漂亮", "这", "那", "个", "本", "书", "些", "杯子", "昨天"],
        q: [
          Q(
            L("你想买什么？", "Nǐ xiǎng mǎi shénme?", "Bạn muốn mua gì?"),
            L("我想买衣服。", "Wǒ xiǎng mǎi yīfu.", "Mình muốn mua quần áo."),
            L("我想买一些水果和一本书。", "Wǒ xiǎng mǎi yìxiē shuǐguǒ hé yì běn shū.", "Mình muốn mua một ít hoa quả và một quyển sách."),
            ["买"],
          ),
          Q(
            L("这件衣服多少钱？", "Zhè jiàn yīfu duōshao qián?", "Chiếc áo này bao nhiêu tiền?"),
            L("两百块。", "Liǎng bǎi kuài.", "Hai trăm đồng."),
            L("这件衣服两百块，很漂亮。", "Zhè jiàn yīfu liǎng bǎi kuài, hěn piàoliang.", "Chiếc áo này hai trăm đồng, rất đẹp."),
            ["块", "钱", "百"],
          ),
          Q(
            L("你在哪儿买东西？", "Nǐ zài nǎr mǎi dōngxi?", "Bạn mua đồ ở đâu?"),
            L("我在商店买东西。", "Wǒ zài shāngdiàn mǎi dōngxi.", "Mình mua đồ ở cửa hàng."),
            L("我在学校前面的商店买东西，那儿的东西不贵。", "Wǒ zài xuéxiào qiánmiàn de shāngdiàn mǎi dōngxi, nàr de dōngxi bú guì.", "Mình mua đồ ở cửa hàng trước cổng trường, đồ ở đó không đắt."),
            ["在", "商店"],
          ),
          Q(
            L("你喜欢这个杯子吗？", "Nǐ xǐhuan zhège bēizi ma?", "Bạn có thích cái cốc này không?"),
            L("喜欢，很漂亮。", "Xǐhuan, hěn piàoliang.", "Thích, rất đẹp."),
            L("喜欢，这个杯子太漂亮了，我想买。", "Xǐhuan, zhège bēizi tài piàoliang le, wǒ xiǎng mǎi.", "Thích, cái cốc này đẹp quá, mình muốn mua."),
            ["喜欢", "漂亮"],
          ),
          Q(
            L("你昨天买了什么？", "Nǐ zuótiān mǎi le shénme?", "Hôm qua bạn đã mua gì?"),
            L("我买了一本书。", "Wǒ mǎi le yì běn shū.", "Mình đã mua một quyển sách."),
            L("我昨天和朋友去商店，买了一些衣服。", "Wǒ zuótiān hé péngyou qù shāngdiàn, mǎi le yìxiē yīfu.", "Hôm qua mình cùng bạn đi cửa hàng, mua một ít quần áo."),
            ["买"],
          ),
        ],
        dialog: [
          A("你好，这个多少钱？", "Nǐ hǎo, zhège duōshao qián?", "Chào chị, cái này bao nhiêu tiền?"),
          B("八十块。", "Bāshí kuài.", "Tám mươi đồng."),
          A("太贵了！", "Tài guì le!", "Đắt quá!"),
          B("七十块，怎么样？", "Qīshí kuài, zěnmeyàng?", "Bảy mươi đồng, thế nào?"),
          A("好，我买一个。", "Hǎo, wǒ mǎi yí ge.", "Được, tôi mua một cái."),
          B("谢谢，再见！", "Xièxie, zàijiàn!", "Cảm ơn, tạm biệt!"),
        ],
      },
      {
        code: "hsk1-06",
        no: 6,
        vi: "Thời tiết",
        zh: "天气",
        py: "tiānqì",
        vocab: ["天气", "冷", "热", "下雨", "怎么样", "很", "太", "会", "喜欢", "电影", "电视", "看", "喝", "茶"],
        q: [
          Q(
            L("今天天气怎么样？", "Jīntiān tiānqì zěnmeyàng?", "Thời tiết hôm nay thế nào?"),
            L("今天天气很好。", "Jīntiān tiānqì hěn hǎo.", "Thời tiết hôm nay rất đẹp."),
            L("今天天气很好，不冷也不热。", "Jīntiān tiānqì hěn hǎo, bù lěng yě bú rè.", "Hôm nay trời rất đẹp, không lạnh cũng không nóng."),
            ["天气", "冷", "热", "好", "下雨"],
          ),
          Q(
            L("明天会下雨吗？", "Míngtiān huì xià yǔ ma?", "Ngày mai trời có mưa không?"),
            L("明天会下雨。", "Míngtiān huì xià yǔ.", "Ngày mai trời sẽ mưa."),
            L("明天不会下雨，我们可以去看电影。", "Míngtiān bú huì xià yǔ, wǒmen kěyǐ qù kàn diànyǐng.", "Ngày mai trời không mưa, chúng ta có thể đi xem phim."),
            ["下雨", "会"],
          ),
          Q(
            L("北京冷吗？", "Běijīng lěng ma?", "Bắc Kinh có lạnh không?"),
            L("北京很冷。", "Běijīng hěn lěng.", "Bắc Kinh rất lạnh."),
            L("北京十二月很冷，七月很热。", "Běijīng shí'èr yuè hěn lěng, qī yuè hěn rè.", "Bắc Kinh tháng mười hai rất lạnh, tháng bảy rất nóng."),
            ["冷", "热"],
          ),
          Q(
            L("你喜欢下雨天吗？", "Nǐ xǐhuan xià yǔ tiān ma?", "Bạn có thích ngày mưa không?"),
            L("不喜欢。", "Bù xǐhuan.", "Không thích."),
            L("我不太喜欢下雨天，下雨天我不想出去。", "Wǒ bú tài xǐhuan xià yǔ tiān, xià yǔ tiān wǒ bù xiǎng chūqu.", "Mình không thích ngày mưa lắm, trời mưa mình không muốn ra ngoài."),
            ["喜欢"],
          ),
          Q(
            L("天气冷的时候，你做什么？", "Tiānqì lěng de shíhou, nǐ zuò shénme?", "Khi trời lạnh, bạn làm gì?"),
            L("我在家看电视。", "Wǒ zài jiā kàn diànshì.", "Mình ở nhà xem ti vi."),
            L("天气冷的时候，我在家喝热茶，看电影。", "Tiānqì lěng de shíhou, wǒ zài jiā hē rè chá, kàn diànyǐng.", "Khi trời lạnh, mình ở nhà uống trà nóng, xem phim."),
            ["在家", "看", "喝", "睡觉"],
          ),
        ],
        dialog: [
          A("喂，你在哪儿？", "Wèi, nǐ zài nǎr?", "A lô, bạn đang ở đâu?"),
          B("我在家。今天下雨了。", "Wǒ zài jiā. Jīntiān xià yǔ le.", "Mình ở nhà. Hôm nay trời mưa rồi."),
          A("冷吗？", "Lěng ma?", "Có lạnh không?"),
          B("有一点儿冷。", "Yǒu yìdiǎnr lěng.", "Hơi lạnh một chút."),
          A("明天天气怎么样？", "Míngtiān tiānqì zěnmeyàng?", "Thời tiết ngày mai thế nào?"),
          B("明天很好，我们去看电影吧！", "Míngtiān hěn hǎo, wǒmen qù kàn diànyǐng ba!", "Ngày mai đẹp trời, chúng mình đi xem phim nhé!"),
        ],
      },
    ],
  },
  {
    lv: 2,
    name: "HSK2 · Giao tiếp sinh hoạt",
    zh: "生活口语",
    topics: [
      {
        code: "hsk2-01",
        no: 1,
        vi: "Sở thích – thể thao",
        zh: "爱好和运动",
        py: "àihào hé yùndòng",
        vocab: ["运动", "游泳", "跑步", "踢足球", "打篮球", "唱歌", "跳舞", "玩", "早上", "起床", "小时", "次", "每", "最", "一起", "时间", "事情"],
        q: [
          Q(
            L("你喜欢什么运动？", "Nǐ xǐhuan shénme yùndòng?", "Bạn thích môn thể thao nào?"),
            L("我喜欢游泳。", "Wǒ xǐhuan yóuyǒng.", "Mình thích bơi."),
            L("我最喜欢踢足球，每个星期踢两次。", "Wǒ zuì xǐhuan tī zúqiú, měi ge xīngqī tī liǎng cì.", "Mình thích đá bóng nhất, mỗi tuần đá hai lần."),
            ["喜欢", "游泳", "跑步", "足球", "篮球", "运动"],
          ),
          Q(
            L("你每天早上做什么？", "Nǐ měitiān zǎoshang zuò shénme?", "Mỗi sáng bạn làm gì?"),
            L("我每天早上跑步。", "Wǒ měitiān zǎoshang pǎobù.", "Sáng nào mình cũng chạy bộ."),
            L("我早上六点起床，跑步一个小时。", "Wǒ zǎoshang liù diǎn qǐchuáng, pǎobù yí ge xiǎoshí.", "Mình dậy lúc sáu giờ sáng, chạy bộ một tiếng."),
            ["起床", "跑步", "早上", "吃"],
          ),
          Q(
            L("你会唱歌吗？", "Nǐ huì chànggē ma?", "Bạn có biết hát không?"),
            L("会，我很喜欢唱歌。", "Huì, wǒ hěn xǐhuan chànggē.", "Biết, mình rất thích hát."),
            L("我唱得不太好，但是我很喜欢唱。", "Wǒ chàng de bú tài hǎo, dànshì wǒ hěn xǐhuan chàng.", "Mình hát không hay lắm, nhưng mình rất thích hát."),
            ["会", "唱"],
          ),
          Q(
            L("星期六你喜欢去哪儿玩？", "Xīngqī liù nǐ xǐhuan qù nǎr wán?", "Thứ bảy bạn thích đi đâu chơi?"),
            L("我喜欢和朋友去看电影。", "Wǒ xǐhuan hé péngyou qù kàn diànyǐng.", "Mình thích cùng bạn bè đi xem phim."),
            L("星期六我和朋友一起去打篮球，晚上去唱歌。", "Xīngqī liù wǒ hé péngyou yìqǐ qù dǎ lánqiú, wǎnshang qù chànggē.", "Thứ bảy mình cùng bạn đi chơi bóng rổ, buổi tối đi hát."),
            ["去", "玩", "看"],
          ),
          Q(
            L("你游泳游得怎么样？", "Nǐ yóuyǒng yóu de zěnmeyàng?", "Bạn bơi giỏi không?"),
            L("我游得很好。", "Wǒ yóu de hěn hǎo.", "Mình bơi rất giỏi."),
            L("我游得不太快，但是我每个星期都去游泳。", "Wǒ yóu de bú tài kuài, dànshì wǒ měi ge xīngqī dōu qù yóuyǒng.", "Mình bơi không nhanh lắm, nhưng tuần nào mình cũng đi bơi."),
            ["游得", "好", "快", "慢", "不会"],
          ),
        ],
        dialog: [
          A("你明天有时间吗？", "Nǐ míngtiān yǒu shíjiān ma?", "Ngày mai bạn có thời gian không?"),
          B("有，什么事情？", "Yǒu, shénme shìqing?", "Có, chuyện gì vậy?"),
          A("我们一起去打篮球吧！", "Wǒmen yìqǐ qù dǎ lánqiú ba!", "Chúng mình cùng đi chơi bóng rổ nhé!"),
          B("好啊！几点？", "Hǎo a! Jǐ diǎn?", "Được đó! Mấy giờ?"),
          A("下午四点，在学校旁边。", "Xiàwǔ sì diǎn, zài xuéxiào pángbiān.", "Bốn giờ chiều, ở cạnh trường."),
          B("好的，明天见！", "Hǎo de, míngtiān jiàn!", "Được, mai gặp nhé!"),
        ],
      },
      {
        code: "hsk2-02",
        no: 2,
        vi: "Đi lại – hỏi đường",
        zh: "交通和问路",
        py: "jiāotōng hé wèn lù",
        vocab: ["公共汽车", "出租车", "自行车", "飞机", "机场", "火车站", "离", "远", "近", "走", "到", "从", "向", "左边", "右边", "旁边", "前面", "过"],
        q: [
          Q(
            L("你每天怎么去学校？", "Nǐ měitiān zěnme qù xuéxiào?", "Hằng ngày bạn đến trường bằng gì?"),
            L("我坐公共汽车去。", "Wǒ zuò gōnggòng qìchē qù.", "Mình đi xe buýt."),
            L("我家离学校不远，我每天走路去，要二十分钟。", "Wǒ jiā lí xuéxiào bù yuǎn, wǒ měitiān zǒu lù qù, yào èrshí fēnzhōng.", "Nhà mình cách trường không xa, ngày nào mình cũng đi bộ, mất hai mươi phút."),
            ["坐", "走", "开车", "去", "自行车"],
          ),
          Q(
            L("你家离机场远吗？", "Nǐ jiā lí jīchǎng yuǎn ma?", "Nhà bạn cách sân bay có xa không?"),
            L("很远。", "Hěn yuǎn.", "Rất xa."),
            L("不太远，坐出租车三十分钟就到了。", "Bú tài yuǎn, zuò chūzūchē sānshí fēnzhōng jiù dào le.", "Không xa lắm, đi taxi ba mươi phút là đến."),
            ["远", "近"],
          ),
          Q(
            L("请问，火车站在哪儿？", "Qǐngwèn, huǒchēzhàn zài nǎr?", "Xin hỏi, ga tàu ở đâu?"),
            L("在前面。", "Zài qiánmiàn.", "Ở phía trước."),
            L("向前走五分钟，火车站在右边。", "Xiàng qián zǒu wǔ fēnzhōng, huǒchēzhàn zài yòubian.", "Đi thẳng về phía trước năm phút, ga tàu ở bên phải."),
            ["在", "前面", "左边", "右边", "旁边", "走"],
          ),
          Q(
            L("你坐过飞机吗？", "Nǐ zuò guo fēijī ma?", "Bạn đã từng đi máy bay chưa?"),
            L("坐过。", "Zuò guo.", "Đi rồi."),
            L("坐过，去年我坐飞机去北京旅游了。", "Zuò guo, qùnián wǒ zuò fēijī qù Běijīng lǚyóu le.", "Đi rồi, năm ngoái mình đi máy bay đến Bắc Kinh du lịch."),
            ["坐过", "没坐过", "没有"],
          ),
          Q(
            L("从这儿到你家要多长时间？", "Cóng zhèr dào nǐ jiā yào duō cháng shíjiān?", "Từ đây đến nhà bạn mất bao lâu?"),
            L("要一个小时。", "Yào yí ge xiǎoshí.", "Mất một tiếng."),
            L("坐公共汽车要四十分钟，开车二十分钟就到了。", "Zuò gōnggòng qìchē yào sìshí fēnzhōng, kāi chē èrshí fēnzhōng jiù dào le.", "Đi xe buýt mất bốn mươi phút, lái xe hai mươi phút là đến."),
            ["小时", "分钟"],
          ),
        ],
        dialog: [
          A("请问，去机场怎么走？", "Qǐngwèn, qù jīchǎng zěnme zǒu?", "Xin hỏi, đến sân bay đi thế nào?"),
          B("机场离这儿很远，你坐出租车吧。", "Jīchǎng lí zhèr hěn yuǎn, nǐ zuò chūzūchē ba.", "Sân bay cách đây rất xa, bạn đi taxi đi."),
          A("要多长时间？", "Yào duō cháng shíjiān?", "Mất bao lâu ạ?"),
          B("要四十分钟。", "Yào sìshí fēnzhōng.", "Mất bốn mươi phút."),
          A("谢谢您！", "Xièxie nín!", "Cảm ơn ông/bà!"),
          B("不客气。", "Bú kèqi.", "Không có gì."),
        ],
      },
      {
        code: "hsk2-03",
        no: 3,
        vi: "Sức khỏe",
        zh: "身体和健康",
        py: "shēntǐ hé jiànkāng",
        vocab: ["身体", "生病", "药", "累", "忙", "休息", "医院", "医生", "眼睛", "睡觉", "小时", "因为", "准备", "考试", "别", "手机"],
        q: [
          Q(
            L("你身体怎么样？", "Nǐ shēntǐ zěnmeyàng?", "Sức khỏe bạn thế nào?"),
            L("我身体很好。", "Wǒ shēntǐ hěn hǎo.", "Mình rất khỏe."),
            L("我身体很好，因为我每天都运动。", "Wǒ shēntǐ hěn hǎo, yīnwèi wǒ měitiān dōu yùndòng.", "Mình rất khỏe, vì ngày nào mình cũng vận động."),
            ["好", "身体"],
          ),
          Q(
            L("你怎么了？", "Nǐ zěnme le?", "Bạn sao vậy?"),
            L("我生病了。", "Wǒ shēngbìng le.", "Mình bị ốm rồi."),
            L("我有点儿累，昨天晚上没睡好。", "Wǒ yǒudiǎnr lèi, zuótiān wǎnshang méi shuì hǎo.", "Mình hơi mệt, tối qua ngủ không ngon."),
            ["生病", "累", "没事", "不舒服"],
          ),
          Q(
            L("生病的时候你做什么？", "Shēngbìng de shíhou nǐ zuò shénme?", "Khi bị ốm bạn làm gì?"),
            L("我去医院看医生。", "Wǒ qù yīyuàn kàn yīshēng.", "Mình đến bệnh viện khám bác sĩ."),
            L("我吃药，多喝水，在家休息。", "Wǒ chī yào, duō hē shuǐ, zài jiā xiūxi.", "Mình uống thuốc, uống nhiều nước, nghỉ ngơi ở nhà."),
            ["医院", "医生", "药", "休息", "喝水"],
          ),
          Q(
            L("你每天睡几个小时？", "Nǐ měitiān shuì jǐ ge xiǎoshí?", "Mỗi ngày bạn ngủ mấy tiếng?"),
            L("我睡八个小时。", "Wǒ shuì bā ge xiǎoshí.", "Mình ngủ tám tiếng."),
            L("我每天晚上十一点睡觉，早上六点起床，睡七个小时。", "Wǒ měitiān wǎnshang shíyī diǎn shuìjiào, zǎoshang liù diǎn qǐchuáng, shuì qī ge xiǎoshí.", "Mỗi tối mình ngủ lúc mười một giờ, sáu giờ sáng dậy, ngủ bảy tiếng."),
            ["小时", "点"],
          ),
          Q(
            L("你这几天忙吗？", "Nǐ zhè jǐ tiān máng ma?", "Mấy hôm nay bạn có bận không?"),
            L("很忙。", "Hěn máng.", "Rất bận."),
            L("非常忙，我要准备考试，没有时间休息。", "Fēicháng máng, wǒ yào zhǔnbèi kǎoshì, méiyǒu shíjiān xiūxi.", "Rất bận, mình phải chuẩn bị thi, không có thời gian nghỉ."),
            ["忙"],
          ),
        ],
        dialog: [
          A("你的眼睛很红，怎么了？", "Nǐ de yǎnjing hěn hóng, zěnme le?", "Mắt bạn đỏ quá, sao vậy?"),
          B("我昨天晚上看手机看得太晚了。", "Wǒ zuótiān wǎnshang kàn shǒujī kàn de tài wǎn le.", "Tối qua mình xem điện thoại muộn quá."),
          A("别看手机了，早点儿睡觉吧。", "Bié kàn shǒujī le, zǎo diǎnr shuìjiào ba.", "Đừng xem điện thoại nữa, đi ngủ sớm một chút đi."),
          B("好，谢谢你。", "Hǎo, xièxie nǐ.", "Ừ, cảm ơn bạn."),
        ],
      },
      {
        code: "hsk2-04",
        no: 4,
        vi: "Học tập – công việc",
        zh: "学习和工作",
        py: "xuéxí hé gōngzuò",
        vocab: ["学习", "考试", "课", "准备", "希望", "觉得", "意思", "知道", "问", "告诉", "公司", "上班", "已经", "为什么", "因为", "所以"],
        q: [
          Q(
            L("你学汉语多长时间了？", "Nǐ xué Hànyǔ duō cháng shíjiān le?", "Bạn học tiếng Trung bao lâu rồi?"),
            L("我学了一年了。", "Wǒ xué le yì nián le.", "Mình học được một năm rồi."),
            L("我学汉语已经一年了，我觉得很有意思。", "Wǒ xué Hànyǔ yǐjīng yì nián le, wǒ juéde hěn yǒu yìsi.", "Mình học tiếng Trung đã một năm rồi, mình thấy rất thú vị."),
            ["年", "月", "学了"],
          ),
          Q(
            L("你为什么学习汉语？", "Nǐ wèi shénme xuéxí Hànyǔ?", "Tại sao bạn học tiếng Trung?"),
            L("因为我喜欢中国。", "Yīnwèi wǒ xǐhuan Zhōngguó.", "Vì mình thích Trung Quốc."),
            L("因为我想去中国旅游，所以我学习汉语。", "Yīnwèi wǒ xiǎng qù Zhōngguó lǚyóu, suǒyǐ wǒ xuéxí Hànyǔ.", "Vì mình muốn đi du lịch Trung Quốc nên mình học tiếng Trung."),
            ["因为", "喜欢", "想", "工作"],
          ),
          Q(
            L("你在哪儿工作？", "Nǐ zài nǎr gōngzuò?", "Bạn làm việc ở đâu?"),
            L("我在一家公司工作。", "Wǒ zài yì jiā gōngsī gōngzuò.", "Mình làm việc ở một công ty."),
            L("我在一家中国公司工作，每天八点上班。", "Wǒ zài yì jiā Zhōngguó gōngsī gōngzuò, měitiān bā diǎn shàngbān.", "Mình làm ở một công ty Trung Quốc, ngày nào cũng đi làm lúc tám giờ."),
            ["在", "公司", "工作", "学生", "学校"],
          ),
          Q(
            L("考试准备得怎么样了？", "Kǎoshì zhǔnbèi de zěnmeyàng le?", "Bạn chuẩn bị thi đến đâu rồi?"),
            L("准备得很好。", "Zhǔnbèi de hěn hǎo.", "Chuẩn bị tốt lắm."),
            L("还没准备完，我希望这次考试能考得好一点儿。", "Hái méi zhǔnbèi wán, wǒ xīwàng zhè cì kǎoshì néng kǎo de hǎo yìdiǎnr.", "Vẫn chưa chuẩn bị xong, mình hy vọng lần thi này làm tốt hơn một chút."),
            ["准备", "好", "还没"],
          ),
          Q(
            L("这个字是什么意思？", "Zhège zì shì shénme yìsi?", "Chữ này nghĩa là gì?"),
            L("我也不知道。", "Wǒ yě bù zhīdào.", "Mình cũng không biết."),
            L("我不知道，我们问问老师吧。", "Wǒ bù zhīdào, wǒmen wènwen lǎoshī ba.", "Mình không biết, chúng mình hỏi thầy cô thử nhé."),
            ["意思", "知道", "问"],
          ),
        ],
        dialog: [
          A("你今天上课了吗？", "Nǐ jīntiān shàng kè le ma?", "Hôm nay bạn đi học chưa?"),
          B("上了，今天的课很有意思。", "Shàng le, jīntiān de kè hěn yǒu yìsi.", "Học rồi, buổi học hôm nay rất thú vị."),
          A("老师说什么了？", "Lǎoshī shuō shénme le?", "Thầy cô nói gì vậy?"),
          B("老师告诉我们，下个星期考试。", "Lǎoshī gàosu wǒmen, xià ge xīngqī kǎoshì.", "Thầy cô báo tuần sau thi."),
          A("那我们一起准备吧！", "Nà wǒmen yìqǐ zhǔnbèi ba!", "Vậy chúng mình cùng ôn nhé!"),
          B("好啊！", "Hǎo a!", "Được đó!"),
        ],
      },
    ],
  },
  { lv: 3, name: "HSK3 · Giao tiếp mở rộng", zh: "拓展口语", topics: [] },
  { lv: 4, name: "HSK4 · Trình bày quan điểm", zh: "表达观点", topics: [] },
  { lv: 5, name: "HSK5 · Thảo luận chủ đề", zh: "话题讨论", topics: [] },
  { lv: 6, name: "HSK6 · Diễn đạt nâng cao", zh: "高级表达", topics: [] },
];

/** Tài liệu tải về — trung tâm điền khi có tệp. Tải tệp cần tài khoản học viên (cần máy chủ). */
export const SPEAK_FILES: { title: string; note: string }[] = [
  { title: "[Tên tài liệu] · HSK1", note: "PDF / Word – Đang cập nhật" },
  { title: "[Tên tài liệu] · HSK2", note: "PDF / Word – Đang cập nhật" },
  { title: "[Tên tài liệu] · Ngân hàng câu hỏi", note: "Excel cho giáo viên – Đang cập nhật" },
];

export function findTopic(code: string): SpeakTopic | undefined {
  for (const l of SPEAK_LEVELS) {
    const t = l.topics.find((x) => x.code === code);
    if (t) return t;
  }
  return undefined;
}
