import { BRAND, CALL_HREF, PHONE_LABEL, REGISTER_HREF, href } from "../../data";
import { HERO } from "./data";
import { HERO_FLY, OFFER } from "./offer-data";

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 50" aria-hidden="true">
      <g fill="#fff">
        <circle cx="30" cy="32" r="16" />
        <circle cx="55" cy="22" r="20" />
        <circle cx="82" cy="30" r="15" />
        <rect x="18" y="30" width="80" height="18" rx="9" />
      </g>
    </svg>
  );
}

export function Plane() {
  return (
    <svg viewBox="0 0 64 26" aria-hidden="true">
      <path
        d="M2 14.5 6 13l5 .2L17 4h4.5l-3 9.4 21.5-.6C52 12.4 60 12.6 62.5 14c-2.5 1.5-10.5 1.8-22.5 1.6L18.5 15l3 9H17l-6-8.3-5 .2Z"
        fill="#fff"
        stroke="#1d4f86"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M6 13 11 13.2 7.5 6.5H4.5Z" fill="#d61f27" />
      <path d="M40 13.8h16" stroke="#3b7fc4" strokeWidth="1.6" strokeDasharray="1.8 1.6" />
    </svg>
  );
}

function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 400 110" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="#7e0a10" opacity=".88">
        {/* Chùa nhiều tầng */}
        <path d="M70 18h4v10h-4z" />
        <path d="M52 36q20-10 40 0h-7v8H59v-8z" />
        <path d="M48 52q24-11 48 0h-8v9H56v-9z" />
        <path d="M44 69q28-12 56 0h-9v10H53V69z" />
        <path d="M40 87q32-13 64 0h-10v23H50V87z" />
        {/* Mái đình */}
        <path d="M116 84q34-16 68 0h-7v26h-54V84z" />
        {/* Tòa nhà hiện đại */}
        <path d="M196 52h22v58h-22z" />
        <path d="M224 30h16v80h-16z" />
        <path d="M231 6h2v24h-2z" />
        <path d="M246 62h26v48h-26z" />
        <path d="M280 40l10-14 10 14v70h-20z" />
        <path d="M306 70h30v40h-30z" />
        <path d="M342 54h18v56h-18z" />
        <path d="M366 76h34v34h-34z" />
        <path d="M0 100h400v10H0z" />
      </g>
    </svg>
  );
}

export function HeroFly() {
  return (
    <section className="hero fly">
      <span className="sky-plane p1" aria-hidden="true">
        <Plane />
      </span>
      <span className="sky-plane p2" aria-hidden="true">
        <Plane />
      </span>
      <div className="wrap">
        <div className="hero-copy">
          <div className="motto rise r1">{HERO_FLY.motto}</div>
          <h1>
            <span className="pre rise r2">{BRAND.fullName}</span>
            <span className="l1 rise r3">{HERO_FLY.line1}</span>
            <span className="l2 rise r4">{HERO_FLY.line2}</span>
          </h1>
          <p className="lead rise r5">{HERO_FLY.lead}</p>
          <a className="offer-pill rise r5" href="#uu-dai">
            <span className="gift" aria-hidden="true">
              🎁
            </span>
            <span>
              <b>{OFFER.title}</b> · {OFFER.giftLabel.toLowerCase()} <strong>{OFFER.giftValue}</strong>
            </span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
          <div className="cta rise r6">
            <a className="btn gold" href="#uu-dai">
              Nhận ưu đãi du học
            </a>
            <a className="btn gold" href={href(REGISTER_HREF)}>
              Đăng ký học thử miễn phí
            </a>
            <a className="btn ghost" href={CALL_HREF}>
              ☎ {PHONE_LABEL}
            </a>
          </div>
          <div className="places rise r6">
            {HERO.places.map((p) => (
              <span key={p.label}>
                <b>{p.label}</b>
                {p.text}
              </span>
            ))}
          </div>
        </div>

        <div className="art window-art">
          <div className="window">
            <div className="sky">
              <span className="sun" aria-hidden="true" />
              <Cloud className="cloud c1" />
              <Cloud className="cloud c2" />
              <Cloud className="cloud c3" />
              <span className="sign" aria-hidden="true">
                {HERO_FLY.sign}
              </span>
              <span className="plane" aria-hidden="true">
                <span className="trail" />
                <Plane />
              </span>
              <Skyline />
              <span className="flash" aria-hidden="true" />
            </div>
            <div className="shutters" aria-hidden="true">
              <span className="sh left">
                <i>{HERO_FLY.shutters[0]}</i>
              </span>
              <span className="sh right">
                <i>{HERO_FLY.shutters[1]}</i>
              </span>
            </div>
            <span className="arch" aria-hidden="true" />
            <span className="sill" aria-hidden="true" />
          </div>
          <a className="gift-badge" href="#uu-dai" aria-label={`${OFFER.giftLabel} ${OFFER.giftValue}`}>
            <small>Quà tặng</small>
            <b>1 TỶ</b>
            <small>đồng</small>
          </a>
          <div className="seal" aria-hidden="true">
            {HERO.art.seal}
          </div>
        </div>
      </div>
    </section>
  );
}
