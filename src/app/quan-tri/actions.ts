"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit } from "@/lib/admin/audit";
import { cfEnv, devLoginEnabled } from "@/lib/admin/env";
import { deleteLead, updateLead, type LeadStatus } from "@/lib/admin/leads";
import { saveImage } from "@/lib/admin/media";
import { NO_PERMS, can, type Perms, type Role } from "@/lib/admin/perms";
import { deletePost, rejectPost, savePost, type PostInput, type PostIntent } from "@/lib/admin/posts";
import { createSession, destroySession, findOrBootstrapUser, getCurrentUser, LOGIN_PATH } from "@/lib/admin/session";
import { readContent, writeContent, type SiteContent } from "@/lib/admin/site-content";
import { createUser, deleteUser, updateUser } from "@/lib/admin/users";

export type ActionState = { ok?: boolean; error?: string; message?: string };

async function need(perm?: Parameters<typeof can>[1]) {
  const user = await getCurrentUser();
  if (!user) redirect(LOGIN_PATH);
  if (perm && !can(user, perm)) throw new Error("Bạn không có quyền thực hiện thao tác này.");
  return user;
}

/* ---------- Đăng nhập / đăng xuất ---------- */

export async function logoutAction() {
  const user = await getCurrentUser();
  await destroySession();
  if (user) await audit(user.id, "logout", user.email);
  redirect(LOGIN_PATH);
}

/** Đăng nhập thử trên máy (chỉ `next dev` + DEV_LOGIN=1) – không dùng được trên Cloudflare. */
export async function devLoginAction(_: ActionState, fd: FormData): Promise<ActionState> {
  if (!(await devLoginEnabled())) return { error: "Không bật đăng nhập thử." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const env = await cfEnv();
  const r = await findOrBootstrapUser(email, { name: email.split("@")[0] }, env.ADMIN_EMAILS ?? "");
  if ("error" in r) return { error: r.error === "locked" ? "Tài khoản đã bị khóa." : "Email này chưa được cấp tài khoản." };
  await createSession(r.user.id);
  redirect("/quan-tri");
}

/* ---------- Bài viết ---------- */

export async function savePostAction(input: PostInput, intent: PostIntent): Promise<ActionState & { id?: number }> {
  const user = await need("blogWrite");
  const r = await savePost(user, input, intent);
  if (!r.ok) return { error: r.error };
  await audit(user.id, `post.${intent}`, `post:${r.id}`, input.title);
  revalidatePath("/quan-tri/bai-viet");
  revalidatePath("/blog");
  const message =
    r.status === "published" ? "Đã đăng bài lên trang Tin tức." : r.status === "pending" ? "Đã gửi bài chờ duyệt." : r.status === "hidden" ? "Đã ẩn bài khỏi trang Tin tức." : "Đã lưu bản nháp.";
  return { ok: true, id: r.id, message };
}

export async function rejectPostAction(id: number, note: string): Promise<ActionState> {
  const user = await need("blogPublish");
  const r = await rejectPost(user, id, note);
  if (!r.ok) return { error: r.error };
  await audit(user.id, "post.reject", `post:${id}`, note);
  revalidatePath("/quan-tri/bai-viet");
  return { ok: true, message: "Đã trả bài về cho tác giả sửa." };
}

export async function deletePostAction(id: number): Promise<ActionState> {
  const user = await need("blogWrite");
  const r = await deletePost(user, id);
  if (!r.ok) return { error: r.error };
  await audit(user.id, "post.delete", `post:${id}`);
  revalidatePath("/quan-tri/bai-viet");
  revalidatePath("/blog");
  return { ok: true };
}

/** Tải ảnh (đã nén trên trình duyệt) cho bài viết. */
export async function uploadImageAction(fd: FormData): Promise<ActionState & { url?: string }> {
  const user = await need("blogWrite");
  const file = fd.get("file");
  if (!(file instanceof File)) return { error: "Chưa chọn ảnh." };
  const r = await saveImage(file, user.id, { w: Number(fd.get("w")) || 0, h: Number(fd.get("h")) || 0 });
  if (!r.ok) return { error: r.error };
  await audit(user.id, "media.upload", r.url);
  return { ok: true, url: r.url };
}

/* ---------- Đăng ký học ---------- */

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "enrolled", "closed"];

export async function updateLeadAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await need("leads");
  const id = Number(fd.get("id"));
  const status = String(fd.get("status")) as LeadStatus;
  if (!id || !LEAD_STATUSES.includes(status)) return { error: "Dữ liệu không hợp lệ." };
  const assignee = Number(fd.get("assignee_id")) || null;
  await updateLead(id, { status, staff_note: String(fd.get("staff_note") ?? ""), assignee_id: assignee });
  await audit(user.id, "lead.update", `lead:${id}`, status);
  revalidatePath("/quan-tri/dang-ky");
  revalidatePath("/quan-tri");
  return { ok: true, message: "Đã lưu." };
}

export async function deleteLeadAction(id: number): Promise<ActionState> {
  const user = await need("users");
  await deleteLead(id);
  await audit(user.id, "lead.delete", `lead:${id}`);
  revalidatePath("/quan-tri/dang-ky");
  return { ok: true };
}

/* ---------- Nhân viên ---------- */

function readPerms(fd: FormData): Perms {
  const p = { ...NO_PERMS };
  for (const k of Object.keys(p) as (keyof Perms)[]) p[k] = fd.get(`perm_${k}`) === "on";
  return p;
}

export async function createUserAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await need("users");
  const role: Role = fd.get("role") === "admin" ? "admin" : "staff";
  const email = String(fd.get("email") ?? "");
  const r = await createUser({ email, name: String(fd.get("name") ?? ""), role, perms: readPerms(fd) });
  if (!r.ok) return { error: r.error };
  await audit(user.id, "user.create", email, role);
  revalidatePath("/quan-tri/nhan-vien");
  return { ok: true, message: `Đã thêm ${email}. Người này đăng nhập bằng Google với đúng email đó.` };
}

export async function updateUserAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await need("users");
  const id = Number(fd.get("id"));
  const role: Role = fd.get("role") === "admin" ? "admin" : "staff";
  const r = await updateUser(user.id, id, { name: String(fd.get("name") ?? ""), role, perms: readPerms(fd), active: fd.get("active") === "on" });
  if (!r.ok) return { error: r.error };
  await audit(user.id, "user.update", `user:${id}`, role);
  revalidatePath("/quan-tri/nhan-vien");
  return { ok: true, message: "Đã lưu." };
}

export async function deleteUserAction(id: number): Promise<ActionState> {
  const user = await need("users");
  const r = await deleteUser(user.id, id);
  if (!r.ok) return { error: r.error };
  await audit(user.id, "user.delete", `user:${id}`);
  revalidatePath("/quan-tri/nhan-vien");
  return { ok: true };
}

/* ---------- Nội dung trang ---------- */

const s = (fd: FormData, k: string, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function saveContentAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await need("content");
  const sha = s(fd, "sha", 100);
  if (!sha) return { error: "Chưa kết nối GitHub nên chưa lưu được." };
  const { content: current } = await readContent();
  const next: SiteContent = structuredClone(current);

  next.contact.phone = s(fd, "phone", 30).replace(/[^\d+]/g, "");
  next.contact.phoneLabel = s(fd, "phoneLabel", 40);
  next.contact.zalo = s(fd, "zalo", 200);
  next.contact.email = s(fd, "email", 120);
  next.contact.address = s(fd, "address", 200);
  next.contact.hours = s(fd, "hours", 80);
  next.contact.facebook = s(fd, "facebook", 200);
  for (const [k, v] of [
    ["Zalo", next.contact.zalo],
    ["Facebook", next.contact.facebook],
  ]) {
    if (v && !/^https:\/\//.test(v)) return { error: `Link ${k} phải bắt đầu bằng https://` };
  }

  next.offer.show = fd.get("offer_show") === "on";
  next.offer.kicker = s(fd, "offer_kicker", 60);
  next.offer.title = s(fd, "offer_title", 80);
  next.offer.giftLabel = s(fd, "offer_giftLabel", 60);
  next.offer.giftValue = s(fd, "offer_giftValue", 40);
  next.offer.badge = s(fd, "offer_badge", 12);
  next.offer.text = s(fd, "offer_text", 400);
  next.offer.terms = s(fd, "offer_terms", 600);

  const fees: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (k.startsWith("fee_") && String(v).trim()) fees[k.slice(4)] = String(v).trim().slice(0, 120);
  }
  next.courseFees = fees as SiteContent["courseFees"];

  const r = await writeContent(next, sha, `Dashboard: cập nhật nội dung trang (${user.email})`);
  if (!r.ok) return { error: r.error };
  await audit(user.id, "content.update", "site.json");
  revalidatePath("/quan-tri/noi-dung");
  return { ok: true, message: "Đã lưu. Web sẽ cập nhật sau khoảng 3 – 5 phút (Cloudflare đang build lại)." };
}
