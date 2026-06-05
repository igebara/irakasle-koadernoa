import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Plus, Copy, Trash2, Download, Users, Pencil, Send } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage } from "@/lib/i18n";
import { curriculumSource, mathCompetencies } from "@/lib/curriculum";
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
  const [selected, setSelected] = useState("algebra");
  const [assignDialogFor, setAssignDialogFor] = useState<Programazioa | null>(null);
  const subjectList = subjects[lang] || subjects.eu;

  const filtered = useMemo(() => list.filter((p) => p.subjectKey === selected), [list, selected]);

  const handleCreate = () => {
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
              onClick={handleCreate}
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> {t("prog.new")}
            </button>
          }
        />

        <div className="flex flex-wrap items-end gap-3">
          <SubjectPicker value={selected} onChange={setSelected} list={subjectList} label={t("gradebook.subject")} />
          <div className="ml-auto text-[11px] text-muted-foreground italic max-w-md text-right">{curriculumSource[lang]}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              onEdit={() => navigate({ to: "/programazioa/$programId", params: { programId: p.id } })}
              onCopy={() => duplicate(p.id)}
              onDelete={() => {
                if (confirm(lang === "es" ? "¿Eliminar?" : lang === "en" ? "Delete?" : "Ezabatu?")) remove(p.id);
              }}
              onDownload={() => downloadProgram(p)}
              onAssign={() => setAssignDialogFor(p)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="md:col-span-2 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t("prog.empty")}
            </div>
          )}
        </div>

        {assignDialogFor && (
          <AssignDialog
            program={assignDialogFor}
            onClose={() => setAssignDialogFor(null)}
            onSave={(g, s) => {
              assign(assignDialogFor.id, g, s);
              setAssignDialogFor(null);
            }}
          />
        )}
      </>
    </AppShell>
  );
}

function ProgramCard({
  program: p,
  onEdit,
  onCopy,
  onDelete,
  onDownload,
  onAssign,
}: {
  program: Programazioa;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onAssign: () => void;
}) {
  const { t, lang } = useLanguage();
  const totalAtazak = p.ikasEgoerak.reduce((a, ie) => a + ie.atazak.length, 0);
  const compIds = new Set<string>();
  p.ikasEgoerak.forEach((ie) => ie.atazak.forEach((a) => a.competencies.forEach((c) => compIds.add(c.compId))));
  const assignedCount = p.assignedGroupIds.length + p.assignedStudentIds.length;

  return (
    <article className="rounded-xl bg-card border border-border p-5 flex flex-col gap-3" style={{ boxShadow: "var(--shadow-soft)" }}>
      <header>
        <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {p.ikasEgoerak.length} {lang === "eu" ? "ikas-egoera" : lang === "es" ? "sit. aprendizaje" : "learning sit."} · {totalAtazak} {lang === "eu" ? "ataza" : lang === "es" ? "tareas" : "tasks"} · {compIds.size} {t("comp.title").toLowerCase()}
        </p>
      </header>

      {/* Competency dots summary */}
      <div className="flex flex-wrap gap-1.5">
        {mathCompetencies.map((c) => {
          const on = compIds.has(c.id);
          return (
            <span
              key={c.id}
              title={c.label[lang]}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: on ? "color-mix(in oklab, var(--primary) 18%, transparent)" : "color-mix(in oklab, var(--muted-foreground) 12%, transparent)",
                color: on ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {c.code}
            </span>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        {assignedCount === 0
          ? (lang === "eu" ? "Esleitu gabe" : lang === "es" ? "Sin asignar" : "Unassigned")
          : `${p.assignedGroupIds.length} ${lang === "eu" ? "talde" : lang === "es" ? "grupos" : "groups"} · ${p.assignedStudentIds.length} ${lang === "eu" ? "ikasle" : lang === "es" ? "alumnos" : "students"}`}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-border">
        <ActBtn icon={Pencil} label={t("prog.actions.edit")} onClick={onEdit} primary />
        <ActBtn icon={Send} label={t("prog.actions.assign")} onClick={onAssign} />
        <ActBtn icon={Copy} label={t("prog.actions.copy")} onClick={onCopy} />
        <ActBtn icon={Download} label={t("prog.actions.download")} onClick={onDownload} />
        <ActBtn icon={Trash2} label={t("prog.actions.delete")} onClick={onDelete} danger />
      </div>
    </article>
  );
}

function ActBtn({ icon: Icon, label, onClick, primary, danger }: { icon: any; label: string; onClick: () => void; primary?: boolean; danger?: boolean }) {
  const cls = primary
    ? "bg-primary text-primary-foreground hover:opacity-90"
    : danger
      ? "border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      : "border border-border hover:bg-secondary";
  return (
    <button onClick={onClick} className={`h-8 px-2.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function SubjectPicker({ value, onChange, list, label }: { value: string; onChange: (v: string) => void; list: { key: string; label: string }[]; label: string }) {
  const [open, setOpen] = useState(false);
  const current = list.find((s) => s.key === value)!;
  return (
    <div className="relative">
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2 block">{label}</label>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-secondary/40 transition-colors min-w-[220px]">
        <span>{current?.label}</span>
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-lg bg-card border border-border shadow-lg overflow-hidden">
            {list.map((s) => (
              <button key={s.key} onClick={() => { onChange(s.key); setOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/60 ${s.key === value ? "bg-secondary/40 font-medium" : ""}`}>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AssignDialog({
  program,
  onClose,
  onSave,
}: {
  program: Programazioa;
  onClose: () => void;
  onSave: (groupIds: string[], studentIds: string[]) => void;
}) {
  const { t, lang } = useLanguage();
  const [groups, setGroups] = useState<string[]>(program.assignedGroupIds);
  const [students, setStudents] = useState<string[]>(program.assignedStudentIds);

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string) => {
    setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2 className="font-display text-xl font-semibold">{t("prog.actions.assign")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{program.name}</p>
          <p className="text-[11px] text-warning-foreground bg-warning/10 border border-warning/20 rounded-md mt-3 px-2.5 py-1.5" style={{ color: "color-mix(in oklab, var(--destructive) 80%, var(--foreground))" }}>
            {t("prog.assign.exclusiveWarning")}
          </p>
        </header>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t("prog.assign.groups")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {groupsCatalog.map((g) => (
              <label key={g.id} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm cursor-pointer hover:bg-secondary/40">
                <input type="checkbox" checked={groups.includes(g.id)} onChange={() => toggle(groups, setGroups, g.id)} className="accent-[color:var(--primary)]" />
                {g.label}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t("prog.assign.students")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {studentsCatalog.map((s) => (
              <label key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm cursor-pointer hover:bg-secondary/40">
                <input type="checkbox" checked={students.includes(s.id)} onChange={() => toggle(students, setStudents, s.id)} className="accent-[color:var(--primary)]" />
                <span className="flex-1">{s.name}</span>
                <span className="text-[10px] text-muted-foreground">{s.groupId}</span>
              </label>
            ))}
          </div>
        </section>

        <footer className="flex justify-end gap-2 pt-2 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-md text-sm border border-border hover:bg-secondary">
            {t("common.cancel")}
          </button>
          <button onClick={() => onSave(groups, students)} className="h-9 px-4 rounded-md text-sm bg-primary text-primary-foreground font-medium hover:opacity-90">
            {t("common.save")}
          </button>
        </footer>
      </div>
    </div>
  );
}