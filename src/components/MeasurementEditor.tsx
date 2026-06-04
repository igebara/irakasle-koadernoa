import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { mathCompetencies } from "@/lib/curriculum";
import type { CompetencyLevel } from "./CompetencyMeter";
import { levelMeta } from "./CompetencyMeter";

export type Measurements = Record<string, number>; // indicatorId -> 1..4 (0/absent = not measured)

export function MeasurementEditor({
  open,
  onClose,
  activityTitle,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  activityTitle: string;
  initial: Measurements;
  onSave: (m: Measurements) => void;
}) {
  const { t, lang } = useLanguage();
  const [draft, setDraft] = useState<Measurements>(initial);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  if (!open) return null;

  const setLevel = (id: string, lv: number) => {
    setDraft((d) => {
      const next = { ...d };
      if (lv === 0) delete next[id];
      else next[id] = lv;
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col" style={{ boxShadow: "var(--shadow-elegant, 0 20px 60px -20px rgba(0,0,0,0.4))" }}>
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{t("assign.measure.title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{activityTitle}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {mathCompetencies.map((c) => {
            const measuredCount = c.indicators.filter((i) => draft[i.id]).length;
            const active = measuredCount > 0;
            return (
              <section
                key={c.id}
                className={`rounded-xl border p-4 transition-colors ${active ? "border-primary/40 bg-primary/[0.03]" : "border-border bg-card"}`}
              >
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/70">{c.code}</span>
                      <h3 className="font-medium text-sm">{c.label[lang]}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.description[lang]}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {measuredCount}/{c.indicators.length} {t("comp.indicators")}
                  </span>
                </header>

                <div className="space-y-2.5">
                  {c.indicators.map((ind) => {
                    const lv = draft[ind.id] ?? 0;
                    return (
                      <div key={ind.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-1.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{ind.code}</span>
                        <p className="text-xs leading-snug">{ind.label[lang]}</p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setLevel(ind.id, 0)}
                            className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                              lv === 0 ? "bg-secondary border-border text-foreground" : "border-transparent text-muted-foreground hover:bg-secondary/50"
                            }`}
                            aria-label="not measured"
                          >
                            —
                          </button>
                          {([1, 2, 3, 4] as CompetencyLevel[]).map((opt) => {
                            const meta = levelMeta[opt];
                            const selected = lv === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => setLevel(ind.id, opt)}
                                className="text-[10px] px-2 py-1 rounded-md border transition-all whitespace-nowrap"
                                style={
                                  selected
                                    ? { color: meta.color, background: meta.bg, borderColor: "transparent", boxShadow: `inset 0 0 0 1px ${meta.ring}` }
                                    : { background: "transparent", borderColor: "color-mix(in oklab, var(--border) 100%, transparent)", color: "var(--muted-foreground)" }
                                }
                                title={t(`comp.level.${opt}`)}
                              >
                                {t(`comp.level.${opt}`)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-3 bg-secondary/30">
          <p className="text-[11px] text-muted-foreground">
            {Object.keys(draft).length} {t("comp.indicators")}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={() => {
                onSave(draft);
                onClose();
              }}
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" /> {t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}