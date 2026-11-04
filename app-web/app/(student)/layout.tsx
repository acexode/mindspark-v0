import { redirect } from "next/navigation";
import { StudentShell } from "@/components/layout/student-shell";
import type { AcademicSummary } from "@/components/layout/sidebar";
import { getProgramme, getSubject } from "@/lib/content/loader";
import { DRAFTING_COURSE_ID } from "@/lib/domain/drafting/prompt";
import { experienceFor } from "@/lib/domain/student/experience";
import { readProfile } from "@/lib/server/profile/store";

function academicSummaryFor(profile: NonNullable<Awaited<ReturnType<typeof readProfile>>>): AcademicSummary | undefined {
  if (profile.educationLevel !== "undergraduate") return undefined;

  const programme = profile.programmeId ? getProgramme(profile.programmeId) : null;
  const courses = profile.selectedSubjectIds.map((id) => getSubject(id)).filter((s) => s !== null);

  return {
    programmeShortName: programme?.shortName ?? profile.programme ?? "Undergraduate",
    year: profile.classLevel,
    semester: profile.currentSemester ?? 1,
    enrolledCount: courses.length,
    totalUnits: courses.reduce((sum, course) => sum + (course.creditUnits ?? 0), 0),
  };
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const profile = await readProfile();
  if (!profile?.onboarded) redirect("/onboarding");

  const experience = experienceFor(profile);
  // The drafting studio belongs to the AutoCAD course, so only students enrolled in it see it.
  const nav = profile.selectedSubjectIds.includes(DRAFTING_COURSE_ID)
    ? [...experience.nav.slice(0, -2), { href: "/drafting", label: "Drafting", icon: "PencilRuler" }, ...experience.nav.slice(-2)]
    : experience.nav;

  return (
    <StudentShell
      level={profile.educationLevel}
      nav={nav}
      xp={profile.xp}
      streak={profile.streak}
      summary={academicSummaryFor(profile)}
    >
      {children}
    </StudentShell>
  );
}
