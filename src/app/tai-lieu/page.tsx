import type { Metadata } from "next";
import { TaiLieuPage } from "@/components/sites/ngoc-lam-anh/pages/tai-lieu/TaiLieuPage";

const title = "Tài liệu · Du học Ngọc Lâm Anh";
const description =
  "Giáo án giảng dạy, tài liệu giáo trình HSK1–HSK6, tài liệu chuyên ngành, kho sách tiếng Trung và bảng tra lượng từ của Trung tâm Du học Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TaiLieuPage />;
}
