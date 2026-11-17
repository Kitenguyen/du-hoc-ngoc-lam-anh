import type { Metadata } from "next";
import Link from "next/link";
import { LeadItem } from "@/components/admin/LeadItem";
import { fmtDateTime } from "@/components/admin/format";
import { courseTitle } from "@/components/sites/ngoc-lam-anh/pages/dang-ky/data";
import { LEAD_STATUS_LABEL, leadCounts, listLeads, type LeadStatus } from "@/lib/admin/leads";
import { can } from "@/lib/admin/perms";
import { requireUser } from "@/lib/admin/session";
import { listUsers } from "@/lib/admin/users";

export const metadata: Metadata = { title: "Đăng ký học" };

const STATUSES = Object.keys(LEAD_STATUS_LABEL) as LeadStatus[];

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser("leads");
  const sp = await searchParams;
  const status = STATUSES.includes(sp["trang-thai"] as LeadStatus) ? (sp["trang-thai"] as LeadStatus) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 60) : "";
  const [leads, counts, users] = await Promise.all([listLeads({ status, q }), leadCounts(), listUsers()]);
  const staff = users.filter((u) => u.active && (u.role === "admin" || u.perms.leads)).map((u) => ({ id: u.id, name: u.name || u.email }));
  const all = STATUSES.reduce((n, k) => n + counts[k], 0);
  const qs = (st?: string) => {
    const p = new URLSearchParams();
    if (st) p.set("trang-thai", st);
    if (q) p.set("q", q);
    const s = p.toString();
    return `/quan-tri/dang-ky${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="top">
        <h1>Đăng ký học & tư vấn</h1>
        <span className="sp" />
        <form className="row" action="/quan-tri/dang-ky">
          {status && <input type="hidden" name="trang-thai" value={status} />}
          <input type="search" name="q" defaultValue={q} placeholder="Tìm tên, số điện thoại…" style={{ width: 240 }} />
          <button className="btn sec" type="submit">
            Tìm
          </button>
        </form>
      </div>
      <nav className="tabs">
        <Link href={qs()} className={!status ? "on" : undefined}>
          Tất cả ({all})
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={qs(s)} className={status === s ? "on" : undefined}>
            {LEAD_STATUS_LABEL[s]} ({counts[s]})
          </Link>
        ))}
      </nav>
      {leads.length === 0 ? (
        <div className="card">
          <p className="muted">Chưa có đăng ký nào{q ? " khớp với tìm kiếm" : ""}. Đăng ký từ trang “Đăng ký học” trên web sẽ hiện ở đây.</p>
        </div>
      ) : (
        leads.map((l) => (
          <LeadItem
            key={l.id}
            lead={{ ...l, courseName: courseTitle(l.course) || l.course, created: fmtDateTime(l.created_at), updated: fmtDateTime(l.updated_at) }}
            staff={staff}
            canDelete={can(user, "users")}
          />
        ))
      )}
    </>
  );
}
