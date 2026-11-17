"use client";

import { useSyncExternalStore } from "react";

// Lưu kết quả thi thử và bài đang làm trên trình duyệt (localStorage).
// Mọi thao tác đều bọc try/catch: chế độ ẩn danh / chặn lưu trữ thì trang vẫn chạy, chỉ không nhớ.

const PREFIX = "nla_hsk_";
const EVENT = "nla-hsk-storage";

export type ResultRow = {
  /** Điểm quy đổi (hoặc số câu đã ghi âm với đề nói) */
  score: number;
  max: number;
  correct: number;
  total: number;
  sec: number;
  at: number;
  speaking?: boolean;
};

export type Progress = {
  start: number;
  answers: Record<string, number>;
};

export function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // bỏ qua: không lưu được thì thôi
  }
  window.dispatchEvent(new Event(EVENT));
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // bỏ qua
  }
  window.dispatchEvent(new Event(EVENT));
}

export function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function subscribe(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/** Đọc một khóa localStorage và tự cập nhật khi khóa thay đổi (chuỗi thô, null khi render trên máy chủ) */
export function useStored(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
}

export const RESULTS_KEY = "results";
export const progressKey = (examKey: string) => `prog_${examKey}`;

export function addResult(examKey: string, row: ResultRow): void {
  const all = parseJSON<Record<string, ResultRow[]>>(readRaw(RESULTS_KEY), {});
  all[examKey] = [row, ...(all[examKey] ?? [])].slice(0, 30);
  writeJSON(RESULTS_KEY, all);
}
