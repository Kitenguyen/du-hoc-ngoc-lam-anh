import type { Metadata } from "next";
import { BangDenPage } from "@/components/sites/ngoc-lam-anh/pages/bang-den/BangDenPage";

const title = "Bảng đen giảng dạy · Tiếng Trung Ngọc Lâm Anh";
const description = "Bảng đen trực tuyến cho giáo viên: viết phấn nhiều màu, tẩy, hoàn tác, ô 田字格 / 米字格 và xem thứ tự nét chữ Hán.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <BangDenPage />;
}
