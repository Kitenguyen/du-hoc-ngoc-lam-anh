import type { Metadata } from "next";
import { RegisterPage } from "@/components/sites/ngoc-lam-anh/pages/dang-ky/RegisterPage";
import { isCourseId } from "@/components/sites/ngoc-lam-anh/pages/dang-ky/data";

const title = "Đăng ký học · Tiếng Trung Ngọc Lâm Anh";
const description = "Đăng ký học tiếng Trung tại Trung tâm Tiếng Trung Ngọc Lâm Anh, test trình độ và học thử miễn phí.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { khoa } = await searchParams;
  const id = typeof khoa === "string" ? khoa : "";
  return <RegisterPage initialCourse={isCourseId(id) ? id : ""} />;
}
