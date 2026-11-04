import { DraftingStudio } from "@/features/drafting/components/drafting-studio";
import { draftingStatus } from "@/lib/server/drafting/python";

export const metadata = { title: "Drafting studio — Mindspark" };
export const dynamic = "force-dynamic";

export default function DraftingPage() {
  const status = draftingStatus();
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">CVE107 · Drafting studio</p>
          <h1>Draw it, then redraw it in AutoCAD</h1>
          <p>
            Describe a drawing or fill in a template. You get a DXF file that opens in AutoCAD, and the AutoCAD commands that draw the
            same thing by hand, so you learn the steps rather than just receiving a file.
          </p>
        </div>
      </header>
      <DraftingStudio status={{ ready: status.ready, problem: status.problem ?? null }} />
    </section>
  );
}
