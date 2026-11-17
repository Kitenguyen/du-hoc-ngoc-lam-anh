"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { BRAND, PHONE_LABEL, ZALO_HREF, href } from "../../data";
import { Handoff, buildSummary, copyText } from "../dang-ky/Handoff";
import { submitAccountRequest } from "./api";
import { BANK, DURATION, PACKAGES, isPlaceholder } from "./data";
import "./mua-tai-khoan.css";

/** Thu nhỏ ảnh (cạnh dài ≤ 1200px) và nén JPEG — như trang mẫu. */
function shrinkImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const mx = 1200;
      let w = img.width;
      let h = img.height;
      if (w > mx || h > mx) {
        const r = Math.min(mx / w, mx / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      cv.getContext("2d")?.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không đọc được ảnh"));
    };
    img.src = url;
  });
}

export function BuyAccountPage() {
  const [level, setLevel] = useState("");
  const [phone, setPhone] = useState("");
  const [receipt, setReceipt] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState("");
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pkg = PACKAGES.find((p) => p.id === level);
  const digits = phone.replace(/\D+/g, "");
  const ckNote = `${BANK.notePrefix} ${digits || "số điện thoại"}`;
  const canCopyAcc = !isPlaceholder(BANK.accountNumber);

  function showMsg(text: string, ok: boolean) {
    setMsg({ text, ok });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setReceipt(await shrinkImage(f));
    } catch {
      showMsg("Không đọc được ảnh, bạn chọn ảnh khác nhé.", false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website") ?? "")) return;
    const name = String(fd.get("full_name") ?? "").trim();
    const addr = String(fd.get("address") ?? "").trim();
    const note = String(fd.get("note") ?? "");
    if (name.length < 2) return showMsg("Vui lòng nhập họ tên.", false);
    if (!/^0\d{9,10}$/.test(digits)) return showMsg("Số điện thoại chưa đúng (10–11 số, bắt đầu bằng 0).", false);
    if (addr.length < 4) return showMsg("Vui lòng nhập địa chỉ.", false);
    if (!level) return showMsg("Vui lòng chọn cấp độ cần mua.", false);
    if (!receipt) return showMsg("Vui lòng tải ảnh biên lai chuyển tiền.", false);
    setMsg(null);
    setBusy(true);
    const r = await submitAccountRequest({
      full_name: name,
      address: addr,
      phone: digits,
      password: String(fd.get("password") ?? ""),
      level,
      receipt,
      note,
    });
    setBusy(false);
    if (r.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (r.reason === "error") return showMsg(r.message, false);
    // Không có mật khẩu trong nội dung gửi qua Zalo
    setSummary(
      buildSummary(`ĐĂNG KÝ MUA TÀI KHOẢN – ${BRAND.fullName}`, [
        ["Họ tên", name],
        ["Số điện thoại", digits],
        ["Địa chỉ", addr],
        ["Cấp độ", pkg ? `${pkg.name} – ${pkg.price}` : level],
        ["Nội dung chuyển khoản", ckNote],
        ["Ghi chú", note],
      ]) + "\n(Ảnh biên lai chuyển tiền gửi kèm)",
    );
  }

  return (
    <div className="pg-mua-tai-khoan">
      <div className="top">
        <div className="zh">{BRAND.zh}</div>
        <h1>Đăng ký mua tài khoản</h1>
        <p>Học giáo án online · {BRAND.fullName}</p>
        <a className="back" href={href("index.html")}>
          ← Về trang chủ
        </a>
      </div>

      <div className="wrap">
        {msg && <div className={`msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>}

        {summary && !done && (
          <div className="card">
            <Handoff
              heading="Còn một bước: gửi đăng ký cho trung tâm"
              text={summary}
              onEdit={() => setSummary("")}
              extra={
                <p className="hint">
                  📎 Ảnh biên lai <b>chưa được gửi</b> — bạn đính kèm ảnh biên lai trong tin nhắn Zalo cùng nội dung trên. Trung tâm kích
                  hoạt tài khoản sau khi kiểm tra biên lai.
                </p>
              }
            />
          </div>
        )}

        {done && (
          <div className="done">
            <div className="big">✅</div>
            <h2>Trung tâm đã nhận đăng ký</h2>
            <p>
              Trung tâm sẽ kiểm tra biên lai và kích hoạt tài khoản cho bạn trong thời gian sớm nhất.
              <br />
              Sau khi được kích hoạt, bạn đăng nhập bằng <b>số điện thoại</b> đã đăng ký.
            </p>
            <p>
              <a className="submit inline" href={href("dang-nhap.html")}>
                Tới trang đăng nhập
              </a>
            </p>
          </div>
        )}

        <form autoComplete="on" onSubmit={onSubmit} hidden={Boolean(summary) || done} noValidate>
          <input type="text" name="website" className="hp-field" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="card">
            <h2>1 · Thông tin của bạn</h2>
            <label htmlFor="mtk-name">
              Họ và tên <span className="req">*</span>
            </label>
            <input type="text" id="mtk-name" name="full_name" maxLength={120} placeholder="VD: Nguyễn Văn A" required />
            <label htmlFor="mtk-addr">
              Địa chỉ <span className="req">*</span>
            </label>
            <input type="text" id="mtk-addr" name="address" maxLength={255} placeholder="Số nhà, đường, phường/xã, tỉnh/thành" required />
            <label htmlFor="mtk-phone">
              Số điện thoại <span className="req">*</span>
            </label>
            <input
              type="tel"
              id="mtk-phone"
              name="phone"
              maxLength={15}
              placeholder="VD: 0912345678"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="hint">
              Số điện thoại sẽ là <b>tên đăng nhập</b> của bạn.
            </p>
            <label htmlFor="mtk-pass">Mật khẩu đăng nhập</label>
            <input type="text" id="mtk-pass" name="password" maxLength={60} placeholder="Để trống sẽ dùng số điện thoại làm mật khẩu" autoComplete="new-password" />
            <p className="hint">Bạn có thể đổi mật khẩu sau khi đăng nhập.</p>
          </div>

          <div className="card">
            <h2>2 · Cấp độ cần mua</h2>
            <label htmlFor="mtk-level">
              Chọn cấp độ <span className="req">*</span>
            </label>
            <select id="mtk-level" value={level} onChange={(e) => setLevel(e.target.value)} required>
              <option value="">— Chọn cấp độ —</option>
              {PACKAGES.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name} — {p.price} / {DURATION}
                </option>
              ))}
            </select>
            {pkg && (
              <div className="price-badge">
                Học phí: {pkg.price} / {DURATION}
              </div>
            )}
            <p className="hint">
              Tài khoản có hiệu lực <b>{DURATION}</b> kể từ ngày kích hoạt.
            </p>
          </div>

          <div className="card">
            <h2>3 · Chuyển khoản học phí</h2>
            <div className="pay">
              <div className="qr">
                {BANK.qrSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="Mã QR chuyển khoản" src={BANK.qrSrc} />
                ) : (
                  <div className="qr-ph">[Mã QR chuyển khoản]</div>
                )}
              </div>
              <div className="info">
                <div className="rowcopy">
                  <span>
                    Chủ TK: <b>{BANK.accountName}</b>
                  </span>
                </div>
                <div className="rowcopy">
                  <span className="stk">{BANK.accountNumber}</span>
                  <button
                    type="button"
                    className="btncopy"
                    disabled={!canCopyAcc}
                    onClick={async () => {
                      if (await copyText(BANK.accountNumber)) {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                  >
                    {copied ? "Đã chép ✓" : "Sao chép"}
                  </button>
                </div>
                <div className="rowcopy">
                  <span>
                    <b>{BANK.bankName}</b>
                  </span>
                </div>
                <div className="rowcopy">
                  <span>
                    Nội dung CK: <b>{ckNote}</b>
                  </span>
                </div>
                <p className="hint">Quét mã QR hoặc chuyển khoản theo thông tin trên, rồi chụp lại biên lai ở bước 4.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>
              4 · Biên lai chuyển tiền <span className="req">*</span>
            </h2>
            <button type="button" className={`up${receipt ? " has" : ""}`} onClick={() => fileRef.current?.click()}>
              <span>{receipt ? "✓ Đã chọn ảnh biên lai — bấm để đổi ảnh khác" : "📷 Bấm để tải ảnh biên lai / màn hình chuyển khoản"}</span>
              {receipt && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={receipt} alt="Ảnh biên lai đã chọn" />
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            <p className="hint">Bắt buộc có ảnh biên lai để trung tâm xác nhận. Ảnh chỉ xem trước trên máy bạn.</p>
            <label htmlFor="mtk-note">Ghi chú thêm (không bắt buộc)</label>
            <textarea id="mtk-note" name="note" maxLength={1000} placeholder="Giờ chuyển khoản, tên người chuyển, yêu cầu khác…" />
          </div>

          <button type="submit" className="submit" disabled={busy}>
            {busy ? "Đang xử lý…" : "Gửi đăng ký mua tài khoản"}
          </button>
        </form>

        <div className="foot">
          Nếu có thắc mắc gì xin liên hệ trung tâm qua Zalo:{" "}
          <a href={ZALO_HREF} target="_blank" rel="noopener noreferrer">
            {PHONE_LABEL}
          </a>
        </div>
      </div>
    </div>
  );
}
