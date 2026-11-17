import type { Metadata } from "next";
import { TuVungPage } from "@/components/sites/ngoc-lam-anh/pages/tu-vung/TuVungPage";

const title = "Ôn tập từ vựng · Du học Ngọc Lâm Anh";
const description = "Ôn từ vựng HSK bằng thẻ học, trò chơi và bài kiểm tra tổng hợp – chạy ngay trên trình duyệt.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TuVungPage />;
}
