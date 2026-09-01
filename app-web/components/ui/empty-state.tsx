import Link from "next/link";
import type { Route } from "next";

interface EmptyStateProps {
  title: string;
  description: string;
  /** When set, the description is shown as a labelled info note (used for lock reasons). */
  descriptionLabel?: string;
  actionLabel?: string;
  actionHref?: Route;
}

export function EmptyState({ title, description, descriptionLabel, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      {descriptionLabel ? (
        <p className="lock-reason" role="note">
          <strong className="lock-reason-label">{descriptionLabel}</strong>
          {description}
        </p>
      ) : (
        <p>{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link className="primary-action" href={actionHref}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
