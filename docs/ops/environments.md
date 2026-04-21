# Entornos

## URLs

| Entorno     | URL                                                                | Rama Git   | Neon branch | Propósito                   |
|-------------|--------------------------------------------------------------------|------------|-------------|-----------------------------|
| Production  | TBD (se completa después del primer deploy)                        | `main`     | `main`      | Producción pública          |
| QA          | TBD (se completa después del primer deploy)                        | `qa`       | `qa`        | Staging antes de prod       |
| Dev         | TBD (se completa después del primer deploy)                        | `dev`      | `dev`       | Experimentos, móvil real    |
| Local       | http://localhost:3000                                              | cualquiera | `dev`       | Desarrollo en la máquina    |

> Actualizar las URLs TBD después de correr las Tasks 11-13 del plan de setup.

## Flujo de ramas

```
feature/* --PR--> main (prod)
main      --push --force-with-lease--> qa (sync on-demand)
main      --reset --hard / push --force--> dev (reset cada 1-2 semanas)
```

## Cómo promover

- **Feature a prod:**
  ```bash
  gh pr create --base main --head feature/x
  gh pr checks --watch    # esperar CI verde
  gh pr merge --squash --delete-branch
  ```
- **Main a qa:**
  ```bash
  git push origin main:qa --force-with-lease
  ```
- **Reset dev:**
  ```bash
  git checkout dev
  git reset --hard main
  git push --force origin dev
  ```

## Cómo NO promover

- ❌ `git merge dev` hacia `main` o `qa` — se resetea main y rompe todo.
- ❌ Cherry-picks entre ramas long-lived.
- ❌ Push directo a `main` — bloqueado por ruleset.

## Aislamiento verificado

Cada entorno tiene:
- Su propia Neon branch (datos aislados).
- Su propio `NEXTAUTH_SECRET` (sesiones no se cruzan).
- Su propio `NEXT_PUBLIC_ENV` (banner visual en la UI: DEV/QA; prod sin banner).

Para verificar aislamiento: insertar row en Neon dev UI, confirmar que no aparece en qa ni main.
