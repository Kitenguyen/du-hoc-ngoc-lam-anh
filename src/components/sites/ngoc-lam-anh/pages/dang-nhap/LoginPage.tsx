import { PageHead, PageShell } from "../../PageShell";
import { BRAND, CALL_HREF, PHONE_LABEL, href } from "../../data";
import { LoginForm } from "./LoginForm";
import "./dang-nhap.css";

export function LoginPage({ next }: { next: string }) {
  return (
    <PageShell active="dang-nhap">
      <div className="pg-dang-nhap">
        <PageHead zh="登录" title="Đăng nhập" intro={`Dành cho học viên và giáo viên của ${BRAND.fullName}.`} />
        <section className="block light">
          <div className="wrap two">
            <aside className="card red-card">
              <div className="brush-name">{BRAND.zh}</div>
              <p style={{ marginTop: 10 }}>
                <b>Tài khoản do trung tâm cấp</b>
              </p>
              <ul className="muted">
                <li>
                  <b>Học viên</b>: dùng tên đăng nhập và mật khẩu trung tâm cấp khi nhập học để mở giáo trình, bài kiểm tra, đề thi thử
                  và từ vựng của lớp đã đăng ký.
                </li>
                <li>
                  <b>Giáo viên</b>: dùng tài khoản giáo viên để mở giáo án, tài liệu và đề thi.
                </li>
              </ul>
              <p className="muted">
                Chưa có tài khoản? <a href={href("dang-ky.html")}>Đăng ký học</a> hoặc gọi <a href={CALL_HREF}>{PHONE_LABEL}</a>.
              </p>
            </aside>
            <LoginForm next={next} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
