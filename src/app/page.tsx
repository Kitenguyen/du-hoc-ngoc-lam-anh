import type { Metadata } from "next";
import { HomePage } from "@/components/sites/ngoc-lam-anh/pages/home/HomePage";

const title = "Trang chủ · Du học Ngọc Lâm Anh";
const description =
  "Trung tâm Du học Ngọc Lâm Anh: tiếng Trung giao tiếp, YTC cấp 1 – 2, luyện thi HSK 0 – 5 và tư vấn du học Trung Quốc. Lớp 3 – 7 học viên, học thử miễn phí.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <HomePage />;
}
