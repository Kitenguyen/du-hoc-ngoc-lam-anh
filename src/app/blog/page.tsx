import type { Metadata } from "next";
import { BlogList } from "@/components/sites/ngoc-lam-anh/pages/blog/BlogList";

const title = "Tin tức · Du học Ngọc Lâm Anh";
const description =
  "Tin du học Trung Quốc, học bổng, lịch khai giảng và kinh nghiệm học tiếng Trung từ Trung tâm Du học Ngọc Lâm Anh.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { trang, nhan } = await searchParams;
  const page = Math.max(1, Number.parseInt(typeof trang === "string" ? trang : "1", 10) || 1);
  const label = typeof nhan === "string" && nhan.trim() ? nhan.trim() : undefined;
  return <BlogList page={page} label={label} />;
}
