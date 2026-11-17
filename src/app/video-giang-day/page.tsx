import type { Metadata } from "next";
import { VideoGiangDayPage } from "@/components/sites/ngoc-lam-anh/pages/video-giang-day/VideoGiangDayPage";

const title = "Video giảng dạy · Du học Ngọc Lâm Anh";
const description =
  "Video bài giảng theo từng bài của giáo trình, dành cho học viên và giáo viên Trung tâm Du học Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <VideoGiangDayPage />;
}
