export function assertNotMain(databaseUrl: string, neonBranch?: string): void {
  if (neonBranch === "main") {
    throw new Error(
      "Seed/reset rechazado: NEON_BRANCH=main. Nunca correr seeds contra prod."
    );
  }

  const lower = databaseUrl.toLowerCase();
  if (lower.includes("-main.") || lower.includes("/main?") || lower.endsWith("/main")) {
    throw new Error(
      "Seed/reset rechazado: la connection string apunta a la branch main. Nunca correr seeds contra prod."
    );
  }
}
