import { NextResponse } from "next/server";
import { getSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { aggregateMastery, getRecord } from "@/lib/domain/mastery/mastery";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subjectId");
  const profile = await readProfileOrDefault();

  const subjects = subjectId
    ? [getSubject(subjectId)].filter((s) => s !== null)
    : getSubjects().filter((s) => profile.selectedSubjectIds.includes(s.id));

  const tree = subjects.map((subject) => ({
    id: subject.id,
    slug: idSlug(subject.id),
    name: subject.name,
    accentColor: subject.accentColor,
    mastery: aggregateMastery(profile.mastery, subject.topics.flatMap((t) => t.subtopics.map((s) => s.id))),
    topics: subject.topics.map((topic) => ({
      id: topic.id,
      name: topic.name,
      mastery: aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id)),
      subtopics: topic.subtopics.map((subtopic) => {
        const record = getRecord(profile.mastery, subtopic.id);
        return {
          id: subtopic.id,
          name: subtopic.name,
          score: record.score,
          state: record.state,
          evidenceCount: record.evidenceCount,
          lastPractisedAt: record.lastPractisedAt,
        };
      }),
    })),
  }));

  return NextResponse.json({ xp: profile.xp, streak: profile.streak, subjects: tree });
}
