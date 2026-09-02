import { NextResponse } from "next/server";
import { getLesson, getQuestions, idSlug, resolveSubjectSlug } from "@/lib/content/loader";
import { aggregateMastery, getRecord, isUnlocked, lockReason } from "@/lib/domain/mastery/mastery";
import { progressionContextFor, subjectProgression } from "@/lib/content/topic-progress";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await readProfileOrDefault();
  const subject = resolveSubjectSlug(slug, profile.educationLevel);
  if (!subject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  const progression = subjectProgression(subject, progressionContextFor(profile));
  const nameById = new Map(
    subject.topics.flatMap((t) => t.subtopics.map((s) => [s.id, s.name] as const)),
  );

  const topics = progression.subject.topics.map((topic) => {
    const topicUnlocked = progression.isUnlocked(topic.id);
    return {
      id: topic.id,
      slug: idSlug(topic.id),
      name: topic.name,
      summary: topic.summary,
      classLevels: topic.classLevels,
      mastery: aggregateMastery(profile.mastery, topic.subtopics.map((s) => s.id)),
      unlocked: topicUnlocked,
      lockReason: topicUnlocked ? null : progression.lockReason(topic.id),
      practiceBest: progression.practiceBest[topic.id] ?? 0,
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
          unlocked: topicUnlocked && isUnlocked(profile.mastery, subtopic.prerequisites),
          lockReason: topicUnlocked
            ? lockReason(profile.mastery, subtopic.prerequisites, (id) => nameById.get(id) ?? id)
            : progression.lockReason(topic.id),
        };
      }),
    };
  });

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
