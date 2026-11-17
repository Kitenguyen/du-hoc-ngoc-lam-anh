"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PageHead, PageShell } from "../../PageShell";
import { CALL_HREF, PHONE_LABEL, ZALO_HREF, href } from "../../data";
import { useLocationHash, useLocationSearch, useStoredString, writeStored } from "../tai-lieu/hooks";
import { FEE, FEE_LABEL, FEE_TEXT, GROUPS, RULES, money, type ShopBook } from "./data";
import "./sach-tieng-trung.css";

const SEL_KEY = "nla_szsel";
const ALL: Record<string, ShopBook> = Object.fromEntries(GROUPS.flatMap((g) => g.books.map((b) => [b.id, b])));

function parseSel(raw: string | null): string[] {
  try {
    const v: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x in ALL) : [];
  } catch {
    return [];
  }
}

function Cover({ b, onView }: { b: ShopBook; onView: () => void }) {
  return (
    <button type="button" className="sz-cov" onClick={onView} aria-label={`Xem thử ${b.zh}`}>
      {b.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img loading="lazy" src={b.cover} alt={`Bìa sách ${b.zh}`} />
      ) : (
        <span className="sz-nocov">
          <b>{b.zh}</b>
          <small>Ảnh bìa: Đang cập nhật</small>
        </span>
      )}
      <span>{b.preview.length ? `👀 Xem thử ${b.preview.length} trang` : "👀 Xem thử"}</span>
    </button>
  );
}

export function SachTiengTrungPage() {
  const stored = useStoredString(SEL_KEY, "session");
  const [selPick, setSelPick] = useState<string[] | null>(null);
  const sel = useMemo(() => selPick ?? parseSel(stored), [selPick, stored]);
  const search = useLocationSearch();
  const hash = useLocationHash();
  const queryId = new URLSearchParams(search).get("id");
  const [viewPick, setViewPick] = useState<string | null>(null);
  const [queryDismissed, setQueryDismissed] = useState(false);
  const viewId = viewPick ?? (!queryDismissed && queryId && queryId in ALL && hash !== "mua" ? queryId : null);
  const view = viewId ? ALL[viewId] : null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const setSel = (next: string[]) => {
    setSelPick(next);
    writeStored(SEL_KEY, JSON.stringify(next), "session");
  };
  const toggle = (id: string, on: boolean) => setSel(on ? [...sel.filter((x) => x !== id), id] : sel.filter((x) => x !== id));

  const close = () => {
    setViewPick(null);
    setQueryDismissed(true);
  };

  // Mở bằng ?id=: cuộn tới cuốn sách đó
  useEffect(() => {
    if (!queryId) return;
    document.getElementById(`b-${queryId}`)?.scrollIntoView({ block: "center" });
  }, [queryId]);

  useEffect(() => {
    if (!view) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewPick(null);
        setQueryDismissed(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [view]);

  const total = FEE === null ? null : sel.length * FEE;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    const lines = [
      "Xin chào Trung tâm Ngọc Lâm Anh, tôi muốn mua tài liệu:",
      ...sel.map((id, i) => `${i + 1}. ${ALL[id].zh}${ALL[id].vi ? ` · ${ALL[id].vi}` : ""}`),
      `Tổng: ${total === null ? `${sel.length} cuốn × ${FEE_LABEL}` : money(total)}`,
      `Họ và tên: ${get("full_name")}`,
      `Số điện thoại: ${get("phone")}`,
      ...(get("email") ? [`Email: ${get("email")}`] : []),
      ...(get("note") ? [`Ghi chú: ${get("note")}`] : []),
      "Nhờ trung tâm gửi thông tin chuyển khoản giúp tôi.",
    ];
    const text = lines.join("\n");
    setDraft(text);
    setCopied(false);
    navigator.clipboard
      ?.writeText(text)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <PageShell active="sach-tieng-trung">
      <div className="pg-sach-tieng-trung">
        <PageHead
          zh="中文书库"
          title="Tài liệu tiếng Trung"
          intro="Kho sách giáo trình tiếng Trung bản điện tử (PDF), sắp theo từng bộ. Mỗi cuốn mang đúng tên trên bìa sách."
        />
        <div className="jump">
          <div className="wrap">
            {GROUPS.map((g) => (
              <a href={`#${g.id}`} key={g.id}>
                {g.name.split(" — ")[0]}
              </a>
            ))}
            <a href="#mua">Mua tài liệu</a>
          </div>
        </div>
        <section className="block light" style={{ paddingTop: 18 }}>
          <div className="wrap">
            <div className="sz-rule">
              {RULES.map((r) => (
                <div key={r.title}>
                  <b>{r.title}</b>
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
            <div className="sz-who out">
              Bạn đang xem với tư cách khách. Học viên{" "}
              <a href={href("dang-nhap.html?next=sach-tieng-trung.html")}>đăng nhập</a> để tải tài liệu (tính năng cần
              kết nối máy chủ – trung tâm sẽ bật sau).
            </div>
            <div id="szlist">
              {GROUPS.map((g) => (
                <div className="sz-g" id={g.id} key={g.id}>
                  <div className="sz-gh">
                    <span className="zh">{g.zh}</span>
                    <h2>{g.name}</h2>
                    <span className="muted">{g.books.length} cuốn</span>
                  </div>
                  <p className="sz-gn">{g.note}</p>
                  <div className="sz-books">
                    {g.books.map((b) => (
                      <div className="sz-b" id={`b-${b.id}`} key={b.id}>
                        <Cover b={b} onView={() => setViewPick(b.id)} />
                        <div className="sz-bb">
                          <div className="t">{b.zh}</div>
                          {b.vi && <div className="v">{b.vi}</div>}
                          {b.en && <div className="e">{b.en}</div>}
                          <div className="m">
                            {b.pages ? `${b.pages} trang` : "[Số trang]"} ·{" "}
                            {b.files.map((f) => `${f.label}${f.mb ? ` ${f.mb} MB` : ""}`).join(" · ")}
                            {b.status === "soon" && (
                              <>
                                {" "}
                                · <span className="soon">Đang cập nhật</span>
                              </>
                            )}
                          </div>
                          <div className="sz-acts">
                            <label className="sz-pick">
                              <input type="checkbox" checked={sel.includes(b.id)} onChange={(e) => toggle(b.id, e.target.checked)} />{" "}
                              Chọn mua bộ này · {FEE === null ? FEE_LABEL : money(FEE)}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block light" id="mua" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sz-buy">
              <h2>Mua tài liệu · {FEE_TEXT}</h2>
              <p className="muted" style={{ margin: 0 }}>
                Tích ô <b>“Chọn mua bộ này”</b> ở các cuốn cần mua. Học viên của trung tâm không cần mua: chỉ cần{" "}
                <a href={href("dang-nhap.html?next=sach-tieng-trung.html")}>đăng nhập</a> tài khoản học viên.
              </p>
              {!sel.length ? (
                <p className="muted" style={{ marginTop: 12 }}>
                  Chưa chọn bộ tài liệu nào.
                </p>
              ) : (
                <>
                  <ul className="sz-sel">
                    {sel.map((id) => (
                      <li key={id}>
                        <span>
                          <b>{ALL[id].zh}</b>
                          {ALL[id].vi ? ` · ${ALL[id].vi}` : ""}
                        </span>
                        <span>
                          {FEE === null ? FEE_LABEL : money(FEE)}{" "}
                          <button type="button" aria-label="Bỏ chọn" onClick={() => toggle(id, false)}>
                            ✕
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="sz-tot">Tổng: {total === null ? `${sel.length} cuốn × ${FEE_LABEL}` : money(total)}</div>
                  <div className="td-pay" style={{ marginTop: 12 }}>
                    <div>
                      <b>Thanh toán qua trung tâm</b>
                      <p className="muted" style={{ fontSize: 14, margin: "6px 0 0" }}>
                        Website chưa có thanh toán trực tuyến. Điền mẫu dưới để soạn sẵn tin nhắn, rồi gửi cho trung tâm qua Zalo
                        hoặc gọi <a href={CALL_HREF}>{PHONE_LABEL}</a> — trung tâm gửi thông tin chuyển khoản và mở tài khoản tải
                        tài liệu sau khi nhận tiền.
                      </p>
                    </div>
                  </div>
                  <form className="td-reg" onSubmit={onSubmit} autoComplete="on">
                    <h3>Soạn tin nhắn gửi trung tâm</h3>
                    <label>
                      Họ và tên
                      <input name="full_name" required maxLength={120} autoComplete="name" />
                    </label>
                    <label>
                      Số điện thoại
                      <input name="phone" required inputMode="tel" pattern="0[0-9 .]{9,13}" autoComplete="tel" />
                    </label>
                    <label>
                      Email (không bắt buộc)
                      <input name="email" type="email" maxLength={120} autoComplete="email" />
                    </label>
                    <label>
                      Ghi chú (không bắt buộc)
                      <textarea name="note" rows={2} maxLength={1000} />
                    </label>
                    <button className="btn pri" type="submit">
                      Soạn tin nhắn
                    </button>
                    {draft && (
                      <div className="td-free" role="status" style={{ margin: 0 }}>
                        <b>{copied ? "Đã chép tin nhắn." : "Tin nhắn đã soạn sẵn (hãy chép lại):"}</b> Trung tâm <b>chưa</b> nhận
                        được thông tin cho tới khi bạn gửi tin nhắn này qua Zalo.
                        <pre className="sz-draft">{draft}</pre>
                        <a className="btn gold sm" href={ZALO_HREF} target="_blank" rel="noopener">
                          💬 Mở Zalo gửi tin
                        </a>{" "}
                        <a className="btn sm" href={CALL_HREF}>
                          ☎ Gọi {PHONE_LABEL}
                        </a>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="sz-cart" hidden={!sel.length}>
          <div>
            <b>{sel.length}</b> bộ đã chọn · <b>{total === null ? FEE_LABEL : money(total)}</b>
          </div>
          <a className="btn gold sm" href="#mua">
            Thanh toán
          </a>
        </div>

        {view && (
          <div className="sz-view" role="dialog" aria-modal="true" aria-labelledby="szvt" onContextMenu={(e) => e.preventDefault()}>
            <div className="sz-vbar">
              <div>
                <b id="szvt">{view.zh}</b>
                <span className="muted">
                  {" "}
                  · xem thử {view.preview.length} / {view.pages ?? "[số]"} trang
                </span>
              </div>
              <button type="button" className="btn sm" ref={closeRef} onClick={close}>
                Đóng ✕
              </button>
            </div>
            <div className="sz-vbody">
              {view.preview.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} loading="lazy" src={src} alt={`Trang ${i + 1}`} />
              ))}
              <div className="sz-end">
                <div style={{ fontSize: 36 }}>🔒</div>
                {view.preview.length ? (
                  <p>
                    <b>Hết phần xem thử ({view.preview.length} trang đầu).</b>
                  </p>
                ) : (
                  <p>
                    <b>Trang xem thử của cuốn này: Đang cập nhật.</b>
                  </p>
                )}
                <p>
                  Học viên của trung tâm xem và tải miễn phí. Người ngoài mua bộ tài liệu {FEE_TEXT} để tải toàn bộ.
                </p>
                <button
                  type="button"
                  className="btn gold"
                  onClick={() => {
                    if (!sel.includes(view.id)) setSel([...sel, view.id]);
                    close();
                    history.replaceState(null, "", "#mua");
                    window.setTimeout(() => document.getElementById("mua")?.scrollIntoView(), 60);
                  }}
                >
                  Chọn mua bộ này
                </button>
                <a className="btn" href={href("dang-nhap.html?next=sach-tieng-trung.html")}>
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
