import { useEffect, useState, useCallback } from "react";
import { mathCompetencies } from "./curriculum";

export type UnitCompetency = { compId: string; indicatorIds: string[] };
export type Unit = {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  competencies: UnitCompetency[];
};

export type SubjectProgram = {
  subjectKey: string;
  units: Unit[];
};

const STORAGE_KEY = "programazioa.v1";

function defaultProgram(): Record<string, SubjectProgram> {
  // Seed each subject with a couple of units using a reasonable competency mix
  const allIndicators = (compId: string) =>
    mathCompetencies.find((c) => c.id === compId)?.indicators.map((i) => i.id) ?? [];
  const mk = (subjectKey: string, units: { title: string; comps: string[] }[]): SubjectProgram => ({
    subjectKey,
    units: units.map((u, i) => ({
      id: `${subjectKey}-u${i + 1}`,
      title: u.title,
      competencies: u.comps.map((c) => ({ compId: c, indicatorIds: allIndicators(c) })),
    })),
  });
  return {
    algebra: mk("algebra", [
      { title: "1. UD — Polinomioak eta ekuazioak", comps: ["km1", "km2", "km4"] },
      { title: "2. UD — Funtzio aljebraikoak", comps: ["km1", "km3", "km4", "km5"] },
    ]),
    geometry: mk("geometry", [
      { title: "1. UD — Triangeluen frogapenak", comps: ["km2", "km4", "km6"] },
      { title: "2. UD — Trigonometria aplikatua", comps: ["km1", "km3", "km5"] },
    ]),
    calculus: mk("calculus", [
      { title: "1. UD — Limiteak eta jarraitutasuna", comps: ["km1", "km2", "km4"] },
      { title: "2. UD — Deribatuak", comps: ["km1", "km3", "km5"] },
    ]),
    statistics: mk("statistics", [
      { title: "1. UD — Datuen deskribapena", comps: ["km3", "km4", "km5"] },
      { title: "2. UD — Probabilitatea", comps: ["km1", "km2", "km4"] },
    ]),
    mathclub: mk("mathclub", [
      { title: "1. UD — Erronka olinpikoak", comps: ["km1", "km2", "km6"] },
    ]),
  };
}

function loadAll(): Record<string, SubjectProgram> {
  if (typeof window === "undefined") return defaultProgram();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgram();
    return JSON.parse(raw);
  } catch {
    return defaultProgram();
  }
}

function saveAll(data: Record<string, SubjectProgram>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("programazioa:changed"));
}

export function useProgramazioa() {
  const [data, setData] = useState<Record<string, SubjectProgram>>(() => defaultProgram());

  useEffect(() => {
    setData(loadAll());
    const handler = () => setData(loadAll());
    window.addEventListener("programazioa:changed", handler);
    return () => window.removeEventListener("programazioa:changed", handler);
  }, []);

  const updateSubject = useCallback((subjectKey: string, units: Unit[]) => {
    setData((prev) => {
      const next = { ...prev, [subjectKey]: { subjectKey, units } };
      saveAll(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const d = defaultProgram();
    saveAll(d);
    setData(d);
  }, []);

  return { data, updateSubject, reset };
}

// Measurement store: per assignment id, per indicator id -> level 1..4
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