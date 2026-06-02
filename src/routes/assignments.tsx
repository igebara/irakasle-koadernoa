import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { Plus, Paperclip } from "lucide-react";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Assignments — Northgate" }] }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { lang, t } = useLanguage();
  const { assignments } = getLocalizedData(lang);

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
        <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3">{t("assign.col.assignment")}</th>
                <th className="text-left font-medium px-6 py-3">{t("assign.col.class")}</th>
                <th className="text-left font-medium px-6 py-3">{t("assign.col.due")}</th>
                <th className="text-left font-medium px-6 py-3">{t("assign.col.submitted")}</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const pct = Math.round((a.submitted / a.total) * 100);
                const dueLabel = a.dueKey ? t(a.dueKey) : a.dueLabel ?? "";
                const isUrgent = a.dueKey === "due.today";
                return (
                  <tr key={a.title} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{a.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{a.class}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>{dueLabel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">{a.submitted}/{a.total}</span>
                      </div>
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