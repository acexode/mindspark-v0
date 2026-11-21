import { describe, expect, it } from "vitest";
import { describeProviderFailure, failureNote } from "./provider-errors";

describe("describeProviderFailure", () => {
  it("explains the common provider failures in plain words", () => {
    expect(describeProviderFailure({ statusCode: 401 })).toBe("the key was rejected");
    expect(describeProviderFailure({ statusCode: 404 })).toBe("the model was not found");
    expect(describeProviderFailure({ statusCode: 429 })).toBe("the free usage limit was reached");
    expect(describeProviderFailure({ statusCode: 503 })).toBe("the service had a problem");
    expect(describeProviderFailure({ name: "TimeoutError" })).toBe("it did not reply in time");
    expect(describeProviderFailure({ message: "Cannot connect to API: connect ECONNREFUSED" })).toBe("it could not be reached");
    expect(describeProviderFailure("boom")).toBe("it returned an error");
  });
  it("never echoes the raw message, which could contain a key", () => {
    expect(describeProviderFailure({ statusCode: 400, message: "Bearer gsk_secret123 invalid" })).not.toContain("gsk_");
    expect(failureNote("cloud", { statusCode: 401, message: "gsk_secret" })).toBe("The online model is unavailable: the key was rejected.");
  });
});
