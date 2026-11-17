import { BRAND, CONTACT, COURSE_GROUPS } from "../../data";

export const PAGE = {
  zh: "报名",
  title: "Đăng ký học",
  intro: "Điền thông tin, trung tâm sẽ gọi lại tư vấn trong thời gian sớm nhất.",
};

/** Lợi ích khi đăng ký — lấy từ thông tin chung của trung tâm (data.ts › GENERAL_INFO). */
export const BENEFITS = ["Test trình độ và học thử miễn phí", "Lớp 8 – 12 học viên, giáo viên theo sát", "Xếp lớp phù hợp lịch học"];

export const CONSULT_ID = "tu-van";

export type CourseOption = { id: string; label: string; value: string };
export type CourseOptGroup = { label: string; options: CourseOption[] };

/** Danh sách khóa học cho ô chọn, dựng từ COURSE_GROUPS (id dùng cho ?khoa=<id>). */
export const COURSE_OPTIONS: CourseOptGroup[] = COURSE_GROUPS.map((g) => ({
  label: g.title,
  options: g.courses.map((c) => ({
    id: c.id,
    value: c.title,
    label: g.id !== "du-hoc" && c.months && c.sessions ? `${c.title} (${c.months} · ${c.sessions})` : c.title,
  })),
}));

export function courseTitle(id: string): string {
  if (id === CONSULT_ID) return "Chưa rõ, cần tư vấn lộ trình";
  for (const g of COURSE_OPTIONS) for (const o of g.options) if (o.id === id) return o.value;
  return "";
}

export function isCourseId(id: string): boolean {
  return id === CONSULT_ID || courseTitle(id) !== "";
}

export const SHIFTS = ["Ca sáng", "Ca chiều", "Ca tối", "Linh hoạt / tư vấn sau"];

/** Cơ sở học — trung tâm sửa địa chỉ trong data.ts › CONTACT.address */
export const BRANCHES = [`Học trực tiếp tại cơ sở: ${CONTACT.address}`, "Học online"];

export const SUMMARY_TITLE = `ĐĂNG KÝ HỌC – ${BRAND.fullName}`;
export const DRAFT_KEY = "nla-dang-ky-draft";
