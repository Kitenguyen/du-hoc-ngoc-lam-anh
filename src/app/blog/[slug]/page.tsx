import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/sites/ngoc-lam-anh/pages/blog/BlogArticle";
import { getPost, type BlogPost } from "@/components/sites/ngoc-lam-anh/pages/blog/blogger";

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string): Promise<BlogPost | null> {
  try {
    return await getPost(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return { title: "Tin tức · Du học Ngọc Lâm Anh" };
  const title = `${post.title} · Du học Ngọc Lâm Anh`;
  return {
    title,
    description: post.excerpt,
    icons: { icon: "/sites/ngoc-lam-anh/logo-mark.png" },
    openGraph: { title, description: post.excerpt, type: "article", images: [post.image ?? "/sites/ngoc-lam-anh/logo.png"] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();
  return <BlogArticle post={post} />;
}
