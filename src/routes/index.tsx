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
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teacher Portal — Northgate Academy" },
      { name: "description", content: "Teacher portal: classes, attendance, gradebook, assignments and parent messages." },
      { property: "og:title", content: "Teacher Portal — Northgate Academy" },
      { property: "og:description", content: "Teacher portal: classes, attendance, gradebook, assignments and parent messages." },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "My day", icon: LayoutDashboard, active: true },
  { label: "Classes", icon: BookOpen },
  { label: "Attendance", icon: ClipboardCheck },
  { label: "Gradebook", icon: PenSquare },
  { label: "Assignments", icon: FileText },
  { label: "Students", icon: Users },
  { label: "Timetable", icon: CalendarDays },
  { label: "Messages", icon: MessageSquare, badge: 4 },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Classes today", value: "5", hint: "2 done · 3 ahead", icon: BookOpen },
  { label: "Attendance pending", value: "3", hint: "Take before 2pm", icon: ClipboardCheck },
  { label: "Assignments to grade", value: "28", hint: "Across 4 classes", icon: PenSquare },
  { label: "Unread messages", value: "4", hint: "From 3 parents", icon: MessageSquare },
];

const schedule = [
  { time: "08:00", subject: "Algebra II", grade: "Grade 10A", room: "Room 204", students: 28, status: "Done" },
  { time: "09:30", subject: "Geometry", grade: "Grade 9B", room: "Room 204", students: 26, status: "Done" },
  { time: "11:00", subject: "Calculus", grade: "Grade 12A", room: "Room 301", students: 22, status: "Live" },
  { time: "13:00", subject: "Statistics", grade: "Grade 11C", room: "Room 207", students: 24, status: "Next" },
  { time: "14:30", subject: "Math Club", grade: "After-school", room: "Room 204", students: 14, status: "Upcoming" },
];

const assignments = [
  { title: "Quadratic equations — Problem set 4", class: "Grade 10A", due: "Today", submitted: 24, total: 28 },
  { title: "Geometry proofs — Chapter 6", class: "Grade 9B", due: "Tomorrow", submitted: 19, total: 26 },
  { title: "Limits & continuity quiz", class: "Grade 12A", due: "Jun 03", submitted: 11, total: 22 },
  { title: "Data interpretation worksheet", class: "Grade 11C", due: "Jun 05", submitted: 6, total: 24 },
];

const messages = [
  { from: "Mrs. Johnson", role: "Parent · Amara, 10A", preview: "Could we reschedule Friday's parent meeting to…", time: "12m", unread: true },
  { from: "Liam Okonkwo", role: "Student · 9B", preview: "I won't be able to submit the proofs today because…", time: "1h", unread: true },
  { from: "Mr. Martinez", role: "Parent · Sofia, 11C", preview: "Thanks for the extra resources on regression.", time: "3h", unread: false },
  { from: "Dr. Hassan", role: "Dept. Head", preview: "Curriculum review meeting moved to Thursday 4pm.", time: "Yesterday", unread: false },
];

const focusStudents = [
  { name: "Noah Chen", grade: "10A", note: "Missed 3 of last 5 assignments", trend: "down" },
  { name: "Priya Shah", grade: "12A", note: "Top performer · ready for extension", trend: "up" },
  { name: "Marcus Bell", grade: "9B", note: "Attendance dropped to 78%", trend: "down" },
];

function Index() {
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
            <p className="text-xs text-sidebar-foreground/60">Teacher Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                  {item.badge}
                </span>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="m-3 p-4 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Next class</p>
          <p className="font-display text-lg font-semibold mt-1">Calculus · 11:00</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Grade 12A · Room 301</p>
          <button className="mt-3 w-full h-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5">
            <Video className="h-3 w-3" /> Open lesson
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 flex items-center gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold text-sm">N</div>
            <span className="font-display font-semibold">Teacher</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search students, classes, assignments…"
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
            />
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
              <p className="text-xs text-muted-foreground">Mathematics · Grade 9–12</p>
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
                <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Sunday · May 31, 2026</p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold mt-2">Good morning, Sarah.</h1>
                <p className="text-primary-foreground/80 mt-2 max-w-xl">
                  You teach 5 classes today. Calculus 12A starts in 32 minutes — your lesson plan is ready.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 px-4 rounded-lg bg-primary-foreground text-primary text-sm font-medium hover:bg-primary-foreground/90 transition">
                  Take attendance
                </button>
                <button className="h-10 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium hover:bg-primary-foreground/20 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" /> New assignment
                </button>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-secondary text-primary grid place-items-center">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl font-semibold mt-4">{s.value}</p>
                <p className="text-sm font-medium mt-1">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.hint}</p>
              </div>
            ))}
          </section>

          {/* Two-column main content */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Today's schedule */}
            <div className="xl:col-span-2 rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">My classes today</h2>
                  <p className="text-sm text-muted-foreground">5 sessions · Math Department</p>
                </div>
                <button className="text-sm text-accent font-medium hover:underline">Full timetable</button>
              </div>
              <ul className="divide-y divide-border">
                {schedule.map((c) => (
                  <li key={c.subject} className="py-4 flex items-center gap-4">
                    <div className="w-14 text-sm font-mono text-muted-foreground">{c.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{c.subject} · <span className="text-muted-foreground font-normal">{c.grade}</span></p>
                      <p className="text-xs text-muted-foreground">{c.room} · {c.students} students</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        c.status === "Live"
                          ? "bg-accent text-accent-foreground"
                          : c.status === "Done"
                          ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                          : c.status === "Next"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Focus students */}
            <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Needs attention</h2>
                  <p className="text-sm text-muted-foreground">Students to check in with</p>
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
                View full roster
              </button>
            </div>
          </section>

          {/* Lower row */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Assignments to grade */}
            <div className="xl:col-span-2 rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Assignments to grade</h2>
                  <p className="text-sm text-muted-foreground">28 submissions waiting</p>
                </div>
                <button className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> New
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-6 py-3">Assignment</th>
                    <th className="text-left font-medium px-6 py-3">Class</th>
                    <th className="text-left font-medium px-6 py-3">Due</th>
                    <th className="text-left font-medium px-6 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const pct = Math.round((a.submitted / a.total) * 100);
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
                          <span className={`text-xs font-medium ${a.due === "Today" ? "text-destructive" : "text-muted-foreground"}`}>
                            {a.due}
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
                  <h2 className="font-display text-lg font-semibold">Inbox</h2>
                  <p className="text-xs text-muted-foreground">4 unread</p>
                </div>
                <button className="text-xs text-accent font-medium hover:underline">Open</button>
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
                <CheckCircle2 className="h-4 w-4" /> Mark all read
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
