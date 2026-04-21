import { assertNotMain } from "../seed/guard";
import { seedDev } from "../seed/dev";
import { seedQa } from "../seed/qa";

const target = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;
const neonBranch = process.env.NEON_BRANCH;

if (!databaseUrl) {
  console.error("DATABASE_URL no está seteada");
  process.exit(1);
}

assertNotMain(databaseUrl, neonBranch);

const run = async (): Promise<void> => {
  switch (target) {
    case "dev":
      await seedDev();
      break;
    case "qa":
      await seedQa();
      break;
    default:
      console.error(`Target desconocido: ${target}. Usar 'dev' o 'qa'.`);
      process.exit(1);
  }
  console.log(`Seed ${target} completado`);
};

run().catch((err) => {
  console.error("Seed falló:", err);
  process.exit(1);
});
