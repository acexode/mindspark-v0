"use client";

import { useId, useMemo, useState } from "react";

export interface TutorUnit {
  id: string;
  name: string;
  objectives: string[];
  lessonHref: string | null;
  practiceHref: string | null;
}

export interface TutorTopicGroup {
  id: string;
  name: string;
  units: TutorUnit[];
}

export interface TutorSubjectGroup {
  id: string;
  /** Course code for undergraduates, subject name otherwise. */
  label: string;
  name: string;
  accent: string;
  topics: TutorTopicGroup[];
}

interface TutorUnitPickerProps {
  subjects: TutorSubjectGroup[];
  activeUnitId: string;
  onSelect: (unitId: string) => void;
  unitNoun: string;
}

/**
 * Hundreds of units across a full course load are unusable in a <select>, so this is a
 * searchable outline. Only the active subject starts expanded; searching expands every match.
 */
export function TutorUnitPicker({ subjects, activeUnitId, onSelect, unitNoun }: TutorUnitPickerProps) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!needle) return subjects;
    return subjects
      .map((subject) => ({
        ...subject,
        topics: subject.topics
          .map((topic) => ({
            ...topic,
            units: topic.units.filter((unit) =>
              [unit.name, topic.name, subject.name, subject.label].some((text) => text.toLowerCase().includes(needle)),
            ),
          }))
          .filter((topic) => topic.units.length > 0),
      }))
      .filter((subject) => subject.topics.length > 0);
  }, [subjects, needle]);

  return (
    <section className="tutor-picker" aria-labelledby={`${searchId}-title`}>
      <h2 id={`${searchId}-title`} className="tutor-rail-title">
        Switch {unitNoun}
      </h2>
      <label className="sr-only" htmlFor={searchId}>
        Search {unitNoun}s
      </label>
      <input
        id={searchId}
        type="search"
        className="tutor-picker-search"
        placeholder={`Search ${unitNoun}s…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="tutor-picker-list">
        {visible.length === 0 && <p className="tutor-picker-empty">Nothing matches “{query}”.</p>}
        {visible.map((subject) => {
          const holdsActive = subject.topics.some((t) => t.units.some((u) => u.id === activeUnitId));
          return (
            <details
              key={subject.id}
              className="tutor-picker-subject"
              open={Boolean(needle) || holdsActive}
              style={{ ["--accent" as string]: subject.accent }}
            >
              <summary>{subject.label}</summary>
              {subject.topics.map((topic) => (
                <div key={topic.id} className="tutor-picker-topic">
                  <p>{topic.name}</p>
                  <ul>
                    {topic.units.map((unit) => (
                      <li key={unit.id}>
                        <button
                          type="button"
                          aria-current={unit.id === activeUnitId ? "true" : undefined}
                          onClick={() => onSelect(unit.id)}
                        >
                          {unit.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </details>
          );
        })}
      </div>
    </section>
  );
}
