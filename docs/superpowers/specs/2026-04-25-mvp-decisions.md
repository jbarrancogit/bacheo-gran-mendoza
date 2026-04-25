# Bacheo Gran Mendoza — MVP design decisions

**Status:** ratified
**Date:** 2026-04-25
**Context:** El brainstorming formal quedó pausado en Q4 (`SESSION-STATE.md`). La UI v2 (`feature/screens-v2`) avanzó con un set de decisiones implícitas. Este doc las blanquea para destrabar el backend slice (opción B). Decisiones futuras (privacidad de fotos avanzada, panel municipal, observabilidad) quedan fuera del MVP y se brainstormean cuando toquen.

Decisiones ya ratificadas previamente (`SESSION-STATE.md`):
- Q1: scope = infraestructura vial extendida (6 categorías).
- Q2: modelo municipal híbrido (adversarial día 1, panel oficial opcional).
- Q3: alcance = 6 departamentos del Gran Mendoza.

## Decisiones MVP que toma este doc

### 1. Identidad del vecino (Q4): magic-link OPCIONAL post-reporte

- El reporte se crea sin login: foto + GPS + categoría + descripción + Turnstile invisible.
- Devuelve un código `MZA-xxxxx` y un CTA opcional para registrarse y "seguir el reclamo" vía magic-link Resend.
- LocalStorage `anonymous_token` permite ver mis reportes desde el mismo browser sin login.
- Al registrarse, los reportes anónimos del device se "claiman" automáticamente.
- **Razón:** separa CAPTURA (fricción cero) de ENGAGEMENT (fricción aceptable porque da valor). Patrón validado por FixMyStreet UK.

### 2. Privacidad de fotos (Q5): MVP sin blur server-side

- Para el MVP: aceptamos la foto tal cual la sube el vecino, sin blur automático de caras/patentes.
- Mensaje en el wizard: "Evitá que aparezcan caras o patentes."
- Moderación admin manual elimina fotos problemáticas.
- **Razón:** el costo en latencia y servicio (ej. Rekognition / Vision) es alto para el MVP. Riesgo aceptable con disclaimer + moderación.
- **Futuro:** evaluar blur server-side cuando haya volumen real (>500 reportes/semana) o reclamo legal.

### 3. Anti-spam y moderación (Q6): captcha + rate limit + dedup

- **Cloudflare Turnstile invisible** en el form de creación.
- **Rate limit por IP**: 5 reportes / 24h (configurable).
- **Validación GPS**: el punto debe caer dentro del polígono de uno de los 6 deptos del Gran Mendoza. Si no, rechazo con mensaje "Fuera del Gran Mendoza".
- **Dedup soft**: si hay un reporte misma categoría + radio 50m + última semana, sugerir "yo también lo vi" antes de duplicar.
- **Moderación comunitaria**: votos `also_saw` (suma señal) y `not_real` (resta señal). Reportes con mucho `not_real` van a cola de revisión admin.
- **Moderación admin**: panel `/admin` (no MVP público) con cola, soft-delete, ban por IP.

### 4. Ciclo de vida del reclamo (Q7)

Estados: `enviado` → `recibido` → `en_obra` → `resuelto` → `cerrado`.

- `enviado`: creado por vecino, automático.
- `recibido`: panel oficial municipal marcó visto, o admin manual. SLA: 7 días.
- `en_obra`: panel oficial o admin manual. SLA: 30 días.
- `resuelto`: panel oficial o admin manual. Vecinos pueden marcar "no resuelto" en 14 días para reabrir.
- `cerrado`: automático 14 días después de `resuelto` sin reclamo.

Cada cambio genera un `status_event` con timestamp + actor + detalle.

### 5. Stack técnico (Q8)

- **Frontend:** Next.js 15 App Router, React 19, Tailwind v4, shadcn/ui, framer-motion.
- **DB:** Neon Postgres con Drizzle ORM. Driver: `@neondatabase/serverless`.
- **Storage de fotos:** Vercel Blob (público, URL directa).
- **Mapa:** Leaflet + react-leaflet + OSM tiles. (ya implementado en `/mapa`).
- **Auth:** Magic-link via Resend, sesión en cookie HTTP-only firmada (sin NextAuth.js para MVP — overkill).
- **Anti-bot:** Cloudflare Turnstile (variable `TURNSTILE_SECRET_KEY`).
- **PWA:** sí, mobile-first. Service worker de caché básico, sin offline-write para MVP.
- **Compresión client-side de fotos:** sí, `browser-image-compression` antes de subir.
- **Geo:** lat/lng como `numeric(9,6)`. No PostGIS para MVP (point-in-polygon resuelto en JS con turf.js).

### 6. Modelo de datos (Q9) — ver `lib/db/schema.ts`

Tablas:
- `users` (id, email, created_at, last_login_at, role)
- `reports` (id, code MZA-xxxxx, category, status, lat, lng, depto, address_text, description, owner_id nullable, anonymous_token nullable, created_at, also_saw_count denormalizado)
- `report_photos` (id, report_id, blob_url, blob_pathname, order, created_at)
- `votes` (user_id|anon_id, report_id, kind: also_saw|not_real, created_at) — uniq por (vecino, report, kind)
- `status_events` (id, report_id, from_status, to_status, actor_id nullable, actor_role, detail, created_at)
- `magic_link_tokens` (token, email, expires_at, used_at)

Índices:
- `reports.code` (unique)
- `reports(depto, status, created_at desc)` — feed por municipio
- `reports(category, created_at desc)` — feed por categoría
- `reports(lat, lng)` — para dedup espacial básico (escaneo + filter)

### 7. Nombre y dominio (Q10): "Bacheo Gran Mendoza"

- Marca verbal: **Bacheo Gran Mendoza**.
- Dominio futuro: `bacheo.com.ar` o similar (decisión pendiente cuando salga del free tier de Vercel).
- Tono visual: tipografía display bold + acento naranja Mendoza (`primary-500: #ea580c`).

### 8. Routing automático al municipio (Q13)

- En cada `createReport`, server hace point-in-polygon contra los 6 polígonos (`public/data/gran-mendoza.geojson`) con turf.js.
- Si cae fuera → reject (fuera de scope).
- Si cae adentro → graba `depto` en el reporte. NO se envía email aún al municipio en MVP (el panel oficial es feature post-MVP).

### 9. "Yo también lo vi" (Q14)

- Botón en `/reportes/[id]` y en el popup del mapa.
- Anónimo: usa `anonymous_token` de LocalStorage. Auth: usa user_id.
- Uniq por (vecino, report, kind=also_saw). Idempotente.
- Suma denormalizada en `reports.also_saw_count` (trigger o app-level).

## Fuera de scope explícito del MVP

- Panel oficial municipal con check azul (Q15) — post-MVP, requiere outreach.
- Observabilidad y métricas avanzadas (Q16) — Vercel Analytics base es suficiente.
- Lanzamiento y prensa (Q17) — etapa posterior cuando haya 50+ reportes sembrados.
- Notificaciones push para usuarios registrados — solo email transaccional vía Resend.
- Comentarios en reportes — solo votos `also_saw`/`not_real`.
- Mapa con clustering — solo markers individuales para MVP (≤500 markers visibles).

## Plan de implementación inmediato (este branch)

1. ✅ `lib/db/schema.ts` real con las 6 tablas.
2. ✅ `pnpm db:generate` + commit de `drizzle/0001_*.sql`.
3. ✅ `lib/data/reports.ts` con DB-or-mock según `DATABASE_URL`.
4. ✅ Server Action `app/reportar/_actions.ts` con Zod + Turnstile + point-in-polygon.
5. ✅ Wizard de reporte invoca el server action en el último paso.
6. ✅ `/reportes` y `/reportes/[id]` consumen `lib/data/reports.ts`.
7. ✅ README documentando provision de Neon + Vercel Blob + Resend + Turnstile.
8. ⚪ Magic-link auth — slice 2.
9. ⚪ Vecino claiming + LocalStorage flow — slice 2.
10. ⚪ Upload de foto a Vercel Blob — slice 2 (mock URL en slice 1).

Lo marcado ✅ en este sub-listado es el alcance del slice 1 que se ataca ahora.
