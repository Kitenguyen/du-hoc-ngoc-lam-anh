"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { PHONE_LABEL } from "../../data";
import { submitRegistration, type RegistrationData } from "./api";
import { BRANCHES, CONSULT_ID, COURSE_OPTIONS, DRAFT_KEY, SHIFTS, SUMMARY_TITLE, courseTitle } from "./data";
import { Handoff, buildSummary } from "./Handoff";

const FIELDS = ["full_name", "phone", "birth", "address", "course", "shift", "branch", "note"] as const;
type Field = (typeof FIELDS)[number];

function readForm(f: HTMLFormElement): RegistrationData {
  const fd = new FormData(f);
  const get = (k: Field) => String(fd.get(k) ?? "");
  return {
    full_name: get("full_name"),
    phone: get("phone"),
    birth: get("birth"),
    address: get("address"),
    course: get("course"),
    shift: get("shift"),
    branch: get("branch"),
    note: get("note"),
  };
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

function saveDraft(d: RegistrationData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    // bỏ qua (chế độ riêng tư, bị chặn lưu…)
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // bỏ qua
  }
}

export function RegisterForm({ initialCourse }: { initialCourse: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [summary, setSummary] = useState("");
  const [done, setDone] = useState(false);

  // Khôi phục bản nháp (chỉ lưu trên máy này). Khóa học từ ?khoa= được ưu tiên.
  useEffect(() => {
    const f = formRef.current;
    if (!f) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<Record<Field, unknown>>;
      for (const k of FIELDS) {
        if (k === "course" && initialCourse) continue;
        const el = f.elements.namedItem(k);
        const v = d[k];
        if (typeof v === "string" && v && (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) {
          el.value = v;
        }
      }
    } catch {
      // bản nháp hỏng → bỏ qua
    }
  }, [initialCourse]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setErr("");
    const hp = f.elements.namedItem("website");
    if (hp instanceof HTMLInputElement && hp.value) return;
    const d = readForm(f);
    if (d.full_name.trim().length < 2) {
      setErr("Vui lòng nhập họ tên.");
      (f.elements.namedItem("full_name") as HTMLInputElement | null)?.focus();
      return;
    }
    if (!/^[0-9 +().-]{8,20}$/.test(d.phone.trim())) {
      setErr("Số điện thoại chưa đúng.");
      (f.elements.namedItem("phone") as HTMLInputElement | null)?.focus();
      return;
    }
    setSending(true);
    const r = await submitRegistration(d);
    setSending(false);
    if (r.ok) {
      // Khi đã có máy chủ thật
      clearDraft();
      setDone(true);
      return;
    }
    if (r.reason === "error") {
      setErr(`${r.message} Bạn có thể gọi ${PHONE_LABEL} hoặc nhắn Zalo.`);
      return;
    }
    setSummary(
      buildSummary(SUMMARY_TITLE, [
        ["Họ tên", d.full_name],
        ["Số điện thoại", d.phone],
        ["Ngày sinh", formatDate(d.birth)],
        ["Địa chỉ", d.address],
        ["Khóa học", courseTitle(d.course)],
        ["Ca học", d.shift],
        ["Cơ sở", d.branch],
        ["Ghi chú", d.note],
      ]),
    );
  }

  return (
    <div className="card">
      <div className="ok-box" hidden={!done}>
        <b>Trung tâm đã nhận đăng ký.</b>
        <p style={{ margin: "6px 0 0" }}>Cảm ơn bạn. Trung tâm sẽ gọi lại sớm nhất.</p>
      </div>
      {summary && (
        <Handoff heading="Còn một bước: gửi thông tin cho trung tâm" text={summary} onEdit={() => setSummary("")} onCopied={clearDraft} />
      )}
      <form
        ref={formRef}
        className="form"
        noValidate
        hidden={Boolean(summary) || done}
        onSubmit={onSubmit}
        onChange={(e) => saveDraft(readForm(e.currentTarget))}
      >
        {err && (
          <div className="err-box" role="alert">
            {err}
          </div>
        )}
        <div className="hp" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="row2">
          <label>
            Họ tên *
            <input name="full_name" required maxLength={120} autoComplete="name" />
          </label>
          <label>
            Số điện thoại *
            <input name="phone" required inputMode="tel" maxLength={20} autoComplete="tel" />
          </label>
        </div>
        <div className="row2">
          <label>
            Ngày sinh
            <input name="birth" type="date" />
          </label>
          <label>
            Địa chỉ
            <input name="address" maxLength={255} autoComplete="street-address" />
          </label>
        </div>
        <div className="row2">
          <label>
            Khóa học
            <select name="course" defaultValue={initialCourse}>
              <option value="">-- Chọn khóa học --</option>
              {COURSE_OPTIONS.map((g) => (
                <optgroup label={g.label} key={g.label}>
                  {g.options.map((o) => (
                    <option value={o.id} key={o.id}>
                      {o.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={CONSULT_ID}>Chưa rõ, cần tư vấn</option>
            </select>
          </label>
          <label>
            Ca học
            <select name="shift" defaultValue="">
              <option value="">-- Chọn ca học --</option>
              {SHIFTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Cơ sở muốn học
          <select name="branch" defaultValue="">
            <option value="">-- Chọn cơ sở --</option>
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Ghi chú
          <textarea name="note" maxLength={2000} placeholder="Ví dụ: đã học được bao lâu, mục tiêu HSK, thời gian rảnh…" />
        </label>
        <button className="btn pri" type="submit" disabled={sending}>
          {sending ? "Đang xử lý…" : "Gửi đăng ký"}
        </button>
      </form>
    </div>
  );
}
