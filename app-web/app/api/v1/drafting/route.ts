import { NextResponse, type NextRequest } from "next/server";
import { draftingRequestSchema } from "@/lib/domain/drafting/request";
import { generateDrawing } from "@/lib/server/drafting/generate";
import { draftingStatus } from "@/lib/server/drafting/python";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = draftingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, stage: "input", error: parsed.error.issues[0]?.message ?? "invalid request" }, { status: 400 });
  }
  const status = draftingStatus();
  if (!status.ready) return NextResponse.json({ ok: false, stage: "setup", error: status.problem ?? "no-python" }, { status: 503 });

  const outcome = await generateDrawing(parsed.data);
  return NextResponse.json(outcome, { status: outcome.ok ? 200 : 422 });
}
