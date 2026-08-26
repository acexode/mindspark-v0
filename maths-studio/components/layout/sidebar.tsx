"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  CalendarBlank,
  ChartBar,
  CloudArrowDown,
  Graph,
  ListBullets,
  Medal,
  PencilSimpleLine,
  Scroll,
  Sparkle,
  ChatsCircle,
} from "@phosphor-icons/react";
import type { StudentProfile } from "@/lib/domain/student/types";

const navItems = [
  { href: "/home" as const, label: "Today", icon: CalendarBlank },
  { href: "/learn/linear-equations" as const, label: "Lessons", icon: BookOpenText },
  { href: "/practice/linear-equations" as const, label: "Practice", icon: PencilSimpleLine },
  { href: "/knowledge-map" as const, label: "Map", icon: Graph },
  { href: "/library" as const, label: "Library", icon: Scroll },
  { href: "/quests" as const, label: "Quests", icon: ListBullets },
  { href: "/league" as const, label: "League", icon: Medal },
  { href: "/tutor" as const, label: "Tutor", icon: ChatsCircle },
  { href: "/progress" as const, label: "Progress", icon: ChartBar },
];

interface SidebarProps {
  profile: StudentProfile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        Maths
        <br />
        Studio
        <span />
      </div>
      <nav>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} className={active ? "nav-item active" : "nav-item"}>
              <Icon size={25} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-stats">
        <strong>{profile.xp} XP</strong>
        <span>
          <Sparkle size={14} aria-hidden /> {profile.streak} day streak
        </span>
      </div>
      <div className="offline">
        <CloudArrowDown size={27} aria-hidden />
        <span>
          Available offline
          <small>progress saved</small>
        </span>
      </div>
    </aside>
  );
}
