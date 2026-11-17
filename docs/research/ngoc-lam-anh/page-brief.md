# Website Du học Ngọc Lâm Anh — tổng quan

Giao diện dựng lại từ https://hoangdatqnhsk.vn/moi/ (28 trang). Nội dung là của Ngọc Lâm Anh
(lấy từ https://tiengtrungchuongmy.com/) hoặc ô giữ chỗ `[...]` để trung tâm điền. Quy ước code: xem `BUILD-GUIDE.md`.

## Các trang
| Nhóm | Route | Thư mục component (`src/components/sites/ngoc-lam-anh/…`) |
|---|---|---|
| Giới thiệu | `/` | `pages/home/` |
| | `/khoa-hoc` | `CoursesPage.tsx`, `CourseCard.tsx` (dữ liệu trong `data.ts`) |
| | `/luyen-thi-d4`, `/khoa-hoc-online` | `pages/luyen-thi-d4/`, `pages/khoa-hoc-online/` |
| Thi thử | `/thi-thu`, `/de-thi`, `/de-thi-d4` | `pages/thi-thu/`, `pages/de-thi/` (đề trong `exams.ts`), `pages/de-thi-d4/` |
| Tài liệu | `/tai-lieu`, `/giao-trinh`, `/giao-trinh-dich-thuat`, `/sach-tieng-trung`, `/video-giang-day`, `/tu-vung-chuyen-nganh`, `/tra-luong-tu` | `pages/<slug>/` |
| Form | `/dang-ky`, `/dang-nhap`, `/reg-tu-van` (màn nhân viên), `/mua-tai-khoan`, `/dk-hoc-sinh` | `pages/<slug>/` |
| Công cụ học | `/tu-vung`, `/tro-choi`, `/luyen-noi` | `pages/<slug>/`, từ vựng HSK chung: `lib/hsk-vocab.ts` |
| Công cụ giáo viên | `/tu-dien`, `/tu-dien-ai`, `/tu-dien-cua-toi`, `/bang-den`, `/bang-word`, `/trinh-chieu` | `pages/<slug>/` |

Dùng chung: `data.ts` (thương hiệu, liên hệ, menu, khóa học), `PageShell.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `site.css`.

## Cần trung tâm điền (tìm chuỗi `[` trong các file sau)
- `data.ts` → `CONTACT`: đã có số điện thoại, địa chỉ; Zalo đang giả định cùng số hotline; còn thiếu email.
- `pages/home/data.ts` → `COURSE_FEES`, `GALLERY`; `TESTIMONIALS` đang là nội dung minh họa (`sample: true`, hiện nhãn "Minh họa") – thay bằng chia sẻ thật.
- `pages/home/du-hoc-data.ts` → thông tin du học (theo tài liệu TƯ VẤN DU HỌC TQ của trung tâm).
- `pages/home/offer-data.ts` → `OFFER.terms`: điều kiện áp dụng, thời hạn, nội dung quà tặng 1 tỷ đồng.
- `pages/luyen-thi-d4/data.ts`, `pages/mua-tai-khoan/data.ts` → giá gói, thời hạn, thông tin chuyển khoản, mã QR.
- `pages/giao-trinh/`, `giao-trinh-dich-thuat/`, `sach-tieng-trung/`, `video-giang-day/`, `tu-vung-chuyen-nganh/`, `tai-lieu/`, `khoa-hoc-online/` `data.ts` → tên và tệp tài liệu, sách, video.
- `pages/luyen-noi/data.ts`, `pages/tu-dien/data.ts` → tệp tài liệu tải về.
- Mở rộng dữ liệu học: `lib/hsk-vocab.ts` (HSK3–6), `pages/de-thi/exams.ts`, `pages/de-thi-d4/exams.ts`, `pages/tu-dien/data.ts`, `pages/trinh-chieu/decks.ts`, `pages/luyen-noi/data.ts`.

## Cần máy chủ (chưa có — các trang hiện thông báo rõ ràng)
Đăng nhập, gửi form đăng ký về trung tâm (hiện chuyển qua Zalo/điện thoại), thanh toán, lưu điểm lên tài khoản,
chấm bài nói HSKK, Từ điển AI, dịch đoạn trong Bảng Word, mở tài liệu/video có phân quyền.
Mỗi trang gom lời gọi máy chủ trong file `api.ts` riêng để nối backend sau.
