import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell, Search, LayoutDashboard, ClipboardCheck, MessageSquare,
  BookOpen, PenSquare, FileText, Users, CalendarDays, CalendarRange,
  Globe, ChevronDown, LogOut, Settings, UserCircle,
  ShieldCheck, GraduationCap, Check,
} from "lucide-react";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useLanguage, languages, type Lang } from "@/lib/i18n";

const navItems = [
  { key: "nav.myDay",        to: "/",             icon: LayoutDashboard },
  { key: "nav.classes",      to: "/classes",      icon: BookOpen },
  { key: "nav.attendance",   to: "/attendance",   icon: ClipboardCheck },
  { key: "nav.gradebook",    to: "/gradebook",    icon: PenSquare },
  { key: "nav.assignments",  to: "/assignments",  icon: FileText },
  { key: "nav.programazioa", to: "/programazioa", icon: CalendarRange },
  { key: "nav.students",     to: "/students",     icon: Users },
  { key: "nav.timetable",    to: "/timetable",    icon: CalendarDays },
  { key: "nav.messages",     to: "/messages",     icon: MessageSquare, badge: 4 },
] as const;

type Role = "teacher" | "tutor" | "admin";

const roles = [
  {
    key: "teacher" as Role, icon: GraduationCap,
    eu: "Irakaslea",       es: "Profesor/a",       en: "Teacher",
    deu: "Aurrerago definituko da", des: "Se definirá próximamente", den: "To be defined",
  },
  {
    key: "tutor" as Role, icon: UserCircle,
    eu: "Tutorea",         es: "Tutor/a",           en: "Tutor",
    deu: "Aurrerago definituko da", des: "Se definirá próximamente", den: "To be defined",
  },
  {
    key: "admin" as Role, icon: ShieldCheck,
    eu: "Administratzailea", es: "Administrador/a", en: "Admin",
    deu: "Aurrerago definituko da", des: "Se definirá próximamente", den: "To be defined",
  },
];

function label(r: typeof roles[0], lang: Lang) {
  return lang === "eu" ? r.eu : lang === "es" ? r.es : r.en;
}
function desc(r: typeof roles[0], lang: Lang) {
  return lang === "eu" ? r.deu : lang === "es" ? r.des : r.den;
}

function ProfileDropdown() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("teacher");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const ActiveIcon = roles.find((r) => r.key === activeRole)?.icon ?? GraduationCap;
  const activeLabel = label(roles.find((r) => r.key === activeRole)!, lang);

  const L = {
    profile:   lang === "eu" ? "Profila aldatu"        : lang === "es" ? "Cambiar perfil"     : "Switch profile",
    settings:  lang === "eu" ? "Kontuaren ezarpenak"   : lang === "es" ? "Ajustes de cuenta"  : "Account settings",
    signout:   lang === "eu" ? "Saioa itxi"            : lang === "es" ? "Cerrar sesión"       : "Sign out",
  };

  return (
    <div className="relative" ref={ref}>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-secondary/70 transition-colors border border-transparent hover:border-border"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-semibold text-sm shrink-0">
          SR
        </div>
        <div className="hidden md:block leading-tight text-left">
          <p className="text-sm font-semibold leading-none">Sarah Reyes</p>
          <div className="flex items-center gap-1 mt-1">
            <ActiveIcon className="h-3 w-3 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">{activeLabel}</p>
          </div>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground hidden md:block transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* ── Panel ── */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-[calc(100%+8px)] w-72 rounded-2xl bg-card border border-border z-50 overflow-hidden"
            style={{ boxShadow: "0 16px 48px -8px rgba(0,0,0,0.22), 0 2px 8px -2px rgba(0,0,0,0.1)" }}
          >
            {/* User header */}
            <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-br from-primary/8 to-accent/8 border-b border-border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-bold text-lg shrink-0">
                SR
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-tight">Sarah Reyes</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">sarah.reyes@northgate.edu</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <ActiveIcon className="h-3 w-3 text-accent shrink-0" />
                  <span className="text-xs font-medium text-accent">{activeLabel}</span>
                </div>
              </div>
            </div>

            {/* Switch profile */}
            <div className="py-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-5 py-2">
                {L.profile}
              </p>
              {roles.map((r) => {
                const RIcon = r.icon;
                const isActive = r.key === activeRole;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setActiveRole(r.key)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      isActive ? "bg-primary/8 text-primary" : "hover:bg-secondary/60 text-foreground"
                    }`}
                  >
                    <RIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium leading-tight">{label(r, lang)}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">{desc(r, lang)}</p>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border" />

            {/* Settings */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => { setOpen(false); navigate({ to: "/settings" }); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{L.settings}</span>
              </button>
            </div>

            <div className="h-px bg-border" />

            {/* Sign out */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>{L.signout}</span>
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
      {/* ── Sidebar ── */}
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
                <item.icon className="h-4 w-4 shrink-0" />
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

      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur px-4 md:px-8 flex items-center gap-3">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold text-sm">N</div>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder={t("topbar.search")}
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="h-9 pl-8 pr-3 rounded-lg bg-secondary border border-transparent hover:border-border focus:border-ring outline-none text-sm font-medium cursor-pointer appearance-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.code.toUpperCase()} · {l.label}</option>
                ))}
              </select>
            </div>

            <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
            </button>

            <div className="w-px h-6 bg-border" />
            <ProfileDropdown />
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
