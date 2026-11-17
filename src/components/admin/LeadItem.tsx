"use client";

import { useActionState, useTransition } from "react";
import { deleteLeadAction, updateLeadAction, type ActionState } from "@/app/quan-tri/actions";

type LeadStatus = "new" | "contacted" | "enrolled" | "closed";
const LABEL: Record<LeadStatus, string> = { new: "Mới", contacted: "Đã liên hệ", enrolled: "Đã đăng ký học", closed: "Không tiếp tục" };

export type LeadView = {
  id: number;
  full_name: string;
  phone: string;
  birth: string;
  address: string;
  courseName: string;
  shift: string;
  branch: string;
  note: string;
  source: string;
  status: LeadStatus;
  assignee_id: number | null;
  assignee_name?: string | null;
  staff_note: string;
  created: string;
  updated: string;
};

export function LeadItem({ lead, staff, canDelete }: { lead: LeadView; staff: { id: number; name: string }[]; canDelete: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateLeadAction, {});
  const [deleting, startDelete] = useTransition();
  const tel = lead.phone.replace(/[^\d+]/g, "");
  const zalo = tel.replace(/^\+84/, "0");

  return (
    <details className="lead">
      <summary>
        <span>
          <b>{lead.full_name}</b>
          <div className="muted">{lead.phone}</div>
        </span>
        <span className="hide-sm">{lead.courseName || "—"}</span>
        <span className="hide-sm muted">
          {lead.created}
          {lead.assignee_name ? ` · ${lead.assignee_name}` : ""}
        </span>
        <span className={`pill ${lead.status}`}>{LABEL[lead.status]}</span>
        <span className="muted" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="body">
        <div>
          <dl className="kv">
            <dt>Điện thoại</dt>
            <dd>
              <a href={`tel:${tel}`}>{lead.phone}</a> · <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener">Zalo</a>
            </dd>
            {lead.birth && (
              <>
                <dt>Ngày sinh</dt>
                <dd>{lead.birth}</dd>
              </>
            )}
            {lead.address && (
              <>
                <dt>Địa chỉ</dt>
                <dd>{lead.address}</dd>
              </>
            )}
            <dt>Khóa học</dt>
            <dd>{lead.courseName || "—"}</dd>
            {lead.shift && (
              <>
                <dt>Ca học</dt>
                <dd>{lead.shift}</dd>
              </>
            )}
            {lead.branch && (
              <>
                <dt>Cơ sở</dt>
                <dd>{lead.branch}</dd>
              </>
            )}
            {lead.note && (
              <>
                <dt>Ghi chú</dt>
                <dd style={{ whiteSpace: "pre-wrap" }}>{lead.note}</dd>
              </>
            )}
            <dt>Gửi lúc</dt>
            <dd>{lead.created}</dd>
          </dl>
        </div>
        <form action={action}>
          <input type="hidden" name="id" value={lead.id} />
          <div className="cols2">
            <label className="f">
              <span>Trạng thái</span>
              <select name="status" defaultValue={lead.status}>
                {(Object.keys(LABEL) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="f">
              <span>Người phụ trách</span>
              <select name="assignee_id" defaultValue={lead.assignee_id ?? ""}>
                <option value="">— Chưa giao —</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="f">
            <span>Ghi chú nội bộ</span>
            <textarea name="staff_note" defaultValue={lead.staff_note} placeholder="Đã gọi lúc…, hẹn test trình độ…" />
          </label>
          {state.error && <div className="flash err">{state.error}</div>}
          {state.ok && <div className="flash ok">{state.message}</div>}
          <div className="row">
            <button className="btn" type="submit" disabled={pending}>
              {pending ? "Đang lưu…" : "Lưu"}
            </button>
            {canDelete && (
              <button
                className="btn danger sm"
                type="button"
                disabled={deleting}
                onClick={() => {
                  if (window.confirm(`Xóa vĩnh viễn đăng ký của ${lead.full_name}?`)) startDelete(() => void deleteLeadAction(lead.id));
                }}
              >
                Xóa
              </button>
            )}
            <span className="muted" style={{ fontSize: 13 }}>
              Cập nhật: {lead.updated}
            </span>
          </div>
        </form>
      </div>
    </details>
  );
}
