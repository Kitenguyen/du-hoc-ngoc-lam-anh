"use client";

import { useState, type FormEvent } from "react";
import { login } from "./api";

export function LoginForm({ next }: { next: string }) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!username || !password) {
      setErr("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }
    setBusy(true);
    const r = await login(username, password, next || undefined);
    setBusy(false);
    if (r.ok) {
      window.location.href = r.redirect;
      return;
    }
    setErr(r.message);
  }

  return (
    <div className="card">
      <form className="form" onSubmit={onSubmit}>
        {err && (
          <div className="err-box" role="alert">
            {err}
          </div>
        )}
        <label>
          Tên đăng nhập (họ và tên)
          <input name="username" autoComplete="username" required placeholder="Ví dụ: NGUYỄN VĂN AN" />
        </label>
        <label>
          Mật khẩu
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="btn pri" type="submit" disabled={busy}>
          {busy ? "Đang kiểm tra…" : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
