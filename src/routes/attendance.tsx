import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Check, X, Clock } from "lucide-react";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Northgate" }] }),
  component: AttendancePage,
});

const roster = [
  "Amara Johnson", "Liam Okonkwo", "Sofia Martinez", "Noah Chen",
  "Priya Shah", "Marcus Bell", "Elena Ruiz", "Kenji Tanaka",
  "Aisha Patel", "Lucas Schmidt", "Maya Olsen", "Daniel Park",
];

type Status = "present" | "absent" | "late";

function AttendancePage() {
  const { t } = useLanguage();
  const [state, setState] = useState<Record<string, Status>>(
    Object.fromEntries(roster.map((n) => [n, "present" as Status])),
  );

  const counts = Object.values(state).reduce(
    (a, s) => ({ ...a, [s]: a[s] + 1 }),
    { present: 0, absent: 0, late: 0 } as Record<Status, number>,
  );

  const btn = (active: boolean, kind: Status) => {
    const base = "h-8 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors";
    const tones: Record<Status, string> = {
      present: active ? "bg-[color:var(--success)] text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/70",
      absent: active ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70",
      late: active ? "bg-[color:var(--warning)] text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/70",
    };
    return `${base} ${tones[kind]}`;
  };

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.attendance.title")} subtitle={t("page.attendance.subtitle")} />
        <section className="grid grid-cols-3 gap-4">
          <Stat label={t("common.present")} value={counts.present} tone="success" />
          <Stat label={t("common.absent")} value={counts.absent} tone="destructive" />
          <Stat label={t("common.late")} value={counts.late} tone="warning" />
        </section>
        <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <ul className="divide-y divide-border">
            {roster.map((name) => (
              <li key={name} className="flex items-center gap-4 px-6 py-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-semibold">
                  {name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="flex-1 text-sm font-medium">{name}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setState({ ...state, [name]: "present" })} className={btn(state[name] === "present", "present")}>
                    <Check className="h-3 w-3" /> {t("common.present")}
                  </button>
                  <button onClick={() => setState({ ...state, [name]: "late" })} className={btn(state[name] === "late", "late")}>
                    <Clock className="h-3 w-3" /> {t("common.late")}
                  </button>
                  <button onClick={() => setState({ ...state, [name]: "absent" })} className={btn(state[name] === "absent", "absent")}>
                    <X className="h-3 w-3" /> {t("common.absent")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "success" | "destructive" | "warning" }) {
  const color = tone === "success" ? "var(--success)" : tone === "warning" ? "var(--warning)" : "var(--destructive)";
  return (
    <div className="rounded-xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
      <p className="font-display text-3xl font-semibold" style={{ color }}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}