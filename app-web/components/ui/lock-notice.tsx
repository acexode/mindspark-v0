interface LockNoticeProps {
  reason: string;
}

/** Always-visible explanation for a locked topic — never hover-only. */
export function LockNotice({ reason }: LockNoticeProps) {
  return (
    <p className="lock-reason" role="note">
      <strong className="lock-reason-label">Why this is locked</strong>
      {reason}
    </p>
  );
}
