import { PageHead, PageShell } from "../../PageShell";
import { D4App } from "./D4App";
import { D4_HEAD } from "./data";
import "./luyen-thi-d4.css";

export function D4Page() {
  return (
    <PageShell active="luyen-thi-d4">
      <div className="pg-luyen-thi-d4">
        <PageHead zh={D4_HEAD.zh} title={D4_HEAD.title} intro={D4_HEAD.intro} />
        <D4App />
      </div>
    </PageShell>
  );
}
