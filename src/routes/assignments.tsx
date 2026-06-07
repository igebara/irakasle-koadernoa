import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, type Lang } from "@/lib/i18n";
import { Plus, SlidersHorizontal, User, ClipboardList, ChevronDown, Pencil, X, Check } from "lucide-react";
import { CompetencyLegend, CompetencyMeter, IndicatorBar, type CompetencyLevel } from "@/components/CompetencyMeter";
import { mathCompetencies } from "@/lib/curriculum";
import { useMeasurements, useProgramazioak, type Programazioa } from "@/lib/programazioa";
import { MeasurementEditor } from "@/components/MeasurementEditor";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Neurketak — Northgate" }] }),
  component: AssignmentsPage,
});

// Mock subject+class catalog. Each entry is a unique teacher-class combination.
const classCatalog = [
  { id: "fk-4a", subjectKey: "physics", subjectEu: "Fisika eta Kimika", subjectEs: "Física y Química", subjectEn: "Physics & Chemistry", group: "4A" },
  { id: "mat-2b", subjectKey: "algebra", subjectEu: "Matematika", subjectEs: "Matemáticas", subjectEn: "Mathematics", group: "2B" },
  { id: "mat-4a", subjectKey: "algebra", subjectEu: "Matematika", subjectEs: "Matemáticas", subjectEn: "Mathematics", group: "4A" },
  { id: "geo-3a", subjectKey: "geometry", subjectEu: "Geometria", subjectEs: "Geometría", subjectEn: "Geometry", group: "3A" },
  { id: "cal-12a", subjectKey: "calculus", subjectEu: "Kalkulua", subjectEs: "Cálculo", subjectEn: "Calculus", group: "12A" },
];

function classLabel(c: typeof classCatalog[number], lang: Lang) {
  const subj = lang === "es" ? c.subjectEs : lang === "en" ? c.subjectEn : c.subjectEu;
  return `${subj} ${c.group}`;
}

// Roster (mock)
const rosterByClass: Record<string, { name: string }[]> = {
  "fk-4a": [{ name: "Amara Johnson" }, { name: "Noah Chen" }, { name: "Liam Okonkwo" }],
  "mat-2b": [{ name: "Sofia Martinez" }, { name: "Elena Ruiz" }, { name: "Marcus Bell" }],
  "mat-4a": [{ name: "Amara Johnson" }, { name: "Noah Chen" }, { name: "Priya Shah" }],
  "geo-3a": [{ name: "Kenji Tanaka" }, { name: "Elena Ruiz" }],
  "cal-12a": [{ name: "Priya Shah" }, { name: "Kenji Tanaka" }, { name: "Sofia Martinez" }],
};

type ViewMode = "task" | "student";
type Eval = 1 | 2 | 3;

type Measurement = {
  id: string;
  title: string;
  classId: string;
  ikasEgoeraId: string | null;
  ikasEgoeraTitle: string | null;
  ebaluazioa: Eval;
  programName: string;
  indicatorIds: string[];
  compIds: string[];
};

function AssignmentsPage() {
  const { lang, t } = useLanguage();
  const { data: allMeas, setForActivity } = useMeasurements();
  const { list: programs } = useProgramazioak();

  const [selectedClass, setSelectedClass] = useState(classCatalog[0]);
  const [classDropOpen, setClassDropOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("task");

  // Filters
  const [filterEgoera, setFilterEgoera] = useState<string>("");
  const [filterEbal, setFilterEbal] = useState<Eval | 0>(0);

  // Custom measurements (created via Neurketa berria), scoped by classId
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Task view inline-edit state: only one task editable at a time
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Student view modal editor
  const [studentEditingId, setStudentEditingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>(rosterByClass[selectedClass.id]?.[0]?.name ?? "");
  const [studentDropOpen, setStudentDropOpen] = useState(false);

  // Filter list of measurements by class + filters
  const scopedMeasurements = useMemo(() => {
    return measurements
      .filter((m) => m.classId === selectedClass.id)
      .filter((m) => (filterEgoera ? m.ikasEgoeraId === filterEgoera : true))
      .filter((m) => (filterEbal ? m.ebaluazioa === filterEbal : true));
  }, [measurements, selectedClass.id, filterEgoera, filterEbal]);

  // Programs for the selected subject (used by picker + filter options)
  const subjectPrograms = useMemo(
    () => programs.filter((p) => p.subjectKey === selectedClass.subjectKey),
    [programs, selectedClass.subjectKey],
  );

  const egoeraOptions = useMemo(() => {
    const set = new Map<string, string>();
    subjectPrograms.forEach((p) =>
      p.ikasEgoerak.forEach((ie) => set.set(ie.id, (ie.title as any)[lang] || ie.title.eu)),
    );
    return Array.from(set.entries());
  }, [subjectPrograms, lang]);

  // Seed deterministic measurements per task id
  const defaults = useMemo(() => {
    const seed: Record<string, Record<string, number>> = {};
    scopedMeasurements.forEach((m, i) => {
      const map: Record<string, number> = {};
      m.indicatorIds.forEach((indId, ii) => {
        map[indId] = (((i + ii) % 4) + 1);
      });
      seed[m.id] = map;
    });
    return seed;
  }, [scopedMeasurements]);

  const roster = rosterByClass[selectedClass.id] ?? [];

  const studentMeasurements = (actId: string, studentIdx: number): Record<string, number> => {
    const base = allMeas[actId] ?? defaults[actId] ?? {};
    const result: Record<string, number> = {};
    Object.entries(base).forEach(([k, v]) => {
      const delta = ((studentIdx * 3 + k.charCodeAt(k.length - 1)) % 3) - 1;
      result[k] = Math.max(1, Math.min(4, v + delta));
    });
    return result;
  };

  const tryToggleTaskEdit = (id: string) => {
    if (editingTaskId && editingTaskId !== id) {
      alert(t("assign.editExclusiveWarning"));
      return;
    }
    setEditingTaskId(editingTaskId === id ? null : id);
  };

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.assignments.title")} subtitle={t("page.assignments.subtitle")} />

        {/* Subject + class selector */}
        <div className="relative w-fit">
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
            {t("assign.subjectClass")}
          </label>
          <button
            onClick={() => setClassDropOpen(!classDropOpen)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[280px]"
          >
            <span className="flex-1 text-left">{classLabel(selectedClass, lang)}</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${classDropOpen ? "rotate-180" : ""}`} />
          </button>
          {classDropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setClassDropOpen(false)} />
              <div className="absolute z-20 mt-1 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
                {classCatalog.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClass(c);
                      setClassDropOpen(false);
                      setEditingTaskId(null);
                      setFilterEgoera("");
                      setSelectedStudent(rosterByClass[c.id]?.[0]?.name ?? "");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors ${
                      c.id === selectedClass.id ? "bg-secondary/40 font-medium" : ""
                    }`}
                  >
                    {classLabel(c, lang)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View mode toggle + legend */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setViewMode("task")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "task" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              {lang === "eu" ? "Atazak" : lang === "es" ? "Tareas" : "Tasks"}
            </button>
            <button
              onClick={() => setViewMode("student")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              <User className="h-4 w-4" />
              {lang === "eu" ? "Ikasleak" : lang === "es" ? "Alumnos" : "Students"}
            </button>
          </div>

          <div className="ml-auto rounded-lg border border-border bg-card px-4 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("comp.level")}</div>
            <CompetencyLegend />
          </div>
        </div>

        {/* Filters + New measurement button */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">
              {t("assign.filterEgoera")}
            </label>
            <select
              value={filterEgoera}
              onChange={(e) => setFilterEgoera(e.target.value)}
              className="h-9 px-3 rounded-lg bg-card border border-border text-sm"
            >
              <option value="">{t("assign.allEgoerak")}</option>
              {egoeraOptions.map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">
              {t("assign.filterEbal")}
            </label>
            <div className="inline-flex rounded-lg border border-border overflow-hidden">
              {([0, 1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => setFilterEbal(n as Eval | 0)}
                  className={`h-9 px-3 text-sm font-medium ${
                    filterEbal === n ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
                  }`}
                >
                  {n === 0 ? t("assign.allEgoerak") : `${n}`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPickerOpen(true)}
            className="ml-auto h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> {t("assign.newMeasurement")}
          </button>
        </div>

        {/* Content */}
        {viewMode === "task" && (
          <TaskView
            measurements={scopedMeasurements}
            allMeas={allMeas}
            defaults={defaults}
            setForActivity={setForActivity}
            roster={roster}
            studentMeasurements={studentMeasurements}
            editingTaskId={editingTaskId}
            onToggleEdit={tryToggleTaskEdit}
            lang={lang}
            t={t}
          />
        )}

        {viewMode === "student" && (
          <StudentView
            measurements={scopedMeasurements}
            allMeas={allMeas}
            defaults={defaults}
            roster={roster}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            studentDropOpen={studentDropOpen}
            setStudentDropOpen={setStudentDropOpen}
            studentMeasurements={studentMeasurements}
            onEditClick={(id) => setStudentEditingId(id)}
            lang={lang}
            t={t}
          />
        )}

        {studentEditingId && (
          <MeasurementEditor
            open
            onClose={() => setStudentEditingId(null)}
            activityTitle={scopedMeasurements.find((m) => m.id === studentEditingId)?.title ?? ""}
            initial={allMeas[studentEditingId] ?? defaults[studentEditingId] ?? {}}
            onSave={(m) => setForActivity(studentEditingId, m)}
          />
        )}

        {pickerOpen && (
          <NewMeasurementPicker
            programs={subjectPrograms}
            selectedClass={selectedClass}
            lang={lang}
            t={t}
            onClose={() => setPickerOpen(false)}
            onPick={(m) => {
              setMeasurements((prev) => [m, ...prev]);
              setPickerOpen(false);
              setViewMode("task");
            }}
          />
        )}
      </>
    </AppShell>
  );
}

// ─────────── TASK VIEW ───────────
function TaskView({
  measurements, allMeas, defaults, setForActivity, roster,
  studentMeasurements, editingTaskId, onToggleEdit, lang, t,
}: {
  measurements: Measurement[];
  allMeas: Record<string, Record<string, number>>;
  defaults: Record<string, Record<string, number>>;
  setForActivity: (id: string, m: Record<string, number>) => void;
  roster: { name: string }[];
  studentMeasurements: (actId: string, idx: number) => Record<string, number>;
  editingTaskId: string | null;
  onToggleEdit: (id: string) => void;
  lang: Lang;
  t: (k: string) => string;
}) {
  if (measurements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {lang === "es" ? "Sin mediciones. Crea una nueva." : lang === "en" ? "No measurements yet. Create a new one." : "Ez dago neurketarik. Sortu berria."}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {measurements.map((m) => {
        const isEditing = editingTaskId === m.id;
        const base = allMeas[m.id] ?? defaults[m.id] ?? {};
        const measuredComps = mathCompetencies.filter((c) => c.indicators.some((i) => base[i.id]));
        return (
          <section key={m.id} className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <header className="px-5 py-4 border-b border-border flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{m.title}</h3>
                  {m.ikasEgoeraTitle && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {m.ikasEgoeraTitle}
                    </span>
                  )}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-foreground/70">
                    {t("assign.filterEbal")} {m.ebaluazioa}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{m.programName}</p>
              </div>
              <label className="inline-flex items-center gap-2 text-xs select-none cursor-pointer">
                <span className={isEditing ? "text-primary font-medium" : "text-muted-foreground"}>
                  {t("assign.editMode")}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleEdit(m.id)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${isEditing ? "bg-primary" : "bg-secondary"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition-all ${isEditing ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </label>
            </header>
            <div className="overflow-x-auto">
              {measuredComps.length === 0 ? (
                <p className="px-5 py-6 text-xs text-muted-foreground text-center">—</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium px-5 py-2.5 sticky left-0 bg-secondary/40 min-w-[160px]">
                        {lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}
                      </th>
                      {measuredComps.flatMap((c) =>
                        c.indicators.filter((i) => base[i.id]).map((ind) => (
                          <th key={ind.id} className="text-left font-medium px-3 py-2.5 min-w-[150px] normal-case tracking-normal">
                            <div className="font-mono text-[10px]">{ind.code}</div>
                            <div className="text-[10px] text-muted-foreground/80 leading-tight max-w-[150px] font-normal">{ind.label[lang]}</div>
                          </th>
                        )),
                      )}
                      <th className="text-left font-medium px-3 py-2.5 normal-case tracking-normal">{t("common.average")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((s, si) => {
                      const meas = studentMeasurements(m.id, si);
                      const levels = Object.values(meas) as number[];
                      const avg = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) as CompetencyLevel : null;
                      return (
                        <tr key={s.name} className="border-t border-border hover:bg-secondary/30">
                          <td className="px-5 py-3 sticky left-0 bg-card">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-[10px] font-semibold shrink-0">
                                {s.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <p className="font-medium text-xs">{s.name}</p>
                            </div>
                          </td>
                          {measuredComps.flatMap((c) =>
                            c.indicators.filter((i) => base[i.id]).map((ind) => {
                              const lv = meas[ind.id] as CompetencyLevel | undefined;
                              return (
                                <td key={ind.id} className="px-3 py-3">
                                  {lv ? (
                                    <IndicatorBar
                                      level={lv}
                                      editable={isEditing}
                                      onChange={(nlv) => {
                                        const next = { ...base, [ind.id]: nlv };
                                        setForActivity(m.id, next);
                                      }}
                                    />
                                  ) : (
                                    <span className="text-muted-foreground/40 text-xs">—</span>
                                  )}
                                </td>
                              );
                            }),
                          )}
                          <td className="px-3 py-3">
                            {avg ? <CompetencyMeter level={avg} showLabel size="sm" /> : <span className="text-muted-foreground/40 text-xs">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─────────── STUDENT VIEW ───────────
function StudentView({
  measurements, allMeas, defaults, roster, selectedStudent, setSelectedStudent,
  studentDropOpen, setStudentDropOpen, studentMeasurements, onEditClick, lang, t,
}: {
  measurements: Measurement[];
  allMeas: Record<string, Record<string, number>>;
  defaults: Record<string, Record<string, number>>;
  roster: { name: string }[];
  selectedStudent: string;
  setSelectedStudent: (s: string) => void;
  studentDropOpen: boolean;
  setStudentDropOpen: (v: boolean) => void;
  studentMeasurements: (actId: string, idx: number) => Record<string, number>;
  onEditClick: (id: string) => void;
  lang: Lang;
  t: (k: string) => string;
}) {
  const idx = Math.max(0, roster.findIndex((s) => s.name === selectedStudent));
  if (roster.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">—</p>;
  }
  return (
    <div className="space-y-4">
      <div className="relative w-fit">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
          {lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}
        </label>
        <button
          onClick={() => setStudentDropOpen(!studentDropOpen)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[240px]"
        >
          <span className="flex-1 text-left">{roster[idx]?.name ?? "—"}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${studentDropOpen ? "rotate-180" : ""}`} />
        </button>
        {studentDropOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setStudentDropOpen(false)} />
            <div className="absolute z-20 mt-1 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
              {roster.map((s) => (
                <button
                  key={s.name}
                  onClick={() => { setSelectedStudent(s.name); setStudentDropOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 ${s.name === selectedStudent ? "bg-secondary/40 font-medium" : ""}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4">
        {measurements.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            —
          </div>
        )}
        {measurements.map((m) => {
          const meas = studentMeasurements(m.id, idx);
          const measuredComps = mathCompetencies.filter((c) => c.indicators.some((i) => meas[i.id]));
          return (
            <section key={m.id} className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <header className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-border">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{m.title}</h3>
                    {m.ikasEgoeraTitle && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {m.ikasEgoeraTitle}
                      </span>
                    )}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-foreground/70">
                      {t("assign.filterEbal")} {m.ebaluazioa}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onEditClick(m.id)}
                  className="h-9 px-3 rounded-lg border border-border text-xs font-medium hover:bg-secondary inline-flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> {t("assign.edit")}
                </button>
              </header>
              <div className="p-5 grid md:grid-cols-2 gap-4">
                {measuredComps.map((c) => {
                  const inds = c.indicators.filter((i) => meas[i.id]);
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
                            level={meas[ind.id] as CompetencyLevel}
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
    </div>
  );
}

// ─────────── NEW MEASUREMENT PICKER ───────────
function NewMeasurementPicker({
  programs,
  selectedClass,
  lang,
  t,
  onClose,
  onPick,
}: {
  programs: Programazioa[];
  selectedClass: typeof classCatalog[number];
  lang: Lang;
  t: (k: string) => string;
  onClose: () => void;
  onPick: (m: Measurement) => void;
}) {
  const [ebal, setEbal] = useState<Eval>(1);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col" style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)" }}>
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{t("assign.newMeasurement")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("assign.pickTask")} · {classLabel(selectedClass, lang)}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-border flex items-center gap-2 bg-secondary/20">
          <span className="text-xs text-muted-foreground">{t("assign.filterEbal")}:</span>
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => setEbal(n)}
              className={`h-8 px-3 rounded-md text-xs font-medium ${ebal === n ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary"}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {programs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {lang === "es" ? "No hay programaciones para esta asignatura." : lang === "en" ? "No programs for this subject." : "Asignatura honetan ez dago programaziorik."}
            </p>
          )}
          {programs.map((p) => (
            <section key={p.id} className="rounded-xl border border-border">
              <header className="px-4 py-2.5 border-b border-border bg-secondary/30">
                <p className="font-medium text-sm">{p.name}</p>
              </header>
              <div className="divide-y divide-border">
                {p.ikasEgoerak.flatMap((ie) =>
                  ie.atazak.map((at) => (
                    <button
                      key={at.id}
                      type="button"
                      onClick={() =>
                        onPick({
                          id: `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
                          title: (at.title as any)[lang] || at.title.eu,
                          classId: selectedClass.id,
                          ikasEgoeraId: ie.id,
                          ikasEgoeraTitle: (ie.title as any)[lang] || ie.title.eu,
                          ebaluazioa: ebal,
                          programName: p.name,
                          compIds: at.competencies.map((c) => c.compId),
                          indicatorIds: at.competencies.flatMap((c) => c.indicatorIds),
                        })
                      }
                      className="w-full text-left px-4 py-3 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium flex-1">{(at.title as any)[lang] || at.title.eu}</p>
                        <Check className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {(ie.title as any)[lang] || ie.title.eu} · {at.competencies.length} {t("comp.title").toLowerCase()}
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
