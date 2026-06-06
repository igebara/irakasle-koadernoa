import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown, Plus, Trash2, RefreshCw, Pencil, Upload, X, Check,
  FileJson, AlertCircle,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { mathCompetencies, curriculumSource } from "@/lib/curriculum";
import { useProgramazioa, type Unit } from "@/lib/programazioa";

export const Route = createFileRoute("/programazioa")({
  head: () => ({ meta: [{ title: "Programazioa — Northgate" }] }),
  component: ProgramazioaPage,
});

const subjects = {
  eu: [
    { key: "algebra", label: "Aljebra II" },
    { key: "geometry", label: "Geometria" },
    { key: "calculus", label: "Kalkulua" },
    { key: "statistics", label: "Estatistika" },
    { key: "mathclub", label: "Matematika Kluba" },
  ],
  es: [
    { key: "algebra", label: "Álgebra II" },
    { key: "geometry", label: "Geometría" },
    { key: "calculus", label: "Cálculo" },
    { key: "statistics", label: "Estadística" },
    { key: "mathclub", label: "Club de Matemáticas" },
  ],
  en: [
    { key: "algebra", label: "Algebra II" },
    { key: "geometry", label: "Geometry" },
    { key: "calculus", label: "Calculus" },
    { key: "statistics", label: "Statistics" },
    { key: "mathclub", label: "Math Club" },
  ],
};

function unitLabel(lang: "eu" | "es" | "en", plural = false) {
  if (lang === "eu") return plural ? "Ikas-egoerak" : "Ikas-egoera";
  if (lang === "es") return plural ? "Situaciones de aprendizaje" : "Situación de aprendizaje";
  return plural ? "Learning situations" : "Learning situation";
}

function newUnitTitle(lang: "eu" | "es" | "en") {
  if (lang === "eu") return "Ikas-egoera berria";
  if (lang === "es") return "Nueva situación de aprendizaje";
  return "New learning situation";
}

type ModalState =
  | { kind: "closed" }
  | { kind: "new" }
  | { kind: "edit"; unit: Unit }
  | { kind: "import" };

function ProgramazioaPage() {
  const { t, lang } = useLanguage();
  const { data, updateSubject, reset } = useProgramazioa();
  const [selected, setSelected] = useState("algebra");
  const [modal, setModal] = useState<ModalState>({ kind: "closed" });
  const subjectList = subjects[lang] || subjects.eu;
  const program = data[selected];
  const units = program?.units ?? [];
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(units.length);

  useEffect(() => {
    if (units.length > prevCountRef.current) {
      setTimeout(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    prevCountRef.current = units.length;
  }, [units.length]);

  const saveUnit = (draft: Unit) => {
    const exists = units.find((u) => u.id === draft.id);
    if (exists) {
      updateSubject(selected, units.map((u) => (u.id === draft.id ? draft : u)));
    } else {
      updateSubject(selected, [...units, draft]);
    }
    setModal({ kind: "closed" });
  };

  const removeUnit = (id: string) =>
    updateSubject(selected, units.filter((u) => u.id !== id));

  const importUnits = (incoming: Unit[]) => {
    const existingIds = new Set(units.map((u) => u.id));
    const merged = [...units, ...incoming.filter((u) => !existingIds.has(u.id))];
    updateSubject(selected, merged);
    setModal({ kind: "closed" });
  };

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.programazioa.title")}
          subtitle={t("page.programazioa.subtitle")}
          action={
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setModal({ kind: "import" })}
                className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-2 hover:bg-secondary transition-colors"
              >
                <Upload className="h-4 w-4" />
                {lang === "eu" ? "Inportatu" : lang === "es" ? "Importar" : "Import"}
              </button>
              <button
                onClick={reset}
                className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-2 hover:bg-secondary transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> {t("common.reset")}
              </button>
              <button
                onClick={() => setModal({ kind: "new" })}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {unitLabel(lang)} {lang === "eu" ? "berria" : lang === "es" ? "nueva" : "new"}
              </button>
            </div>
          }
        />

        <div className="flex flex-wrap items-end gap-3">
          <SubjectPicker value={selected} onChange={setSelected} list={subjectList} label={t("gradebook.subject")} />
          <div className="ml-auto text-[11px] text-muted-foreground italic max-w-md text-right">
            {curriculumSource[lang]}
          </div>
        </div>

        {units.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {units.length} {unitLabel(lang, true).toLowerCase()}
          </p>
        )}

        <div className="space-y-3">
          {units.map((u, idx) => (
            <UnitRow
              key={u.id}
              unit={u}
              index={idx + 1}
              lang={lang}
              onEdit={() => setModal({ kind: "edit", unit: u })}
              onRemove={() => removeUnit(u.id)}
            />
          ))}
          {units.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {lang === "eu" ? "Oraindik ez dago ikas-egoera. Sortu lehenengoa." : lang === "es" ? "Aún no hay situaciones. Crea la primera." : "No learning situations yet. Create the first one."}
            </div>
          )}
          <div ref={listEndRef} />
        </div>

        {(modal.kind === "new" || modal.kind === "edit") && (
          <UnitEditorModal
            lang={lang}
            initial={
              modal.kind === "edit"
                ? modal.unit
                : { id: `${selected}-u${Date.now()}`, title: newUnitTitle(lang), competencies: [] }
            }
            isNew={modal.kind === "new"}
            onSave={saveUnit}
            onClose={() => setModal({ kind: "closed" })}
          />
        )}
        {modal.kind === "import" && (
          <ImportModal lang={lang} onImport={importUnits} onClose={() => setModal({ kind: "closed" })} />
        )}
      </>
    </AppShell>
  );
}

// ── Unit row (compact) ──────────────────────────────────────
function UnitRow({ unit, index, lang, onEdit, onRemove }: {
  unit: Unit; index: number; lang: "eu" | "es" | "en";
  onEdit: () => void; onRemove: () => void;
}) {
  const activeComps = mathCompetencies.filter((c) =>
    unit.competencies.find((uc) => uc.compId === c.id),
  );
  return (
    <section
      className="rounded-xl bg-card border border-border px-5 py-4 flex items-start gap-4"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">
            {unitLabel(lang)} {index}
          </span>
          <h3 className="font-display font-semibold text-base truncate">{unit.title}</h3>
          {(unit.startDate || unit.endDate) && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {unit.startDate ?? "?"} → {unit.endDate ?? "?"}
            </span>
          )}
        </div>
        {activeComps.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {activeComps.map((c) => {
              const uc = unit.competencies.find((x) => x.compId === c.id)!;
              return (
                <span key={c.id} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <span className="font-mono font-semibold">{c.code}</span>
                  <span className="text-primary/60">·</span>
                  <span>{uc.indicatorIds.length} AE</span>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            {lang === "eu" ? "Konpetentzia hautatuak ez" : lang === "es" ? "Sin competencias seleccionadas" : "No competencies selected"}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-secondary inline-flex items-center gap-1.5 transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          {lang === "eu" ? "Editatu" : lang === "es" ? "Editar" : "Edit"}
        </button>
        <button
          onClick={onRemove}
          className="h-9 w-9 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

// ── Unit editor modal ───────────────────────────────────────
function UnitEditorModal({ initial, isNew, lang, onSave, onClose }: {
  initial: Unit; isNew: boolean; lang: "eu" | "es" | "en";
  onSave: (u: Unit) => void; onClose: () => void;
}) {
  const [draft, setDraft] = useState<Unit>(() => JSON.parse(JSON.stringify(initial)));

  const selectedMap = useMemo(
    () => Object.fromEntries(draft.competencies.map((c) => [c.compId, c])),
    [draft.competencies],
  );

  const toggleComp = (compId: string) => {
    const exists = draft.competencies.find((c) => c.compId === compId);
    if (exists) {
      setDraft((d) => ({ ...d, competencies: d.competencies.filter((c) => c.compId !== compId) }));
    } else {
      const comp = mathCompetencies.find((c) => c.id === compId)!;
      setDraft((d) => ({
        ...d,
        competencies: [...d.competencies, { compId, indicatorIds: comp.indicators.map((i) => i.id) }],
      }));
    }
  };

  const toggleIndicator = (compId: string, indId: string) => {
    setDraft((d) => ({
      ...d,
      competencies: d.competencies.map((c) => {
        if (c.compId !== compId) return c;
        const has = c.indicatorIds.includes(indId);
        return { ...c, indicatorIds: has ? c.indicatorIds.filter((i) => i !== indId) : [...c.indicatorIds, indId] };
      }),
    }));
  };

  const titleLabel = isNew
    ? (lang === "eu" ? "Ikas-egoera berria sortu" : lang === "es" ? "Crear situación de aprendizaje" : "Create learning situation")
    : (lang === "eu" ? "Ikas-egoera editatu" : lang === "es" ? "Editar situación de aprendizaje" : "Edit learning situation");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col"
        style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3 shrink-0">
          <h2 className="font-display text-lg font-semibold">{titleLabel}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
              {lang === "eu" ? "Izena" : lang === "es" ? "Nombre" : "Name"}
            </label>
            <input
              autoFocus
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder={lang === "eu" ? "Ikas-egoeraren izena…" : lang === "es" ? "Nombre de la situación…" : "Learning situation name…"}
              className="w-full h-11 px-4 rounded-xl border border-border bg-secondary/40 focus:bg-background focus:border-ring outline-none text-sm font-medium transition-colors"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                {lang === "eu" ? "Hasiera data" : lang === "es" ? "Fecha inicio" : "Start date"}
              </label>
              <input
                type="date"
                value={draft.startDate ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/40 focus:bg-background focus:border-ring outline-none text-sm transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">
                {lang === "eu" ? "Amaiera data" : lang === "es" ? "Fecha fin" : "End date"}
              </label>
              <input
                type="date"
                value={draft.endDate ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/40 focus:bg-background focus:border-ring outline-none text-sm transition-colors"
              />
            </div>
          </div>

          {/* Competencies */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3 block">
              {lang === "eu" ? "Konpetentziak eta ebaluazio adierazleak" : lang === "es" ? "Competencias e indicadores de evaluación" : "Competencies & evaluation indicators"}
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {mathCompetencies.map((c) => {
                const sel = selectedMap[c.id];
                const isOn = !!sel;
                return (
                  <div key={c.id} className={`rounded-xl border p-3.5 transition-colors ${isOn ? "border-primary/50 bg-primary/[0.04]" : "border-border"}`}>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={isOn} onChange={() => toggleComp(c.id)} className="mt-1 accent-[color:var(--primary)]" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{c.code}</span>
                          <span className="font-medium text-sm">{c.label[lang]}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{c.description[lang]}</p>
                      </div>
                    </label>
                    {isOn && (
                      <div className="mt-3 pl-6 space-y-1.5 border-l-2 border-primary/20">
                        {c.indicators.map((ind) => {
                          const checked = sel.indicatorIds.includes(ind.id);
                          return (
                            <label key={ind.id} className="flex items-start gap-2 cursor-pointer">
                              <input type="checkbox" checked={checked} onChange={() => toggleIndicator(c.id, ind.id)} className="mt-0.5 accent-[color:var(--primary)]" />
                              <div className="flex-1">
                                <span className="text-[10px] font-mono text-muted-foreground mr-1.5">{ind.code}</span>
                                <span className="text-xs">{ind.label[lang]}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-3 bg-secondary/20 shrink-0">
          <p className="text-[11px] text-muted-foreground">
            {draft.competencies.length} {lang === "eu" ? "konpetentzia hautatuta" : lang === "es" ? "competencias seleccionadas" : "competencies selected"}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
              {lang === "eu" ? "Utzi" : lang === "es" ? "Cancelar" : "Cancel"}
            </button>
            <button
              onClick={() => onSave(draft)}
              disabled={!draft.title.trim()}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5 disabled:opacity-40"
            >
              <Check className="h-3.5 w-3.5" />
              {lang === "eu" ? "Gorde" : lang === "es" ? "Guardar" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Import modal ────────────────────────────────────────────
function ImportModal({ lang, onImport, onClose }: {
  lang: "eu" | "es" | "en";
  onImport: (units: Unit[]) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Unit[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = (raw: string) => {
    setError(null);
    setParsed(null);
    if (!raw.trim()) return;
    try {
      const json = JSON.parse(raw);
      const arr: any[] = Array.isArray(json) ? json : json.units ?? [json];
      if (!arr.length) throw new Error("Empty array");
      const units: Unit[] = arr.map((u: any, i: number) => {
        if (!u.title) throw new Error(`Item ${i}: missing "title"`);
        return {
          id: u.id ?? `imported-${Date.now()}-${i}`,
          title: String(u.title),
          startDate: u.startDate,
          endDate: u.endDate,
          competencies: Array.isArray(u.competencies)
            ? u.competencies.map((c: any) => ({
                compId: String(c.compId),
                indicatorIds: Array.isArray(c.indicatorIds) ? c.indicatorIds.map(String) : [],
              }))
            : [],
        };
      });
      setParsed(units);
    } catch (e: any) {
      setError(e.message ?? "Invalid JSON");
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      validate(content);
    };
    reader.readAsText(file);
  };

  const exampleJson = `[
  {
    "title": "${lang === "eu" ? "Adibideko ikas-egoera" : lang === "es" ? "Situación de ejemplo" : "Example learning situation"}",
    "startDate": "2025-09-01",
    "endDate": "2025-10-15",
    "competencies": [
      { "compId": "km1", "indicatorIds": ["km1.ae1", "km1.ae2"] },
      { "compId": "km4", "indicatorIds": ["km4.ae1"] }
    ]
  }
]`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col"
        style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {lang === "eu" ? "Programazioa inportatu" : lang === "es" ? "Importar programación" : "Import planning"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "eu" ? "JSON fitxategi bat igo edo itsatsi" : lang === "es" ? "Sube o pega un archivo JSON" : "Upload or paste a JSON file"}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/[0.02] transition-colors"
          >
            <FileJson className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {lang === "eu" ? "JSON fitxategia arrastatu edo hautatu" : lang === "es" ? "Arrastra o selecciona un archivo JSON" : "Drag & drop or click to select a JSON file"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">.json</p>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          {/* OR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">{lang === "eu" ? "edo itsatsi" : lang === "es" ? "o pega" : "or paste"}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); validate(e.target.value); }}
            placeholder={exampleJson}
            rows={8}
            className="w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-xs font-mono focus:outline-none focus:border-ring focus:bg-background resize-none transition-colors"
          />

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Preview */}
          {parsed && (
            <div className="rounded-xl border border-primary/30 bg-primary/[0.03] px-4 py-3">
              <p className="text-xs font-medium text-primary mb-2">
                {parsed.length} {lang === "eu" ? "ikas-egoera aurkitu" : lang === "es" ? "situaciones encontradas" : "learning situations found"}
              </p>
              <ul className="space-y-1">
                {parsed.map((u, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-primary shrink-0" />
                    {u.title}
                    {u.competencies.length > 0 && (
                      <span className="text-[10px] text-muted-foreground/60">({u.competencies.length} comp.)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example */}
          <details className="group">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground list-none flex items-center gap-1">
              <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
              {lang === "eu" ? "JSON formatuaren adibidea" : lang === "es" ? "Ver ejemplo de formato JSON" : "View example JSON format"}
            </summary>
            <pre className="mt-2 text-[10px] font-mono bg-secondary/50 rounded-lg p-3 overflow-x-auto text-muted-foreground">{exampleJson}</pre>
          </details>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex justify-end gap-2 bg-secondary/20 shrink-0">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
            {lang === "eu" ? "Utzi" : lang === "es" ? "Cancelar" : "Cancel"}
          </button>
          <button
            onClick={() => parsed && onImport(parsed)}
            disabled={!parsed}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Upload className="h-3.5 w-3.5" />
            {lang === "eu" ? "Inportatu" : lang === "es" ? "Importar" : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subject picker ──────────────────────────────────────────
function SubjectPicker({ value, onChange, list, label }: {
  value: string; onChange: (v: string) => void;
  list: { key: string; label: string }[]; label: string;
}) {
  const [open, setOpen] = useState(false);
  const current = list.find((s) => s.key === value)!;
  return (
    <div className="relative">
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">{label}</label>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[220px]">
        <span>{current?.label}</span>
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
            {list.map((s) => (
              <button key={s.key} onClick={() => { onChange(s.key); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 ${s.key === value ? "bg-secondary/40 font-medium" : ""}`}>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
