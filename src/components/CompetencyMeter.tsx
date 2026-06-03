import { useLanguage } from "@/lib/i18n";

export type CompetencyLevel = 1 | 2 | 3 | 4;

export const levelMeta: Record<CompetencyLevel, { color: string; bg: string; ring: string }> = {
  1: { color: "var(--destructive)", bg: "color-mix(in oklab, var(--destructive) 14%, transparent)", ring: "color-mix(in oklab, var(--destructive) 30%, transparent)" },
  2: { color: "var(--warning, oklch(0.78 0.15 75))", bg: "color-mix(in oklab, var(--warning, oklch(0.78 0.15 75)) 14%, transparent)", ring: "color-mix(in oklab, var(--warning, oklch(0.78 0.15 75)) 30%, transparent)" },
  3: { color: "var(--primary)", bg: "color-mix(in oklab, var(--primary) 14%, transparent)", ring: "color-mix(in oklab, var(--primary) 30%, transparent)" },
  4: { color: "var(--success, oklch(0.72 0.17 155))", bg: "color-mix(in oklab, var(--success, oklch(0.72 0.17 155)) 16%, transparent)", ring: "color-mix(in oklab, var(--success, oklch(0.72 0.17 155)) 35%, transparent)" },
};

export function gradeToLevel(grade: number): CompetencyLevel {
  if (grade >= 90) return 4;
  if (grade >= 75) return 3;
  if (grade >= 60) return 2;
  return 1;
}

export function CompetencyMeter({
  level,
  showLabel = false,
  size = "md",
}: {
  level: CompetencyLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const { t } = useLanguage();
  const meta = levelMeta[level];
  const segH = size === "sm" ? 4 : 6;
  const segW = size === "sm" ? 8 : 14;
  return (
    <div className="inline-flex items-center gap-2">
      <div className="flex items-end gap-[3px]" aria-label={t(`comp.level.${level}`)}>
        {[1, 2, 3, 4].map((i) => {
          const filled = i <= level;
          const h = segH + (i - 1) * (size === "sm" ? 2 : 3);
          return (
            <span
              key={i}
              style={{
                width: segW,
                height: h,
                background: filled ? meta.color : "color-mix(in oklab, var(--muted-foreground) 18%, transparent)",
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>
      {showLabel && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: meta.color, background: meta.bg, boxShadow: `inset 0 0 0 1px ${meta.ring}` }}
        >
          {t(`comp.level.${level}`)}
        </span>
      )}
    </div>
  );
}

export function CompetencyLegend() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-3">
      {([1, 2, 3, 4] as CompetencyLevel[]).map((lv) => (
        <div key={lv} className="inline-flex items-center gap-2">
          <CompetencyMeter level={lv} size="sm" />
          <span className="text-xs text-muted-foreground">{t(`comp.level.${lv}`)}</span>
        </div>
      ))}
    </div>
  );
}

// Sample competencies used across the app
export const competencyCatalog: Record<"eu" | "es" | "en", string[]> = {
  eu: [
    "Matematikarako konpetentzia",
    "Hizkuntza-komunikaziorako konpetentzia",
    "Konpetentzia digitala",
    "Ikasten ikastekoa",
    "Ekimena eta ekintzailetza",
  ],
  es: [
    "Competencia matemática",
    "Competencia en comunicación lingüística",
    "Competencia digital",
    "Aprender a aprender",
    "Iniciativa y emprendimiento",
  ],
  en: [
    "Mathematical competency",
    "Linguistic communication",
    "Digital competency",
    "Learning to learn",
    "Initiative & entrepreneurship",
  ],
};