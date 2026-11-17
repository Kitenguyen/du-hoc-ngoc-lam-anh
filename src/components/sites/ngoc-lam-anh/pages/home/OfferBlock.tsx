import { CALL_HREF, PHONE_LABEL, REGISTER_HREF, ZALO_HREF, href } from "../../data";
import { OFFER } from "./offer-data";

export function OfferBlock() {
  return (
    <section className="block offer" id="uu-dai">
      <div className="wrap">
        <div className="offer-card reveal">
          <div className="gift-art" aria-hidden="true">
            <span className="rays" />
            <svg viewBox="0 0 160 160">
              <g className="lid">
                <path
                  d="M80 44c-10-22-38-26-38-8 0 10 20 10 38 8Zm0 0c10-22 38-26 38-8 0 10-20 10-38 8Z"
                  fill="#f7dc94"
                  stroke="#a97a17"
                  strokeWidth="3"
                />
                <rect x="26" y="44" width="108" height="24" rx="5" fill="#d61f27" stroke="#7e0a10" strokeWidth="3" />
                <rect x="72" y="44" width="16" height="24" fill="#e2b04a" />
              </g>
              <rect x="34" y="68" width="92" height="70" rx="4" fill="#b5121b" stroke="#7e0a10" strokeWidth="3" />
              <rect x="72" y="68" width="16" height="70" fill="#e2b04a" />
            </svg>
            <span className="spark s1">✦</span>
            <span className="spark s2">✦</span>
            <span className="spark s3">✧</span>
            <span className="spark s4">✦</span>
          </div>
          <div className="offer-copy">
            <div className="zh">{OFFER.zh}</div>
            <span className="kicker">{OFFER.kicker}</span>
            <h2>{OFFER.title}</h2>
            <p className="gift-line">
              {OFFER.giftLabel} <strong className="shine">{OFFER.giftValue}</strong>
            </p>
            <p className="desc">{OFFER.text}</p>
            <p className="terms">{OFFER.terms}</p>
            <div className="acts">
              <a className="btn gold" href={ZALO_HREF} target="_blank" rel="noopener">
                Nhận ưu đãi qua Zalo
              </a>
              <a className="btn light" href={CALL_HREF}>
                ☎ {PHONE_LABEL}
              </a>
              <a className="btn ghost" href={href(REGISTER_HREF)}>
                Đăng ký tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
