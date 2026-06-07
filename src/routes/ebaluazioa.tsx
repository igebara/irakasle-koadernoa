import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, type Lang } from "@/lib/i18n";
import { Printer } from "lucide-react";
import { CompetencyLegend, CompetencyMeter, type CompetencyLevel } from "@/components/CompetencyMeter";
import { mathCompetencies } from "@/lib/curriculum";

export const Route = createFileRoute("/ebaluazioa")({
  head: () => ({ meta: [{ title: "Ebaluazioa — Northgate" }] }),
  component: EbaluazioaPage,
});

type EvalKey = "e1" | "e2" | "e3" | "ohikoa";

const allStudents = [
  { name: "Amara Johnson", grade: "10A" },
  { name: "Liam Okonkwo", grade: "9B" },
  { name: "Sofia Martinez", grade: "11C" },
  { name: "Noah Chen", grade: "10A" },
  { name: "Priya Shah", grade: "12A" },
  { name: "Marcus Bell", grade: "9B" },
  { name: "Elena Ruiz", grade: "11C" },
  { name: "Kenji Tanaka", grade: "12A" },
];

const NOTES_KEY = "ebaluazioa.notes.v1";
type NotesStore = Record<string, { tutor: string; parents: string }>;

function loadNotes(): NotesStore {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(NOTES_KEY) || "{}"); } catch { return {}; }
}
function saveNotes(d: NotesStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTES_KEY, JSON.stringify(d));
}

function EbaluazioaPage() {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState<EvalKey>("e1");
  const [notes, setNotes] = useState<NotesStore>(() => loadNotes());
  const [filterGrade, setFilterGrade] = useState<string>("");

  // For Ohikoa, the data is a copy of E3 (read-only summary)
  const dataKey: EvalKey = active === "ohikoa" ? "e3" : active;

  const rows = useMemo(() => {
    return allStudents
      .filter((s) => (filterGrade ? s.grade === filterGrade : true))
      .map((s, si) => {
        const summary: Record<string, CompetencyLevel> = {};
        mathCompetencies.forEach((c, ci) => {
          const seed = (si * 7 + ci * 3 + (dataKey.charCodeAt(1) || 0)) % 4;
          summary[c.id] = (seed + 1) as CompetencyLevel;
        });
        return { student: s, summary };
      });
  }, [filterGrade, dataKey]);

  const noteFor = (k: string) => notes[`${active}:${k}`] ?? { tutor: "", parents: "" };
  const setNote = (k: string, field: "tutor" | "parents", value: string) => {
    setNotes((prev) => {
      const key = `${active}:${k}`;
      const cur = prev[key] ?? { tutor: "", parents: "" };
      const next = { ...prev, [key]: { ...cur, [field]: value } };
      saveNotes(next);
      return next;
    });
  };

  const tabs: { key: EvalKey; label: string }[] = [
    { key: "e1", label: t("ebal.eval1") },
    { key: "e2", label: t("ebal.eval2") },
    { key: "e3", label: t("ebal.eval3") },
    { key: "ohikoa", label: t("ebal.ohikoa") },
  ];

  const grades = Array.from(new Set(allStudents.map((s) => s.grade)));

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.ebaluazioa.title")}
          subtitle={t("page.ebaluazioa.subtitle")}
          action={
            <button
              onClick={() => window.print()}
              className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary inline-flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> {t("ebal.print")}
            </button>
          }
        />

        {/* Tabs */}
        <div className="flex rounded-lg border border-border bg-card overflow-hidden w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                active === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "ohikoa" && (
          <p className="text-xs text-muted-foreground italic">
            {lang === "es" ? "Copia de la 3ª evaluación." : lang === "en" ? "Copy of the 3rd evaluation." : "3. ebaluazioaren kopia."}
          </p>
        )}

        {/* Filters + legend */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">
              {lang === "eu" ? "Klasea" : lang === "es" ? "Clase" : "Class"}
            </label>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="h-9 px-3 rounded-lg bg-card border border-border text-sm"
            >
              <option value="">{lang === "es" ? "Todas" : lang === "en" ? "All" : "Guztiak"}</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="ml-auto rounded-lg border border-border bg-card px-4 py-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("comp.level")}</div>
            <CompetencyLegend />
          </div>
        </div>

        {/* Aggregated competency table */}
        <section className="rounded-xl bg-card border border-border overflow-x-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-2.5">{lang === "eu" ? "Ikaslea" : lang === "es" ? "Alumno/a" : "Student"}</th>
                {mathCompetencies.map((c) => (
                  <th key={c.id} className="text-center font-medium px-3 py-2.5 align-bottom">
                    <div className="font-mono">{c.code}</div>
                    <div className="font-normal normal-case text-[10px] text-muted-foreground/80 leading-tight max-w-[110px] mx-auto mt-0.5">
                      {c.label[lang as Lang]}
                    </div>
                  </th>
                ))}
                <th className="text-left font-medium px-3 py-2.5 normal-case tracking-normal">{lang === "es" ? "Notas" : lang === "en" ? "Notes" : "Oharrak"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const n = noteFor(row.student.name);
                return (
                  <tr key={row.student.name} className="border-t border-border align-top">
                    <td className="px-5 py-3 font-medium text-xs whitespace-nowrap">
                      {row.student.name}
                      <div className="text-[10px] text-muted-foreground">{row.student.grade}</div>
                    </td>
                    {mathCompetencies.map((c) => {
                      const lv = row.summary[c.id];
                      return (
                        <td key={c.id} className="px-3 py-3 text-center">
                          {lv ? <div className="flex justify-center"><CompetencyMeter level={lv} /></div> : <span className="text-muted-foreground/40">—</span>}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 min-w-[260px] space-y-1.5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("ebal.tutorNote")}</label>
                        <textarea
                          value={n.tutor}
                          onChange={(e) => setNote(row.student.name, "tutor", e.target.value)}
                          rows={2}
                          disabled={active === "ohikoa"}
                          className="w-full text-xs px-2 py-1 rounded bg-secondary/40 border border-transparent focus:bg-background focus:border-ring outline-none disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("ebal.parentsNote")}</label>
                        <textarea
                          value={n.parents}
                          onChange={(e) => setNote(row.student.name, "parents", e.target.value)}
                          rows={2}
                          disabled={active === "ohikoa"}
                          className="w-full text-xs px-2 py-1 rounded bg-secondary/40 border border-transparent focus:bg-background focus:border-ring outline-none disabled:opacity-60"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </>
    </AppShell>
  );
}
