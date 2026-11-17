import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell, type NavEntry } from "@/components/admin/AdminShell";
import { BRAND } from "@/components/sites/ngoc-lam-anh/data";
import { leadCounts } from "@/lib/admin/leads";
import { can } from "@/lib/admin/perms";
import { postCounts } from "@/lib/admin/posts";
import { requireUser } from "@/lib/admin/session";
import "../admin.css";

export const metadata: Metadata = {
  title: { default: "Quản trị · Du học Ngọc Lâm Anh", template: "%s · Quản trị Ngọc Lâm Anh" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const [leads, posts] = await Promise.all([can(user, "leads") ? leadCounts() : null, can(user, "blogPublish") ? postCounts() : null]);
  const nav: NavEntry[] = [{ href: "/quan-tri", label: "Tổng quan", ic: "🏠" }];
  if (can(user, "blogWrite")) nav.push({ href: "/quan-tri/bai-viet", label: "Bài viết", ic: "📝", count: posts?.pending });
  if (can(user, "leads")) nav.push({ href: "/quan-tri/dang-ky", label: "Đăng ký học", ic: "📋", count: leads?.new });
  if (can(user, "content")) nav.push({ href: "/quan-tri/noi-dung", label: "Nội dung trang", ic: "🖊" });
  if (can(user, "users")) nav.push({ href: "/quan-tri/nhan-vien", label: "Nhân viên & quyền", ic: "👥" });

  return (
    <AdminShell
      nav={nav}
      logo={BRAND.logoMark}
      user={{ name: user.name, email: user.email, avatar: user.avatar, roleLabel: user.role === "admin" ? "Quản trị viên" : "Nhân viên" }}
    >
      {children}
    </AdminShell>
  );
}
