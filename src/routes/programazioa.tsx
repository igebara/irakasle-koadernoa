import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, Trash2, RefreshCw } from "lucide-react";
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

// Label helpers: "Ikas-egoera" / "Situación de aprendizaje" / "Learning situation"
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

function emptyLabel(lang: "eu" | "es" | "en") {
  if (lang === "eu") return "Oraindik ez dago ikas-egoera. Sortu lehenengoa.";
  if (lang === "es") return "Aún no hay situaciones de aprendizaje. Crea la primera.";
  return "No learning situations yet. Create the first one.";
}

function ProgramazioaPage() {
  const { t, lang } = useLanguage();
  const { data, updateSubject, reset } = useProgramazioa();
  const [selected, setSelected] = useState("algebra");
  const subjectList = subjects[lang] || subjects.eu;
  const program = data[selected];
  const units = program?.units ?? [];
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(units.length);

  // Auto-scroll when a new unit is added
  useEffect(() => {
    if (units.length > prevCountRef.current) {
      setTimeout(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    prevCountRef.current = units.length;
  }, [units.length]);

  const updateUnit = (id: string, patch: Partial<Unit>) => {
    const next = units.map((u) => (u.id === id ? { ...u, ...patch } : u));
    updateSubject(selected, next);
  };
  const removeUnit = (id: string) => updateSubject(selected, units.filter((u) => u.id !== id));
  const addUnit = () => {
    const id = `${selected}-u${Date.now()}`;
    updateSubject(selected, [
      ...units,
      { id, title: newUnitTitle(lang), competencies: [] },
    ]);
  };

  const toggleComp = (unit: Unit, compId: string) => {
    const exists = unit.competencies.find((c) => c.compId === compId);
    if (exists) {
      updateUnit(unit.id, { competencies: unit.competencies.filter((c) => c.compId !== compId) });
    } else {
      const comp = mathCompetencies.find((c) => c.id === compId)!;
      updateUnit(unit.id, {
        competencies: [...unit.competencies, { compId, indicatorIds: comp.indicators.map((i) => i.id) }],
      });
    }
  };

  const toggleIndicator = (unit: Unit, compId: string, indId: string) => {
    updateUnit(unit.id, {
      competencies: unit.competencies.map((c) => {
        if (c.compId !== compId) return c;
        const has = c.indicatorIds.includes(indId);
        return { ...c, indicatorIds: has ? c.indicatorIds.filter((i) => i !== indId) : [...c.indicatorIds, indId] };
      }),
    });
  };

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.programazioa.title")}
          subtitle={t("page.programazioa.subtitle")}
          action={
            <div className="flex gap-2">
              <button onClick={reset} className="h-10 px-3 rounded-lg border border-border text-sm inline-flex items-center gap-2 hover:bg-secondary">
                <RefreshCw className="h-4 w-4" /> {t("common.reset")}
              </button>
              <button
                onClick={addUnit}
                className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> {unitLabel(lang)} {lang === "eu" ? "berria" : lang === "es" ? "nueva" : "new"}
              </button>
            </div>
          }
        />

        <div className="flex flex-wrap items-end gap-3">
          <SubjectPicker value={selected} onChange={(v) => { setSelected(v); }} list={subjectList} label={t("gradebook.subject")} />
          <div className="ml-auto text-[11px] text-muted-foreground italic max-w-md text-right">{curriculumSource[lang]}</div>
        </div>

        {units.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {units.length} {unitLabel(lang, true).toLowerCase()}
          </p>
        )}

        <div className="space-y-4">
          {units.map((u, idx) => (
            <UnitCard
              key={u.id}
              unit={u}
              index={idx + 1}
              lang={lang}
              onTitle={(ti) => updateUnit(u.id, { title: ti })}
              onRemove={() => removeUnit(u.id)}
              onToggleComp={(id) => toggleComp(u, id)}
              onToggleInd={(c, i) => toggleIndicator(u, c, i)}
            />
          ))}
          {units.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {emptyLabel(lang)}
            </div>
          )}
          {/* Scroll target */}
          <div ref={listEndRef} />
        </div>
      </>
    </AppShell>
  );
}

function SubjectPicker({ value, onChange, list, label }: { value: string; onChange: (v: string) => void; list: { key: string; label: string }[]; label: string }) {
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
              <button key={s.key} onClick={() => { onChange(s.key); setOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 ${s.key === value ? "bg-secondary/40 font-medium" : ""}`}>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UnitCard({ unit, index, lang, onTitle, onRemove, onToggleComp, onToggleInd }: {
  unit: Unit;
  index: number;
  lang: "eu" | "es" | "en";
  onTitle: (t: string) => void;
  onRemove: () => void;
  onToggleComp: (compId: string) => void;
  onToggleInd: (compId: string, indId: string) => void;
}) {
  const selectedMap = useMemo(() => Object.fromEntries(unit.competencies.map((c) => [c.compId, c])), [unit]);

  return (
    <section className="rounded-xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">
          {unitLabel(lang)} {index}
        </span>
        <input
          value={unit.title}
          onChange={(e) => onTitle(e.target.value)}
          className="flex-1 bg-transparent font-display text-lg font-semibold outline-none focus:bg-secondary/40 rounded-md px-2 py-1 -mx-2"
        />
        <button onClick={onRemove} className="h-9 w-9 grid place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-4">
        {mathCompetencies.map((c) => {
          const sel = selectedMap[c.id];
          const isOn = !!sel;
          return (
            <div key={c.id} className={`rounded-lg border p-3 transition-colors ${isOn ? "border-primary/50 bg-primary/[0.04]" : "border-border"}`}>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={isOn} onChange={() => onToggleComp(c.id)} className="mt-1 accent-[color:var(--primary)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{c.code}</span>
                    <span className="font-medium text-sm">{c.label[lang]}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{c.description[lang]}</p>
                </div>
              </label>

              {isOn && (
                <div className="mt-3 pl-6 space-y-1.5 border-l-2 border-primary/20">
                  {c.indicators.map((ind) => {
                    const checked = sel.indicatorIds.includes(ind.id);
                    return (
                      <label key={ind.id} className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={checked} onChange={() => onToggleInd(c.id, ind.id)} className="mt-0.5 accent-[color:var(--primary)]" />
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
    </section>
  );
}
