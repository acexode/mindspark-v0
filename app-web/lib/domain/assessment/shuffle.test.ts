import { describe, expect, it } from "vitest";
import { balancedSample, pickRandom, shuffle } from "./shuffle";

/** Always picks index 0 in Fisher–Yates, which rotates the last item to the front. */
const alwaysZero = () => 0;

describe("shuffle", () => {
  it("returns a new permutation and does not mutate the input", () => {
    const items = [1, 2, 3, 4];
    const out = shuffle(items, alwaysZero);
    expect(items).toEqual([1, 2, 3, 4]);
    expect(out).toEqual([2, 3, 4, 1]);
    expect(out).not.toBe(items);
  });

  it("leaves a single-item list unchanged", () => {
    expect(shuffle(["only"], alwaysZero)).toEqual(["only"]);
  });
});

describe("pickRandom", () => {
  it("returns undefined for an empty list", () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it("picks by the injected random value", () => {
    expect(pickRandom(["a", "b", "c"], () => 0)).toBe("a");
    expect(pickRandom(["a", "b", "c"], () => 0.99)).toBe("c");
  });
});

describe("balancedSample", () => {
  const pool = [
    { id: "e1", difficulty: 1 },
    { id: "e2", difficulty: 1 },
    { id: "m1", difficulty: 2 },
    { id: "m2", difficulty: 2 },
    { id: "h1", difficulty: 3 },
    { id: "h2", difficulty: 3 },
  ];

  it("keeps the requested size and covers every difficulty", () => {
    const sample = balancedSample(pool, 3, alwaysZero);
    expect(sample).toHaveLength(3);
    expect(new Set(sample.map((item) => item.difficulty))).toEqual(new Set([1, 2, 3]));
  });

  it("never repeats an item", () => {
    const sample = balancedSample(pool, 6, alwaysZero);
    expect(sample.map((item) => item.id).sort()).toEqual(["e1", "e2", "h1", "h2", "m1", "m2"]);
  });
});
