import { PageShell } from "../../PageShell";
import { CALL_HREF, PHONE_LABEL, REGISTER_HREF, ZALO_HREF, href } from "../../data";
import { formatDate, type BlogPost } from "./blogger";
import "./blog.css";

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <PageShell active="blog">
      <div className="pg-blog">
        <section className="block light">
          <div className="wrap">
            <article className="blog-article">
              <a className="back" href={href("blog")}>
                ← Tin tức
              </a>
              <div className="meta">
                <time dateTime={post.published}>{formatDate(post.published)}</time>
                {post.labels.map((l) => (
                  <a key={l} href={`/blog?nhan=${encodeURIComponent(l)}`}>
                    {l}
                  </a>
                ))}
              </div>
              <h1>{post.title}</h1>
              {/* Nội dung lấy từ Blogger của trung tâm, đã lọc thẻ/thuộc tính nguy hiểm */}
              <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
              <div className="blog-cta">
                <b>Cần tư vấn du học hoặc học tiếng Trung?</b>
                <div className="acts">
                  <a className="btn pri" href={href(REGISTER_HREF)}>
                    Đăng ký tư vấn
                  </a>
                  <a className="btn light" href={ZALO_HREF} target="_blank" rel="noopener">
                    Nhắn Zalo
                  </a>
                  <a className="btn ghost-dark" href={CALL_HREF}>
                    ☎ {PHONE_LABEL}
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
