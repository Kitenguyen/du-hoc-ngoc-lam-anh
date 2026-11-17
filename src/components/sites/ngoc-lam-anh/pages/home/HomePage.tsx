import { PageShell } from "../../PageShell";
import { BRAND, CALL_HREF, COURSE_GROUPS, PHONE_LABEL, REGISTER_HREF, href, type Course } from "../../data";
import {
  COURSES_HEAD,
  COURSE_FEES,
  CTA,
  FEE_PLACEHOLDER,
  GALLERY,
  GALLERY_HEAD,
  HERO,
  LEAD_TEACHER,
  ONLINE,
  PATH,
  STATS,
  STUDY,
  TEACHERS,
  TEAM_HEAD,
  TESTIMONIALS,
  TESTIMONIALS_HEAD,
  WHYS,
} from "./data";
import "./home.css";

function Head({ zh, title, intro }: { zh: string; title: string; intro?: string }) {
  return (
    <div className="head">
      <div className="zh">{zh}</div>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function HomeCourse({ course }: { course: Course }) {
  const facts = [
    { icon: "👤", label: "Đối tượng", value: course.audience },
    { icon: "⏱", label: "Lịch học", value: course.schedule },
    { icon: "🎯", label: "Đầu ra", value: course.outcome },
  ].filter((f) => f.value);
  const fee = COURSE_FEES[course.id] ?? FEE_PLACEHOLDER;
  return (
    <article className="course" id={course.id}>
      <div className="cv">
        <span className="big" aria-hidden="true">
          {course.glyph}
        </span>
        <span className="tag">{course.tag}</span>
        <h3>{course.title}</h3>
        {(course.months || course.sessions) && (
          <div className="dur">
            {course.months && <b>{course.months}</b>}
            {course.sessions && <span>{course.sessions}</span>}
          </div>
        )}
      </div>
      <div className="bd">
        <p>{course.intro}</p>
        <dl>
          {facts.map((f) => (
            <div key={f.label}>
              <i aria-hidden="true">{f.icon}</i>
              <span>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </span>
            </div>
          ))}
          <div>
            <i aria-hidden="true">💰</i>
            <span>
              <dt>Học phí</dt>
              <dd>
                <b>{fee}</b>
              </dd>
            </span>
          </div>
        </dl>
        <a className="btn pri" href={href(`khoa-hoc.html#${course.id}`)}>
          Xem chi tiết khóa học
        </a>
      </div>
    </article>
  );
}

export function HomePage() {
  const study = COURSE_GROUPS.filter((g) => g.id !== "du-hoc");
  const courses = study.flatMap((g) => g.courses);
  const total = COURSE_GROUPS.reduce((n, g) => n + g.courses.length, 0);
  const [brandFirst, ...brandRest] = BRAND.name.split(" ");
  return (
    <PageShell active="">
      <div className="pg-home">
        <section className="hero">
          <div className="wrap">
            <div>
              <div className="motto">{HERO.motto}</div>
              <h1>
                <span className="pre">{HERO.pre}</span>
                <span className="brandname">
                  <span className="nw">Tiếng Trung</span>{" "}
                  <span className="nw">
                    {brandFirst} {brandRest.join(" ")}
                  </span>
                </span>
              </h1>
              <div className="zh">{BRAND.zh}</div>
              <p className="lead">{HERO.lead}</p>
              <div className="cta">
                <a className="btn gold" href={href(REGISTER_HREF)}>
                  Đăng ký học thử miễn phí
                </a>
                <a className="btn gold" href={href("dk-hoc-sinh.php")}>
                  Đăng ký tài khoản
                </a>
                <a className="btn gold" href={href("mua-tai-khoan.php")}>
                  Đăng ký mua tài khoản
                </a>
                <a className="btn ghost" href={href("thi-thu.html")}>
                  Thi thử HSK online
                </a>
              </div>
              <div className="places">
                {HERO.places.map((p) => (
                  <span key={p.label}>
                    <b>{p.label}</b>
                    {p.text}
                  </span>
                ))}
              </div>
            </div>
            <div className="art">
              <div className="frame stage">
                <span className="bigchar" aria-hidden="true">
                  {HERO.art.bigChar}
                </span>
                <span className="halo" aria-hidden="true" />
                <span className="floor" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="person" src={HERO.art.person} alt={HERO.art.personAlt} width={575} height={786} />
                <span className="nameplate">
                  <b>{HERO.art.name}</b>
                  <small>{HERO.art.role}</small>
                </span>
              </div>
              <div className="seal" aria-hidden="true">
                {HERO.art.seal}
              </div>
              <div className="badge">
                <b>{HERO.art.badge.value}</b>
                <span>{HERO.art.badge.label}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="stats">
          <div className="wrap">
            {STATS.map((s) => (
              <div className="s" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="block light">
          <div className="wrap">
            <Head zh={COURSES_HEAD.zh} title={COURSES_HEAD.title} intro={COURSES_HEAD.intro} />
            <div className="courses">
              {courses.map((c) => (
                <HomeCourse course={c} key={c.id} />
              ))}
            </div>
            <div className="center">
              <a className="btn" href={href("khoa-hoc.html")}>
                Xem tất cả {total} khóa học
              </a>
            </div>
          </div>
        </section>

        <section className="block red">
          <div className="wrap">
            <Head zh={PATH.zh} title={PATH.title} intro={PATH.intro} />
            <ol className="path p5">
              {PATH.steps.map((s, i) => (
                <li className={`step${i === PATH.steps.length - 1 ? " top" : ""}`} key={s.title}>
                  <span className="no">{i + 1}</span>
                  <div className="ic" aria-hidden="true">
                    {s.ic}
                  </div>
                  <b>{s.title}</b>
                  <span className="goal">{s.goal}</span>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="block light">
          <div className="wrap">
            <Head zh={WHYS.zh} title={WHYS.title} />
            <div className="whys">
              {WHYS.items.map((w) => (
                <div className="why" key={w.title}>
                  <div className="ic" aria-hidden="true">
                    {w.ic}
                  </div>
                  <b>{w.title}</b>
                  <p>{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block red" id="doi-ngu">
          <div className="wrap">
            <Head zh={TEAM_HEAD.zh} title={TEAM_HEAD.title} intro={TEAM_HEAD.intro} />
            <div className="lead-t">
              <div className="ph">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LEAD_TEACHER.photo} alt={`Giáo viên ${LEAD_TEACHER.name}`} loading="lazy" />
                <span className="ribbon">{LEAD_TEACHER.ribbon}</span>
              </div>
              <div>
                <div className="zh">{BRAND.zh}</div>
                <h3>{LEAD_TEACHER.name}</h3>
                <div className="role">{LEAD_TEACHER.role}</div>
                <p className="bio">{LEAD_TEACHER.bio}</p>
                <div className="chips">
                  {LEAD_TEACHER.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
                <div className="lead-acts">
                  <a className="btn gold" href={href(REGISTER_HREF)}>
                    Đăng ký học với đội ngũ giáo viên
                  </a>
                </div>
              </div>
            </div>
            <div className="teachers">
              {TEACHERS.map((t) => (
                <a className="teacher" key={t.name} href={t.url} target="_blank" rel="noopener" title={`Hồ sơ giáo viên ${t.name}`}>
                  <div className="ph">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.photo} alt={`Giáo viên ${t.name}`} loading="lazy" />
                  </div>
                  <div className="plate">
                    <b>{t.name}</b>
                    <small>{t.role}</small>
                  </div>
                  <p className="tbio">{t.bio}</p>
                  <div className="chips">
                    {t.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="block deep" id="du-hoc">
          <div className="wrap">
            <Head zh={STUDY.zh} title={STUDY.title} intro={STUDY.intro} />
            <div className="unis">
              {STUDY.reasons.map((r) => (
                <div key={r.title}>
                  <b>{r.zh}</b>
                  <strong>{r.title}</strong>
                  <span>{r.text}</span>
                </div>
              ))}
              <div className="more">
                <b>{STUDY.more.value}</b>
                <span>{STUDY.more.label}</span>
              </div>
            </div>

            <h3 className="dh-sub">Điều kiện đầu vào</h3>
            <div className="dh-cols">
              {STUDY.conditions.map((c) => (
                <div className="dh-card" key={c.title}>
                  <b>{c.title}</b>
                  <ul>
                    {c.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="dh-sub">Chi phí du học</h3>
            <div className="dh-cols">
              {STUDY.costs.map((c) => (
                <div className="dh-card" key={c.title}>
                  <b>{c.title}</b>
                  <ul>
                    {c.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="dh-sub">{STUDY.scholarships.title}</h3>
            <div className="dh-table">
              <table>
                <thead>
                  <tr>
                    <th>Chuyên ngành</th>
                    <th>Chế độ</th>
                    <th>Điều kiện</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDY.scholarships.rows.map((r) => (
                    <tr key={r.majors}>
                      <td>{r.majors}</td>
                      <td>{r.perks}</td>
                      <td>{r.req}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="dh-note">
              {STUDY.scholarships.note}{" "}
              <a href={STUDY.scholarships.moreHref} target="_blank" rel="noopener">
                Xem bảng đầy đủ
              </a>
            </p>

            <div className="study-pts">
              {STUDY.points.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            <div className="center">
              <a className="btn gold" href={href(STUDY.cta.href)}>
                {STUDY.cta.label}
              </a>
            </div>
          </div>
        </section>

        <section className="block light">
          <div className="wrap">
            <Head zh={ONLINE.zh} title={ONLINE.title} intro={ONLINE.intro} />
            <div className="tiles">
              {ONLINE.tiles.map((t) => (
                <a className="tile" href={href(t.href)} key={t.title}>
                  <span className="ic" aria-hidden="true">
                    {t.ic}
                  </span>
                  <b>{t.title}</b>
                  <p>{t.text}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="block red" id="cam-nhan">
          <div className="wrap">
            <Head zh={TESTIMONIALS_HEAD.zh} title={TESTIMONIALS_HEAD.title} intro={TESTIMONIALS_HEAD.intro} />
            <div className="testis">
              {TESTIMONIALS.map((t, i) => (
                <figure className="testi ph-card" key={i}>
                  <span className="q" aria-hidden="true">
                    “
                  </span>
                  <span className="ph-tag">Đang cập nhật</span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <span className="av" aria-hidden="true">
                      {t.initials}
                    </span>
                    <span>
                      <b>{t.name}</b>
                      <small>{t.course}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="block light" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Head zh={GALLERY_HEAD.zh} title={GALLERY_HEAD.title} />
            <div className="gallery">
              {GALLERY.map((g, i) => (
                <figure key={i} className={g.src ? undefined : "ph-img"}>
                  {g.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.src} alt={g.caption} loading="lazy" />
                  ) : (
                    <span className="ph-glyph" aria-hidden="true">
                      {"玉林英学中"[i % 5]}
                    </span>
                  )}
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="block red">
          <div className="wrap">
            <div className="band">
              <div>
                <h2>{CTA.title}</h2>
                <p>{CTA.text}</p>
              </div>
              <div className="acts">
                <a className="btn pri" href={href(REGISTER_HREF)}>
                  Đăng ký học
                </a>
                <a className="btn light" href={CALL_HREF}>
                  Gọi {PHONE_LABEL}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
