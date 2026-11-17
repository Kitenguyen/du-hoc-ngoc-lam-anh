import "server-only";
import { db } from "./env";

/** Ghi nhật ký thao tác (không làm hỏng thao tác chính nếu ghi lỗi). */
export async function audit(userId: number | null, action: string, target = "", detail = ""): Promise<void> {
  try {
    await (await db())
      .prepare("INSERT INTO audit_log (user_id, action, target, detail) VALUES (?, ?, ?, ?)")
      .bind(userId, action, target, detail.slice(0, 500))
      .run();
  } catch {
    // bỏ qua
  }
}
