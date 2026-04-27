# Sprint 4 — Kickoff (frontend slice)

**Fecha de inicio**: 2026-04-26
**Documento canónico**: [`marketplace-api/docs/sprint4-kickoff.md`](../../marketplace-api/docs/sprint4-kickoff.md)

Este archivo es la vista frontend-céntrica del kickoff. Para alcance completo, calendario, asignaciones y decisiones bloqueantes ver el doc canónico.

## Backlog frontend del sprint

Heredado del audit Sprint 2 (`sprint2-ux-audit.md`):

| ID | Item | Severidad audit | Archivos |
|---|---|---|---|
| UX-1 | Dark-mode pass `dashboard/cliente/page.tsx` (#1, #2, #3) | Blocker | `src/app/(protected)/dashboard/cliente/page.tsx` |
| UX-2 | Dark-mode pass `dashboard/proveedor/pendiente/page.tsx` (#28) | Blocker | `src/app/(protected)/dashboard/proveedor/pendiente/page.tsx` |
| UX-3 | Links `/services/*` → `/servicios/*` (#39, #40) | Major (functional) | `src/app/(protected)/dashboard/cliente/page.tsx` |
| UX-4 | Tokens off-brand: `bg-blue-600` → `bg-primary`, theme color por contexto (#5, #7, #29) | Major | múltiples |
| UX-5 | Form correctness: `valueAsNumber: true`, `htmlFor`/`id`, fix `getWorkZones` (#22, #23, #24) | Major (functional) | `proveedor/servicios/page.tsx`, `proveedor/negocio/page.tsx` |
| UX-6 | Extraer `src/lib/status-config.ts` (#46) | Major (maintenance) | nuevo |
| UX-7 | Promover `<EmptyState>`, `<Skeleton>`, `<Select>` (#31, #44) | Minor → patrón | `src/components/ui/` |
| UX-8 | Homepage "Top Pros" — criterio `rating ≥ 4.5 && totalReviews ≥ 5 && verificationStatus === 'VERIFIED'`; fallback relajado si <3 califican; ocultar sección si <1 (cubre Q3.b — completedJobs sigue stub `0` hasta Sprint 5) | Major (UX/funcional) | `src/components/features/home/` |

## Convención de ramas (frontend)

- `feature/sprint4-ux-dark-mode` (UX-1, UX-2)
- `feature/sprint4-ux-tokens` (UX-3, UX-4)
- `feature/sprint4-ux-forms` (UX-5)
- `feature/sprint4-ux-shared` (UX-6, UX-7)
- `feature/sprint4-ux-home-toppros` (UX-8 — depende de HU-Q3.a + HU-Q3.b mergeadas en backend)

## Coordinación con backend

El frontend consume contratos resueltos del Sprint 4 backend:
- **HU-Q3.a (provider DTO)**: nuevos campos `timezone`, `currency`, `isActive` en `ApiProvider` — actualizar `src/types/api.ts`
- **HU-Q3.b (completedJobs stub)**: `completedJobs` queda en `0` hasta Sprint 5; UX-8 usa criterio alternativo
- **HU-Q1 (reviews)**: `getReviewsByProviderId` ya alineado con `GET /reviews?providerId=`
- **HU-Q2.b (work-zones)**: el adapter recibe ahora tuples planas `(city, neighborhood, postalCode)` — listo para chips/badges
- **F7 (catalog)**: paginación normalizada `{ data, meta }` y alias `?featured=true`

## Inputs pendientes (frontend)

- [ ] `ux-ui-designer` confirma tokens definitivos para los Blockers de dark-mode (UX-1, UX-2)
- [ ] `qa-testing` agenda regresión visual en cada PR de UX
- [ ] Coordinar con `backend-dev` la actualización de `src/types/api.ts` cuando cada HU-Q* mergee