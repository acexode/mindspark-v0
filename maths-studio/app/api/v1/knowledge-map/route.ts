import { NextResponse } from "next/server";
import { buildKnowledgeMap } from "@/lib/domain/knowledge-graph/graph";
import { getServerProfile } from "@/features/learning/server/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId") ?? "algebra";
  const profile = await getServerProfile();

  const masteryByConcept: Record<string, number> = {
    "number-sense": 90,
    "algebra-basics": 85,
    "linear-equations": profile?.linearEquationsMastery ?? 34,
    "simultaneous-equations": 0,
  };

  const map = buildKnowledgeMap(subjectId, masteryByConcept, "linear-equations");
  return NextResponse.json({ nodes: map });
}
