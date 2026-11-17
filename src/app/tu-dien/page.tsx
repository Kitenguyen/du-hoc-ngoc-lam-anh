import type { Metadata } from "next";
import { TuDienPage } from "@/components/sites/ngoc-lam-anh/pages/tu-dien/TuDienPage";

const title = "Từ điển chuyên ngành · Du học Ngọc Lâm Anh";
const description =
  "Tra cứu từ vựng tiếng Trung chuyên ngành theo phòng ban, ngành nghề: hành chính, nhân sự, kế toán, sản xuất, QC, kho vận, may mặc, điện tử, xây dựng, thương mại, khách sạn.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TuDienPage />;
}
