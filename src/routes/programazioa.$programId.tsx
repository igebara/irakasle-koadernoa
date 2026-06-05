import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2, FileText, Link as LinkIcon } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, type Lang } from "@/lib/i18n";
import { mathCompetencies } from "@/lib/curriculum";
import {
  useProgramazioak,
  type Programazioa,
  type Bilingual,
  type IkasEgoera,
  type AtazaKonpetentziala,
  type FileLink,
} from "@/lib/programazioa";

export const Route = createFileRoute("/programazioa/$programId")({
  head: () => ({ meta: [{ title: "Programazioa editatu — Northgate" }] }),
  component: ProgramazioaEditPage,
});

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function ProgramazioaEditPage() {
  const { programId } = Route.useParams();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { list, update } = useProgramazioak();
  const program = list.find((p) => p.id === programId);

  if (!program) {
    return (
      <AppShell>
        <div className="text-center py-20 text-muted-foreground">
          <p>—</p>
          <button onClick={() => navigate({ to: "/programazioa" })} className="mt-4 text-sm text-primary underline">
            ← {t("page.programazioa.title")}
          </button>
        </div>
      </AppShell>
    );
  }

  const patch = (p: Partial<Programazioa>) => update(program.id, p);

  // ─── Ikas-egoera helpers ───
  const addIkasEgoera = () => {
    const ie: IkasEgoera = {
      id: uid("ie"),
      title: { eu: `${program.ikasEgoerak.length + 1}. Ikas-egoera`, es: `Situación ${program.ikasEgoerak.length + 1}` },
      atazak: [],
    };
    patch({ ikasEgoerak: [...program.ikasEgoerak, ie] });
  };
  const updateIE = (ieId: string, updater: (ie: IkasEgoera) => IkasEgoera) =>
    patch({ ikasEgoerak: program.ikasEgoerak.map((ie) => (ie.id === ieId ? updater(ie) : ie)) });
  const removeIE = (ieId: string) =>
    patch({ ikasEgoerak: program.ikasEgoerak.filter((ie) => ie.id !== ieId) });

  // ─── Files ───
  const addFile = () =>
    patch({ fitxategiak: [...program.fitxategiak, { id: uid("f"), kind: "link", label: "", url: "" }] });
  const updateFile = (fid: string, p: Partial<FileLink>) =>
    patch({ fitxategiak: program.fitxategiak.map((f) => (f.id === fid ? { ...f, ...p } : f)) });
  const removeFile = (fid: string) =>
    patch({ fitxategiak: program.fitxategiak.filter((f) => f.id !== fid) });

  return (
    <AppShell>
      <>
        <button
          onClick={() => navigate({ to: "/programazioa" })}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> {t("page.programazioa.title")}
        </button>

        <PageHeader
          title={program.name}
          subtitle={t("page.programazioa.subtitle")}
        />

        <input
          value={program.name}
          onChange={(e) => patch({ name: e.target.value })}
          className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:border-ring"
          placeholder={lang === "es" ? "Nombre de la programación" : lang === "en" ? "Program name" : "Programazioaren izena"}
        />

        {/* Graphic summary */}
        <ProgramSummary program={program} lang={lang} t={t} />

        {/* Sections */}
        <Section title={t("prog.sections.details")}>
          <BilingualTextarea value={program.xehetasunak} onChange={(v) => patch({ xehetasunak: v })} />
        </Section>

        <Section title={t("prog.sections.justification")}>
          <BilingualTextarea value={program.justifikazioa} onChange={(v) => patch({ justifikazioa: v })} />
        </Section>

        <Section
          title={t("prog.sections.situations")}
          action={
            <button onClick={addIkasEgoera} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> {lang === "es" ? "Añadir" : lang === "en" ? "Add" : "Gehitu"}
            </button>
          }
        >
          <div className="space-y-4">
            {program.ikasEgoerak.map((ie, idx) => (
              <IkasEgoeraCard
                key={ie.id}
                index={idx + 1}
                ikasEgoera={ie}
                lang={lang}
                onUpdate={(updater) => updateIE(ie.id, updater)}
                onRemove={() => removeIE(ie.id)}
              />
            ))}
            {program.ikasEgoerak.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-6 border border-dashed border-border rounded-lg">
                {lang === "es" ? "Sin situaciones de aprendizaje" : lang === "en" ? "No learning situations" : "Ez dago ikas-egoerarik"}
              </p>
            )}
          </div>
        </Section>

        <Section title={t("prog.sections.methodology")}>
          <BilingualTextarea value={program.metodologia} onChange={(v) => patch({ metodologia: v })} />
        </Section>

        <Section title={t("prog.sections.evaluation")}>
          <BilingualTextarea value={program.ebaluazioErabakiak} onChange={(v) => patch({ ebaluazioErabakiak: v })} />
        </Section>

        <Section
          title={t("prog.sections.files")}
          action={
            <button onClick={addFile} className="h-8 px-3 rounded-md border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-secondary">
              <Plus className="h-3.5 w-3.5" /> {lang === "es" ? "Añadir" : lang === "en" ? "Add" : "Gehitu"}
            </button>
          }
        >
          <div className="space-y-2">
            {program.fitxategiak.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-2 p-2 border border-border rounded-md">
                <select
                  value={f.kind}
                  onChange={(e) => updateFile(f.id, { kind: e.target.value as "file" | "link" })}
                  className="text-xs h-9 px-2 rounded-md bg-secondary border-none outline-none"
                >
                  <option value="link">🔗 Link</option>
                  <option value="file">📄 File</option>
                </select>
                <input
                  value={f.label}
                  onChange={(e) => updateFile(f.id, { label: e.target.value })}
                  placeholder={lang === "es" ? "Etiqueta" : lang === "en" ? "Label" : "Etiketa"}
                  className="flex-1 min-w-[120px] h-9 px-3 rounded-md bg-secondary border-none text-sm outline-none focus:bg-background focus:ring-1 focus:ring-ring"
                />
                <input
                  value={f.url}
                  onChange={(e) => updateFile(f.id, { url: e.target.value })}
                  placeholder="https://… / file.pdf"
                  className="flex-1 min-w-[180px] h-9 px-3 rounded-md bg-secondary border-none text-sm outline-none focus:bg-background focus:ring-1 focus:ring-ring"
                />
                <button onClick={() => removeFile(f.id)} className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {program.fitxategiak.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-6 border border-dashed border-border rounded-lg">—</p>
            )}
          </div>
        </Section>
      </>
    </AppShell>
  );
}

// ─────────────── Reusable bits ───────────────

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-border p-5 space-y-3" style={{ boxShadow: "var(--shadow-soft)" }}>
      <header className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function BilingualTextarea({ value, onChange }: { value: Bilingual; onChange: (v: Bilingual) => void }) {
  const [tab, setTab] = useState<"eu" | "es">("eu");
  return (
    <div>
      <div className="inline-flex p-0.5 rounded-md bg-secondary mb-2">
        {(["eu", "es"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 h-7 text-xs font-medium rounded ${tab === k ? "bg-card shadow" : "text-muted-foreground"}`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
      <textarea
        value={value[tab]}
        onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
        rows={4}
        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-ring resize-y"
      />
    </div>
  );
}

function BilingualInput({ value, onChange, placeholder }: { value: Bilingual; onChange: (v: Bilingual) => void; placeholder?: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["eu", "es"] as const).map((k) => (
        <div key={k} className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground">{k.toUpperCase()}</span>
          <input
            value={value[k]}
            onChange={(e) => onChange({ ...value, [k]: e.target.value })}
            placeholder={placeholder}
            className="w-full h-9 pl-9 pr-2 bg-secondary border border-transparent rounded-md text-sm outline-none focus:bg-background focus:border-ring"
          />
        </div>
      ))}
    </div>
  );
}

function IkasEgoeraCard({
  ikasEgoera: ie,
  index,
  lang,
  onUpdate,
  onRemove,
}: {
  ikasEgoera: IkasEgoera;
  index: number;
  lang: Lang;
  onUpdate: (updater: (ie: IkasEgoera) => IkasEgoera) => void;
  onRemove: () => void;
}) {
  const addAtaza = () => {
    const at: AtazaKonpetentziala = {
      id: uid("at"),
      title: { eu: `Ataza ${ie.atazak.length + 1}`, es: `Tarea ${ie.atazak.length + 1}` },
      competencies: [],
      jakintzak: [],
    };
    onUpdate((cur) => ({ ...cur, atazak: [...cur.atazak, at] }));
  };
  const updateAtaza = (atId: string, p: Partial<AtazaKonpetentziala>) =>
    onUpdate((cur) => ({ ...cur, atazak: cur.atazak.map((a) => (a.id === atId ? { ...a, ...p } : a)) }));
  const removeAtaza = (atId: string) =>
    onUpdate((cur) => ({ ...cur, atazak: cur.atazak.filter((a) => a.id !== atId) }));

  return (
    <div className="rounded-lg border border-border bg-background/60 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0 mt-2">IE {index}</span>
        <div className="flex-1">
          <BilingualInput value={ie.title} onChange={(v) => onUpdate((cur) => ({ ...cur, title: v }))} placeholder={lang === "es" ? "Título de la situación" : "Ikas-egoeraren izenburua"} />
        </div>
        <button onClick={onRemove} className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 pl-4 border-l-2 border-primary/15">
        {ie.atazak.map((at) => (
          <AtazaCard key={at.id} ataza={at} lang={lang} onChange={(p) => updateAtaza(at.id, p)} onRemove={() => removeAtaza(at.id)} />
        ))}
        <button onClick={addAtaza} className="h-8 px-3 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary inline-flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {lang === "es" ? "Añadir tarea competencial" : lang === "en" ? "Add competential task" : "Ataza konpetentziala gehitu"}
        </button>
      </div>
    </div>
  );
}

function AtazaCard({
  ataza,
  lang,
  onChange,
  onRemove,
}: {
  ataza: AtazaKonpetentziala;
  lang: Lang;
  onChange: (p: Partial<AtazaKonpetentziala>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleComp = (compId: string) => {
    const exists = ataza.competencies.find((c) => c.compId === compId);
    if (exists) {
      onChange({ competencies: ataza.competencies.filter((c) => c.compId !== compId) });
    } else {
      onChange({ competencies: [...ataza.competencies, { compId, indicatorIds: [] }] });
    }
  };
  const toggleInd = (compId: string, indId: string) => {
    onChange({
      competencies: ataza.competencies.map((c) => {
        if (c.compId !== compId) return c;
        const has = c.indicatorIds.includes(indId);
        return { ...c, indicatorIds: has ? c.indicatorIds.filter((i) => i !== indId) : [...c.indicatorIds, indId] };
      }),
    });
  };
  const toggleJ = (jid: string) => {
    onChange({ jakintzak: ataza.jakintzak.includes(jid) ? ataza.jakintzak.filter((x) => x !== jid) : [...ataza.jakintzak, jid] });
  };

  const compCount = ataza.competencies.length;
  const indCount = ataza.competencies.reduce((a, c) => a + c.indicatorIds.length, 0);

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <BilingualInput value={ataza.title} onChange={(v) => onChange({ title: v })} />
        </div>
        <button onClick={onRemove} className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-[11px] text-primary font-medium hover:underline"
      >
        {expanded ? "▾" : "▸"} {compCount} {lang === "eu" ? "konpetentzia" : lang === "es" ? "competencias" : "competencies"} · {indCount} {lang === "eu" ? "adierazle" : lang === "es" ? "indicadores" : "indicators"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {mathCompetencies.map((c) => {
            const sel = ataza.competencies.find((x) => x.compId === c.id);
            const on = !!sel;
            return (
              <div key={c.id} className={`rounded border p-2.5 ${on ? "border-primary/40 bg-primary/[0.04]" : "border-border"}`}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={on} onChange={() => toggleComp(c.id)} className="mt-0.5 accent-[color:var(--primary)]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary">{c.code}</span>
                      <span className="text-xs font-medium">{c.label[lang]}</span>
                    </div>
                  </div>
                </label>
                {on && (
                  <div className="mt-2 pl-6 grid sm:grid-cols-2 gap-1">
                    {c.indicators.map((ind) => (
                      <label key={ind.id} className="flex items-start gap-1.5 text-[11px] cursor-pointer">
                        <input type="checkbox" checked={sel.indicatorIds.includes(ind.id)} onChange={() => toggleInd(c.id, ind.id)} className="mt-0.5 accent-[color:var(--primary)]" />
                        <span><span className="font-mono text-muted-foreground mr-1">{ind.code}</span>{ind.label[lang]}</span>
                      </label>
                    ))}
                    {c.oinarrizkoJakintzak && c.oinarrizkoJakintzak.length > 0 && (
                      <div className="sm:col-span-2 mt-2 pt-2 border-t border-border">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{lang === "es" ? "Saberes básicos" : lang === "en" ? "Basic knowledge" : "Oinarrizko jakintzak"}</p>
                        <div className="grid sm:grid-cols-2 gap-1">
                          {c.oinarrizkoJakintzak.map((j) => (
                            <label key={j.id} className="flex items-start gap-1.5 text-[11px] cursor-pointer">
                              <input type="checkbox" checked={ataza.jakintzak.includes(j.id)} onChange={() => toggleJ(j.id)} className="mt-0.5 accent-[color:var(--primary)]" />
                              <span><span className="font-mono text-muted-foreground mr-1">{j.code}</span>{j.label[lang]}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgramSummary({ program, lang, t }: { program: Programazioa; lang: Lang; t: (k: string) => string }) {
  // Aggregate per-competency: count indicators selected across all tasks
  const stats = useMemo(() => {
    const compMap = new Map<string, { selectedInd: Set<string>; totalInd: number; jakintzak: Set<string> }>();
    for (const c of mathCompetencies) {
      compMap.set(c.id, { selectedInd: new Set(), totalInd: c.indicators.length, jakintzak: new Set() });
    }
    let atazaCount = 0;
    for (const ie of program.ikasEgoerak) {
      for (const at of ie.atazak) {
        atazaCount++;
        for (const cc of at.competencies) {
          const e = compMap.get(cc.compId);
          if (!e) continue;
          cc.indicatorIds.forEach((i) => e.selectedInd.add(i));
        }
        at.jakintzak.forEach((j) => {
          for (const e of compMap.values()) e.jakintzak.add(j);
        });
      }
    }
    return { compMap, atazaCount };
  }, [program]);

  return (
    <div className="rounded-xl border border-border p-5 sticky top-0 z-10" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 6%, var(--card)), var(--card))", boxShadow: "var(--shadow-soft)" }}>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-base font-semibold">{t("prog.summary.title")}</h2>
        <span className="text-xs text-muted-foreground">
          {program.ikasEgoerak.length} IE · {stats.atazaCount} {lang === "eu" ? "ataza" : lang === "es" ? "tareas" : "tasks"}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mathCompetencies.map((c) => {
          const e = stats.compMap.get(c.id)!;
          const pct = e.totalInd ? (e.selectedInd.size / e.totalInd) * 100 : 0;
          const on = e.selectedInd.size > 0;
          return (
            <div key={c.id} className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-secondary">{c.code}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{e.selectedInd.size}/{e.totalInd}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: on ? "var(--primary)" : "transparent" }} />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight truncate" title={c.label[lang]}>{c.label[lang]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}