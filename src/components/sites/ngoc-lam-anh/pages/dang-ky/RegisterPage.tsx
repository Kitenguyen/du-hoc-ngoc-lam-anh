import { PageHead, PageShell } from "../../PageShell";
import { BRAND, CALL_HREF, CONTACT, PHONE_LABEL } from "../../data";
import { BENEFITS, PAGE } from "./data";
import { RegisterForm } from "./RegisterForm";
import "./dang-ky.css";

export function RegisterPage({ initialCourse }: { initialCourse: string }) {
  return (
    <PageShell active="dang-ky">
      <div className="pg-dang-ky">
        <PageHead zh={PAGE.zh} title={PAGE.title} intro={PAGE.intro} />
        <section className="block light">
          <div className="wrap two">
            <aside className="card red-card">
              <div className="brush-name">{BRAND.zh}</div>
              <p>
                <b>{BRAND.fullName}</b>
              </p>
              <p className="muted">
                📍 {CONTACT.address}
                <br />☎ Hotline / Zalo: <a href={CALL_HREF}>{PHONE_LABEL}</a>
                <br />🕒 {CONTACT.hours}
              </p>
              <p>
                <b>Khi đăng ký bạn được:</b>
              </p>
              <ul className="muted">
                {BENEFITS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </aside>
            <RegisterForm initialCourse={initialCourse} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
