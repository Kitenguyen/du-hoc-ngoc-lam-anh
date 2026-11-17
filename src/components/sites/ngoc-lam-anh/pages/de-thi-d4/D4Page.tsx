import { PageShell } from "../../PageShell";
import { D4App } from "./D4App";
import "./de-thi-d4.css";

export function D4Page({ id, giai }: { id?: string; giai?: boolean }) {
  return (
    <PageShell active="luyen-thi-d4">
      <div className="pg-de-thi-d4">
        <D4App key={`${id ?? ""}/${giai ? 1 : 0}`} id={id} giai={giai} />
      </div>
    </PageShell>
  );
}
