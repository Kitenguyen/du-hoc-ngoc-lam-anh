// Nội dung website Tiếng Trung Ngọc Lâm Anh.
// Thông tin khóa học lấy từ https://tiengtrungchuongmy.com/ — sửa chữ tại đây, giao diện tự cập nhật.

export const BRAND = {
  name: "Ngọc Lâm Anh",
  headerName: "TIẾNG TRUNG NGỌC LÂM ANH",
  fullName: "Trung tâm Tiếng Trung Ngọc Lâm Anh",
  // Tên chữ Hán: 玉 (Ngọc) 林 (Lâm) 英 (Anh) + 汉语 (tiếng Trung) — đổi nếu trung tâm dùng tên khác
  zh: "玉林英汉语",
  slogan: "Vươn tầm thế giới – Kiến tạo tương lai",
  tagline: "Ngôn ngữ vững vàng – Tương lai rộng mở",
  logoMark: "/sites/ngoc-lam-anh/logo-mark.png",
  logo: "/sites/ngoc-lam-anh/logo.png",
};

// ⚠️ ĐIỀN THÔNG TIN LIÊN HỆ THẬT VÀO ĐÂY.
// Trang tiengtrungchuongmy.com không công bố số điện thoại / địa chỉ / email.
// Khi `phone` còn để trống, nút "Gọi" và "Zalo" tạm dẫn tới trang Facebook.
export const CONTACT = {
  phone: "", // ví dụ: "0912345678"
  zalo: "", // ví dụ: "https://zalo.me/0912345678"
  email: "", // ví dụ: "tiengtrungngoclamanh@gmail.com"
  address: "[Địa chỉ cơ sở]",
  hours: "Ca sáng – chiều – tối",
  facebook: "https://www.facebook.com/HoaNguQuynhChinese",
};

export const PHONE_LABEL = CONTACT.phone || "[Số điện thoại]";
export const CALL_HREF = CONTACT.phone ? `tel:${CONTACT.phone}` : CONTACT.facebook;
export const ZALO_HREF = CONTACT.zalo || (CONTACT.phone ? `https://zalo.me/${CONTACT.phone}` : CONTACT.facebook);

export const SOURCE_ORIGIN = "https://tiengtrungchuongmy.com/";

/** Trang đã có trong dự án → đường dẫn nội bộ. Còn lại → trang tương ứng trên tiengtrungchuongmy.com. */
const LOCAL_ROUTES: Record<string, string> = {
  "khoa-hoc": "/khoa-hoc",
};

export function href(path: string): string {
  if (/^(https?:|tel:|mailto:|#|\/)/.test(path)) return path;
  const [slug, rest = ""] = path.split(/(?=[?#])/);
  const local = LOCAL_ROUTES[slug];
  return local ? local + rest : SOURCE_ORIGIN + slug + (slug && !slug.endsWith("/") ? "/" : "") + rest;
}

export const REGISTER_HREF = "lien-he";

export type NavLink = { label: string; href: string; className?: string; external?: boolean; id?: string };
export type NavItem = NavLink & { children?: NavLink[]; active?: boolean };

export const NAV: NavItem[] = [
  { label: "Trang chủ", href: "" },
  {
    label: "Khóa học",
    href: "khoa-hoc",
    active: true,
    children: [
      { label: "Tiếng Trung giao tiếp", href: "khoa-hoc#giao-tiep" },
      { label: "Luyện thi HSK", href: "khoa-hoc#hsk" },
      { label: "YTC cấp 1 (người mới)", href: "khoa-hoc#ytc-cap-1" },
      { label: "YTC cấp 2", href: "khoa-hoc#ytc-cap-2" },
      { label: "Lịch khai giảng", href: "lich-khai-giang" },
    ],
  },
  {
    label: "Du học",
    href: "khoa-hoc#du-hoc",
    children: [
      { label: "Tư vấn du học & học bổng", href: "khoa-hoc#du-hoc" },
      { label: "Du học Trung Quốc", href: "du-hoc" },
      { label: "Tin du học Trung Quốc", href: "category/blog/khoa-hoc-tieng-trung/du-hoc-trung-quoc" },
    ],
  },
  { label: "Đội ngũ giáo viên", href: "doi-ngu-giao-vien" },
  {
    label: "Thư viện",
    href: "category/thu-vien",
    children: [
      { label: "HSK 9 cấp", href: "category/thu-vien/hsk-9-cap" },
      { label: "Phương pháp học", href: "category/thu-vien/phuong-phap-hoc" },
      { label: "Tin tức HSK và HSKK", href: "category/thu-vien/tin-tuc-hsk-va-hskk" },
      { label: "Từ vựng", href: "category/thu-vien/tu-vung" },
      { label: "Ngữ pháp", href: "category/thu-vien/ngu-phap" },
      { label: "Thành ngữ", href: "category/thu-vien/thanh-ngu" },
      { label: "Học qua bài hát và phim ảnh", href: "category/thu-vien/hoc-tieng-trung-qua-bai-hat-va-phim-anh" },
      { label: "Kho sách & tài liệu", href: "category/thu-vien/kho-sach-tai-lieu-hoc-tieng-trung" },
      { label: "Thư viện online", href: "category/thu-vien/thu-vien-online" },
      { label: "Văn hóa – Ẩm thực Trung Quốc", href: "category/thu-vien/van-hoa-am-thuc-trung-quoc" },
    ],
  },
  {
    label: "Tin tức",
    href: "category/tin-tuc",
    children: [
      { label: "Lịch khai giảng", href: "lich-khai-giang" },
      { label: "Hội thảo khoa học", href: "category/tin-tuc/hoi-thao-khoa-hoc" },
      { label: "Sự kiện trung tâm", href: "category/tin-tuc/su-kien-quynh-chinese" },
    ],
  },
  { label: "Liên hệ", href: "lien-he" },
  { label: "📝 Đăng ký tư vấn", href: REGISTER_HREF, className: "m-only m-cta" },
  { label: `☎ Gọi ${PHONE_LABEL}`, href: CALL_HREF, className: "m-only" },
  { label: "💬 Facebook", href: CONTACT.facebook, className: "m-only", external: true },
];

export type Course = {
  id: string;
  glyph: string;
  tag: string;
  title: string;
  /** Thời lượng nổi bật, ví dụ "20 buổi". Bỏ trống nếu chưa công bố. */
  months?: string;
  sessions?: string;
  intro: string;
  requirement?: string;
  audience?: string;
  schedule?: string;
  outcome?: string;
  syllabusTitle?: string;
  syllabus: string[];
  cta?: string;
  ctaHref?: string;
};

export type CourseGroup = {
  id: string;
  tone: "light" | "red";
  zh: string;
  title: string;
  intro: string;
  courses: Course[];
};

export const PAGE_HEAD = {
  zh: "课程",
  title: "Khóa học tiếng Trung",
  intro:
    "Hệ thống đào tạo tiếng Trung bài bản và tư vấn du học tận tâm. Lớp 3 – 7 học viên, ca sáng – chiều – tối linh hoạt.",
};

export const JUMP_LINKS = [
  { label: "Tiếng Trung giao tiếp", href: "#giao-tiep" },
  { label: "Luyện thi HSK", href: "#hsk" },
  { label: "Du học Trung Quốc", href: "#du-hoc" },
];

export const COURSE_GROUPS: CourseGroup[] = [
  {
    id: "giao-tiep",
    tone: "light",
    zh: "汉语交际",
    title: "Tiếng Trung giao tiếp",
    intro:
      "Nói được ngay – dùng được liền trong công việc và đời sống. Tập trung nghe – nói thực chiến với các tình huống giao tiếp phổ biến cùng người bản xứ.",
    courses: [
      {
        id: "tieng-trung-giao-tiep",
        glyph: "话",
        tag: "Giao tiếp cấp tốc",
        title: "Tiếng Trung giao tiếp",
        months: "20 buổi",
        sessions: "30 giờ học",
        intro:
          "Lộ trình tinh gọn, tiết kiệm thời gian và chi phí nhưng vẫn đảm bảo giao tiếp thực tế. Luyện nghe – nói – phản xạ mỗi buổi học cùng giáo viên.",
        audience: "Người mới bắt đầu, người cần giao tiếp với đối tác Trung Quốc, chuẩn bị du học hoặc thi HSKK",
        schedule: "20 buổi · 1,5 giờ/buổi · ca sáng – chiều – tối",
        outcome: "300+ từ vựng, 150 mẫu câu giao tiếp, phản xạ qua 20 chủ đề",
        syllabusTitle: "Lộ trình học",
        syllabus: [
          "Giai đoạn 1 (buổi 1 – 4): phát âm chuẩn và gõ tiếng Trung",
          "Giai đoạn 2 (buổi 5 – 10): giao tiếp cơ bản theo chủ đề",
          "Giai đoạn 3 (buổi 11 – 20): phản xạ thực tế và giao tiếp nâng cao",
          "Giáo trình 160 hội thoại, biên soạn theo chuẩn Đại học Bắc Kinh",
        ],
        cta: "Đăng ký tư vấn miễn phí",
        ctaHref: "tieng-trung-giao-tiep",
      },
      {
        id: "ytc-cap-1",
        glyph: "初",
        tag: "Người mới",
        title: "YTC cấp 1",
        months: "30 ngày",
        sessions: "đọc được – nói được",
        intro:
          "Học tiếng Trung từ số 0. Bạn chưa biết gì về tiếng Trung? Đây là khóa học dành riêng cho bạn.",
        audience: "Người chưa biết gì về tiếng Trung",
        schedule: "Lộ trình 30 ngày",
        outcome: "Đọc được pinyin, phát âm chuẩn, giao tiếp cơ bản",
        syllabusTitle: "Lộ trình 30 ngày",
        syllabus: ["Tuần 1 – 2: phát âm và thanh điệu", "Tuần 3 – 4: giao tiếp cơ bản"],
        cta: "Học thử miễn phí",
        ctaHref: "ytc-cap-1-nguoi-moi",
      },
      {
        id: "ytc-cap-2",
        glyph: "进",
        tag: "Nâng cao",
        title: "YTC cấp 2",
        months: "Nâng cao",
        sessions: "giao tiếp",
        intro:
          "Thoát khỏi trạng thái học mà không dùng được. Dành cho bạn đang bị kẹt ở level trung cấp: nói chậm, thiếu tự nhiên, không phản xạ khi nghe.",
        audience: "Người đã có nền tảng, muốn dùng tiếng Trung trong công việc",
        outcome: "Phản xạ nhanh, nói câu dài tự nhiên, giao tiếp linh hoạt",
        syllabusTitle: "Lộ trình nâng cao",
        syllabus: ["Mở rộng từ vựng", "Hội thoại nâng cao", "Nghe thực tế"],
        cta: "Kiểm tra trình độ miễn phí",
        ctaHref: "ytc-cap-2",
      },
    ],
  },
  {
    id: "hsk",
    tone: "red",
    zh: "汉语水平考试",
    title: "Luyện thi HSK",
    intro:
      "Luyện thi HSK 3 – 4 trong 4 – 6 tháng. Chiến lược đúng – thi là đỗ. Lộ trình chuẩn quốc tế, luyện HSK & HSKK bài bản theo format mới, cam kết đầu ra – hỗ trợ thi thật.",
    courses: [
      {
        id: "hsk-0-3",
        glyph: "三",
        tag: "Chứng chỉ",
        title: "HSK 0 – 3",
        intro: "Từ con số 0 đến chứng chỉ HSK3: lộ trình HSK1 → HSK2 → HSK3 theo chuẩn quốc tế.",
        audience: "Người mới bắt đầu",
        outcome: "Chứng chỉ HSK3",
        syllabusTitle: "Khóa học giúp bạn",
        syllabus: [
          "Biết bắt đầu từ đâu với lộ trình rõ ràng",
          "Luyện đề đúng chiến lược, hết sai lặp lại",
          "Luyện thi HSK & HSKK theo format mới",
          "Test trình độ miễn phí trước khi xếp lớp",
        ],
        cta: "Test trình độ miễn phí",
        ctaHref: "luyen-thi-hsk",
      },
      {
        id: "hsk-0-4",
        glyph: "四",
        tag: "Chứng chỉ",
        title: "HSK 0 – 4",
        intro: "Lộ trình trọn gói lên HSK4 – cấp độ mở cửa cho du học, học bổng và việc làm.",
        audience: "Người mới bắt đầu hoặc đã có nền tảng",
        outcome: "Chứng chỉ HSK4",
        syllabusTitle: "Khóa học giúp bạn",
        syllabus: [
          "Lộ trình chuẩn quốc tế – chinh phục chứng chỉ nhanh chóng",
          "Luyện thi HSK & HSKK bài bản theo format mới",
          "Cam kết đầu ra – hỗ trợ thi thật",
          "Nhận bộ đề HSK miễn phí khi đăng ký",
        ],
        cta: "Test trình độ miễn phí",
        ctaHref: "luyen-thi-hsk",
      },
      {
        id: "hsk-0-5",
        glyph: "五",
        tag: "Chứng chỉ",
        title: "HSK 0 – 5",
        intro: "Chinh phục trình độ cao cấp HSK5 – điều kiện cho học bổng đại học và sau đại học tại Trung Quốc.",
        audience: "Người học từ cơ bản đến nâng cao",
        outcome: "Chứng chỉ HSK5",
        syllabusTitle: "Khóa học giúp bạn",
        syllabus: [
          "Lộ trình chuẩn quốc tế từ cơ bản đến nâng cao",
          "Luyện thi HSK & HSKK bài bản theo format mới",
          "Cam kết đầu ra – hỗ trợ thi thật",
          "Định hướng học bổng du học sau khi đạt chứng chỉ",
        ],
        cta: "Test trình độ miễn phí",
        ctaHref: "luyen-thi-hsk",
      },
    ],
  },
  {
    id: "du-hoc",
    tone: "light",
    zh: "留学中国",
    title: "Du học Trung Quốc",
    intro:
      "Định hướng đúng ngay từ đầu – mở cánh cửa tương lai. Tư vấn miễn phí, hỗ trợ tìm trường, học bổng và lộ trình học phù hợp.",
    courses: [
      {
        id: "tu-van-du-hoc",
        glyph: "留",
        tag: "Du học & học bổng",
        title: "Tư vấn du học",
        months: "Học bổng",
        sessions: "đến 100%",
        intro:
          "Tư vấn trung thực, rõ ràng, không chèo kéo. Học viên được hướng dẫn chọn con đường phù hợp nhất và được đồng hành đến khi nhập học tại Trung Quốc.",
        audience: "Học sinh THPT, sinh viên, người đi làm muốn du học",
        schedule: "Hệ tiếng, đại học, thạc sĩ & tiến sĩ",
        outcome: "Nhập học đúng trường, đúng ngành, săn học bổng",
        syllabusTitle: "Điều kiện đầu vào",
        syllabus: [
          "Khóa học tiếng: có HSK là lợi thế, bằng tốt nghiệp cấp 3",
          "Hệ đại học: HSK4 trở lên, điểm tốt nghiệp cấp 3 trên 7.0",
          "Thạc sĩ & tiến sĩ: HSK5 – 6 trở lên, điểm tốt nghiệp trên 7.0",
          "Hộ chiếu và giấy khám sức khỏe",
        ],
        cta: "Đăng ký tư vấn du học",
        ctaHref: "du-hoc",
      },
    ],
  },
];

/** Ô thông tin dưới phần Du học (thay cho "Học liệu D4" của bản gốc). */
export const STUDY_ABROAD_TILES = {
  title: "Vì sao chọn du học Trung Quốc?",
  tiles: [
    {
      icon: "💰",
      title: "Chi phí hợp lý",
      text: "Học phí và sinh hoạt khoảng 7.000 – 8.000 USD/năm tùy chương trình và thành phố.",
      href: "du-hoc",
      accent: "var(--red)",
    },
    {
      icon: "🎓",
      title: "Học bổng đến 100%",
      text: "Nhiều suất miễn học phí, miễn ký túc xá, miễn bảo hiểm, trợ cấp 2.500 NDT/tháng.",
      href: "du-hoc",
      accent: "var(--gold)",
    },
    {
      icon: "📄",
      title: "Hồ sơ đơn giản",
      text: "Điều kiện hồ sơ và chứng minh tài chính đơn giản. Chưa có tiếng Trung có thể học 1 năm tiếng.",
      href: "du-hoc",
      accent: "#2f9e44",
    },
  ],
  note: "Ngành thế mạnh: công nghệ thông tin, giao thông, y khoa, văn hóa.",
};

export const GENERAL_INFO =
  "Lớp 3 – 7 học viên để giáo viên theo sát từng người. Học trực tuyến hoặc offline tại cơ sở, ca sáng – chiều – tối linh hoạt. Test trình độ và học thử miễn phí. Cam kết lớp không quá 7 học viên – hoàn tiền nếu không đạt đầu ra.";

export const COMMITMENTS = [
  "Lộ trình cá nhân hóa – học đúng mục tiêu",
  "Dạy để dùng thực tế – không chỉ để thi",
  "Tư vấn du học trung thực, không chèo kéo",
  "Đồng hành lâu dài sau khóa học",
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "Khóa học", href: "khoa-hoc" },
  { label: "Luyện thi HSK", href: "luyen-thi-hsk" },
  { label: "Du học Trung Quốc", href: "du-hoc" },
  { label: "Đội ngũ giáo viên", href: "doi-ngu-giao-vien" },
  { label: "Lịch khai giảng", href: "lich-khai-giang" },
  { label: "Thư viện", href: "category/thu-vien" },
  { label: "Liên hệ", href: "lien-he" },
];
