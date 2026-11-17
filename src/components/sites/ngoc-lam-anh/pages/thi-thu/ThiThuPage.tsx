import { PageHead, PageShell } from "../../PageShell";
import { href } from "../../data";
import { findLevel } from "../de-thi/exams";
import { HSK20, HSK30, HSKK, HSKK30, JUMPS, PAGE, type LevelCard } from "./data";
import "./thi-thu.css";

function Card({ card }: { card: LevelCard }) {
  const level = findLevel(card.levelId);
  const n = level?.exams.length ?? 0;
  const small = !level ? card.note : n ? `${n} đề luyện · ${card.note}` : `${card.note} · đề đang soạn`;
  return (
    <div className="lv-card">
      <span className="band">{card.band}</span>
      <b>{card.name}</b>
      <small>{small}</small>
      {level ? (
        <a className="btn pri sm" href={href(`de-thi.html?l=${level.id}`)}>
          {card.cta ?? "Vào thi thử"}
        </a>
      ) : (
        <span className="soon">Đang cập nhật đề</span>
      )}
    </div>
  );
}

function Head({ zh, title, intro }: { zh: string; title: string; intro: string }) {
  return (
    <div className="head">
      <div className="zh">{zh}</div>
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

export function ThiThuPage() {
  return (
    <PageShell active="thi-thu">
      <div className="pg-thi-thu">
        <PageHead zh={PAGE.zh} title={PAGE.title} intro={PAGE.intro} />
        <div className="jump">
          <div className="wrap">
            {JUMPS.map((j) => (
              <a href={j.href} key={j.href}>
                {j.label}
              </a>
            ))}
          </div>
        </div>

        <section className="block light" id="hsk20">
          <div className="wrap">
            <Head {...HSK20} />
            <div className="lv-grid">
              {HSK20.cards.map((c) => (
                <Card card={c} key={c.name} />
              ))}
            </div>
          </div>
        </section>

        <section className="block light" id="hskk" style={{ paddingTop: 10 }}>
          <div className="wrap">
            <Head {...HSKK} />
            <div className="lv-grid">
              {HSKK.cards.map((c) => (
                <Card card={c} key={c.name} />
              ))}
            </div>
          </div>
        </section>

        <section className="block red" id="hsk30">
          <div className="wrap">
            <Head {...HSK30} />
            <div className="lv30">
              {HSK30.columns.map((col) => (
                <div className="lv30-col" key={col.zh}>
                  <div className="lv30-h">
                    <span>{col.zh}</span>
                    <b>{col.title}</b>
                  </div>
                  {col.cards.map((c) => (
                    <Card card={c} key={c.name} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block light" id="hskk30">
          <div className="wrap">
            <Head {...HSKK30} />
            <div className="lv-grid">
              {HSKK30.cards.map((c) => (
                <Card card={c} key={c.name} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
