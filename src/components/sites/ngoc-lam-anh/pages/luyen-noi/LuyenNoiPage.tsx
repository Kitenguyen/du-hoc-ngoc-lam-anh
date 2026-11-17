import { PageHead, PageShell } from "../../PageShell";
import { LuyenNoi } from "./LuyenNoi";
import "./luyen-noi.css";

export function LuyenNoiPage() {
  return (
    <PageShell active="luyen-noi">
      <div className="pg-luyen-noi">
        <PageHead
          zh="常用口语问答 · 口语反应训练"
          title="Luyện nói phản xạ HSK1–HSK6"
          intro="Nghe câu hỏi, trả lời thành tiếng trong thời gian giới hạn, máy so sánh và chấm ngay trên trình duyệt."
        />
        <section className="block light">
          <div className="wrap">
            <LuyenNoi />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
