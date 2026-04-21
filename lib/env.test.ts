import { describe, it, expect, beforeEach } from "vitest";

describe("env validation", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("tira si falta DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    const { loadServerEnv } = await import("./env");
    expect(() => loadServerEnv()).toThrow(/DATABASE_URL/);
  });

  it("retorna env válido si todas las vars están presentes", async () => {
    process.env.DATABASE_URL = "postgres://user:pw@host.neon.tech/db";
    process.env.NEXTAUTH_SECRET = "a".repeat(32);
    process.env.NEXTAUTH_URL = "http://localhost:3000";
    process.env.RESEND_API_KEY = "re_test_xxx";
    process.env.TURNSTILE_SECRET_KEY = "test";
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_xxx";

    const { loadServerEnv } = await import("./env");
    const env = loadServerEnv();
    expect(env.DATABASE_URL).toMatch(/^postgres:\/\//);
  });
});
