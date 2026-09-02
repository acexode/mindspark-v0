import { redirect } from "next/navigation";
import { StudentShell } from "@/components/layout/student-shell";
import type { AcademicSummary } from "@/components/layout/sidebar";
import { getProgramme, getSubject } from "@/lib/content/loader";
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

  return (
    <StudentShell
      level={profile.educationLevel}
      nav={experience.nav}
      xp={profile.xp}
      streak={profile.streak}
      summary={academicSummaryFor(profile)}
    >
      {children}
    </StudentShell>
  );
}
