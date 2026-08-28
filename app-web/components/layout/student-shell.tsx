import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface StudentShellProps {
  children: ReactNode;
  xp: number;
  streak: number;
  lessonMode?: boolean;
}

export function StudentShell({ children, xp, streak, lessonMode = false }: StudentShellProps) {
  return (
    <div className={`app-shell ${lessonMode ? "lesson-mode" : "page-mode"}`}>
      <Sidebar xp={xp} streak={streak} />
      <main className="app-main">{children}</main>
    </div>
  );
}
