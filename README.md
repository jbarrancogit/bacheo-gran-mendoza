# Bacheo Gran Mendoza

App cívica para reportar baches y problemas viales del Gran Mendoza.

## Setup local

```bash
pnpm install
vercel link                   # una sola vez, asocia el repo a tu proyecto Vercel
vercel env pull .env.local    # baja las vars de Development
pnpm dev
```

Abrí http://localhost:3000 y deberías ver la home con el banner de entorno.

## Entornos

| Entorno     | URL                                    | Rama Git   | Neon branch |
|-------------|----------------------------------------|------------|-------------|
| Production  | TBD al linkear Vercel                  | `main`     | `main`      |
| QA          | TBD al linkear Vercel                  | `qa`       | `qa`        |
| Dev         | TBD al linkear Vercel                  | `dev`      | `dev`       |
| Local       | http://localhost:3000                  | cualquiera | `dev`       |

Ver `docs/ops/environments.md` para URLs reales una vez deployado.

## Scripts

| Script              | Qué hace                                        |
|---------------------|-------------------------------------------------|
| `pnpm dev`          | Dev server local                                |
| `pnpm build`        | Build de producción (sin migraciones)           |
| `pnpm build:prod`   | Build + migraciones (usado por Vercel)          |
| `pnpm typecheck`    | TypeScript strict check (`tsc --noEmit`)        |
| `pnpm lint`         | ESLint                                          |
| `pnpm test`         | Vitest (corrida única)                          |
| `pnpm test:watch`   | Vitest en modo watch                            |
| `pnpm db:push`      | Aplica schema a la DB (Drizzle)                 |
| `pnpm db:migrate`   | Corre migraciones generadas                     |
| `pnpm db:generate`  | Genera migración a partir del schema            |
| `pnpm db:seed:dev`  | Seeds para entorno dev (protegido contra main)  |
| `pnpm db:seed:qa`   | Seeds para entorno qa (protegido contra main)   |

## Arquitectura

Ver `docs/superpowers/specs/2026-04-20-bacheo-envs-design.md` para diseño de entornos y `docs/superpowers/plans/2026-04-20-bacheo-envs-setup.md` para el plan de setup.

## Requisitos

- Node >= 20
- pnpm >= 9
- Cuentas: Vercel, Neon, Resend, Cloudflare Turnstile
