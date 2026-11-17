import type { Metadata } from "next";
import { OnlineCourseApp } from "@/components/sites/ngoc-lam-anh/pages/khoa-hoc-online/OnlineCourseApp";

const title = "Khóa học online · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Khóa học tiếng Trung online của Trung tâm Tiếng Trung Ngọc Lâm Anh: video bài giảng theo giáo trình và cấp độ HSK, kèm luyện từ vựng, kiểm tra, bài tập và luyện nói.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <OnlineCourseApp />;
}
