// Quyền trong dashboard (dùng được ở cả máy chủ và giao diện).

export type Role = "admin" | "staff";

export type Perms = {
  /** Viết bài (bài của nhân viên không có quyền đăng sẽ ở trạng thái chờ duyệt) */
  blogWrite: boolean;
  /** Đăng bài ngay, duyệt và sửa bài của người khác */
  blogPublish: boolean;
  /** Xem và xử lý đăng ký học / tư vấn */
  leads: boolean;
  /** Sửa nội dung trang web (liên hệ, ưu đãi, học phí) */
  content: boolean;
};

export type Perm = keyof Perms | "users";

export const PERM_LABELS: Record<keyof Perms, { label: string; hint: string }> = {
  blogWrite: { label: "Viết bài", hint: "Viết bài mới; nếu không có quyền đăng, bài phải chờ duyệt" },
  blogPublish: { label: "Đăng & duyệt bài", hint: "Tự đăng bài, duyệt và sửa bài của người khác" },
  leads: { label: "Xử lý đăng ký học", hint: "Xem danh sách đăng ký, cập nhật trạng thái liên hệ" },
  content: { label: "Sửa nội dung trang", hint: "Liên hệ, ưu đãi, học phí hiển thị trên web" },
};

export const NO_PERMS: Perms = { blogWrite: false, blogPublish: false, leads: false, content: false };

export type SessionUser = {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  role: Role;
  perms: Perms;
};

export function parsePerms(raw: string | null | undefined): Perms {
  try {
    const p = JSON.parse(raw ?? "{}") as Partial<Perms>;
    return {
      blogWrite: p.blogWrite === true,
      blogPublish: p.blogPublish === true,
      leads: p.leads === true,
      content: p.content === true,
    };
  } catch {
    return { ...NO_PERMS };
  }
}

/** Admin có mọi quyền; "users" (quản lý nhân viên) chỉ dành cho admin. */
export function can(user: Pick<SessionUser, "role" | "perms"> | null | undefined, perm: Perm): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (perm === "users") return false;
  if (perm === "blogWrite") return user.perms.blogWrite || user.perms.blogPublish;
  return user.perms[perm];
}
