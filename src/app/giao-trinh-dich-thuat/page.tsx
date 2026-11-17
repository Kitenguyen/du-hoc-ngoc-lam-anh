import type { Metadata } from "next";
import { GiaoTrinhDichThuatPage } from "@/components/sites/ngoc-lam-anh/pages/giao-trinh-dich-thuat/GiaoTrinhDichThuatPage";

const title = "Giáo trình Dịch thuật · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Giáo trình Tiếng Trung Thương mại – Dịch thuật: bài khóa, bảng từ vựng và khung luyện dịch Trung → Việt của Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <GiaoTrinhDichThuatPage />;
}
