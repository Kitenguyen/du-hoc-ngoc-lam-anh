"use client";

import { useActionState } from "react";
import { saveContentAction, type ActionState } from "@/app/quan-tri/actions";
import type SITE from "@/content/site.json";

type Site = typeof SITE;

function Field({ name, label, value, hint, area, type = "text" }: { name: string; label: string; value: string; hint?: string; area?: boolean; type?: string }) {
  return (
    <label className="f">
      <span>
        {label} {hint && <small>– {hint}</small>}
      </span>
      {area ? <textarea name={name} defaultValue={value} /> : <input type={type} name={name} defaultValue={value} />}
    </label>
  );
}

export function ContentForm({ content, sha, courses, readOnly }: { content: Site; sha: string; courses: { id: string; title: string }[]; readOnly: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveContentAction, {});
  const c = content.contact;
  const o = content.offer;
  const fees = content.courseFees as Record<string, string>;
  return (
    <form action={action}>
      <input type="hidden" name="sha" value={sha} />
      <fieldset disabled={readOnly || pending} style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="card">
          <h2>Thông tin liên hệ</h2>
          <p className="muted" style={{ marginTop: -6 }}>Hiện ở đầu trang, chân trang, nút Gọi/Zalo và các form đăng ký.</p>
          <div className="cols2">
            <Field name="phoneLabel" label="Số điện thoại (hiển thị)" value={c.phoneLabel} hint="vd (+84) 81 881 4444" />
            <Field name="phone" label="Số điện thoại (để gọi)" value={c.phone} hint="vd +84818814444" />
            <Field name="zalo" label="Link Zalo" value={c.zalo} type="url" hint="https://zalo.me/…" />
            <Field name="email" label="Email" value={c.email} type="email" />
            <Field name="facebook" label="Facebook" value={c.facebook} type="url" />
            <Field name="hours" label="Giờ học / làm việc" value={c.hours} />
          </div>
          <Field name="address" label="Địa chỉ" value={c.address} />
        </div>

        <div className="card">
          <h2>Ưu đãi du học (trang chủ)</h2>
          <label className="check">
            <input type="checkbox" name="offer_show" defaultChecked={o.show} />
            <span>Hiện khối ưu đãi, huy hiệu và nút “Nhận ưu đãi” trên trang chủ</span>
          </label>
          <div className="cols2">
            <Field name="offer_kicker" label="Nhãn nhỏ" value={o.kicker} />
            <Field name="offer_title" label="Tiêu đề" value={o.title} />
            <Field name="offer_giftLabel" label="Chữ trước giá trị" value={o.giftLabel} />
            <Field name="offer_giftValue" label="Giá trị quà" value={o.giftValue} hint="vd 1 TỶ ĐỒNG" />
            <Field name="offer_badge" label="Chữ trên huy hiệu tròn" value={o.badge} hint="ngắn, vd 1 TỶ" />
          </div>
          <Field name="offer_text" label="Mô tả" value={o.text} area />
          <Field name="offer_terms" label="Điều kiện áp dụng" value={o.terms} area hint="nên ghi rõ thời hạn, đối tượng, nội dung quà" />
        </div>

        <div className="card">
          <h2>Học phí theo khóa</h2>
          <p className="muted" style={{ marginTop: -6 }}>Để trống = hiện “[Học phí]”. Hiện trên thẻ khóa học ở trang chủ.</p>
          <div className="cols2">
            {courses.map((k) => (
              <Field key={k.id} name={`fee_${k.id}`} label={k.title} value={fees[k.id] ?? ""} />
            ))}
          </div>
        </div>
      </fieldset>
      {state.error && <div className="flash err">{state.error}</div>}
      {state.ok && <div className="flash ok">{state.message}</div>}
      {!readOnly && (
        <button className="btn" type="submit" disabled={pending} style={{ marginTop: 14 }}>
          {pending ? "Đang lưu…" : "Lưu nội dung"}
        </button>
      )}
    </form>
  );
}
