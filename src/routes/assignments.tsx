import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { Plus, Paperclip, SlidersHorizontal } from "lucide-react";
import { CompetencyLegend, IndicatorBar, type CompetencyLevel } from "@/components/CompetencyMeter";
import { mathCompetencies } from "@/lib/curriculum";
import { useMeasurements } from "@/lib/programazioa";
import { MeasurementEditor } from "@/components/MeasurementEditor";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Assignments — Northgate" }] }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { lang, t } = useLanguage();
  const { assignments } = getLocalizedData(lang);
  const { data: allMeas, setForActivity } = useMeasurements();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Seed default measurements per assignment when none stored
  const defaults = useMemo(() => {
    const seed: Record<string, Record<string, number>> = {};
    assignments.forEach((a, i) => {
      const id = `act-${i}`;
      const picked = [mathCompetencies[i % mathCompetencies.length], mathCompetencies[(i + 2) % mathCompetencies.length]];
      const m: Record<string, number> = {};
      picked.forEach((c, ci) => {
        c.indicators.forEach((ind, ii) => {
          m[ind.id] = (((i + ci + ii) % 4) + 1);
        });
      });
      seed[id] = m;
    });
    return seed;
  }, [assignments]);

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.assignments.title")}
          subtitle={t("page.assignments.subtitle")}
          action={
            <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> {t("hero.newAssignment")}
            </button>
          }
        />

        <div className="mb-4 rounded-xl border border-border bg-card px-4 py-3 flex flex-wrap items-center justify-between gap-3" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{t("comp.level")}</div>
          <CompetencyLegend />
        </div>

        <div className="grid gap-4">
          {assignments.map((a, idx) => {
            const id = `act-${idx}`;
            const measurements = allMeas[id] ?? defaults[id];
            const pct = Math.round((a.submitted / a.total) * 100);
            const dueLabel = a.dueKey ? t(a.dueKey) : a.dueLabel ?? "";
            const isUrgent = a.dueKey === "due.today";
            const measuredComps = mathCompetencies.filter((c) => c.indicators.some((i) => measurements[i.id]));

            return (
              <section key={a.title} className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
                <header className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-border">
                  <div className="flex items-start gap-3">
                    <Paperclip className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <h3 className="font-medium">{a.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{a.class}</span>
                        <span className={isUrgent ? "text-destructive font-medium" : ""}>{dueLabel}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-20 h-1 rounded-full bg-secondary overflow-hidden">
                            <span className="block h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="tabular-nums">{a.submitted}/{a.total}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingId(id)}
                    className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-secondary inline-flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" /> {t("assign.edit")}
                  </button>
                </header>

                <div className="p-5 grid md:grid-cols-2 gap-4">
                  {measuredComps.map((c) => {
                    const inds = c.indicators.filter((i) => measurements[i.id]);
                    return (
                      <div key={c.id} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{c.code}</span>
                          <h4 className="font-medium text-sm">{c.label[lang]}</h4>
                        </div>
                        <div className="space-y-2.5">
                          {inds.map((ind) => (
                            <IndicatorBar
                              key={ind.id}
                              level={measurements[ind.id] as CompetencyLevel}
                              label={`${ind.code} · ${ind.label[lang]}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {measuredComps.length === 0 && (
                    <div className="md:col-span-2 text-center text-xs text-muted-foreground py-6 border border-dashed border-border rounded-lg">
                      {t("comp.measured")}: —
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {editingId && (
          <MeasurementEditor
            open
            onClose={() => setEditingId(null)}
            activityTitle={assignments[parseInt(editingId.split("-")[1], 10)]?.title ?? ""}
            initial={allMeas[editingId] ?? defaults[editingId] ?? {}}
            onSave={(m) => setForActivity(editingId, m)}
          />
        )}
      </>
    </AppShell>
  );
}