# Rotación de secretos

Proceso manual. Frecuencia: ad-hoc (cuando se sospecha fuga) o cada 6 meses como higiene.

## NEXTAUTH_SECRET

1. Generar nuevo: `openssl rand -base64 32`
2. Vercel UI → Settings → Environment Variables
3. Editar `NEXTAUTH_SECRET` en el scope correspondiente (Production / Preview-qa / Preview-dev / Development)
4. Save → Redeploy el entorno afectado
5. **Efecto:** todas las sesiones activas se invalidan. Usuarios deben re-loginear.

## DATABASE_URL (Neon)

1. Neon UI → Branches → seleccionar branch → Reset password
2. Copiar nuevo connection string
3. Vercel UI → actualizar `DATABASE_URL` en el scope del entorno
4. Redeploy

## RESEND_API_KEY

1. Resend dashboard → API Keys → Create new key (anotar nombre con fecha)
2. Vercel UI → actualizar var en los scopes que usan la key (prod usa una, qa+dev comparten una test)
3. Redeploy
4. Resend dashboard → Revoke la key vieja (después de confirmar que nuevos deploys andan)

## TURNSTILE_SECRET_KEY + NEXT_PUBLIC_TURNSTILE_SITE_KEY

Rotación conjunta obligatoria: site key y secret son pareja.

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
- [ ] Anotar fecha de rotación en este doc (opcional, histórico)

## Historial

| Fecha      | Entorno | Key rotada | Razón       |
|------------|---------|------------|-------------|
| _ninguna_  | -       | -          | -           |
