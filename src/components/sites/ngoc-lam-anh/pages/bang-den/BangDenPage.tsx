import { Blackboard } from "./Blackboard";
import "./bang-den.css";

/** Ứng dụng toàn màn hình (trang mẫu không có header/footer) */
export function BangDenPage() {
  return (
    <div className="pg-bang-den">
      <Blackboard />
    </div>
  );
}
