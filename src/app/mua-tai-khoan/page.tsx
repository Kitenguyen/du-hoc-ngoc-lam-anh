import type { Metadata } from "next";
import { BuyAccountPage } from "@/components/sites/ngoc-lam-anh/pages/mua-tai-khoan/BuyAccountPage";

const title = "Đăng ký mua tài khoản · Tiếng Trung Ngọc Lâm Anh";
const description = "Đăng ký mua tài khoản học giáo án online của Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default function Page() {
  return <BuyAccountPage />;
}
