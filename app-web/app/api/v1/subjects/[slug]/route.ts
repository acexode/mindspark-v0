import { NextResponse } from "next/server";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug } from "@/lib/content/loader";
import { aggregateMastery, getRecord, isUnlocked, lockReason } from "@/lib/domain/mastery/mastery";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const subject = resolveSubjectSlug(slug);
  if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  const profile = await readProfileOrDefault();
  const nameById = new Map(
    subject.topics.flatMap((t) => t.subtopics.map((s) => [s.id, s.name] as const)),
  );

  const topics = subject.topics.map((topic) => ({
    id: topic.id,
    slug: idSlug(topic.id),
    name: topic.name,
    summary: topic.summary,
    classLevels: topic.classLevels,
    mastery: aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id)),
    subtopics: topic.subtopics.map((subtopic) => {
      const record = getRecord(profile.mastery, subtopic.id);
      return {
        id: subtopic.id,
        slug: idSlug(subtopic.id),
        name: subtopic.name,
        summary: subtopic.summary,
        objectives: subtopic.objectives,
        hasLesson: Boolean(getLesson(subtopic.id)),
        questionCount: getQuestions(subtopic.id).length,
        mastery: { score: record.score, state: record.state },
        unlocked: isUnlocked(profile.mastery, subtopic.prerequisites),
        lockReason: lockReason(profile.mastery, subtopic.prerequisites, (id) => nameById.get(id) ?? id),
      };
    }),
  }));

  return NextResponse.json({
    subject: {
      id: subject.id,
      slug: idSlug(subject.id),
      name: subject.name,
      description: subject.description,
      accentColor: subject.accentColor,
      icon: subject.icon,
      curricula: subject.curricula,
    },
    topics,
  });
}
