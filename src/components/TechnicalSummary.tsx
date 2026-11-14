import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AI_USE_DISCLOSURE, SUMMARY_PATH } from "@/data/appDocumentation";

async function readSummary(): Promise<string> {
  try {
    const response = await fetch(SUMMARY_PATH, { signal: AbortSignal.timeout(5000) });
    if (response.ok) {
      const text = await response.text();
      if (text.startsWith("---\nname:")) return text;
    }
  } catch { /* Shared HTML can use the embedded copy without hosting. */ }
  const embedded = document.getElementById("app-md")?.textContent;
  if (embedded?.trim()) return embedded;
  throw new Error("The technical summary is unavailable. Please try again.");
}

export function TechnicalSummary() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  async function load(download: boolean) {
    setBusy(true);
    setError("");
    try {
      const text = markdown ?? await readSummary();
      setMarkdown(text);
      if (download) {
        const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "index.md";
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The summary could not be opened.");
    } finally { setBusy(false); }
  }

  return (
    <section className="mt-8 border-t border-border pt-6" aria-labelledby="technical-summary-heading">
      <h3 id="technical-summary-heading" className="text-xl font-bold text-foreground">Technical summary</h3>
      <div className="flex flex-wrap gap-3 mt-3">
        <Button variant="outline" disabled={busy} asChild>
          <a href={SUMMARY_PATH} download="index.md" onClick={(event) => { event.preventDefault(); if (!busy) void load(true); }}>
            <Download className="w-4 h-4 mr-2" />Technical summary (.md)
          </a>
        </Button>
        <Button variant="ghost" disabled={busy} aria-expanded={open} onClick={() => { if (open) setOpen(false); else void load(false); }}>
          <FileText className="w-4 h-4 mr-2" />{open ? "Close summary" : "Read summary"}
        </Button>
      </div>
      {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
      {open && markdown && (
        <div className="prose dark:prose-invert max-w-none mt-6 break-words prose-pre:overflow-x-auto">
          <ReactMarkdown>{markdown.replace(/^---\n[\s\S]*?\n---\n/, "")}</ReactMarkdown>
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mt-6">AI use</h3>
      <p className="text-muted-foreground mt-2 leading-relaxed">{AI_USE_DISCLOSURE}</p>
    </section>
  );
}