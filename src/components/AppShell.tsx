import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Search,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  Settings,
  BookOpen,
  PenSquare,
  FileText,
  Users,
  CalendarDays,
  CalendarRange,
  Video,
  Globe,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage, languages, type Lang } from "@/lib/i18n";

const navItems = [
  { key: "nav.myDay", to: "/", icon: LayoutDashboard },
  { key: "nav.classes", to: "/classes", icon: BookOpen },
  { key: "nav.attendance", to: "/attendance", icon: ClipboardCheck },
  { key: "nav.gradebook", to: "/gradebook", icon: PenSquare },
  { key: "nav.assignments", to: "/assignments", icon: FileText },
  { key: "nav.programazioa", to: "/programazioa", icon: CalendarRange },
  { key: "nav.students", to: "/students", icon: Users },
  { key: "nav.timetable", to: "/timetable", icon: CalendarDays },
  { key: "nav.messages", to: "/messages", icon: MessageSquare, badge: 4 },
  { key: "nav.settings", to: "/settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
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
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{t(item.key)}</span>
                {"badge" in item && item.badge ? (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-accent text-accent-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 p-4 rounded-xl bg-sidebar-accent text-sidebar-accent-foreground">
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">{t("sidebar.nextClass")}</p>
          <p className="font-display text-lg font-semibold mt-1">Kalkulua · 11:00</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{t("sidebar.nextClassDetail")}</p>
          <button className="mt-3 w-full h-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5">
            <Video className="h-3 w-3" /> {t("sidebar.openLesson")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
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

        <main className="flex-1 p-4 md:p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}