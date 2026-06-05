import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, languages, type Lang } from "@/lib/i18n";
import { useState } from "react";
import { GraduationCap, UserCircle, ShieldCheck, Bell, Globe, Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Northgate" }] }),
  component: SettingsPage,
});

type Role = "teacher" | "tutor" | "admin";

const roles: {
  key: Role;
  icon: typeof GraduationCap;
  labelEu: string; labelEs: string; labelEn: string;
  descEu: string; descEs: string; descEn: string;
}[] = [
  {
    key: "teacher",
    icon: GraduationCap,
    labelEu: "Irakaslea", labelEs: "Profesor/a", labelEn: "Teacher",
    descEu: "Aurrerago definituko da", descEs: "Se definirá próximamente", descEn: "To be defined",
  },
  {
    key: "tutor",
    icon: UserCircle,
    labelEu: "Tutorea", labelEs: "Tutor/a", labelEn: "Tutor",
    descEu: "Aurrerago definituko da", descEs: "Se definirá próximamente", descEn: "To be defined",
  },
  {
    key: "admin",
    icon: ShieldCheck,
    labelEu: "Administratzailea", labelEs: "Administrador/a", labelEn: "Admin",
    descEu: "Aurrerago definituko da", descEs: "Se definirá próximamente", descEn: "To be defined",
  },
];

function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [activeRole, setActiveRole] = useState<Role>("teacher");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [digest, setDigest] = useState(false);

  const ActiveRoleIcon = roles.find((r) => r.key === activeRole)?.icon ?? GraduationCap;

  const sectionTitle = (eu: string, es: string, en: string) =>
    lang === "eu" ? eu : lang === "es" ? es : en;

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.settings.title")}
          subtitle={t("page.settings.subtitle")}
        />

        <div className="max-w-2xl space-y-6">

          {/* Profile card */}
          <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-semibold">
                {sectionTitle("Profila", "Perfil", "Profile")}
              </h2>
            </div>
            <div className="px-6 py-5 flex items-center gap-5">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display text-xl font-bold shrink-0">
                SR
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg leading-tight">Sarah Reyes</p>
                <p className="text-sm text-muted-foreground mt-0.5">sarah.reyes@northgate.edu</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <ActiveRoleIcon className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-medium text-accent">
                    {roles.find((r) => r.key === activeRole)?.[`label${lang === "eu" ? "Eu" : lang === "es" ? "Es" : "En"}` as "labelEu"] ?? ""}
                  </span>
                </div>
              </div>
              <button className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                {sectionTitle("Editatu", "Editar", "Edit")}
              </button>
            </div>
          </section>

          {/* Role */}
          <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-semibold">
                {sectionTitle("Profil mota", "Tipo de perfil", "Profile type")}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sectionTitle(
                  "Zure rola sistema honetan. Aukerak aurrerago definituko dira.",
                  "Tu rol en el sistema. Las opciones se definirán próximamente.",
                  "Your role in the system. Options will be defined soon.",
                )}
              </p>
            </div>
            <div className="px-4 py-4 space-y-2">
              {roles.map((r) => {
                const RIcon = r.icon;
                const isActive = r.key === activeRole;
                const label = lang === "eu" ? r.labelEu : lang === "es" ? r.labelEs : r.labelEn;
                const desc = lang === "eu" ? r.descEu : lang === "es" ? r.descEs : r.descEn;
                return (
                  <button
                    key={r.key}
                    onClick={() => setActiveRole(r.key)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:bg-secondary/40 hover:border-border"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${isActive ? "bg-primary/15" : "bg-secondary"}`}>
                      <RIcon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <div className={`h-4 w-4 rounded-full border-2 shrink-0 transition-colors ${isActive ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                      {isActive && <div className="h-full w-full rounded-full scale-50 bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Language */}
          <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t("settings.language")}
              </h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex gap-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code as Lang)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${
                      lang === l.code
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:bg-secondary/40"
                    }`}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <span className={`text-xs font-medium ${lang === l.code ? "text-primary" : "text-foreground"}`}>
                      {l.code.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {t("settings.notifications")}
              </h2>
            </div>
            <div className="px-6 py-4 divide-y divide-border">
              <Toggle icon={Mail} label={t("settings.emailNotifs")} on={email} onChange={setEmail} />
              <Toggle icon={Bell} label={t("settings.pushNotifs")} on={push} onChange={setPush} />
              <Toggle icon={Bell} label={t("settings.weeklyDigest")} on={digest} onChange={setDigest} />
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl bg-card border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border bg-secondary/30">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                {sectionTitle("Segurtasuna", "Seguridad", "Security")}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:bg-secondary/40 transition-colors text-sm font-medium">
                {sectionTitle("Pasahitza aldatu", "Cambiar contraseña", "Change password")}
                <span className="text-xs text-muted-foreground">→</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border hover:bg-secondary/40 transition-colors text-sm font-medium">
                {sectionTitle("Bi faktoreko autentifikazioa", "Autenticación en dos pasos", "Two-factor authentication")}
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {sectionTitle("Gaituta", "Activado", "Enabled")}
                </span>
              </button>
            </div>
          </section>

          {/* Danger zone */}
          <section className="rounded-xl border border-destructive/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-destructive/20 bg-destructive/5">
              <h2 className="font-display text-base font-semibold text-destructive">
                {sectionTitle("Eremu arriskutsua", "Zona de peligro", "Danger zone")}
              </h2>
            </div>
            <div className="px-6 py-5">
              <button className="h-9 px-4 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
                {sectionTitle("Kontua ezabatu", "Eliminar cuenta", "Delete account")}
              </button>
            </div>
          </section>

        </div>
      </>
    </AppShell>
  );
}

function Toggle({
  icon: Icon,
  label,
  on,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-3.5 cursor-pointer gap-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${on ? "bg-primary" : "bg-secondary border border-border"}`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </button>
    </label>
  );
}
