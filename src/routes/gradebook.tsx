import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/gradebook")({
  head: () => ({ meta: [{ title: "Gradebook — Northgate" }] }),
  component: GradebookPage,
});

const items = ["Quiz 1", "Quiz 2", "Midterm", "Project", "Quiz 3"];
const students = [
  { name: "Amara Johnson", grades: [92, 88, 85, 95, 90] },
  { name: "Liam Okonkwo", grades: [78, 82, 74, 80, 85] },
  { name: "Sofia Martinez", grades: [95, 98, 92, 96, 94] },
  { name: "Noah Chen", grades: [62, 58, 65, 70, 60] },
  { name: "Priya Shah", grades: [98, 96, 99, 95, 97] },
  { name: "Marcus Bell", grades: [70, 65, 72, 68, 71] },
  { name: "Elena Ruiz", grades: [85, 88, 82, 90, 87] },
  { name: "Kenji Tanaka", grades: [88, 90, 92, 86, 89] },
];

function GradebookPage() {
  const { t } = useLanguage();

  const gradeColor = (g: number) =>
    g >= 90 ? "text-[color:var(--success)]" : g >= 75 ? "text-foreground" : g >= 65 ? "text-[color:var(--warning)]" : "text-destructive";

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.gradebook.title")} subtitle={t("page.gradebook.subtitle")} />
        <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">Student</th>
                {items.map((i) => <th key={i} className="text-center font-medium px-4 py-3">{i}</th>)}
                <th className="text-center font-medium px-6 py-3">{t("common.average")}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const avg = Math.round(s.grades.reduce((a, b) => a + b, 0) / s.grades.length);
                return (
                  <tr key={s.name} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    {s.grades.map((g, i) => (
                      <td key={i} className={`px-4 py-3 text-center tabular-nums font-medium ${gradeColor(g)}`}>{g}</td>
                    ))}
                    <td className={`px-6 py-3 text-center tabular-nums font-semibold ${gradeColor(avg)}`}>{avg}</td>
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