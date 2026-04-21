import { describe, it, expect } from "vitest";
import { assertNotMain } from "./guard";

describe("assertNotMain", () => {
  it("tira si la connection string contiene 'main'", () => {
    expect(() =>
      assertNotMain("postgres://user:pw@ep-cool-123-main.neon.tech/bacheo")
    ).toThrow(/main/i);
  });

  it("tira si la env var NEON_BRANCH es 'main'", () => {
    expect(() =>
      assertNotMain("postgres://user:pw@ep-cool-123.neon.tech/bacheo", "main")
    ).toThrow(/main/i);
  });

  it("permite branch dev", () => {
    expect(() =>
      assertNotMain("postgres://user:pw@ep-cool-123-dev.neon.tech/bacheo", "dev")
    ).not.toThrow();
  });

  it("permite branch qa", () => {
    expect(() =>
      assertNotMain("postgres://user:pw@ep-cool-123-qa.neon.tech/bacheo", "qa")
    ).not.toThrow();
  });
});
