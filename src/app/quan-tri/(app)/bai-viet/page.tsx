import type { Metadata } from "next";
import Link from "next/link";
import { fmtDateTime } from "@/components/admin/format";
import { can } from "@/lib/admin/perms";
import { canEditPost, listPostsForUser, POST_STATUS_LABEL, type PostStatus } from "@/lib/admin/posts";
import { requireUser } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Bài viết" };

const TABS: { key: PostStatus | ""; label: string }[] = [
  { key: "", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "published", label: "Đã đăng" },
  { key: "draft", label: "Bản nháp" },
  { key: "hidden", label: "Đã ẩn" },
];

export default async function PostsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser("blogWrite");
  const sp = await searchParams;
  const status = TABS.some((t) => t.key && t.key === sp["trang-thai"]) ? (sp["trang-thai"] as PostStatus) : undefined;
  const posts = await listPostsForUser(user, status);
  const editor = can(user, "blogPublish");

  return (
    <>
      <div className="top">
        <h1>Bài viết</h1>
        <span className="sp" />
        <Link className="btn" href="/quan-tri/bai-viet/moi">
          ＋ Viết bài mới
        </Link>
      </div>
      {!editor && (
        <div className="flash info">Bài của bạn cần admin hoặc biên tập viên duyệt trước khi hiện trên trang Tin tức.</div>
      )}
      <nav className="tabs">
        {TABS.map((t) => (
          <Link key={t.key} href={t.key ? `/quan-tri/bai-viet?trang-thai=${t.key}` : "/quan-tri/bai-viet"} className={(status ?? "") === t.key ? "on" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="card">
        {posts.length === 0 ? (
          <p className="muted">Chưa có bài viết nào.</p>
        ) : (
          <div className="tbl-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Trạng thái</th>
                  <th>Tác giả</th>
                  <th>Cập nhật</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <b>{p.title}</b>
                      {p.labels.length > 0 && <div className="muted">{p.labels.join(", ")}</div>}
                      {p.status === "draft" && p.review_note && <div className="muted">↩ Cần sửa: {p.review_note}</div>}
                    </td>
                    <td>
                      <span className={`pill ${p.status}`}>{POST_STATUS_LABEL[p.status]}</span>
                    </td>
                    <td>{p.author_name || "—"}</td>
                    <td className="muted">{fmtDateTime(p.updated_at)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {canEditPost(user, p) ? (
                        <Link className="btn sec sm" href={`/quan-tri/bai-viet/${p.id}`}>
                          {p.status === "pending" && editor ? "Duyệt" : "Sửa"}
                        </Link>
                      ) : null}{" "}
                      {p.status === "published" && (
                        <a className="btn ghost sm" href={`/blog/${p.slug}`} target="_blank" rel="noopener">
                          Xem ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
