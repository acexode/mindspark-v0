import { NextResponse } from "next/server";
import { getSubject } from "@/lib/content/loader";
import { buildCandidates } from "@/lib/content/navigation";
import { subjectProgression } from "@/lib/content/topic-progress";
import { recommendNext } from "@/lib/domain/recommendations/recommend";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET() {
  const profile = await readProfileOrDefault();
  const subjects = profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null);
  const unlockedTopicIds = new Set(
    subjects.flatMap((subject) => [
      ...subjectProgression(subject, profile.classLevel, profile.mastery, profile.topicPracticeBest).unlockedTopicIds,
    ]),
  );
  const candidates = buildCandidates(profile.selectedSubjectIds, profile.classLevel).filter((candidate) =>
    unlockedTopicIds.has(candidate.topicId),
  );
  const recommendation = recommendNext(candidates, profile.mastery);

  if (!recommendation) {
    return NextResponse.json({ recommendation: null, reason: "No subjects selected yet" });
  }

  return NextResponse.json({ recommendation });
}
