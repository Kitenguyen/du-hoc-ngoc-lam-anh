"use client";

import { useEffect, useMemo, useState } from "react";
import { BRAND, href } from "../../data";
import {
  STATUSES,
  STATUS_LABEL,
  getStaffSession,
  listRegistrations,
  updateRegistration,
  type RegStatus,
  type Registration,
} from "./api";
import "./reg-tu-van.css";

type Gate = { msg: string; login: boolean; noServer: boolean };

function RegCard({ reg, onSaved }: { reg: Registration; onSaved: (r: Registration) => void }) {
  const st: RegStatus = reg.status ?? "new";
  const [sel, setSel] = useState<RegStatus>(st);
  const [note, setNote] = useState(reg.staff_note ?? "");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const phone = reg.phone ?? "";
  const meta: string[] = [];
  if (reg.course) meta.push(`Khóa: ${reg.course}`);
  if (reg.shift) meta.push(`Ca: ${reg.shift}`);
  if (reg.branch) meta.push(`Cơ sở: ${reg.branch}`);
  if (reg.birth) meta.push(`Sinh: ${reg.birth}`);
  if (reg.address) meta.push(`ĐC: ${reg.address}`);
  if (reg.created_at) meta.push(`Gửi: ${reg.created_at}`);
  if (reg.note) meta.push(`Ghi chú HV: ${reg.note}`);

  async function save() {
    setBusy(true);
    setMsg("");
    const r = await updateRegistration(reg.id, sel, note);
    setBusy(false);
    if (r.ok) {
      setMsg("Đã lưu");
      onSaved({ ...reg, status: sel, staff_note: note });
    } else setMsg(r.message);
  }

  return (
    <div className="card">
      <div className="top">
        <div>
          <div className="nm">{reg.full_name || "(không tên)"}</div>
          <div className="meta">{[phone, ...meta].filter(Boolean).join(" · ")}</div>
        </div>
        <span className="sp" />
        <span className={`pill ${st}`}>{STATUS_LABEL[st]}</span>
      </div>
      <div className="row2">
        {phone && (
          <a className="call" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
            📞 Gọi {phone}
          </a>
        )}
        <select value={sel} onChange={(e) => setSel(e.target.value as RegStatus)} aria-label="Trạng thái">
          {STATUSES.map((s) => (
            <option value={s} key={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú tư vấn (đã gọi, hẹn lịch…)" />
        <button type="button" className="btn" onClick={() => void save()} disabled={busy}>
          Lưu
        </button>
        <span className="st">{busy ? <span className="spin" /> : msg}</span>
      </div>
    </div>
  );
}

export function ConsultApp() {
  const [gate, setGate] = useState<Gate | null>(null);
  const [ready, setReady] = useState(false);
  const [who, setWho] = useState("");
  const [rows, setRows] = useState<Registration[]>([]);
  const [fs, setFs] = useState<"" | RegStatus>("");
  const [ft, setFt] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const me = await getStaffSession();
      if (!alive) return;
      if (!me.ok) {
        setGate({ msg: me.reason === "no-server" ? me.message : "Bạn cần đăng nhập.", login: true, noServer: me.reason === "no-server" });
        return;
      }
      setWho(me.name ? `Xin chào, ${me.name}` : "");
      if (!me.canConsult) {
        setGate({ msg: "Tài khoản của bạn không có quyền tư vấn tuyển sinh.", login: false, noServer: false });
        return;
      }
      const list = await listRegistrations();
      if (!alive) return;
      setRows(list);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(() => {
    const q = ft.toLowerCase().trim();
    return rows.filter((x) => {
      if (fs && (x.status ?? "new") !== fs) return false;
      if (q && !`${x.full_name ?? ""} ${x.phone ?? ""} ${x.course ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, fs, ft]);

  return (
    <div className="pg-reg-tu-van">
      <header>
        <span className="han">{BRAND.zh}</span>
        <h1>Đăng ký học viên mới · Tư vấn</h1>
        <span className="sp" />
        <span className="who">{who}</span>
        <a className="home" href={href("tai-lieu.html")}>
          ← Tài liệu
        </a>
      </header>
      <div className="wrap">
        {!gate && !ready && (
          <div className="gate">
            <h2>Đăng ký học viên</h2>
            <p className="gate-msg">
              <span className="spin" /> Đang kiểm tra quyền…
            </p>
          </div>
        )}
        {gate && (
          <div className="gate">
            <h2>Đăng ký học viên</h2>
            <p className="gate-msg">{gate.msg}</p>
            {gate.login && (
              <a className="btn" href={`${href("dang-nhap.html")}?next=reg-tu-van`}>
                Đăng nhập
              </a>
            )}
            {gate.noServer && (
              <p className="gate-sub">
                Bạn là học viên muốn đăng ký học? <a href={href("dang-ky.html")}>Đăng ký học tại đây</a>.
              </p>
            )}
          </div>
        )}
        {ready && (
          <div>
            <div className="note">
              Danh sách học viên mới đăng ký để <b>liên hệ tư vấn</b>. Gọi điện xong, cập nhật <b>trạng thái</b> và ghi chú để theo dõi.
            </div>
            <div className="toolbar">
              <select value={fs} onChange={(e) => setFs(e.target.value as "" | RegStatus)} aria-label="Lọc trạng thái">
                <option value="">Tất cả trạng thái</option>
                {STATUSES.map((s) => (
                  <option value={s} key={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <input value={ft} onChange={(e) => setFt(e.target.value)} placeholder="Tìm tên / SĐT / khóa…" className="search" />
              <span className="sp" />
              <span className="who count">{shown.length} hồ sơ</span>
            </div>
            {shown.map((r) => (
              <RegCard key={r.id} reg={r} onSaved={(n) => setRows((all) => all.map((x) => (x.id === n.id ? n : x)))} />
            ))}
            {!shown.length && <div className="empty">Chưa có hồ sơ đăng ký.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
