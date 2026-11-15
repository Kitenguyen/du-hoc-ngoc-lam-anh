# Tiếng Trung Ngọc Lâm Anh — trang Khóa học

## Route
| Local | File |
|---|---|
| `/khoa-hoc` | `src/app/khoa-hoc/page.tsx` → `src/components/sites/ngoc-lam-anh/CoursesPage.tsx` |
| `/` → chuyển hướng tới `/khoa-hoc` | `src/app/page.tsx` |

## Nguồn
- **Giao diện:** dựng lại từ https://hoangdatqnhsk.vn/moi/khoa-hoc.html (CSS gốc ở `site.css`, thêm vài rule cho logo NLA ở cuối file).
- **Nội dung:** lấy từ https://tiengtrungchuongmy.com/ (trang chủ, `/tieng-trung-giao-tiep/`, `/luyen-thi-hsk/`, `/ytc-cap-1-nguoi-moi/`, `/ytc-cap-2/`, `/du-hoc/`). Tất cả nằm trong `data.ts`.
- **Logo:** ảnh NLA người dùng cung cấp → `public/sites/ngoc-lam-anh/logo-original.png` (gốc), `logo-mark.png` (256×256, cắt bỏ slogan, dùng ở header/favicon), `logo.png` (800×540, có slogan, dùng ở chân trang).

## Còn thiếu / cần người dùng điền
- `CONTACT.phone`, `CONTACT.zalo`, `CONTACT.email`, `CONTACT.address` trong `data.ts`: trang tiengtrungchuongmy.com không công bố. Khi trống, nút Gọi/Zalo dẫn tới Facebook.
- `BRAND.zh` = 玉林英汉语 là tên chữ Hán tự đặt (Ngọc 玉, Lâm 林, Anh 英) — đổi nếu trung tâm dùng tên khác.
- Trang nguồn không công bố thời lượng các khóa HSK 0–3 / 0–4 / 0–5 và YTC cấp 2 nên các thẻ đó không ghi số buổi.
- Các mục menu khác (Trang chủ, Thư viện, Tin tức, Liên hệ, Đội ngũ giáo viên) đang dẫn sang tiengtrungchuongmy.com.
- Link "Du học Đài Loan" trên trang nguồn trỏ nhầm sang mục phần mềm/app nên không đưa vào menu.
