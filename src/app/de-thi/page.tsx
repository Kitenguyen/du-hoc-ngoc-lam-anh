import type { Metadata } from "next";
import { DeThiPage } from "@/components/sites/ngoc-lam-anh/pages/de-thi/DeThiPage";

const title = "Đề thi thử HSK · Du học Ngọc Lâm Anh";
const description = "Đề thi thử HSK và HSKK online: làm bài có giờ, chấm điểm tự động, xem đáp án và giải thích từng câu.";

export const metadata: Metadata = {
  title,
  description,
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
  return <DeThiPage levelId={first(sp.l)} examId={first(sp.de)} />;
}
