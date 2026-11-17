import { href } from "../../data";
import { PageHead, PageShell } from "../../PageShell";
import { AiDictionaryTool } from "./AiDictionaryTool";
import "./tu-dien-ai.css";

export function TuDienAiPage() {
  return (
    <PageShell active="tu-dien-ai">
      <div className="pg-tu-dien-ai">
        <PageHead
          zh="AI 越中词典"
          title="Từ điển AI Việt ⇄ Trung"
          intro="Gõ từ hoặc câu tiếng Việt / chữ Hán để tra nghĩa, phiên âm, ví dụ và cách viết. Công cụ dành cho giáo viên và học viên của trung tâm."
        />
        <section className="block light">
          <div className="wrap">
            <AiDictionaryTool />
            <p className="muted ai-foot">
              Cần tra theo ngành nghề? Xem <a href={href("tu-dien.html")}>Từ điển chuyên ngành</a> · Lưu từ của riêng bạn trong{" "}
              <a href={href("tu-dien-cua-toi.html")}>📒 Từ điển của tôi</a>.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
