import { BRAND, CALL_HREF, COMMITMENTS, CONTACT, FOOTER_LINKS, PHONE_LABEL, ZALO_HREF, href } from "./data";

export function SiteFooter() {
  return (
    <>
      <div className="fret" style={{ backgroundColor: "var(--red-deep)" }} />
      <footer className="site">
        <div className="wrap">
          <div className="cols">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="foot-logo" src={BRAND.logo} alt={`Logo ${BRAND.fullName}`} width={800} height={540} />
              <h4>{BRAND.fullName}</h4>
              <ul>
                <li>📍 {CONTACT.address}</li>
                <li>
                  ☎ Hotline / Zalo: <a href={CALL_HREF}>{PHONE_LABEL}</a>
                </li>
                <li>✉ {CONTACT.email || "[Email]"}</li>
                <li>
                  👍 Facebook:{" "}
                  <a href={CONTACT.facebook} target="_blank" rel="noopener">
                    fb.com/HoaNguQuynhChinese
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Khám phá</h4>
              <ul>
                {FOOTER_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={href(l.href)}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Cam kết</h4>
              <ul>
                {COMMITMENTS.map((c) => (
                  <li key={c}>✔ {c}</li>
                ))}
                <li>{CONTACT.hours}</li>
              </ul>
            </div>
          </div>
          <div className="copy">
            © 2026 {BRAND.fullName} — {BRAND.zh} · {BRAND.slogan}
          </div>
        </div>
      </footer>
      <div className="float">
        <a className="call" href={CALL_HREF} aria-label="Gọi hotline">
          Gọi
        </a>
        <a className="zalo" href={ZALO_HREF} target="_blank" rel="noopener" aria-label="Nhắn Zalo">
          Zalo
        </a>
      </div>
    </>
  );
}
