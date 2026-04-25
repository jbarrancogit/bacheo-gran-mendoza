import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | null = null;

/**
 * Cliente Drizzle/Neon singleton. Se inicializa de forma perezosa para que
 * el bundle pueda compilar sin DATABASE_URL (modo demo / mock-data).
 *
 * Lanza en runtime si DATABASE_URL no está seteada al pedirlo.
 */
export function getDb(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL no está seteada. Provisioná Neon (vercel marketplace add neon) y corré `vercel env pull`.",
    );
  }
  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

export { schema };
