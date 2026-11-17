import type { Metadata } from "next";
import { D4Page } from "@/components/sites/ngoc-lam-anh/pages/de-thi-d4/D4Page";

const title = "Đề luyện thi D4 · Du học Ngọc Lâm Anh";
const description = "Luyện đề tiếng Trung THPT khối D4: làm bài có giờ, chấm điểm thang 10 và giải thích chi tiết từng câu.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false },
  icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
  openGraph: { title, description, images: ["/sites/ngoc-lam-anh/logo.png"] },
};

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  return <D4Page id={first(sp.d)} giai={Boolean(first(sp.giai))} />;
}
