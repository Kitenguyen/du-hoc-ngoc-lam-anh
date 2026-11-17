import type { Metadata } from "next";
import { ContentForm } from "@/components/admin/ContentForm";
import { COURSE_GROUPS } from "@/components/sites/ngoc-lam-anh/data";
import { requireUser } from "@/lib/admin/session";
import { readContent } from "@/lib/admin/site-content";

export const metadata: Metadata = { title: "Nội dung trang" };

export default async function ContentPage() {
  await requireUser("content");
  let loaded: Awaited<ReturnType<typeof readContent>> | null = null;
  let loadError = "";
  try {
    loaded = await readContent();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Không đọc được nội dung.";
  }
  const courses = COURSE_GROUPS.filter((g) => g.id !== "du-hoc").flatMap((g) => g.courses.map((c) => ({ id: c.id, title: `${g.title} – ${c.title}` })));

  return (
    <>
      <div className="top">
        <h1>Nội dung trang web</h1>
      </div>
      {loadError && <div className="flash err">{loadError}</div>}
      {loaded?.source === "bundled" && (
        <div className="flash info">
          Chưa kết nối GitHub (thiếu secret <code>GITHUB_TOKEN</code>) nên chỉ xem được, chưa lưu được. Xem hướng dẫn trong <code>docs/HUONG-DAN-DASHBOARD.md</code>.
        </div>
      )}
      {loaded && (
        <>
          <p className="muted" style={{ marginTop: -8 }}>
            Sau khi lưu, Cloudflare tự build lại web – thay đổi hiện trên trang sau khoảng 3 – 5 phút.
          </p>
          <ContentForm content={loaded.content} sha={loaded.sha ?? ""} courses={courses} readOnly={loaded.source !== "github"} />
        </>
      )}
    </>
  );
}
