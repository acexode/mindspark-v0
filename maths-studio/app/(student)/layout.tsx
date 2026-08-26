import { StudentShell } from "@/components/layout/student-shell";
import { getServerProfile } from "@/features/learning/server/actions";
import { DEFAULT_STUDENT_PROFILE } from "@/lib/domain/student/types";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const profile = (await getServerProfile()) ?? DEFAULT_STUDENT_PROFILE;
  return <StudentShell profile={profile}>{children}</StudentShell>;
}
