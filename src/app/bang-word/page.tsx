import type { Metadata } from "next";
import { BangWordPage } from "@/components/sites/ngoc-lam-anh/pages/bang-word/BangWordPage";

const title = "Bảng Word · Tiếng Trung Ngọc Lâm Anh";
const description = "Soạn phiếu học tiếng Trung khổ A4: phiên âm tự động dưới chữ Hán, khung từ vựng kèm thứ tự nét, in và xuất Word / PDF.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <BangWordPage />;
}
