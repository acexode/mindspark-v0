import { describe, expect, it } from "vitest";
import { buildContentIndex, clearContentCache, getContentIndex } from "./loader";

describe("content index cache", () => {
  it("reuses the in-memory index across lookups", () => {
    clearContentCache();
    const first = getContentIndex();
    const second = getContentIndex();
    expect(second).toBe(first);
    expect(first.lessonBySubtopicId.size).toBeGreaterThan(0);
  });

  it("buildContentIndex still returns a fresh object for scripts", () => {
    const a = buildContentIndex();
    const b = buildContentIndex();
    expect(a).not.toBe(b);
    expect(a.questionById.size).toBe(b.questionById.size);
  });
});
