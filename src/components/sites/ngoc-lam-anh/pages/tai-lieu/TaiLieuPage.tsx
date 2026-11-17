import { PageHead, PageShell } from "../../PageShell";
import { href } from "../../data";
import { LEVELS, TEXTBOOKS, type Textbook } from "../giao-trinh/data";
import { BOOKSHOP_CARD, SECTION_TEXT, SPECIALTY_CARDS, TAI_LIEU_HEAD, TAI_LIEU_JUMP, type ExtraCard } from "./data";
import "./tai-lieu.css";

function Status({ status, okText = "Đã có" }: { status: "ok" | "soon"; okText?: string }) {
  return status === "ok" ? <span className="ok">{okText}</span> : <span className="soon">Đang cập nhật</span>;
}

function LessonPlanCard({ b }: { b: Textbook }) {
  return (
    <div className="book">
      <div className="bk-zh">{b.zh}</div>
      <div className="bk-vi">{b.vi}</div>
      <div className="bk-meta">
        {b.lessons.length} bài · <Status status={b.status} />
      </div>
      <div className="bk-parts">
        {b.parts.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
      <a className="btn pri sm" href={href(`giao-trinh.html?b=${b.id}`)}>
        Mở giáo trình
      </a>
    </div>
  );
}

function OrigCard({ b }: { b: Textbook }) {
  return (
    <div className="book slim">
      <div className="bk-zh">{b.zh}</div>
      <div className="bk-vi">{b.vi}</div>
      <div className="bk-meta">
        <Status status={b.status} okText="Đã có sách gốc" />
        {b.shopId && !b.onlineOnly && b.status === "ok" && (
          <>
            {" "}
            · <span className="ok">Có PDF</span>
          </>
        )}
      </div>
      <a className="btn sm" href={href(`giao-trinh.html?b=${b.id}#goc`)}>
        Xem sách
      </a>
    </div>
  );
}

function ExtraBook({ c }: { c: ExtraCard }) {
  return (
    <div className="book">
      <div className="bk-zh">{c.zh}</div>
      <div className="bk-vi">{c.vi}</div>
      <div className="bk-meta">
        {c.meta} · <Status status={c.status} />
      </div>
      <div className="bk-parts">
        {c.parts.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
      <a className="btn pri sm" href={href(c.href)}>
        {c.btn}
      </a>
    </div>
  );
}

const levelBooks = LEVELS.map((lv) => ({ lv, books: TEXTBOOKS.filter((b) => b.level === lv.id) })).filter((x) => x.books.length);
const specialtyBooks = TEXTBOOKS.filter((b) => b.level === "cn");

export function TaiLieuPage() {
  return (
    <PageShell active="tai-lieu">
      <div className="pg-tai-lieu">
        <PageHead zh={TAI_LIEU_HEAD.zh} title={TAI_LIEU_HEAD.title} intro={TAI_LIEU_HEAD.intro} />
        <div className="jump">
          <div className="wrap">
            {TAI_LIEU_JUMP.map((j) => (
              <a href={j.href} key={j.href}>
                {j.label}
              </a>
            ))}
          </div>
        </div>

        <section className="block light" id="tra-luong-tu">
          <div className="wrap">
            <div className="head">
              <div className="zh">量词</div>
              <h2>Tra lượng từ</h2>
              <p>{SECTION_TEXT.traLuongTu}</p>
            </div>
            <p>
              <a className="btn pri" href={href("tra-luong-tu.html")}>
                📏 Mở bảng tra lượng từ
              </a>
            </p>
          </div>
        </section>

        <section className="block light" id="giao-an">
          <div className="wrap">
            <div className="head">
              <div className="zh">教案</div>
              <h2>Giáo án giảng dạy</h2>
              <p>
                Mỗi giáo trình gồm 2 phần: <b>giáo án giảng dạy</b> từng bài (từ vựng, ngữ pháp, bài tập, kiểm tra) và{" "}
                <b>kiểm tra cuối khóa</b> (10 đề). Khách được xem miễn phí bài 1 của mỗi giáo trình; học viên mở giáo
                trình của lớp đã đăng ký; giáo viên mở toàn bộ.
              </p>
            </div>
            <div className="vd-banner">
              <div className="vd-ic">🎬</div>
              <div className="vd-tx">
                <b>Video giảng dạy</b>
                <div className="muted">{SECTION_TEXT.video}</div>
              </div>
              <a className="btn pri sm" href={href("video-giang-day.html")}>
                Xem video
              </a>
            </div>
            {levelBooks.map(({ lv, books }) => (
              <div className="lvblock" key={lv.id}>
                <div className="lvh">
                  <span>{lv.zh}</span>
                  <b>{lv.title}</b>
                </div>
                <div className="books">
                  {books.map((b) => (
                    <LessonPlanCard b={b} key={b.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="block red" id="giao-trinh">
          <div className="wrap">
            <div className="head">
              <div className="zh">教材</div>
              <h2>Tài liệu giáo trình</h2>
              <p>
                {SECTION_TEXT.giaoTrinh}{" "}
                <a href={href("sach-tieng-trung.html")} style={{ color: "#f7dc94" }}>
                  Tài liệu tiếng Trung
                </a>
                .
              </p>
            </div>
            <div className="on-red">
              {levelBooks.map(({ lv, books }) => (
                <div className="lvblock" key={lv.id}>
                  <div className="lvh">
                    <span>{lv.zh}</span>
                    <b>{lv.title}</b>
                  </div>
                  <div className="books">
                    {books.map((b) => (
                      <OrigCard b={b} key={b.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block light" id="chuyen-nganh">
          <div className="wrap">
            <div className="head">
              <div className="zh">专业汉语</div>
              <h2>Tài liệu chuyên ngành</h2>
              <p>{SECTION_TEXT.chuyenNganh}</p>
            </div>
            <div className="lvblock">
              <div className="lvh">
                <span>专业</span>
                <b>Chuyên ngành</b>
              </div>
              <div className="books">
                {SPECIALTY_CARDS.map((c) => (
                  <ExtraBook c={c} key={c.href} />
                ))}
                {specialtyBooks.map((b) => (
                  <LessonPlanCard b={b} key={b.id} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="block red" id="tieng-trung">
          <div className="wrap">
            <div className="head">
              <div className="zh">中文书库</div>
              <h2>Tài liệu tiếng Trung</h2>
              <p>{SECTION_TEXT.tiengTrung}</p>
            </div>
            <div className="on-red">
              <div className="books">
                <ExtraBook c={BOOKSHOP_CARD} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
