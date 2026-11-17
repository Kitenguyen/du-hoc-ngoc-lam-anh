import { REGISTER_HREF, href, type Course } from "./data";

export function CourseCard({ course }: { course: Course }) {
  const facts = [
    { icon: "👤", label: "Đối tượng", value: course.audience },
    { icon: "⏱", label: course.scheduleLabel ?? "Lịch học", value: course.schedule },
    { icon: "🎯", label: course.outcomeLabel ?? "Đầu ra", value: course.outcome },
  ].filter((f) => f.value);
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
        {course.requirement && <div className="req">{course.requirement}</div>}
        {facts.length > 0 && (
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
          </dl>
        )}
        <div className="course-detail">
          <b>{course.syllabusTitle ?? "Nội dung đào tạo"}</b>
          <ul>
            {course.syllabus.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <a className="btn pri" href={href(course.ctaHref ?? `${REGISTER_HREF}?khoa=${course.id}`)}>
          {course.cta ?? "Đăng ký khóa này"}
        </a>
      </div>
    </article>
  );
}
