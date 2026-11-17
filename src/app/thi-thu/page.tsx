import type { Metadata } from "next";
import { ThiThuPage } from "@/components/sites/ngoc-lam-anh/pages/thi-thu/ThiThuPage";

const title = "Thi thử HSK online · Du học Ngọc Lâm Anh";
const description = "Thi thử HSK 2.0, HSK 3.0 và thi nói HSKK online, chấm điểm tự động, xem đáp án và giải thích từng câu.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <ThiThuPage />;
}
