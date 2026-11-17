import type { Metadata } from "next";
import { TraLuongTuPage } from "@/components/sites/ngoc-lam-anh/pages/tra-luong-tu/TraLuongTuPage";

const title = "Tra lượng từ · Du học Ngọc Lâm Anh";
const description =
  "Bảng tra lượng từ (量词) tiếng Trung thông dụng: pinyin, nghĩa tiếng Việt, danh từ đi kèm và câu ví dụ, có đọc to. Tìm theo chữ Hán, pinyin hoặc tiếng Việt.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TraLuongTuPage />;
}
