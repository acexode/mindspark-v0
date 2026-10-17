import Link from "next/link";
import type { Route } from "next";
import type { SubjectStats } from "@/lib/content/loader";
import type { SubjectOverview } from "@/lib/content/study-overview";
import { TopicTrail } from "@/features/study/components/topic-trail";
import { subjectStateLabel } from "@/features/study/labels";

/** A subject the student studies: where they are in it, not a catalogue blurb. */
export function LibrarySubjectCard({ subject, stats, summary }: { subject: SubjectOverview; stats: SubjectStats; summary: string }) {
  return (
    <Link href={`/library/${subject.slug}` as Route} className="library-card" style={{ ["--accent" as string]: subject.accent }}>
      <div className="library-card-head">
        <h2>{subject.name}</h2>
        <span>{subjectStateLabel(subject)}</span>
      </div>
      <p className="library-card-summary">{summary}</p>
      <p className="library-card-now">
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
      <dl className="library-card-stats">
        <div>
          <dt>Cleared</dt>
          <dd>
            {subject.clearedCount}
            <span>/{subject.topics.length}</span>
          </dd>
        </div>
        <div>
          <dt>Lessons</dt>
          <dd>{stats.lessonCount}</dd>
        </div>
        <div>
          <dt>Questions</dt>
          <dd>{stats.questionCount.toLocaleString("en-NG")}</dd>
        </div>
      </dl>
    </Link>
  );
}

export interface OtherSubject {
  id: string;
  slug: string;
  name: string;
  accent: string;
  summary: string;
  stats: SubjectStats;
}

/**
 * Subjects outside the student's selection, as a plain list at full contrast. They used to
 * render as faded cards, which read as disabled and failed WCAG contrast.
 */
export function OtherSubjectList({ subjects }: { subjects: OtherSubject[] }) {
  return (
    <ul className="library-others">
      {subjects.map((subject) => (
        <li key={subject.id} style={{ ["--accent" as string]: subject.accent }}>
          <Link href={`/library/${subject.slug}` as Route}>
            <strong>{subject.name}</strong>
            <span className="library-others-summary">{subject.summary}</span>
            <small>
              {subject.stats.topicCount} topics · {subject.stats.lessonCount} lessons ·{" "}
              {subject.stats.questionCount.toLocaleString("en-NG")} questions
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Subject descriptions are written as one long sentence ending in the exam boards. The part
 * before " for the Nigerian…" / ", aligned to…" is the useful topic list, so keep only that.
 */
export function shortSummary(description: string): string {
  const cut = description.search(/\s+(for the Nigerian|aligned to)|,\s+aligned to|\s+—\s+aligned to/i);
  const text = (cut > 0 ? description.slice(0, cut) : description).replace(/[.,;:\s]+$/, "");
  return text.length > 140 ? `${text.slice(0, 137).replace(/[,\s]+\S*$/, "")}…` : `${text}.`;
}
