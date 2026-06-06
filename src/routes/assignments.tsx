import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData, type Lang } from "@/lib/i18n";
import { Plus, SlidersHorizontal, User, ClipboardList, ChevronDown, LayoutGrid, Pencil, X } from "lucide-react";
import { CompetencyLegend, CompetencyMeter, IndicatorBar, type CompetencyLevel } from "@/components/CompetencyMeter";
import { mathCompetencies } from "@/lib/curriculum";
import { useMeasurements, useProgramazioak } from "@/lib/programazioa";
import { MeasurementEditor } from "@/components/MeasurementEditor";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Assignments — Northgate" }] }),
  component: AssignmentsPage,
});

// All students across classes
const allStudents = [
  { name: "Amara Johnson", grade: "10A" },
  { name: "Liam Okonkwo", grade: "9B" },
  { name: "Sofia Martinez", grade: "11C" },
  { name: "Noah Chen", grade: "10A" },
  { name: "Priya Shah", grade: "12A" },
  { name: "Marcus Bell", grade: "9B" },
  { name: "Elena Ruiz", grade: "11C" },
  { name: "Kenji Tanaka", grade: "12A" },
];

type ViewMode = "student" | "task" | "overview";

function AssignmentsPage() {
  const { lang, t } = useLanguage();
  const { assignments } = getLocalizedData(lang);
  const { data: allMeas, setForActivity } = useMeasurements();
  const [viewMode, setViewMode] = useState<ViewMode>("student");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { list: programs } = useProgramazioak();

  // Custom tasks created via "New measurement"
  const [customTasks, setCustomTasks] = useState<{ title: string; class: string; compIds: string[]; indicatorIds: string[] }[]>([]);
  const allAssignments = useMemo(() => {
    const custom = customTasks.map((c, i) => ({
      title: c.title,
      class: c.class,
      dueKey: null as any,
      dueLabel: "—",
      submitted: 0,
      total: 0,
      __custom: true,
      __idx: i,
    }));
    return [...custom, ...assignments];
  }, [customTasks, assignments]);

  // Student view state
  const [selectedStudent, setSelectedStudent] = useState(allStudents[0]);
  const [studentDropOpen, setStudentDropOpen] = useState(false);

  // Task view state
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);
  const [taskDropOpen, setTaskDropOpen] = useState(false);

  // Seed deterministic measurements per activity
  const defaults = useMemo(() => {
    const seed: Record<string, Record<string, number>> = {};
    allAssignments.forEach((a: any, i) => {
      const id = `act-${i}`;
      if (a.__custom) {
        const m: Record<string, number> = {};
        const tk = customTasks[a.__idx];
        tk.indicatorIds.forEach((indId, ii) => { m[indId] = ((ii % 4) + 1); });
        seed[id] = m;
        return;
      }
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
  }, [allAssignments, customTasks]);

  // Per-student measurements: slightly perturb default per student index
  const studentMeasurements = (actId: string, studentIdx: number): Record<string, number> => {
    const base = allMeas[actId] ?? defaults[actId] ?? {};
    const result: Record<string, number> = {};
    Object.entries(base).forEach(([k, v]) => {
      const delta = ((studentIdx * 3 + k.charCodeAt(k.length - 1)) % 3) - 1;
      result[k] = Math.max(1, Math.min(4, v + delta));
    });
    return result;
  };

  const selectedStudentIdx = allStudents.findIndex((s) => s.name === selectedStudent.name);

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.assignments.title")}
          subtitle={t("page.assignments.subtitle")}
          action={
            <button
              onClick={() => setPickerOpen(true)}
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> {t("assign.newMeasurement")}
            </button>
          }
        />

        {/* View mode toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setViewMode("student")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${viewMode === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}
            >
              <User className="h-4 w-4" />
              {lang === "eu" ? "Ikasle ikuspegi" : lang === "es" ? "Por alumno" : "By student"}
            </button>
            <button
              onClick={() => setViewMode("task")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${viewMode === "task" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}
            >
              <ClipboardList className="h-4 w-4" />
              {lang === "eu" ? "Ataza ikuspegi" : lang === "es" ? "Por tarea" : "By task"}
            </button>
            <button
              onClick={() => setViewMode("overview")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${viewMode === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"}`}
            >
              <LayoutGrid className="h-4 w-4" />
              {t("assign.overview")}
            </button>
          </div>

          <button
            onClick={() => setEditMode((e) => !e)}
            className={`inline-flex items-center gap-2 h-10 px-3 rounded-lg border text-sm font-medium transition-colors ${editMode ? "bg-accent text-accent-foreground border-accent" : "bg-card border-border text-muted-foreground hover:bg-secondary/60"}`}
          >
            <Pencil className="h-4 w-4" /> {t("assign.editMode")}
          </button>

          <div className="ml-auto rounded-lg border border-border bg-card px-4 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("comp.level")}</div>
            <CompetencyLegend />
          </div>
        </div>

        {/* ── STUDENT VIEW ── */}
        {viewMode === "student" && (
          <StudentView
            assignments={allAssignments}
            allStudents={allStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            studentDropOpen={studentDropOpen}
            setStudentDropOpen={setStudentDropOpen}
            selectedStudentIdx={selectedStudentIdx}
            studentMeasurements={studentMeasurements}
            allMeas={allMeas}
            defaults={defaults}
            editingId={editingId}
            setEditingId={setEditingId}
            setForActivity={setForActivity}
            editMode={editMode}
            lang={lang}
            t={t}
          />
        )}

        {/* ── TASK VIEW ── */}
        {viewMode === "task" && (
          <TaskView
            assignments={allAssignments}
            allStudents={allStudents}
            selectedTaskIdx={selectedTaskIdx}
            setSelectedTaskIdx={setSelectedTaskIdx}
            taskDropOpen={taskDropOpen}
            setTaskDropOpen={setTaskDropOpen}
            studentMeasurements={studentMeasurements}
            allMeas={allMeas}
            defaults={defaults}
            editingId={editingId}
            setEditingId={setEditingId}
            setForActivity={setForActivity}
            editMode={editMode}
            lang={lang}
            t={t}
          />
        )}

        {/* ── OVERVIEW ── */}
        {viewMode === "overview" && (
          <OverviewPanel allAssignments={allAssignments} allStudents={allStudents} studentMeasurements={studentMeasurements} lang={lang} />
        )}

        {editingId && (
          <MeasurementEditor
            open
            onClose={() => setEditingId(null)}
            activityTitle={allAssignments[parseInt(editingId.split("-")[1], 10)]?.title ?? ""}
            initial={allMeas[editingId] ?? defaults[editingId] ?? {}}
            onSave={(m) => setForActivity(editingId, m)}
          />
        )}

        {pickerOpen && (
          <NewMeasurementPicker
            programs={programs}
            lang={lang}
            t={t}
            onClose={() => setPickerOpen(false)}
            onPick={(payload) => {
              setCustomTasks((prev) => [payload, ...prev]);
              setPickerOpen(false);
              setViewMode("task");
              setSelectedTaskIdx(0);
            }}
          />
        )}
      </>
    </AppShell>
  );
}

// ─────────────────────────────────────────
// STUDENT VIEW
// ─────────────────────────────────────────
function StudentView({
  assignments, allStudents, selectedStudent, setSelectedStudent,
  studentDropOpen, setStudentDropOpen, selectedStudentIdx,
  studentMeasurements, allMeas, defaults,
  editingId, setEditingId, setForActivity, editMode, lang, t,
}: any) {
  return (
    <div className="space-y-4">
      {/* Student picker */}
      <div className="relative w-fit">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
          {lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}
        </label>
        <button
          onClick={() => setStudentDropOpen(!studentDropOpen)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[240px]"
        >
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-semibold shrink-0">
            {selectedStudent.name.split(" ").map((n: string) => n[0]).join("")}
          </div>
          <span className="flex-1 text-left">{selectedStudent.name}</span>
          <span className="text-xs text-muted-foreground">{selectedStudent.grade}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground ml-1 transition-transform ${studentDropOpen ? "rotate-180" : ""}`} />
        </button>
        {studentDropOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setStudentDropOpen(false)} />
            <div className="absolute z-20 mt-1 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
              {allStudents.map((s: any) => (
                <button
                  key={s.name}
                  onClick={() => { setSelectedStudent(s); setStudentDropOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors ${s.name === selectedStudent.name ? "bg-secondary/40 font-medium" : ""}`}
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-[10px] font-semibold shrink-0">
                    {s.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <span className="flex-1 text-left">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.grade}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Assignments for this student */}
      <div className="grid gap-4">
        {assignments.map((a: any, idx: number) => {
          const id = `act-${idx}`;
          const measurements = studentMeasurements(id, selectedStudentIdx);
          const pct = Math.round((a.submitted / a.total) * 100);
          const dueLabel = a.dueKey ? t(a.dueKey) : a.dueLabel ?? "";
          const isUrgent = a.dueKey === "due.today";
          const measuredComps = mathCompetencies.filter((c) =>
            c.indicators.some((i) => measurements[i.id]),
          );

          return (
            <section key={a.title} className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <header className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-border">
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
                        <h4 className="font-medium text-sm">{c.label[lang as Lang]}</h4>
                      </div>
                      <div className="space-y-2.5">
                        {inds.map((ind) => (
                          <IndicatorBar
                            key={ind.id}
                            level={measurements[ind.id] as CompetencyLevel}
                            label={`${ind.code} · ${ind.label[lang as Lang]}`}
                            editable={editMode}
                            onChange={(lv) => {
                              const actId = `act-${assignments.findIndex((x: any) => x.title === a.title)}`;
                              const base = allMeas[actId] ?? defaults[actId] ?? {};
                              setForActivity(actId, { ...base, [ind.id]: lv });
                            }}
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
    </div>
  );
}

// ─────────────────────────────────────────
// TASK VIEW
// ─────────────────────────────────────────
function TaskView({
  assignments, allStudents, selectedTaskIdx, setSelectedTaskIdx,
  taskDropOpen, setTaskDropOpen,
  studentMeasurements, allMeas, defaults,
  editingId, setEditingId, setForActivity, editMode, lang, t,
}: any) {
  const assignment = assignments[selectedTaskIdx];
  const actId = `act-${selectedTaskIdx}`;

  const measuredComps = useMemo(() => {
    const base = allMeas[actId] ?? defaults[actId] ?? {};
    return mathCompetencies.filter((c) => c.indicators.some((i) => base[i.id]));
  }, [actId, allMeas, defaults]);

  return (
    <div className="space-y-4">
      {/* Task picker */}
      <div className="relative w-fit">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
          {lang === "eu" ? "Jarduera konpetentziala" : lang === "es" ? "Tarea" : "Task"}
        </label>
        <button
          onClick={() => setTaskDropOpen(!taskDropOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[320px] max-w-[480px]"
        >
          <span className="flex-1 text-left truncate">{assignment?.title}</span>
          <span className="text-xs text-muted-foreground shrink-0">{assignment?.class}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground ml-1 shrink-0 transition-transform ${taskDropOpen ? "rotate-180" : ""}`} />
        </button>
        {taskDropOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setTaskDropOpen(false)} />
            <div className="absolute z-20 mt-1 min-w-full w-max max-w-[520px] rounded-lg bg-card border border-border shadow-lg overflow-hidden">
              {assignments.map((a: any, i: number) => (
                <button
                  key={a.title}
                  onClick={() => { setSelectedTaskIdx(i); setTaskDropOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors text-left ${i === selectedTaskIdx ? "bg-secondary/40 font-medium" : ""}`}
                >
                  <span className="flex-1 truncate">{a.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{a.class}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Header info + edit button */}
      <div className="rounded-xl bg-card border border-border px-5 py-4 flex flex-wrap items-center justify-between gap-3" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div>
          <h3 className="font-medium">{assignment?.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{assignment?.class} · {allStudents.length} {lang === "eu" ? "ikasle" : lang === "es" ? "alumnos" : "students"}</p>
        </div>
        <button
          onClick={() => setEditingId(actId)}
          className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-secondary inline-flex items-center gap-1.5"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> {t("assign.edit")}
        </button>
      </div>

      {measuredComps.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-10 border border-dashed border-border rounded-xl">
          {t("comp.measured")}: —
        </div>
      ) : (
        /* Per-competency table: rows = students, cols = indicators */
        <div className="space-y-5">
          {measuredComps.map((c) => (
            <section key={c.id} className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{c.code}</span>
                <h4 className="font-medium text-sm">{c.label[lang as Lang]}</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium px-5 py-2.5 sticky left-0 bg-secondary/40 min-w-[160px]">
                        {lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}
                      </th>
                      {c.indicators.map((ind) => {
                        const base = allMeas[actId] ?? defaults[actId] ?? {};
                        if (!base[ind.id]) return null;
                        return (
                          <th key={ind.id} className="text-left font-medium px-4 py-2.5 min-w-[180px] align-bottom normal-case tracking-normal">
                            <div className="font-mono text-[10px] text-foreground/60">{ind.code}</div>
                            <div className="text-[10px] text-muted-foreground/80 leading-tight max-w-[170px] font-normal">
                              {ind.label[lang as Lang]}
                            </div>
                          </th>
                        );
                      })}
                      <th className="text-left font-medium px-4 py-2.5 min-w-[100px] normal-case tracking-normal">
                        {lang === "eu" ? "Batez best." : lang === "es" ? "Promedio" : "Average"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((s: any, si: number) => {
                      const meas = studentMeasurements(actId, si);
                      const activeInds = c.indicators.filter((ind) => {
                        const base = allMeas[actId] ?? defaults[actId] ?? {};
                        return !!base[ind.id];
                      });
                      const levels = activeInds.map((ind) => meas[ind.id] as CompetencyLevel).filter(Boolean);
                      const avg = levels.length > 0 ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) as CompetencyLevel : null;

                      return (
                        <tr key={s.name} className="border-t border-border hover:bg-secondary/30">
                          <td className="px-5 py-3 sticky left-0 bg-card">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-[10px] font-semibold shrink-0">
                                {s.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-xs">{s.name}</p>
                                <p className="text-[10px] text-muted-foreground">{s.grade}</p>
                              </div>
                            </div>
                          </td>
                          {c.indicators.map((ind) => {
                            const base = allMeas[actId] ?? defaults[actId] ?? {};
                            if (!base[ind.id]) return null;
                            const lv = meas[ind.id] as CompetencyLevel;
                            return (
                              <td key={ind.id} className="px-4 py-3 min-w-[180px]">
                                {lv ? (
                                  <IndicatorBar
                                    level={lv}
                                    editable={editMode}
                                    onChange={(nlv) => {
                                      // Per-student editing isn't persisted in v1; mutate task baseline instead
                                      const next = { ...base, [ind.id]: nlv };
                                      setForActivity(actId, next);
                                    }}
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 text-xs">—</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3">
                            {avg ? (
                              <CompetencyMeter level={avg} showLabel size="sm" />
                            ) : (
                              <span className="text-muted-foreground/40 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// OVERVIEW PANEL (subject-wide gradebook-style summary)
// ─────────────────────────────────────────
function OverviewPanel({ allAssignments, allStudents, studentMeasurements, lang }: any) {
  // Aggregate per-student per-competency across all assignments
  const rows = allStudents.map((s: any, si: number) => {
    const perComp: Record<string, number[]> = {};
    allAssignments.forEach((_: any, ai: number) => {
      const actId = `act-${ai}`;
      const meas = studentMeasurements(actId, si);
      mathCompetencies.forEach((c) => {
        c.indicators.forEach((ind) => {
          if (meas[ind.id]) (perComp[c.id] ||= []).push(meas[ind.id]);
        });
      });
    });
    const summary: Record<string, CompetencyLevel> = {};
    Object.entries(perComp).forEach(([cid, arr]) => {
      summary[cid] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) as CompetencyLevel;
    });
    return { student: s, summary };
  });

  return (
    <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="px-5 py-3 border-b border-border bg-secondary/30">
        <h3 className="font-medium text-sm">{lang === "eu" ? "Konpetentzien laburpena" : lang === "es" ? "Resumen de competencias" : "Competency summary"}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{lang === "eu" ? "Neurketa guztien batez bestekoa" : lang === "es" ? "Media de todas las mediciones" : "Average across all measurements"}</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left font-medium px-5 py-2.5">{lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}</th>
            {mathCompetencies.map((c) => (
              <th key={c.id} className="text-center font-medium px-3 py-2.5 align-bottom">
                <div className="font-mono">{c.code}</div>
                <div className="font-normal normal-case text-[10px] text-muted-foreground/80 leading-tight max-w-[110px] mx-auto mt-0.5">
                  {c.label[lang as Lang]}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.student.name} className="border-t border-border hover:bg-secondary/40">
              <td className="px-5 py-3 font-medium text-xs">{row.student.name}</td>
              {mathCompetencies.map((c) => {
                const lv = row.summary[c.id];
                return (
                  <td key={c.id} className="px-3 py-3 text-center">
                    {lv ? (
                      <div className="flex justify-center"><CompetencyMeter level={lv} /></div>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// ─────────────────────────────────────────
// NEW MEASUREMENT PICKER — choose ataza konpetentziala from a programazio
// ─────────────────────────────────────────
function NewMeasurementPicker({
  programs,
  lang,
  t,
  onClose,
  onPick,
}: {
  programs: any[];
  lang: Lang;
  t: (k: string) => string;
  onClose: () => void;
  onPick: (payload: { title: string; class: string; compIds: string[]; indicatorIds: string[] }) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col" style={{ boxShadow: "var(--shadow-elegant, 0 20px 60px -20px rgba(0,0,0,0.4))" }}>
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{t("assign.newMeasurement")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t("assign.pickTask")}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {programs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {lang === "eu" ? "Ez dago programaziorik. Joan Programazioa atalera." : lang === "es" ? "No hay programaciones. Ve a Programación." : "No programs yet. Go to Programazioa."}
            </p>
          )}
          {programs.map((p) => (
            <section key={p.id} className="rounded-xl border border-border">
              <header className="px-4 py-2.5 border-b border-border bg-secondary/30">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.subjectKey}</p>
              </header>
              <div className="divide-y divide-border">
                {p.ikasEgoerak.flatMap((ie: any) =>
                  ie.atazak.map((at: any) => (
                    <button
                      key={at.id}
                      type="button"
                      onClick={() =>
                        onPick({
                          title: at.title[lang] || at.title.eu,
                          class: p.name,
                          compIds: at.competencies.map((c: any) => c.compId),
                          indicatorIds: at.competencies.flatMap((c: any) => c.indicatorIds),
                        })
                      }
                      className="w-full text-left px-4 py-3 hover:bg-secondary/40 transition-colors"
                    >
                      <p className="text-sm font-medium">{at.title[lang] || at.title.eu}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {ie.title[lang] || ie.title.eu} · {at.competencies.length} {t("comp.title").toLowerCase()}
                      </p>
                    </button>
                  )),
                )}
                {p.ikasEgoerak.length === 0 && (
                  <p className="px-4 py-3 text-xs text-muted-foreground">—</p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
