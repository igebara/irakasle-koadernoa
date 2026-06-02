import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { BookOpen, Users, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/classes")({
  head: () => ({ meta: [{ title: "Classes — Northgate" }] }),
  component: ClassesPage,
});

function ClassesPage() {
  const { lang, t } = useLanguage();
  const { schedule } = getLocalizedData(lang);

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.classes.title")} subtitle={t("page.classes.subtitle")} />
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {schedule.map((c) => (
            <article
              key={c.subject}
              className="rounded-xl bg-card border border-border p-5 hover:border-accent transition-colors"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 rounded-lg bg-secondary text-primary grid place-items-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">{c.time}</span>
              </div>
              <h2 className="font-display text-lg font-semibold mt-4">{c.subject}</h2>
              <p className="text-sm text-muted-foreground">{c.grade} · {c.room}</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" /> {c.students} {t("schedule.students")}
                </span>
                <button className="inline-flex items-center gap-1 text-accent font-medium hover:underline">
                  {t("sidebar.openLesson")} <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </>
    </AppShell>
  );
}