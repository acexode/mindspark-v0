import { NextResponse } from "next/server";
import { getHomeRecommendation } from "@/lib/domain/recommendations/get-home-recommendation";
import { getServerProfile } from "@/features/learning/server/actions";

export async function GET() {
  const profile = await getServerProfile();
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const recommendation = getHomeRecommendation({
    preferredName: profile.preferredName,
    lessonComplete: profile.lessonComplete,
    linearEquationsMastery: profile.linearEquationsMastery,
    practiceCorrect: profile.practiceCorrect,
    diagnosticScore: profile.diagnosticScore,
    weakConcepts: [],
    retentionDue: profile.linearEquationsMastery >= 80 ? ["linear-equations"] : [],
  });

  return NextResponse.json(recommendation);
}
