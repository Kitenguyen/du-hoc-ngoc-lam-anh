import type { Metadata } from "next";
import { LoginPage } from "@/components/sites/ngoc-lam-anh/pages/dang-nhap/LoginPage";

const title = "Đăng nhập · Tiếng Trung Ngọc Lâm Anh";
const description = "Đăng nhập dành cho học viên và giáo viên của Trung tâm Tiếng Trung Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { next } = await searchParams;
  return <LoginPage next={typeof next === "string" ? next : ""} />;
}
