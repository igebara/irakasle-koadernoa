import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { useState } from "react";
import { Check, X, Clock, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — Northgate" }] }),
  component: AttendancePage,
});

const rosterByClass: Record<string, string[]> = {
  "10A": ["Amara Johnson", "Noah Chen", "Aisha Patel", "Lucas Schmidt", "Elena Ruiz", "Kenji Tanaka", "Priya Shah", "Marcus Bell"],
  "9B": ["Liam Okonkwo", "Marcus Bell", "Lucas Schmidt", "Maya Olsen", "Daniel Park", "Sofia Martinez"],
  "11C": ["Sofia Martinez", "Elena Ruiz", "Daniel Park", "Maya Olsen", "Aisha Patel"],
  "12A": ["Priya Shah", "Kenji Tanaka", "Amara Johnson", "Noah Chen"],
  "After-school": ["Amara Johnson", "Priya Shah", "Kenji Tanaka", "Elena Ruiz", "Liam Okonkwo", "Sofia Martinez"],
};

type Status = "present" | "absent" | "late";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const todayIdx = 3; // Thursday

function AttendancePage() {
  const { lang, t } = useLanguage();
  const { schedule } = getLocalizedData(lang);

  const [selectedClassIdx, setSelectedClassIdx] = useState(2); // default: Calculus 12A
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [classOpen, setClassOpen] = useState(false);

  const selectedClass = schedule[selectedClassIdx];
  const rosterKey = selectedClass?.grade?.replace(/^(Grade|Curso|Maila)\s+/, "").replace(/Maila$/, "").trim() ??
    Object.keys(rosterByClass)[0];
  const roster = rosterByClass[rosterKey] ?? rosterByClass["10A"];

  const [stateMap, setStateMap] = useState<Record<string, Record<string, Status>>>({});

  const getKey = (classIdx: number, day: number) => `${classIdx}-${day}`;
  const currentKey = getKey(selectedClassIdx, selectedDay);
  const state = stateMap[currentKey] ?? Object.fromEntries(roster.map((n) => [n, "present" as Status]));

  const setState = (newState: Record<string, Status>) => {
    setStateMap((prev) => ({ ...prev, [currentKey]: newState }));
  };

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

        {/* Selectors */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Class selector */}
          <div className="relative">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              {t("page.classes.title")}
            </label>
            <button
              onClick={() => setClassOpen(!classOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[220px]"
            >
              <span>{selectedClass?.subject} · {selectedClass?.grade}</span>
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${classOpen ? "rotate-180" : ""}`} />
            </button>
            {classOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setClassOpen(false)} />
                <div className="absolute z-20 mt-1 w-full min-w-[240px] rounded-lg bg-card border border-border shadow-lg overflow-hidden">
                  {schedule.map((c, i) => (
                    <button
                      key={c.subject}
                      onClick={() => { setSelectedClassIdx(i); setClassOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors flex items-center justify-between gap-3 ${i === selectedClassIdx ? "bg-secondary/40 font-medium" : ""}`}
                    >
                      <span>{c.subject}</span>
                      <span className="text-xs text-muted-foreground">{c.grade} · {c.time}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Day selector */}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
              {t("page.timetable.title")}
            </label>
            <div className="flex gap-1.5">
              {days.map((day, i) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(i)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    i === selectedDay
                      ? "bg-primary text-primary-foreground border-primary"
                      : i === todayIdx
                      ? "bg-accent/20 border-accent/40 text-accent hover:bg-accent/30"
                      : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {day}
                  {i === todayIdx && <span className="ml-1 text-[10px]">•</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4">
          <Stat label={t("common.present")} value={counts.present} tone="success" />
          <Stat label={t("common.absent")} value={counts.absent} tone="destructive" />
          <Stat label={t("common.late")} value={counts.late} tone="warning" />
        </section>

        {/* Roster */}
        <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="px-6 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{selectedClass?.subject}</p>
              <p className="text-xs text-muted-foreground">{selectedClass?.room} · {days[selectedDay]}</p>
            </div>
            <span className="text-xs text-muted-foreground">{roster.length} {t("schedule.students")}</span>
          </div>
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
