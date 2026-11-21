import { describe, expect, it } from "vitest";
import { isPlausibleApiKey, maskApiKey } from "./cloud-key";

describe("api key helpers", () => {
  it("accepts a key-shaped token and rejects sentences, spaces and short strings", () => {
    expect(isPlausibleApiKey("gsk_abcdEFGH1234567890abcdEFGH")).toBe(true);
    expect(isPlausibleApiKey("too short")).toBe(false);
    expect(isPlausibleApiKey("my key is gsk_abcdEFGH1234567890abcd")).toBe(false);
    expect(isPlausibleApiKey("")).toBe(false);
  });
  it("masks all but the last four characters", () => {
    const masked = maskApiKey("gsk_abcdEFGH1234567890WXYZ");
    expect(masked.endsWith("WXYZ")).toBe(true);
    expect(masked).not.toContain("gsk_");
  });
});
