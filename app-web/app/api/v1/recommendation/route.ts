import { NextResponse } from "next/server";
import { buildCandidates } from "@/lib/content/navigation";
import { recommendNext } from "@/lib/domain/recommendations/recommend";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET() {
  const profile = await readProfileOrDefault();
  const candidates = buildCandidates(profile.selectedSubjectIds);
  const recommendation = recommendNext(candidates, profile.mastery);

  if (!recommendation) {
    return NextResponse.json({ recommendation: null, reason: "No subjects selected yet" });
  }

  return NextResponse.json({ recommendation });
}
