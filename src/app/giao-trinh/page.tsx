import type { Metadata } from "next";
import { GiaoTrinhPage } from "@/components/sites/ngoc-lam-anh/pages/giao-trinh/GiaoTrinhPage";

const title = "Giáo trình · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Giáo án giảng dạy từng bài, kiểm tra theo đợt, kiểm tra cuối khóa và sách gốc của các giáo trình tại Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <GiaoTrinhPage />;
}
