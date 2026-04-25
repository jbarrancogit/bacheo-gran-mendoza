/**
 * Capa de datos para reportes. Lee de Neon si DATABASE_URL está seteada,
 * o cae al mock para que la app corra en demo (Vercel sin Neon todavía).
 *
 * En slice 1 las queries de DB se dejan stubeadas para destrabar tipos;
 * cuando Neon esté provisionado y migraciones corridas, se completan.
 */

import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db";
import { reports as reportsTable } from "@/lib/db/schema";
import { reports as mockReports, type MockReport } from "@/lib/mock-data";

export type Report = MockReport;

export async function listReports(): Promise<Report[]> {
  if (!hasDatabase()) return mockReports;
  const db = getDb();
  const rows = await db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt))
    .limit(200);
  return rows.map(toReport);
}

export async function getReport(code: string): Promise<Report | null> {
  if (!hasDatabase()) {
    return mockReports.find((r) => r.id === code) ?? null;
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(reportsTable)
    .where(eq(reportsTable.code, code))
    .limit(1);
  return row ? toReport(row) : null;
}

// ─── Adaptador DB → tipo de UI ───
// El tipo MockReport es el contrato que la UI consume hoy. Cuando reemplacemos
// completamente el mock, este adaptador puede irse y la UI consume el tipo DB.

function toReport(row: typeof reportsTable.$inferSelect): Report {
  const daysAgo = Math.max(
    0,
    Math.floor((Date.now() - row.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  );
  return {
    id: row.code,
    category: row.category,
    status: dbStatusToUi(row.status),
    street: row.addressText ?? "",
    depto: row.depto,
    description: row.description,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    daysAgo,
    alsoSaw: row.alsoSawCount,
    imageBg: imageBgFor(row.category),
    timeline: [], // se llena cuando consultemos status_events
  };
}

function dbStatusToUi(s: typeof reportsTable.$inferSelect.status): Report["status"] {
  // El esquema DB tiene 'en_obra' y 'cerrado'; la UI mapea a 'en-obra' y oculta 'cerrado' (cae a 'resuelto').
  if (s === "en_obra") return "en-obra";
  if (s === "cerrado") return "resuelto";
  return s;
}

function imageBgFor(category: Report["category"]): string {
  switch (category) {
    case "baches":
      return "from-primary-500/40 via-primary-600/30 to-primary-900/40";
    case "luminaria":
      return "from-amber-500/40 via-amber-600/30 to-amber-900/40";
    case "semaforos":
      return "from-red-500/40 via-red-600/30 to-red-900/40";
    case "senalizacion":
      return "from-sky-500/40 via-sky-600/30 to-sky-900/40";
    case "ramas":
      return "from-emerald-500/40 via-emerald-600/30 to-emerald-900/40";
    case "veredas":
      return "from-violet-500/40 via-violet-600/30 to-violet-900/40";
  }
}
