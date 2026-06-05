import { useEffect, useState, useCallback } from "react";
import { mathCompetencies } from "./curriculum";

export type Bilingual = { eu: string; es: string };

export type FileLink = {
  id: string;
  kind: "file" | "link";
  label: string;
  url: string;
};

export type AtazaKonpetentziala = {
  id: string;
  title: Bilingual;
  competencies: { compId: string; indicatorIds: string[] }[];
  jakintzak: string[]; // ids referencing competency.oinarrizkoJakintzak
};

export type IkasEgoera = {
  id: string;
  title: Bilingual;
  atazak: AtazaKonpetentziala[];
};

export type Programazioa = {
  id: string;
  subjectKey: string;
  name: string;
  xehetasunak: Bilingual;
  justifikazioa: Bilingual;
  metodologia: Bilingual;
  ebaluazioErabakiak: Bilingual;
  ikasEgoerak: IkasEgoera[];
  fitxategiak: FileLink[];
  assignedGroupIds: string[];
  assignedStudentIds: string[];
  createdAt: number;
};

export const emptyBilingual = (): Bilingual => ({ eu: "", es: "" });

// ─────────────── Mock groups & students ───────────────
export const groupsCatalog = [
  { id: "10A", label: "10A maila" },
  { id: "9B", label: "9B maila" },
  { id: "11C", label: "11C maila" },
  { id: "12A", label: "12A maila" },
  { id: "club", label: "Matematika Kluba" },
];

export const studentsCatalog = [
  { id: "s1", name: "Amara Johnson", groupId: "10A" },
  { id: "s2", name: "Liam Okonkwo", groupId: "9B" },
  { id: "s3", name: "Sofia Martinez", groupId: "11C" },
  { id: "s4", name: "Noah Chen", groupId: "10A" },
  { id: "s5", name: "Priya Shah", groupId: "12A" },
  { id: "s6", name: "Marcus Bell", groupId: "9B" },
  { id: "s7", name: "Elena Ruiz", groupId: "11C" },
  { id: "s8", name: "Kenji Tanaka", groupId: "12A" },
];

// ─────────────── Storage ───────────────
const STORAGE_KEY = "programazioak.v2";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function seedProgram(subjectKey: string, name: string): Programazioa {
  const km1 = mathCompetencies.find((c) => c.id === "km1")!;
  const km4 = mathCompetencies.find((c) => c.id === "km4")!;
  return {
    id: uid("prg"),
    subjectKey,
    name,
    xehetasunak: { eu: "Programazio honek ikasturteko helburu nagusiak biltzen ditu.", es: "Esta programación recoge los objetivos principales del curso." },
    justifikazioa: { eu: "Heziberri curriculumean oinarrituta.", es: "Basada en el currículo Heziberri." },
    metodologia: { eu: "Ikaskuntza aktiboa eta proiektuetan oinarritua.", es: "Aprendizaje activo y basado en proyectos." },
    ebaluazioErabakiak: { eu: "Ebaluazio jarraitua ebaluazio adierazleen bidez.", es: "Evaluación continua mediante indicadores de evaluación." },
    ikasEgoerak: [
      {
        id: uid("ie"),
        title: { eu: "1. Ikas-egoera — Hasierako diagnostikoa", es: "1ª Situación — Diagnóstico inicial" },
        atazak: [
          {
            id: uid("at"),
            title: { eu: "Hasierako ataza konpetentziala", es: "Tarea competencial inicial" },
            competencies: [
              { compId: km1.id, indicatorIds: km1.indicators.slice(0, 2).map((i) => i.id) },
              { compId: km4.id, indicatorIds: [km4.indicators[0].id] },
            ],
            jakintzak: [km1.oinarrizkoJakintzak?.[0].id ?? ""].filter(Boolean),
          },
        ],
      },
    ],
    fitxategiak: [],
    assignedGroupIds: [],
    assignedStudentIds: [],
    createdAt: Date.now(),
  };
}

function defaultPrograms(): Programazioa[] {
  return [
    seedProgram("algebra", "Aljebra II — Oinarrizkoa"),
    seedProgram("geometry", "Geometria — DBH 4"),
    seedProgram("calculus", "Kalkulua — Batxilergoa"),
  ];
}

function loadAll(): Programazioa[] {
  if (typeof window === "undefined") return defaultPrograms();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = defaultPrograms();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return defaultPrograms();
  }
}

function saveAll(list: Programazioa[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("programazioak:changed"));
}

export function useProgramazioak() {
  const [list, setList] = useState<Programazioa[]>(() => []);

  useEffect(() => {
    setList(loadAll());
    const h = () => setList(loadAll());
    window.addEventListener("programazioak:changed", h);
    return () => window.removeEventListener("programazioak:changed", h);
  }, []);

  const create = useCallback((subjectKey: string, name?: string) => {
    const p = seedProgram(subjectKey, name || "Programazio berria");
    p.ikasEgoerak = [];
    p.xehetasunak = emptyBilingual();
    p.justifikazioa = emptyBilingual();
    p.metodologia = emptyBilingual();
    p.ebaluazioErabakiak = emptyBilingual();
    setList((prev) => {
      const next = [...prev, p];
      saveAll(next);
      return next;
    });
    return p.id;
  }, []);

  const update = useCallback((id: string, patch: Partial<Programazioa>) => {
    setList((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      saveAll(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveAll(next);
      return next;
    });
  }, []);

  const duplicate = useCallback((id: string) => {
    setList((prev) => {
      const src = prev.find((p) => p.id === id);
      if (!src) return prev;
      const copy: Programazioa = JSON.parse(JSON.stringify(src));
      copy.id = uid("prg");
      copy.name = `${src.name} (kopia)`;
      copy.assignedGroupIds = [];
      copy.assignedStudentIds = [];
      copy.createdAt = Date.now();
      const next = [...prev, copy];
      saveAll(next);
      return next;
    });
  }, []);

  // Assign with exclusivity: a student can only have ONE program per subject
  const assign = useCallback((id: string, groupIds: string[], studentIds: string[]) => {
    setList((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const next = prev.map((p) => {
        if (p.id === id) {
          return { ...p, assignedGroupIds: groupIds, assignedStudentIds: studentIds };
        }
        // Same subject: remove these students from other programs (exclusivity)
        if (p.subjectKey === target.subjectKey) {
          return {
            ...p,
            assignedStudentIds: p.assignedStudentIds.filter((s) => !studentIds.includes(s)),
          };
        }
        return p;
      });
      saveAll(next);
      return next;
    });
  }, []);

  return { list, create, update, remove, duplicate, assign };
}

export function downloadProgram(p: Programazioa) {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.name.replace(/[^a-z0-9-_]+/gi, "_")}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─────────────── Measurements (kept from v1) ───────────────
export type ActivityMeasurements = Record<string, number>;
const MEAS_KEY = "measurements.v1";

function loadMeasurements(): Record<string, ActivityMeasurements> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(MEAS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveMeasurements(d: Record<string, ActivityMeasurements>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MEAS_KEY, JSON.stringify(d));
  window.dispatchEvent(new CustomEvent("measurements:changed"));
}

export function useMeasurements() {
  const [data, setData] = useState<Record<string, ActivityMeasurements>>(() => ({}));
  useEffect(() => {
    setData(loadMeasurements());
    const h = () => setData(loadMeasurements());
    window.addEventListener("measurements:changed", h);
    return () => window.removeEventListener("measurements:changed", h);
  }, []);
  const setForActivity = useCallback((activityId: string, measurements: ActivityMeasurements) => {
    setData((prev) => {
      const next = { ...prev, [activityId]: measurements };
      saveMeasurements(next);
      return next;
    });
  }, []);
  return { data, setForActivity };
}