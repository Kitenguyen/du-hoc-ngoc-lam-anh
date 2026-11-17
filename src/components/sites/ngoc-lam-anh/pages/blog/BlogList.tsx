import { PageHead, PageShell } from "../../PageShell";
import { BLOG, ZALO_HREF } from "../../data";
import { BlogNotConfiguredError, formatDate, listPosts, type BlogPage } from "./blogger";
import "./blog.css";

function pageHref(page: number, label?: string): string {
  const q = new URLSearchParams();
  if (label) q.set("nhan", label);
  if (page > 1) q.set("trang", String(page));
  const s = q.toString();
  return `/blog${s ? `?${s}` : ""}`;
}

export async function BlogList({ page, label }: { page: number; label?: string }) {
  let data: BlogPage | null = null;
  let state: "ok" | "empty-config" | "error" = "ok";
  try {
    data = await listPosts(page, label);
  } catch (e) {
    state = e instanceof BlogNotConfiguredError ? "empty-config" : "error";
  }
  const pages = data ? Math.max(1, Math.ceil(data.total / BLOG.perPage)) : 1;
  const labels = Array.from(new Set((data?.posts ?? []).flatMap((p) => p.labels))).slice(0, 12);

  return (
    <PageShell active="blog">
      <div className="pg-blog">
        <PageHead
          zh="新闻 · 博客"
          title={label ? `Tin tức: ${label}` : "Tin tức & chia sẻ"}
          intro="Tin du học, học bổng, lịch khai giảng và kinh nghiệm học tiếng Trung từ Du học Ngọc Lâm Anh."
        />
        <section className="block light">
          <div className="wrap">
            {labels.length > 0 && (
              <nav className="blog-labels" aria-label="Chủ đề">
                <a href={pageHref(1)} className={label ? undefined : "on"}>
                  Tất cả
                </a>
                {labels.map((l) => (
                  <a key={l} href={pageHref(1, l)} className={l === label ? "on" : undefined}>
                    {l}
                  </a>
                ))}
              </nav>
            )}

            {state === "ok" && data && data.posts.length > 0 && (
              <div className="blog-grid">
                {data.posts.map((p) => (
                  <a className="blog-card" href={`/blog/${p.slug}`} key={p.id}>
                    <div className="ph">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" loading="lazy" />
                      ) : (
                        <span aria-hidden="true">留</span>
                      )}
                    </div>
                    <div className="bd">
                      <div className="meta">
                        <time dateTime={p.published}>{formatDate(p.published)}</time>
                        {p.labels[0] && <span>{p.labels[0]}</span>}
                      </div>
                      <h2>{p.title}</h2>
                      <p>{p.excerpt}</p>
                      <span className="more">Đọc tiếp →</span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {(state === "empty-config" || (state === "ok" && data?.posts.length === 0)) && (
              <div className="blog-empty">
                <b>Chưa có bài viết</b>
                <p>Trung tâm đang chuẩn bị những bài viết đầu tiên. Bạn có thể nhắn Zalo để được tư vấn ngay.</p>
                <a className="btn pri" href={ZALO_HREF} target="_blank" rel="noopener">
                  Nhắn Zalo tư vấn
                </a>
              </div>
            )}

            {state === "error" && (
              <div className="blog-empty">
                <b>Chưa tải được bài viết</b>
                <p>Kết nối tới blog đang gián đoạn, bạn vui lòng tải lại trang sau ít phút.</p>
              </div>
            )}

            {pages > 1 && (
              <nav className="blog-pager" aria-label="Phân trang">
                {page > 1 && <a href={pageHref(page - 1, label)}>← Mới hơn</a>}
                <span>
                  Trang {page}/{pages}
                </span>
                {page < pages && <a href={pageHref(page + 1, label)}>Cũ hơn →</a>}
              </nav>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
