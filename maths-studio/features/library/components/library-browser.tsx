"use client";

import Link from "next/link";
import { BookOpenText, ArrowRight } from "@phosphor-icons/react";
import { useStudentProfile } from "@/features/student-profile/profile-provider";
import curriculum from "@/content/curricula/waec-neco-algebra-linear-equations.json";

export function LibraryBrowser() {
  const { profile } = useStudentProfile();

  const subjects =
    profile.educationLevel === "university"
      ? [
          {
            id: "university-cs-dsa",
            title: "Data Structures & Algorithms",
            topics: ["Arrays", "Linked lists", "Trees", "Binary search trees"],
            href: "/learn/linear-equations",
          },
        ]
      : [
          {
            id: "algebra",
            title: curriculum.subject,
            topics: curriculum.concepts.map((c) => c.label),
            href: "/learn/linear-equations",
          },
        ];

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Library</span>
          <h1>Explore subjects and topics.</h1>
          <p>Browse curriculum-backed content for your level.</p>
        </div>
      </header>
      <div className="library-grid">
        {subjects.map((subject) => (
          <article key={subject.id} className="library-card">
            <BookOpenText size={32} aria-hidden />
            <h2>{subject.title}</h2>
            <ul>
              {subject.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <Link className="primary-action" href={subject.href as "/learn/linear-equations"}>
              Explore
              <ArrowRight aria-hidden />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
