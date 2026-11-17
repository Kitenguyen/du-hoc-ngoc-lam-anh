import type { Metadata } from "next";
import { TuDienAiPage } from "@/components/sites/ngoc-lam-anh/pages/tu-dien-ai/TuDienAiPage";

const title = "Từ điển AI Việt ⇄ Trung · Du học Ngọc Lâm Anh";
const description = "Tra từ và câu Việt ⇄ Trung: nghĩa, phiên âm, ví dụ, cách viết chữ Hán.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TuDienAiPage />;
}
