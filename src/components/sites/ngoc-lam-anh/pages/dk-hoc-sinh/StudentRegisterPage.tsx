"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { BRAND } from "../../data";
import { Handoff, buildSummary } from "../dang-ky/Handoff";
import { submitStudent, type ScheduleSlot } from "./api";
import { CAMPUSES, DAYS, METHODS, MODES, TEACHERS, TIMES } from "./data";
import { PhotoCropper } from "./PhotoCropper";
import "./dk-hoc-sinh.css";

type DaySlot = { on: boolean; t1: string; t2: string };
const emptySched = (): Record<string, DaySlot> => Object.fromEntries(DAYS.map((d) => [d.value, { on: false, t1: "", t2: "" }]));

export function StudentRegisterPage() {
  const [mode, setMode] = useState(MODES[0].value);
  const [sched, setSched] = useState<Record<string, DaySlot>>(emptySched);
  const [photo, setPhoto] = useState("");
  const [srcUrl, setSrcUrl] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // giải phóng URL ảnh gốc khi đổi ảnh / rời trang
  useEffect(() => {
    return () => {
      if (srcUrl) URL.revokeObjectURL(srcUrl);
    };
  }, [srcUrl]);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setSrcUrl(URL.createObjectURL(f));
    setCropOpen(true);
  }

  const closeCrop = useCallback(() => setCropOpen(false), []);

  function setDay(d: string, patch: Partial<DaySlot>) {
    setSched((s) => {
      const next = { ...s[d], ...patch };
      if (patch.on === false) {
        next.t1 = "";
        next.t2 = "";
      }
      return { ...s, [d]: next };
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const pass = String(fd.get("pass") ?? "");
    const pass2 = String(fd.get("pass2") ?? "");
    const err = (text: string) => setMsg({ text, ok: false });
    if (get("full_name").length < 2) return err("Em nhập họ và tên nhé.");
    if (pass !== pass2) return err("Hai ô mật khẩu chưa giống nhau.");
    if (pass.length < 4) return err("Mật khẩu cần ít nhất 4 ký tự.");
    if (!photo) return err("Em chọn ảnh học viên nhé (bấm 📷 Chọn / chụp ảnh).");
    if (mode !== "online" && !get("campus")) return err("Em chọn cơ sở học nhé.");
    const slots: ScheduleSlot[] = DAYS.filter((d) => sched[d.value].on).map((d) => ({ d: d.value, t1: sched[d.value].t1, t2: sched[d.value].t2 }));
    setMsg({ text: "Đang xử lý…", ok: true });
    setBusy(true);
    const data = {
      full_name: get("full_name"),
      phone: get("phone"),
      teacher: get("teacher"),
      password: pass,
      mode,
      campus: mode === "online" ? "" : get("campus"),
      method: get("method"),
      sched: slots,
      address: get("address"),
      photo,
    };
    const r = await submitStudent(data);
    setBusy(false);
    if (r.ok) {
      setMsg({
        text: "✓ Trung tâm đã nhận đăng ký. Tài khoản của em sẽ được duyệt trước khi đăng nhập. Hãy nhớ tên đăng nhập (họ tên) và mật khẩu vừa đặt nhé.",
        ok: true,
      });
      return;
    }
    if (r.reason === "error") return err(r.message);
    setMsg(null);
    const dayLabel = (v: string) => DAYS.find((d) => d.value === v)?.label ?? v;
    const schedText = slots.map((s) => `${dayLabel(s.d)}${s.t1 || s.t2 ? ` ${s.t1 || "?"}–${s.t2 || "?"}` : ""}`).join("; ");
    setSummary(
      buildSummary(`ĐĂNG KÝ HỌC VIÊN – ${BRAND.fullName}`, [
        ["Họ và tên (tên đăng nhập)", data.full_name],
        ["Số điện thoại", data.phone],
        ["Địa chỉ", data.address],
        ["Giáo viên giảng dạy", data.teacher],
        ["Hình thức học", MODES.find((m) => m.value === mode)?.label],
        ["Cơ sở học", data.campus],
        ["Phương thức học", METHODS.find((m) => m.value === data.method)?.label],
        ["Lịch học", schedText],
      ]) + "\n(Ảnh 4×6 gửi kèm. Mật khẩu em tự đặt sẽ nhập khi trung tâm tạo tài khoản – không gửi qua tin nhắn.)",
    );
  }

  return (
    <div className="pg-dk-hoc-sinh">
      <div className="top">
        <h1>Đăng ký học viên</h1>
        <p>
          {BRAND.fullName} · {BRAND.zh}
        </p>
      </div>
      <div className="wrap">
        <div className="card">
          {summary && (
            <Handoff
              heading="Còn một bước: gửi đăng ký cho trung tâm"
              text={summary}
              onEdit={() => setSummary("")}
              extra={
                <div className="ho-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="Ảnh 4×6 đã cắt" />
                  <div>
                    <p>
                      📎 Ảnh 4×6 <b>chưa được gửi</b>. Em tải ảnh về máy rồi gửi kèm trong tin nhắn Zalo nhé.
                    </p>
                    <a className="mini pri" href={photo} download="anh-4x6.jpg">
                      ⬇ Tải ảnh 4×6 về máy
                    </a>
                  </div>
                </div>
              }
            />
          )}
          <div hidden={Boolean(summary)}>
            <div className="note">
              Em điền thông tin bên dưới để đăng ký học. <b>Tên đăng nhập là họ và tên của em</b>, và em <b>tự đặt mật khẩu</b> để sau này
              đăng nhập vào web học. Tài khoản sẽ được giáo viên/trung tâm duyệt trước khi dùng.
            </div>
            <form onSubmit={onSubmit}>
              <label htmlFor="dkhs-name">
                Họ và tên <span className="req">*</span> <span className="sub">(cũng là tên đăng nhập)</span>
              </label>
              <input id="dkhs-name" name="full_name" placeholder="VD: NGUYỄN VĂN AN" required autoComplete="name" />

              <label>
                Ảnh học viên <span className="req">*</span>{" "}
                <span className="sub">(chọn/chụp ảnh nào cũng được – rồi cắt khung 4×6 rõ mặt)</span>
              </label>
              <div className="photo">
                <div className="pv" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>
                  {!photo && (
                    <span>
                      Chưa có
                      <br />
                      ảnh 4×6
                    </span>
                  )}
                </div>
                <div className="pbtn">
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                  <button type="button" className="mini pri" onClick={() => fileRef.current?.click()}>
                    📷 Chọn / chụp ảnh
                  </button>
                  {photo && srcUrl && (
                    <button type="button" className="mini" onClick={() => setCropOpen(true)}>
                      ✂ Chỉnh lại khung
                    </button>
                  )}
                  <div className="phint">Ảnh rõ mặt, nền sáng. Sau khi chọn, kéo &amp; phóng to cho khuôn mặt nằm gọn trong khung 4×6.</div>
                </div>
              </div>

              <label htmlFor="dkhs-addr">
                Địa chỉ <span className="req">*</span>
              </label>
              <input id="dkhs-addr" name="address" placeholder="VD: số nhà, đường, phường/xã, tỉnh/thành" required autoComplete="street-address" />

              <div className="row">
                <div>
                  <label htmlFor="dkhs-phone">
                    Số điện thoại <span className="req">*</span>
                  </label>
                  <input id="dkhs-phone" name="phone" type="tel" placeholder="VD: 0912345678" required autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="dkhs-teacher">
                    Giáo viên giảng dạy <span className="req">*</span>
                  </label>
                  <select id="dkhs-teacher" name="teacher" required defaultValue="">
                    <option value="">— Chọn giáo viên —</option>
                    {TEACHERS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div>
                  <label htmlFor="dkhs-pass">
                    Mật khẩu <span className="req">*</span> <span className="sub">(em tự đặt)</span>
                  </label>
                  <input id="dkhs-pass" name="pass" type="password" placeholder="Ít nhất 4 ký tự" required autoComplete="new-password" />
                </div>
                <div>
                  <label htmlFor="dkhs-pass2">
                    Nhập lại mật khẩu <span className="req">*</span>
                  </label>
                  <input id="dkhs-pass2" name="pass2" type="password" placeholder="Nhập lại mật khẩu" required autoComplete="new-password" />
                </div>
              </div>

              <div className="row">
                <div>
                  <label htmlFor="dkhs-mode">
                    Hình thức học <span className="req">*</span>
                  </label>
                  <select id="dkhs-mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    {MODES.map((m) => (
                      <option value={m.value} key={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                {mode !== "online" && (
                  <div>
                    <label htmlFor="dkhs-campus">
                      Cơ sở học <span className="req">*</span>
                    </label>
                    <select id="dkhs-campus" name="campus" defaultValue="">
                      <option value="">— Chọn cơ sở —</option>
                      {CAMPUSES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="row">
                <div>
                  <label htmlFor="dkhs-method">
                    Phương thức học <span className="req">*</span>
                  </label>
                  <select id="dkhs-method" name="method" defaultValue={METHODS[0].value}>
                    {METHODS.map((m) => (
                      <option value={m.value} key={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div />
              </div>

              <label>
                Lịch học trong tuần <span className="sub">(tích ngày học, mỗi thứ chọn khung giờ riêng)</span>
              </label>
              <div className="sched">
                {DAYS.map((d) => {
                  const s = sched[d.value];
                  return (
                    <div className="srow" key={d.value}>
                      <label className="chip">
                        <input type="checkbox" checked={s.on} onChange={(e) => setDay(d.value, { on: e.target.checked })} /> {d.label}
                      </label>
                      <select disabled={!s.on} value={s.t1} onChange={(e) => setDay(d.value, { t1: e.target.value })} aria-label={`${d.label} – giờ bắt đầu`}>
                        <option value="">Giờ bắt đầu</option>
                        {TIMES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <span className="dash">–</span>
                      <select disabled={!s.on} value={s.t2} onChange={(e) => setDay(d.value, { t2: e.target.value })} aria-label={`${d.label} – giờ kết thúc`}>
                        <option value="">Giờ kết thúc</option>
                        {TIMES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <button className="btn" type="submit" disabled={busy}>
                Đăng ký
              </button>
              {msg && (
                <div className={`msg ${msg.ok ? "ok" : "err"}`} role={msg.ok ? "status" : "alert"}>
                  {msg.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {cropOpen && srcUrl && (
        <PhotoCropper
          url={srcUrl}
          onCancel={closeCrop}
          onDone={(d) => {
            setPhoto(d);
            setCropOpen(false);
          }}
        />
      )}
    </div>
  );
}
