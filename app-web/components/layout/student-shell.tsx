import type { ReactNode } from "react";
import { Sidebar, type AcademicSummary } from "./sidebar";
import type { NavItem } from "@/lib/domain/student/experience";
import type { EducationLevel } from "@/lib/domain/student/types";

interface StudentShellProps {
  children: ReactNode;
  level: EducationLevel;
  nav: NavItem[];
  xp: number;
  streak: number;
  /** Present only for undergraduates — replaces the sidebar's XP/streak footer. */
  summary?: AcademicSummary;
}

export function StudentShell({ children, level, nav, xp, streak, summary }: StudentShellProps) {
  return (
    <div className="app-shell" data-level={level}>
      <Sidebar nav={nav} xp={xp} streak={streak} summary={summary} />
      <main className="app-main">{children}</main>
    </div>
  );
}
