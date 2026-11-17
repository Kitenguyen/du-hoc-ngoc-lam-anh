// Lớp gọi máy chủ cho trang đề thi. Dự án chưa có máy chủ nên các hàm trả về "chưa hỗ trợ" một cách trung thực.
// Khi trung tâm có backend: thay phần thân các hàm dưới đây bằng fetch tới API thật.

import type { ResultRow } from "./storage";

export const SERVER_NOTICE = "Tính năng này cần kết nối máy chủ – trung tâm sẽ bật sau.";

export const SPEAKING_NOTICE =
  "Chấm điểm bài nói (phát âm, thanh điệu, nội dung) cần máy chủ – trung tâm sẽ bật sau. Hãy nghe lại bản ghi của mình và đối chiếu với bài nói mẫu.";

export type ServerReply = { ok: true } | { ok: false; message: string };

/** Lưu kết quả lên tài khoản học viên (hiện chỉ lưu trên trình duyệt) */
export async function saveResultOnline(examKey: string, row: ResultRow): Promise<ServerReply> {
  void examKey;
  void row;
  return { ok: false, message: SERVER_NOTICE };
}

/** Chấm điểm bài nói (phát âm, thanh điệu, nội dung) — cần máy chủ nhận dạng giọng nói */
export async function scoreSpeakingOnline(audio: Blob): Promise<ServerReply> {
  void audio;
  return { ok: false, message: SPEAKING_NOTICE };
}
