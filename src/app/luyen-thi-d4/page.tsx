import type { Metadata } from "next";
import { D4Page } from "@/components/sites/ngoc-lam-anh/pages/luyen-thi-d4/D4Page";

const title = "Luyện thi khối D4 · Tiếng Trung Ngọc Lâm Anh";
const description = "Luyện thi tiếng Trung THPT khối D4: bài giảng, từ vựng ôn tập với thẻ học và trò chơi, luyện đề trực tuyến.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <D4Page />;
}
