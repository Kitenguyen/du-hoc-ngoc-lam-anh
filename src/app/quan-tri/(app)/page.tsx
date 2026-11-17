import Link from "next/link";
import { LEAD_STATUS_LABEL, leadCounts, listLeads } from "@/lib/admin/leads";
import { can, PERM_LABELS, type Perms } from "@/lib/admin/perms";
import { listPostsForUser, postCounts } from "@/lib/admin/posts";
import { requireUser } from "@/lib/admin/session";
import { courseTitle } from "@/components/sites/ngoc-lam-anh/pages/dang-ky/data";
import { fmtDateTime } from "@/components/admin/format";

export default async function Overview({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const { loi } = await searchParams;
  const [leads, posts, recentLeads, myPosts] = await Promise.all([
    can(user, "leads") ? leadCounts() : null,
    can(user, "blogWrite") ? postCounts() : null,
    can(user, "leads") ? listLeads({ limit: 5 }) : [],
    can(user, "blogWrite") ? listPostsForUser(user) : [],
  ]);
  const perms = (Object.keys(PERM_LABELS) as (keyof Perms)[]).filter((k) => can(user, k));

  return (
    <>
      <div className="top">
        <h1>Xin chào, {user.name}</h1>
      </div>
      {loi === "khong-co-quyen" && <div className="flash err">Bạn chưa được cấp quyền vào mục đó.</div>}

      <div className="grid4">
        {leads && (
          <Link className="card stat" href="/quan-tri/dang-ky?trang-thai=new">
            <b>{leads.new}</b>
            <span>Đăng ký mới</span>
            <small>{leads.contacted} đang liên hệ · {leads.enrolled} đã nhập học</small>
          </Link>
        )}
        {posts && (
          <>
            <Link className="card stat" href="/quan-tri/bai-viet?trang-thai=published">
              <b>{posts.published}</b>
              <span>Bài đã đăng</span>
              <small>{posts.draft} bản nháp</small>
            </Link>
            <Link className="card stat" href="/quan-tri/bai-viet?trang-thai=pending">
              <b>{posts.pending}</b>
              <span>Bài chờ duyệt</span>
              <small>{can(user, "blogPublish") ? "Bạn có thể duyệt" : "Admin/biên tập viên duyệt"}</small>
            </Link>
          </>
        )}
        {can(user, "blogWrite") && (
          <Link className="card stat" href="/quan-tri/bai-viet/moi">
            <b>＋</b>
            <span>Viết bài mới</span>
            <small>Đăng lên trang Tin tức</small>
          </Link>
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Quyền của bạn</h2>
        {user.role === "admin" ? (
          <p>Quản trị viên – toàn quyền, gồm cả quản lý nhân viên.</p>
        ) : perms.length ? (
          <p>{perms.map((k) => PERM_LABELS[k].label).join(" · ")}</p>
        ) : (
          <p className="muted">Bạn chưa được cấp quyền nào. Hãy liên hệ admin.</p>
        )}
      </div>

      {recentLeads.length > 0 && (
        <div className="card">
          <h2>Đăng ký gần đây</h2>
          <div className="tbl-wrap">
            <table className="t">
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <b>{l.full_name}</b>
                      <div className="muted">{l.phone}</div>
                    </td>
                    <td>{courseTitle(l.course) || l.course || "—"}</td>
                    <td>
                      <span className={`pill ${l.status}`}>{LEAD_STATUS_LABEL[l.status]}</span>
                    </td>
                    <td className="muted">{fmtDateTime(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10 }}>
            <Link href="/quan-tri/dang-ky">Xem tất cả →</Link>
          </p>
        </div>
      )}

      {myPosts.length > 0 && (
        <div className="card">
          <h2>Bài viết cập nhật gần đây</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {myPosts.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link href={`/quan-tri/bai-viet/${p.id}`}>{p.title}</Link> <span className="muted">· {fmtDateTime(p.updated_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
