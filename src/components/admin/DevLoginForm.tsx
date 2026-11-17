"use client";

import { useActionState } from "react";
import { devLoginAction, type ActionState } from "@/app/quan-tri/actions";

/** Chỉ hiện khi chạy trên máy (next dev + DEV_LOGIN=1) để thử dashboard mà chưa có khóa Google. */
export function DevLoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(devLoginAction, {});
  return (
    <form className="dev" action={action}>
      <small>Chế độ thử trên máy – đăng nhập không qua Google</small>
      <input type="email" name="email" placeholder="email đã được cấp quyền" required defaultValue="trungtamquynhchinese@gmail.com" />
      {state.error && <div className="err">{state.error}</div>}
      <button type="submit" disabled={pending}>
        {pending ? "Đang vào…" : "Vào thử"}
      </button>
    </form>
  );
}
