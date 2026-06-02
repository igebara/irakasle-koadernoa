import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, languages, type Lang } from "@/lib/i18n";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Northgate" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, t } = useLanguage();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.settings.title")} subtitle={t("page.settings.subtitle")} />

        <section className="rounded-xl bg-card border border-border p-6 max-w-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h2 className="font-display text-lg font-semibold mb-4">{t("settings.profile")}</h2>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display text-xl font-semibold">SR</div>
            <div>
              <p className="font-medium">Sarah Reyes</p>
              <p className="text-sm text-muted-foreground">{t("topbar.role")}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl bg-card border border-border p-6 max-w-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h2 className="font-display text-lg font-semibold mb-4">{t("settings.language")}</h2>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="h-10 px-3 rounded-lg bg-secondary border border-border focus:border-ring outline-none text-sm font-medium"
          >
            {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </section>

        <section className="rounded-xl bg-card border border-border p-6 max-w-2xl space-y-3" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h2 className="font-display text-lg font-semibold mb-2">{t("settings.notifications")}</h2>
          <Toggle label={t("settings.emailNotifs")} on={email} onChange={setEmail} />
          <Toggle label={t("settings.pushNotifs")} on={push} onChange={setPush} />
          <Toggle label={t("settings.weeklyDigest")} on={digest} onChange={setDigest} />
        </section>
      </>
    </AppShell>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!on)}
        className={`h-6 w-11 rounded-full transition-colors relative ${on ? "bg-accent" : "bg-secondary border border-border"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}