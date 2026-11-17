// Giáo trình Tiếng Trung Thương mại – Dịch thuật — trang /giao-trinh-dich-thuat.
//
// Bài 1 là BÀI MẪU do website tự soạn (văn bản thương mại phổ thông) để minh họa cách trình bày;
// trung tâm có thể giữ, sửa hoặc thay bằng bài của mình. Các bài "[Tên bài]" là ô giữ chỗ (chưa có nội dung).
// Bản phân tích đầy đủ (phân tích từng câu, bài tập, đáp án) ở trang mẫu chỉ mở cho tài khoản quản trị → cần máy chủ.

export type Sentence = { zh: string; py: string; vi: string };
export type VocabRow = { zh: string; py: string; pos?: string; vi: string };

export type DichLesson = {
  id: number;
  titleVi: string;
  titleZh: string;
  level: string;
  /** Bài khóa; để trống → bài đang biên soạn */
  baikhoa: Sentence[];
  tuvung: VocabRow[];
};

export const LESSONS: DichLesson[] = [
  {
    id: 1,
    titleVi: "Giới thiệu công ty (bài mẫu)",
    titleZh: "公司简介",
    level: "HSK 4–5",
    baikhoa: [
      {
        zh: "我们公司成立于2010年，是一家专业生产家具的企业。",
        py: "Wǒmen gōngsī chénglì yú èr líng yī líng nián, shì yì jiā zhuānyè shēngchǎn jiājù de qǐyè.",
        vi: "Công ty chúng tôi được thành lập năm 2010, là một doanh nghiệp chuyên sản xuất đồ nội thất.",
      },
      {
        zh: "公司拥有现代化的工厂和经验丰富的技术团队。",
        py: "Gōngsī yōngyǒu xiàndàihuà de gōngchǎng hé jīngyàn fēngfù de jìshù tuánduì.",
        vi: "Công ty có nhà máy hiện đại và đội ngũ kỹ thuật giàu kinh nghiệm.",
      },
      {
        zh: "我们的产品主要出口到欧洲、美国和日本等市场。",
        py: "Wǒmen de chǎnpǐn zhǔyào chūkǒu dào Ōuzhōu, Měiguó hé Rìběn děng shìchǎng.",
        vi: "Sản phẩm của chúng tôi chủ yếu xuất khẩu sang các thị trường như châu Âu, Mỹ và Nhật Bản.",
      },
      {
        zh: "我们始终坚持“质量第一、客户至上”的原则。",
        py: "Wǒmen shǐzhōng jiānchí “zhìliàng dì yī, kèhù zhìshàng” de yuánzé.",
        vi: "Chúng tôi luôn kiên trì nguyên tắc “chất lượng hàng đầu, khách hàng trên hết”.",
      },
      {
        zh: "期待与贵公司建立长期的合作关系。",
        py: "Qīdài yǔ guì gōngsī jiànlì chángqī de hézuò guānxì.",
        vi: "Rất mong được thiết lập quan hệ hợp tác lâu dài với quý công ty.",
      },
    ],
    tuvung: [
      { zh: "成立", py: "chénglì", pos: "Động từ", vi: "thành lập" },
      { zh: "企业", py: "qǐyè", pos: "Danh từ", vi: "doanh nghiệp" },
      { zh: "生产", py: "shēngchǎn", pos: "Động từ", vi: "sản xuất" },
      { zh: "家具", py: "jiājù", pos: "Danh từ", vi: "đồ nội thất" },
      { zh: "拥有", py: "yōngyǒu", pos: "Động từ", vi: "có, sở hữu" },
      { zh: "现代化", py: "xiàndàihuà", pos: "Tính từ", vi: "hiện đại" },
      { zh: "经验丰富", py: "jīngyàn fēngfù", pos: "Cụm từ", vi: "giàu kinh nghiệm" },
      { zh: "团队", py: "tuánduì", pos: "Danh từ", vi: "đội ngũ, nhóm" },
      { zh: "出口", py: "chūkǒu", pos: "Động từ", vi: "xuất khẩu" },
      { zh: "市场", py: "shìchǎng", pos: "Danh từ", vi: "thị trường" },
      { zh: "始终", py: "shǐzhōng", pos: "Phó từ", vi: "trước sau như một, luôn luôn" },
      { zh: "坚持", py: "jiānchí", pos: "Động từ", vi: "kiên trì, giữ vững" },
      { zh: "原则", py: "yuánzé", pos: "Danh từ", vi: "nguyên tắc" },
      { zh: "贵公司", py: "guì gōngsī", pos: "Cụm từ", vi: "quý công ty" },
      { zh: "合作", py: "hézuò", pos: "Động từ", vi: "hợp tác" },
    ],
  },
  { id: 2, titleVi: "[Tên bài 2]", titleZh: "[课文标题]", level: "Đang cập nhật", baikhoa: [], tuvung: [] },
  { id: 3, titleVi: "[Tên bài 3]", titleZh: "[课文标题]", level: "Đang cập nhật", baikhoa: [], tuvung: [] },
];
