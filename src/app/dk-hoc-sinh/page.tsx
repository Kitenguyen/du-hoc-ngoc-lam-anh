import type { Metadata } from "next";
import { StudentRegisterPage } from "@/components/sites/ngoc-lam-anh/pages/dk-hoc-sinh/StudentRegisterPage";

const title = "Đăng ký học viên · Tiếng Trung Ngọc Lâm Anh";
const description = "Đăng ký học viên và tạo tài khoản học online tại Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <StudentRegisterPage />;
}
