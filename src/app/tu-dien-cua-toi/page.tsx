import type { Metadata } from "next";
import { TuDienCuaToiPage } from "@/components/sites/ngoc-lam-anh/pages/tu-dien-cua-toi/TuDienCuaToiPage";

const title = "Từ điển của tôi · Du học Ngọc Lâm Anh";
const description = "Sổ từ vựng tiếng Trung cá nhân: thêm, sửa, xóa từ; nhập từ Excel, CSV, PDF; xuất Excel. Lưu ngay trên trình duyệt.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TuDienCuaToiPage />;
}
