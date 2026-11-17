"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PageShell } from "../../PageShell";
import { href } from "../../data";
import { SERVER_NOTICE } from "../tai-lieu/api";
import { HdViewer, type ViewerState } from "../tai-lieu/HdViewer";
import { useHydrated, useLocationHash, useLocationSearch } from "../tai-lieu/hooks";
import { CK_TOTAL, DOT_SIZE, findTextbook, type Textbook } from "./data";
import "./giao-trinh.css";

type TabId = "ga" | "dot" | "ck" | "goc";

const LOCK_GUEST = "Cần đăng nhập học viên";

function Lock({ children }: { children: ReactNode }) {
  return <span className="lockmsg">🔒 {children}</span>;
}

function loginHref(id: string) {
  return href(`dang-nhap.html?next=${encodeURIComponent(`giao-trinh.html?b=${id}`)}`);
}

function Body({ b, tab, setTab, open }: { b: Textbook; tab: TabId; setTab: (t: TabId) => void; open: (v: ViewerState) => void }) {
  const groups: { a: number; z: number }[] = [];
  for (let i = 0; i < b.lessons.length; i += DOT_SIZE) {
    const g = b.lessons.slice(i, i + DOT_SIZE);
    groups.push({ a: g[0].n, z: g[g.length - 1].n });
  }

  if (tab === "ga") {
    return (
      <>
        <div className="infobox">
          {b.level === "cn" ? (
            "Tài liệu chuyên ngành dành cho học viên và giáo viên của trung tâm."
          ) : (
            <>
              Khách được học miễn phí <b>bài {b.lessons[0]?.n ?? 1}</b> (từ vựng, ngữ pháp, bài tập, kiểm tra). Học viên mở
              toàn bộ giáo trình của lớp đã đăng ký; giáo viên mở toàn bộ.
            </>
          )}
        </div>
        <div className="rows">
          {b.lessons.map((l) => {
            const ok = !!(l.file && l.free);
            return (
              <div className={`rowx${ok ? "" : " locked"}`} key={l.n}>
                <span className="no">{l.n}</span>
                <div className="tt">
                  <b>
                    第{l.n}课 {l.zh}
                  </b>
                  <span>
                    {l.py} · {l.vi} · {l.meta}
                  </span>
                </div>
                <div className="acts">
                  {ok ? (
                    <button className="btn pri sm" type="button" onClick={() => open({ title: `Bài ${l.n} · ${l.zh}`, url: l.file })}>
                      Mở giáo án
                    </button>
                  ) : l.free ? (
                    <span className="lockmsg">Đang biên soạn</span>
                  ) : (
                    <Lock>{LOCK_GUEST}</Lock>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (tab === "dot") {
    return (
      <>
        <div className="infobox">
          Kiểm tra kiến thức theo đợt: học xong <b>{DOT_SIZE} bài</b> làm 1 bài kiểm tra <b>100 câu = 100 điểm</b>. Mỗi lần
          kiểm tra {DOT_SIZE} bài vừa học và <b>ôn lại cả các bài trước</b>. Đạt từ 60 điểm.
        </div>
        <div className="rows">
          {groups.map((g, i) => {
            const n = i + 1;
            const ready = n <= b.dotReady;
            return (
              <div className="rowx locked" key={n}>
                <span className="no">{n}</span>
                <div className="tt">
                  <b style={{ fontFamily: "var(--sans)" }}>Kiểm tra kiến thức lần {n}</b>
                  <span>
                    Bài {g.a}
                    {g.a !== g.z ? `–${g.z}` : ""}
                    {n > 1 ? ` · ôn cả bài ${b.lessons[0].n}–${g.a - 1}` : ""} · 100 câu · 100 điểm
                  </span>
                </div>
                <div className="acts">{ready ? <Lock>{LOCK_GUEST}</Lock> : <span className="lockmsg">Đang biên soạn</span>}</div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (tab === "ck") {
    return (
      <>
        <div className="infobox">
          {CK_TOTAL} đề kiểm tra cuối khóa, mỗi đề 100 câu dùng toàn bộ từ vựng của giáo trình. Học viên làm{" "}
          <b>đề 1–{CK_TOTAL - 1}</b> để ôn tập; <b>đề {CK_TOTAL}</b> là đề thi cuối khóa, giáo viên cung cấp mật khẩu khi thi.
        </div>
        <div className="rows">
          {Array.from({ length: CK_TOTAL }, (_, i) => {
            const n = i + 1;
            const ready = n <= b.ckReady;
            return (
              <div className="rowx locked" key={n}>
                <span className="no">{n}</span>
                <div className="tt">
                  <b style={{ fontFamily: "var(--sans)" }}>
                    Đề số {n}
                    {n === CK_TOTAL ? " · Thi cuối khóa" : ""}
                  </b>
                  <span>100 câu · {b.vi}</span>
                </div>
                <div className="acts">{ready ? <Lock>{LOCK_GUEST}</Lock> : <span className="lockmsg">Đang biên soạn</span>}</div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // Sách gốc
  return (
    <>
      {b.lessons.length > 0 && (
        <p>
          <button className="btn sm" type="button" onClick={() => setTab("ga")}>
            ← Giáo án giảng dạy
          </button>
        </p>
      )}
      <div className="infobox">
        Sách gốc {b.vi} xem trực tuyến theo từng bài.
        {b.onlineOnly
          ? " Giáo trình này chỉ xem trực tuyến, không tải về."
          : " Học viên của trung tâm xem và tải miễn phí toàn bộ sách gốc PDF; người ngoài xem thử phần đầu sách, mua bộ tài liệu để xem và tải toàn bộ."}
      </div>
      {!b.onlineOnly && b.shopId && (
        <p>
          <a className="btn gold sm" href={href(`sach-tieng-trung.html?id=${encodeURIComponent(b.shopId)}`)}>
            📚 Xem thử · Mua bộ tài liệu
          </a>
        </p>
      )}
      <div className="rows">
        {b.orig.map((o) => (
          <div className={`rowx${o.file ? "" : " locked"}`} key={o.title}>
            <span className="no">📖</span>
            <div className="tt">
              <b>{o.title}</b>
            </div>
            <div className="acts">
              {o.file ? (
                <button className="btn pri sm" type="button" onClick={() => open({ title: o.title, url: o.file, newTab: false })}>
                  Xem
                </button>
              ) : b.level === "cn" || b.onlineOnly || !b.shopId ? (
                <Lock>Cần đăng nhập</Lock>
              ) : (
                <a className="btn sm" href={href(`sach-tieng-trung.html?id=${encodeURIComponent(b.shopId)}#mua`)}>
                  🔒 Mua bộ để xem
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function GiaoTrinhPage() {
  const hydrated = useHydrated();
  const search = useLocationSearch();
  const hash = useLocationHash();
  const [tabPick, setTabPick] = useState<TabId | null>(null);
  const [view, setView] = useState<ViewerState | null>(null);
  const close = useCallback(() => setView(null), []);

  // Hash đổi từ bên ngoài (link #goc, nút Back) → bỏ lựa chọn tab cũ, theo hash
  useEffect(() => {
    const onHash = () => setTabPick(null);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const id = new URLSearchParams(search).get("b");
  const b = findTextbook(id);
  const hasL = !!b?.lessons.length;
  const tabs: [TabId, string][] = b
    ? [
        ...(hasL ? ([["ga", "Giáo án giảng dạy"]] as [TabId, string][]) : []),
        ...(hasL ? ([["dot", "Kiểm tra theo đợt"]] as [TabId, string][]) : []),
        ...(hasL ? ([["ck", "Kiểm tra cuối khóa"]] as [TabId, string][]) : []),
      ]
    : [];
  const fromHash = (hash === "goc" || tabs.some((t) => t[0] === hash) ? hash : hasL ? "ga" : "goc") as TabId;
  const tab = tabPick ?? fromHash;

  const setTab = (t: TabId) => {
    setTabPick(t);
    history.replaceState(null, "", `#${t}`);
  };

  let content: ReactNode;
  if (!hydrated) {
    content = (
      <div className="bk-hero">
        <div className="wrap">
          <p>Đang tải…</p>
        </div>
      </div>
    );
  } else if (!b) {
    content = (
      <section className="block light">
        <div className="wrap">
          <div className="card">
            Giáo trình này đang được biên soạn. <a href={href("tai-lieu.html")}>← Về Tài liệu</a>
          </div>
        </div>
      </section>
    );
  } else {
    content = (
      <>
        <div className="bk-hero">
          <div className="wrap">
            <a href={href("tai-lieu.html")} style={{ color: "#f7dc94" }}>
              ← Tài liệu
            </a>
            <div className="zh" style={{ marginTop: 10 }}>
              {b.zh}
            </div>
            <h1>{b.name ?? b.vi}</h1>
            <p>{hasL ? `${b.lessons.length} bài · ${b.words ?? "[số]"} từ mới` : "Sách gốc"}</p>
            {b.status === "soon" && <span className="soon gt-soon">Đang cập nhật</span>}
            <span className="who">
              Bạn đang xem với tư cách khách ·{" "}
              <a href={loginHref(b.id)} style={{ color: "#f7dc94" }}>
                Đăng nhập
              </a>
            </span>
          </div>
        </div>
        <section className="block light" style={{ paddingTop: 10 }}>
          <div className="wrap">
            <div className="tabs2">
              {tab === "goc" ? (
                <button className="on" type="button">
                  Sách gốc (tài liệu giáo trình)
                </button>
              ) : (
                tabs.map(([k, t]) => (
                  <button key={k} type="button" className={k === tab ? "on" : ""} onClick={() => setTab(k)}>
                    {t}
                  </button>
                ))
              )}
            </div>
            <Body b={b} tab={tab} setTab={setTab} open={setView} />
            <p className="muted gt-note">
              Học viên đăng nhập để mở toàn bộ giáo trình của lớp. {SERVER_NOTICE}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <PageShell active="tai-lieu">
      <div className="pg-giao-trinh" id="bk">
        {content}
        <HdViewer view={view} onClose={close} />
      </div>
    </PageShell>
  );
}
