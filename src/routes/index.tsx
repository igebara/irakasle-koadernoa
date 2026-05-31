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
  Wallet,
  MessageSquare,
  Settings,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northgate Academy — School Management" },
      { name: "description", content: "Unified school management dashboard for administrators, teachers, students, and parents." },
      { property: "og:title", content: "Northgate Academy — School Management" },
      { property: "og:description", content: "Unified school management dashboard for administrators, teachers, students, and parents." },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Students", icon: Users },
  { label: "Teachers", icon: GraduationCap },
  { label: "Classes", icon: BookOpen },
  { label: "Attendance", icon: ClipboardCheck },
  { label: "Timetable", icon: CalendarDays },
  { label: "Fees", icon: Wallet },
  { label: "Messages", icon: MessageSquare },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Students", value: "1,284", delta: "+4.2%", up: true, icon: Users },
  { label: "Teaching Staff", value: "96", delta: "+2", up: true, icon: GraduationCap },
  { label: "Attendance Today", value: "94.7%", delta: "-1.3%", up: false, icon: ClipboardCheck },
  { label: "Fees Collected", value: "$182,940", delta: "+12.8%", up: true, icon: Wallet },
];

const schedule = [
  { time: "08:00", subject: "Mathematics — Grade 10A", room: "Room 204", teacher: "Ms. Adeyemi", status: "Live" },
  { time: "09:30", subject: "Physics — Grade 11B", room: "Lab 3", teacher: "Mr. Okafor", status: "Next" },
  { time: "11:00", subject: "English Literature — Grade 9C", room: "Room 112", teacher: "Mrs. Bennett", status: "Upcoming" },
  { time: "13:00", subject: "History — Grade 12A", room: "Room 301", teacher: "Dr. Hassan", status: "Upcoming" },
];

const announcements = [
  { title: "Mid-term exams begin June 15", meta: "Academic Office · 2h ago", tag: "Exams" },
  { title: "Parent–teacher meeting this Friday", meta: "Principal · 5h ago", tag: "Event" },
  { title: "Library closed Saturday for renovation", meta: "Facilities · 1d ago", tag: "Notice" },
];

const enrollments = [
  { name: "Amara Johnson", grade: "Grade 10", date: "May 28", status: "Approved" },
  { name: "Liam Okonkwo", grade: "Grade 7", date: "May 27", status: "Pending" },
  { name: "Sofia Martinez", grade: "Grade 11", date: "May 27", status: "Approved" },
  { name: "Noah Chen", grade: "Grade 9", date: "May 26", status: "Review" },
];

const attendanceBars = [
  { d: "Mon", v: 96 },
  { d: "Tue", v: 92 },
  { d: "Wed", v: 88 },
  { d: "Thu", v: 94 },
  { d: "Fri", v: 91 },
  { d: "Sat", v: 70 },
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
            <p className="text-xs text-sidebar-foreground/60">Academy · EST. 1962</p>
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
              {item.label}
            </a>
          ))}
        </nav>
        <div className="m-3 p-4 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Term ending</p>
          <p className="font-display text-lg font-semibold mt-1">28 days left</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Spring Term 2026</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 flex items-center gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold text-sm">N</div>
            <span className="font-display font-semibold">Northgate</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search students, classes, staff…"
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
            />
          </div>
          <button className="relative h-10 w-10 grid place-items-center rounded-lg hover:bg-secondary">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-semibold text-sm">
              EA
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-sm font-medium">Eleanor Avery</p>
              <p className="text-xs text-muted-foreground">Principal</p>
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
                <h1 className="font-display text-3xl md:text-4xl font-semibold mt-2">Good morning, Eleanor.</h1>
                <p className="text-primary-foreground/80 mt-2 max-w-xl">
                  Three teachers reported absences today and 12 fee payments need your approval.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="h-10 px-4 rounded-lg bg-primary-foreground text-primary text-sm font-medium hover:bg-primary-foreground/90 transition">
                  Daily briefing
                </button>
                <button className="h-10 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm font-medium hover:bg-primary-foreground/20 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" /> New announcement
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
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${s.up ? "text-[color:var(--success)]" : "text-destructive"}`}>
                    {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {s.delta}
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold mt-4">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </section>

          {/* Two-column main content */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Today's schedule */}
            <div className="xl:col-span-2 rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Today's schedule</h2>
                  <p className="text-sm text-muted-foreground">Live classes across all grades</p>
                </div>
                <button className="text-sm text-accent font-medium hover:underline">View timetable</button>
              </div>
              <ul className="divide-y divide-border">
                {schedule.map((c) => (
                  <li key={c.subject} className="py-4 flex items-center gap-4">
                    <div className="w-14 text-sm font-mono text-muted-foreground">{c.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{c.subject}</p>
                      <p className="text-xs text-muted-foreground">{c.teacher} · {c.room}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        c.status === "Live"
                          ? "bg-accent text-accent-foreground"
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

            {/* Attendance chart */}
            <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Attendance</h2>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">Avg 91.8%</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-44">
                {attendanceBars.map((b) => (
                  <div key={b.d} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full rounded-md bg-gradient-to-t from-primary to-accent" style={{ height: `${b.v}%` }} />
                    <span className="text-xs text-muted-foreground">{b.d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Present</p>
                  <p className="font-display font-semibold text-lg">1,216</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Absent</p>
                  <p className="font-display font-semibold text-lg">68</p>
                </div>
              </div>
            </div>
          </section>

          {/* Lower row */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent enrollments */}
            <div className="xl:col-span-2 rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Recent enrollments</h2>
                  <p className="text-sm text-muted-foreground">14 new admissions this week</p>
                </div>
                <button className="text-sm text-accent font-medium hover:underline">See all</button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-6 py-3">Student</th>
                    <th className="text-left font-medium px-6 py-3">Grade</th>
                    <th className="text-left font-medium px-6 py-3">Date</th>
                    <th className="text-left font-medium px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.name} className="border-t border-border">
                      <td className="px-6 py-4 font-medium">{e.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.grade}</td>
                      <td className="px-6 py-4 text-muted-foreground">{e.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            e.status === "Approved"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : e.status === "Pending"
                              ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {e.status === "Approved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Announcements */}
            <div className="rounded-xl bg-card border border-border p-6" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold">Announcements</h2>
                <button className="text-xs text-accent font-medium hover:underline">Post</button>
              </div>
              <ul className="space-y-4">
                {announcements.map((a) => (
                  <li key={a.title} className="group">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-8 w-8 rounded-lg bg-secondary text-primary grid place-items-center shrink-0">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug group-hover:text-accent transition-colors">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{a.meta}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {a.tag}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
