import { PageHead, PageShell } from "../../PageShell";
import { DICT_SECTIONS } from "./data";
import { DictionaryApp } from "./DictionaryApp";
import "./tu-dien.css";

export function TuDienPage() {
  const nEntries = DICT_SECTIONS.reduce((a, s) => a + s.entries.length, 0);
  const nSent = DICT_SECTIONS.reduce((a, s) => a + (s.sentences?.length ?? 0), 0);
  return (
    <PageShell active="tu-dien">
      <div className="pg-tu-dien">
        <PageHead
          zh="专业汉语词典"
          title="Từ điển tiếng Trung chuyên ngành"
          intro={
            <>
              Tra cứu thuật ngữ theo ngành, phòng ban: chữ Hán, pinyin, nghĩa, ví dụ, mẫu câu, cách viết. {DICT_SECTIONS.length} ngành và phòng ban ·{" "}
              <b>{nEntries}</b> mục từ · {nSent} mẫu câu (đang tiếp tục cập nhật).
            </>
          }
        />
        <section className="block light">
          <div className="wrap">
            <DictionaryApp />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
