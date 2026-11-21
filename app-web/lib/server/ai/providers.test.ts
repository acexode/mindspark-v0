import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { providerOrder, tutorProviders } = await import("./providers");

const cloud = { CLOUD_AI_BASE_URL: "https://api.example.com/v1/", CLOUD_AI_API_KEY: "k", CLOUD_AI_MODEL: "m" };

describe("tutorProviders", () => {
  it("keeps the old behaviour by default: ollama, plus OpenAI when a key is set", () => {
    expect(tutorProviders({}).map((p) => p.name)).toEqual(["ollama"]);
    expect(tutorProviders({ OPENAI_API_KEY: "sk" }).map((p) => p.name)).toEqual(["ollama", "ai"]);
  });
  it("adds the cloud provider only when all three settings are present", () => {
    expect(tutorProviders({ CLOUD_AI_BASE_URL: "https://x/v1", CLOUD_AI_MODEL: "m" }).map((p) => p.name)).toEqual(["ollama"]);
    expect(tutorProviders(cloud).map((p) => p.name)).toEqual(["ollama", "cloud"]);
  });
  it("honours TUTOR_PROVIDER_ORDER and skips unconfigured or unknown names", () => {
    expect(tutorProviders({ ...cloud, TUTOR_PROVIDER_ORDER: "cloud,ollama" }).map((p) => p.name)).toEqual(["cloud", "ollama"]);
    expect(tutorProviders({ TUTOR_PROVIDER_ORDER: "cloud,ollama,bogus" }).map((p) => p.name)).toEqual(["ollama"]);
    expect(providerOrder({ TUTOR_PROVIDER_ORDER: "nonsense" })).toEqual(["ollama", "cloud", "ai"]);
  });
});
