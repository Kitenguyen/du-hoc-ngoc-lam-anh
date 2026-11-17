// Đọc bài viết từ Blogger (blog miễn phí của Google) qua feed JSON công khai – không cần khóa API.
// Trung tâm đăng bài tại blogger.com bằng tài khoản Google; web tự hiển thị bài mới.
// Cấu hình địa chỉ blog: data.ts › BLOG.bloggerUrl

import { sanitize, slugify, textOf } from "@/lib/html";
import { BLOG } from "../../data";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  published: string;
  updated: string;
  labels: string[];
  image?: string;
  excerpt: string;
  html: string;
  author?: string;
  sourceUrl?: string;
};

export type BlogPage = { posts: BlogPost[]; total: number };

type Txt = { $t: string };
type FeedEntry = {
  id: Txt;
  published: Txt;
  updated: Txt;
  title: Txt;
  content?: Txt;
  summary?: Txt;
  link?: { rel: string; href: string }[];
  category?: { term: string }[];
  media$thumbnail?: { url: string };
  author?: { name: Txt }[];
};
type Feed = { feed: { entry?: FeedEntry[]; openSearch$totalResults?: Txt } };
type Single = { entry: FeedEntry };

export class BlogNotConfiguredError extends Error {}

function base(): string {
  const url = BLOG.bloggerUrl.trim().replace(/\/+$/, "");
  if (!url) throw new BlogNotConfiguredError("Chưa cấu hình địa chỉ Blogger");
  return url;
}

async function getJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, { cache: "no-store", headers: { accept: "application/json" } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Blogger trả về lỗi ${res.status}`);
  return (await res.json()) as T;
}

function bigImage(url: string): string {
  // Ảnh Blogger: đổi kích thước thu nhỏ (s72-c, w200-h150…) sang ảnh lớn
  return url.replace(/\/(s\d+(-c)?|w\d+-h\d+(-[a-z-]+)?)\//, "/w800-h450-c/").replace(/=(s\d+(-c)?|w\d+-h\d+(-[a-z-]+)?)$/, "=w800-h450-c");
}

function toPost(e: FeedEntry): BlogPost {
  const id = e.id.$t.match(/post-(\d+)/)?.[1] ?? e.id.$t;
  const raw = e.content?.$t ?? e.summary?.$t ?? "";
  const firstImg = raw.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const thumb = e.media$thumbnail?.url;
  const title = e.title.$t || "(Chưa có tiêu đề)";
  const text = textOf(raw);
  return {
    id,
    slug: `${id}-${slugify(title)}`,
    title,
    published: e.published.$t,
    updated: e.updated.$t,
    labels: (e.category ?? []).map((c) => c.term),
    image: thumb ? bigImage(thumb) : firstImg,
    excerpt: text.length > 180 ? `${text.slice(0, 177).replace(/\s+\S*$/, "")}…` : text,
    html: sanitize(raw),
    author: e.author?.[0]?.name.$t,
    sourceUrl: e.link?.find((l) => l.rel === "alternate")?.href,
  };
}

export async function listPosts(page: number, label?: string, per: number = BLOG.perPage): Promise<BlogPage> {
  const path = label ? `/feeds/posts/default/-/${encodeURIComponent(label)}` : "/feeds/posts/default";
  const q = `alt=json&max-results=${per}&start-index=${(page - 1) * per + 1}`;
  const data = await getJson<Feed>(`${base()}${path}?${q}`);
  if (!data) return { posts: [], total: 0 };
  return {
    posts: (data.feed.entry ?? []).map(toPost),
    total: Number(data.feed.openSearch$totalResults?.$t ?? 0),
  };
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const id = slug.match(/^\d+/)?.[0];
  if (!id) return null;
  const data = await getJson<Single>(`${base()}/feeds/posts/default/${id}?alt=json`);
  return data ? toPost(data.entry) : null;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
}
