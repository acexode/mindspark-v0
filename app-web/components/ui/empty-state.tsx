import Link from "next/link";
import type { Route } from "next";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: Route;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && actionHref && (
        <Link className="primary-action" href={actionHref}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
