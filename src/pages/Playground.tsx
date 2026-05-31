import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Download, AlertTriangle, FlaskConical } from "lucide-react";
import type { TooltipProps } from "recharts";
import {
  ResponsiveContainer, ComposedChart, LineChart, Line, Area, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid,
} from "recharts";
import {
  TUTORIAL_INP,
  DEFAULT_PARAMS,
  applyParams,
  parseReport,
  type PlaygroundParams,
  type ReportSummary,
} from "@/lib/swmm/tutorialModel";
import { runSwmm, type SwmmRunResult } from "@/lib/swmm/runner";
import { parseSwmmOut, percentileBands, integrateFlow, type SwmmOutSeries } from "@/lib/swmm/outParser";

interface EnsembleRow {
  manningN: number;
  pctImperv: number;
  rainfallMultiplier: number;
  peakFlow?: number;
  peakDepth?: number;
  totalFloodVol?: number;
  continuityErr?: number;
  series?: SwmmOutSeries;
  ok: boolean;
}

/** Custom tooltip for hydrograph LineCharts — shows exact values with units. */
function HydroTooltip({ active, payload, label, unit }: TooltipProps<number, string> & { unit: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs">
      <div className="font-semibold text-foreground mb-1.5">{fmtHours(Number(label))}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium text-foreground tabular-nums">
              {typeof entry.value === "number" ? entry.value.toFixed(3) : entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Custom tooltip for ensemble uncertainty bands — shows actual percentile values. */
function EnsembleTooltip({ active, payload, label, flowUnits, isDepth }: TooltipProps<number, string> & { flowUnits: string; isDepth?: boolean }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload as Record<string, number> | undefined;
  if (!row) return null;
  const unit = isDepth ? "ft" : flowUnits;
  const prefix = isDepth ? "depth" : "flow";
  const vals = {
    min: row[`${prefix}_min`],
    p10: row[`${prefix}_p10`],
    p50: row[`${prefix}_p50`],
    p90: row[`${prefix}_p90`],
    max: row[`${prefix}_max`],
  };
  const bandColor = isDepth ? "hsl(var(--secondary))" : "hsl(var(--primary))";
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs">
      <div className="font-semibold text-foreground mb-1.5">{fmtHours(Number(label))}</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bandColor, opacity: 0.35 }} />
          <span className="text-muted-foreground">p10–p90:</span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {vals.p10?.toFixed(3)} … {vals.p90?.toFixed(3)} {unit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bandColor, opacity: 0.15 }} />
          <span className="text-muted-foreground">min–max:</span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {vals.min?.toFixed(3)} … {vals.max?.toFixed(3)} {unit}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: bandColor }} />
          <span className="text-muted-foreground">median:</span>
          <span className="font-mono font-medium text-foreground tabular-nums">
            {vals.p50?.toFixed(3)} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

const PRESETS: Array<{ label: string; description: string; params: PlaygroundParams }> = [
  { label: "Baseline", description: "Calibrated reference run.", params: { manningN: 0.013, pctImperv: 60, rainfallMultiplier: 1.0 } },
  { label: "Double the rain", description: "Climate shock: 2× design storm intensity.", params: { manningN: 0.013, pctImperv: 60, rainfallMultiplier: 2.0 } },
  { label: "Pave it all", description: "100% impervious — worst-case urbanization.", params: { manningN: 0.013, pctImperv: 100, rainfallMultiplier: 1.0 } },
  { label: "Absurdly rough pipes", description: "Manning n = 0.10 (rule violation: implausible parameter).", params: { manningN: 0.10, pctImperv: 60, rainfallMultiplier: 1.0 } },
  { label: "Glass-smooth pipes", description: "Manning n = 0.008 — supercritical instability risk.", params: { manningN: 0.008, pctImperv: 60, rainfallMultiplier: 1.0 } },
];

function fmtHours(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}:${m.toString().padStart(2, "0")}`;
}

export default function Playground() {
  const [params, setParams] = useState<PlaygroundParams>(DEFAULT_PARAMS);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SwmmRunResult | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [series, setSeries] = useState<SwmmOutSeries | null>(null);
  const [ensemble, setEnsemble] = useState<EnsembleRow[]>([]);
  const [ensembleRunning, setEnsembleRunning] = useState(false);

  const runOnce = useCallback(async (p: PlaygroundParams) => {
    setRunning(true);
    const inp = applyParams(TUTORIAL_INP, p);
    const r = await runSwmm(inp);
    setResult(r);
    setSummary(r.rpt ? parseReport(r.rpt) : null);
    setSeries(r.out ? parseSwmmOut(r.out) : null);
    setRunning(false);
    return r;
  }, []);

  const runEnsemble = useCallback(async () => {
    setEnsembleRunning(true);
    setEnsemble([]);
    const N = 20;
    const rows: EnsembleRow[] = [];
    for (let i = 0; i < N; i++) {
      const manningN = 0.011 + Math.random() * 0.014;
      const rainfallMultiplier = 0.7 + Math.random() * 0.8;
      const pctImperv = Math.max(0, Math.min(100, 60 + (Math.random() - 0.5) * 30));
      const inp = applyParams(TUTORIAL_INP, { manningN, pctImperv, rainfallMultiplier });
      const r = await runSwmm(inp);
      const s = r.rpt ? parseReport(r.rpt) : {};
      const out = r.out ? parseSwmmOut(r.out) : undefined;
      const dt = out?.reportStep ?? 0;
      const floodVol = out && dt > 0
        ? out.nodeFlooding.reduce((acc, ts) => acc + integrateFlow(ts, dt), 0)
        : undefined;
      rows.push({
        manningN, pctImperv, rainfallMultiplier,
        peakFlow: s.peakLinkFlow,
        peakDepth: s.peakNodeDepth,
        totalFloodVol: floodVol,
        continuityErr: s.continuityErrorFlow,
        series: out,
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
    a.href = url; a.download = "swmm-report.rpt"; a.click();
    URL.revokeObjectURL(url);
  };

  // Single-run hydrograph data
  const hydrographData = useMemo(() => {
    if (!series || series.numPeriods === 0) return [];
    return Array.from({ length: series.numPeriods }, (_, i) => {
      const row: Record<string, number | string> = { t: series.times[i] };
      series.links.forEach((name, li) => { row[`flow_${name}`] = series.linkFlow[li][i]; });
      series.nodes.forEach((name, ni) => { row[`depth_${name}`] = series.nodeDepth[ni][i]; });
      return row;
    });
  }, [series]);

  // Ensemble bands
  const ensembleSeries = useMemo(() => ensemble.filter((r) => r.series).map((r) => r.series!), [ensemble]);

  const bandData = useMemo(() => {
    if (ensembleSeries.length < 2) return null;
    const ref = ensembleSeries[0];
    // Build per-link flow bands (use first link only for primary chart)
    if (ref.links.length === 0) return null;
    const allFlowsFirstLink = ensembleSeries.map((s) => s.linkFlow[0]);
    const [pMin, p10, p50, p90, pMax] = percentileBands(allFlowsFirstLink, [0, 0.1, 0.5, 0.9, 1]);
    const allDepthsFirstNode = ensembleSeries.map((s) => s.nodeDepth[0]);
    const [dMin, d10, d50, d90, dMax] = percentileBands(allDepthsFirstNode, [0, 0.1, 0.5, 0.9, 1]);
    const rows = Array.from(ref.times).map((t, i) => ({
      t,
      flow_min: pMin[i], flow_p10: p10[i], flow_p50: p50[i], flow_p90: p90[i], flow_max: pMax[i],
      flow_band_lo: pMin[i], flow_band_hi: pMax[i] - pMin[i],
      flow_iqr_lo: p10[i], flow_iqr_hi: p90[i] - p10[i],
      depth_min: dMin[i], depth_p50: d50[i], depth_max: dMax[i],
      depth_band_lo: dMin[i], depth_band_hi: dMax[i] - dMin[i],
      depth_iqr_lo: d10[i], depth_iqr_hi: d90[i] - d10[i],
    }));
    return { rows, linkName: ref.links[0], nodeName: ref.nodes[0], flowUnits: ref.flowUnits };
  }, [ensembleSeries]);

  // Ensemble scalar distribution stats
  const stats = useMemo(() => {
    const peakFlows = ensemble.map((r) => r.peakFlow).filter((v): v is number => typeof v === "number");
    const peakDepths = ensemble.map((r) => r.peakDepth).filter((v): v is number => typeof v === "number");
    const floods = ensemble.map((r) => r.totalFloodVol).filter((v): v is number => typeof v === "number");
    const q = (arr: number[], p: number) => {
      if (!arr.length) return 0;
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))];
    };
    return {
      peakFlow: { min: q(peakFlows, 0), p50: q(peakFlows, 0.5), max: q(peakFlows, 1) },
      peakDepth: { min: q(peakDepths, 0), p50: q(peakDepths, 0.5), max: q(peakDepths, 1) },
      flood: { min: q(floods, 0), p50: q(floods, 0.5), max: q(floods, 1) },
    };
  }, [ensemble]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SWMM5 Playground — Rules for Responsible Modeling</title>
        <meta name="description" content="Interactive WebAssembly SWMM5 lab with live hydrographs and Monte-Carlo uncertainty bands." />
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
            your browser. Adjust parameters, plot hydrographs, and run Monte-Carlo ensembles
            to see uncertainty bands in real time.
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
                <Slider min={0.008} max={0.25} step={0.001} value={[params.manningN]}
                  onValueChange={([v]) => setParams({ ...params, manningN: v })} />
                <p className="text-xs text-muted-foreground mt-1">Realistic: 0.011–0.025. Extreme values trigger instability.</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">% Impervious</span>
                  <span className="tabular-nums text-muted-foreground">{params.pctImperv.toFixed(0)}%</span>
                </div>
                <Slider min={0} max={100} step={1} value={[params.pctImperv]}
                  onValueChange={([v]) => setParams({ ...params, pctImperv: v })} />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Rainfall multiplier</span>
                  <span className="tabular-nums text-muted-foreground">×{params.rainfallMultiplier.toFixed(2)}</span>
                </div>
                <Slider min={0.1} max={5} step={0.05} value={[params.rainfallMultiplier]}
                  onValueChange={([v]) => setParams({ ...params, rainfallMultiplier: v })} />
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
                  <button key={p.label}
                    onClick={() => { setParams(p.params); runOnce(p.params); }}
                    disabled={running}
                    className="text-left p-2 rounded border border-border hover:bg-muted/50 transition text-sm disabled:opacity-50">
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Tabs defaultValue="hydrographs">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="hydrographs">Hydrographs</TabsTrigger>
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
                      <Stat label="Flow continuity err"
                        value={summary?.continuityErrorFlow !== undefined ? `${summary.continuityErrorFlow.toFixed(2)}%` : "—"}
                        warn={summary?.continuityErrorFlow !== undefined && Math.abs(summary.continuityErrorFlow) > 10} />
                      <Stat label="Peak link flow"
                        value={summary?.peakLinkFlow !== undefined ? `${summary.peakLinkFlow.toFixed(2)} cfs` : "—"}
                        sub={summary?.peakLinkFlowName} />
                      <Stat label="Peak node depth"
                        value={summary?.peakNodeDepth !== undefined ? `${summary.peakNodeDepth.toFixed(2)} ft` : "—"}
                        sub={summary?.peakNodeDepthName} />
                    </div>
                    {summary?.continuityErrorFlow !== undefined && Math.abs(summary.continuityErrorFlow) > 10 && (
                      <Card className="p-4 border-amber-500/40 bg-amber-500/10">
                        <p className="text-sm">
                          <strong>Rule check: Continuity error &gt; 10%.</strong> Volumes are unreliable —
                          reduce the routing time step or revisit your boundary conditions before trusting these results.
                        </p>
                      </Card>
                    )}
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="w-4 h-4 mr-2" /> Download .rpt
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="hydrographs" className="space-y-4">
                {!series && (
                  <Card className="p-10 text-center text-muted-foreground">
                    Run a simulation to see live link-flow and node-depth time series.
                  </Card>
                )}
                {series && (
                  <>
                    <Card className="p-4">
                      <div className="text-sm font-semibold mb-2">
                        Link flow ({series.flowUnits}) — {series.links.join(", ") || "no links"}
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hydrographData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="t" tickFormatter={fmtHours} stroke="hsl(var(--muted-foreground))"
                              label={{ value: "time (h:mm)", position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))" }} />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip content={<HydroTooltip unit={series.flowUnits} />} />
                            <Legend
                              formatter={(value: string) => (
                                <span className="text-xs text-muted-foreground">{value} ({series.flowUnits})</span>
                              )}
                            />
                            {series.links.map((name, i) => (
                              <Line key={name} type="monotone" dataKey={`flow_${name}`} name={name}
                                stroke={`hsl(${(i * 67) % 360} 70% 55%)`} dot={false} strokeWidth={2} isAnimationActive={false} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-sm font-semibold mb-2">
                        Node depth (ft) — {series.nodes.join(", ") || "no nodes"}
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hydrographData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="t" tickFormatter={fmtHours} stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip content={<HydroTooltip unit="ft" />} />
                            <Legend
                              formatter={(value: string) => (
                                <span className="text-xs text-muted-foreground">{value} (ft)</span>
                              )}
                            />
                            {series.nodes.map((name, i) => (
                              <Line key={name} type="monotone" dataKey={`depth_${name}`} name={name}
                                stroke={`hsl(${(i * 137) % 360} 60% 55%)`} dot={false} strokeWidth={2} isAnimationActive={false} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="ensemble" className="space-y-4">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Monte-Carlo uncertainty sweep</div>
                      <div className="text-xs text-muted-foreground">
                        20 runs · Manning n ∈ [0.011, 0.025], rainfall ×[0.7, 1.5], imperviousness ±15%
                      </div>
                    </div>
                    <Button onClick={runEnsemble} disabled={ensembleRunning} size="sm">
                      {ensembleRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                      Run ensemble
                    </Button>
                  </div>
                  {ensemble.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Stat label="Peak flow (min · p50 · max)"
                        value={`${stats.peakFlow.min.toFixed(2)} · ${stats.peakFlow.p50.toFixed(2)} · ${stats.peakFlow.max.toFixed(2)}`}
                        sub="cfs" />
                      <Stat label="Peak depth (min · p50 · max)"
                        value={`${stats.peakDepth.min.toFixed(2)} · ${stats.peakDepth.p50.toFixed(2)} · ${stats.peakDepth.max.toFixed(2)}`}
                        sub="ft" />
                      <Stat label="Flood vol (min · p50 · max)"
                        value={`${stats.flood.min.toFixed(1)} · ${stats.flood.p50.toFixed(1)} · ${stats.flood.max.toFixed(1)}`}
                        sub="ft³ (∑ flooding · dt)" />
                    </div>
                  )}
                </Card>

                {bandData && (
                  <>
                    <Card className="p-4">
                      <div className="text-sm font-semibold mb-2">
                        Flow uncertainty bands — link {bandData.linkName} ({bandData.flowUnits})
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Light band: full min–max envelope. Darker band: p10–p90. Line: median (p50).
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={bandData.rows} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="t" tickFormatter={fmtHours} stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip content={<EnsembleTooltip flowUnits={bandData.flowUnits} />} />
                            <Legend />
                            <Area type="monotone" dataKey="flow_band_lo" stackId="env" stroke="none" fill="transparent" legendType="none" name="" />
                            <Area type="monotone" dataKey="flow_band_hi" stackId="env" stroke="none" fill="hsl(var(--primary) / 0.15)" name="min–max envelope" />
                            <Area type="monotone" dataKey="flow_iqr_lo" stackId="iqr" stroke="none" fill="transparent" legendType="none" name="" />
                            <Area type="monotone" dataKey="flow_iqr_hi" stackId="iqr" stroke="none" fill="hsl(var(--primary) / 0.35)" name="p10–p90" />
                            <Line type="monotone" dataKey="flow_p50" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="median" isAnimationActive={false} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="text-sm font-semibold mb-2">
                        Depth uncertainty bands — node {bandData.nodeName} (ft)
                      </div>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={bandData.rows} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="t" tickFormatter={fmtHours} stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip content={<EnsembleTooltip flowUnits={bandData.flowUnits} isDepth />} />
                            <Legend />
                            <Area type="monotone" dataKey="depth_band_lo" stackId="env" stroke="none" fill="transparent" legendType="none" name="" />
                            <Area type="monotone" dataKey="depth_band_hi" stackId="env" stroke="none" fill="hsl(var(--accent) / 0.15)" name="min–max envelope" />
                            <Area type="monotone" dataKey="depth_iqr_lo" stackId="iqr" stroke="none" fill="transparent" legendType="none" name="" />
                            <Area type="monotone" dataKey="depth_iqr_hi" stackId="iqr" stroke="none" fill="hsl(var(--accent) / 0.35)" name="p10–p90" />
                            <Line type="monotone" dataKey="depth_p50" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="median" isAnimationActive={false} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </>
                )}

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
                            <th className="p-2">Peak flow</th>
                            <th className="p-2">Peak depth</th>
                            <th className="p-2">Flood vol</th>
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
                              <td className="p-2">{r.peakDepth?.toFixed(2) ?? "—"}</td>
                              <td className="p-2">{r.totalFloodVol?.toFixed(1) ?? "—"}</td>
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
            filesystem, calls <code>swmm_run</code>, parses the generated <code>.rpt</code> for
            summary metrics, and decodes the binary <code>.out</code> file for full time series.
            No server. No data leaves your browser.
          </p>
          <p className="text-sm text-muted-foreground">
            Uncertainty bands are computed per-timestep across the ensemble: the lighter shaded
            region spans min–max, the darker region spans p10–p90, and the line is the median.
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
