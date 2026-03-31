import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Dices, Download, BookOpen, ArrowLeft, Play, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Simple seeded random
const seededRandom = (seed: number) => {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
};

interface SimResult {
  peakFlow: number;
  volume: number;
  timing: number;
}

export const MonteCarloSpinner = () => {
  const [numSims, setNumSims] = useState(50);
  const [roughnessRange, setRoughnessRange] = useState(30); // ±%
  const [impervRange, setImpervRange] = useState(20);
  const [slopeRange, setSlopeRange] = useState(15);
  const [results, setResults] = useState<SimResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    const rng = seededRandom(Date.now());
    const sims: SimResult[] = [];

    for (let i = 0; i < numSims; i++) {
      // Normal-ish distribution via Box-Muller
      const u1 = rng(), u2 = rng();
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      const z3 = Math.sqrt(-2 * Math.log(Math.max(rng(), 0.001))) * Math.cos(2 * Math.PI * rng());

      // Base values with perturbation
      const roughness = 0.013 * (1 + z1 * roughnessRange / 100);
      const imperv = 0.45 * (1 + z2 * impervRange / 100);
      const slope = 0.02 * (1 + z3 * slopeRange / 100);

      // Simplified flow calculation
      const basePeak = 25;
      const peakFlow = basePeak * (imperv / 0.45) * Math.sqrt(slope / 0.02) / Math.pow(roughness / 0.013, 0.6);
      const volume = peakFlow * (1.2 + 0.3 * rng()) * 3600;
      const timing = 2.5 + z1 * 0.5; // hours to peak

      sims.push({ peakFlow: Math.max(0, peakFlow), volume: Math.max(0, volume), timing: Math.max(0.5, timing) });
    }

    setTimeout(() => {
      setResults(sims);
      setIsRunning(false);
    }, 300);
  }, [numSims, roughnessRange, impervRange, slopeRange]);

  const stats = useMemo(() => {
    if (results.length === 0) return null;
    const peaks = results.map(r => r.peakFlow).sort((a, b) => a - b);
    const mean = peaks.reduce((a, b) => a + b, 0) / peaks.length;
    const std = Math.sqrt(peaks.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / peaks.length);
    const p5 = peaks[Math.floor(peaks.length * 0.05)];
    const p50 = peaks[Math.floor(peaks.length * 0.5)];
    const p95 = peaks[Math.floor(peaks.length * 0.95)];
    const cv = std / mean * 100;
    return { mean, std, p5, p50, p95, cv, min: peaks[0], max: peaks[peaks.length - 1] };
  }, [results]);

  const exportParams = () => {
    if (!stats) return;
    const txt = `# Monte Carlo Uncertainty Analysis
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.10

## Simulation Parameters
- Number of Simulations: ${numSims}
- Roughness (Manning's n) Range: 0.013 ± ${roughnessRange}%
- Imperviousness Range: 45% ± ${impervRange}%
- Slope Range: 2% ± ${slopeRange}%

## Peak Flow Statistics
- Mean: ${stats.mean.toFixed(2)} m³/s
- Std Dev: ${stats.std.toFixed(2)} m³/s
- CV: ${stats.cv.toFixed(1)}%
- 5th Percentile: ${stats.p5.toFixed(2)} m³/s
- Median (50th): ${stats.p50.toFixed(2)} m³/s
- 95th Percentile: ${stats.p95.toFixed(2)} m³/s
- Range: ${stats.min.toFixed(2)} - ${stats.max.toFixed(2)} m³/s

## Confidence Interval (90%)
${stats.p5.toFixed(2)} — ${stats.p95.toFixed(2)} m³/s
Width: ${(stats.p95 - stats.p5).toFixed(2)} m³/s (${((stats.p95 - stats.p5) / stats.mean * 100).toFixed(1)}% of mean)

## Reporting Recommendation
${stats.cv > 40 ? "⚠️ HIGH UNCERTAINTY: CV > 40%. Report full distribution to stakeholders.\nConsider: gathering more data, reducing parameter ranges, or simplifying model." : stats.cv > 20 ? "⚠️ MODERATE UNCERTAINTY: CV 20-40%. Include confidence bounds in all results." : "✅ LOW UNCERTAINTY: CV < 20%. Parameter uncertainty is well-constrained."}

## James's Rule 10: Quantify Uncertainty
"Single-point estimates without uncertainty communication
are incomplete and potentially misleading."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monte-carlo-analysis.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Monte Carlo analysis downloaded!");
  };

  // Chart: histogram of peak flows
  const svgW = 600, svgH = 250;
  const pad = { top: 15, right: 15, bottom: 40, left: 50 };
  const cW = svgW - pad.left - pad.right;
  const cH = svgH - pad.top - pad.bottom;

  const histogram = useMemo(() => {
    if (results.length === 0) return { bins: [], maxCount: 1, minVal: 0, maxVal: 50 };
    const peaks = results.map(r => r.peakFlow);
    const minVal = Math.min(...peaks);
    const maxVal = Math.max(...peaks);
    const range = maxVal - minVal || 1;
    const numBins = Math.min(25, Math.max(10, Math.floor(results.length / 3)));
    const binWidth = range / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => ({
      start: minVal + i * binWidth,
      end: minVal + (i + 1) * binWidth,
      count: 0,
    }));
    peaks.forEach(p => {
      const idx = Math.min(Math.floor((p - minVal) / binWidth), numBins - 1);
      bins[idx].count++;
    });
    const maxCount = Math.max(...bins.map(b => b.count), 1);
    return { bins, maxCount, minVal, maxVal };
  }, [results]);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Dices className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Monte Carlo Spinner</h2>
          <p className="text-sm text-muted-foreground">Chapter 10: Uncertainty Analysis</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Set parameter ranges, run simulations, and watch confidence intervals explode. See why single-point estimates are misleading.
      </p>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Simulations: <span className="text-primary font-bold">{numSims}</span>
          </label>
          <Slider value={[numSims]} onValueChange={([v]) => setNumSims(v)} min={10} max={500} step={10} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Manning's n Range: <span className="text-primary font-bold">±{roughnessRange}%</span>
          </label>
          <Slider value={[roughnessRange]} onValueChange={([v]) => setRoughnessRange(v)} min={5} max={60} step={5} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Imperviousness Range: <span className="text-primary font-bold">±{impervRange}%</span>
          </label>
          <Slider value={[impervRange]} onValueChange={([v]) => setImpervRange(v)} min={5} max={50} step={5} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Slope Range: <span className="text-primary font-bold">±{slopeRange}%</span>
          </label>
          <Slider value={[slopeRange]} onValueChange={([v]) => setSlopeRange(v)} min={5} max={40} step={5} />
        </div>
      </div>

      {/* Run Button */}
      <div className="flex gap-3 mb-6">
        <Button onClick={runSimulation} disabled={isRunning} className="gap-2">
          <Play className="w-4 h-4" />
          {isRunning ? "Running..." : `Run ${numSims} Simulations`}
        </Button>
        {results.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setResults([])} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && stats && (
        <>
          {/* Histogram */}
          <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
            <h4 className="text-sm font-medium text-foreground mb-3">Peak Flow Distribution ({results.length} simulations)</h4>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
              {/* Y axis */}
              {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                const count = Math.round(frac * histogram.maxCount);
                const yPos = pad.top + cH - frac * cH;
                return (
                  <g key={frac}>
                    <line x1={pad.left} y1={yPos} x2={svgW - pad.right} y2={yPos}
                      stroke="currentColor" strokeOpacity={0.06} strokeDasharray="4,4" />
                    <text x={pad.left - 6} y={yPos + 4} textAnchor="end"
                      fill="currentColor" fillOpacity={0.4} fontSize={9}>{count}</text>
                  </g>
                );
              })}
              {/* Bars */}
              {histogram.bins.map((bin, i) => {
                const barW = cW / histogram.bins.length - 1;
                const barH = (bin.count / histogram.maxCount) * cH;
                const xPos = pad.left + (i / histogram.bins.length) * cW;
                const isInCI = bin.start >= stats.p5 && bin.end <= stats.p95;
                return (
                  <rect key={i} x={xPos} y={pad.top + cH - barH} width={barW} height={barH} rx={1}
                    fill={isInCI ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                    fillOpacity={isInCI ? 0.6 : 0.2} />
                );
              })}
              {/* Percentile lines */}
              {[
                { val: stats.p5, label: "P5", color: "rgb(239,68,68)" },
                { val: stats.p50, label: "P50", color: "rgb(59,130,246)" },
                { val: stats.p95, label: "P95", color: "rgb(239,68,68)" },
              ].map(({ val, label, color }) => {
                const xPos = pad.left + ((val - histogram.minVal) / (histogram.maxVal - histogram.minVal)) * cW;
                return (
                  <g key={label}>
                    <line x1={xPos} y1={pad.top} x2={xPos} y2={pad.top + cH}
                      stroke={color} strokeWidth={1.5} strokeDasharray="4,3" />
                    <text x={xPos} y={pad.top - 3} textAnchor="middle" fill={color} fontSize={9} fontWeight="bold">
                      {label}
                    </text>
                  </g>
                );
              })}
              {/* X axis label */}
              <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fill="currentColor" fillOpacity={0.3} fontSize={10}>
                Peak Flow (m³/s) →
              </text>
            </svg>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
            {[
              { label: "Mean", value: stats.mean.toFixed(1) },
              { label: "Std Dev", value: stats.std.toFixed(1) },
              { label: "CV", value: `${stats.cv.toFixed(0)}%` },
              { label: "P5", value: stats.p5.toFixed(1) },
              { label: "Median", value: stats.p50.toFixed(1) },
              { label: "P95", value: stats.p95.toFixed(1) },
            ].map(s => (
              <div key={s.label} className="bg-muted/50 rounded-lg p-2.5 text-center border border-border">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{s.label}</div>
                <div className="text-lg font-bold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Warning for high uncertainty */}
          {stats.cv > 30 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">High Uncertainty Detected (CV = {stats.cv.toFixed(0)}%)</p>
                <p className="text-muted-foreground">
                  The 90% confidence interval spans {((stats.p95 - stats.p5) / stats.mean * 100).toFixed(0)}% of the mean.
                  Presenting a single "best estimate" would be misleading. Report the full distribution to stakeholders.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl mb-6">
          <Dices className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Set your parameter ranges and click "Run Simulations" to see the uncertainty distribution.</p>
          <p className="text-xs mt-1 opacity-60">Try increasing the ranges to see how uncertainty explodes!</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link to="/micro-apps/error-metric-lab">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Error Metric Lab
            </Button>
          </Link>
          {results.length > 0 && (
            <Button onClick={exportParams} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Analysis
            </Button>
          )}
        </div>
        <Link to="/chapter/10">
          <Button variant="ghost" size="sm" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Read Chapter 10
          </Button>
        </Link>
      </div>
    </Card>
  );
};
