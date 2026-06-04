import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CompetencyMeter, CompetencyLegend, gradeToLevel, IndicatorBar, type CompetencyLevel } from "@/components/CompetencyMeter";
import { mathCompetencies } from "@/lib/curriculum";

export const Route = createFileRoute("/gradebook")({
  head: () => ({ meta: [{ title: "Gradebook — Northgate" }] }),
  component: GradebookPage,
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

const gradeData: Record<string, { items: string[]; students: { name: string; grades: number[] }[] }> = {
  algebra: {
    items: ["Quiz 1", "Quiz 2", "Midterm", "Project", "Quiz 3"],
    students: [
      { name: "Amara Johnson", grades: [92, 88, 85, 95, 90] },
      { name: "Liam Okonkwo", grades: [78, 82, 74, 80, 85] },
      { name: "Sofia Martinez", grades: [95, 98, 92, 96, 94] },
      { name: "Noah Chen", grades: [62, 58, 65, 70, 60] },
      { name: "Priya Shah", grades: [98, 96, 99, 95, 97] },
      { name: "Marcus Bell", grades: [70, 65, 72, 68, 71] },
      { name: "Elena Ruiz", grades: [85, 88, 82, 90, 87] },
      { name: "Kenji Tanaka", grades: [88, 90, 92, 86, 89] },
    ],
  },
  geometry: {
    items: ["Quiz 1", "Quiz 2", "Midterm", "Proofs", "Quiz 3"],
    students: [
      { name: "Amara Johnson", grades: [88, 90, 82, 78, 85] },
      { name: "Liam Okonkwo", grades: [75, 80, 72, 85, 78] },
      { name: "Sofia Martinez", grades: [92, 94, 90, 88, 91] },
      { name: "Noah Chen", grades: [68, 70, 65, 60, 72] },
      { name: "Priya Shah", grades: [96, 98, 95, 94, 97] },
      { name: "Marcus Bell", grades: [72, 68, 70, 75, 74] },
      { name: "Elena Ruiz", grades: [80, 82, 78, 85, 84] },
      { name: "Kenji Tanaka", grades: [86, 88, 85, 90, 87] },
    ],
  },
  calculus: {
    items: ["Quiz 1", "Quiz 2", "Midterm", "Derivatives", "Quiz 3"],
    students: [
      { name: "Amara Johnson", grades: [85, 82, 88, 90, 87] },
      { name: "Liam Okonkwo", grades: [70, 72, 68, 75, 74] },
      { name: "Sofia Martinez", grades: [94, 92, 96, 95, 93] },
      { name: "Noah Chen", grades: [55, 60, 58, 62, 59] },
      { name: "Priya Shah", grades: [99, 97, 98, 96, 99] },
      { name: "Marcus Bell", grades: [65, 68, 62, 70, 66] },
      { name: "Elena Ruiz", grades: [82, 85, 80, 88, 84] },
      { name: "Kenji Tanaka", grades: [90, 88, 92, 91, 89] },
    ],
  },
  statistics: {
    items: ["Quiz 1", "Quiz 2", "Midterm", "Data Analysis", "Quiz 3"],
    students: [
      { name: "Amara Johnson", grades: [90, 88, 92, 85, 89] },
      { name: "Liam Okonkwo", grades: [76, 78, 74, 80, 77] },
      { name: "Sofia Martinez", grades: [93, 95, 91, 94, 92] },
      { name: "Noah Chen", grades: [64, 66, 62, 68, 65] },
      { name: "Priya Shah", grades: [97, 96, 98, 95, 97] },
      { name: "Marcus Bell", grades: [71, 73, 69, 72, 70] },
      { name: "Elena Ruiz", grades: [84, 86, 82, 88, 85] },
      { name: "Kenji Tanaka", grades: [87, 89, 85, 91, 88] },
    ],
  },
  mathclub: {
    items: ["Challenge 1", "Challenge 2", "Team Round", "Individual", "Final"],
    students: [
      { name: "Amara Johnson", grades: [88, 85, 90, 92, 87] },
      { name: "Liam Okonkwo", grades: [82, 80, 85, 78, 84] },
      { name: "Sofia Martinez", grades: [96, 94, 98, 95, 97] },
      { name: "Noah Chen", grades: [72, 70, 68, 75, 71] },
      { name: "Priya Shah", grades: [99, 98, 100, 97, 99] },
      { name: "Marcus Bell", grades: [78, 76, 80, 74, 77] },
      { name: "Elena Ruiz", grades: [86, 84, 88, 85, 87] },
      { name: "Kenji Tanaka", grades: [92, 90, 94, 91, 93] },
    ],
  },
};

function GradebookPage() {
  const { t, lang } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState("algebra");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(0);

  const subjectList = subjects[lang] || subjects.eu;
  const currentSubject = subjectList.find((s) => s.key === selectedSubject);
  const data = gradeData[selectedSubject];

  // Map each activity to a deterministic set of competencies (2 per activity)
  const itemCompetencies = useMemo(
    () => data.items.map((_, i) => [mathCompetencies[i % mathCompetencies.length], mathCompetencies[(i + 2) % mathCompetencies.length]]),
    [data.items],
  );

  // Derive per-student per-indicator level for the selected activity.
  // Base level comes from the student's numeric grade, perturbed per indicator deterministically.
  const levelFromGradeAndSeed = (grade: number, seed: number): CompetencyLevel => {
    const base = gradeToLevel(grade);
    const delta = ((seed * 7) % 3) - 1; // -1, 0, +1
    const lv = Math.max(1, Math.min(4, base + delta));
    return lv as CompetencyLevel;
  };

  // Aggregate per-student per-competency average level across ALL activities in the subject
  const subjectSummary = useMemo(() => {
    return data.students.map((s) => {
      const perComp: Record<string, number[]> = {};
      data.items.forEach((_, ai) => {
        const comps = itemCompetencies[ai];
        comps.forEach((c, ci) => {
          c.indicators.forEach((ind, ii) => {
            const lv = levelFromGradeAndSeed(s.grades[ai], ai * 13 + ci * 5 + ii);
            (perComp[c.id] ||= []).push(lv);
          });
        });
      });
      const summary: Record<string, CompetencyLevel> = {};
      Object.entries(perComp).forEach(([cid, arr]) => {
        summary[cid] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) as CompetencyLevel;
      });
      return { student: s.name, summary };
    });
  }, [data, itemCompetencies]);

  const activeComps = itemCompetencies[selectedActivity] ?? [];

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.gradebook.title")} subtitle={t("page.gradebook.subtitle")} />

        {/* Subject selector */}
        <div className="mb-4 flex flex-wrap items-end gap-4">
          <div className="relative">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              {t("gradebook.subject")}
            </label>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[200px]"
            >
              <span>{currentSubject?.label}</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <div className="absolute z-20 mt-1 w-full min-w-[200px] max-w-[280px] rounded-lg bg-card border border-border shadow-lg overflow-hidden">
                  {subjectList.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setSelectedSubject(s.key);
                        setSelectedActivity(0);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors ${
                        s.key === selectedSubject ? "bg-secondary/40 font-medium" : ""
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="ml-auto rounded-lg border border-border bg-card px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t("comp.level")}</div>
            <CompetencyLegend />
          </div>
        </div>

        {/* Activity tabs */}
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t("nav.assignments")}</div>
          <div className="flex flex-wrap gap-1.5">
            {data.items.map((item, i) => (
              <button
                key={item}
                onClick={() => setSelectedActivity(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  i === selectedActivity
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Per-activity measurement matrix */}
        <section className="rounded-xl bg-card border border-border overflow-x-auto mb-8" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="px-5 py-3 border-b border-border bg-secondary/30">
            <h3 className="font-medium text-sm">{data.items[selectedActivity]}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeComps.map((c) => `${c.code} ${c.label[lang]}`).join(" · ")}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-2.5 sticky left-0 bg-secondary/40">Ikaslea</th>
                {activeComps.map((c) =>
                  c.indicators.map((ind) => (
                    <th key={ind.id} className="text-left font-medium px-3 py-2.5 min-w-[140px] align-bottom">
                      <div className="font-mono text-[10px] text-foreground/60">{ind.code}</div>
                      <div className="font-normal normal-case tracking-normal text-[10px] text-muted-foreground/80 leading-tight max-w-[160px]">
                        {ind.label[lang]}
                      </div>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.name} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-5 py-2.5 font-medium sticky left-0 bg-card">{s.name}</td>
                  {activeComps.map((c, ci) =>
                    c.indicators.map((ind, ii) => {
                      const lv = levelFromGradeAndSeed(s.grades[selectedActivity], selectedActivity * 13 + ci * 5 + ii);
                      return (
                        <td key={ind.id} className="px-3 py-2.5 min-w-[140px]">
                          <IndicatorBar level={lv} />
                        </td>
                      );
                    }),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Subject-wide competency summary */}
        <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="px-5 py-3 border-b border-border bg-secondary/30">
            <h3 className="font-medium text-sm">{t("comp.summary")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{currentSubject?.label}</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">Ikaslea</th>
                {mathCompetencies.map((c) => (
                  <th key={c.id} className="text-center font-medium px-3 py-2.5 align-bottom">
                    <div className="font-mono">{c.code}</div>
                    <div className="font-normal normal-case text-[10px] text-muted-foreground/80 leading-tight max-w-[110px] mx-auto mt-0.5">
                      {c.label[lang]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjectSummary.map((row) => (
                <tr key={row.student} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-5 py-3 font-medium">{row.student}</td>
                  {mathCompetencies.map((c) => {
                    const lv = row.summary[c.id];
                    return (
                      <td key={c.id} className="px-3 py-3 text-center">
                        {lv ? (
                          <div className="flex justify-center">
                            <CompetencyMeter level={lv} />
                          </div>
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
      </>
    </AppShell>
  );
}
