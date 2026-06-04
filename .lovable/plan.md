## Goal

Move the measurement model from "one level per activity" to "one level per ebaluazio adierazle, grouped under its competency, inside each Jarduera Konpetentziala". Add a new Programazioa (year planning) section sourced from the official Basque curriculum.

## Data model (frontend mock, no backend)

Create `src/lib/curriculum.ts` with a small slice of the official Basque maths curriculum (DBH / Bachillerato sample), in EU/ES/EN:

```ts
type Indicator = { id: string; label: Record<Lang,string> };
type Competency = { id: string; label: Record<Lang,string>; indicators: Indicator[] };
// e.g. KM1 "Problemak ebaztea" → AE1.1, AE1.2, AE1.3 ...
```

Plus a `programazioa` store (in-memory + localStorage) describing each unit:
`{ id, title, subjectKey, competencies: [{compId, indicatorIds[]}] }`.

## Assignments tab (`/assignments`)

- Each activity row gets an "Edit measurements" button → opens a Dialog.
- Dialog shows the activity's selected competencies (from its unit's programazioa, editable). For each competency, list its ebaluazio adierazleak with a 4-step level picker (Hasierakoa→Bikaina) — class-average level per indicator.
- Replace today's single `classAvg` meter with a compact stack: one `CompetencyMeter` row per competency, labelled with competency name and small dots for each indicator level.
- Persist edits in `localStorage` keyed by activity id.

## Gradebook tab (`/gradebook`)

- Drop "numeric vs competency" toggle in favor of a richer competency view (keep numeric as secondary).
- Per subject, render a matrix: rows = students, columns grouped by Activity → Competency → Indicator. Each cell = `CompetencyMeter` (level 1–4). Sticky student column, horizontal scroll.
- Add a per-student "Konpetentzia laburpena" panel: aggregated level per competency (avg of its indicators across all activities) shown as larger meters + legend.

## New menu item: Programazioa (`/programazioa`)

- AppShell nav: add "Programazioa" (ES: "Programación", EN: "Year planning") with `CalendarRange` icon.
- Page lets the user pick a subject, then list/edit units. For each unit:
  - title + dates
  - multiselect competencies from curriculum
  - per selected competency, checkbox list of its ebaluazio adierazleak
- Save to localStorage. Used by Assignments dialog to know which competencies/indicators belong to which unit.

## Reusable UI

- Extend `CompetencyMeter.tsx` with `IndicatorBar` (compact horizontal 4-segment for indicators) and `CompetencyBlock` (competency name + indicator bars + aggregated meter).
- New `MeasurementEditor` component used by the Assignments dialog.

## i18n keys to add

`nav.programazioa`, `page.programazioa.*`, `assign.edit`, `assign.measure.title`, `comp.indicator`, `comp.indicators`, `comp.summary`, `curriculum.source`.

## Files

- new: `src/lib/curriculum.ts`, `src/lib/programazioa.ts`, `src/components/MeasurementEditor.tsx`, `src/routes/programazioa.tsx`
- edit: `src/components/CompetencyMeter.tsx`, `src/components/AppShell.tsx`, `src/lib/i18n.tsx`, `src/routes/assignments.tsx`, `src/routes/gradebook.tsx`, `src/routeTree.gen.ts`

## Out of scope

- Real backend / Lovable Cloud (kept as localStorage demo, as the rest of the app)
- Importing the complete official curriculum — only a representative subset for maths so the UI is meaningful
- Per-student indicator editing (only class-average per indicator for now; can be added next)
