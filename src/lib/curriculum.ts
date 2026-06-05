import type { Lang } from "./i18n";

export type Localized = Record<Lang, string>;

export type Indicator = {
  id: string;
  code: string;
  label: Localized;
};

export type Competency = {
  id: string;
  code: string;
  label: Localized;
  description: Localized;
  indicators: Indicator[];
  oinarrizkoJakintzak?: Indicator[];
};

const J = (id: string, code: string, eu: string, es: string, en: string): Indicator => ({
  id, code, label: { eu, es, en },
});

// Representative slice of the official Basque curriculum (matematika)
// Source: Heziberri / 236/2015 Dekretua eta DBH-ko curriculum eguneratua.
export const mathCompetencies: Competency[] = [
  {
    id: "km1",
    code: "KM1",
    label: {
      eu: "Problemak ebaztea",
      es: "Resolución de problemas",
      en: "Problem solving",
    },
    description: {
      eu: "Problemak interpretatu, planifikatu, ebatzi eta emaitza balioetsi.",
      es: "Interpretar, planificar, resolver y validar problemas.",
      en: "Interpret, plan, solve and validate problems.",
    },
    indicators: [
      { id: "km1.ae1", code: "AE1.1", label: { eu: "Problemaren datuak eta galdera identifikatu", es: "Identifica datos y pregunta del problema", en: "Identifies data and question" } },
      { id: "km1.ae2", code: "AE1.2", label: { eu: "Estrategia egokia hautatu eta aplikatu", es: "Elige y aplica una estrategia adecuada", en: "Chooses and applies a suitable strategy" } },
      { id: "km1.ae3", code: "AE1.3", label: { eu: "Emaitza testuinguruan baloratu", es: "Valida el resultado en su contexto", en: "Validates the result in context" } },
    ],
    oinarrizkoJakintzak: [
      J("km1.j1", "OJ1.1", "Zenbaki errealak eta eragiketak", "Números reales y operaciones", "Real numbers and operations"),
      J("km1.j2", "OJ1.2", "Ekuazio eta inekuazio sinpleak", "Ecuaciones e inecuaciones simples", "Simple equations and inequalities"),
      J("km1.j3", "OJ1.3", "Heuristikoak eta problema-eredu motak", "Heurísticas y tipos de problemas", "Heuristics and problem types"),
    ],
  },
  {
    id: "km2",
    code: "KM2",
    label: {
      eu: "Arrazoiketa eta froga",
      es: "Razonamiento y prueba",
      en: "Reasoning & proof",
    },
    description: {
      eu: "Konjeturak egin, justifikatu eta frogatu.",
      es: "Formular conjeturas, justificar y demostrar.",
      en: "Make conjectures, justify and prove.",
    },
    indicators: [
      { id: "km2.ae1", code: "AE2.1", label: { eu: "Patroiak identifikatu eta konjeturak proposatu", es: "Identifica patrones y propone conjeturas", en: "Identifies patterns and proposes conjectures" } },
      { id: "km2.ae2", code: "AE2.2", label: { eu: "Argudiaketa logikoa erabili", es: "Usa argumentación lógica", en: "Uses logical argumentation" } },
    ],
    oinarrizkoJakintzak: [
      J("km2.j1", "OJ2.1", "Logika eta dedukzioa", "Lógica y deducción", "Logic and deduction"),
      J("km2.j2", "OJ2.2", "Indukzio matematikoa", "Inducción matemática", "Mathematical induction"),
    ],
  },
  {
    id: "km3",
    code: "KM3",
    label: { eu: "Konexioak", es: "Conexiones", en: "Connections" },
    description: {
      eu: "Matematika beste arlo eta egoerekin lotu.",
      es: "Conectar las matemáticas con otras áreas y situaciones.",
      en: "Connect mathematics with other areas and situations.",
    },
    indicators: [
      { id: "km3.ae1", code: "AE3.1", label: { eu: "Eguneroko bizitzako egoerekin lotu", es: "Relaciona con situaciones cotidianas", en: "Relates to everyday situations" } },
      { id: "km3.ae2", code: "AE3.2", label: { eu: "Beste diziplinekiko loturak ezarri", es: "Establece vínculos con otras disciplinas", en: "Links with other disciplines" } },
    ],
    oinarrizkoJakintzak: [
      J("km3.j1", "OJ3.1", "Modelizazio matematikoa", "Modelización matemática", "Mathematical modelling"),
      J("km3.j2", "OJ3.2", "STEAM diziplinarteko proiektuak", "Proyectos STEAM interdisciplinares", "STEAM interdisciplinary projects"),
    ],
  },
  {
    id: "km4",
    code: "KM4",
    label: {
      eu: "Komunikazioa eta errepresentazioa",
      es: "Comunicación y representación",
      en: "Communication & representation",
    },
    description: {
      eu: "Ideia matematikoak modu argi eta zehatzean adierazi.",
      es: "Expresar ideas matemáticas con claridad y rigor.",
      en: "Express mathematical ideas clearly and rigorously.",
    },
    indicators: [
      { id: "km4.ae1", code: "AE4.1", label: { eu: "Hizkuntza matematikoa zuzen erabili", es: "Usa correctamente el lenguaje matemático", en: "Uses mathematical language correctly" } },
      { id: "km4.ae2", code: "AE4.2", label: { eu: "Errepresentazio grafiko/sinbolikoak interpretatu", es: "Interpreta representaciones gráficas y simbólicas", en: "Interprets graphic and symbolic representations" } },
      { id: "km4.ae3", code: "AE4.3", label: { eu: "Prozesua eta emaitzak komunikatu", es: "Comunica el proceso y los resultados", en: "Communicates process and results" } },
    ],
    oinarrizkoJakintzak: [
      J("km4.j1", "OJ4.1", "Hizkuntza matematikoaren sintaxia", "Sintaxis del lenguaje matemático", "Mathematical language syntax"),
      J("km4.j2", "OJ4.2", "Grafikoak eta diagramak", "Gráficos y diagramas", "Graphs and diagrams"),
    ],
  },
  {
    id: "km5",
    code: "KM5",
    label: {
      eu: "Tresna teknologikoak",
      es: "Herramientas tecnológicas",
      en: "Technological tools",
    },
    description: {
      eu: "Tresna digitalak eta teknologikoak erabili matematikan.",
      es: "Utilizar herramientas digitales y tecnológicas en matemáticas.",
      en: "Use digital and technological tools in mathematics.",
    },
    indicators: [
      { id: "km5.ae1", code: "AE5.1", label: { eu: "Software egokia hautatu", es: "Elige el software adecuado", en: "Chooses appropriate software" } },
      { id: "km5.ae2", code: "AE5.2", label: { eu: "Emaitzak modu kritikoan interpretatu", es: "Interpreta resultados de forma crítica", en: "Interprets results critically" } },
    ],
    oinarrizkoJakintzak: [
      J("km5.j1", "OJ5.1", "Kalkulu sinbolikoa (GeoGebra, etab.)", "Cálculo simbólico (GeoGebra, etc.)", "Symbolic computation (GeoGebra, etc.)"),
      J("km5.j2", "OJ5.2", "Datu-analisia kalkulu-orriekin", "Análisis de datos con hojas de cálculo", "Spreadsheet data analysis"),
    ],
  },
  {
    id: "km6",
    code: "KM6",
    label: {
      eu: "Konpetentzia sozio-afektiboa",
      es: "Competencia socio-afectiva",
      en: "Socio-affective competency",
    },
    description: {
      eu: "Talde-lana, jarrera positiboa eta autorregulazioa.",
      es: "Trabajo en equipo, actitud positiva y autorregulación.",
      en: "Teamwork, positive attitude and self-regulation.",
    },
    indicators: [
      { id: "km6.ae1", code: "AE6.1", label: { eu: "Taldean modu eraikitzailean parte hartu", es: "Participa constructivamente en el grupo", en: "Participates constructively in the group" } },
      { id: "km6.ae2", code: "AE6.2", label: { eu: "Errorea ikaskuntza-aukera gisa onartu", es: "Asume el error como oportunidad de aprendizaje", en: "Embraces error as a learning opportunity" } },
    ],
    oinarrizkoJakintzak: [
      J("km6.j1", "OJ6.1", "Talde-lana eta rolak", "Trabajo en equipo y roles", "Teamwork and roles"),
      J("km6.j2", "OJ6.2", "Autorregulazioa eta meta-kognizioa", "Autorregulación y metacognición", "Self-regulation and metacognition"),
    ],
  },
];

export function getCompetency(id: string): Competency | undefined {
  return mathCompetencies.find((c) => c.id === id);
}

export function getIndicator(id: string): { competency: Competency; indicator: Indicator } | undefined {
  for (const c of mathCompetencies) {
    const ind = c.indicators.find((i) => i.id === id);
    if (ind) return { competency: c, indicator: ind };
  }
  return undefined;
}

export const curriculumSource = {
  eu: "Iturria: Euskal Curriculuma (Heziberri) — Matematika",
  es: "Fuente: Currículo Vasco (Heziberri) — Matemáticas",
  en: "Source: Basque Curriculum (Heziberri) — Mathematics",
};