import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Search, Mail } from "lucide-react";

export const Route = createFileRoute("/students")({
  head: () => ({ meta: [{ title: "Students — Northgate" }] }),
  component: StudentsPage,
});

const students = [
  { name: "Amara Johnson", grade: "10A", email: "amara.j@northgate.edu", avg: 90 },
  { name: "Liam Okonkwo", grade: "9B", email: "liam.o@northgate.edu", avg: 80 },
  { name: "Sofia Martinez", grade: "11C", email: "sofia.m@northgate.edu", avg: 95 },
  { name: "Noah Chen", grade: "10A", email: "noah.c@northgate.edu", avg: 63 },
  { name: "Priya Shah", grade: "12A", email: "priya.s@northgate.edu", avg: 97 },
  { name: "Marcus Bell", grade: "9B", email: "marcus.b@northgate.edu", avg: 69 },
  { name: "Elena Ruiz", grade: "11C", email: "elena.r@northgate.edu", avg: 86 },
  { name: "Kenji Tanaka", grade: "12A", email: "kenji.t@northgate.edu", avg: 89 },
  { name: "Aisha Patel", grade: "10A", email: "aisha.p@northgate.edu", avg: 92 },
  { name: "Lucas Schmidt", grade: "9B", email: "lucas.s@northgate.edu", avg: 75 },
];

function StudentsPage() {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const filtered = students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.grade.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.students.title")} subtitle={t("page.students.subtitle")} />
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.search")}
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-card border border-border focus:border-ring outline-none text-sm"
          />
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <article key={s.email} className="rounded-xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-semibold">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.grade}</p>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${s.avg >= 90 ? "text-[color:var(--success)]" : s.avg < 70 ? "text-destructive" : "text-foreground"}`}>
                  {s.avg}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{s.email}</span>
              </div>
            </article>
          ))}
        </section>
      </>
    </AppShell>
  );
}