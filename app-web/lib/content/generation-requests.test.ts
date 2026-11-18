import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { openContentDb } from "./db";
import { listPendingRequests, markRequest, recordGenerationRequest, requestGenerationIfNeeded } from "./generation-requests";
import type { Subject } from "./schema";

let tmp: string;
let file: string;

const subject = {
  id: "ug.test.course",
  level: "undergraduate",
  topics: [{ id: "ug.test.course.t1", subtopics: [{ id: "ug.test.course.t1.a", name: "A" }] }],
} as unknown as Subject;
const emptyIndex = {
  subjectById: new Map([[subject.id, subject]]),
  lessonBySubtopicId: new Map(),
  questionsBySubtopicId: new Map(),
};

beforeAll(() => {
  tmp = mkdtempSync(path.join(os.tmpdir(), "gen-req-"));
  file = path.join(tmp, "content.db");
  openContentDb(file, { create: true })!.close();
});
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe("generation requests", () => {
  it("records idempotently and keeps one pending row", () => {
    const db = openContentDb(file)!;
    expect(recordGenerationRequest(db, "ug.x")).toBe("created");
    const first = listPendingRequests(db)[0].requestedAt;
    expect(recordGenerationRequest(db, "ug.x")).toBe("already_pending");
    expect(listPendingRequests(db)).toHaveLength(1);
    expect(listPendingRequests(db)[0].requestedAt).toBe(first);
    db.close();
  });

  it("re-queues a finished request and drops it from pending when done", () => {
    const db = openContentDb(file)!;
    markRequest(db, "ug.x", "done");
    expect(listPendingRequests(db)).toHaveLength(0);
    expect(recordGenerationRequest(db, "ug.x")).toBe("requeued");
    expect(listPendingRequests(db)).toHaveLength(1);
    db.close();
  });

  it("enrolment hook queues only when units are missing and a database exists", () => {
    expect(requestGenerationIfNeeded(emptyIndex, subject.id, file)).toBe("created");
    expect(requestGenerationIfNeeded(emptyIndex, subject.id, file)).toBe("already_pending");
    const complete = {
      ...emptyIndex,
      lessonBySubtopicId: new Map([["ug.test.course.t1.a", {} as never]]),
      questionsBySubtopicId: new Map([["ug.test.course.t1.a", [{} as never]]]),
    };
    expect(requestGenerationIfNeeded(complete, subject.id, file)).toBeNull();
    expect(requestGenerationIfNeeded(emptyIndex, subject.id, path.join(tmp, "absent.db"))).toBeNull();
    const db = openContentDb(file)!;
    expect(listPendingRequests(db).map((r) => r.subjectId).sort()).toEqual(["ug.test.course", "ug.x"]);
    db.close();
  });
});
