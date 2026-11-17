import { MyDictionaryApp } from "./MyDictionaryApp";
import "./tu-dien-cua-toi.css";

/** Trang mẫu là ứng dụng riêng (thanh đỏ trên cùng, không header/footer của site) */
export function TuDienCuaToiPage() {
  return (
    <div className="pg-tu-dien-cua-toi">
      <MyDictionaryApp />
    </div>
  );
}
