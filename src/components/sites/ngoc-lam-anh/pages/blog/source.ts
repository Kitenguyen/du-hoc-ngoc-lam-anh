import "server-only";
import { getPublishedBySlug, listPublished, type Post } from "@/lib/admin/posts";
import { BLOG } from "../../data";
import { BlogNotConfiguredError, getPost as getBloggerPost, listPosts as listBlogger, type BlogPage, type BlogPost } from "./blogger";

// Nguồn bài cho trang Tin tức: bài viết trong dashboard (D1) + bài trên Blogger (nếu có), xếp theo ngày đăng.

function fromDb(p: Post): BlogPost {
  return {
    id: `nla-${p.id}`,
    slug: p.slug,
    title: p.title,
    published: p.published_at ?? p.updated_at,
    updated: p.updated_at,
    labels: p.labels,
    image: p.cover ?? undefined,
    excerpt: p.excerpt,
    html: p.content,
    author: p.author_name ?? undefined,
  };
}

export type ListResult = { data: BlogPage | null; state: "ok" | "empty" | "error" };

export async function listAllPosts(page: number, label?: string): Promise<ListResult> {
  const per = BLOG.perPage;
  const need = page * per;
  const [local, remote] = await Promise.allSettled([listPublished(need, label), listBlogger(1, label, need)]);
  const parts: BlogPage[] = [];
  if (local.status === "fulfilled") parts.push({ posts: local.value.posts.map(fromDb), total: local.value.total });
  if (remote.status === "fulfilled") parts.push(remote.value);
  const remoteOff = remote.status === "rejected" && remote.reason instanceof BlogNotConfiguredError;
  if (!parts.length) return { data: null, state: remoteOff ? "empty" : "error" };
  const all = parts.flatMap((p) => p.posts).sort((a, b) => b.published.localeCompare(a.published));
  const total = parts.reduce((n, p) => n + p.total, 0);
  return { data: { posts: all.slice((page - 1) * per, page * per), total }, state: total ? "ok" : "empty" };
}

export async function findPost(slug: string): Promise<BlogPost | null> {
  try {
    const local = await getPublishedBySlug(slug);
    if (local) return fromDb(local);
  } catch {
    // chưa có cơ sở dữ liệu → thử Blogger
  }
  if (!/^\d/.test(slug)) return null;
  try {
    return await getBloggerPost(slug);
  } catch {
    return null;
  }
}
