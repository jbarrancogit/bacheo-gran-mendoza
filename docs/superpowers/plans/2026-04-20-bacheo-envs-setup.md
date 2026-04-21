# Bacheo Envs Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar operativos los 3 entornos (dev/qa/prod) de Bacheo Gran Mendoza en Vercel free, con Neon, CI y protección de ramas, siguiendo el spec `docs/superpowers/specs/2026-04-20-bacheo-envs-design.md`.

**Architecture:** Un proyecto Vercel conectado a un repo GitHub público con 3 ramas long-lived (dev/qa/main). Cada rama mapea a un entorno Vercel con env vars scopeadas y a una Neon branch separada. CI en GitHub Actions valida PRs antes de mergear a main. Scaffold mínimo Next.js 15 + Drizzle + Neon para que los 3 entornos deployen y corra el smoke test de build.

**Tech Stack:** Next.js 15 (App Router) · TypeScript estricto · pnpm · Drizzle ORM · Neon Postgres · Vitest · ESLint · GitHub Actions · Vercel · Resend · Cloudflare Turnstile · Vercel Blob.

---

## Pre-requisitos (verificar antes de empezar)

El engineer necesita tener:

- [ ] Cuenta GitHub activa como `jbarrancogit` (login desde CLI: `gh auth status`)
- [ ] Cuenta Vercel activa asociada a `jbarrancogit` en GitHub (login desde CLI: `vercel whoami`)
- [ ] Cuenta Neon activa (ir a https://console.neon.tech y verificar login)
- [ ] Cuenta Resend activa (https://resend.com/login)
- [ ] Cuenta Cloudflare activa con Turnstile habilitado (https://dash.cloudflare.com/?to=/:account/turnstile)
- [ ] pnpm instalado globalmente (`pnpm --version` >= 9.0)
- [ ] Node 20 activo (`node --version` == v20.x)
- [ ] `vercel` CLI instalado (`vercel --version` >= 32)
- [ ] `gh` CLI instalado (`gh --version`)

Si falta algo, detenerse y resolverlo antes de empezar. El plan asume estos pre-requisitos.

**Directorio de trabajo:** `C:/Users/HP/Documents/cosasPersonalesBusquedasconIAviaConsola/proyectos_personales/bacheo-gran-mendoza/`

---

## File Structure

Archivos que se crean en el scaffold inicial (Task 1-7):

```
bacheo-gran-mendoza/
├── .env.example                              # Doc de env vars (sin valores)
├── .gitignore                                # Estándar Next.js + .env.local + .vercel
├── .github/
│   └── workflows/
│       └── ci.yml                            # CI en PRs a main/qa
├── package.json                              # Deps + scripts
├── pnpm-lock.yaml                            # Lockfile
├── tsconfig.json                             # TS estricto
├── next.config.mjs                           # Config Next.js
├── drizzle.config.ts                         # Config Drizzle
├── vitest.config.ts                          # Config Vitest
├── .eslintrc.json                            # ESLint
├── README.md                                 # Setup local
├── app/
│   ├── layout.tsx                            # Root layout mínimo
│   └── page.tsx                              # Home mínima con env banner
├── lib/
│   ├── db/
│   │   ├── index.ts                          # Drizzle client
│   │   └── schema.ts                          # Schema vacío stub
│   └── env.ts                                # Validación de env vars (Zod)
├── seed/
│   ├── guard.ts                              # Safety check: rechaza si es main
│   ├── guard.test.ts                         # Tests de guard
│   ├── dev.ts                                 # Seed dev
│   ├── qa.ts                                  # Seed qa
│   └── prod.ts                                # Seed prod (vacío)
├── scripts/
│   ├── seed.ts                                # Runner de seeds
│   └── reset.ts                               # Reset DB
└── docs/
    ├── superpowers/
    │   ├── specs/2026-04-20-bacheo-envs-design.md   # Ya existe
    │   └── plans/2026-04-20-bacheo-envs-setup.md    # Este plan
    └── ops/
        ├── environments.md                           # Tabla de URLs
        └── rotation.md                               # Procedimiento de rotación
```

**Responsabilidades por archivo:**

- `lib/env.ts` — única fuente de parsing de `process.env` con Zod. Todo lo demás importa de acá.
- `lib/db/index.ts` — crea el cliente Drizzle una vez, exportado.
- `seed/guard.ts` — función `assertNotMain(databaseUrl)` que tira si apunta a la branch `main`.
- `scripts/seed.ts` — entry-point de `pnpm db:seed:*`, llama a `guard` y luego al seed correspondiente.
- `app/page.tsx` — minimal home con banner de `NEXT_PUBLIC_ENV` para verificación visual del entorno.

---

## Fase 1 — Scaffold local + init de repo standalone

**Contexto:** `bacheo-gran-mendoza/` actualmente está dentro del repo parent (`proyectos_personales/`). El spec pide un repo standalone en GitHub `jbarrancogit/bacheo-gran-mendoza`. Esta fase separa bacheo en su propio repo git, deja el parent ignorándolo.

### Task 1: Separar bacheo-gran-mendoza del repo parent

**Files:**
- Modify: `../.gitignore` (parent repo, agregar exclusión)
- Modify: `bacheo-gran-mendoza/.gitignore` (crear; local al subrepo)
- Remove from parent git: todo `bacheo-gran-mendoza/` excepto los specs ya committeados

- [ ] **Step 1: Ver qué tiene el parent en .gitignore hoy**

```bash
cat C:/Users/HP/Documents/cosasPersonalesBusquedasconIAviaConsola/proyectos_personales/.gitignore 2>/dev/null || echo "no existe"
```

- [ ] **Step 2: Agregar bacheo-gran-mendoza al .gitignore del parent**

Editar (o crear) `proyectos_personales/.gitignore` y agregar al final:

```
# bacheo-gran-mendoza es un repo standalone (no parte de este workspace)
bacheo-gran-mendoza/
```

- [ ] **Step 3: Remover bacheo del tracking del parent (sin borrar archivos del disco)**

```bash
cd C:/Users/HP/Documents/cosasPersonalesBusquedasconIAviaConsola/proyectos_personales
git rm -r --cached bacheo-gran-mendoza
git add .gitignore
git status
```

Expected: `.gitignore` modificado, `bacheo-gran-mendoza/docs/superpowers/specs/2026-04-20-bacheo-envs-design.md` marcado como deleted.

- [ ] **Step 4: Commit en el parent**

```bash
git commit -m "chore: excluir bacheo-gran-mendoza (repo standalone)"
```

- [ ] **Step 5: Inicializar repo standalone en bacheo-gran-mendoza**

```bash
cd C:/Users/HP/Documents/cosasPersonalesBusquedasconIAviaConsola/proyectos_personales/bacheo-gran-mendoza
git init -b main
git config user.name "jbarrancogit"
git config user.email "antonio@epewma.com"  # cuenta de trabajo, el git identity queda asi aunque usemos jbarrancogit
```

Nota: según memoria del usuario, git usa `jbarrancogit` como user.name pero el email puede ser `antonio@epewma.com`. Confirmar con el usuario si prefiere otro email para commits de bacheo.

- [ ] **Step 6: Crear .gitignore local**

Crear `bacheo-gran-mendoza/.gitignore`:

```
# dependencies
node_modules/
.pnpm-store/

# next.js
.next/
out/
*.tsbuildinfo
next-env.d.ts

# production
build/
dist/

# env
.env
.env.local
.env.development.local
.env.qa.local
.env.production.local

# vercel
.vercel

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# logs
npm-debug.log*
pnpm-debug.log*

# test
coverage/
```

- [ ] **Step 7: Commit inicial del repo standalone**

```bash
git add .gitignore docs/
git commit -m "chore: init bacheo-gran-mendoza repo standalone con spec"
git log --oneline
```

Expected: 1 commit, el spec en `docs/superpowers/specs/2026-04-20-bacheo-envs-design.md` + el plan en `docs/superpowers/plans/2026-04-20-bacheo-envs-setup.md` + este `.gitignore`.

---

### Task 2: Scaffold Next.js 15 + TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Scaffold con create-next-app (manual, sin el CLI interactivo)**

Crear `package.json`:

```json
{
  "name": "bacheo-gran-mendoza",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "pnpm db:migrate && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed:dev": "tsx scripts/seed.ts dev",
    "db:seed:qa": "tsx scripts/seed.ts qa",
    "db:reset:dev": "tsx scripts/reset.ts dev"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "drizzle-orm": "^0.30.0",
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "15.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "vitest": "^1.4.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

Nota al engineer: las versiones anteriores son las de referencia al escribir el plan (abril 2026). Si alguna no existe, usar la última estable; no bloquear el plan por ajuste menor de versión.

- [ ] **Step 2: Crear tsconfig.json estricto**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Crear next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Crear app/layout.tsx**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bacheo Gran Mendoza",
  description: "Reportá baches y problemas viales del Gran Mendoza",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Crear app/page.tsx con banner de entorno**

```tsx
const env = process.env.NEXT_PUBLIC_ENV ?? "local";
const isProd = env === "prod";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      {!isProd && (
        <div
          style={{
            background: "#fbbf24",
            color: "#000",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Entorno: {env.toUpperCase()}
        </div>
      )}
      <h1>Bacheo Gran Mendoza</h1>
      <p>Scaffold inicial. Pronto vas a poder reportar un bache.</p>
    </main>
  );
}
```

- [ ] **Step 6: Instalar deps**

```bash
cd bacheo-gran-mendoza
pnpm install
```

Expected: `pnpm-lock.yaml` creado, `node_modules/` instalado, cero errores.

- [ ] **Step 7: Verificar que compila**

```bash
pnpm typecheck
```

Expected: exit code 0, sin errores.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json next.config.mjs app/
git commit -m "feat: scaffold Next.js 15 + TypeScript estricto"
```

---

### Task 3: Validación de env vars con Zod

**Files:**
- Create: `lib/env.ts`
- Create: `lib/env.test.ts`

- [ ] **Step 1: Escribir el test primero**

Crear `lib/env.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";

describe("env validation", () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("tira si falta DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    await expect(async () => {
      const { loadServerEnv } = await import("./env");
      loadServerEnv();
    }).rejects.toThrow(/DATABASE_URL/);
  });

  it("retorna env válido si todas las vars están presentes", async () => {
    process.env.DATABASE_URL = "postgres://user:pw@host/db";
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
```

- [ ] **Step 2: Crear vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Correr test — debe fallar (no existe lib/env.ts todavía)**

```bash
pnpm test
```

Expected: FAIL con "Cannot find module './env'" o similar.

- [ ] **Step 4: Implementar lib/env.ts**

```ts
import { z } from "zod";

const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgres://").or(z.string().startsWith("postgresql://")),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

export function loadServerEnv(): ServerEnv {
  return ServerEnvSchema.parse(process.env);
}

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_ENV: z.enum(["prod", "qa", "dev", "local"]),
});

export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV ?? "local",
});
```

- [ ] **Step 5: Correr test — debe pasar**

```bash
pnpm test
```

Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add lib/env.ts lib/env.test.ts vitest.config.ts
git commit -m "feat: validación de env vars con Zod"
```

---

### Task 4: Safety guard contra seed en main

**Files:**
- Create: `seed/guard.ts`
- Create: `seed/guard.test.ts`

- [ ] **Step 1: Escribir test primero**

Crear `seed/guard.test.ts`:

```ts
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
```

- [ ] **Step 2: Correr test — debe fallar**

```bash
pnpm test seed/guard
```

Expected: FAIL con "Cannot find module './guard'".

- [ ] **Step 3: Implementar seed/guard.ts**

```ts
export function assertNotMain(databaseUrl: string, neonBranch?: string): void {
  if (neonBranch === "main") {
    throw new Error(
      "Seed/reset rechazado: NEON_BRANCH=main. Nunca correr seeds contra prod."
    );
  }

  if (databaseUrl.toLowerCase().includes("-main.") || databaseUrl.toLowerCase().includes("/main?")) {
    throw new Error(
      "Seed/reset rechazado: la connection string apunta a la branch main. Nunca correr seeds contra prod."
    );
  }
}
```

- [ ] **Step 4: Correr test — debe pasar**

```bash
pnpm test seed/guard
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add seed/guard.ts seed/guard.test.ts
git commit -m "feat: safety guard contra seed en branch main"
```

---

### Task 5: Seeds stub (dev, qa, prod) y runner

**Files:**
- Create: `seed/dev.ts`, `seed/qa.ts`, `seed/prod.ts`
- Create: `scripts/seed.ts`, `scripts/reset.ts`

- [ ] **Step 1: Crear seeds stub**

Crear `seed/dev.ts`:

```ts
export async function seedDev(): Promise<void> {
  console.log("Seed dev: stub. TODO cuando haya schema real.");
}
```

Crear `seed/qa.ts`:

```ts
export async function seedQa(): Promise<void> {
  console.log("Seed qa: stub. TODO cuando haya schema real.");
}
```

Crear `seed/prod.ts`:

```ts
export async function seedProd(): Promise<void> {
  console.log("Seed prod: vacío por diseño. No ejecutar salvo bootstrap inicial.");
}
```

- [ ] **Step 2: Crear scripts/seed.ts**

```ts
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

const run = async () => {
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
```

- [ ] **Step 3: Crear scripts/reset.ts**

```ts
import { assertNotMain } from "../seed/guard";

const databaseUrl = process.env.DATABASE_URL;
const neonBranch = process.env.NEON_BRANCH;

if (!databaseUrl) {
  console.error("DATABASE_URL no está seteada");
  process.exit(1);
}

assertNotMain(databaseUrl, neonBranch);

console.log("Reset stub. Cuando haya schema: drizzle-kit push + seed.");
```

- [ ] **Step 4: Verificar que typecheck pasa**

```bash
pnpm typecheck
```

Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add seed/dev.ts seed/qa.ts seed/prod.ts scripts/
git commit -m "feat: seed stubs y runner con safety guard"
```

---

### Task 6: Drizzle config + stub de schema

**Files:**
- Create: `drizzle.config.ts`, `lib/db/schema.ts`, `lib/db/index.ts`

- [ ] **Step 1: Crear drizzle.config.ts**

```ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

- [ ] **Step 2: Crear schema stub**

Crear `lib/db/schema.ts`:

```ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Stub mínimo para que Drizzle tenga algo. Reemplazar cuando llegue el spec
// de modelo de datos de Bacheo.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
  note: text("note"),
});
```

- [ ] **Step 3: Crear client Drizzle**

Crear `lib/db/index.ts`:

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 4: Verificar typecheck**

```bash
pnpm typecheck
```

Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add drizzle.config.ts lib/db/
git commit -m "feat: Drizzle config con schema stub"
```

---

### Task 7: ESLint + .env.example + README

**Files:**
- Create: `.eslintrc.json`, `.env.example`, `README.md`

- [ ] **Step 1: Crear .eslintrc.json**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 2: Crear .env.example (sin valores reales)**

```
# Base de datos (Neon)
DATABASE_URL=
NEON_BRANCH=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Email (magic links)
RESEND_API_KEY=

# Captcha
TURNSTILE_SECRET_KEY=

# Storage
BLOB_READ_WRITE_TOKEN=

# Public (client-side)
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
NEXT_PUBLIC_ENV=
```

- [ ] **Step 3: Crear README.md**

```markdown
# Bacheo Gran Mendoza

App cívica para reportar baches y problemas viales del Gran Mendoza.

## Setup local

```bash
pnpm install
vercel link            # una sola vez, asocia el repo a tu proyecto Vercel
vercel env pull .env.local   # baja las vars de Development
pnpm dev
```

## Entornos

| Entorno | URL | Rama Git | Neon branch |
|---|---|---|---|
| Production | TBD al linkear Vercel | main | main |
| QA | TBD al linkear Vercel | qa | qa |
| Dev | TBD al linkear Vercel | dev | dev |
| Local | http://localhost:3000 | cualquiera | dev |

## Scripts

- `pnpm dev` — dev server local
- `pnpm build` — build de producción (corre migraciones primero)
- `pnpm typecheck` — TS strict check
- `pnpm lint` — ESLint
- `pnpm test` — Vitest

Ver `docs/superpowers/specs/2026-04-20-bacheo-envs-design.md` para arquitectura de entornos.
```

- [ ] **Step 4: Verificar lint pasa**

```bash
pnpm lint
```

Expected: sin errores (puede haber warnings de config, OK).

- [ ] **Step 5: Commit**

```bash
git add .eslintrc.json .env.example README.md
git commit -m "feat: ESLint config, .env.example y README"
```

---

## Fase 2 — GitHub repo público + ramas

### Task 8: Crear repo público en GitHub y push inicial

- [ ] **Step 1: Verificar que gh está autenticado**

```bash
gh auth status
```

Expected: logged in as jbarrancogit.

- [ ] **Step 2: Crear repo público**

```bash
cd bacheo-gran-mendoza
gh repo create jbarrancogit/bacheo-gran-mendoza \
  --public \
  --description "App cívica para reportar baches y problemas viales del Gran Mendoza" \
  --source=. \
  --remote=origin \
  --push
```

Expected: repo creado en https://github.com/jbarrancogit/bacheo-gran-mendoza, rama `main` pusheada.

- [ ] **Step 3: Crear ramas dev y qa**

```bash
git branch dev
git branch qa
git push origin dev qa
```

Expected: ambas ramas visibles en GitHub.

- [ ] **Step 4: Verificar**

```bash
git branch -a
```

Expected: `main`, `dev`, `qa` locales y los mismos en `remotes/origin/`.

---

### Task 9: Configurar Rulesets en GitHub

Esta tarea es manual vía UI de GitHub porque la API de Rulesets para repos free tier es inconsistente entre versiones. El engineer debe seguir estos pasos literales:

- [ ] **Step 1: Abrir Settings del repo**

```bash
gh repo view jbarrancogit/bacheo-gran-mendoza --web
```

Navegar a: Settings → Rules → Rulesets → New ruleset → New branch ruleset.

- [ ] **Step 2: Configurar ruleset para main**

- Ruleset name: `protect-main`
- Enforcement status: **Active**
- Target branches: Include → `main`
- Rules (marcar):
  - ✅ Restrict deletions
  - ✅ Require linear history
  - ✅ Require a pull request before merging
    - Required approvals: 0 (sos solo)
    - Dismiss stale pull request approvals when new commits are pushed: ✅
  - ✅ Require status checks to pass
    - Deshabilitar "Require branches to be up to date before merging" (opcional, elegir según preferencia)
    - Status checks: **agregar `verify` después de Task 10** (ahora no aparece todavía, dejar pendiente)
  - ✅ Block force pushes

Click "Create".

- [ ] **Step 3: Verificar que ruleset está activo**

```bash
gh api repos/jbarrancogit/bacheo-gran-mendoza/rulesets
```

Expected: JSON con el ruleset `protect-main` listado con `enforcement: "active"`.

**Nota:** qa y dev quedan SIN protección por diseño (ver spec sección 6). No configurar rulesets para ellas.

---

## Fase 3 — Neon project + branches

### Task 10: Crear Neon project con 3 branches

Manual vía UI de Neon.

- [ ] **Step 1: Abrir consola**

Ir a https://console.neon.tech/

- [ ] **Step 2: Create New Project**

- Project name: `bacheo-gran-mendoza`
- Region: `aws-sa-east-1` (San Pablo, más cercano a Mendoza) si está disponible; si no, `aws-us-east-2`
- Postgres version: 16 (default)
- Click "Create Project".

- [ ] **Step 3: La branch "main" se crea automática. Capturar connection string de main**

En la UI: Dashboard → Connection Details → Copy connection string. Guardar en un archivo temporal LOCAL gitignored (ej. `~/bacheo-secrets.txt`). NO commitear.

- [ ] **Step 4: Crear branch "qa"**

UI: Branches → Create branch → Name: `qa`, Parent branch: `main`. Capturar connection string de qa.

- [ ] **Step 5: Crear branch "dev"**

UI: Branches → Create branch → Name: `dev`, Parent branch: `main`. Capturar connection string de dev.

- [ ] **Step 6: Verificar 3 branches existen**

UI debería mostrar: `main`, `qa`, `dev` en la lista de branches.

---

## Fase 4 — Vercel project + env vars

### Task 11: Importar repo a Vercel

- [ ] **Step 1: Verificar Vercel CLI autenticado**

```bash
vercel whoami
```

Expected: `jbarrancogit` o equivalente.

- [ ] **Step 2: Importar desde CLI**

```bash
cd bacheo-gran-mendoza
vercel link
```

Responder:
- Set up and link? **Y**
- Which scope? (tu scope)
- Link to existing project? **N**
- Project name? `bacheo-gran-mendoza` (default)
- Directory? `./` (default)
- Override settings? **N** (Vercel autodetecta Next.js)

Expected: `.vercel/` creado, proyecto aparece en https://vercel.com/dashboard.

- [ ] **Step 3: Configurar Production Branch**

Abrir: `vercel project inspect bacheo-gran-mendoza --web`

Settings → Git → Production Branch → `main` (default, confirmar).

---

### Task 12: Cargar env vars en los 4 scopes

Manual vía Vercel UI porque el CLI no soporta branch filtering cómodamente.

Para cada scope (Production, Preview-main, Preview-qa, Preview-dev, Development), ir a: Settings → Environment Variables.

- [ ] **Step 1: Preparar los valores**

Generar 3 `NEXTAUTH_SECRET` distintos:

```bash
openssl rand -base64 32   # generar 3 veces, uno por entorno
```

Obtener de cada servicio:
- `RESEND_API_KEY`: Resend dashboard → API Keys → Create API Key (una para prod, una test que comparten qa/dev)
- `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile dashboard → Add site → una config para prod, una test para qa/dev (test keys de Cloudflare: `1x00000000000000000000AA` site key + `1x0000000000000000000000000000000AA` secret)
- `BLOB_READ_WRITE_TOKEN`: Vercel Storage → Create Database → Blob → Connect to project (genera token automático; crear 3 stores separados o 1 compartido según costo)

Las 3 `DATABASE_URL` ya las tenés del Task 10.

- [ ] **Step 2: Vars de Production (branch main)**

Vercel UI → Settings → Environment Variables → Add New:

Para cada var de la tabla de sección 7 del spec, columna "Prod":
- Key: (nombre)
- Value: (valor de prod)
- Environments: ✅ Production (unchecked Preview y Development)

Lista exacta (9 vars):
- `DATABASE_URL` = connection string de Neon branch main
- `NEON_BRANCH` = `main`
- `NEXTAUTH_SECRET` = (random A)
- `NEXTAUTH_URL` = `https://bacheo-gran-mendoza.vercel.app` (se ajusta cuando salga el deploy real)
- `RESEND_API_KEY` = prod key
- `TURNSTILE_SECRET_KEY` = prod secret
- `BLOB_READ_WRITE_TOKEN` = prod token
- `NEXT_PUBLIC_APP_URL` = `https://bacheo-gran-mendoza.vercel.app`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = prod site key
- `NEXT_PUBLIC_ENV` = `prod`

- [ ] **Step 3: Vars de Preview con branch filter = qa**

Para cada var: Environments: ✅ Preview, luego en el dropdown "Branch" elegir `qa`:
- `DATABASE_URL` = Neon qa
- `NEON_BRANCH` = `qa`
- `NEXTAUTH_SECRET` = (random B)
- `NEXTAUTH_URL` = URL que Vercel asigne a branch qa (ver Task 14 verification)
- `RESEND_API_KEY` = test key
- `TURNSTILE_SECRET_KEY` = `1x0000000000000000000000000000000AA` (test)
- `BLOB_READ_WRITE_TOKEN` = qa store token
- `NEXT_PUBLIC_APP_URL` = URL de qa
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = `1x00000000000000000000AA` (test)
- `NEXT_PUBLIC_ENV` = `qa`

- [ ] **Step 4: Vars de Preview con branch filter = dev**

Similar a qa pero con valores de dev:
- `DATABASE_URL` = Neon dev
- `NEON_BRANCH` = `dev`
- `NEXTAUTH_SECRET` = (random C)
- `NEXTAUTH_URL` = URL de dev
- `RESEND_API_KEY` = test key (misma que qa, es sandbox)
- `TURNSTILE_SECRET_KEY` = test key
- `BLOB_READ_WRITE_TOKEN` = dev store token
- `NEXT_PUBLIC_APP_URL` = URL de dev
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = test key
- `NEXT_PUBLIC_ENV` = `dev`

- [ ] **Step 5: Vars de Development (para vercel env pull)**

Environments: ✅ Development. Valores iguales a dev excepto:
- `NEXTAUTH_URL` = `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` = `http://localhost:3000`
- `NEXT_PUBLIC_ENV` = `dev`

- [ ] **Step 6: Vars de Preview default (feature branches → Neon dev, compartida)**

Para cada var crear UNA más, Environments: ✅ Preview **sin branch filter**. Valores iguales a dev (los feature branches caen acá).

- [ ] **Step 7: Verificar pull local**

```bash
vercel env pull .env.local
cat .env.local
```

Expected: archivo con las 10 vars poblado con valores de Development.

---

### Task 13: Primer deploy a production (main)

- [ ] **Step 1: Trigger deploy**

```bash
git checkout main
git commit --allow-empty -m "chore: trigger primer deploy"
git push origin main
```

- [ ] **Step 2: Monitorear build**

```bash
vercel inspect bacheo-gran-mendoza --web
```

Seguir el build en la UI. Expected: build verde en ~2 min.

- [ ] **Step 3: Verificar URL de prod**

```bash
vercel ls bacheo-gran-mendoza
```

Expected: URL tipo `bacheo-gran-mendoza.vercel.app` listada con status READY.

- [ ] **Step 4: Verificar visualmente**

Abrir la URL en el browser. Expected: home de Bacheo sin banner de entorno (porque `NEXT_PUBLIC_ENV=prod`).

- [ ] **Step 5: Ajustar NEXTAUTH_URL y NEXT_PUBLIC_APP_URL si la URL real no coincide**

Si Vercel asignó una URL distinta (ej. `bacheo-gran-mendoza-jbarrancogit.vercel.app`), actualizar esas dos vars en scope Production y redeploy.

---

## Fase 5 — CI + branch protection final

### Task 14: Crear workflow CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Crear directorio y archivo**

```bash
mkdir -p .github/workflows
```

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main, qa]

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
        env:
          DATABASE_URL: postgres://dummy:dummy@localhost/dummy
          NEXTAUTH_SECRET: "x".repeat(32)
          NEXTAUTH_URL: http://localhost:3000
          RESEND_API_KEY: dummy
          TURNSTILE_SECRET_KEY: dummy
          BLOB_READ_WRITE_TOKEN: dummy
          NEXT_PUBLIC_APP_URL: http://localhost:3000
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: dummy
          NEXT_PUBLIC_ENV: dev
```

Nota: `pnpm build` llama a `pnpm db:migrate` (según package.json). Drizzle-kit migrate contra URL dummy va a fallar. Mitigación: en Task 14.5 editamos el script para separar migrate del build.

- [ ] **Step 2: Ajustar package.json para que build NO corra migrate en CI**

Editar `package.json`, cambiar:
```json
"build": "pnpm db:migrate && next build",
```
a:
```json
"build": "next build",
"build:prod": "pnpm db:migrate && next build",
```

Y en Vercel (Settings → General → Build Command) configurar: `pnpm build:prod`.

Esto asegura que CI solo hace smoke test de build, y Vercel (que tiene DATABASE_URL real) corre las migraciones.

- [ ] **Step 3: Commit en feature branch**

```bash
git checkout -b feature/add-ci
git add .github/ package.json
git commit -m "ci: agregar workflow verify en PRs a main/qa"
git push origin feature/add-ci
```

- [ ] **Step 4: Abrir PR**

```bash
gh pr create --base main --head feature/add-ci \
  --title "ci: agregar workflow verify" \
  --body "Agrega GitHub Actions workflow que corre typecheck, lint, test y build en PRs a main y qa."
```

- [ ] **Step 5: Esperar que CI corra y pase**

```bash
gh pr checks --watch
```

Expected: `verify` pasa en verde.

- [ ] **Step 6: Merge del PR**

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 7: Actualizar Build Command en Vercel**

UI: Settings → General → Build Command → `pnpm build:prod` → Save.

Redeploy de main para aplicar cambio.

---

### Task 15: Activar status check requerido en ruleset de main

- [ ] **Step 1: Editar ruleset existente**

`gh repo view --web` → Settings → Rules → Rulesets → `protect-main` → Edit.

- [ ] **Step 2: Agregar el check "verify" como required**

En la sección "Require status checks to pass":
- Click "Add checks"
- Buscar: `verify`
- Seleccionar el check (ahora que corrió en el PR anterior, aparece).
- Save.

- [ ] **Step 3: Verificar**

```bash
gh api repos/jbarrancogit/bacheo-gran-mendoza/rulesets | jq '.[] | select(.name == "protect-main") | .rules'
```

Expected: encontrar `required_status_checks` con `verify` listado.

---

## Fase 6 — Verificación end-to-end

### Task 16: Verificar local

- [ ] **Step 1: Clean install desde cero**

```bash
cd bacheo-gran-mendoza
rm -rf node_modules .next
pnpm install
vercel env pull .env.local
pnpm dev
```

- [ ] **Step 2: Abrir http://localhost:3000**

Expected: home con banner "Entorno: DEV".

- [ ] **Step 3: Chequear que .env.local tiene las vars correctas**

```bash
grep NEXT_PUBLIC_ENV .env.local
```

Expected: `NEXT_PUBLIC_ENV=dev` (o `local` si así lo dejaste en Development scope).

---

### Task 17: Verificar deploy de dev

- [ ] **Step 1: Push a dev**

```bash
git checkout dev
git reset --hard main
git commit --allow-empty -m "chore: verificar deploy de dev"
git push --force origin dev
```

- [ ] **Step 2: Monitorear build**

```bash
vercel inspect --web
```

Seguir el deploy de la rama dev.

- [ ] **Step 3: Abrir URL de dev**

Usualmente: `bacheo-gran-mendoza-git-dev-jbarrancogit.vercel.app`.

Expected: home con banner "Entorno: DEV".

- [ ] **Step 4: Verificar que DATABASE_URL apunta a Neon dev**

Desde local, escribir una query de prueba en Neon UI (branch dev) y confirmar que Vercel dev la ve. Ej: insertar row en `health_check`, fetchear desde un endpoint temporal, ver el row.

---

### Task 18: Verificar deploy de qa

- [ ] **Step 1: Sync qa con main**

```bash
git checkout qa
git reset --hard main
git push --force-with-lease origin qa
```

- [ ] **Step 2: Monitorear build**

```bash
vercel inspect --web
```

- [ ] **Step 3: Abrir URL de qa**

Expected: `bacheo-gran-mendoza-git-qa-jbarrancogit.vercel.app` con banner "Entorno: QA".

- [ ] **Step 4: Verificar DB de qa**

Mismo procedimiento que dev pero contra Neon qa.

---

### Task 19: Verificar flujo PR → main

- [ ] **Step 1: Intentar push directo a main (debe fallar)**

```bash
git checkout main
git commit --allow-empty -m "test: push directo (debe fallar)"
git push origin main
```

Expected: rechazado por ruleset. Error tipo "protected branch".

- [ ] **Step 2: Resetear local**

```bash
git reset --hard origin/main
```

- [ ] **Step 3: Hacer PR dummy que debe pasar CI**

```bash
git checkout -b feature/smoke-pr-flow
git commit --allow-empty -m "test: smoke PR flow"
git push origin feature/smoke-pr-flow
gh pr create --base main --fill
gh pr checks --watch
```

Expected: `verify` pasa.

- [ ] **Step 4: Merge del PR**

```bash
gh pr merge --squash --delete-branch
```

- [ ] **Step 5: Verificar que Vercel redeploya prod**

```bash
vercel ls bacheo-gran-mendoza
```

Expected: nuevo deploy en main con status READY en ~2 min.

- [ ] **Step 6: Verificar aislamiento**

Ir a Neon UI y confirmar que los 3 branches tienen su propia copia de `health_check`. Las rows insertadas en dev no aparecen en qa ni main.

---

## Fase 7 — Documentación operativa

### Task 20: Escribir docs/ops/environments.md

**Files:**
- Create: `docs/ops/environments.md`

- [ ] **Step 1: Crear archivo con tabla viva**

```markdown
# Entornos

## URLs

| Entorno | URL | Rama Git | Neon branch | Propósito |
|---|---|---|---|---|
| Production | https://bacheo-gran-mendoza.vercel.app | main | main | Producción pública |
| QA | https://bacheo-gran-mendoza-git-qa-jbarrancogit.vercel.app | qa | qa | Staging antes de prod |
| Dev | https://bacheo-gran-mendoza-git-dev-jbarrancogit.vercel.app | dev | dev | Experimentos, móvil real |
| Local | http://localhost:3000 | cualquiera | dev | Desarrollo en la máquina |

## Flujo de ramas

```
feature/* --PR--> main (prod)
main      --push--> qa (sync on-demand)
main      --push --force--> dev (reset cada 1-2 semanas)
```

## Cómo promover

- **Feature a prod:** `gh pr create --base main --head feature/x` → esperar CI → `gh pr merge --squash`
- **Main a qa:** `git push origin main:qa --force-with-lease`
- **Reset dev:** `git checkout dev && git reset --hard main && git push --force origin dev`

## Cómo NO promover

- ❌ `git merge dev` hacia `main` o `qa`
- ❌ Cherry-picks entre ramas long-lived
- ❌ Push directo a `main` (bloqueado por ruleset)
```

- [ ] **Step 2: Ajustar URLs reales después de Task 11-13**

Reemplazar placeholders si las URLs asignadas difieren.

- [ ] **Step 3: Commit**

```bash
git checkout -b docs/ops-environments
git add docs/ops/
git commit -m "docs: agregar environments.md con URLs y flujo"
git push origin docs/ops-environments
gh pr create --base main --fill
gh pr merge --squash --delete-branch --auto
```

---

### Task 21: Escribir docs/ops/rotation.md

**Files:**
- Create: `docs/ops/rotation.md`

- [ ] **Step 1: Crear archivo**

```markdown
# Rotación de secretos

Proceso manual. Frecuencia: ad-hoc (cuando se sospecha fuga, o cada 6 meses).

## NEXTAUTH_SECRET

1. Generar nuevo: `openssl rand -base64 32`
2. Vercel UI → Settings → Environment Variables
3. Editar en el scope correspondiente (Production / Preview-qa / Preview-dev / Development)
4. Save → Redeploy el entorno afectado
5. **Efecto:** todas las sesiones activas se invalidan. Usuarios deben re-loginear.

## DATABASE_URL (Neon)

1. Neon UI → Branches → seleccionar branch → Reset password
2. Copiar nuevo connection string
3. Vercel UI → actualizar `DATABASE_URL` en el scope del entorno
4. Redeploy

## RESEND_API_KEY

1. Resend dashboard → API Keys → Create new key
2. Vercel UI → actualizar var en los scopes que usan la key (prod o qa+dev)
3. Redeploy
4. Resend dashboard → Revoke la key vieja (después de confirmar que nuevos deploys andan)

## TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY

Rotación conjunta obligatoria (site key y secret son pareja).
1. Cloudflare Turnstile → site → Rotate keys
2. Vercel UI → actualizar ambas vars en el scope
3. Redeploy

## BLOB_READ_WRITE_TOKEN

1. Vercel Storage → el store Blob → Settings → Rotate token
2. Vercel UI → actualizar var
3. Redeploy

## Checklist post-rotación

- [ ] Entorno afectado redeployado
- [ ] Smoke test: abrir la URL, loguearse (si aplica), confirmar que no hay 500
- [ ] Viejas keys revocadas (donde aplique)
```

- [ ] **Step 2: Commit vía PR**

```bash
git checkout -b docs/ops-rotation
git add docs/ops/rotation.md
git commit -m "docs: agregar procedimiento de rotación de secretos"
git push origin docs/ops-rotation
gh pr create --base main --fill
gh pr merge --squash --delete-branch --auto
```

---

## Criterio de éxito final

Al completar todas las tareas, el engineer debe poder demostrar:

- [ ] **Local:** `pnpm dev` corre y la home muestra banner "DEV"
- [ ] **Push a dev:** aparece el cambio en URL pública de dev en <2 min con banner "DEV"
- [ ] **Push a qa:** aparece el cambio en URL pública de qa con banner "QA"
- [ ] **PR → main:** CI corre, bloquea si falla, permite merge si pasa; Vercel redeploya prod automático
- [ ] **Aislamiento DB:** un `INSERT` en Neon dev no aparece en Neon qa ni main
- [ ] **Push directo a main:** rechazado por ruleset
- [ ] **Seed guard:** correr `pnpm db:seed:dev` con `NEON_BRANCH=main` falla con mensaje claro
- [ ] **Rotación documentada:** `docs/ops/rotation.md` existe y es ejecutable paso a paso

Si todo lo anterior cumple, el spec está implementado.

---

## Self-review del plan

**Spec coverage:**
- Sección 3 (Topología) → Tasks 8, 10, 11
- Sección 4 (Flujo de ramas) → Tasks 8 (crear ramas), 17-19 (verificación)
- Sección 5 (Datos) → Tasks 4-6 (guard, seeds, schema), 10 (Neon branches)
- Sección 6 (CI + protección) → Tasks 9, 14, 15, 19
- Sección 7 (Env vars) → Tasks 12, 16
- Sección 8 (Setup steps) → cubre todas las fases
- Sección 10 (Riesgos) → mitigaciones cubiertas: ruleset (Task 9, 15), seed guard (Task 4), .env.local gitignored (Task 1), feature branches a dev (Task 12 step 6)

**Placeholders:** sin TBDs en el plan. Las URLs reales se rellenan en Task 20 con los valores que Vercel asigne.

**Type consistency:** `assertNotMain(databaseUrl, neonBranch?)` definido en Task 4 es coherente con su uso en Task 5 (`scripts/seed.ts`, `scripts/reset.ts`). `loadServerEnv()` de Task 3 no se usa en el scaffold mínimo pero queda disponible para tasks futuras (schema real, endpoints).

**Gaps conocidos (deliberadamente fuera de scope):**
- No hay integración Vercel↔Neon native (auto-branch por PR): diferido según spec sección 5 ("fuera de scope inicial").
- No hay tests e2e: diferido según spec sección 6.
- No hay monitoring ni analytics: fuera de scope del spec.
