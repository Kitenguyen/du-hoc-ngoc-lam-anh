import { Player } from "./Player";
import "./trinh-chieu.css";

/** Ứng dụng trình chiếu toàn màn hình (trang mẫu không có header/footer) */
export function TrinhChieuPage() {
  return (
    <div className="pg-trinh-chieu">
      <Player />
    </div>
  );
}
