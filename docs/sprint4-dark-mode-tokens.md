# Sprint 4 — Dark Mode Tokens (canónicos)

Sprint: 4
Owner: ux-ui-designer
Audience: frontend-dev (UX-1, UX-2)
Date: 2026-04-26
Source audit: [`sprint2-ux-audit.md`](./sprint2-ux-audit.md) — Blockers #1, #2, #3, #28

> Este doc define los pares Tailwind v4 light/dark **canónicos** del proyecto Taskao. Es la referencia única para resolver los 4 Blockers de dark-mode del audit de Sprint 2 y el baseline para todo el trabajo visual de Sprint 4 en adelante. Implementable sin ambigüedad: cada par es literal (no markup pseudo-código). El patrón ya validado en producción es `ProviderDashboardLayout.tsx` L33–L51.

---

## 0. Reglas globales

1. **Cada `bg-*`, `text-*`, `border-*` que aplique a una superficie de UI persistente DEBE tener su pareja `dark:`**. Excepción: clases que ya viven dentro de un componente sin variantes light (e.g. `bg-primary`, `bg-orange-500` que tienen el mismo color en ambos modos).
2. **Familia de neutros: `slate-*` para light, `zinc-*` para dark.** No mezclar `text-slate-400 dark:text-slate-500` (incoherente con el resto del codebase) — usar `text-slate-400 dark:text-zinc-500`.
3. **Tokens primero**: `bg-primary` antes que `bg-blue-600`, `text-primary` antes que `text-blue-600`. Hex literales prohibidos en componentes.
4. **Provider context** (rutas bajo `/dashboard/proveedor/*` y `/perfil/onboarding`): los tokens primarios son **orange**, no `primary`.
5. **Cliente / público / auth**: tokens primarios **`primary`** (azul `#0f62fe`).
6. **Focus visible**: `focus-visible:ring-2 focus-visible:ring-primary/40 focus:outline-none` en cliente; `focus-visible:ring-2 focus-visible:ring-orange-500/40 focus:outline-none` en provider.

---

## 1. Tabla de pares definitivos

### 1.1 Backgrounds

| Rol semántico                          | Light                  | Dark                          | Clase Tailwind canónica                          |
| -------------------------------------- | ---------------------- | ----------------------------- | ------------------------------------------------ |
| **Page** (root scrollable)             | `slate-50`             | `zinc-950`                    | `bg-slate-50 dark:bg-zinc-950`                   |
| **Card / Surface elevated** (raised)   | `white`                | `zinc-900`                    | `bg-white dark:bg-zinc-900`                      |
| **Surface muted** (sub-card, inputs)   | `slate-50`             | `zinc-800/50`                 | `bg-slate-50 dark:bg-zinc-800/50`                |
| **Surface accent** (tab strip, chips)  | `slate-100`            | `zinc-800`                    | `bg-slate-100 dark:bg-zinc-800`                  |
| **Surface inverse** (active tab pill)  | `white`                | `zinc-900`                    | `bg-white dark:bg-zinc-900` (con `shadow-sm`)    |
| **Tinted-flat avatar** (cliente)       | `primary/10`           | `primary/20`                  | `bg-primary/10 dark:bg-primary/20`               |
| **Tinted-flat avatar** (provider)      | `orange-100`           | `orange-950/40`               | `bg-orange-100 dark:bg-orange-950/40`            |

### 1.2 Borders

| Rol semántico                          | Light                  | Dark                          | Clase canónica                                     |
| -------------------------------------- | ---------------------- | ----------------------------- | -------------------------------------------------- |
| **Divider / card border** (default)    | `slate-200`            | `zinc-800`                    | `border-slate-200 dark:border-zinc-800`            |
| **Divider sutil** (interno de card)    | `slate-100`            | `zinc-800`                    | `border-slate-100 dark:border-zinc-800`            |
| **Input border** (default)             | `slate-200`            | `zinc-700`                    | `border-slate-200 dark:border-zinc-700`            |
| **Input border** (focused, cliente)    | `primary/40`           | `primary/40`                  | `focus-visible:ring-primary/40`                    |
| **Input border** (focused, provider)   | `orange-500/40`        | `orange-500/40`               | `focus-visible:ring-orange-500/40`                 |
| **Dashed empty-state border**          | `slate-200`            | `zinc-800`                    | `border-2 border-dashed border-slate-200 dark:border-zinc-800` |

### 1.3 Texto

| Rol semántico                          | Light                  | Dark                          | Clase canónica                                     |
| -------------------------------------- | ---------------------- | ----------------------------- | -------------------------------------------------- |
| **Primary** (H1, headings, body bold)  | `zinc-800`             | `zinc-100`                    | `text-zinc-800 dark:text-zinc-100`                 |
| **Primary alt** (cards, valores)       | `slate-900`            | `white`                       | `text-slate-900 dark:text-white`                   |
| **Secondary / muted** (subtítulos)     | `slate-600`            | `zinc-300`                    | `text-slate-600 dark:text-zinc-300`                |
| **Tertiary / caption** (metadata)      | `slate-500`            | `zinc-400`                    | `text-slate-500 dark:text-zinc-400`                |
| **Quaternary / icon-on-muted**         | `slate-400`            | `zinc-500`                    | `text-slate-400 dark:text-zinc-500`                |
| **Disabled**                           | `slate-300`            | `zinc-600`                    | `text-slate-300 dark:text-zinc-600`                |
| **Empty-state icon (gigante)**         | `zinc-300`             | `zinc-700`                    | `text-zinc-300 dark:text-zinc-700`                 |

> Convención: cuando un H1 vive sobre `bg-slate-50 dark:bg-zinc-950` use **Primary** (`text-zinc-800 dark:text-zinc-100`). Cuando vive sobre una **card** (`bg-white dark:bg-zinc-900`) puede usar **Primary alt** (`text-slate-900 dark:text-white`). No mezclar dentro del mismo componente.

### 1.4 Hover / Active

| Rol semántico                          | Clase canónica                                                         |
| -------------------------------------- | ---------------------------------------------------------------------- |
| **Card hover** (todo el rol)           | `hover:shadow-md` (sin cambio de bg)                                   |
| **List-row hover (neutral)**           | `hover:bg-slate-50 dark:hover:bg-zinc-800`                             |
| **Botón ghost hover (neutral)**        | `hover:bg-slate-100 dark:hover:bg-zinc-800`                            |
| **Botón ghost active (cliente)**       | `bg-primary/5 dark:bg-primary/10 text-primary`                         |
| **Botón ghost active (provider)**      | `bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400` |
| **Botón danger ghost hover**           | `hover:bg-red-50 dark:hover:bg-red-950/40`                             |

---

## 2. Status badge system

Cada badge sigue el patrón `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium`. Sin border salvo cuando `outline` se requiere. El `outline-variant` agrega `border` con misma familia de color.

| Variant     | Light bg + text                              | Dark bg + text                                       | Outline border (light → dark)               |
| ----------- | -------------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| **Info**    | `bg-blue-100 text-blue-800`                  | `dark:bg-blue-900/40 dark:text-blue-300`             | `border-blue-200 dark:border-blue-900`      |
| **Success** | `bg-emerald-100 text-emerald-800`            | `dark:bg-emerald-900/40 dark:text-emerald-300`       | `border-emerald-200 dark:border-emerald-900`|
| **Warning** | `bg-amber-100 text-amber-800`                | `dark:bg-amber-900/40 dark:text-amber-300`           | `border-amber-200 dark:border-amber-900`    |
| **Error**   | `bg-red-100 text-red-800`                    | `dark:bg-red-900/40 dark:text-red-300`               | `border-red-200 dark:border-red-900`        |
| **Neutral** | `bg-zinc-100 text-zinc-700`                  | `dark:bg-zinc-800 dark:text-zinc-300`                | `border-zinc-200 dark:border-zinc-700`      |
| **Brand-C** | `bg-primary/10 text-primary`                 | `dark:bg-primary/20 dark:text-primary-light`         | `border-primary/20 dark:border-primary/30`  |
| **Brand-P** | `bg-orange-100 text-orange-800`              | `dark:bg-orange-900/40 dark:text-orange-300`         | `border-orange-200 dark:border-orange-900`  |

> Acción de Sprint 4 (separada de UX-1/UX-2 pero sustentada por estos tokens): extraer este mapa a `src/lib/status-config.ts` (audit #46).

---

## 3. Reglas role-aware

### 3.1 Provider context (orange)

Aplica en: `/dashboard/proveedor/**`, `/perfil/onboarding/**`, cualquier sub-flujo de wizard de provider.

| Uso                                       | Clase canónica                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| **Active nav item (sidebar)**             | `bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400` |
| **Active nav icon**                       | `text-orange-500`                                                         |
| **Active tab underline (mobile nav)**     | `border-orange-500 text-orange-600 dark:text-orange-400`                  |
| **Heading accent / KPI icon**             | `text-orange-600 dark:text-orange-400`                                    |
| **Surface tinted (info block)**           | `bg-orange-50 dark:bg-orange-950/30`                                      |
| **CTA primario**                          | `bg-orange-500 hover:bg-orange-600 text-white` (no `bg-primary`)          |
| **Link / texto enfatizado**               | `text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300` |
| **Focus ring**                            | `focus-visible:ring-2 focus-visible:ring-orange-500/40`                   |

> Single-source: `ProviderDashboardLayout.tsx` L50 es la referencia textbook (audit §3 punto 5).

### 3.2 Cliente / público / auth (azul / `primary`)

Aplica en: `/`, `/(public)/**`, `/(auth)/**`, `/dashboard/cliente/**`.

| Uso                                       | Clase canónica                                                       |
| ----------------------------------------- | -------------------------------------------------------------------- |
| **Active nav item (sidebar)**             | `bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light` |
| **Active tab underline**                  | `border-primary text-primary`                                        |
| **Heading accent / KPI icon**             | `text-primary`                                                       |
| **Surface tinted (info block)**           | `bg-primary/5 dark:bg-primary/10`                                    |
| **CTA primario**                          | `bg-primary hover:bg-primary-dark text-white`                        |
| **Link / texto enfatizado**               | `text-primary hover:text-primary-dark`                               |
| **Focus ring**                            | `focus-visible:ring-2 focus-visible:ring-primary/40`                 |

---

## 4. Patrón modal / dialog (resuelve Blocker #3)

Estructura mínima:

```tsx
{open && (
  <div
    role="dialog"
    aria-modal="true"
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm rounded-xl p-6 shadow-xl animate-scale-in
                 bg-white dark:bg-zinc-900
                 border border-slate-200 dark:border-zinc-800
                 text-slate-900 dark:text-zinc-100"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg
                         bg-red-50 dark:bg-red-950/40
                         text-red-500 dark:text-red-400">
          <span className="material-symbols-outlined text-[20px]">warning</span>
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Título</h3>
      </div>

      {/* Body — copy muted */}
      <p className="text-sm text-slate-500 dark:text-zinc-400 mb-1">Descripción.</p>

      {/* Highlight box (divider muted) */}
      <p className="text-sm font-semibold mb-5 rounded-lg px-3 py-2
                    bg-slate-50 dark:bg-zinc-800
                    text-slate-800 dark:text-zinc-100">
        {highlightedValue}
      </p>

      {/* Footer dividers (si los hubiera) usan: border-t border-slate-200 dark:border-zinc-800 */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors
                           border border-slate-200 dark:border-zinc-700
                           text-slate-700 dark:text-zinc-200
                           hover:bg-slate-50 dark:hover:bg-zinc-800">
          Volver
        </button>
        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  </div>
)}
```

Pares definitivos del modal:

| Elemento                      | Light                                       | Dark                                          |
| ----------------------------- | ------------------------------------------- | --------------------------------------------- |
| Backdrop                      | `bg-black/40 backdrop-blur-sm`              | `dark:bg-black/60`                            |
| Card bg                       | `bg-white`                                  | `dark:bg-zinc-900`                            |
| Card border                   | `border-slate-200`                          | `dark:border-zinc-800`                        |
| Card text base                | `text-slate-900`                            | `dark:text-zinc-100`                          |
| Card heading (H3)             | `text-slate-900`                            | `dark:text-white`                             |
| Card description (muted)      | `text-slate-500`                            | `dark:text-zinc-400`                          |
| Highlight box bg              | `bg-slate-50`                               | `dark:bg-zinc-800`                            |
| Highlight box text            | `text-slate-800`                            | `dark:text-zinc-100`                          |
| Internal divider              | `border-slate-200`                          | `dark:border-zinc-800`                        |

---

## 5. Patrón empty state

```tsx
<div className="flex flex-col items-center justify-center text-center py-14 rounded-xl
                border-2 border-dashed border-slate-200 dark:border-zinc-800
                bg-white dark:bg-zinc-900">
  <span className="material-symbols-outlined text-5xl mb-3
                   text-zinc-300 dark:text-zinc-700">
    inbox
  </span>
  <p className="text-sm font-semibold mb-1 text-slate-700 dark:text-zinc-200">
    Sin resultados todavía
  </p>
  <p className="text-xs max-w-xs mb-4 text-slate-500 dark:text-zinc-400">
    Mensaje secundario explicando qué pasó / qué hacer.
  </p>
  <Link className="bg-primary hover:bg-primary-dark text-white rounded-lg px-3 py-1.5 text-xs font-semibold" href="...">
    Acción primaria
  </Link>
</div>
```

Reglas:
- Icon size: `text-5xl` (40px). Color: **siempre** `text-zinc-300 dark:text-zinc-700` (sin neutro slate).
- Heading: `text-sm font-semibold text-slate-700 dark:text-zinc-200`.
- Sub-copy: `text-xs text-slate-500 dark:text-zinc-400`.
- CTA: token de rol (cliente: `bg-primary`, provider: `bg-orange-500`).

---

## 6. Plan de remediación de los 4 Blockers

### 6.1 Blocker #1 — `dashboard/cliente/page.tsx` L86 (`bg-background-light`)

**Estado actual:** L77 actual ya usa `bg-slate-50 dark:bg-zinc-950` (parece haber sido parcheado). Si reaparece `bg-background-light` durante el merge, **reemplazar por:**

```diff
- <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light">
+ <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-zinc-950">
```

> Adicional (audit #42): el layout padre ya aporta `p-6 lg:p-8`. Considerá quitar `p-4 md:p-8` del wrapper para evitar doble padding. Pero esto sale del scope estricto de "dark-mode tokens" — coordinar con UX-2.

### 6.2 Blocker #2 — `dashboard/cliente/page.tsx` L87–L350 (find & replace patterns)

Aplicar **find & replace por patrón** sobre el archivo entero (no línea por línea). En cada match: si **no** tiene un `dark:` siguiente, agregar el par.

| Buscar (sin `dark:` posterior)            | Reemplazar por                                                        |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `bg-white`                                | `bg-white dark:bg-zinc-900`                                           |
| `bg-slate-50` (cards, highlight, surface) | `bg-slate-50 dark:bg-zinc-800/50`                                     |
| `bg-slate-100` (chip strip / tab strip)   | `bg-slate-100 dark:bg-zinc-800`                                       |
| `border-slate-200`                        | `border-slate-200 dark:border-zinc-800`                               |
| `border-slate-100`                        | `border-slate-100 dark:border-zinc-800`                               |
| `text-slate-900` (H1, heading bold)       | `text-slate-900 dark:text-white` (cuando vive sobre card)             |
| `text-slate-900` (H1 sobre page bg)       | `text-zinc-800 dark:text-zinc-100`                                    |
| `text-slate-700`                          | `text-slate-700 dark:text-zinc-200`                                   |
| `text-slate-600`                          | `text-slate-600 dark:text-zinc-300`                                   |
| `text-slate-500`                          | `text-slate-500 dark:text-zinc-400`                                   |
| `text-slate-400`                          | `text-slate-400 dark:text-zinc-500`                                   |
| `bg-blue-100 text-blue-800`               | `bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300`    |
| `bg-amber-100 text-amber-800`             | `bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`|
| `bg-emerald-100 text-emerald-800`         | `bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300` |
| `bg-purple-100 text-purple-800`           | `bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300` |
| `bg-red-100 text-red-800`                 | `bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300`        |
| `bg-orange-100 text-orange-800`           | `bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300` |
| `bg-blue-50` (KPI icon bg)                | `bg-blue-50 dark:bg-blue-950/40`                                      |
| `bg-emerald-50`                           | `bg-emerald-50 dark:bg-emerald-950/40`                                |
| `bg-purple-50`                            | `bg-purple-50 dark:bg-purple-950/40`                                  |
| `bg-orange-50`                            | `bg-orange-50 dark:bg-orange-950/40`                                  |
| `bg-red-50` (danger ghost)                | `bg-red-50 dark:bg-red-950/40`                                        |
| `text-red-500`                            | `text-red-500 dark:text-red-400`                                      |
| `text-amber-600`                          | `text-amber-600 dark:text-amber-400`                                  |
| `text-emerald-600`                        | `text-emerald-600 dark:text-emerald-400`                              |
| `text-purple-600`                         | `text-purple-600 dark:text-purple-400`                                |
| `text-orange-500`                         | `text-orange-500` (sin pair: orange-500 sirve en ambos modos)         |

**Reglas adicionales sobre la página cliente:**
- El `cn(...)` que activa la pestaña (L127–L130) ya tiene los pares correctos — dejar como está.
- El badgeClass map (L58–L65) ya está correcto — dejar como está.
- Avatares tinted-flat: `bg-primary/10` debe ir a `bg-primary/10 dark:bg-primary/20` (L293).
- Hover en categorías (L272): `hover:bg-blue-50/60 dark:hover:bg-blue-950/20` ya está correcto.

### 6.3 Blocker #3 — `dashboard/cliente/page.tsx` L323–L341 (cancel modal)

Aplicar el patrón de §4. Pares definitivos línea por línea:

| Línea aprox. | Token actual                                | Token canónico Sprint 4                                            |
| ------------ | ------------------------------------------- | ------------------------------------------------------------------ |
| L325 wrapper | `bg-black/40 backdrop-blur-sm`              | `bg-black/40 dark:bg-black/60 backdrop-blur-sm`                    |
| L326 card    | `bg-white`                                  | `bg-white dark:bg-zinc-900`                                        |
| L326 border  | `border-slate-200`                          | `border-slate-200 dark:border-zinc-800`                            |
| L328 icon bg | `bg-red-50`                                 | `bg-red-50 dark:bg-red-950/40`                                     |
| L328 icon fg | `text-red-500`                              | `text-red-500 dark:text-red-400`                                   |
| L331 heading | `text-slate-900`                            | `text-slate-900 dark:text-white`                                   |
| L333 desc    | `text-slate-500`                            | `text-slate-500 dark:text-zinc-400`                                |
| L334 box bg  | `bg-slate-50`                               | `bg-slate-50 dark:bg-zinc-800`                                     |
| L334 box fg  | `text-slate-800`                            | `text-slate-800 dark:text-zinc-100`                                |
| L336 cancel btn border | `border-slate-200`                | `border-slate-200 dark:border-zinc-700`                            |
| L336 cancel btn fg     | `text-slate-700`                  | `text-slate-700 dark:text-zinc-200`                                |
| L336 cancel btn hover  | `hover:bg-slate-50`               | `hover:bg-slate-50 dark:hover:bg-zinc-800`                         |
| L337 confirm btn       | `bg-red-500 hover:bg-red-600`     | `bg-red-500 hover:bg-red-600` (sin pair: red-500 es válido en dark)|

> El archivo actual ya tiene la mayoría de pares correctos en el modal — verificar y completar los faltantes contra la tabla.

### 6.4 Blocker #28 — `dashboard/proveedor/pendiente/page.tsx`

Página completa (L8–L54). **Provider context** ⇒ tokens **orange**, no `primary`. El archivo actual ya cubrió varios pares pero conviene revisar contra esta tabla:

| Elemento (línea aprox.)                        | Token canónico                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| L8 page bg                                     | `bg-slate-50 dark:bg-zinc-950`                                      |
| L10 icon-circle bg                             | `bg-amber-100 dark:bg-amber-900/30` (hourglass es estado warning, OK)|
| L11 icon fg                                    | `text-amber-600 dark:text-amber-400`                                |
| L14 H1                                         | `text-zinc-800 dark:text-white`                                     |
| L18 párrafo principal                          | `text-zinc-500 dark:text-zinc-400`                                  |
| L23 card "Mientras tanto"                      | `bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800`   |
| L24 H3                                         | `text-zinc-800 dark:text-white`                                     |
| L25, L30, L34, L38 íconos `info`/`check_circle` | `text-orange-500` (provider context, NO `text-primary`)            |
| L28 lista texto                                | `text-zinc-600 dark:text-zinc-300`                                  |
| L46/L51 botones                                | usar `<Button>` del componente system; si se mantiene custom: `bg-orange-500 hover:bg-orange-600 text-white` para el primario |

> Acción concreta del audit #29: cualquier `text-primary` en este archivo se reemplaza por `text-orange-500` (provider context). El archivo actual ya está parcheado (`text-orange-500` en L25, L30, L34, L38) — confirmar en el merge.

---

## 7. Don'ts (anti-patrones detectados)

1. **No mezclar familias de neutros en el mismo componente.** `text-slate-900` con `dark:text-zinc-100` está bien (es la convención light→dark). Lo prohibido es `text-slate-500 ... dark:text-slate-400` o usar `zinc-*` en light + `slate-*` en dark.
2. **No usar `bg-blue-600` literal** cuando existe `bg-primary`. Mismo para `text-blue-600` → `text-primary`. (audit #5, #44)
3. **No omitir el `dark:` pair** en una superficie de UI persistente. Si encontrás `bg-white` sin `dark:bg-zinc-900` al lado, está roto.
4. **No usar `text-primary` (azul) en provider context.** En `/dashboard/proveedor/**` y `/perfil/onboarding/**`, los acentos van en `text-orange-500` / `text-orange-600 dark:text-orange-400`. (audit #7, #29)
5. **No usar `text-orange-*` en cliente / público.** El theme color de cliente es `primary`. El único uso permitido de orange en superficies de cliente es como `iconColor` neutral en una `StatCard` (decorativo, no semántico).
6. **No usar `bg-background-light` ni hex literales.** Esos tokens del `@theme` son para el body global; la página ya hereda el background del layout. Para cards y surfaces, usar siempre los pares de §1.1.
7. **No usar `focus:ring-*` con valores hardcoded** (`focus:ring-blue-300/30`, `focus:ring-orange-500/30`). Estandarizar a `focus-visible:ring-2 focus-visible:ring-{primary|orange-500}/40 focus:outline-none`. (audit #12, #21)
8. **No usar emojis ni glyphs literales** (`←`, hand-wave). Material Symbols only. (audit #6, #8, #9)
9. **No declarar mapas de status / urgency inline.** Usar `src/lib/status-config.ts` (extracción pendiente, audit #46) con los pares de §2.
10. **No anidar más de 2 niveles de surfaces** (`bg-white > bg-slate-50 > bg-slate-100` en dark se vuelve ilegible). Si se necesita un tercer nivel, usar `border` en lugar de `bg`.

---

## 8. Cobertura de Blockers (checklist final)

| Blocker | File                                                       | Resuelto por sección |
| ------- | ---------------------------------------------------------- | -------------------- |
| #1      | `dashboard/cliente/page.tsx` L86                           | §6.1 + §1.1 page bg  |
| #2      | `dashboard/cliente/page.tsx` L87–L350                      | §6.2 + §1 (1.1–1.4)  |
| #3      | `dashboard/cliente/page.tsx` L323–L341 cancel modal        | §6.3 + §4 modal      |
| #28     | `dashboard/proveedor/pendiente/page.tsx` (whole file)      | §6.4 + §3.1 provider |

Adicionalmente, los pares de §2 (status badges) cubren el audit #4 y son la base para el ticket de extracción `status-config.ts` (audit #46).