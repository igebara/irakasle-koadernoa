## Helburua

Programazioa atala berregituratu, asignatura bakoitzak programazio bat baino gehiago izan ditzan, eta programazio bakoitzak edukin aberatsa (xehetasunak, justifikazioa, ikas-egoerak ataza konpetentzialekin, metodologia, ebaluazio erabakiak, fitxategiak/estekak). Programazioak talde osoei edo ikasle indibidualei eslei dakizkieke, ikasle bakoitzak gehienez bat duela asignatura bakoitzeko.

## Datu-eredu berria (`src/lib/programazioa.ts`)

```ts
type Bilingual = { eu: string; es: string };

type FileLink = { id: string; kind: "file" | "link"; label: string; url: string };

type OinarrizkoJakintza = { id: string; label: Bilingual };

type AtazaKonpetentziala = {
  id: string;
  title: Bilingual;
  competencies: { compId: string; indicatorIds: string[] }[]; // ebaluazio irizpideak = indicators
  jakintzak: string[]; // OinarrizkoJakintza ids
};

type IkasEgoera = {
  id: string;
  title: Bilingual;
  atazak: AtazaKonpetentziala[];
};

type Programazioa = {
  id: string;
  subjectKey: string;
  name: string;             // izen labur identifikatzailea
  xehetasunak: Bilingual;
  justifikazioa: Bilingual;
  metodologia: Bilingual;
  ebaluazioErabakiak: Bilingual;
  ikasEgoerak: IkasEgoera[];
  fitxategiak: FileLink[];
  // esleipenak
  assignedGroupIds: string[];
  assignedStudentIds: string[];
};
```

Store: `{ programs: Programazioa[] }` localStorage-n (`programazioa.v2`), v1tik migrazio sinplea. Hook berriak: `useProgramazioak()` `(list, create, update, remove, duplicate, assign)` metodoekin.

Inbariantea: ikasle bati asignatura beraren programazio bat baino gehiago esleitu nahi bazaio → aurrekoa kendu eta berria jarri (UI-an alerta/toast).

`curriculum.ts`-ri `oinarrizkoJakintzak: OinarrizkoJakintza[]` gehitu konpetentzia bakoitzean (sample-a).

## Programazioa orriaren arkitektura berria

`src/routes/programazioa.tsx` orain LIST orria izango da:
- Asignatura aukeratu (egungo `SubjectPicker`).
- Asignatura horretako programazioen zerrenda kartetan: izena, ikas-egoera kop., konpetentzia kop., esleipenen laburpena.
- Karta bakoitzeko ekintzak: **Editatu**, **Kopiatu**, **Esleitu**, **Deskargatu (JSON)**, **Ezabatu**.
- Goian "Programazio berria" botoia → editorera doa id berriarekin.

Editor orri berria: `src/routes/programazioa.$programId.tsx`
- Goiko aldean: **laburpen grafiko** sticky bat (`ProgramSummary`) konpetentzia bakoitzeko aurrerapen barrak, ikas-egoera/ataza kopuruak, esleipen-laburpena.
- Tab/atal bertikalak (anchor scroll):
  1. Xehetasunak — bilingual textarea (EU/ES pestainekin)
  2. Justifikazioa — bilingual textarea
  3. Ikas-egoerak — gehitu/ezabatu IkasEgoera; bakoitzean AtazaKonpetentzialak gehitu; ataza bakoitzean: izenburu bilingual, konpetentzia/indicator multiselect (`mathCompetencies`-tik), oinarrizko jakintzen checkbox-zerrenda.
  4. Metodologia — bilingual textarea
  5. Ebaluazioaren erabakiak — bilingual textarea
  6. Fitxategiak eta estekak — gehitu/ezabatu sarrera (etiketa + URL + mota)
- Gorde botoiak debounce-rekin auto-save egiten du localStorage-n.

## Esleitzeko Dialog `AssignDialog`

- Talde-zerrenda (datu mock-etik `src/lib/curriculum.ts` edo `classes.tsx`-eko klaseak berrerabili — egungo `subjects`/klaseak abiapuntu).
- Ikasle-zerrenda (kotxe mock-a).
- Multi-select checkbox-ekin; gordetzean `assignedGroupIds`/`assignedStudentIds` eguneratu eta `enforceExclusivity()` deitu beste programazioetatik ikasle horiek kentzeko.

## Kopiatu & Deskargatu

- Kopiatu: programa duplikatu, `id` berria, `name` ondoan `(kopia)`, esleipenak hutsik.
- Deskargatu: `Blob` JSON-ekin → `download` atributudun anchor. Geroago PDF inportatu daiteke.

## Osagai berriak

- `src/components/programazioa/ProgramSummary.tsx` — laburpen grafikoa (konp. agregatuak `CompetencyMeter`/aurrerapen-barrak erabiliz).
- `src/components/programazioa/BilingualTextarea.tsx` — EU/ES tab + textarea.
- `src/components/programazioa/IkasEgoeraEditor.tsx`, `AtazaEditor.tsx` — bistaratze/edizioa.
- `src/components/programazioa/AssignDialog.tsx` — esleipen modala.

## i18n gehigarriak (`src/lib/i18n.tsx`)

`prog.list.title`, `prog.new`, `prog.actions.{edit,copy,assign,download,delete}`, `prog.sections.{details,justification,methodology,evaluation,files,situations}`, `prog.assign.{groups,students,exclusiveWarning}`, `prog.summary.title`, `prog.tasks.title`, `prog.knowledge.title`, EU/ES/EN itzulpenekin.

## Erruta-erregistroa

`src/routeTree.gen.ts` eguneratu: `/programazioa/$programId` erruta berria (`programazioa.$programId.tsx`). Egungo `/programazioa` zerrenda izango da.

## Esparrutik kanpo

- Backend benetakoa (Lovable Cloud) — dena localStorage-n jarraituko du.
- Fitxategien igoera benetakoa — soilik URL/etiketa, ez upload.
- PDF deskarga — JSON deskarga bertsio honetan; PDF hurrengo iterazioan.
- Assignments & Gradebook orriak ez dira aldatzen oraingoz (egungo egitura mantenduko da, programazio berriak datu-iturri ez dira).
