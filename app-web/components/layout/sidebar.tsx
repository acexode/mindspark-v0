"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarBlank,
  ChartBar,
  ChatsCircle,
  Books,
  Exam,
  PencilSimpleLine,
  Sparkle,
} from "@phosphor-icons/react";

const navItems = [
  { href: "/home", label: "Today", icon: CalendarBlank },
  { href: "/library", label: "Library", icon: Books },
  { href: "/practice", label: "Practice", icon: PencilSimpleLine },
  { href: "/quiz", label: "Quiz", icon: Exam },
  { href: "/tutor", label: "Tutor", icon: ChatsCircle },
  { href: "/progress", label: "Progress", icon: ChartBar },
];

interface SidebarProps {
  xp: number;
  streak: number;
}

export function Sidebar({ xp, streak }: SidebarProps) {
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
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={active ? "nav-item active" : "nav-item"} aria-current={active ? "page" : undefined}>
              <Icon size={24} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-stats">
        <strong>{xp} XP</strong>
        <span>
          <Sparkle size={13} aria-hidden /> {streak} day streak
        </span>
      </div>
    </aside>
  );
}
