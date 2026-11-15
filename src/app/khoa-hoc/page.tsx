import type { Metadata } from "next";
import { CoursesPage } from "@/components/sites/ngoc-lam-anh/CoursesPage";

const title = "Khóa học · Tiếng Trung Ngọc Lâm Anh";
const description =
  "Khóa học tiếng Trung giao tiếp, luyện thi HSK 0–5, YTC cấp 1–2 và tư vấn du học Trung Quốc. Lớp 3–7 học viên, học thử miễn phí.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <CoursesPage />;
}
