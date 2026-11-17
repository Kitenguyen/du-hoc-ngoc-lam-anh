import type { Metadata } from "next";
import { TuVungChuyenNganhPage } from "@/components/sites/ngoc-lam-anh/pages/tu-vung-chuyen-nganh/TuVungChuyenNganhPage";

const title = "Từ vựng chuyên ngành · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Bộ từ vựng tiếng Trung chuyên ngành dạng PDF (chữ Hán, phiên âm, nghĩa tiếng Việt) của Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TuVungChuyenNganhPage />;
}
