# Sprint 2 UX / UI Audit

Branch: `feature/sprint2-providers-catalog`
Auditor: UI/UX review (design-only, no code changes)
Date: 2026-04-19

## 1. Summary

Sprint 2 ships a lot of surface area (public catalog, provider profile, both role dashboards, onboarding wizard) and the overall visual direction is coherent: the same card / shadow / radius / Material Symbols vocabulary is used end-to-end, dark mode is attempted on most screens, and the provider dashboard correctly leans on the orange palette while client/public surfaces stay blue. However, the brand-theme contract established in Sprint 1 is leaking in several spots — most notably `/dashboard/cliente` (which is hard-coded to light slate with `bg-background-light` and never pairs `dark:` variants), the `solicitudes` and `nueva-solicitud` sub-screens (which still use `bg-blue-600` primary CTAs instead of the `primary` token), and the provider dashboard home (which mixes `text-blue-500` accents in an otherwise orange context). Typography is mostly consistent (`text-2xl font-extrabold` for H1, Inter sans) but H1 copy alternates between `text-zinc-800 dark:text-zinc-100` and `text-slate-900` with no dark pair. Loading skeletons and empty states are present on nearly every async view, which is good. The biggest risks before ship are (a) dark-mode regressions on the client dashboard, (b) theme-color bleed between client blue and provider orange, and (c) duplicated status-badge / form-select styles that should be extracted.

## 2. Findings

Severity scale: Blocker > Major > Minor > Nit.

| # | File | Line / section | Issue | Severity | Suggested fix |
|---|------|----------------|-------|----------|---------------|
| 1 | `src/app/(protected)/dashboard/cliente/page.tsx` | L86 `bg-background-light` | Container forces a light-mode token. In dark mode the page renders on light background while sidebar is dark. | Blocker | Replace with `bg-slate-50 dark:bg-zinc-950` or drop — layout already supplies bg. |
| 2 | `src/app/(protected)/dashboard/cliente/page.tsx` | L87–L350 (entire page) | Hardcoded `text-slate-900`, `bg-white`, `border-slate-200`, `bg-slate-100`, `bg-slate-50`, `text-slate-500` — zero `dark:` variants on cards, modal, tabs, stats, promo block. Dark mode effectively unreachable here. | Blocker | Pair every `bg-white` → `bg-white dark:bg-zinc-900`, `text-slate-900` → `text-zinc-800 dark:text-zinc-100`, `border-slate-200` → `border-slate-200 dark:border-zinc-800`, `bg-slate-50` → `bg-slate-50 dark:bg-zinc-800/50`. |
| 3 | `src/app/(protected)/dashboard/cliente/page.tsx` | L332 cancel modal | `bg-black/40` backdrop + white card with no dark variant. Modal stays white on dark. | Blocker | Add `dark:bg-zinc-900 dark:text-zinc-100` on card, `dark:border-zinc-800` on dividers. |
| 4 | `src/app/(protected)/dashboard/cliente/page.tsx` | L67–L73 `badgeClass` map | Status badges use only light-mode classes (`bg-blue-100 text-blue-800` …). | Major | Add `dark:bg-blue-900/40 dark:text-blue-300` variants (pattern already used correctly in `solicitudes/page.tsx` L18–L23). Extract to shared util. |
| 5 | `src/app/(protected)/dashboard/cliente/solicitudes/page.tsx` | L77 "Nueva" button | Uses literal `bg-blue-600 hover:bg-blue-700` instead of the `primary` token. | Major | Replace with `bg-primary hover:bg-primary-dark` or the `<Button>` component. |
| 6 | `src/app/(protected)/dashboard/cliente/solicitudes/[id]/page.tsx` | L129 back link | Uses a literal left-arrow glyph in the copy while every other back-link uses `arrow_back` Material Symbol. | Minor | Swap to `<span className="material-symbols-outlined">arrow_back</span>`. |
| 7 | `src/app/(protected)/dashboard/proveedor/page.tsx` | L179, L195 | Provider dashboard icons use `text-blue-500` for `work` and `timeline`. Provider context should lean orange. | Major | Change to `text-orange-500`. Keep blue only for "incoming client traffic" semantics if needed. |
| 8 | `src/app/(protected)/dashboard/proveedor/page.tsx` | L109 greeting | Contains a hand-wave emoji in H1. Codebase standard is Material Symbols only. | Minor | Use `<span className="material-symbols-outlined">waving_hand</span>` or drop. |
| 9 | `src/app/(protected)/dashboard/proveedor/page.tsx` | L241 "Ver todos →" | Literal arrow glyph; elsewhere `arrow_forward` icon. | Nit | Swap to Material Symbol. |
| 10 | `src/app/(protected)/dashboard/proveedor/page.tsx` | L118–L131 availability toggle | Uses raw string concatenation instead of `cn()`. Diverges from rest of file. | Nit | Use `cn(...)` and existing tokens. |
| 11 | `src/app/(public)/servicios/page.tsx` | L32 hero | Blue gradient correct for public surface. | OK | — |
| 12 | `src/app/(public)/servicios/page.tsx` | L49 search input | `focus:ring-4 focus:ring-blue-300/30` hardcoded; Sprint 1 defined global focus ring. | Minor | Use `focus-visible:ring-2 focus-visible:ring-primary/40`. |
| 13 | `src/app/(public)/servicios/page.tsx` | L72, L144 | Empty-state text `text-zinc-500` with no `dark:` pair — recurs throughout the file. | Minor | Normalise to `text-zinc-500 dark:text-zinc-400`. |
| 14 | `src/app/(public)/servicios/[slug]/page.tsx` | L90 breadcrumb "Proveedores" | Breadcrumb label says "Proveedores" in `proveedores/[id]/page.tsx` L90 but link goes to `/servicios`. Confusing naming. | Major | Breadcrumb to a provider profile should read `Inicio > Proveedores > {name}` pointing to a `/proveedores` index. |
| 15 | `src/app/(public)/proveedores/[id]/components/ReviewsList.tsx` | L62 avatar gradient | Reviewer avatar uses blue gradient on a provider profile (orange context). | Minor | Use neutral gray or `from-orange-400 to-orange-600`. |
| 16 | `src/app/(public)/proveedores/[id]/components/ReviewsList.tsx` | L88 reply border | Reply block uses `border-orange-300 dark:border-orange-700`. Semantically correct. | OK | — |
| 17 | `src/app/(public)/proveedores/[id]/components/ServicesList.tsx` | L37 price | Price text is blue on a provider profile. Mixed signal. | Minor | Decide and document: public numeric highlight = blue OR provider-page highlight = orange. |
| 18 | `src/app/(public)/proveedores/[id]/components/ProviderHeader.tsx` | L23–L33 badges | Badge styles consistent with rest of codebase. | OK | — |
| 19 | `src/app/(public)/proveedores/[id]/page.tsx` | L107 active tab underline | Blue underline; consistent with page. | OK | — |
| 20 | `src/app/(protected)/dashboard/proveedor/mensajes/page.tsx` | L89 container | `min-h-[calc(100vh-16rem)]` is a magic offset; layout already subtracts `h-16`. | Minor | Use `min-h-[calc(100vh-4rem)]` or flex-based height. |
| 21 | `src/app/(protected)/dashboard/proveedor/mensajes/page.tsx` | L199 input focus ring | `focus:ring-2 focus:ring-orange-500/30`. | Minor | `focus-visible:ring-2 focus-visible:ring-orange-500/40` + `focus:outline-none`. |
| 22 | `src/app/(protected)/dashboard/proveedor/negocio/page.tsx` | L92–L97 `loadExtras` | `getAvailability` called twice (once for availability, once labelled "work zones"); `setZones([])` means zones never persist on reload. | Major (functional) | Call the actual `getWorkZones` service. Surfaces as a UX bug. |
| 23 | `src/app/(protected)/dashboard/proveedor/negocio/page.tsx` | L195, L208 labels | `<label>` without `htmlFor` / nested input on textarea & select — screen readers won't announce. | Major | Add `htmlFor` + `id` pairs. Same in `servicios/page.tsx` L139, L151. |
| 24 | `src/app/(protected)/dashboard/proveedor/servicios/page.tsx` | L149, L163, L204 | `type="number"` with `register("price")` — RHF returns string, Zod expects number. Validates silently. | Major (functional) | Use `register("price", { valueAsNumber: true })`. Same on `estimatedDuration`, `hourlyRate`, `workRadius` in `negocio/page.tsx`. |
| 25 | `src/app/(protected)/dashboard/proveedor/servicios/page.tsx` | L248–L259 delete confirm | Inline confirm with `bg-red-50 hover:bg-red-100`, no dark variants. | Minor | Add `dark:bg-red-950/30 dark:text-red-300`, or match the modal pattern from `cliente/page.tsx`. |
| 26 | `src/app/(protected)/dashboard/proveedor/agenda/page.tsx` | L20–L25 mockBookings | Each booking hardcodes a full Tailwind string per color. | Minor | Extract to `BOOKING_COLORS` map. |
| 27 | `src/app/(protected)/dashboard/proveedor/agenda/page.tsx` | L96 `min-w-[700px]` | Forces horizontal scroll below 700px without affordance. | Minor | Add `scrollbar-thin` + gradient mask, or collapse to day-list on `<sm`. |
| 28 | `src/app/(protected)/dashboard/proveedor/pendiente/page.tsx` | L8–L54 whole file | Zero `dark:` variants; reached right after onboarding, so dark-mode users see full-white flash. | Blocker | Pair every color with dark variant. |
| 29 | `src/app/(protected)/dashboard/proveedor/pendiente/page.tsx` | L25, L30, L34, L38 | Uses `text-primary` (blue) on a provider-context confirmation page. Wrong brand. | Major | Swap to `text-orange-500` / `text-orange-600`. |
| 30 | `src/app/(protected)/perfil/onboarding/page.tsx` | L35 redirect | Redirects to `/dashboard/proveedor/pendiente` which has the issues above. | Minor (reference) | Fix target (see #28, #29). |
| 31 | `src/components/features/onboarding/steps/ServicesSelectionStep.tsx` | L153 select | Raw `<select>` repeated in 4+ files with no shared component. | Minor | Extract a `Select` CVA component. Fixes dark-mode + error states simultaneously. |
| 32 | `src/components/features/onboarding/steps/DocumentsStep.tsx` | L108 "URL del documento" | Step titled "subí tus documentos" but input is a free-text URL. Misleading. | Major (UX) | Replace with `<input type="file">` styled as drag-drop, OR rename label to "Enlace al documento (URL)". |
| 33 | `src/components/features/onboarding/steps/AvailabilityStep.tsx` | L70–L75 day pills | `w-12 h-12` with 2-letter labels (`Mi`, `Ju`) can read ambiguously. | Nit | Use `w-14` on `sm:` with tooltip showing full label. |
| 34 | `src/components/features/onboarding/StepIndicator.tsx` | L55–L59 | Desktop labels `hidden lg:inline` — `md:` viewports show only numbered circles. | Minor | Show labels from `md:` up (or abbreviated labels). |
| 35 | `src/app/(protected)/dashboard/cliente/nueva-solicitud/page.tsx` | L88–L182 | Wrapper relies on parent layout for bg — consistent. | OK | — |
| 36 | `src/app/(protected)/dashboard/cliente/nueva-solicitud/page.tsx` | L120–L123 selected category | `bg-primary/5 dark:bg-primary/10` + `text-primary` — correct token usage. | OK | — |
| 37 | Public pages sibling max-widths | `servicios/page.tsx`, `[slug]/page.tsx`, `proveedores/[id]/page.tsx` | `max-w-5xl` / `max-w-6xl` / `max-w-4xl` used unevenly. | Minor | Pick two: `max-w-6xl` for list/grid, `max-w-4xl` for detail. Document. |
| 38 | `src/app/(public)/proveedores/[id]/components/ProviderHeader.tsx` | L15 avatar gradient | Uses `bg-gradient-to-br ${provider.avatarColor}` with dynamic Tailwind class. Risk of JIT purge. | Minor | Safelist, use inline `style`, or switch to a fixed palette keyed off initials. |
| 39 | `src/app/(protected)/dashboard/cliente/page.tsx` | L274–L278 category links | `href="/services/plomeria"` (English) — canonical route is `/servicios/...`. Broken links. | Major (functional) | Change all to `/servicios/...`. |
| 40 | `src/app/(protected)/dashboard/cliente/page.tsx` | L285 "Ver todas" link | Points to `/services`. Same issue. | Major (functional) | Change to `/servicios`. |
| 41 | Dashboard layouts | `cliente/layout.tsx` vs `provider-dashboard/ProviderDashboardLayout.tsx` | Sidebar label is `Mi cuenta` vs `Dashboard`. Tone mismatch. | Nit | Pick one voice (e.g. `Mi cuenta` / `Mi negocio`). |
| 42 | `src/app/(protected)/dashboard/cliente/page.tsx` | L86 | Applies `p-4 md:p-8` inside a layout already at `p-6 lg:p-8` — double padding on `md:`. | Minor | Remove outer padding; rely on layout. |
| 43 | `cliente/solicitudes/page.tsx` vs `cliente/page.tsx` | L74 / L92 | "Mis Solicitudes" view exists in two places: home lists active requests inline, `/solicitudes` also lists requests. IA duplication. | Major (UX) | Home should be a digest (top N + link), or remove `/solicitudes` and deep-link via query params. |
| 44 | `src/app/(public)/proveedores/[id]/page.tsx` | L76 back link | `text-blue-600 hover:text-blue-700` literal. | Nit | `text-primary hover:text-primary-dark`. |
| 45 | `src/components/features/onboarding/steps/WorkZonesStep.tsx` | L132–L137 CP + Add | `flex gap-2` Input + square `+` button — on mobile Input shrinks to ~60px. | Minor | Stack below `sm:` or fix button width. |
| 46 | Status/urgency badge maps across files | `cliente/solicitudes/page.tsx`, `cliente/solicitudes/[id]/page.tsx`, `proveedor/oportunidades/page.tsx`, `proveedor/reservas/page.tsx`, `proveedor/page.tsx`, `cliente/page.tsx` | Same dictionaries re-declared 5+ times with tiny variations. | Major (maintenance) | Extract to `src/lib/status-config.ts` with `{ label, color, icon }`. Removes ~100 lines; forces consistency. |
| 47 | `src/app/(protected)/dashboard/cliente/page.tsx` | L300 avatar | Tinted-flat `bg-primary/10`; elsewhere gradient avatars. | Minor | Standardise. |
| 48 | Provider dashboard home | `dashboard/proveedor/page.tsx` | On `sm:` the 4-stat grid becomes 2 cols; availability toggle wraps under H1 — tight but not broken. | Nit | — |
| 49 | `src/app/(public)/servicios/page.tsx` | L41 input container | Leading icon is not hit-testable as a clear-button. | Nit | Add an `x` clear button on the right when `search !== ""`. |
| 50 | Tab buttons across pages | `proveedores/[id]/page.tsx` L99, `cliente/solicitudes/page.tsx` L85, `proveedor/reservas/page.tsx` L52 | Tab rows lack `role="tablist"` / `role="tab"` / `aria-selected`. | Minor | Add ARIA roles. |

## 3. Patterns worth promoting

1. **Skeleton-first loading.** Every async page has a Tailwind-pulse skeleton with correct radius/sizes (`servicios/page.tsx` L65, `proveedores/[id]/page.tsx` L52, `proveedor/page.tsx` L33). Extract to `<Skeleton shape="card|text|circle" />`.
2. **Empty-state shape.** `icon text-5xl text-zinc-300 dark:text-zinc-700 + bold heading + muted sub + CTA` is repeated consistently (`solicitudes/page.tsx` L103, `oportunidades/page.tsx` L39, `reservas/page.tsx` L71, `servicios/page.tsx` L196). Promote to `<EmptyState>`.
3. **Urgency + status badge pairing** in `oportunidades/page.tsx` L62 and `cliente/solicitudes/page.tsx` L123 — already dark-mode correct. Use as template for #4 and #46.
4. **Framer-motion stagger.** Category/service/review cards share `delay: i * 0.05` with `opacity/y` — consistent signature.
5. **Provider-orange nav theming.** `ProviderDashboardLayout.tsx` L50 (`bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400`) is a textbook role-aware dark-mode pair.
6. **`<Input label="" error="">`.** Where used (`onboarding/PersonalDataStep.tsx`, `nueva-solicitud/page.tsx`) layout is tight and a11y-correct. Gaps are where raw `<textarea>` / `<select>` bypass it (#31).
7. **Client role tokens.** `nueva-solicitud/page.tsx` uses `bg-primary/5 dark:bg-primary/10` consistently — token-first, should be default wherever client blue is applied (fixes #5).
8. **Step indicator.** `StepIndicator.tsx` has clean desktop/mobile split with progress-bar fallback — good baseline for future multi-step flows.

## 4. Top 5 next actions (prioritised)

1. **Client dashboard dark-mode pass.** `dashboard/cliente/page.tsx` and `dashboard/proveedor/pendiente/page.tsx` — add `dark:` pairs everywhere, fix `bg-background-light`. (#1, #2, #3, #28.)
2. **Fix broken / off-brand links & tokens.**
   - `/services/*` → `/servicios/*` in client home sidebar (#39, #40).
   - Replace `bg-blue-600` literal with `bg-primary` in `solicitudes/page.tsx` (#5).
   - Swap `text-primary` → `text-orange-*` on provider-pendiente page (#29).
   - Remove `text-blue-500` on provider home section icons (#7).
3. **Extract shared status/urgency config** to `src/lib/status-config.ts` (#46). Covers request status, urgency, booking status with dark-mode-ready colors. Removes ~100 lines of duplication and forces consistency.
4. **Form correctness + a11y.**
   - Add `valueAsNumber: true` to every numeric `register()` (#24).
   - Restore `getWorkZones` call on `/dashboard/proveedor/negocio` (#22).
   - Add `htmlFor` / `id` on `<label>` + `<textarea>` / `<select>` pairs (#23).
   - Rework "URL del documento" to a file upload or honest label (#32).
5. **Promote the empty-state, skeleton, and select patterns** to shared components (`<EmptyState>`, `<Skeleton>`, `<Select>`), then migrate duplicates. Also unifies focus-visible rings (`focus-visible:ring-2 focus-visible:ring-primary/40`) and `dark:` coverage across forms (#12, #21, #31).