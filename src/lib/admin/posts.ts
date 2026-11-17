import "server-only";
import { excerptOf, firstImage, sanitize, slugify } from "@/lib/html";
import { db, nowIso } from "./env";
import { can, type SessionUser } from "./perms";

export type PostStatus = "draft" | "pending" | "published" | "hidden";

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  published: "Đã đăng",
  hidden: "Đã ẩn",
};

export type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string | null;
  labels: string;
  status: PostStatus;
  author_id: number | null;
  reviewer_id: number | null;
  review_note: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
};

export type Post = Omit<PostRow, "labels"> & { labels: string[] };

function toPost(r: PostRow): Post {
  let labels: string[] = [];
  try {
    labels = (JSON.parse(r.labels) as unknown[]).map(String);
  } catch {
    labels = [];
  }
  return { ...r, labels };
}

const SELECT = `SELECT p.*, u.name AS author_name FROM posts p LEFT JOIN users u ON u.id = p.author_id`;

/* ---------- Dashboard ---------- */

export async function listPostsForUser(user: SessionUser, status?: PostStatus): Promise<Post[]> {
  const d = await db();
  const editor = can(user, "blogPublish");
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (!editor) {
    where.push("(p.author_id = ? OR p.status = 'published')");
    args.push(user.id);
  }
  if (status) {
    where.push("p.status = ?");
    args.push(status);
  }
  const sql = `${SELECT} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY p.updated_at DESC LIMIT 200`;
  const { results } = await d.prepare(sql).bind(...args).all<PostRow>();
  return results.map(toPost);
}

export async function getPost(id: number): Promise<Post | null> {
  const r = await (await db()).prepare(`${SELECT} WHERE p.id = ?`).bind(id).first<PostRow>();
  return r ? toPost(r) : null;
}

/** Người dùng có được sửa bài này không. */
export function canEditPost(user: SessionUser, post: Pick<Post, "author_id" | "status">): boolean {
  if (can(user, "blogPublish")) return true;
  return can(user, "blogWrite") && post.author_id === user.id && (post.status === "draft" || post.status === "pending");
}

async function uniqueSlug(base: string, exceptId?: number): Promise<string> {
  const d = await db();
  // Slug bắt đầu bằng số trùng dạng bài Blogger (/blog/<số>-...) → thêm tiền tố
  let root = slugify(base) || "bai-viet";
  if (/^\d/.test(root)) root = `b-${root}`;
  for (let i = 1; i < 50; i++) {
    const s = i === 1 ? root : `${root}-${i}`;
    const hit = await d.prepare("SELECT id FROM posts WHERE slug = ? AND id != ?").bind(s, exceptId ?? 0).first<{ id: number }>();
    if (!hit) return s;
  }
  return `${root}-${Date.now()}`;
}

export type PostInput = { id?: number; title: string; content: string; cover: string; labels: string[]; slug: string };
export type PostIntent = "draft" | "submit" | "publish" | "hide";

export type SaveResult = { ok: true; id: number; status: PostStatus } | { ok: false; error: string };

export async function savePost(user: SessionUser, input: PostInput, intent: PostIntent): Promise<SaveResult> {
  if (!can(user, "blogWrite")) return { ok: false, error: "Bạn chưa được cấp quyền viết bài." };
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Bài viết cần có tiêu đề." };
  if (title.length > 200) return { ok: false, error: "Tiêu đề quá dài (tối đa 200 ký tự)." };
  const editor = can(user, "blogPublish");
  if ((intent === "publish" || intent === "hide") && !editor) return { ok: false, error: "Bạn chưa có quyền đăng bài – hãy gửi duyệt." };

  const content = sanitize(input.content);
  if (intent !== "draft" && !content.replace(/<[^>]+>/g, "").trim() && !/<img|<iframe/i.test(content)) {
    return { ok: false, error: "Bài viết chưa có nội dung." };
  }
  const labels = Array.from(new Set(input.labels.map((l) => l.trim()).filter(Boolean))).slice(0, 8);
  const cover = input.cover.trim() || firstImage(content) || null;
  if (cover && !/^(https:\/\/|\/media\/)/i.test(cover)) return { ok: false, error: "Ảnh đại diện phải là ảnh tải lên hoặc đường dẫn https://" };
  const status: PostStatus = intent === "publish" ? "published" : intent === "submit" ? "pending" : intent === "hide" ? "hidden" : "draft";
  const now = nowIso();
  const d = await db();

  if (input.id) {
    const old = await getPost(input.id);
    if (!old) return { ok: false, error: "Không tìm thấy bài viết." };
    if (!canEditPost(user, old)) return { ok: false, error: "Bạn không có quyền sửa bài này." };
    const slug = await uniqueSlug(input.slug || title, old.id);
    const publishedAt = status === "published" ? (old.published_at ?? now) : old.published_at;
    await d
      .prepare(
        `UPDATE posts SET title=?, slug=?, excerpt=?, content=?, cover=?, labels=?, status=?, published_at=?, updated_at=?,
                reviewer_id = CASE WHEN ? THEN ? ELSE reviewer_id END,
                review_note = CASE WHEN ? THEN NULL ELSE review_note END
          WHERE id=?`,
      )
      .bind(
        title,
        slug,
        excerptOf(content),
        content,
        cover,
        JSON.stringify(labels),
        status,
        publishedAt,
        now,
        status === "published" && old.status !== "published" ? 1 : 0,
        user.id,
        status === "published" || status === "pending" ? 1 : 0,
        old.id,
      )
      .run();
    return { ok: true, id: old.id, status };
  }

  const slug = await uniqueSlug(input.slug || title);
  const row = await d
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, content, cover, labels, status, author_id, reviewer_id, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(slug, title, excerptOf(content), content, cover, JSON.stringify(labels), status, user.id, status === "published" ? user.id : null, status === "published" ? now : null, now, now)
    .first<{ id: number }>();
  return { ok: true, id: row?.id ?? 0, status };
}

/** Trả bài chờ duyệt về bản nháp kèm ghi chú cho tác giả. */
export async function rejectPost(user: SessionUser, id: number, note: string): Promise<SaveResult> {
  if (!can(user, "blogPublish")) return { ok: false, error: "Bạn không có quyền duyệt bài." };
  await (await db())
    .prepare("UPDATE posts SET status='draft', reviewer_id=?, review_note=?, updated_at=? WHERE id=?")
    .bind(user.id, note.trim().slice(0, 500) || "Cần chỉnh sửa thêm", nowIso(), id)
    .run();
  return { ok: true, id, status: "draft" };
}

export async function deletePost(user: SessionUser, id: number): Promise<{ ok: boolean; error?: string }> {
  const post = await getPost(id);
  if (!post) return { ok: false, error: "Không tìm thấy bài viết." };
  const own = post.author_id === user.id && post.status !== "published";
  if (!can(user, "blogPublish") && !own) return { ok: false, error: "Bạn không có quyền xóa bài này." };
  await (await db()).prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return { ok: true };
}

export async function postCounts(): Promise<Record<PostStatus, number>> {
  const { results } = await (await db()).prepare("SELECT status, COUNT(*) AS n FROM posts GROUP BY status").all<{ status: PostStatus; n: number }>();
  const out: Record<PostStatus, number> = { draft: 0, pending: 0, published: 0, hidden: 0 };
  for (const r of results) out[r.status] = r.n;
  return out;
}

/* ---------- Trang Tin tức công khai ---------- */

export async function listPublished(limit: number, label?: string): Promise<{ posts: Post[]; total: number }> {
  const d = await db();
  const where = label ? "WHERE p.status = 'published' AND EXISTS (SELECT 1 FROM json_each(p.labels) WHERE value = ?)" : "WHERE p.status = 'published'";
  const args = label ? [label] : [];
  const [{ results }, total] = await Promise.all([
    d.prepare(`${SELECT} ${where} ORDER BY p.published_at DESC LIMIT ?`).bind(...args, limit).all<PostRow>(),
    d.prepare(`SELECT COUNT(*) AS n FROM posts p ${where}`).bind(...args).first<{ n: number }>(),
  ]);
  return { posts: results.map(toPost), total: total?.n ?? 0 };
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  const r = await (await db()).prepare(`${SELECT} WHERE p.slug = ? AND p.status = 'published'`).bind(slug).first<PostRow>();
  return r ? toPost(r) : null;
}
