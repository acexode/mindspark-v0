"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarBlank,
  ChartBar,
  ChatsCircle,
  Books,
  Exam,
  Gauge,
  GraduationCap,
  PencilSimpleLine,
  Sparkle,
  User,
  type Icon,
} from "@phosphor-icons/react";
import type { NavItem } from "@/lib/domain/student/experience";

const ICONS: Record<string, Icon> = {
  CalendarBlank,
  Books,
  PencilSimpleLine,
  Exam,
  ChatsCircle,
  ChartBar,
  User,
  Gauge,
  GraduationCap,
};

export interface AcademicSummary {
  programmeShortName: string;
  year: string;
  semester: 1 | 2;
  enrolledCount: number;
  totalUnits: number;
}

interface SidebarProps {
  nav: NavItem[];
  xp: number;
  streak: number;
  /** Present only for undergraduates — replaces the XP/streak footer. */
  summary?: AcademicSummary;
}

export function Sidebar({ nav, xp, streak, summary }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/home" className="brand">
        Mind
        <br />
        spark
        <span />
      </Link>
      <nav aria-label="Main">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const Icon = ICONS[icon] ?? CalendarBlank;
          return (
            <Link key={href} href={href} className={active ? "nav-item active" : "nav-item"} aria-current={active ? "page" : undefined}>
              <Icon size={24} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      {summary ? (
        <div className="sidebar-summary">
          <strong>{summary.programmeShortName}</strong>
          <span>
            {summary.year} · Semester {summary.semester}
          </span>
          <span>
            {summary.enrolledCount} course{summary.enrolledCount === 1 ? "" : "s"} · {summary.totalUnits} unit
            {summary.totalUnits === 1 ? "" : "s"}
          </span>
        </div>
      ) : (
        <div className="sidebar-stats">
          <strong>{xp} XP</strong>
          <span>
            <Sparkle size={13} aria-hidden /> {streak} day streak
          </span>
        </div>
      )}
    </aside>
  );
}
