"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flow-page">
      <div className="flow-card">
        <span className="eyebrow">Something went wrong</span>
        <h1>We couldn&apos;t load this page.</h1>
        <p>{error.message}</p>
        <button className="primary-action" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
