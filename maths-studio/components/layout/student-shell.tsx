import type { ReactNode } from "react";
import type { StudentProfile } from "@/lib/domain/student/types";
import { Sidebar } from "./sidebar";

interface StudentShellProps {
  children: ReactNode;
  profile: StudentProfile;
  lessonMode?: boolean;
}

export function StudentShell({ children, profile, lessonMode = false }: StudentShellProps) {
  return (
    <main className={`app-shell ${lessonMode ? "lesson-mode" : "page-mode"}`}>
      <Sidebar profile={profile} />
      {children}
    </main>
  );
}
