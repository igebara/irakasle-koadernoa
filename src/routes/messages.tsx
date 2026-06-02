import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useLanguage, getLocalizedData } from "@/lib/i18n";
import { useState } from "react";
import { Send } from "lucide-react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Northgate" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const { lang, t } = useLanguage();
  const { messages } = getLocalizedData(lang);
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");
  const current = messages[selected];

  return (
    <AppShell>
      <>
        <PageHeader title={t("page.messages.title")} subtitle={t("page.messages.subtitle")} />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-260px)] min-h-[480px]">
          <ul className="rounded-xl bg-card border border-border overflow-y-auto" style={{ boxShadow: "var(--shadow-soft)" }}>
            {messages.map((m, i) => (
              <li key={m.from}>
                <button
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 transition-colors ${i === selected ? "bg-secondary" : "hover:bg-secondary/50"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${m.unread ? "font-semibold" : "font-medium"}`}>{m.from}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{m.role}</p>
                  <p className="text-xs text-muted-foreground/90 mt-1 line-clamp-1">{m.preview}</p>
                </button>
              </li>
            ))}
          </ul>
          <div className="md:col-span-2 rounded-xl bg-card border border-border flex flex-col" style={{ boxShadow: "var(--shadow-soft)" }}>
            <div className="px-6 py-4 border-b border-border">
              <p className="font-display text-lg font-semibold">{current.from}</p>
              <p className="text-xs text-muted-foreground">{current.role}</p>
            </div>
            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-3">
              <div className="max-w-md rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm">{current.preview}</div>
            </div>
            <form
              className="px-4 py-3 border-t border-border flex gap-2"
              onSubmit={(e) => { e.preventDefault(); setDraft(""); }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="…"
                className="flex-1 h-10 px-3 rounded-lg bg-secondary border border-transparent focus:border-ring focus:bg-background outline-none text-sm"
              />
              <button type="submit" className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-2 hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </section>
      </>
    </AppShell>
  );
}