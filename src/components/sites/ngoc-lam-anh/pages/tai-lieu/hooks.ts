"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** `location.search` sau khi chạy trên trình duyệt ("" khi render máy chủ) */
export function useLocationSearch(): string {
  return useSyncExternalStore(noop, () => window.location.search, () => "");
}

function subscribeHash(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

/** `location.hash` không có dấu # ("" khi render máy chủ) */
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribeHash,
    () => decodeURIComponent(window.location.hash.slice(1)),
    () => "",
  );
}

/** Đọc một chuỗi trong localStorage/sessionStorage (null khi không có hoặc bị chặn) */
export function useStoredString(key: string, kind: "local" | "session" = "local"): string | null {
  return useSyncExternalStore(
    noop,
    () => {
      try {
        return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
}

export function writeStored(key: string, value: string | null, kind: "local" | "session" = "local") {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    // bỏ qua: trình duyệt chặn bộ nhớ
  }
}

/** true sau khi trang đã chạy trên trình duyệt */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
