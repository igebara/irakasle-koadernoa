import { createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Bell,
  Search,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Settings,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
  PenSquare,
  ChevronRight,
  Star,
  Video,
  Paperclip,
  Globe,
} from "lucide-react";
import { useLanguage, languages, getLocalizedData, type Lang } from "@/lib/i18n";

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
  const { lang, setLang, t } = useLanguage();
  const { schedule, assignments, messages, focusStudents } = getLocalizedData(lang);

  const navItems: { key: string; icon: typeof LayoutDashboard; active?: boolean; badge?: number }[] = [
    { key: "nav.myDay", icon: LayoutDashboard, active: true },
    { key: "nav.classes", icon: BookOpen },
    { key: "nav.attendance", icon: ClipboardCheck },
    { key: "nav.gradebook", icon: PenSquare },
    { key: "nav.assignments", icon: FileText },
    { key: "nav.students", icon: Users },
    { key: "nav.timetable", icon: CalendarDays },
    { key: "nav.messages", icon: MessageSquare, badge: 4 },
    { key: "nav.settings", icon: Settings },
  ];

  const stats = [
    { labelKey: "stats.classesToday", value: "5", hintKey: "stats.classesToday.hint", icon: BookOpen },
    { labelKey: "stats.attendancePending", value: "3", hintKey: "stats.attendancePending.hint", icon: ClipboardCheck },
    { labelKey: "stats.toGrade", value: "28", hintKey: "stats.toGrade.hint", icon: PenSquare },
    { labelKey: "stats.unread", value: "4", hintKey: "stats.unread.hint", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-display font-bold">
            N
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-tight">Northgate</p>
            <p className="text-xs text-sidebar-foreground/60">{t("brand.portal")}</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.key}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{t(item.key)}</span>
              {item.badge ? (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                  {item.badge}
                </span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="m-3 p-4 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">{t("sidebar.nextClass")}</p>
          <p className="font-display text-lg font-semibold mt-1">{schedule[2].subject} · 11:00</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{t("sidebar.nextClassDetail")}</p>
          <button className="mt-3 w-full h-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5">
            <Video className="h-3 w-3" /> {t("sidebar.openLesson")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 flex items-center gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold text-sm">N</div>
            <span className="font-display font-semibold">{t("topbar.teacher")}</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder={t("topbar.search")}
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
            />
          </div>
          {/* Language selector */}
          <div className="relative">
            <label htmlFor="lang-select" className="sr-only">{t("lang.label")}</label>
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-10 pl-8 pr-3 rounded-lg bg-secondary border border-transparent hover:border-border focus:border-ring focus:bg-background outline-none text-sm font-medium cursor-pointer appearance-none"
              aria-label={t("lang.label")}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code.toUpperCase()} · {l.label}
                </option>
              ))}
            </select>
          </div>
          <button className="relative h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-semibold text-sm">
              SR
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-medium">Sarah Reyes</p>
              <p className="text-xs text-muted-foreground">{t("topbar.role")}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-8">
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
                <button className="h-10 px-4 rounded-lg bg-primary-foreground text-primary text-sm font-medium hover:bg-primary-foreground/90 transition">
                  {t("hero.takeAttendance")}
                </button>
                <button className="h-10 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium hover:bg-primary-foreground/20 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" /> {t("hero.newAssignment")}
                </button>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.labelKey} className="rounded-xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-secondary text-primary grid place-items-center">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl font-semibold mt-4">{s.value}</p>
                <p className="text-sm font-medium mt-1">{t(s.labelKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(s.hintKey)}</p>
              </div>
            ))}
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
                <button className="text-sm text-accent font-medium hover:underline">{t("schedule.full")}</button>
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

            {/* Focus students */}
            <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">{t("focus.title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("focus.subtitle")}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {focusStudents.map((s) => (
                  <li key={s.name} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground text-xs font-semibold shrink-0">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{s.name}</p>
                        <span className="text-[10px] text-muted-foreground">{s.grade}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug mt-0.5">{s.note}</p>
                    </div>
                    {s.trend === "up" ? (
                      <Star className="h-4 w-4 text-[color:var(--warning)] shrink-0 mt-1" />
                    ) : (
                      <Clock className="h-4 w-4 text-destructive shrink-0 mt-1" />
                    )}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full h-9 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition">
                {t("focus.viewAll")}
              </button>
            </div>
          </section>

          {/* Lower row */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Assignments to grade */}
            <div className="xl:col-span-2 rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">{t("assign.title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("assign.subtitle")}</p>
                </div>
                <button className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> {t("assign.new")}
                </button>
              </div>
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
                          <span className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                            {dueLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-secondary overflow-hidden">
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
            </div>

            {/* Messages */}
            <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">{t("inbox.title")}</h2>
                  <p className="text-xs text-muted-foreground">{t("inbox.unread")}</p>
                </div>
                <button className="text-xs text-accent font-medium hover:underline">{t("inbox.open")}</button>
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
              <button className="mt-4 w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {t("inbox.markAll")}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
