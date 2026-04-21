import { assertNotMain } from "../seed/guard";

const databaseUrl = process.env.DATABASE_URL;
const neonBranch = process.env.NEON_BRANCH;

if (!databaseUrl) {
  console.error("DATABASE_URL no está seteada");
  process.exit(1);
}

assertNotMain(databaseUrl, neonBranch);

console.log("Reset stub. Cuando haya schema: drizzle-kit push + seed.");
