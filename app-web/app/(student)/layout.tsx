import { redirect } from "next/navigation";
import { StudentShell } from "@/components/layout/student-shell";
import { readProfile } from "@/lib/server/profile/store";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const profile = await readProfile();
  if (!profile?.onboarded) redirect("/onboarding");

  return (
    <StudentShell xp={profile.xp} streak={profile.streak}>
      {children}
    </StudentShell>
  );
}
