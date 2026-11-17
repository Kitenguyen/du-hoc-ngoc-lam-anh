import { redirect } from "next/navigation";

// Màn hình tư vấn cũ đã được thay bằng dashboard quản trị (mục Đăng ký học).
export default function Page() {
  redirect("/quan-tri/dang-ky");
}
