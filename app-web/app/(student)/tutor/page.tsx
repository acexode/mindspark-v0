import { getSubject, getSubjects } from "@/lib/content/loader";
import { TutorChat, type TutorScopeOption } from "@/features/tutor/components/tutor-chat";
import { readProfileOrDefault } from "@/lib/server/profile/store";

export const metadata = { title: "Tutor — Mindspark" };

export default async function TutorPage() {
  const profile = await readProfileOrDefault();
  const subjects =
    profile.selectedSubjectIds.length > 0
      ? profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null)
      : getSubjects(profile.educationLevel);

  const scopes: TutorScopeOption[] = subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.subtopics.map((subtopic) => ({
        subtopicId: subtopic.id,
        subjectName: subject.name,
        groupLabel: `${subject.courseCode ?? subject.name} · ${topic.name}`,
        label: subtopic.name,
      })),
    ),
  );

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Tutor</span>
          <h1>Ask about anything you are studying</h1>
          <p>Grounded in your lesson content, across every subject.</p>
        </div>
      </header>
      <TutorChat scopes={scopes} />
    </section>
  );
}
