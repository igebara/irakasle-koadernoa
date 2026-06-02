import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/timetable")({
  head: () => ({ meta: [{ title: "Timetable — Northgate" }] }),
  component: TimetablePage,
});

const slots = ["08:00", "09:30", "11:00", "13:00", "14:30"];
const week: Record<string, Record<string, string>> = {
  mon: { "08:00": "Algebra II · 10A", "11:00": "Calculus · 12A", "13:00": "Statistics · 11C" },
  tue: { "09:30": "Geometry · 9B", "11:00": "Calculus · 12A", "14:30": "Math Club" },
  wed: { "08:00": "Algebra II · 10A", "09:30": "Geometry · 9B", "13:00": "Statistics · 11C" },
  thu: { "11:00": "Calculus · 12A", "13:00": "Statistics · 11C", "14:30": "Math Club" },
  fri: { "08:00": "Algebra II · 10A", "09:30": "Geometry · 9B", "11:00": "Calculus · 12A" },
};

function TimetablePage() {
  const { t } = useLanguage();
  const days = [
    { key: "mon", label: t("common.weekday.mon") },
    { key: "tue", label: t("common.weekday.tue") },
    { key: "wed", label: t("common.weekday.wed") },
    { key: "thu", label: t("common.weekday.thu") },
    { key: "fri", label: t("common.weekday.fri") },
  ];

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.timetable.title")} subtitle={t("page.timetable.subtitle")} />
        <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-6 py-3 w-20"></th>
                {days.map((d) => <th key={d.key} className="text-left font-medium px-4 py-3">{d.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot} className="border-t border-border">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{slot}</td>
                  {days.map((d) => {
                    const cell = week[d.key]?.[slot];
                    return (
                      <td key={d.key} className="px-4 py-2">
                        {cell ? (
                          <div className="rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground px-3 py-2 text-xs font-medium">
                            {cell}
                          </div>
                        ) : (
                          <div className="h-9 rounded-md border border-dashed border-border" />
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