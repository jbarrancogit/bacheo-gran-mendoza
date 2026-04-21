# Bacheo Gran Mendoza — Entornos dev / qa / prod en Vercel free

**Fecha:** 2026-04-20
**Estado:** Diseño aprobado, pendiente escribir plan de implementación
**Scope:** Setup de infraestructura de 3 entornos desplegados. No cubre código de la app.

---

## 1. Objetivo

Dejar operativos 3 entornos (dev, qa, prod) para el proyecto Bacheo Gran Mendoza, desplegados gratis en Vercel, aislados entre sí a nivel de código, datos y secretos, con flujo de promoción claro y CI mínimo que impida romper prod por accidente.

Criterio de éxito: al terminar la implementación del setup, debo poder:

1. Correr `pnpm dev` local contra la Neon branch `dev`.
2. `git push origin dev` y ver mis cambios en la URL pública de dev en menos de 2 minutos.
3. `git push origin main:qa --force-with-lease` y sincronizar qa con main.
4. Abrir PR `feature/*` → `main`, esperar que pase CI, mergear, y que prod deploye automático.
5. Confirmar que cada entorno ve su propia Neon branch y nunca se cruzan.

---

## 2. Decisiones tomadas

| # | Decisión | Opción elegida |
|---|---|---|
| 1 | Estructura Vercel | Un solo proyecto + ramas Git (patrón A) |
| 2 | Concepto de "dev" | Entorno desplegado + local (opción ii) |
| 3 | Flujo de ramas | Trunk-based simplificado |
| 4 | Estrategia de datos | Neon branches con seeds sintéticos versionados |
| 5 | CI + protección | Disciplinado: main protegida, CI en PR |
| 6 | Visibilidad del repo | Público |
| 7 | Dominios | `.vercel.app` ahora, custom al lanzar (semana 5-6) |
| 8 | Env vars | Todo en Vercel UI, `vercel env pull` para local |

---

## 3. Topología

Un proyecto Vercel, tres ramas Git long-lived, tres Neon branches.

```
GitHub: jbarrancogit/bacheo-gran-mendoza (público)

  feature/*  --PR-->
                    \
                     v
  dev         qa          main
  (push)      (PR)        (protegida)
     |           |              |
     v           v              v
  Vercel      Vercel         Vercel
  Preview     Preview        Production
  (dev)       (qa)           (main)
     |           |              |
     v           v              v
  Neon        Neon           Neon
  branch      branch         branch
  dev         qa             main
```

- **Production Branch de Vercel:** `main`.
- **Preview con branch tracking:** `qa` y `dev` tienen env vars filtradas por nombre de rama.
- **Feature branches:** Preview efímero automático, heredan env vars de Preview default (apuntan a Neon dev, compartida, aceptable en MVP).

---

## 4. Flujo de ramas y promoción

### Regla de oro

El único flujo de merge real es `feature/* → main`. `qa` y `dev` son espejos o laboratorios de `main`, no escalones obligatorios.

### Movimientos permitidos

| Desde | Hacia | Cómo | Frecuencia |
|---|---|---|---|
| `feature/*` | `main` | PR con CI verde, squash merge | Cada vez que hay feature lista |
| `main` | `qa` | `git push origin main:qa --force-with-lease` | On demand, antes de pruebas de staging |
| `main` | `dev` | `git reset --hard main && git push --force origin dev` | Cada 1-2 semanas para resetear dev |
| `hotfix/*` | `main` | PR urgente, mismo flujo que feature | Cuando hay incidente en prod |

### Movimientos NO permitidos

- Merge de `dev` a `qa` o a `main`. Si algo en `dev` sirve, se abre PR desde la feature branch original.
- Cherry-pick entre ramas long-lived.
- Push directo a `main` (bloqueado por ruleset).

### Reset periódico de `dev`

Cada 1-2 semanas, para evitar que `dev` se desincronice tanto que deje de ser útil:

```bash
git checkout dev
git reset --hard main
git push --force origin dev
```

---

## 5. Estrategia de datos

### Neon project

```
Neon project: bacheo-gran-mendoza
  branch: main   -> DATABASE_URL de Vercel Production
  branch: qa     -> DATABASE_URL de Vercel Preview(qa)
  branch: dev    -> DATABASE_URL de Vercel Preview(dev) y local
```

Tres branches de Neon (free tier permite 10, sobra). Sin clonado prod→qa en este scope.

### Seeds versionados

```
seed/
  schema.sql        # generado por Drizzle, autoritativo
  dev.ts            # seeds minimos: 5 reportes, 2 users, 1 admin
  qa.ts             # seeds realistas: 100 reportes en 6 deptos,
                    # 30 users, estados variados, edge cases
  prod.ts           # vacio (o 5 reportes sembrados al lanzar publico)
```

### Scripts npm

| Script | Accion |
|---|---|
| `pnpm db:push` | Aplica schema al branch apuntado por `DATABASE_URL` (Drizzle) |
| `pnpm db:seed:dev` | Truncate + reseed con `seed/dev.ts` |
| `pnpm db:seed:qa` | Truncate + reseed con `seed/qa.ts` |
| `pnpm db:reset:dev` | `db:push` + `db:seed:dev` (cuando dev se rompe) |

### Protecciones

1. Los scripts `db:seed:*` y `db:reset:*` chequean una env var `NEON_BRANCH` (o parsean `DATABASE_URL`) y **rechazan ejecución si apuntan a `main`**.
2. Las migraciones (`drizzle/*.sql`) se aplican automáticamente en build de Vercel mediante `drizzle-kit migrate` en el script `prebuild`. Esto corre en los 3 entornos.
3. Cambios de schema se prueban en orden `dev → qa → main`, nunca al revés.
4. Rollback de prod: Neon soporta point-in-time restore gratis hasta 24h atrás. Procedimiento: reset al snapshot previo + reaplicar migraciones correctas.

### Fuera de scope (diferido)

- Clonado prod→qa con scrubbing de PII: se evalúa cuando prod tenga >100 reportes reales. Requiere spec aparte.
- Backups más allá del point-in-time de 24h de Neon free tier.

---

## 6. CI y protección de ramas

### Workflow `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
    branches: [main, qa]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

### Branch protection (GitHub Rulesets)

| Rama | Direct push | Require PR | Require CI pass |
|---|---|---|---|
| `main` | bloqueado | si | si (check "verify") |
| `qa` | permitido (para force-push desde main) | no | no |
| `dev` | libre | no | no |

### Lo que NO corre en CI

- E2e contra DB real: Vercel Preview ya da un entorno desplegado probable a mano.
- Lighthouse / a11y: se suma si hace falta después.
- Deploy step: lo maneja Vercel solo vía su GitHub App. CI solo verifica.

### Flujo práctico de merge a main

```bash
gh pr create --base main --head feature/xyz
# esperar CI (~2 min)
gh pr merge --squash
# Vercel deploya automatico a prod
```

### Costo estimado GitHub Actions

~2 min por PR × ~5 PRs/semana = 40 min/mes. Free tier son 2000 min/mes.

---

## 7. Env vars y secretos

### Inventario por entorno

| Variable | Prod (main) | QA (qa) | Dev (dev + local) | Tipo |
|---|---|---|---|---|
| `DATABASE_URL` | Neon main | Neon qa | Neon dev | secret |
| `NEXTAUTH_SECRET` | random A | random B | random C | secret |
| `NEXTAUTH_URL` | prod URL | qa URL | dev URL | secret |
| `RESEND_API_KEY` | re_prod_* | re_test_* | re_test_* | secret |
| `TURNSTILE_SECRET_KEY` | prod key | test key | test key | secret |
| `BLOB_READ_WRITE_TOKEN` | prod token | qa token | dev token | secret |
| `NEXT_PUBLIC_APP_URL` | prod URL | qa URL | dev URL | public |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | prod key | test key | test key | public |
| `NEXT_PUBLIC_ENV` | `"prod"` | `"qa"` | `"dev"` | public |

### Scoping en Vercel UI

1. **Production:** environment = Production. Aplicadas al deploy de `main`.
2. **Preview (qa):** environment = Preview + branch filter = `qa`.
3. **Preview (dev):** environment = Preview + branch filter = `dev`.
4. **Preview default (feature branches):** environment = Preview sin branch filter, apuntando a Neon dev (compartido).
5. **Development:** environment = Development. Lo que baja `vercel env pull`.

### Flujo de local

```bash
vercel link                    # una sola vez
vercel env pull .env.local     # baja vars de Development
pnpm dev                       # usa .env.local
```

- `.env.local` gitignored siempre.
- `.env.example` commiteado con las keys sin valores, como documentación.

### Rotación de secretos

Manual, documentada en `docs/ops/rotation.md`:

- Se regenera el valor en el servicio origen (Resend / Turnstile / Neon / NextAuth).
- Se actualiza en Vercel UI (environment correspondiente).
- Se redeploya el entorno afectado.
- Sesiones existentes se invalidan si cambia `NEXTAUTH_SECRET` (aceptable).

### Fuera de scope

- Doppler / Infisical / AWS Secrets Manager.
- GitHub Secrets para la app (no necesitamos; CI no toca DB en este scope).
- `.env.production` / `.env.qa` en el repo.

---

## 8. Setup inicial — orden de pasos

Duración total estimada: ~90 min.

### 8.1 Repo GitHub (~10 min)

- Crear repo público `jbarrancogit/bacheo-gran-mendoza`.
- Push initial commit con scaffold Next.js + TypeScript + Drizzle.
- Crear ramas `dev` y `qa` desde `main`.
- Configurar Rulesets en Settings → Rules:
  - `main`: require PR + require status check "verify".
  - `qa` y `dev`: sin protección.

### 8.2 Neon project (~10 min)

- Crear project `bacheo-gran-mendoza`.
- Branch `main` viene por default.
- Crear branches `qa` y `dev` desde main (vacías).
- Guardar los 3 connection strings.

### 8.3 Vercel project (~15 min)

- Import repo desde GitHub.
- Framework preset: Next.js.
- Production Branch: `main` (default).
- Cargar env vars (tabla sección 7) en los 4 scopes: Production, Preview(qa), Preview(dev), Development.
- Primer deploy: push a main dispara build.

### 8.4 GitHub Actions (~15 min)

- Crear `.github/workflows/ci.yml` (sección 6).
- Probar con un PR dummy que CI corre y pasa.
- Activar "require status check: verify" en ruleset de `main`.

### 8.5 Verificación end-to-end (~20 min)

- Local: `vercel env pull .env.local` + `pnpm dev` levanta y conecta.
- `git push origin dev`: Vercel deploya a dev URL, abre OK.
- `git push origin main:qa --force-with-lease`: Vercel deploya a qa URL, abre OK.
- PR `feature/*` → `main`: CI pasa, merge, prod deploya, abre OK.
- Chequeo: cada entorno ve su Neon branch correcta (ej. insertar un row en dev, confirmar que no aparece en qa ni prod).

### 8.6 Documentación mínima (~20 min)

- `README.md` con setup local.
- `docs/ops/environments.md` con tabla de URLs y qué es cada entorno.
- `.env.example` con todas las keys.

---

## 9. Fuera de scope de este spec

Items deliberadamente no cubiertos, cada uno requiere su propio spec cuando se necesite:

- Custom domains (diferido a semana 5-6, tras decisión de nombre de marca).
- Monitoring / alerting (Sentry, logs estructurados).
- Analytics (Vercel Analytics, Plausible).
- Database backups más allá del point-in-time de Neon free (24h).
- Feature flags.
- Migración prod→qa con scrubbing de PII.
- Required reviewer en PRs (imposible con un solo committer).
- E2e tests contra DB real en CI.
- Smoke tests post-deploy.

---

## 10. Riesgos conocidos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Push accidental de secreto al repo | Media | Alto | `.gitignore` estricto + `.env.example` sin valores + gitleaks opcional |
| Merge accidental a main sin tests | Baja | Alto | Ruleset de GitHub bloquea sin CI verde |
| Seed contra DB de prod | Baja | Crítico | Script chequea `NEON_BRANCH` y rechaza si es main |
| Desincronización dev vs main | Alta | Bajo | Reset periódico de dev cada 1-2 semanas |
| Feature branch pega a DB qa | Media | Medio | Preview default apunta a Neon dev, no a qa |
| Exceso de Neon storage (500 MB free) | Baja | Medio | Monitoreo manual de tamaño; purgar datos de dev |
| GitHub Actions minutes exceed | Muy baja | Bajo | 40 min/mes vs 2000 disponibles |

---

## 11. Referencias

- Vercel environments docs: https://vercel.com/docs/deployments/environments
- Neon branching: https://neon.tech/docs/introduction/branching
- GitHub Rulesets (free tier private repos): desde 2023, disponibles en todos los planes.
- FixMyStreet UK (referencia de modelo para Bacheo): https://www.fixmystreet.com/
