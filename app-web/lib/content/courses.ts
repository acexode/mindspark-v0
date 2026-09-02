import { getSubjects } from "./loader";
import { filterSubjectForClass } from "./class-visibility";
import type { ClassLevel, Subject } from "./schema";

const YEARS: ClassLevel[] = ["Year1", "Year2", "Year3", "Year4"];

export interface CatalogueCourse {
  subject: Subject;
  /** Earliest year this course's content is taught, from its topics. */
  year: ClassLevel | null;
  /** Negative = earlier than the student's year, positive = ahead of it. */
  yearOffset: number;
  /** True when the course sits at or before the student's own year. */
  atOrBeforeYear: boolean;
}

function yearIndex(level: string): number {
  return YEARS.indexOf(level as ClassLevel);
}

/** The earliest year any of a course's topics is taught. */
export function courseYear(subject: Subject): ClassLevel | null {
  const indices = subject.topics
    .flatMap((topic) => topic.classLevels)
    .map((level) => yearIndex(level))
    .filter((index) => index >= 0);
  if (indices.length === 0) return null;
  return YEARS[Math.min(...indices)] ?? null;
}

/**
 * The undergraduate catalogue is open: every course is returned, annotated with
 * how it sits relative to the student's year, so the UI can say "ahead of your
 * year" instead of hiding it.
 *
 * This is deliberately not `filterSubjectsForClass`. That function implements
 * the JSS/SS band rule — a student sees their class and earlier ones only — which
 * is right for secondary school and wrong for a university student revising a
 * later course or retaking an earlier one.
 */
export function catalogueCourses(studentYear: string, programmeId?: string): CatalogueCourse[] {
  const studentIndex = yearIndex(studentYear);

  return getSubjects("undergraduate")
    .filter((subject) => {
      /**
       * Year is never a filter, but programme is: a civil engineering student
       * has no reason to be offered a computer science course for enrolment.
       * A profile with no programme (legacy or mid-onboarding) sees everything.
       */
      if (!programmeId) return true;
      return (subject.programmes ?? []).includes(programmeId);
    })
    .map((subject) => {
      const year = courseYear(subject);
      const index = year ? yearIndex(year) : -1;
      const yearOffset = studentIndex >= 0 && index >= 0 ? index - studentIndex : 0;
      return { subject, year, yearOffset, atOrBeforeYear: yearOffset <= 0 };
    })
    .sort((a, b) => {
      const byYear = (a.year ? yearIndex(a.year) : 99) - (b.year ? yearIndex(b.year) : 99);
      return byYear !== 0 ? byYear : a.subject.name.localeCompare(b.subject.name);
    });
}

/**
 * Undergraduate course content is never year-filtered — a student who opens a
 * later course must see all of it. Secondary keeps the band rule.
 */
export function scopeSubjectForStudent(
  subject: Subject,
  classLevel: string,
  educationLevel: "secondary" | "undergraduate",
): Subject {
  return educationLevel === "undergraduate" ? subject : filterSubjectForClass(subject, classLevel);
}
