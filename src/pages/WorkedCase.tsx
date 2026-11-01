import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle2, Download, Eye, Loader2, Lock, Play, Route, Unlock, XCircle } from "lucide-react";
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { runSwmm } from "@/lib/swmm/runner";
import { parseSwmmOut } from "@/lib/swmm/outParser";
import {
  allPass, auditSeries, bandCoverage, buildCaseInp, C3_CAPACITY_CFS, EVENTS, fitMetrics, GAUGED_LINK, makeObserved, OBSERVED_EVENTS,
  PARAM_RANGES, passes, quantile, rainDepthIn, reviewChecklist, runoffRatio, sampleCaseEnsemble, START_PARAMS, TARGETS, TRUTH, TRUTH_CONDUIT_N,
  type CaseParams, type CaseSample, type EventKey, type FitMetrics,
} from "@/lib/workedCase";
import { buildReviewZip, type CalTrial } from "@/lib/workedCasePackage";

type ObsKey = "A" | "B" | "C";
interface FlowRun { flow: number[]; times: number[]; contErr: number }

async function runFlow(p: CaseParams, key: EventKey, opts?: { conduitN?: number; rainFactor?: number }): Promise<FlowRun> {
  const r = await runSwmm(buildCaseInp(p, EVENTS[key], opts));
  if (!r.ok || !r.out) throw new Error(r.errMsg || r.error || `SWMM returned code ${r.rc}`);
  const s = parseSwmmOut(r.out);
  const li = s.links.indexOf(GAUGED_LINK);
  if (!s.ok || li < 0) throw new Error("Could not read SWMM results");
  return {
    flow: Array.from(s.linkFlow[li]),
    times: Array.from(s.times, (t) => t / 3600),
    contErr: Math.max(Math.abs(r.massBal.runoffErr) || 0, Math.abs(r.massBal.flowErr) || 0),
  };
}

const fmt = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "–");
const ENSEMBLE_SIZE = 40;

function StepHeader({ n, title, done, locked, children }: { n: number; title: string; done?: boolean; locked?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
          {done ? <CheckCircle2 className="h-5 w-5" /> : n}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {locked ? <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> {locked}</Badge> : children}
    </div>
  );
}

function MetricsTable({ rows }: { rows: { name: string; m: FitMetrics }[] }) {
  const cell = (ok: boolean, text: string) => <td className={ok ? "text-foreground" : "text-destructive font-semibold"}>{text}</td>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground"><th className="py-1">Event</th><th>NSE (≥{TARGETS.nse})</th><th>Peak error (±{TARGETS.peakErrPct}%)</th><th>Volume error (±{TARGETS.volErrPct}%)</th><th>Peak timing (±{TARGETS.timingMin} min)</th></tr></thead>
        <tbody>
          {rows.map(({ name, m }) => {
            const p = passes(m);
            return (
              <tr key={name} className="border-t">
                <td className="py-1 font-medium">{name}</td>
                {cell(p.nse, fmt(m.nse))}
                {cell(p.peak, `${fmt(m.peakErrPct, 1)}%`)}
                {cell(p.volume, `${fmt(m.volErrPct, 1)}%`)}
                {cell(p.timing, `${m.timingMin} min`)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FlowChart({ times, obs, sim, exclude, band, capacity, height = 220 }: {
  times: number[]; obs?: number[]; sim?: number[]; exclude?: Set<number>; band?: { lo: number[]; mid: number[]; hi: number[] }; capacity?: boolean; height?: number;
}) {
  const data = times.map((t, i) => ({
    t: +t.toFixed(2),
    obs: obs && !Number.isNaN(obs[i]) && !exclude?.has(i) ? obs[i] : null,
    flagged: obs && exclude?.has(i) && !Number.isNaN(obs[i]) ? obs[i] : null,
    sim: sim ? +sim[i].toFixed(2) : null,
    band: band ? [+band.lo[i].toFixed(2), +band.hi[i].toFixed(2)] : null,
    mid: band ? +band.mid[i].toFixed(2) : null,
  }));
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="t" type="number" domain={[0, "dataMax"]} unit=" h" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="" width={40} />
          <Tooltip formatter={(v: number | number[]) => (Array.isArray(v) ? `${v[0]}–${v[1]} cfs` : `${v} cfs`)} labelFormatter={(l) => `${l} h`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {band && <Area dataKey="band" name="5–95% band" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.2} isAnimationActive={false} />}
          {band && <Line dataKey="mid" name="Median" stroke="hsl(var(--primary))" strokeDasharray="4 3" dot={false} isAnimationActive={false} />}
          {sim && <Line dataKey="sim" name="Model" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />}
          {obs && <Line dataKey="obs" name="Observed (made up)" stroke="none" dot={{ r: 2, fill: "hsl(var(--foreground))" }} isAnimationActive={false} />}
          {obs && exclude && exclude.size > 0 && <Line dataKey="flagged" name="Excluded" stroke="none" dot={{ r: 4, fill: "hsl(var(--destructive))" }} isAnimationActive={false} />}
          {capacity && <ReferenceLine y={C3_CAPACITY_CFS} stroke="hsl(var(--destructive))" strokeDasharray="6 3" label={{ value: "C3 full-flow capacity", fontSize: 11, fill: "hsl(var(--destructive))", position: "insideTopRight" }} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function WorkedCase() {
  // Step 1: synthetic observations
  const [times, setTimes] = useState<number[]>([]);
  const [observed, setObserved] = useState<Record<ObsKey, number[]> | null>(null);
  const [truthDesignPeak, setTruthDesignPeak] = useState(NaN);
  const [loadError, setLoadError] = useState("");
  const [excluded, setExcluded] = useState<Record<ObsKey, Set<number>>>({ A: new Set(), B: new Set(), C: new Set() });
  const [auditConfirmed, setAuditConfirmed] = useState(false);
  // Step 2: calibration
  const [params, setParams] = useState<CaseParams>(START_PARAMS);
  const [trials, setTrials] = useState<CalTrial[]>([]);
  const [calSims, setCalSims] = useState<{ A: number[]; B: number[] } | null>(null);
  const [busy, setBusy] = useState<string>("");
  // Step 3: validation
  const [locked, setLocked] = useState<CaseParams | null>(null);
  const [validation, setValidation] = useState<{ sim: number[]; m: FitMetrics } | null>(null);
  const [recalibrated, setRecalibrated] = useState(false);
  // Step 4: uncertainty
  const [seed, setSeed] = useState(2005);
  const [ensemble, setEnsemble] = useState<{
    samples: CaseSample[]; designPeaks: number[]; designDet: number; designDetFlow: number[];
    design: { lo: number[]; mid: number[]; hi: number[] }; val: { lo: number[]; mid: number[]; hi: number[] }; coverage: number; contErr: number; progress: number;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [maxCont, setMaxCont] = useState(NaN);
  // Step 5
  const [packaged, setPackaged] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const out: Partial<Record<ObsKey, number[]>> = {};
        let t: number[] = [];
        for (const k of OBSERVED_EVENTS) {
          const r = await runFlow(TRUTH, k, { conduitN: TRUTH_CONDUIT_N });
          out[k as ObsKey] = makeObserved(r.flow, k);
          t = r.times;
        }
        const d = await runFlow(TRUTH, "D", { conduitN: TRUTH_CONDUIT_N });
        if (cancelled) return;
        setTimes(t);
        setObserved(out as Record<ObsKey, number[]>);
        setTruthDesignPeak(Math.max(...d.flow));
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const flags = useMemo(() => {
    if (!observed) return null;
    return { A: auditSeries(observed.A), B: auditSeries(observed.B), C: auditSeries(observed.C) };
  }, [observed]);
  const totalFlags = flags ? flags.A.length + flags.B.length + flags.C.length : 0;
  const excludedCount = excluded.A.size + excluded.B.size + excluded.C.size;

  const toggleExclude = (k: ObsKey, i: number) =>
    setExcluded((ex) => { const s = new Set(ex[k]); s.has(i) ? s.delete(i) : s.add(i); return { ...ex, [k]: s }; });

  const noteCont = (c: number) => setMaxCont((m) => (Number.isFinite(m) ? Math.max(m, c) : c));

  const runCalibration = async () => {
    if (!observed) return;
    setBusy("cal");
    try {
      const [a, b] = [await runFlow(params, "A"), await runFlow(params, "B")];
      const contErr = Math.max(a.contErr, b.contErr);
      noteCont(contErr);
      setCalSims({ A: a.flow, B: b.flow });
      setTrials((t) => [...t, {
        trial: t.length + 1, at: new Date().toISOString(), params: { ...params },
        A: fitMetrics(observed.A, a.flow, excluded.A), B: fitMetrics(observed.B, b.flow, excluded.B), contErr, afterValidation: recalibrated,
      }]);
    } catch (e) { setLoadError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(""); }
  };

  const lastTrial = trials[trials.length - 1];
  const lastMatchesParams = !!lastTrial && (Object.keys(params) as (keyof CaseParams)[]).every((k) => lastTrial.params[k] === params[k]);

  const runValidation = async () => {
    if (!observed || !lastTrial) return;
    setBusy("val");
    try {
      const p = { ...lastTrial.params };
      setLocked(p);
      const c = await runFlow(p, "C");
      noteCont(c.contErr);
      setValidation({ sim: c.flow, m: fitMetrics(observed.C, c.flow, excluded.C) });
      setEnsemble(null); setPackaged(false); setRevealed(false);
    } catch (e) { setLoadError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(""); }
  };

  const unlock = () => {
    if (!window.confirm("Changing parameters after seeing the validation result means Event C is no longer an independent test. This will be disclosed in the review package. Continue?")) return;
    setRecalibrated(true); setLocked(null); setValidation(null); setEnsemble(null); setPackaged(false);
  };

  const runEnsemble = async () => {
    if (!locked || !observed) return;
    setBusy("ens"); setProgress(0);
    try {
      const samples = sampleCaseEnsemble(locked, seed, ENSEMBLE_SIZE);
      const det = await runFlow(locked, "D");
      const designRuns: number[][] = [], valRuns: number[][] = [];
      let contErr = det.contErr;
      for (const s of samples) {
        const d = await runFlow(s, "D", { rainFactor: s.rainFactor, conduitN: s.conduitN });
        const v = await runFlow(s, "C", { rainFactor: s.rainFactor, conduitN: s.conduitN });
        designRuns.push(d.flow); valRuns.push(v.flow);
        contErr = Math.max(contErr, d.contErr, v.contErr);
        setProgress(designRuns.length);
      }
      noteCont(contErr);
      const bands = (runs: number[][]) => {
        const n = runs[0].length;
        const lo: number[] = [], mid: number[] = [], hi: number[] = [];
        for (let i = 0; i < n; i++) {
          const col = runs.map((r) => r[i]);
          lo.push(quantile(col, 0.05)); mid.push(quantile(col, 0.5)); hi.push(quantile(col, 0.95));
        }
        return { lo, mid, hi };
      };
      const val = bands(valRuns);
      setEnsemble({
        samples, designPeaks: designRuns.map((r) => Math.max(...r)), designDet: Math.max(...det.flow), designDetFlow: det.flow,
        design: bands(designRuns), val, coverage: bandCoverage(observed.C, val.lo, val.hi, excluded.C), contErr, progress: samples.length,
      });
      setPackaged(false);
    } catch (e) { setLoadError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(""); }
  };

  const peakStats = useMemo(() => {
    if (!ensemble) return null;
    const p = ensemble.designPeaks;
    return { p5: quantile(p, 0.05), p50: quantile(p, 0.5), p95: quantile(p, 0.95), exceed: p.filter((v) => v > C3_CAPACITY_CFS).length / p.length };
  }, [ensemble]);

  const checklist = reviewChecklist({
    auditReviewed: auditConfirmed, excludedFlags: excludedCount, totalFlags,
    calibrationTrials: trials.length, validated: !!validation, recalibratedAfterValidation: recalibrated,
    validationPassed: validation ? allPass(validation.m) : false, maxContinuityErrPct: maxCont,
    ensembleSize: ensemble?.samples.length ?? 0, coverage: ensemble?.coverage ?? NaN,
  });

  const downloadPackage = () => {
    if (!observed || !locked || !validation || !ensemble || !peakStats) return;
    const zip = buildReviewZip({
      times, observed,
      excluded: { A: [...excluded.A].sort((a, b) => a - b), B: [...excluded.B].sort((a, b) => a - b), C: [...excluded.C].sort((a, b) => a - b) },
      trials, final: locked, validation: validation.m, recalibratedAfterValidation: recalibrated, seed,
      samples: ensemble.samples, designPeaks: ensemble.designPeaks, designDeterministicPeak: ensemble.designDet,
      p5: peakStats.p5, p50: peakStats.p50, p95: peakStats.p95, exceedProb: peakStats.exceed, coverage: ensemble.coverage,
      checklist, createdAt: new Date().toISOString(),
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([zip as unknown as BlobPart], { type: "application/zip" }));
    a.download = "fernhollow-review-package.zip";
    a.click();
    URL.revokeObjectURL(a.href);
    setPackaged(true);
  };

  const editingLocked = !!locked;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Worked Case: Data to Review Package | Rules for Responsible Modeling</title>
        <meta name="description" content="A full made-up worked case: audit observed data, calibrate, validate on a held-out event, quantify uncertainty with the real SWMM engine, and download a review package." />
      </Helmet>
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <Route className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Worked Case: Fernhollow Brook</h1>
          </div>
          <div className="rounded-lg border-l-4 border-accent bg-accent/10 p-4 text-sm text-foreground">
            <strong>This is a made-up example.</strong> Fernhollow Brook, gauge FH-1 and every number on this page are fictional.
            The "observed" flows were made by running a hidden set of parameters and adding measurement noise, a logger gap and a sensor spike.
            Targets marked "illustrative" are choices for this exercise, not a published standard.
          </div>
          <p className="text-muted-foreground">
            <strong className="text-foreground">The question:</strong> how big is the peak flow in pipe C3 during the made-up 10-year, 3-hour design storm
            ({fmt(rainDepthIn(EVENTS.D), 1)} in), and how likely is it to exceed the pipe's full-flow capacity of {fmt(C3_CAPACITY_CFS, 0)} cfs?
            Work through five steps. Every run uses the real SWMM 5.2 engine, as in the <Link to="/playground" className="text-primary underline">Playground</Link>.
          </p>
          <ol className="flex flex-wrap gap-2 text-xs">
            {["Audit data", "Calibrate", "Validate", "Uncertainty", "Review package"].map((s, i) => {
              const done = [auditConfirmed, trials.length > 0 && !!locked, !!validation, !!ensemble, packaged][i];
              return <li key={s}><Badge variant={done ? "default" : "outline"}>{i + 1}. {s}</Badge></li>;
            })}
          </ol>
        </header>

        {loadError && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">SWMM error: {loadError}</div>}

        {/* STEP 1 */}
        <Card className="p-6">
          <StepHeader n={1} title="Observed data and audit" done={auditConfirmed} />
          {!observed || !flags ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Generating the made-up gauge records…</p>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Three storms were recorded at gauge FH-1 (5-minute flow). Events A and B are for calibration; Event C is held back for validation and is not used to tune anything.
                Before calibrating, check the records: the automatic audit flags missing values and spikes much larger than both neighbours.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {OBSERVED_EVENTS.map((k) => {
                  const key = k as ObsKey;
                  const ratio = runoffRatio(observed[key], rainDepthIn(EVENTS[k]));
                  return (
                    <div key={k} className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{EVENTS[k].label}</p>
                        <Badge variant={EVENTS[k].role === "validation" ? "secondary" : "outline"}>{EVENTS[k].role === "validation" ? "held out" : "calibration"}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{EVENTS[k].date} · {fmt(rainDepthIn(EVENTS[k]))} in rain · runoff ratio {fmt(ratio)}</p>
                      <FlowChart times={times} obs={observed[key]} exclude={excluded[key]} height={150} />
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground text-sm">Audit flags ({totalFlags})</p>
                {OBSERVED_EVENTS.flatMap((k) => flags[k as ObsKey].map((f) => ({ k: k as ObsKey, f }))).reduce<{ k: ObsKey; f: typeof flags.A[number]; first: number; count: number }[]>((acc, { k, f }) => {
                  // group consecutive gap records into one row
                  const last = acc[acc.length - 1];
                  if (last && last.k === k && f.kind === "gap" && last.f.kind === "gap" && f.index === last.first + last.count) { last.count++; return acc; }
                  acc.push({ k, f, first: f.index, count: 1 }); return acc;
                }, []).map(({ k, f, first, count }) => (
                  <div key={`${k}-${first}`} className="flex flex-wrap items-center gap-3 rounded-md bg-muted/50 p-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
                    <span className="font-medium">{EVENTS[k].label}</span>
                    {f.kind === "gap" ? (
                      <span>{count} missing records from {fmt(times[first])} h. Missing values are never used.</span>
                    ) : (
                      <>
                        <span>Spike at {fmt(times[f.index])} h: {f.note}.</span>
                        <label className="flex items-center gap-2 ml-auto">
                          <Checkbox checked={excluded[k].has(f.index)} disabled={trials.length > 0} onCheckedChange={() => toggleExclude(k, f.index)} aria-label={`Exclude spike in ${EVENTS[k].label}`} />
                          Exclude as a sensor fault
                        </label>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => setAuditConfirmed(true)} disabled={auditConfirmed}>
                  <CheckCircle2 className="h-4 w-4 mr-1" /> {auditConfirmed ? "Audit confirmed" : "Confirm audit decisions"}
                </Button>
                <span className="text-xs text-muted-foreground">Decisions are frozen once calibration starts, and recorded in the review package.</span>
              </div>
            </div>
          )}
        </Card>

        {/* STEP 2 */}
        <Card className="p-6">
          <StepHeader n={2} title="Calibrate on Events A and B" done={trials.length > 0 && !!locked} locked={!auditConfirmed ? "Confirm the audit first" : undefined}>
            {editingLocked && <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3" /> Parameters locked</Badge>}
          </StepHeader>
          {auditConfirmed && observed && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                The first guesses come from (made-up) land-use maps. Change one parameter at a time, run, and compare. Every run is logged — a reviewer will want to see how you got there, not only where you ended up.
              </p>
              <div className="grid gap-5 md:grid-cols-3">
                {(Object.keys(PARAM_RANGES) as (keyof CaseParams)[]).map((k) => {
                  const r = PARAM_RANGES[k];
                  return (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between text-sm"><Label>{r.label}</Label><span className="font-mono">{fmt(params[k], k === "pctImperv" ? 0 : 2)} {r.unit}</span></div>
                      <Slider aria-label={r.label} min={r.min} max={r.max} step={r.step} value={[params[k]]} disabled={editingLocked}
                        onValueChange={([v]) => setParams((p) => ({ ...p, [k]: v }))} />
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={runCalibration} disabled={!!busy || editingLocked}>
                  {busy === "cal" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Play className="h-4 w-4 mr-1" />} Run Events A and B
                </Button>
                <Button variant="outline" onClick={() => setParams(START_PARAMS)} disabled={editingLocked}>Back to first guess</Button>
              </div>
              {calSims && lastTrial && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {(["A", "B"] as const).map((k) => (
                      <div key={k}><p className="text-sm font-medium mb-1">{EVENTS[k].label}</p><FlowChart times={times} obs={observed[k]} sim={calSims[k]} exclude={excluded[k]} /></div>
                    ))}
                  </div>
                  <MetricsTable rows={[{ name: `A (trial ${lastTrial.trial})`, m: lastTrial.A }, { name: `B (trial ${lastTrial.trial})`, m: lastTrial.B }]} />
                  <p className="text-xs text-muted-foreground">Red values miss the illustrative targets. A good fit on both events at once matters more than a perfect fit on one.</p>
                </>
              )}
              {trials.length > 0 && (
                <details>
                  <summary className="cursor-pointer text-sm font-medium">Calibration log ({trials.length} trials)</summary>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-xs">
                      <thead><tr className="text-left text-muted-foreground"><th>#</th><th>Imperv %</th><th>Width ×</th><th>Infil in/hr</th><th>NSE A</th><th>NSE B</th><th>Peak err A</th><th>Peak err B</th></tr></thead>
                      <tbody>{trials.map((t) => (
                        <tr key={t.trial} className="border-t"><td>{t.trial}{t.afterValidation ? "*" : ""}</td><td>{t.params.pctImperv}</td><td>{t.params.widthFactor}</td><td>{t.params.maxInfil}</td>
                          <td>{fmt(t.A.nse)}</td><td>{fmt(t.B.nse)}</td><td>{fmt(t.A.peakErrPct, 1)}%</td><td>{fmt(t.B.peakErrPct, 1)}%</td></tr>
                      ))}</tbody>
                    </table>
                    {trials.some((t) => t.afterValidation) && <p className="text-xs text-muted-foreground mt-1">* run after the validation result had been seen</p>}
                  </div>
                </details>
              )}
            </div>
          )}
        </Card>

        {/* STEP 3 */}
        <Card className="p-6">
          <StepHeader n={3} title="Validate on held-out Event C" done={!!validation} locked={trials.length === 0 ? "Run a calibration first" : undefined} />
          {trials.length > 0 && observed && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Locking freezes the parameters from your latest logged trial, then runs Event C once. If you change anything after seeing this result, Event C stops being an independent test — the package will say so.
              </p>
              {!validation ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button onClick={runValidation} disabled={!!busy}>
                    {busy === "val" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Lock className="h-4 w-4 mr-1" />} Lock trial {lastTrial.trial} and validate
                  </Button>
                  {!lastMatchesParams && <span className="text-xs text-accent-foreground bg-accent/20 rounded px-2 py-1">The sliders have moved since trial {lastTrial.trial}; run them first if you want to lock those values.</span>}
                </div>
              ) : (
                <>
                  <FlowChart times={times} obs={observed.C} sim={validation.sim} exclude={excluded.C} />
                  <MetricsTable rows={[{ name: "C (validation)", m: validation.m }]} />
                  <div className="flex flex-wrap items-center gap-3">
                    {allPass(validation.m)
                      ? <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" /> Meets every illustrative target</Badge>
                      : <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Misses at least one target — report it honestly</Badge>}
                    <Button variant="ghost" size="sm" onClick={unlock}><Unlock className="h-4 w-4 mr-1" /> Unlock and re-calibrate</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        {/* STEP 4 */}
        <Card className="p-6">
          <StepHeader n={4} title="Uncertainty" done={!!ensemble} locked={!validation ? "Validate first" : undefined} />
          {validation && locked && observed && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A calibrated model is one plausible answer, not the answer. This step runs {ENSEMBLE_SIZE} versions of the model with imperviousness ±15%, width ×0.7–1.4 and infiltration ±30% around your values, plus ±10% rainfall for gauge error. Pipe roughness (0.011–0.018) is varied too: the observed storms never filled pipe C3, so the data could not pin it down, yet it matters once the design storm surcharges the pipe.
                The same seed always gives the same runs.
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <Label htmlFor="wc-seed" className="text-xs">Master seed</Label>
                  <Input id="wc-seed" type="number" className="h-9 w-32" value={seed} onChange={(e) => setSeed(Math.max(0, Math.floor(+e.target.value || 0)))} />
                </div>
                <Button onClick={runEnsemble} disabled={!!busy}>
                  {busy === "ens" ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Run {progress} of {ENSEMBLE_SIZE}</> : <><Play className="h-4 w-4 mr-1" /> Run {ENSEMBLE_SIZE} simulations</>}
                </Button>
              </div>
              {ensemble && peakStats && (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Calibrated design peak</p><p className="text-2xl font-bold">{fmt(ensemble.designDet, 1)} cfs</p></div>
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">5–95% range</p><p className="text-2xl font-bold">{fmt(peakStats.p5, 0)}–{fmt(peakStats.p95, 0)} cfs</p></div>
                    <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">Runs above capacity ({fmt(C3_CAPACITY_CFS, 0)} cfs)</p><p className="text-2xl font-bold">{Math.round(peakStats.exceed * 100)}%</p></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div><p className="text-sm font-medium mb-1">Design storm, pipe C3</p><FlowChart times={times} sim={ensemble.designDetFlow} band={ensemble.design} capacity /></div>
                    <div><p className="text-sm font-medium mb-1">Check: Event C observations vs band</p><FlowChart times={times} obs={observed.C} exclude={excluded.C} band={ensemble.val} /></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(ensemble.coverage * 100)}% of Event C observations fall inside the 5–95% band. If far fewer did, the band would be too narrow to trust.
                  </p>
                </>
              )}
            </div>
          )}
        </Card>

        {/* STEP 5 */}
        <Card className="p-6">
          <StepHeader n={5} title="Review package" done={packaged} />
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">What a reviewer would check. This list updates as you work; warnings don't block the package, but they are written into it.</p>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-sm">
                  {c.status === "pass" ? <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" /> : c.status === "warn" ? <AlertTriangle className="h-4 w-4 mt-0.5 text-accent shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />}
                  <span><span className="font-medium text-foreground">{c.label}</span> <span className="text-muted-foreground">— {c.detail}</span></span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <Button onClick={downloadPackage} disabled={!ensemble}>
                <Download className="h-4 w-4 mr-1" /> Download review package (.zip)
              </Button>
              <Button variant="outline" onClick={() => setRevealed(true)} disabled={!packaged || revealed}>
                <Eye className="h-4 w-4 mr-1" /> Reveal the hidden answer
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The zip holds a written report, the calibrated model files, the made-up observations, the calibration log, every ensemble run with its seed, and the reviewer checklist.
            </p>
            {revealed && locked && peakStats && (
              <div className="rounded-md border-l-4 border-primary bg-primary/5 p-4 text-sm space-y-2">
                <p className="font-semibold text-foreground">The hidden answer (only knowable because the data are made up)</p>
                <table className="text-sm">
                  <thead><tr className="text-left text-muted-foreground"><th className="pr-6">Parameter</th><th className="pr-6">Hidden value</th><th>Yours</th></tr></thead>
                  <tbody>
                    {(Object.keys(PARAM_RANGES) as (keyof CaseParams)[]).map((k) => (
                      <tr key={k}><td className="pr-6">{PARAM_RANGES[k].label}</td><td className="pr-6">{fmt(TRUTH[k], k === "pctImperv" ? 0 : 2)} {PARAM_RANGES[k].unit}</td><td>{fmt(locked[k], k === "pctImperv" ? 0 : 2)} {PARAM_RANGES[k].unit}</td></tr>
                    ))}
                    <tr><td className="pr-6">Pipe roughness</td><td className="pr-6">0.016</td><td>0.013 (fixed)</td></tr>
                  </tbody>
                </table>
                <p>
                  The hidden model's design-storm peak is <strong>{fmt(truthDesignPeak, 1)} cfs</strong>.
                  Your 5–95% range was {fmt(peakStats.p5, 1)}–{fmt(peakStats.p95, 1)} cfs, so it {truthDesignPeak >= peakStats.p5 && truthDesignPeak <= peakStats.p95 ? "contains" : "misses"} the true value.
                </p>
                <p className="text-muted-foreground">With real data there is no answer key. That is why steps 3 and 4 exist.</p>
              </div>
            )}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
