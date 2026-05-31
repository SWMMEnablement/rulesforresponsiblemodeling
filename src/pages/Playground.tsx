import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Download, AlertTriangle, FlaskConical } from "lucide-react";
import {
  TUTORIAL_INP,
  DEFAULT_PARAMS,
  applyParams,
  parseReport,
  type PlaygroundParams,
  type ReportSummary,
} from "@/lib/swmm/tutorialModel";
import { runSwmm, type SwmmRunResult } from "@/lib/swmm/runner";

interface EnsembleRow {
  manningN: number;
  pctImperv: number;
  rainfallMultiplier: number;
  peakFlow?: number;
  continuityErr?: number;
  ok: boolean;
}

const PRESETS: Array<{ label: string; description: string; params: PlaygroundParams }> = [
  {
    label: "Baseline",
    description: "Calibrated reference run.",
    params: { manningN: 0.013, pctImperv: 60, rainfallMultiplier: 1.0 },
  },
  {
    label: "Double the rain",
    description: "Climate shock: 2× design storm intensity.",
    params: { manningN: 0.013, pctImperv: 60, rainfallMultiplier: 2.0 },
  },
  {
    label: "Pave it all",
    description: "100% impervious — worst-case urbanization.",
    params: { manningN: 0.013, pctImperv: 100, rainfallMultiplier: 1.0 },
  },
  {
    label: "Absurdly rough pipes",
    description: "Manning n = 0.10 (rule violation: implausible parameter).",
    params: { manningN: 0.10, pctImperv: 60, rainfallMultiplier: 1.0 },
  },
  {
    label: "Glass-smooth pipes",
    description: "Manning n = 0.008 — supercritical instability risk.",
    params: { manningN: 0.008, pctImperv: 60, rainfallMultiplier: 1.0 },
  },
];

export default function Playground() {
  const [params, setParams] = useState<PlaygroundParams>(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SwmmRunResult | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [ensemble, setEnsemble] = useState<EnsembleRow[]>([]);
  const [ensembleRunning, setEnsembleRunning] = useState(false);

  const runOnce = useCallback(async (p: PlaygroundParams) => {
    setRunning(true);
    const inp = applyParams(TUTORIAL_INP, p);
    const r = await runSwmm(inp);
    setResult(r);
    setSummary(r.rpt ? parseReport(r.rpt) : null);
    setRunning(false);
    return r;
  }, []);

  const runEnsemble = useCallback(async () => {
    setEnsembleRunning(true);
    setEnsemble([]);
    const N = 20;
    const rows: EnsembleRow[] = [];
    for (let i = 0; i < N; i++) {
      // Sample Manning's n uniformly in [0.011, 0.025] and rainfall multiplier in [0.7, 1.5]
      const manningN = 0.011 + Math.random() * 0.014;
      const rainfallMultiplier = 0.7 + Math.random() * 0.8;
      const pctImperv = Math.max(0, Math.min(100, 60 + (Math.random() - 0.5) * 30));
      const inp = applyParams(TUTORIAL_INP, { manningN, pctImperv, rainfallMultiplier });
      const r = await runSwmm(inp);
      const s = r.rpt ? parseReport(r.rpt) : {};
      rows.push({
        manningN,
        pctImperv,
        rainfallMultiplier,
        peakFlow: s.peakLinkFlow,
        continuityErr: s.continuityErrorFlow,
        ok: r.ok,
      });
      setEnsemble([...rows]);
    }
    setEnsembleRunning(false);
  }, []);

  const downloadReport = () => {
    if (!result?.rpt) return;
    const blob = new Blob([result.rpt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swmm-report.rpt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const peakFlows = ensemble.map((r) => r.peakFlow).filter((v): v is number => typeof v === "number");
  const peakMin = peakFlows.length ? Math.min(...peakFlows) : 0;
  const peakMax = peakFlows.length ? Math.max(...peakFlows) : 0;
  const peakMean = peakFlows.length ? peakFlows.reduce((a, b) => a + b, 0) / peakFlows.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SWMM5 Playground — Rules for Responsible Modeling</title>
        <meta name="description" content="Interactive WebAssembly SWMM5 lab. Adjust parameters, run real simulations, and watch modeling rules come alive." />
      </Helmet>
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary" />
            <Badge variant="outline">Live WASM Engine</Badge>
            <Badge variant="secondary">SWMM 5.2.4</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">SWMM5 Playground</h1>
          <p className="text-muted-foreground max-w-3xl">
            The real EPA SWMM5 hydraulic engine compiled to WebAssembly, running entirely in
            your browser. Adjust parameters, launch ensembles, and feel the consequences of
            ignoring modeling rules through immediate, visual feedback.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
          {/* Controls */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Tutorial model</h2>
              <p className="text-sm text-muted-foreground">
                One subcatchment, one circular conduit, one outfall. A 3-hour design storm.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Manning's n (conduit)</span>
                  <span className="tabular-nums text-muted-foreground">{params.manningN.toFixed(4)}</span>
                </div>
                <Slider
                  min={0.008}
                  max={0.25}
                  step={0.001}
                  value={[params.manningN]}
                  onValueChange={([v]) => setParams({ ...params, manningN: v })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Realistic: 0.011–0.025. Extreme values trigger instability.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">% Impervious</span>
                  <span className="tabular-nums text-muted-foreground">{params.pctImperv.toFixed(0)}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[params.pctImperv]}
                  onValueChange={([v]) => setParams({ ...params, pctImperv: v })}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Rainfall multiplier</span>
                  <span className="tabular-nums text-muted-foreground">×{params.rainfallMultiplier.toFixed(2)}</span>
                </div>
                <Slider
                  min={0.1}
                  max={5}
                  step={0.05}
                  value={[params.rainfallMultiplier]}
                  onValueChange={([v]) => setParams({ ...params, rainfallMultiplier: v })}
                />
              </div>
            </div>

            <Button onClick={() => runOnce(params)} disabled={running} className="w-full">
              {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              {running ? "Running…" : "Run simulation"}
            </Button>

            <div>
              <h3 className="text-sm font-semibold mb-2">Scenario presets</h3>
              <div className="grid gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setParams(p.params); runOnce(p.params); }}
                    disabled={running}
                    className="text-left p-2 rounded border border-border hover:bg-muted/50 transition text-sm disabled:opacity-50"
                  >
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="ensemble">Uncertainty Ensemble</TabsTrigger>
                <TabsTrigger value="report">Full Report</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                {!result && (
                  <Card className="p-10 text-center text-muted-foreground">
                    Press <strong>Run simulation</strong> to compile the input and execute SWMM5 in your browser.
                  </Card>
                )}
                {result && (
                  <>
                    {!result.ok && (
                      <Card className="p-4 border-destructive bg-destructive/10 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-destructive">Run did not complete cleanly (rc={result.rc})</div>
                          <div className="text-sm text-muted-foreground mt-1">{result.errMsg || result.error}</div>
                        </div>
                      </Card>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Stat label="Engine runtime" value={`${result.durationMs.toFixed(0)} ms`} />
                      <Stat
                        label="Flow continuity err"
                        value={summary?.continuityErrorFlow !== undefined ? `${summary.continuityErrorFlow.toFixed(2)}%` : "—"}
                        warn={summary?.continuityErrorFlow !== undefined && Math.abs(summary.continuityErrorFlow) > 10}
                      />
                      <Stat
                        label="Peak link flow"
                        value={summary?.peakLinkFlow !== undefined ? `${summary.peakLinkFlow.toFixed(2)} cfs` : "—"}
                        sub={summary?.peakLinkFlowName}
                      />
                      <Stat
                        label="Peak node depth"
                        value={summary?.peakNodeDepth !== undefined ? `${summary.peakNodeDepth.toFixed(2)} ft` : "—"}
                        sub={summary?.peakNodeDepthName}
                      />
                    </div>
                    {summary?.continuityErrorFlow !== undefined && Math.abs(summary.continuityErrorFlow) > 10 && (
                      <Card className="p-4 border-amber-500/40 bg-amber-500/10">
                        <p className="text-sm">
                          <strong>Rule check: Continuity error &gt; 10%.</strong> Volumes are
                          unreliable — reduce the routing time step or revisit your boundary conditions
                          before trusting these results.
                        </p>
                      </Card>
                    )}
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="w-4 h-4 mr-2" /> Download .rpt
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="ensemble" className="space-y-4">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Monte-Carlo uncertainty sweep</div>
                      <div className="text-xs text-muted-foreground">
                        20 runs · sampled Manning n ∈ [0.011, 0.025], rainfall ×[0.7, 1.5], imperviousness ±15%
                      </div>
                    </div>
                    <Button onClick={runEnsemble} disabled={ensembleRunning} size="sm">
                      {ensembleRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                      Run ensemble
                    </Button>
                  </div>
                  {ensemble.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Stat label="Min peak flow" value={`${peakMin.toFixed(2)} cfs`} />
                      <Stat label="Mean peak flow" value={`${peakMean.toFixed(2)} cfs`} />
                      <Stat label="Max peak flow" value={`${peakMax.toFixed(2)} cfs`} />
                    </div>
                  )}
                </Card>
                {ensemble.length > 0 && (
                  <Card className="p-0 overflow-hidden">
                    <div className="max-h-80 overflow-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/50 sticky top-0">
                          <tr className="text-left">
                            <th className="p-2">#</th>
                            <th className="p-2">Manning n</th>
                            <th className="p-2">% Imperv</th>
                            <th className="p-2">Rain ×</th>
                            <th className="p-2">Peak flow (cfs)</th>
                            <th className="p-2">Cont. err %</th>
                          </tr>
                        </thead>
                        <tbody className="tabular-nums">
                          {ensemble.map((r, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="p-2">{i + 1}</td>
                              <td className="p-2">{r.manningN.toFixed(4)}</td>
                              <td className="p-2">{r.pctImperv.toFixed(0)}</td>
                              <td className="p-2">{r.rainfallMultiplier.toFixed(2)}</td>
                              <td className="p-2">{r.peakFlow?.toFixed(2) ?? "—"}</td>
                              <td className="p-2">{r.continuityErr?.toFixed(2) ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="report">
                <Card className="p-0 overflow-hidden">
                  <pre className="p-4 text-xs overflow-auto max-h-[600px] font-mono whitespace-pre">
                    {result?.rpt || "No report yet. Run a simulation."}
                  </pre>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Card className="p-6 space-y-3 bg-muted/30">
          <h2 className="text-lg font-semibold">How this works</h2>
          <p className="text-sm text-muted-foreground">
            The EPA SWMM 5.2.4 C source is compiled to WebAssembly (≈450 KB) via Emscripten and
            run inside a Web Worker. Each simulation writes an INP file to an in-memory
            filesystem, calls <code>swmm_run</code>, and parses the generated report. No server.
            No data leaves your browser.
          </p>
          <p className="text-sm text-muted-foreground">
            This is an experimentation lab, not a production tool. The tutorial model is
            intentionally tiny so runs complete in well under a second and uncertainty sweeps
            stay interactive.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value, sub, warn }: { label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <Card className={`p-3 ${warn ? "border-amber-500/50 bg-amber-500/5" : ""}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
    </Card>
  );
}
