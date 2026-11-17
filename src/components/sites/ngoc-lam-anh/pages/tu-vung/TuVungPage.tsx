import { PageHead, PageShell } from "../../PageShell";
import { href } from "../../data";
import { VocabTools } from "./VocabTools";
import "./tu-vung.css";

export function TuVungPage() {
  return (
    <PageShell active="tu-vung">
      <div className="pg-tu-vung">
        <PageHead
          zh="词汇复习"
          title="Ôn tập từ vựng"
          intro="Ôn từ vựng theo từng cấp HSK bằng thẻ học, trò chơi và bài kiểm tra tổng hợp."
        />
        <section className="block light">
          <div className="wrap">
            <div className="infobox">
              Mọi công cụ chạy ngay trên trình duyệt, <b>không cần đăng nhập</b>. Tiến độ “đã thuộc” và điểm cao nhất được lưu
              trên máy bạn đang dùng. Hiện đã có đủ từ vựng <b>HSK 1</b> và <b>HSK 2</b>; các cấp khác trung tâm đang cập nhật.
            </div>
            <VocabTools />
          </div>
        </section>
        <section className="block light" id="luyen-noi" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="infobox tv-more">
              <div>
                <b className="tv-more-t">🎙 Luyện nói phản xạ HSK1–HSK6</b> <span className="tv-more-zh">常用口语问答</span>
                <br />
                Nghe câu hỏi có âm thanh, trả lời thành tiếng, nhắc lại câu mẫu – máy so sánh và chấm ngay trên trình duyệt.
              </div>
              <span className="tv-more-acts">
                <a className="btn pri sm" href={href("luyen-noi.html#lv1")}>
                  HSK1
                </a>
                <a className="btn pri sm" href={href("luyen-noi.html#lv2")}>
                  HSK2
                </a>
                <a className="btn sm" href={href("tro-choi.html")}>
                  🎯 Trò chơi bắn chữ
                </a>
              </span>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
