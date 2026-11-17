# Hướng dẫn đăng tin tức (Blog) cho Du học Ngọc Lâm Anh

Trang **Tin tức** (`/blog`) trên web tự lấy bài từ **Blogger** – nền tảng blog miễn phí của Google.
Trung tâm đăng bài bằng tài khoản Google của mình, không cần sửa code, không cần đăng nhập vào web.

## 1. Tạo blog (làm một lần)
1. Đăng nhập tài khoản Google của trung tâm, vào https://www.blogger.com → **Tạo blog**.
2. Đặt tên (ví dụ "Du học Ngọc Lâm Anh") và địa chỉ, ví dụ `duhocngoclamanh.blogspot.com`.
3. Vào **Cài đặt**:
   - **Quyền riêng tư → Hiển thị với công cụ tìm kiếm**: bật.
   - **Nguồn cấp dữ liệu trang web → Cho phép nguồn cấp dữ liệu blog**: chọn **Đầy đủ** (để web lấy được toàn bài).
4. Gửi địa chỉ blog cho người quản lý web. Họ điền vào `src/components/sites/ngoc-lam-anh/data.ts`:
   ```ts
   export const BLOG = {
     bloggerUrl: "https://duhocngoclamanh.blogspot.com",
     perPage: 9,
   };
   ```
   rồi commit và đẩy lên GitHub (Cloudflare tự cập nhật).

## 2. Đăng bài
1. Vào blogger.com → **Bài đăng mới**.
2. Viết tiêu đề, nội dung, chèn ảnh (ảnh đầu tiên sẽ làm ảnh đại diện trên trang Tin tức).
3. Ô **Nhãn** bên phải: gắn chủ đề như `Du học`, `Học bổng`, `Khai giảng`, `HSK` – web hiện nút lọc theo nhãn.
4. Bấm **Xuất bản**. Bài hiện ngay trên trang `/blog` của web (không cần build lại).

Có thể nhờ thêm người cùng đăng bài: **Cài đặt → Quyền → Tác giả của blog → Mời thêm tác giả** (dùng email Google của họ).

## 3. Lưu ý
- Sửa hoặc xóa bài trên Blogger thì web cũng đổi theo.
- Video YouTube, Google Maps, Google Drive chèn trong bài vẫn hiển thị; các đoạn mã script khác bị lọc bỏ để an toàn.
- Bài ở chế độ **Bản nháp** hoặc blog ở chế độ riêng tư sẽ không hiện trên web.
