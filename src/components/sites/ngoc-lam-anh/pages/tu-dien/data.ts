// Từ điển tiếng Trung chuyên ngành — DỮ LIỆU MẪU do trung tâm Ngọc Lâm Anh tự soạn.
// Đây là từ vựng phổ thông dùng trong công sở, nhà xưởng, thương mại, dịch vụ.
// Muốn thêm từ: thêm một dòng vào `entries` của ngành tương ứng (hoặc thêm ngành mới vào DICT_SECTIONS).
//
// Cấp độ: A cơ bản (nhân viên mới cần biết) · B thường dùng · C kỹ thuật chuyên ngành · D quản lý, báo cáo, phiên dịch.

export type Level = "A" | "B" | "C" | "D";

/** Ví dụ / mẫu câu: [chữ Hán, pinyin, nghĩa tiếng Việt] */
export type Sentence = [zh: string, py: string, vi: string];

export type DictEntry = {
  zh: string;
  py: string;
  /** Từ loại (tiếng Việt), vd "danh từ" */
  pos: string;
  vi: string;
  lv: Level;
  /** Ngữ cảnh / ghi chú dùng từ */
  note?: string;
  ex?: Sentence;
};

export type DictSection = {
  key: string;
  group: string;
  vi: string;
  zh: string;
  py: string;
  intro: string;
  entries: DictEntry[];
  sentences?: Sentence[];
};

export type DictGroup = { key: string; vi: string; zh: string };

export const DICT_GROUPS: DictGroup[] = [
  { key: "chung", vi: "Các phòng ban chung", zh: "通用部门" },
  { key: "san-xuat", vi: "Sản xuất – công nghiệp", zh: "生产制造" },
  { key: "dich-vu", vi: "Thương mại – dịch vụ", zh: "贸易服务" },
];

export const LEVELS: { key: Level; label: string; hint: string }[] = [
  { key: "A", label: "A · Cơ bản", hint: "nhân viên mới cần biết" },
  { key: "B", label: "B · Thường dùng", hint: "thường dùng trong công việc" },
  { key: "C", label: "C · Kỹ thuật", hint: "kỹ thuật chuyên ngành" },
  { key: "D", label: "D · Quản lý, phiên dịch", hint: "quản lý, báo cáo, phiên dịch" },
];

export const DICT_SECTIONS: DictSection[] = [
  {
    key: "hanh-chinh",
    group: "chung",
    vi: "Hành chính – văn phòng",
    zh: "行政办公",
    py: "xíngzhèng bàngōng",
    intro: "Từ vựng dùng hằng ngày trong văn phòng: giấy tờ, họp hành, thông báo, xin nghỉ, công tác.",
    entries: [
      { zh: "办公室", py: "bàngōngshì", pos: "danh từ", vi: "văn phòng", lv: "A", ex: ["我在办公室等你。", "Wǒ zài bàngōngshì děng nǐ.", "Tôi đợi bạn ở văn phòng."] },
      { zh: "会议", py: "huìyì", pos: "danh từ", vi: "cuộc họp, hội nghị", lv: "A", ex: ["会议几点开始？", "Huìyì jǐ diǎn kāishǐ?", "Cuộc họp mấy giờ bắt đầu?"] },
      { zh: "文件", py: "wénjiàn", pos: "danh từ", vi: "tài liệu, văn bản; tệp (máy tính)", lv: "A", ex: ["请把文件发给我。", "Qǐng bǎ wénjiàn fā gěi wǒ.", "Vui lòng gửi tài liệu cho tôi."] },
      { zh: "打印", py: "dǎyìn", pos: "động từ", vi: "in (tài liệu)", lv: "A", ex: ["这份合同要打印两份。", "Zhè fèn hétong yào dǎyìn liǎng fèn.", "Hợp đồng này cần in hai bản."] },
      { zh: "复印", py: "fùyìn", pos: "động từ", vi: "photo, sao chụp", lv: "A" },
      { zh: "签字", py: "qiān zì", pos: "động từ", vi: "ký tên", lv: "A", ex: ["请在这里签字。", "Qǐng zài zhèlǐ qiān zì.", "Vui lòng ký tên ở đây."] },
      { zh: "盖章", py: "gài zhāng", pos: "động từ", vi: "đóng dấu", lv: "B", ex: ["这份文件需要经理盖章。", "Zhè fèn wénjiàn xūyào jīnglǐ gài zhāng.", "Văn bản này cần giám đốc đóng dấu."] },
      { zh: "通知", py: "tōngzhī", pos: "danh từ, động từ", vi: "thông báo", lv: "A", ex: ["公司通知明天放假。", "Gōngsī tōngzhī míngtiān fàngjià.", "Công ty thông báo ngày mai được nghỉ."] },
      { zh: "报告", py: "bàogào", pos: "danh từ, động từ", vi: "báo cáo", lv: "B" },
      { zh: "请假", py: "qǐng jià", pos: "động từ", vi: "xin nghỉ phép", lv: "A", ex: ["我明天想请一天假。", "Wǒ míngtiān xiǎng qǐng yì tiān jià.", "Ngày mai tôi muốn xin nghỉ một ngày."] },
      { zh: "出差", py: "chū chāi", pos: "động từ", vi: "đi công tác", lv: "B", ex: ["经理下周去中国出差。", "Jīnglǐ xià zhōu qù Zhōngguó chū chāi.", "Tuần sau giám đốc đi công tác Trung Quốc."] },
      { zh: "审批", py: "shěnpī", pos: "động từ", vi: "xét duyệt, phê duyệt", lv: "D", note: "Dùng cho đơn từ, hồ sơ cần cấp trên duyệt." },
    ],
    sentences: [
      ["这份文件什么时候要？", "Zhè fèn wénjiàn shénme shíhou yào?", "Văn bản này khi nào cần?"],
      ["会议改到明天上午九点。", "Huìyì gǎi dào míngtiān shàngwǔ jiǔ diǎn.", "Cuộc họp dời sang 9 giờ sáng mai."],
      ["请帮我复印三份。", "Qǐng bāng wǒ fùyìn sān fèn.", "Nhờ bạn photo giúp tôi ba bản."],
    ],
  },
  {
    key: "nhan-su",
    group: "chung",
    vi: "Nhân sự",
    zh: "人力资源",
    py: "rénlì zīyuán",
    intro: "Tuyển dụng, hợp đồng, lương thưởng, chấm công, đào tạo nhân viên.",
    entries: [
      { zh: "员工", py: "yuángōng", pos: "danh từ", vi: "nhân viên", lv: "A" },
      { zh: "招聘", py: "zhāopìn", pos: "động từ", vi: "tuyển dụng", lv: "B", ex: ["工厂正在招聘工人。", "Gōngchǎng zhèngzài zhāopìn gōngrén.", "Nhà máy đang tuyển công nhân."] },
      { zh: "面试", py: "miànshì", pos: "động từ, danh từ", vi: "phỏng vấn", lv: "A" },
      { zh: "合同", py: "hétong", pos: "danh từ", vi: "hợp đồng", lv: "A", ex: ["我们签了一年的合同。", "Wǒmen qiān le yì nián de hétong.", "Chúng tôi đã ký hợp đồng một năm."] },
      { zh: "试用期", py: "shìyòngqī", pos: "danh từ", vi: "thời gian thử việc", lv: "B" },
      { zh: "工资", py: "gōngzī", pos: "danh từ", vi: "tiền lương", lv: "A", ex: ["每月十号发工资。", "Měi yuè shí hào fā gōngzī.", "Ngày 10 hằng tháng trả lương."] },
      { zh: "加班", py: "jiā bān", pos: "động từ", vi: "tăng ca, làm thêm giờ", lv: "A", ex: ["今天晚上要加班吗？", "Jīntiān wǎnshang yào jiā bān ma?", "Tối nay có phải tăng ca không?"] },
      { zh: "加班费", py: "jiābānfèi", pos: "danh từ", vi: "tiền tăng ca", lv: "B" },
      { zh: "打卡", py: "dǎ kǎ", pos: "động từ", vi: "chấm công (quẹt thẻ, vân tay)", lv: "A", ex: ["上班要先打卡。", "Shàngbān yào xiān dǎ kǎ.", "Đi làm phải chấm công trước."] },
      { zh: "培训", py: "péixùn", pos: "động từ", vi: "đào tạo, tập huấn", lv: "B" },
      { zh: "辞职", py: "cí zhí", pos: "động từ", vi: "xin nghỉ việc, thôi việc", lv: "B" },
      { zh: "社保", py: "shèbǎo", pos: "danh từ", vi: "bảo hiểm xã hội", lv: "C", note: "Viết tắt của 社会保险 shèhuì bǎoxiǎn." },
    ],
    sentences: [
      ["你什么时候可以来上班？", "Nǐ shénme shíhou kěyǐ lái shàngbān?", "Khi nào bạn có thể đi làm?"],
      ["试用期是两个月。", "Shìyòngqī shì liǎng ge yuè.", "Thời gian thử việc là hai tháng."],
      ["这个月我加了二十个小时的班。", "Zhège yuè wǒ jiā le èrshí ge xiǎoshí de bān.", "Tháng này tôi tăng ca hai mươi tiếng."],
    ],
  },
  {
    key: "ke-toan",
    group: "chung",
    vi: "Kế toán – tài chính",
    zh: "财务会计",
    py: "cáiwù kuàijì",
    intro: "Hóa đơn, thanh toán, chi phí, thuế, báo cáo tài chính.",
    entries: [
      { zh: "会计", py: "kuàijì", pos: "danh từ", vi: "kế toán; nhân viên kế toán", lv: "A" },
      { zh: "发票", py: "fāpiào", pos: "danh từ", vi: "hóa đơn", lv: "A", ex: ["请给我开一张发票。", "Qǐng gěi wǒ kāi yì zhāng fāpiào.", "Vui lòng xuất cho tôi một hóa đơn."] },
      { zh: "收据", py: "shōujù", pos: "danh từ", vi: "biên lai", lv: "B" },
      { zh: "付款", py: "fù kuǎn", pos: "động từ", vi: "thanh toán, trả tiền", lv: "A" },
      { zh: "报销", py: "bàoxiāo", pos: "động từ", vi: "thanh toán lại chi phí (hoàn ứng)", lv: "B", ex: ["出差的车费可以报销。", "Chū chāi de chēfèi kěyǐ bàoxiāo.", "Tiền xe đi công tác được thanh toán lại."] },
      { zh: "账户", py: "zhànghù", pos: "danh từ", vi: "tài khoản", lv: "B" },
      { zh: "税", py: "shuì", pos: "danh từ", vi: "thuế", lv: "B" },
      { zh: "增值税", py: "zēngzhíshuì", pos: "danh từ", vi: "thuế giá trị gia tăng (VAT)", lv: "C" },
      { zh: "成本", py: "chéngběn", pos: "danh từ", vi: "giá thành, chi phí", lv: "C" },
      { zh: "利润", py: "lìrùn", pos: "danh từ", vi: "lợi nhuận", lv: "C" },
      { zh: "预算", py: "yùsuàn", pos: "danh từ", vi: "ngân sách, dự toán", lv: "C" },
      { zh: "对账", py: "duì zhàng", pos: "động từ", vi: "đối chiếu sổ sách, đối chiếu công nợ", lv: "C" },
      { zh: "财务报表", py: "cáiwù bàobiǎo", pos: "danh từ", vi: "báo cáo tài chính", lv: "D" },
    ],
    sentences: [
      ["这笔钱什么时候付款？", "Zhè bǐ qián shénme shíhou fù kuǎn?", "Khoản tiền này khi nào thanh toán?"],
      ["发票上的金额不对。", "Fāpiào shang de jīn'é bú duì.", "Số tiền trên hóa đơn không đúng."],
    ],
  },
  {
    key: "san-xuat",
    group: "san-xuat",
    vi: "Sản xuất – nhà xưởng",
    zh: "生产车间",
    py: "shēngchǎn chējiān",
    intro: "Từ vựng chung trong xưởng: dây chuyền, máy móc, sản lượng, ca kíp, an toàn.",
    entries: [
      { zh: "车间", py: "chējiān", pos: "danh từ", vi: "xưởng, phân xưởng", lv: "A" },
      { zh: "生产线", py: "shēngchǎnxiàn", pos: "danh từ", vi: "dây chuyền sản xuất", lv: "A" },
      { zh: "工人", py: "gōngrén", pos: "danh từ", vi: "công nhân", lv: "A" },
      { zh: "组长", py: "zǔzhǎng", pos: "danh từ", vi: "tổ trưởng", lv: "A" },
      { zh: "机器", py: "jīqì", pos: "danh từ", vi: "máy, máy móc", lv: "A" },
      { zh: "设备", py: "shèbèi", pos: "danh từ", vi: "thiết bị", lv: "B" },
      { zh: "产量", py: "chǎnliàng", pos: "danh từ", vi: "sản lượng", lv: "B", ex: ["今天的产量是多少？", "Jīntiān de chǎnliàng shì duōshao?", "Sản lượng hôm nay là bao nhiêu?"] },
      { zh: "原材料", py: "yuáncáiliào", pos: "danh từ", vi: "nguyên vật liệu", lv: "B" },
      { zh: "维修", py: "wéixiū", pos: "động từ", vi: "sửa chữa, bảo trì", lv: "B", ex: ["这台机器坏了，需要维修。", "Zhè tái jīqì huài le, xūyào wéixiū.", "Máy này hỏng rồi, cần sửa."] },
      { zh: "返工", py: "fǎn gōng", pos: "động từ", vi: "làm lại (hàng chưa đạt)", lv: "B", ex: ["这批货要返工。", "Zhè pī huò yào fǎn gōng.", "Lô hàng này phải làm lại."] },
      { zh: "换班", py: "huàn bān", pos: "động từ", vi: "đổi ca, giao ca", lv: "B" },
      { zh: "交期", py: "jiāoqī", pos: "danh từ", vi: "thời hạn giao hàng", lv: "C" },
      { zh: "安全帽", py: "ānquánmào", pos: "danh từ", vi: "mũ bảo hộ", lv: "A" },
    ],
    sentences: [
      ["今天的生产任务完成了吗？", "Jīntiān de shēngchǎn rènwu wánchéng le ma?", "Nhiệm vụ sản xuất hôm nay đã hoàn thành chưa?"],
      ["机器有异常，请马上停机。", "Jīqì yǒu yìcháng, qǐng mǎshàng tíng jī.", "Máy có bất thường, hãy dừng máy ngay."],
      ["进车间要戴安全帽。", "Jìn chējiān yào dài ānquánmào.", "Vào xưởng phải đội mũ bảo hộ."],
    ],
  },
  {
    key: "chat-luong",
    group: "san-xuat",
    vi: "Quản lý chất lượng (QC)",
    zh: "品质管理",
    py: "pǐnzhì guǎnlǐ",
    intro: "Kiểm tra, tiêu chuẩn, hàng lỗi, khiếu nại và cải tiến chất lượng.",
    entries: [
      { zh: "质量", py: "zhìliàng", pos: "danh từ", vi: "chất lượng", lv: "A" },
      { zh: "合格", py: "hégé", pos: "tính từ", vi: "đạt chuẩn, đạt yêu cầu", lv: "A" },
      { zh: "检查", py: "jiǎnchá", pos: "động từ", vi: "kiểm tra", lv: "A" },
      { zh: "不良品", py: "bùliángpǐn", pos: "danh từ", vi: "hàng lỗi, sản phẩm không đạt", lv: "B", ex: ["不良品要放在红色箱子里。", "Bùliángpǐn yào fàng zài hóngsè xiāngzi li.", "Hàng lỗi phải để vào thùng màu đỏ."] },
      { zh: "标准", py: "biāozhǔn", pos: "danh từ", vi: "tiêu chuẩn", lv: "B" },
      { zh: "尺寸", py: "chǐcun", pos: "danh từ", vi: "kích thước", lv: "B" },
      { zh: "抽检", py: "chōujiǎn", pos: "động từ", vi: "kiểm tra xác suất (lấy mẫu)", lv: "C" },
      { zh: "误差", py: "wùchā", pos: "danh từ", vi: "sai số", lv: "C" },
      { zh: "客诉", py: "kèsù", pos: "danh từ", vi: "khiếu nại của khách hàng", lv: "C" },
      { zh: "改善", py: "gǎishàn", pos: "động từ", vi: "cải thiện, cải tiến", lv: "C" },
    ],
    sentences: [
      ["这批产品抽检合格。", "Zhè pī chǎnpǐn chōujiǎn hégé.", "Lô sản phẩm này kiểm tra xác suất đạt."],
      ["尺寸超出了标准。", "Chǐcun chāochū le biāozhǔn.", "Kích thước vượt quá tiêu chuẩn."],
    ],
  },
  {
    key: "kho-van",
    group: "san-xuat",
    vi: "Kho vận – logistics",
    zh: "仓储物流",
    py: "cāngchǔ wùliú",
    intro: "Nhập – xuất kho, tồn kho, kiểm kê, đóng container, giao nhận hàng.",
    entries: [
      { zh: "仓库", py: "cāngkù", pos: "danh từ", vi: "kho", lv: "A" },
      { zh: "发货", py: "fā huò", pos: "động từ", vi: "gửi hàng, xuất hàng đi", lv: "A" },
      { zh: "入库", py: "rù kù", pos: "động từ", vi: "nhập kho", lv: "B" },
      { zh: "出库", py: "chū kù", pos: "động từ", vi: "xuất kho", lv: "B" },
      { zh: "库存", py: "kùcún", pos: "danh từ", vi: "hàng tồn kho", lv: "B", ex: ["这个型号还有库存吗？", "Zhège xínghào hái yǒu kùcún ma?", "Mã hàng này còn tồn kho không?"] },
      { zh: "叉车", py: "chāchē", pos: "danh từ", vi: "xe nâng", lv: "B" },
      { zh: "托盘", py: "tuōpán", pos: "danh từ", vi: "pallet, tấm kê hàng", lv: "B" },
      { zh: "签收", py: "qiānshōu", pos: "động từ", vi: "ký nhận (hàng)", lv: "B" },
      { zh: "集装箱", py: "jízhuāngxiāng", pos: "danh từ", vi: "container", lv: "B", note: "Trong xưởng hay gọi là 货柜 huòguì." },
      { zh: "装柜", py: "zhuāng guì", pos: "động từ", vi: "đóng hàng vào container", lv: "C" },
      { zh: "盘点", py: "pándiǎn", pos: "động từ", vi: "kiểm kê", lv: "C" },
    ],
    sentences: [
      ["这批货明天上午发货。", "Zhè pī huò míngtiān shàngwǔ fā huò.", "Lô hàng này sáng mai xuất đi."],
      ["月底要盘点仓库。", "Yuèdǐ yào pándiǎn cāngkù.", "Cuối tháng phải kiểm kê kho."],
    ],
  },
  {
    key: "may-mac",
    group: "san-xuat",
    vi: "May mặc",
    zh: "服装",
    py: "fúzhuāng",
    intro: "Vải, phụ liệu, cắt – may – là, kích cỡ trong xưởng may.",
    entries: [
      { zh: "面料", py: "miànliào", pos: "danh từ", vi: "vải (vải chính)", lv: "B" },
      { zh: "辅料", py: "fǔliào", pos: "danh từ", vi: "phụ liệu", lv: "B" },
      { zh: "缝纫机", py: "féngrènjī", pos: "danh từ", vi: "máy may", lv: "A" },
      { zh: "裁剪", py: "cáijiǎn", pos: "động từ", vi: "cắt (vải)", lv: "B" },
      { zh: "纽扣", py: "niǔkòu", pos: "danh từ", vi: "cúc áo, khuy", lv: "A" },
      { zh: "拉链", py: "lāliàn", pos: "danh từ", vi: "khóa kéo", lv: "A" },
      { zh: "线头", py: "xiàntóu", pos: "danh từ", vi: "chỉ thừa, đầu chỉ", lv: "B", ex: ["包装前要剪干净线头。", "Bāozhuāng qián yào jiǎn gānjìng xiàntóu.", "Trước khi đóng gói phải cắt sạch chỉ thừa."] },
      { zh: "熨烫", py: "yùntàng", pos: "động từ", vi: "là, ủi", lv: "B" },
      { zh: "尺码", py: "chǐmǎ", pos: "danh từ", vi: "cỡ, size", lv: "A" },
      { zh: "纸样", py: "zhǐyàng", pos: "danh từ", vi: "rập giấy, mẫu rập", lv: "C" },
    ],
    sentences: [["这件衣服有几个尺码？", "Zhè jiàn yīfu yǒu jǐ ge chǐmǎ?", "Chiếc áo này có mấy cỡ?"]],
  },
  {
    key: "dien-tu",
    group: "san-xuat",
    vi: "Điện tử",
    zh: "电子",
    py: "diànzǐ",
    intro: "Linh kiện, bảng mạch, hàn, lắp ráp, kiểm tra, chống tĩnh điện.",
    entries: [
      { zh: "组装", py: "zǔzhuāng", pos: "động từ", vi: "lắp ráp", lv: "A" },
      { zh: "测试", py: "cèshì", pos: "động từ", vi: "kiểm tra, chạy thử (test)", lv: "A" },
      { zh: "螺丝", py: "luósī", pos: "danh từ", vi: "ốc vít", lv: "A" },
      { zh: "电路板", py: "diànlùbǎn", pos: "danh từ", vi: "bảng mạch", lv: "B" },
      { zh: "元件", py: "yuánjiàn", pos: "danh từ", vi: "linh kiện", lv: "B" },
      { zh: "焊接", py: "hànjiē", pos: "động từ", vi: "hàn", lv: "B" },
      { zh: "静电", py: "jìngdiàn", pos: "danh từ", vi: "tĩnh điện", lv: "B", ex: ["进车间要穿防静电服。", "Jìn chējiān yào chuān fáng jìngdiàn fú.", "Vào xưởng phải mặc đồ chống tĩnh điện."] },
      { zh: "电压", py: "diànyā", pos: "danh từ", vi: "điện áp", lv: "C" },
      { zh: "短路", py: "duǎnlù", pos: "động từ", vi: "chập mạch, đoản mạch", lv: "C" },
    ],
  },
  {
    key: "xay-dung",
    group: "san-xuat",
    vi: "Xây dựng",
    zh: "建筑",
    py: "jiànzhù",
    intro: "Công trường, vật liệu, bản vẽ, thi công và nghiệm thu.",
    entries: [
      { zh: "工地", py: "gōngdì", pos: "danh từ", vi: "công trường", lv: "A" },
      { zh: "水泥", py: "shuǐní", pos: "danh từ", vi: "xi măng", lv: "A" },
      { zh: "安全带", py: "ānquándài", pos: "danh từ", vi: "dây an toàn", lv: "A" },
      { zh: "钢筋", py: "gāngjīn", pos: "danh từ", vi: "cốt thép", lv: "B" },
      { zh: "混凝土", py: "hùnníngtǔ", pos: "danh từ", vi: "bê tông", lv: "B" },
      { zh: "图纸", py: "túzhǐ", pos: "danh từ", vi: "bản vẽ", lv: "B" },
      { zh: "施工", py: "shīgōng", pos: "động từ", vi: "thi công", lv: "B" },
      { zh: "脚手架", py: "jiǎoshǒujià", pos: "danh từ", vi: "giàn giáo", lv: "C" },
      { zh: "工期", py: "gōngqī", pos: "danh từ", vi: "thời hạn thi công, tiến độ", lv: "C" },
      { zh: "验收", py: "yànshōu", pos: "động từ", vi: "nghiệm thu", lv: "C" },
    ],
  },
  {
    key: "thuong-mai",
    group: "dich-vu",
    vi: "Thương mại – xuất nhập khẩu",
    zh: "外贸",
    py: "wàimào",
    intro: "Khách hàng, báo giá, đơn hàng, đặt cọc, hải quan, vận chuyển.",
    entries: [
      { zh: "客户", py: "kèhù", pos: "danh từ", vi: "khách hàng", lv: "A" },
      { zh: "样品", py: "yàngpǐn", pos: "danh từ", vi: "hàng mẫu", lv: "A" },
      { zh: "订单", py: "dìngdān", pos: "danh từ", vi: "đơn đặt hàng", lv: "A" },
      { zh: "报价", py: "bàojià", pos: "động từ, danh từ", vi: "báo giá", lv: "B", ex: ["请给我们报个价。", "Qǐng gěi wǒmen bào ge jià.", "Vui lòng báo giá cho chúng tôi."] },
      { zh: "定金", py: "dìngjīn", pos: "danh từ", vi: "tiền đặt cọc", lv: "B" },
      { zh: "运费", py: "yùnfèi", pos: "danh từ", vi: "cước vận chuyển", lv: "B" },
      { zh: "供应商", py: "gōngyìngshāng", pos: "danh từ", vi: "nhà cung cấp", lv: "B" },
      { zh: "海关", py: "hǎiguān", pos: "danh từ", vi: "hải quan", lv: "B" },
      { zh: "报关", py: "bào guān", pos: "động từ", vi: "khai hải quan", lv: "C" },
      { zh: "起订量", py: "qǐdìngliàng", pos: "danh từ", vi: "số lượng đặt hàng tối thiểu (MOQ)", lv: "C" },
      { zh: "汇率", py: "huìlǜ", pos: "danh từ", vi: "tỷ giá", lv: "C" },
    ],
    sentences: [
      ["你们的起订量是多少？", "Nǐmen de qǐdìngliàng shì duōshao?", "Số lượng đặt tối thiểu của các anh là bao nhiêu?"],
      ["我们先付百分之三十的定金。", "Wǒmen xiān fù bǎi fēn zhī sānshí de dìngjīn.", "Chúng tôi trả trước 30% tiền đặt cọc."],
    ],
  },
  {
    key: "khach-san",
    group: "dich-vu",
    vi: "Nhà hàng – khách sạn",
    zh: "酒店餐饮",
    py: "jiǔdiàn cānyǐn",
    intro: "Lễ tân, đặt phòng, nhận – trả phòng, gọi món, thanh toán.",
    entries: [
      { zh: "前台", py: "qiántái", pos: "danh từ", vi: "quầy lễ tân; lễ tân", lv: "A" },
      { zh: "预订", py: "yùdìng", pos: "động từ", vi: "đặt trước", lv: "A", ex: ["我想预订一个双人间。", "Wǒ xiǎng yùdìng yí ge shuāngrénjiān.", "Tôi muốn đặt một phòng đôi."] },
      { zh: "入住", py: "rùzhù", pos: "động từ", vi: "nhận phòng (check-in)", lv: "A" },
      { zh: "退房", py: "tuì fáng", pos: "động từ", vi: "trả phòng (check-out)", lv: "A" },
      { zh: "单人间", py: "dānrénjiān", pos: "danh từ", vi: "phòng đơn", lv: "A" },
      { zh: "押金", py: "yājīn", pos: "danh từ", vi: "tiền cọc", lv: "B" },
      { zh: "服务员", py: "fúwùyuán", pos: "danh từ", vi: "nhân viên phục vụ", lv: "A" },
      { zh: "菜单", py: "càidān", pos: "danh từ", vi: "thực đơn", lv: "A" },
      { zh: "买单", py: "mǎi dān", pos: "động từ", vi: "tính tiền, thanh toán", lv: "A" },
      { zh: "打包", py: "dǎ bāo", pos: "động từ", vi: "gói mang về", lv: "A" },
    ],
    sentences: [
      ["请问您几位？", "Qǐngwèn nín jǐ wèi?", "Xin hỏi quý khách đi mấy người?"],
      ["退房时间是中午十二点。", "Tuì fáng shíjiān shì zhōngwǔ shí'èr diǎn.", "Giờ trả phòng là 12 giờ trưa."],
    ],
  },
];

/** Gói tải về (PDF/Word) — trung tâm điền link khi có tài liệu thật */
export const DICT_FILES: { title: string; note: string }[] = [
  { title: "[Tên tài liệu] · Bản PDF đầy đủ", note: "Đang cập nhật" },
  { title: "[Tên tài liệu] · Bản Word", note: "Đang cập nhật" },
];

export type FlatEntry = DictEntry & { sec: string; secVi: string; code: string };

/** Tất cả mục từ, kèm ngành và mã (dùng cho tìm kiếm, tra cứu từ trang khác) */
export const ALL_ENTRIES: FlatEntry[] = DICT_SECTIONS.flatMap((s) =>
  s.entries.map((e, i) => ({ ...e, sec: s.key, secVi: s.vi, code: `${s.key}-${i + 1}` })),
);
