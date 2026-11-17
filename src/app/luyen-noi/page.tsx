import type { Metadata } from "next";
import { LuyenNoiPage } from "@/components/sites/ngoc-lam-anh/pages/luyen-noi/LuyenNoiPage";

const title = "Luyện nói phản xạ HSK1–HSK6 · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Luyện nói phản xạ tiếng Trung theo chủ đề: nghe câu hỏi, trả lời trong 10 giây, nghe và nhắc lại, kiểm tra viết – chấm ngay trên trình duyệt.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <LuyenNoiPage />;
}
