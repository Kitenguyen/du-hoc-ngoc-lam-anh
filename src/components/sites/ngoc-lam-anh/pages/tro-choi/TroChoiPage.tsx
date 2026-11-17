import { PageHead, PageShell } from "../../PageShell";
import { ShooterGame } from "./ShooterGame";
import "./tro-choi.css";

export function TroChoiPage() {
  return (
    <PageShell active="tro-choi">
      <div className="pg-tro-choi">
        <PageHead
          zh="汉字射击"
          title="Trò chơi bắn chữ Hán"
          intro="Chữ Hán rơi xuống – gõ phiên âm để bắn. Tốc độ giữ nguyên ở mọi level – luyện hết từ!"
        />
        <ShooterGame />
      </div>
    </PageShell>
  );
}
