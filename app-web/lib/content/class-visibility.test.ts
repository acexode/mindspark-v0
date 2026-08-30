import { describe, expect, it } from "vitest";
import { isClassVisible } from "./class-visibility";

describe("isClassVisible", () => {
  it("hides SS topics from a JSS1 student", () => {
    expect(isClassVisible("JSS1", ["SS1", "SS2", "SS3"])).toBe(false);
  });

  it("hides JSS-only topics from an SS3 student", () => {
    expect(isClassVisible("SS3", ["JSS1", "JSS2"])).toBe(false);
  });

  it("lets a JSS2 student see JSS1 and JSS2 but not JSS3", () => {
    expect(isClassVisible("JSS2", ["JSS1"])).toBe(true);
    expect(isClassVisible("JSS2", ["JSS2"])).toBe(true);
    expect(isClassVisible("JSS2", ["JSS3"])).toBe(false);
  });

  it("lets SS3 revise SS1 but not jump a JSS1 student to SS3", () => {
    expect(isClassVisible("SS3", ["SS1"])).toBe(true);
    expect(isClassVisible("JSS1", ["SS3"])).toBe(false);
  });

  it("uses the matching band on mixed JSS3/SS1 topics", () => {
    expect(isClassVisible("JSS3", ["JSS3", "SS1"])).toBe(true);
    expect(isClassVisible("SS1", ["JSS3", "SS1"])).toBe(true);
    expect(isClassVisible("JSS1", ["JSS3", "SS1"])).toBe(false);
  });
});
