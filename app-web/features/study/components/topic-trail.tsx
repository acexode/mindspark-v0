import type { TopicOverview, TopicStatus } from "@/lib/content/study-overview";

const STATUS_LABEL: Record<TopicStatus, string> = {
  cleared: "cleared",
  current: "current topic",
  open: "open",
  locked: "locked",
};

/**
 * The whole subject as one strip: a segment per topic, filled as topics are cleared.
 * It shows how far along a student is without listing every topic.
 */
export function TopicTrail({ topics, label }: { topics: Pick<TopicOverview, "id" | "name" | "status">[]; label: string }) {
  if (topics.length === 0) return null;
  return (
    <ol className="topic-trail" aria-label={label}>
      {topics.map((topic) => (
        <li key={topic.id} className={`is-${topic.status}`} title={`${topic.name} — ${STATUS_LABEL[topic.status]}`}>
          <span className="sr-only">
            {topic.name}: {STATUS_LABEL[topic.status]}
          </span>
        </li>
      ))}
    </ol>
  );
}
