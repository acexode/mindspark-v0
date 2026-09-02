import Link from "next/link";
import type { Route } from "next";
import { catalogueCourses } from "@/lib/content/courses";
import { subjectHref } from "@/lib/content/navigation";
import { addSubject } from "@/features/learning/server/actions";
import type { StudentProfile } from "@/lib/domain/student/types";
import { courseCompletion, relativeStudyLabel } from "../lib/course-stats";

export function CourseCatalogue({ profile }: { profile: StudentProfile }) {
  const courses = catalogueCourses(profile.classLevel, profile.programmeId);
  const enrolled = courses.filter((c) => profile.selectedSubjectIds.includes(c.subject.id));
  const available = courses.filter((c) => !profile.selectedSubjectIds.includes(c.subject.id));
  const totalUnits = enrolled.reduce((sum, c) => sum + (c.subject.creditUnits ?? 0), 0);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Courses</span>
          <h1>Course catalogue</h1>
          <p>Every course on the programme, whichever year it belongs to — enrol in what you are taking.</p>
        </div>
      </header>

      <section className="home-subjects">
        <h2>
          Enrolled <span className="picker-count">{enrolled.length} course{enrolled.length === 1 ? "" : "s"} · {totalUnits} unit{totalUnits === 1 ? "" : "s"}</span>
        </h2>
        {enrolled.length === 0 ? (
          <p className="topic-meta">You are not enrolled in any course yet — enrol below.</p>
        ) : (
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
              {enrolled.map(({ subject }) => {
                const completion = courseCompletion(subject, profile.mastery);
                return (
                  <tr key={subject.id} style={{ ["--row-accent" as string]: subject.accentColor }}>
                    <td className="course-title">
                      <Link href={subjectHref(subject) as Route}>
                        {subject.courseCode ? `${subject.courseCode} · ` : ""}
                        {subject.name}
                      </Link>
                    </td>
                    <td className="tabular-nums">{subject.creditUnits ?? "—"}</td>
                    <td className="tabular-nums">{completion.percent}%</td>
                    <td>{relativeStudyLabel(profile.lastStudiedAt[subject.id])}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {available.length > 0 && (
        <section className="home-subjects">
          <h2>Available</h2>
          <table className="course-table is-muted">
            <thead>
              <tr>
                <th>Course</th>
                <th>Units</th>
                <th>Year</th>
                <th aria-hidden />
              </tr>
            </thead>
            <tbody>
              {available.map(({ subject, year, yearOffset }) => (
                <tr key={subject.id} style={{ ["--row-accent" as string]: subject.accentColor }}>
                  <td className="course-title">
                    <Link href={subjectHref(subject) as Route}>
                      {subject.courseCode ? `${subject.courseCode} · ` : ""}
                      {subject.name}
                    </Link>
                  </td>
                  <td className="tabular-nums">{subject.creditUnits ?? "—"}</td>
                  <td>
                    {year ?? "—"}
                    {yearOffset > 0 ? " · ahead of your year" : yearOffset < 0 ? " · earlier year" : ""}
                  </td>
                  <td>
                    <form action={addSubject.bind(null, subject.id)}>
                      <button type="submit" className="secondary-action">
                        Enrol
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
}
