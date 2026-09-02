import Link from "next/link";
import type { Route } from "next";
import { getSubject, getSubtopic } from "@/lib/content/loader";
import { learnHref, practiceHref, subjectHref } from "@/lib/content/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import type { StudentProfile } from "@/lib/domain/student/types";
import { courseCompletion, relativeStudyLabel, weakUnits } from "../lib/course-stats";

export function UndergradDashboard({ profile }: { profile: StudentProfile }) {
  const courses = profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null);

  if (courses.length === 0) {
    return (
      <section className="page">
        <header className="page-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>{profile.preferredName ? `Welcome, ${profile.preferredName}.` : "Welcome."}</h1>
          </div>
        </header>
        <EmptyState
          title="Enrol in your first course"
          description="Pick the courses on your programme and we will build your semester worklist."
          actionLabel="Browse courses"
          actionHref="/library"
        />
      </section>
    );
  }

  const totalUnits = courses.reduce((sum, c) => sum + (c.creditUnits ?? 0), 0);

  let continueCourseId: string | null = null;
  let latest = 0;
  for (const course of courses) {
    const stamp = profile.lastStudiedAt[course.id];
    if (stamp && new Date(stamp).getTime() > latest) {
      latest = new Date(stamp).getTime();
      continueCourseId = course.id;
    }
  }
  const continueSubtopicId = continueCourseId ? profile.lastVisited[continueCourseId] : undefined;
  const continueEntry = continueSubtopicId ? getSubtopic(continueSubtopicId) : null;

  const weak = weakUnits(courses, profile.mastery, practiceHref);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">
            Semester {profile.currentSemester ?? 1} · {profile.classLevel}
            {profile.programme ? ` · ${profile.programme}` : ""}
          </span>
          <h1>{profile.preferredName ? `Welcome back, ${profile.preferredName}.` : "Welcome back."}</h1>
        </div>
      </header>

      {continueEntry && (
        <section className="home-subjects">
          <h2>Continue where you left off</h2>
          <Link
            href={learnHref(continueEntry.subject, continueEntry.topic, continueEntry.subtopic) as Route}
            className="recommendation-card"
            style={{ ["--accent" as string]: continueEntry.subject.accentColor }}
          >
            <span className="card-kicker">
              {continueEntry.subject.courseCode ?? continueEntry.subject.shortName} · {continueEntry.topic.name}
            </span>
            <h2>{continueEntry.subtopic.name}</h2>
          </Link>
        </section>
      )}

      <section className="home-subjects">
        <h2>
          This semester <span className="picker-count">{courses.length} course{courses.length === 1 ? "" : "s"} · {totalUnits} unit{totalUnits === 1 ? "" : "s"}</span>
        </h2>
        <table className="course-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Units</th>
              <th>Completion</th>
              <th>Last studied</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const completion = courseCompletion(course, profile.mastery);
              return (
                <tr key={course.id} style={{ ["--row-accent" as string]: course.accentColor }}>
                  <td className="course-title">
                    <Link href={subjectHref(course) as Route}>
                      {course.courseCode ? `${course.courseCode} · ` : ""}
                      {course.name}
                    </Link>
                  </td>
                  <td className="tabular-nums">{course.creditUnits ?? "—"}</td>
                  <td className="tabular-nums">{completion.percent}%</td>
                  <td>{relativeStudyLabel(profile.lastStudiedAt[course.id])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {weak.length > 0 && (
        <section className="home-subjects">
          <h2>Needs attention</h2>
          <div className="home-subject-grid">
            {weak.map((unit) => (
              <Link key={unit.subtopicId} href={unit.practiceHref as Route} className="home-subject-card">
                <h3>{unit.subtopicName}</h3>
                <span>
                  {unit.courseLabel} · {unit.score}%
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
