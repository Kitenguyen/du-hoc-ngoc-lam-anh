import type { Metadata } from "next";
import { SachTiengTrungPage } from "@/components/sites/ngoc-lam-anh/pages/sach-tieng-trung/SachTiengTrungPage";

const title = "Tài liệu tiếng Trung · Du học Ngọc Lâm Anh";
const description =
  "Kho sách giáo trình tiếng Trung bản điện tử (PDF) của Trung tâm Du học Ngọc Lâm Anh: xem thử, chọn mua và nhận tài liệu.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <SachTiengTrungPage />;
}
