import { getLesson, getQuestions, getSubject, getSubjects, idSlug } from "@/lib/content/loader";
import { filterTopicsForClass } from "@/lib/content/class-visibility";
import { TutorWorkspace } from "@/features/tutor/components/tutor-workspace";
import type { TutorSubjectGroup } from "@/features/tutor/components/tutor-unit-picker";
import { EmptyState } from "@/components/ui/empty-state";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Tutor — Mindspark" };

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ subtopic?: string }>;
}) {
  const { subtopic: requested } = await searchParams;
  const profile = await readProfileOrDefault();
  const subjects =
    profile.selectedSubjectIds.length > 0
      ? profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null)
      : getSubjects(profile.educationLevel);

  const groups: TutorSubjectGroup[] = subjects.map((subject) => {
    const subjectSlug = idSlug(subject.id);
    return {
      id: subject.id,
      label: subject.courseCode ?? subject.name,
      name: subject.name,
      accent: subject.accentColor,
      topics: filterTopicsForClass(subject.topics, profile.classLevel).map((topic) => ({
        id: topic.id,
        name: topic.name,
        units: [...topic.subtopics]
          .sort((a, b) => a.order - b.order)
          .map((subtopic) => {
            const base = `${subjectSlug}/${idSlug(topic.id)}`;
            return {
              id: subtopic.id,
              name: subtopic.name,
              objectives: subtopic.objectives.map((o) => o.text),
              lessonHref: getLesson(subtopic.id) ? `/learn/${base}/${idSlug(subtopic.id)}` : null,
              practiceHref: getQuestions(subtopic.id).length > 0 ? `/practice/${base}?subtopic=${idSlug(subtopic.id)}` : null,
            };
          }),
      })),
    };
  });

  const unitIds = new Set(groups.flatMap((g) => g.topics.flatMap((t) => t.units.map((u) => u.id))));
  if (unitIds.size === 0) {
    return (
      <section className="page">
        <EmptyState
          title="Nothing to ask about yet"
          description="Add a subject to your profile and the tutor will be ready to help with it."
          actionLabel="Go to the library"
          actionHref="/library"
        />
      </section>
    );
  }

  // Open on what the student asked for, else where they last studied, else the first unit.
  const lastVisited = Object.values(profile.lastVisited).find((id) => unitIds.has(id));
  const initialUnitId =
    (requested && unitIds.has(requested) ? requested : undefined) ?? lastVisited ?? unitIds.values().next().value!;

  return (
    <section className="page tutor-page">
      <TutorWorkspace subjects={groups} initialUnitId={initialUnitId} />
    </section>
  );
}
