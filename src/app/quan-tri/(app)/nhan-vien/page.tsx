import type { Metadata } from "next";
import { NewUserForm, UserRow } from "@/components/admin/UserForms";
import { fmtDateTime } from "@/components/admin/format";
import { requireUser } from "@/lib/admin/session";
import { listUsers } from "@/lib/admin/users";

export const metadata: Metadata = { title: "Nhân viên & quyền" };

export default async function UsersPage() {
  const me = await requireUser("users");
  const users = await listUsers();
  return (
    <>
      <div className="top">
        <h1>Nhân viên & phân quyền</h1>
      </div>
      <div className="flash info">
        Nhân viên đăng nhập bằng <b>tài khoản Google</b> đúng với email được thêm ở đây. Khóa tài khoản sẽ đăng xuất người đó ngay.
      </div>
      <div className="card">
        <h2>Thêm nhân viên</h2>
        <NewUserForm />
      </div>
      <div className="card">
        <h2>Danh sách ({users.length})</h2>
        {users.map((u) => (
          <UserRow
            key={u.id}
            isMe={u.id === me.id}
            user={{
              id: u.id,
              email: u.email,
              name: u.name,
              avatar: u.avatar,
              role: u.role,
              perms: u.perms,
              active: u.active,
              lastLogin: u.last_login ? fmtDateTime(u.last_login) : "Chưa đăng nhập",
            }}
          />
        ))}
      </div>
    </>
  );
}
