import { BangWord } from "./BangWord";
import "./bang-word.css";

/** Ứng dụng riêng (trang mẫu không có header/footer) */
export function BangWordPage() {
  return (
    <div className="pg-bang-word">
      <BangWord />
    </div>
  );
}
