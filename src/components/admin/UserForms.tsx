"use client";

import { useActionState, useState, useTransition } from "react";
import { createUserAction, deleteUserAction, updateUserAction, type ActionState } from "@/app/quan-tri/actions";
import { PERM_LABELS, type Perms, type Role } from "@/lib/admin/perms";

const PERM_KEYS = Object.keys(PERM_LABELS) as (keyof Perms)[];

/** Mẫu quyền nhanh */
const PRESETS: { label: string; perms: Perms }[] = [
  { label: "Cộng tác viên viết bài (chờ duyệt)", perms: { blogWrite: true, blogPublish: false, leads: false, content: false } },
  { label: "Biên tập viên (tự đăng & duyệt bài)", perms: { blogWrite: true, blogPublish: true, leads: false, content: false } },
  { label: "Tư vấn tuyển sinh", perms: { blogWrite: false, blogPublish: false, leads: true, content: false } },
  { label: "Quản lý nội dung", perms: { blogWrite: true, blogPublish: true, leads: true, content: true } },
];

function PermFields({ role, perms, onChange }: { role: Role; perms: Perms; onChange: (p: Perms) => void }) {
  if (role === "admin") return <p className="muted">Admin có toàn quyền, gồm cả quản lý nhân viên.</p>;
  return (
    <div>
      <div className="row" style={{ gap: 6, marginBottom: 6 }}>
        <span className="muted" style={{ fontSize: 13 }}>
          Mẫu nhanh:
        </span>
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="btn ghost sm" onClick={() => onChange(p.perms)}>
            {p.label}
          </button>
        ))}
      </div>
      {PERM_KEYS.map((k) => (
        <label className="check" key={k}>
          <input type="checkbox" name={`perm_${k}`} checked={perms[k]} onChange={(e) => onChange({ ...perms, [k]: e.target.checked })} />
          <span>
            {PERM_LABELS[k].label}
            <small>{PERM_LABELS[k].hint}</small>
          </span>
        </label>
      ))}
    </div>
  );
}

export function NewUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createUserAction, {});
  const [role, setRole] = useState<Role>("staff");
  const [perms, setPerms] = useState<Perms>(PRESETS[0].perms);
  return (
    <form action={action}>
      <div className="cols2">
        <label className="f">
          <span>Email Google</span>
          <input type="email" name="email" required placeholder="nhanvien@gmail.com" />
        </label>
        <label className="f">
          <span>Họ tên</span>
          <input type="text" name="name" placeholder="Nguyễn Văn A" />
        </label>
      </div>
      <label className="f">
        <span>Vai trò</span>
        <select name="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="staff">Nhân viên</option>
          <option value="admin">Quản trị viên (admin)</option>
        </select>
      </label>
      <PermFields role={role} perms={perms} onChange={setPerms} />
      {state.error && <div className="flash err">{state.error}</div>}
      {state.ok && <div className="flash ok">{state.message}</div>}
      <button className="btn" type="submit" disabled={pending} style={{ marginTop: 8 }}>
        {pending ? "Đang thêm…" : "Thêm nhân viên"}
      </button>
    </form>
  );
}

export type UserView = { id: number; email: string; name: string; avatar: string | null; role: Role; perms: Perms; active: boolean; lastLogin: string };

export function UserRow({ user, isMe }: { user: UserView; isMe: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateUserAction, {});
  const [role, setRole] = useState<Role>(user.role);
  const [perms, setPerms] = useState<Perms>(user.perms);
  const [delErr, setDelErr] = useState("");
  const [deleting, startDelete] = useTransition();
  const summary =
    user.role === "admin"
      ? "Toàn quyền"
      : PERM_KEYS.filter((k) => user.perms[k])
          .map((k) => PERM_LABELS[k].label)
          .join(" · ") || "Chưa có quyền";

  return (
    <details className="lead">
      <summary>
        <span>
          <b>{user.name || user.email}</b>
          {isMe && <span className="muted"> (bạn)</span>}
          <div className="muted">{user.email}</div>
        </span>
        <span className="hide-sm">{summary}</span>
        <span className="hide-sm muted">{user.lastLogin}</span>
        <span className={`pill ${user.active ? user.role : "closed"}`}>{!user.active ? "Đã khóa" : user.role === "admin" ? "Admin" : "Nhân viên"}</span>
        <span className="muted" aria-hidden="true">
          ▾
        </span>
      </summary>
      <form action={action} style={{ padding: "14px 16px" }}>
        <input type="hidden" name="id" value={user.id} />
        <div className="cols2">
          <label className="f">
            <span>Họ tên</span>
            <input type="text" name="name" defaultValue={user.name} />
          </label>
          <label className="f">
            <span>Vai trò</span>
            <select name="role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên (admin)</option>
            </select>
          </label>
        </div>
        <PermFields role={role} perms={perms} onChange={setPerms} />
        <label className="check">
          <input type="checkbox" name="active" defaultChecked={user.active} disabled={isMe} />
          <span>Đang hoạt động (bỏ chọn để khóa tài khoản)</span>
        </label>
        {isMe && <input type="hidden" name="active" value="on" />}
        {state.error && <div className="flash err">{state.error}</div>}
        {state.ok && <div className="flash ok">{state.message}</div>}
        {delErr && <div className="flash err">{delErr}</div>}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn" type="submit" disabled={pending}>
            {pending ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
          {!isMe && (
            <button
              className="btn danger sm"
              type="button"
              disabled={deleting}
              onClick={() => {
                if (!window.confirm(`Xóa tài khoản ${user.email}? Bài viết của họ vẫn được giữ lại.`)) return;
                startDelete(async () => {
                  const r = await deleteUserAction(user.id);
                  if (r.error) setDelErr(r.error);
                });
              }}
            >
              Xóa tài khoản
            </button>
          )}
        </div>
      </form>
    </details>
  );
}
