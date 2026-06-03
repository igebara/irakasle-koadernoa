import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CompetencyMeter, CompetencyLegend, gradeToLevel, competencyCatalog } from "@/components/CompetencyMeter";

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
  const [view, setView] = useState<"numeric" | "competency">("competency");

  const subjectList = subjects[lang] || subjects.eu;
  const currentSubject = subjectList.find((s) => s.key === selectedSubject);
  const data = gradeData[selectedSubject];
  const comps = competencyCatalog[lang] || competencyCatalog.eu;
  // Map each assignment column to 1-2 competencies
  const itemCompetencies = data.items.map((_, i) => [comps[i % comps.length], comps[(i + 2) % comps.length]]);

  const gradeColor = (g: number) =>
    g >= 90 ? "text-[color:var(--success)]" : g >= 75 ? "text-foreground" : g >= 65 ? "text-[color:var(--warning)]" : "text-destructive";

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.gradebook.title")} subtitle={t("page.gradebook.subtitle")} />

        {/* Subject selector + view toggle */}
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

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              {t("comp.level")}
            </label>
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              {(["competency", "numeric"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`comp.view.${v}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto rounded-lg border border-border bg-card px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{t("comp.level")}</div>
            <CompetencyLegend />
          </div>
        </div>

        <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Ikaslea</th>
                {data.items.map((i, idx) => (
                  <th key={i} className="text-center font-medium px-4 py-3 align-bottom">
                    <div>{i}</div>
                    <div className="mt-1 font-normal normal-case tracking-normal text-[10px] text-muted-foreground/80 max-w-[140px] mx-auto leading-tight">
                      {itemCompetencies[idx].join(" · ")}
                    </div>
                  </th>
                ))}
                <th className="text-center font-medium px-6 py-3">{t("common.average")}</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => {
                const avg = Math.round(s.grades.reduce((a, b) => a + b, 0) / s.grades.length);
                return (
                  <tr key={s.name} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    {s.grades.map((g, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {view === "numeric" ? (
                          <span className={`tabular-nums font-medium ${gradeColor(g)}`}>{g}</span>
                        ) : (
                          <div className="flex justify-center">
                            <CompetencyMeter level={gradeToLevel(g)} />
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-3 text-center">
                      {view === "numeric" ? (
                        <span className={`tabular-nums font-semibold ${gradeColor(avg)}`}>{avg}</span>
                      ) : (
                        <div className="flex justify-center">
                          <CompetencyMeter level={gradeToLevel(avg)} showLabel />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </>
    </AppShell>
  );
}
