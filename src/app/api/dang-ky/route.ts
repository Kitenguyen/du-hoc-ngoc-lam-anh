import { NextResponse, type NextRequest } from "next/server";
import { createLead, type LeadInput } from "@/lib/admin/leads";

/** Form Đăng ký học trên web gửi về đây → lưu vào dashboard (mục Đăng ký học). */
export async function POST(req: NextRequest) {
  let body: Partial<LeadInput> & { website?: string };
  try {
    body = (await req.json()) as Partial<LeadInput> & { website?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }
  // Ô ẩn chống spam: người thật không điền
  if (body.website) return NextResponse.json({ ok: true });
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const r = await createLead(body, ip);
  if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
