import Link from "next/link";
import type { Route } from "next";
import type { SubjectOverview } from "@/lib/content/study-overview";
import { TopicTrail } from "@/features/study/components/topic-trail";
import { subjectStateLabel } from "@/features/study/labels";

/** One row per subject: where the student is, how far along, and the two ways forward. */
export function SubjectRows({ subjects }: { subjects: SubjectOverview[] }) {
  return (
    <ul className="subject-rows">
      {subjects.map((subject) => (
        <li key={subject.id} className="subject-row" style={{ ["--accent" as string]: subject.accent }}>
          <div className="subject-row-head">
            <h3>
              <Link href={`/library/${subject.slug}` as Route}>{subject.name}</Link>
            </h3>
            <span className="subject-row-score">
              {subject.practisedSubtopicCount > 0 ? `${subject.mastery.score}% · ` : ""}
              {subjectStateLabel(subject)}
            </span>
          </div>

          <p className="subject-row-now">
            {subject.current ? (
              <>
                <span>Now</span> {subject.current.name}
              </>
            ) : (
              <>
                <span>Done</span> Every topic cleared
              </>
            )}
          </p>

          <TopicTrail topics={subject.topics} label={`${subject.name} topics`} />

          <div className="subject-row-foot">
            <span>
              {subject.clearedCount} of {subject.topics.length} topics cleared · {subject.answeredCount} questions answered
            </span>
            <span className="subject-row-actions">
              {subject.continueUnit && (
                <Link href={subject.continueUnit.href as Route}>Continue lesson</Link>
              )}
              {subject.current &&
                (subject.current.coveredSubtopicCount > 0 && subject.current.questionCount > 0 ? (
                  <Link href={subject.current.practiceHref as Route}>Practise</Link>
                ) : (
                  !subject.continueUnit && <Link href={subject.current.libraryHref as Route}>Start topic</Link>
                ))}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
