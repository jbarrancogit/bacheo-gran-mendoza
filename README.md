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

## Provisionar Neon (slice 1 backend)

Hasta que Neon esté provisionado, la app corre en **modo demo** con `lib/mock-data.ts`. La capa de datos detecta si `DATABASE_URL` está seteada y elige fuente automáticamente.

```bash
# 1. Instalar Neon desde el Marketplace de Vercel (provisión + auto-env)
vercel marketplace add neon          # o desde https://vercel.com/marketplace/neon
vercel link                          # si todavía no está linkeado
vercel env pull .env.local           # trae DATABASE_URL al .env.local

# 2. Generar y aplicar migraciones
pnpm db:generate                     # crea drizzle/0000_*.sql desde lib/db/schema.ts
pnpm db:migrate                      # aplica las migraciones a Neon
pnpm db:seed:dev                     # opcional: poblar reportes de prueba

# 3. Correr local con DB real
pnpm dev
```

Con `DATABASE_URL` seteada en producción, los Server Actions persisten reportes reales y `/reportes` y `/reportes/[id]` leen desde Neon. Sin la variable, la app sigue mostrando los reportes mock — útil para preview deployments sin DB.

### Variables de entorno relevantes

| Variable | Obligatoria | Para qué |
|---|---|---|
| `DATABASE_URL` | sí (prod/qa/dev) | Neon Postgres (Drizzle). Sin ella, modo demo. |
| `TURNSTILE_SECRET_KEY` | recomendada | Validación anti-bot del form de reporte. Sin ella, se acepta sin captcha. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | recomendada | Site key client-side del widget Turnstile. |
| `RESEND_API_KEY` | slice 2 | Magic-link auth (todavía no implementado). |
| `BLOB_READ_WRITE_TOKEN` | slice 2 | Vercel Blob para fotos reales (slice 1 acepta sin foto). |

## Estado del MVP

- ✅ UI v2 completa (home, mapa, wizard de reporte, lista, detalle)
- ✅ Mapa Leaflet con polígonos de los 6 municipios y markers de reportes
- ✅ Server Action `createReport` con Zod + Turnstile + point-in-polygon
- ✅ Schema Drizzle de las 7 tablas (`users`, `reports`, `report_photos`, `votes`, `status_events`, `magic_link_tokens`, `health_check`)
- ✅ Capa de datos `lib/data/reports.ts` con fallback a mock
- 🟡 Magic-link auth — slice 2
- 🟡 Upload de foto a Vercel Blob — slice 2
- 🟡 Panel oficial municipal — post-MVP

Ver `docs/superpowers/specs/2026-04-25-mvp-decisions.md` para las decisiones de diseño detrás del MVP.
