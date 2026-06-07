import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  CheckCircle2,
  Clock,
  PenSquare,
  ChevronRight,
  Star,
} from "lucide-react";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Irakasle Ataria — Northgate Akademia" },
      { name: "description", content: "Irakasle ataria: klaseak, asistentzia, notategia, lanak eta gurasoen mezuak." },
      { property: "og:title", content: "Irakasle Ataria — Northgate Akademia" },
      { property: "og:description", content: "Irakasle ataria: klaseak, asistentzia, notategia, lanak eta gurasoen mezuak." },
    ],
  }),
  component: Index,
});

function Index() {
  const { lang, t } = useLanguage();
  const { schedule, messages, focusStudents } = getLocalizedData(lang);

  const stats = [
    { labelKey: "stats.classesToday", value: "5", hintKey: "stats.classesToday.hint", icon: BookOpen, to: "/classes" },
    { labelKey: "stats.attendancePending", value: "3", hintKey: "stats.attendancePending.hint", icon: ClipboardCheck, to: "/attendance" },
    { labelKey: "stats.toGrade", value: "28", hintKey: "stats.toGrade.hint", icon: PenSquare, to: "/gradebook" },
    { labelKey: "stats.unread", value: "4", hintKey: "stats.unread.hint", icon: MessageSquare, to: "/messages" },
  ];

  return (
    <AppShell>
      <>
        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link key={s.labelKey} to={s.to} className="rounded-xl bg-card border border-border p-5 hover:border-accent transition-colors block" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-secondary text-primary grid place-items-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="font-display text-2xl font-semibold mt-4">{s.value}</p>
              <p className="text-sm font-medium mt-1">{t(s.labelKey)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(s.hintKey)}</p>
            </Link>
          ))}
        </section>

        {/* Hero */}
        <section
          className="rounded-2xl p-6 md:p-8 text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">{t("hero.date")}</p>
              <h1 className="font-display text-3xl md:text-4xl font-semibold mt-2">{t("hero.greeting")}</h1>
              <p className="text-primary-foreground/80 mt-2 max-w-xl">
                {t("hero.intro")}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/attendance"
                className="h-10 px-4 rounded-lg bg-primary-foreground text-primary text-sm font-medium hover:bg-primary-foreground/90 transition inline-flex items-center"
              >
                {t("hero.takeAttendance")}
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        </section>

        {/* Two-column main content */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Today's schedule */}
          <div className="xl:col-span-2 rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold">{t("schedule.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("schedule.subtitle")}</p>
              </div>
              <Link to="/timetable" className="text-sm text-accent font-medium hover:underline">{t("schedule.full")}</Link>
            </div>
            <ul className="divide-y divide-border">
              {schedule.map((c) => (
                <li key={c.subject} className="py-4 flex items-center gap-4">
                  <div className="w-14 text-sm font-mono text-muted-foreground">{c.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.subject} · <span className="text-muted-foreground font-normal">{c.grade}</span></p>
                    <p className="text-xs text-muted-foreground">{c.room} · {c.students} {t("schedule.students")}</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.statusKey === "status.live"
                        ? "bg-accent text-accent-foreground"
                        : c.statusKey === "status.done"
                        ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                        : c.statusKey === "status.next"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {t(c.statusKey)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Messages inbox */}
          <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold">{t("inbox.title")}</h2>
                <p className="text-xs text-muted-foreground">{t("inbox.unread")}</p>
              </div>
              <Link to="/messages" className="text-xs text-accent font-medium hover:underline">{t("inbox.open")}</Link>
            </div>
            <ul className="space-y-4">
              {messages.map((m) => (
                <li key={m.from} className="group">
                  <div className="flex items-start gap-3">
                    <div className="relative mt-0.5 h-9 w-9 rounded-full bg-secondary text-primary grid place-items-center shrink-0 font-semibold text-xs">
                      {m.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      {m.unread && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-card" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${m.unread ? "font-semibold" : "font-medium"}`}>{m.from}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{m.role}</p>
                      <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-2 leading-snug">{m.preview}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/messages"
              className="mt-4 w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> {t("inbox.markAll")}
            </Link>
          </div>
        </section>
      </>
    </AppShell>
  );
}
