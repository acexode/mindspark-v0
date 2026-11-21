import { afterEach, describe, expect, it, vi } from "vitest";
import { chooseCloudModel } from "@/lib/domain/tutor/cloud-key";

vi.mock("server-only", () => ({}));
const { resolveCloudModel } = await import("./cloud-models");
const { tutorProviders } = await import("./providers");

afterEach(() => vi.unstubAllGlobals());

const listing = (ids: string[]) => ({ ok: true, json: async () => ({ data: ids.map((id) => ({ id })) }) });

describe("chooseCloudModel", () => {
  it("prefers the first preferred chat model the key can use", () => {
    expect(chooseCloudModel(["whisper-large-v3", "llama-3.1-8b-instant", "openai/gpt-oss-20b"])).toBe("llama-3.1-8b-instant");
    expect(chooseCloudModel(["openai/gpt-oss-20b", "llama-3.3-70b-versatile"])).toBe("llama-3.3-70b-versatile");
  });
  it("honours the operator's model only when it is available", () => {
    expect(chooseCloudModel(["a-model", "llama-3.1-8b-instant"], "a-model")).toBe("a-model");
    expect(chooseCloudModel(["llama-3.1-8b-instant"], "gone-model")).toBe("llama-3.1-8b-instant");
  });
  it("falls back to any chat model and skips speech and safety models", () => {
    expect(chooseCloudModel(["whisper-large-v3", "orpheus-tts", "some/new-chat-model"])).toBe("some/new-chat-model");
    expect(chooseCloudModel(["whisper-large-v3", "llama-prompt-guard-2-86m"])).toBeNull();
    expect(chooseCloudModel([])).toBeNull();
  });
});

describe("resolveCloudModel", () => {
  it("returns a model the key can use and remembers it", async () => {
    const fetchMock = vi.fn(async () => listing(["whisper-large-v3", "llama-3.1-8b-instant"]));
    vi.stubGlobal("fetch", fetchMock);
    expect(await resolveCloudModel("key-resolve-a-1234567890", {})).toBe("llama-3.1-8b-instant");
    expect(await resolveCloudModel("key-resolve-a-1234567890", {})).toBe("llama-3.1-8b-instant");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("returns undefined when the provider cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("offline"))));
    expect(await resolveCloudModel("key-resolve-b-1234567890", {})).toBeUndefined();
  });
});

describe("the chosen model reaches the provider", () => {
  it("uses the chosen model id for the student's cloud provider", () => {
    const cloud = tutorProviders({}, "student_key_abcdefghij", "llama-3.1-8b-instant").find((p) => p.name === "cloud");
    expect(cloud?.modelId).toBe("llama-3.1-8b-instant");
    expect(tutorProviders({}, "student_key_abcdefghij").find((p) => p.name === "cloud")?.modelId).toBe("llama-3.3-70b-versatile");
  });
});
