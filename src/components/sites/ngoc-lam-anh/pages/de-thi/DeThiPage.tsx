import { PageShell } from "../../PageShell";
import { DeThiLevel } from "./DeThiLevel";
import "./de-thi.css";

export function DeThiPage({ levelId, examId }: { levelId?: string; examId?: string }) {
  return (
    <PageShell active="thi-thu">
      <div className="pg-de-thi">
        <DeThiLevel key={`${levelId ?? ""}/${examId ?? ""}`} levelId={levelId} examId={examId} />
      </div>
    </PageShell>
  );
}
