import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Copy, Download, Users, X, Check } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import {
  useProgramazioak,
  downloadProgram,
  groupsCatalog,
  studentsCatalog,
  type Programazioa,
} from "@/lib/programazioa";

export const Route = createFileRoute("/programazioa")({
  head: () => ({ meta: [{ title: "Programazioa — Northgate" }] }),
  component: ProgramazioaListPage,
});

const subjects = {
  eu: [
    { key: "algebra", label: "Aljebra II" },
    { key: "geometry", label: "Geometria" },
    { key: "calculus", label: "Kalkulua" },
    { key: "statistics", label: "Estatistika" },
    { key: "mathclub", label: "Matematika Kluba" },
  ],
  es: [
    { key: "algebra", label: "Álgebra II" },
    { key: "geometry", label: "Geometría" },
    { key: "calculus", label: "Cálculo" },
    { key: "statistics", label: "Estadística" },
    { key: "mathclub", label: "Club de Matemáticas" },
  ],
  en: [
    { key: "algebra", label: "Algebra II" },
    { key: "geometry", label: "Geometry" },
    { key: "calculus", label: "Calculus" },
    { key: "statistics", label: "Statistics" },
    { key: "mathclub", label: "Math Club" },
  ],
};

function ProgramazioaListPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { list, create, remove, duplicate, assign } = useProgramazioak();
  const subjectList = subjects[lang] ?? subjects.eu;
  const [selected, setSelected] = useState<string>(subjectList[0].key);
  const [assigning, setAssigning] = useState<Programazioa | null>(null);

  const visible = useMemo(() => list.filter((p) => p.subjectKey === selected), [list, selected]);

  const handleNew = () => {
    const id = create(selected, lang === "es" ? "Nueva programación" : lang === "en" ? "New program" : "Programazio berria");
    navigate({ to: "/programazioa/$programId", params: { programId: id } });
  };

  return (
    <AppShell>
      <>
        <PageHeader
          title={t("page.programazioa.title")}
          subtitle={t("page.programazioa.subtitle")}
          action={
            <button
              onClick={handleNew}
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("prog.new")}
            </button>
          }
        />

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">
            {t("gradebook.subject")}
          </label>
          <div className="flex flex-wrap gap-2">
            {subjectList.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelected(s.key)}
                className={`h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  selected === s.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visible.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              lang={lang}
              t={t}
              onEdit={() => navigate({ to: "/programazioa/$programId", params: { programId: p.id } })}
              onCopy={() => duplicate(p.id)}
              onDelete={() => {
                if (confirm(`${p.name}?`)) remove(p.id);
              }}
              onDownload={() => downloadProgram(p)}
              onAssign={() => setAssigning(p)}
            />
          ))}
          {visible.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t("prog.empty")}
            </div>
          )}
        </div>

        {assigning && (
          <AssignModal
            program={assigning}
            t={t}
            onClose={() => setAssigning(null)}
            onSave={(groupIds, studentIds) => {
              assign(assigning.id, groupIds, studentIds);
              setAssigning(null);
            }}
          />
        )}
      </>
    </AppShell>
  );
}

function ProgramCard({
  program,
  lang,
  t,
  onEdit,
  onCopy,
  onDelete,
  onDownload,
  onAssign,
}: {
  program: Programazioa;
  lang: "eu" | "es" | "en";
  t: (k: string) => string;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onAssign: () => void;
}) {
  const atazaCount = program.ikasEgoerak.reduce((a, ie) => a + ie.atazak.length, 0);
  const assignedGroups = program.assignedGroupIds.length;
  const assignedStudents = program.assignedStudentIds.length;
  return (
    <section
      className="rounded-xl bg-card border border-border px-5 py-4 flex flex-wrap items-start gap-4"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-base">{program.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {program.ikasEgoerak.length} {lang === "es" ? "situaciones" : lang === "en" ? "situations" : "ikas-egoera"}
          {" · "}
          {atazaCount} {lang === "es" ? "tareas" : lang === "en" ? "tasks" : "ataza"}
          {(assignedGroups + assignedStudents) > 0 && (
            <>
              {" · "}
              {assignedGroups} {t("prog.assign.groups").toLowerCase()}, {assignedStudents} {t("prog.assign.students").toLowerCase()}
            </>
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <ActionBtn onClick={onEdit} icon={Pencil} label={t("prog.actions.edit")} primary />
        <ActionBtn onClick={onCopy} icon={Copy} label={t("prog.actions.copy")} />
        <ActionBtn onClick={onAssign} icon={Users} label={t("prog.actions.assign")} />
        <ActionBtn onClick={onDownload} icon={Download} label={t("prog.actions.download")} />
        <ActionBtn onClick={onDelete} icon={Trash2} label={t("prog.actions.delete")} danger />
      </div>
    </section>
  );
}

function ActionBtn({
  onClick,
  icon: Icon,
  label,
  primary,
  danger,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  const cls = primary
    ? "bg-primary text-primary-foreground hover:opacity-90"
    : danger
    ? "border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"
    : "border border-border hover:bg-secondary";
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function AssignModal({
  program,
  t,
  onClose,
  onSave,
}: {
  program: Programazioa;
  t: (k: string) => string;
  onClose: () => void;
  onSave: (groupIds: string[], studentIds: string[]) => void;
}) {
  const [groups, setGroups] = useState<string[]>(program.assignedGroupIds);
  const [students, setStudents] = useState<string[]>(program.assignedStudentIds);
  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) =>
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border flex flex-col" style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)" }}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{t("prog.actions.assign")}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-2">
            {t("prog.assign.exclusiveWarning")}
          </p>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t("prog.assign.groups")}</h3>
            <div className="flex flex-wrap gap-2">
              {groupsCatalog.map((g) => {
                const on = groups.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggle(groups, setGroups, g.id)}
                    className={`h-9 px-3 rounded-lg text-sm border transition-colors ${
                      on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t("prog.assign.students")}</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {studentsCatalog.map((s) => {
                const on = students.includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2 text-sm px-2 py-1.5 rounded hover:bg-secondary/60 cursor-pointer">
                    <input type="checkbox" checked={on} onChange={() => toggle(students, setStudents, s.id)} className="accent-[color:var(--primary)]" />
                    <span className="flex-1">{s.name}</span>
                    <span className="text-[10px] text-muted-foreground">{s.groupId}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-t border-border flex justify-end gap-2 bg-secondary/20">
          <button onClick={onClose} className="h-9 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary">
            {t("common.cancel")}
          </button>
          <button
            onClick={() => onSave(groups, students)}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" /> {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
