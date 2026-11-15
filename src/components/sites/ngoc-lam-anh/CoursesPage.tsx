import { CourseCard } from "./CourseCard";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, TopBar } from "./SiteHeader";
import { CALL_HREF, COURSE_GROUPS, GENERAL_INFO, JUMP_LINKS, PAGE_HEAD, PHONE_LABEL, STUDY_ABROAD_TILES, href } from "./data";

function StudyAbroadTiles() {
  return (
    <div className="d4-mods" style={{ marginTop: 22 }}>
      <h3 style={{ margin: "0 0 10px", font: "800 21px var(--display)", color: "var(--red-dk)" }}>
        {STUDY_ABROAD_TILES.title}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
        {STUDY_ABROAD_TILES.tiles.map((m) => (
          <a
            key={m.title}
            href={href(m.href)}
            style={{
              display: "grid",
              gap: 6,
              textDecoration: "none",
              color: "var(--ink)",
              background: "#fff",
              border: "2px solid var(--line)",
              borderTop: `5px solid ${m.accent}`,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <span style={{ fontSize: 30 }}>{m.icon}</span>
            <b style={{ fontSize: 18, color: "var(--red-dk)" }}>{m.title}</b>
            <span className="muted">{m.text}</span>
          </a>
        ))}
      </div>
      <p className="muted" style={{ margin: "10px 0 0", fontSize: 14.5 }}>
        {STUDY_ABROAD_TILES.note} <a href={href("du-hoc")}>Xem chi phí và học bổng chi tiết</a>.
      </p>
    </div>
  );
}

export function CoursesPage() {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <main>
        <div className="page-head">
          <div className="wrap">
            <div className="zh">{PAGE_HEAD.zh}</div>
            <h1>{PAGE_HEAD.title}</h1>
            <p>{PAGE_HEAD.intro}</p>
          </div>
        </div>
        <div className="jump">
          <div className="wrap">
            {JUMP_LINKS.map((j) => (
              <a href={j.href} key={j.href}>
                {j.label}
              </a>
            ))}
          </div>
        </div>
        {COURSE_GROUPS.map((g) => (
          <section className={`block ${g.tone}`} id={g.id} key={g.id}>
            <div className="wrap">
              <div className="head">
                <div className="zh">{g.zh}</div>
                <h2>{g.title}</h2>
                <p>{g.intro}</p>
              </div>
              <div className="courses">
                {g.courses.map((c) => (
                  <CourseCard course={c} key={c.id} />
                ))}
              </div>
              {g.id === "du-hoc" && <StudyAbroadTiles />}
            </div>
          </section>
        ))}
        <section className="block light" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="card">
              <b>Thông tin chung</b>
              <p className="muted" style={{ marginTop: 6 }}>
                {GENERAL_INFO} Tư vấn qua điện thoại / Zalo <a href={CALL_HREF}>{PHONE_LABEL}</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
