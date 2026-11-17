"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PHONE_LABEL, CALL_HREF, ZALO_HREF, href } from "../../data";
import { NEEDS_SERVER_MSG, loadD4Session, paymentMessage, submitD4Payment, type D4PaymentForm, type D4Session } from "./api";
import { D4_EXAM, D4_ITEMS, D4_PACKAGE, D4_PAY, D4_SAMPLE_WORDS, VOCAB_ACTIONS, type D4Item, type VocabMode } from "./data";
import { VocabPractice } from "./VocabPractice";

type Tab = "bai" | "tv" | "de" | "mua";
const TABS: Tab[] = ["bai", "tv", "de", "mua"];
const isTab = (s: string): s is Tab => (TABS as string[]).includes(s);

function ItemRow({ item, can }: { item: D4Item; can: boolean }) {
  const ic = item.ext === "mp4" ? "🎬" : item.ext === "pdf" ? "📄" : "📝";
  return (
    <div className={`d4-it${can ? "" : " lock"}`}>
      <span className="ic">{ic}</span>
      <span className="tx">
        <b>{item.title}</b>
        <small>{item.meta}</small>
      </span>
      <span className="muted">🔒</span>
    </div>
  );
}

function StatusBar({ s, onBuy }: { s: D4Session | null; onBuy: () => void }) {
  if (!s) return <div className="d4-st">Đang tải…</div>;
  if (s.can && s.user)
    return (
      <div className="d4-st ok">
        ✔ <b>{s.user.name}</b> · Gói Luyện thi D4 đang mở.
      </div>
    );
  return (
    <div className="d4-st">
      {s.user ? (
        <span>
          Tài khoản <b>{s.user.name}</b> chưa có gói D4.
        </span>
      ) : (
        "Bạn chưa đăng nhập."
      )}{" "}
      <span>
        Thẻ học và trò chơi từ vựng mẫu mở cho mọi người. Bài giảng và đề giáo viên đăng dành cho <b>học viên trung tâm</b> hoặc
        tài khoản mua <b>gói D4 {D4_PACKAGE.fee} / {D4_PACKAGE.term}</b>.
      </span>
      {!s.user && (
        <a className="btn" href={href("dang-nhap.html?next=luyen-thi-d4.html")}>
          Đăng nhập
        </a>
      )}
      <button type="button" className="btn gold" onClick={onBuy}>
        💳 Mua gói D4
      </button>
    </div>
  );
}

function BuyBox() {
  const [form, setForm] = useState<D4PaymentForm>({ fullName: "", phone: "", email: "", receipt: "", note: "" });
  const [msg, setMsg] = useState<{ text: string; err: boolean; zalo?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k: keyof D4PaymentForm) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ text: "Đang gửi…", err: false });
    const r = await submitD4Payment(form);
    setBusy(false);
    if (r.ok) {
      setMsg({ text: "✔ Đã gửi xác nhận chuyển khoản.", err: false });
      return;
    }
    const text = paymentMessage(form, D4_PACKAGE.fee);
    let copiedOk = false;
    try {
      await navigator.clipboard.writeText(text);
      copiedOk = true;
    } catch {
      copiedOk = false;
    }
    setMsg({
      text: `${r.message} Hiện chưa gửi được qua web – ${copiedOk ? "nội dung dưới đây đã được chép sẵn, " : "hãy chép nội dung dưới đây và "}gửi cho trung tâm qua Zalo.`,
      err: true,
      zalo: text,
    });
  };

  const copyAcc = async () => {
    try {
      await navigator.clipboard.writeText(D4_PAY.account);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div id="mua-box">
      <p>
        <span className="d4-price">{D4_PACKAGE.fee}</span> / {D4_PACKAGE.term} kể từ ngày trung tâm xác nhận · mở toàn bộ bài giảng, thẻ từ
        vựng, luyện đề D4. <b>Học viên của trung tâm không cần mua</b> – chỉ cần <a href={href("dang-nhap.html?next=luyen-thi-d4.html")}>đăng nhập</a>.
      </p>
      <div className="d4-pay">
        <div className="d4-qr" aria-label="Mã QR chuyển khoản (đang cập nhật)">
          <span>[Mã QR chuyển khoản]</span>
          <small>Đang cập nhật</small>
        </div>
        <dl>
          <dt>Ngân hàng</dt>
          <dd>
            <b>{D4_PAY.bank}</b>
          </dd>
          <dt>Số tài khoản</dt>
          <dd>
            <b className="big">{D4_PAY.account}</b>{" "}
            <button type="button" className="btn sm d4-copy" onClick={copyAcc}>
              {copied ? "Đã chép" : "Chép"}
            </button>
          </dd>
          <dt>Chủ tài khoản</dt>
          <dd>
            <b>{D4_PAY.holder}</b>
          </dd>
          <dt>Số tiền</dt>
          <dd>
            <b className="big">{D4_PACKAGE.fee}</b>
          </dd>
          <dt>Nội dung</dt>
          <dd>
            <b>{D4_PAY.memo}</b>
          </dd>
        </dl>
      </div>
      <p className="muted d4-small">
        Quét mã QR bằng app ngân hàng để điền sẵn số tài khoản và số tiền. Chuyển xong, điền mẫu dưới kèm <b>mã giao dịch</b>.
      </p>
      <form className="d4-f" id="d4reg" onSubmit={submit}>
        <h3>Gửi xác nhận chuyển khoản</h3>
        <label>
          Họ và tên
          <input name="full_name" required maxLength={120} value={form.fullName} onChange={set("fullName")} />
        </label>
        <label>
          Số điện thoại
          <input name="phone" required inputMode="tel" value={form.phone} onChange={set("phone")} />
        </label>
        <label>
          Email (không bắt buộc)
          <input name="email" type="email" maxLength={120} value={form.email} onChange={set("email")} />
        </label>
        <label>
          Mã biên lai / mã giao dịch chuyển khoản
          <input
            name="receipt"
            required
            minLength={4}
            maxLength={80}
            placeholder="Ví dụ: FT2610123456789"
            value={form.receipt}
            onChange={set("receipt")}
          />
        </label>
        <label>
          Ghi chú (không bắt buộc)
          <textarea name="note" rows={2} maxLength={1000} value={form.note} onChange={set("note")} />
        </label>
        <button className="btn pri" type="submit" disabled={busy}>
          Gửi xác nhận
        </button>
        <div className={`d4-msg${msg?.err ? " err" : ""}`} role="status">
          {msg?.text}
          {msg?.zalo && (
            <>
              {" "}
              <a className="btn sm d4-zalo" href={ZALO_HREF} target="_blank" rel="noopener">
                💬 Mở Zalo
              </a>
              <textarea className="d4-compose" readOnly rows={5} value={msg.zalo} onFocus={(e) => e.currentTarget.select()} />
            </>
          )}
        </div>
        <p className="muted d4-tiny">
          Trung tâm kiểm tra giao dịch và mở gói trong giờ làm việc. Cần hỗ trợ gọi <a href={CALL_HREF}>{PHONE_LABEL}</a> (Zalo).
        </p>
      </form>
    </div>
  );
}

export function D4App() {
  const [tab, setTab] = useState<Tab>("bai");
  const [session, setSession] = useState<D4Session | null>(null);
  const [mode, setMode] = useState<VocabMode | null>(null);

  useEffect(() => {
    let alive = true;
    loadD4Session().then((s) => alive && setSession(s));
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (isTab(h)) setTab(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      alive = false;
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  const go = (t: Tab) => {
    setTab(t);
    try {
      history.replaceState(null, "", `#${t}`);
    } catch {
      /* bỏ qua */
    }
  };
  const buy = () => {
    go("mua");
    requestAnimationFrame(() => document.getElementById("t-mua")?.scrollIntoView({ behavior: "smooth" }));
  };
  const openMode = (m: VocabMode) => {
    setMode(m);
    requestAnimationFrame(() => document.getElementById("tv-play")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const can = session?.can ?? false;
  const list = (k: "bai" | "de") => {
    const items = D4_ITEMS.filter((x) => x.kind === k);
    return items.length ? (
      items.map((x) => <ItemRow item={x} can={can} key={x.id} />)
    ) : (
      <p className="muted">{k === "bai" ? "Chưa có bài giảng nào." : "Chưa có đề luyện nào."} Giáo viên sẽ cập nhật sớm.</p>
    );
  };

  return (
    <div className="d4-wrap">
      <StatusBar s={session} onBuy={buy} />
      <div className="d4-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "bai"} className={tab === "bai" ? "on" : ""} onClick={() => go("bai")}>
          📺 Bài giảng
        </button>
        <button type="button" role="tab" aria-selected={tab === "tv"} className={tab === "tv" ? "on" : ""} onClick={() => go("tv")}>
          📚 Từ vựng ôn tập
        </button>
        <button type="button" role="tab" aria-selected={tab === "de"} className={tab === "de" ? "on" : ""} onClick={() => go("de")}>
          📝 Luyện đề
        </button>
        {!can && (
          <button type="button" role="tab" aria-selected={tab === "mua"} className={tab === "mua" ? "on" : ""} onClick={() => go("mua")}>
            💳 Mua gói D4
          </button>
        )}
      </div>

      <section className="d4-card" id="t-bai" hidden={tab !== "bai"}>
        <h2>📺 Bài giảng</h2>
        <p className="muted">Video và tài liệu bài giảng luyện thi khối D4 của giáo viên Trung tâm Ngọc Lâm Anh – đang cập nhật.</p>
        <div className="d4-list">{list("bai")}</div>
      </section>

      <section className="d4-card" id="t-tv" hidden={tab !== "tv"}>
        <h2>
          📚 Từ vựng ôn tập · <span>{D4_SAMPLE_WORDS.length}</span> từ mẫu
        </h2>
        <p className="muted">
          Bộ từ vựng D4 đầy đủ ({D4_PACKAGE.vocabTotal}) đang cập nhật. Hiện có {D4_SAMPLE_WORDS.length} từ mẫu thông dụng để luyện: thẻ học,
          trò chơi, kiểm tra. <b>Trò chơi từ vựng mở cho mọi người.</b>
        </p>
        <div className="d4-voc" id="tv-acts">
          {VOCAB_ACTIONS.map((a) =>
            a.mode === "shoot" ? (
              <a key={a.title} href={href(a.href ?? "tro-choi.html")}>
                <b>{a.title}</b>
                <span>{a.text}</span>
              </a>
            ) : (
              <a
                key={a.title}
                href="#tv"
                className={mode === a.mode ? "on" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  openMode(a.mode as VocabMode);
                }}
              >
                <b>{a.title}</b>
                <span>{a.text}</span>
              </a>
            ),
          )}
        </div>
        {mode && <VocabPractice key={mode} mode={mode} words={D4_SAMPLE_WORDS} onClose={() => setMode(null)} />}
      </section>

      <section className="d4-card" id="t-de" hidden={tab !== "de"}>
        <h2>📝 Luyện đề</h2>
        <p className="muted">{D4_EXAM.intro}</p>
        <a className="d4-online" href={href(D4_EXAM.href)}>
          <span>🖊️</span>
          <span>
            <b>Làm đề trực tuyến</b>
            <small>Bộ đề luyện thi D4 · bấm để chọn đề</small>
          </span>
          <span className="btn pri">Vào làm đề →</span>
        </a>
        <h3 className="d4-h3">📎 Đề và tài liệu giáo viên đăng (PDF / Word)</h3>
        <div className="d4-list">{list("de")}</div>
      </section>

      {!can && (
        <section className="d4-card" id="t-mua" hidden={tab !== "mua"}>
          <h2 id="mua">💳 Mua gói Luyện thi khối D4</h2>
          <p className="d4-note">⚠ {NEEDS_SERVER_MSG} Thông tin gói và thanh toán dưới đây là ô giữ chỗ, đang cập nhật.</p>
          <BuyBox />
        </section>
      )}
    </div>
  );
}
