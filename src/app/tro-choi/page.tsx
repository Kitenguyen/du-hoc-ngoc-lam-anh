import type { Metadata } from "next";
import { TroChoiPage } from "@/components/sites/ngoc-lam-anh/pages/tro-choi/TroChoiPage";

const title = "Trò chơi bắn chữ Hán · Tiếng Trung Ngọc Lâm Anh";
const description = "Trò chơi gõ phiên âm bắn chữ Hán: ôn tập từ vựng HSK theo từng nhóm từ, chơi ngay trên trình duyệt.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TroChoiPage />;
}
