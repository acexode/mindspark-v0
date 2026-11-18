import type { DatabaseSync } from "node:sqlite";
import { dbPath, openContentDb } from "./db";
import { courseAvailability } from "./availability";
import type { ContentIndex } from "./loader";

export type RequestStatus = "pending" | "done" | "failed";
export type RecordOutcome = "created" | "already_pending" | "requeued";

export interface GenerationRequest {
  subjectId: string;
  requestedAt: string;
  status: RequestStatus;
}

/**
 * Idempotently records that a course needs generating. Never generates: the
 * operator drains the queue offline. A second call while pending is a no-op
 * (keeps the original requested_at); a finished or failed request is re-queued.
 */
export function recordGenerationRequest(db: DatabaseSync, subjectId: string): RecordOutcome {
  const existing = db.prepare("SELECT status FROM generation_requests WHERE subject_id = ?").get(subjectId) as
    | { status: RequestStatus }
    | undefined;
  if (!existing) {
    db.prepare("INSERT OR IGNORE INTO generation_requests (subject_id) VALUES (?)").run(subjectId);
    return "created";
  }
  if (existing.status === "pending") return "already_pending";
  db.prepare("UPDATE generation_requests SET status = 'pending', requested_at = datetime('now') WHERE subject_id = ?").run(subjectId);
  return "requeued";
}

export function listPendingRequests(db: DatabaseSync): GenerationRequest[] {
  const rows = db
    .prepare("SELECT subject_id, requested_at, status FROM generation_requests WHERE status = 'pending' ORDER BY requested_at, subject_id")
    .all() as Array<{ subject_id: string; requested_at: string; status: RequestStatus }>;
  return rows.map((r) => ({ subjectId: r.subject_id, requestedAt: r.requested_at, status: r.status }));
}

export function markRequest(db: DatabaseSync, subjectId: string, status: RequestStatus): void {
  db.prepare("UPDATE generation_requests SET status = ? WHERE subject_id = ?").run(status, subjectId);
}

/**
 * Enrolment hook: when the course has ungenerated units, queue a request.
 * Only database-backed courses are queued, so no database means nothing to do.
 * Returns the outcome, or null when no request was needed or possible.
 */
export function requestGenerationIfNeeded(
  index: Pick<ContentIndex, "subjectById" | "lessonBySubtopicId" | "questionsBySubtopicId">,
  subjectId: string,
  file: string = dbPath(),
): RecordOutcome | null {
  const subject = index.subjectById.get(subjectId);
  if (!subject || subject.level !== "undergraduate") return null;
  if (courseAvailability(index, subjectId).missing.length === 0) return null;
  let db: DatabaseSync | null = null;
  try {
    db = openContentDb(file);
    if (!db) return null;
    return recordGenerationRequest(db, subjectId);
  } catch {
    return null; // a failed bookkeeping write must never block enrolment
  } finally {
    db?.close();
  }
}
