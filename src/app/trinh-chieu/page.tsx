import type { Metadata } from "next";
import { TrinhChieuPage } from "@/components/sites/ngoc-lam-anh/pages/trinh-chieu/TrinhChieuPage";

const title = "Bài giảng trình chiếu · Tiếng Trung Ngọc Lâm Anh";
const description = "Trình chiếu bài giảng tiếng Trung trên lớp: từ mới, bài khóa, ngữ pháp, luyện tập, trò chơi; công cụ gọi tên, hẹn giờ, điểm thi đua, bút vẽ.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <TrinhChieuPage />;
}
