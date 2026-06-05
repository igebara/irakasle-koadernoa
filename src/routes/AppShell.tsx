import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Search,
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  BookOpen,
  PenSquare,
  FileText,
  Users,
  CalendarDays,
  CalendarRange,
  Video,
  Globe,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  ShieldCheck,
  GraduationCap,
  Check,
} from "lucide-react";
import { useRef, useState, useEffect, type ReactNode } from "react";
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
] as const;

type Role = "teacher" | "tutor" | "admin";

const roles: {
  key: Role;
  icon: typeof UserCircle;
  labelEu: string;
  labelEs: string;
  labelEn: string;
  descEu: string;
  descEs: string;
  descEn: string;
}[] = [
  {
    key: "teacher",
    icon: GraduationCap,
    labelEu: "Irakaslea",
    labelEs: "Profesor/a",
    labelEn: "Teacher",
    descEu: "Klaseen kudeaketa",
    descEs: "Gestión de clases",
    descEn: "Class management",
  },
  {
    key: "tutor",
    icon: UserCircle,
    labelEu: "Tutorea",
    labelEs: "Tutor/a",
    labelEn: "Tutor",
    descEu: "Ikasleen jarraipena",
    descEs: "Seguimiento de alumnos",
    descEn: "Student follow-up",
  },
  {
    key: "admin",
    icon: ShieldCheck,
    labelEu: "Administratzailea",
    labelEs: "Administrador/a",
    labelEn: "Admin",
    descEu: "Ikastetxearen kudeaketa",
    descEs: "Gestión del centro",
    descEn: "School management",
  },
];

function getRoleLabel(role: Role, lang: Lang) {
  const r = roles.find((r) => r.key === role)!;
  if (lang === "eu") return r.labelEu;
  if (lang === "es") return r.labelEs;
  return r.labelEn;
}

function ProfileDropdown() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("teacher");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLabel =
    lang === "eu" ? "Profila aldatu" : lang === "es" ? "Cambiar perfil" : "Switch profile";
  const settingsLabel =
    lang === "eu"
      ? "Kontuaren ezarpenak"
      : lang === "es"
        ? "Ajustes de cuenta"
        : "Account settings";
  const signOutLabel =
    lang === "eu" ? "Saioa itxi" : lang === "es" ? "Cerrar sesión" : "Sign out";

  const ActiveRoleIcon = roles.find((r) => r.key === activeRole)?.icon ?? GraduationCap;

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-semibold text-sm shrink-0">
          SR
        </div>
        <div className="hidden md:block leading-tight text-left">
          <p className="text-sm font-semibold">Sarah Reyes</p>
          <div className="flex items-center gap-1 mt-0.5">
            <ActiveRoleIcon className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{getRoleLabel(activeRole, lang)}</p>
          </div>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground hidden md:block transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-card border border-border z-50 overflow-hidden"
            style={{
              boxShadow:
                "0 12px 40px -8px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-bold text-base shrink-0">
                  SR
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">Sarah Reyes</p>
                  <p className="text-xs text-muted-foreground truncate">
                    sarah.reyes@northgate.edu
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <ActiveRoleIcon className="h-3 w-3 text-accent shrink-0" />
                    <span className="text-xs font-medium text-accent">
                      {getRoleLabel(activeRole, lang)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role switcher */}
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1 mb-2">
                {switchLabel}
              </p>
              {roles.map((r) => {
                const RIcon = r.icon;
                const isActive = r.key === activeRole;
                const label =
                  lang === "eu" ? r.labelEu : lang === "es" ? r.labelEs : r.labelEn;
                const desc =
                  lang === "eu" ? r.descEu : lang === "es" ? r.descEs : r.descEn;
                return (
                  <button
                    key={r.key}
                    onClick={() => setActiveRole(r.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${isActive ? "bg-primary/15" : "bg-secondary"}`}
                    >
                      <RIcon
                        className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className={`text-sm font-medium leading-tight ${isActive ? "text-primary" : ""}`}
                      >
                        {label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        {desc}
                      </p>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border mx-3 my-1" />

            {/* Settings */}
            <div className="px-3 py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/settings" });
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary/60 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center shrink-0">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-medium">{settingsLabel}</span>
              </button>
            </div>

            <div className="h-px bg-border mx-3 my-1" />

            {/* Sign out */}
            <div className="px-3 pb-3 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-destructive/10 grid place-items-center shrink-0">
                  <LogOut className="h-4 w-4 text-destructive" />
                </div>
                <span className="font-medium">{signOutLabel}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();

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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
          <p className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
            {t("sidebar.nextClass")}
          </p>
          <p className="font-display text-lg font-semibold mt-1">Kalkulua · 11:00</p>
          <p className="text-xs text-sidebar-foreground/60 mt-1">{t("sidebar.nextClassDetail")}</p>
          <Link
            to="/classes"
            className="mt-3 w-full h-8 rounded-md bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium hover:opacity-90 inline-flex items-center justify-center gap-1.5"
          >
            <Video className="h-3 w-3" /> {t("sidebar.openLesson")}
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 flex items-center gap-3">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold text-sm">
              N
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder={t("topbar.search")}
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language */}
            <div className="relative">
              <label htmlFor="lang-select" className="sr-only">
                {t("lang.label")}
              </label>
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                id="lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="h-9 pl-8 pr-3 rounded-lg bg-secondary border border-transparent hover:border-border focus:border-ring focus:bg-background outline-none text-sm font-medium cursor-pointer appearance-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.code.toUpperCase()} · {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notifications */}
            <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>

            <div className="w-px h-6 bg-border" />

            {/* Profile */}
            <ProfileDropdown />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
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
