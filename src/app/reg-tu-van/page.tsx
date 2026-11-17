import type { Metadata } from "next";
import { ConsultApp } from "@/components/sites/ngoc-lam-anh/pages/reg-tu-van/ConsultApp";

const title = "Đăng ký học viên mới · Tư vấn · Du học Ngọc Lâm Anh";
const description = "Danh sách học viên mới đăng ký dành cho nhân viên tư vấn tuyển sinh của Trung tâm Du học Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
};

export default function Page() {
  return <ConsultApp />;
}
