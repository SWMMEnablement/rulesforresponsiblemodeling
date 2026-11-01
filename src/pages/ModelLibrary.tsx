import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Archive, Download, FileCode, Loader2, Pencil, Play, PlayCircle, Trash2, Upload, Check, X } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { runSwmm, type SwmmRunResult } from "@/lib/swmm/runner";
import { parseSwmmOut, type SwmmOutSeries } from "@/lib/swmm/outParser";
import { TUTORIAL_INP } from "@/lib/swmm/tutorialModel";
import {
  deleteModel, listModels, looksLikeInp, newModel, putModel, summarizeRun, uniqueName, type LibraryModel,
} from "@/lib/swmm/modelLibrary";

const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);
const fmtDate = (t: number) => new Date(t).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const pct = (v: number) => (isNaN(v) ? "–" : `${v.toFixed(2)}%`);

export default function ModelLibrary() {
  const { toast } = useToast();
  const [models, setModels] = useState<LibraryModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [running, setRunning] = useState<Set<string>>(new Set());
  const [batch, setBatch] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [renaming, setRenaming] = useState<{ id: string; value: string } | null>(null);
  const [active, setActive] = useState<{ id: string; result: SwmmRunResult; series: SwmmOutSeries | null } | null>(null);
  const [plotLink, setPlotLink] = useState("");

  const refresh = useCallback(async () => {
    try { setModels(await listModels()); setStorageError(""); }
    catch (e) { setStorageError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const addFiles = async (files: FileList | File[]) => {
    const taken = models.map((m) => m.name);
    let added = 0;
    const skipped: string[] = [];
    for (const f of Array.from(files)) {
      const text = await f.text();
      if (!looksLikeInp(text)) { skipped.push(f.name); continue; }
      const m = newModel(f.name, text, taken);
      taken.push(m.name);
      try { await putModel(m); added++; }
      catch (e) { toast({ title: `Could not save ${f.name}`, description: e instanceof Error ? e.message : String(e), variant: "destructive" }); }
    }
    await refresh();
    if (added) toast({ title: `Saved ${added} model${added > 1 ? "s" : ""} to your library` });
    if (skipped.length) toast({ title: "Skipped files that aren't SWMM input", description: skipped.join(", "), variant: "destructive" });
  };

  const addTutorial = async () => {
    await putModel(newModel("Tutorial model.inp", TUTORIAL_INP, models.map((m) => m.name)));
    await refresh();
  };

  const run = async (m: LibraryModel, show = true) => {
    setRunning((s) => new Set(s).add(m.id));
    try {
      let r: SwmmRunResult;
      try { r = await runSwmm(m.inp); }
      catch (e) {
        r = { ok: false, rc: -1, rpt: "", out: null, massBal: { runoffErr: NaN, flowErr: NaN, qualErr: NaN }, errMsg: e instanceof Error ? e.message : String(e), durationMs: 0 };
      }
      let series: SwmmOutSeries | null = null;
      if (r.out) { const s = parseSwmmOut(r.out); if (s.ok) series = s; }
      const updated = { ...m, lastRun: summarizeRun(r, series) };
      await putModel(updated);
      setModels((list) => list.map((x) => (x.id === m.id ? updated : x)));
      if (show) {
        setActive({ id: m.id, result: r, series });
        setPlotLink(updated.lastRun.peakFlowLink || series?.links[0] || "");
        setTimeout(() => document.getElementById("library-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }
    } finally {
      setRunning((s) => { const n = new Set(s); n.delete(m.id); return n; });
    }
  };

  const runAll = async () => {
    setBatch(true);
    for (const m of models) await run(m, false);
    setBatch(false);
    toast({ title: `Ran all ${models.length} models` });
  };

  const remove = async (m: LibraryModel) => {
    if (!window.confirm(`Delete "${m.name}" from your library?`)) return;
    await deleteModel(m.id);
    if (active?.id === m.id) setActive(null);
    await refresh();
  };

  const saveRename = async () => {
    if (!renaming) return;
    const m = models.find((x) => x.id === renaming.id);
    const value = renaming.value.trim();
    if (m && value && value !== m.name) {
      const name = uniqueName(value, models.filter((x) => x.id !== m.id).map((x) => x.name));
      const updated = { ...m, name };
      await putModel(updated);
      setModels((list) => list.map((x) => (x.id === m.id ? updated : x)));
    }
    setRenaming(null);
  };

  const download = (m: LibraryModel) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([m.inp], { type: "text/plain" }));
    a.download = m.name.endsWith(".inp") ? m.name : `${m.name}.inp`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const activeModel = models.find((m) => m.id === active?.id);
  const series = active?.series ?? null;
  const chartData = useMemo(() => {
    if (!series || !plotLink) return [];
    const li = series.links.indexOf(plotLink);
    if (li < 0) return [];
    return Array.from(series.times, (t, k) => ({ hr: +(t / 3600).toFixed(3), flow: +series.linkFlow[li][k].toFixed(3) }));
  }, [series, plotLink]);
  const peaks = useMemo(() => {
    if (!series) return null;
    const max = (a: Float32Array) => a.reduce((m, v) => Math.max(m, v), 0);
    return {
      links: series.links.map((id, i) => ({ id, flow: max(series.linkFlow[i]), depth: max(series.linkDepth[i]) })),
      nodes: series.nodes.map((id, i) => ({ id, depth: max(series.nodeDepth[i]), flood: max(series.nodeFlooding[i]) })),
    };
  }, [series]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Model Library | Rules for Responsible Modeling</title>
        <meta name="description" content="Upload and keep several SWMM5 .inp files, then run any of them on the real SWMM 5.2 engine in your browser." />
      </Helmet>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <Archive className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Model Library</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Keep your SWMM5 models in one place and run any of them on the same real SWMM 5.2 engine as the{" "}
            <Link to="/playground" className="text-primary underline">Playground</Link>. Files are saved in this browser on this device only —
            nothing is uploaded to a server, and clearing your browser data removes them.
          </p>
        </header>

        <Card
          className={`p-6 border-2 border-dashed transition-colors ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Add models</p>
              <p className="text-sm text-muted-foreground">Drop one or more .inp files here, or choose them.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-1" /> Upload .inp files
                  <input type="file" accept=".inp,.txt" multiple className="hidden" aria-label="Upload .inp files"
                    onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }} />
                </label>
              </Button>
              <Button variant="outline" onClick={addTutorial}><FileCode className="h-4 w-4 mr-1" /> Add tutorial model</Button>
              <Button variant="outline" onClick={runAll} disabled={batch || models.length === 0}>
                {batch ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <PlayCircle className="h-4 w-4 mr-1" />} Run all
              </Button>
            </div>
          </div>
        </Card>

        {storageError && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">{storageError}</div>}

        <section aria-label="Saved models" className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Saved models ({models.length})</h2>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : models.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">Your library is empty. Upload an .inp file or add the tutorial model to start.</Card>
          ) : (
            <div className="grid gap-3">
              {models.map((m) => {
                const busy = running.has(m.id);
                const lr = m.lastRun;
                return (
                  <Card key={m.id} className={`p-4 ${active?.id === m.id ? "ring-2 ring-primary" : ""}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1">
                        {renaming?.id === m.id ? (
                          <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); saveRename(); }}>
                            <Label htmlFor={`rn-${m.id}`} className="sr-only">Model name</Label>
                            <Input id={`rn-${m.id}`} autoFocus value={renaming.value} className="h-8 max-w-sm"
                              onChange={(e) => setRenaming({ id: m.id, value: e.target.value })}
                              onKeyDown={(e) => { if (e.key === "Escape") setRenaming(null); }} />
                            <Button type="submit" size="icon" variant="ghost" aria-label="Save name"><Check className="h-4 w-4" /></Button>
                            <Button type="button" size="icon" variant="ghost" aria-label="Cancel rename" onClick={() => setRenaming(null)}><X className="h-4 w-4" /></Button>
                          </form>
                        ) : (
                          <h3 className="font-semibold text-foreground truncate">{m.name}</h3>
                        )}
                        {m.summary.title && <p className="text-sm text-muted-foreground truncate">{m.summary.title}</p>}
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <Badge variant="secondary">{m.summary.subcatchments} subcatchments</Badge>
                          <Badge variant="secondary">{m.summary.nodes} nodes</Badge>
                          <Badge variant="secondary">{m.summary.links} links</Badge>
                          {m.summary.flowUnits && <Badge variant="secondary">{m.summary.flowUnits}</Badge>}
                          <Badge variant="outline">{fmtSize(m.size)}</Badge>
                          <Badge variant="outline">Saved {fmtDate(m.savedAt)}</Badge>
                        </div>
                        {lr && (
                          <p className={`text-xs ${lr.ok ? "text-muted-foreground" : "text-destructive"}`}>
                            Last run {fmtDate(lr.at)}:{" "}
                            {lr.ok
                              ? <>flow continuity {pct(lr.flowErr)}, runoff continuity {pct(lr.runoffErr)}
                                  {lr.peakFlow !== null && <>, peak flow {lr.peakFlow.toFixed(2)} {lr.flowUnits} in {lr.peakFlowLink}</>}
                                  {lr.floodedNodes > 0 && <span className="text-destructive font-medium">, {lr.floodedNodes} node{lr.floodedNodes > 1 ? "s" : ""} flooded</span>}
                                </>
                              : <>failed — {lr.error}</>}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Button size="sm" onClick={() => run(m)} disabled={busy || batch}>
                          {busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />} Run
                        </Button>
                        <Button size="icon" variant="ghost" aria-label={`Rename ${m.name}`} onClick={() => setRenaming({ id: m.id, value: m.name })}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Download ${m.name}`} onClick={() => download(m)}><Download className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${m.name}`} onClick={() => remove(m)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {active && activeModel && (
          <section id="library-results" className="scroll-mt-24">
            <Card className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-foreground">Results: {activeModel.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setActive(null)}>Close</Button>
              </div>
              {!active.result.ok && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">
                  <strong>SWMM error:</strong> {active.result.errMsg || active.result.error || `code ${active.result.rc}`}
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">Run time {active.result.durationMs.toFixed(0)} ms</Badge>
                <Badge variant={Math.abs(active.result.massBal.runoffErr) > 10 ? "destructive" : "outline"}>Runoff continuity {pct(active.result.massBal.runoffErr)}</Badge>
                <Badge variant={Math.abs(active.result.massBal.flowErr) > 10 ? "destructive" : "outline"}>Flow continuity {pct(active.result.massBal.flowErr)}</Badge>
                {series && <Badge variant="outline">Flow units {series.flowUnits}</Badge>}
              </div>
              {series && series.links.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Label htmlFor="lib-link">Hydrograph for link</Label>
                    <select id="lib-link" className="h-8 rounded-md border bg-background px-2" value={plotLink} onChange={(e) => setPlotLink(e.target.value)}>
                      {series.links.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="hr" unit=" h" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: number) => `${v} ${series.flowUnits}`} labelFormatter={(l) => `${l} h`} />
                        <Legend />
                        <Line type="monotone" dataKey="flow" name={`${plotLink} flow (${series.flowUnits})`} stroke="hsl(var(--primary))" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {peaks && (
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="max-h-72 overflow-auto">
                    <table className="w-full">
                      <thead><tr className="text-left text-muted-foreground"><th>Link</th><th>Peak flow</th><th>Peak depth</th></tr></thead>
                      <tbody>{peaks.links.map((l) => <tr key={l.id} className="border-t"><td>{l.id}</td><td>{l.flow.toFixed(2)}</td><td>{l.depth.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                  </div>
                  <div className="max-h-72 overflow-auto">
                    <table className="w-full">
                      <thead><tr className="text-left text-muted-foreground"><th>Node</th><th>Peak depth</th><th>Peak flooding</th></tr></thead>
                      <tbody>{peaks.nodes.map((n) => <tr key={n.id} className="border-t"><td>{n.id}</td><td>{n.depth.toFixed(2)}</td><td className={n.flood > 0 ? "text-destructive font-semibold" : ""}>{n.flood.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                  </div>
                </div>
              )}
              {active.result.rpt && (
                <details>
                  <summary className="cursor-pointer text-sm font-medium">Full SWMM report</summary>
                  <pre className="mt-2 max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">{active.result.rpt}</pre>
                </details>
              )}
            </Card>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
