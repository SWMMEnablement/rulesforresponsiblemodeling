import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { CloudRain, Download, BookOpen, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

/**
 * Ch.6 — Storm Chopper
 * Demonstrates how temporal discretization (time-step) affects peak-flow capture.
 * Users chop a synthetic hyetograph into coarser intervals and watch the peak flatten.
 */
export const StormChopper = () => {
  const [timeStep, setTimeStep] = useState(5); // minutes
  const [stormDuration, setStormDuration] = useState(60); // minutes
  const [peakIntensity, setPeakIntensity] = useState(80); // mm/hr

  const analysis = useMemo(() => {
    // Generate a synthetic double-triangle hyetograph at 1-min resolution
    const mid = stormDuration / 2;
    const fineRes = Array.from({ length: stormDuration }, (_, i) => {
      const t = i + 0.5;
      const ratio = t <= mid ? t / mid : (stormDuration - t) / mid;
      return peakIntensity * Math.max(0, ratio);
    });

    // Aggregate to chosen time-step
    const nBins = Math.max(1, Math.floor(stormDuration / timeStep));
    const coarse = Array.from({ length: nBins }, (_, b) => {
      const start = b * timeStep;
      const end = Math.min(start + timeStep, stormDuration);
      let sum = 0, count = 0;
      for (let i = start; i < end; i++) {
        if (i < fineRes.length) { sum += fineRes[i]; count++; }
      }
      return count > 0 ? sum / count : 0;
    });

    const truePeak = Math.max(...fineRes);
    const capturedPeak = Math.max(...coarse);
    const peakLoss = ((truePeak - capturedPeak) / truePeak) * 100;

    const riskLevel = peakLoss > 30 ? "critical" : peakLoss > 15 ? "warning" : "safe";

    return { fineRes, coarse, nBins, truePeak, capturedPeak, peakLoss, riskLevel };
  }, [timeStep, stormDuration, peakIntensity]);

  const exportTemplate = () => {
    const txt = `# Storm Discretization Analysis
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.6

## Parameters
- Storm Duration: ${stormDuration} min
- Peak Intensity: ${peakIntensity} mm/hr
- Chosen Time-Step: ${timeStep} min

## Results
- True Peak Intensity: ${analysis.truePeak.toFixed(1)} mm/hr
- Captured Peak (at Δt=${timeStep} min): ${analysis.capturedPeak.toFixed(1)} mm/hr
- Peak Attenuation: ${analysis.peakLoss.toFixed(1)}%
- Risk Level: ${analysis.riskLevel.toUpperCase()}

## Recommendation
${analysis.riskLevel === "critical" ? "Time-step too coarse — peak is severely attenuated. Use Δt ≤ 5 min." : analysis.riskLevel === "warning" ? "Moderate peak loss. Consider a finer time-step for design storms." : "Time-step adequately captures the storm peak."}

## Rule 6: Respect the Resolution of Your Data
"The model time-step should be fine enough to capture the
 fastest process that matters to your decision."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "storm-discretization-analysis.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Storm analysis downloaded!");
  };

  // SVG chart
  const svgW = 600, svgH = 250;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const cW = svgW - pad.left - pad.right;
  const cH = svgH - pad.top - pad.bottom;
  const maxVal = peakIntensity * 1.1;

  const xScale = (i: number, total: number) => pad.left + (i / total) * cW;
  const yScale = (v: number) => pad.top + cH - (v / maxVal) * cH;

  const riskColors = {
    safe: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    critical: "text-red-600 dark:text-red-400",
  };
  const riskBg = {
    safe: "bg-emerald-500/10 border-emerald-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
    critical: "bg-red-500/10 border-red-500/30",
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <CloudRain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Storm Chopper</h2>
          <p className="text-sm text-muted-foreground">Chapter 6: Temporal Discretization</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Chop a storm into coarser time-steps and watch the peak flatten. How much resolution can you afford to lose?
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Time-Step: <span className="text-primary font-bold">{timeStep} min</span>
          </label>
          <Slider value={[timeStep]} onValueChange={([v]) => setTimeStep(v)} min={1} max={30} step={1} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Storm Duration: <span className="text-primary font-bold">{stormDuration} min</span>
          </label>
          <Slider value={[stormDuration]} onValueChange={([v]) => setStormDuration(v)} min={15} max={180} step={5} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Peak Intensity: <span className="text-primary font-bold">{peakIntensity} mm/hr</span>
          </label>
          <Slider value={[peakIntensity]} onValueChange={([v]) => setPeakIntensity(v)} min={10} max={200} step={5} />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <h4 className="text-sm font-medium text-foreground mb-3">Hyetograph Comparison</h4>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
          {/* Fine resolution line */}
          <path
            d={analysis.fineRes.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i, stormDuration).toFixed(1)},${yScale(v).toFixed(1)}`).join(" ")}
            fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeOpacity={0.4}
          />
          {/* Coarse bars */}
          {analysis.coarse.map((v, i) => {
            const barW = cW / analysis.nBins - 1;
            return (
              <rect key={i}
                x={xScale(i, analysis.nBins)} y={yScale(v)}
                width={Math.max(1, barW)} height={Math.max(0, yScale(0) - yScale(v))}
                fill="hsl(var(--primary))" fillOpacity={0.6} rx={1}
              />
            );
          })}
          {/* Peak markers */}
          <line x1={pad.left} y1={yScale(analysis.truePeak)} x2={svgW - pad.right} y2={yScale(analysis.truePeak)}
            stroke="currentColor" strokeOpacity={0.3} strokeDasharray="4,4" />
          <text x={svgW - pad.right} y={yScale(analysis.truePeak) - 4} textAnchor="end"
            fill="currentColor" fillOpacity={0.5} fontSize={9}>True peak: {analysis.truePeak.toFixed(0)}</text>
          {/* Axes */}
          <text x={pad.left - 8} y={pad.top + 4} textAnchor="end" fill="currentColor" fillOpacity={0.4} fontSize={9}>{maxVal.toFixed(0)}</text>
          <text x={pad.left - 8} y={yScale(0) + 4} textAnchor="end" fill="currentColor" fillOpacity={0.4} fontSize={9}>0</text>
          <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill="currentColor" fillOpacity={0.4} fontSize={10}>Time (min)</text>
        </svg>
      </div>

      {/* Risk */}
      <div className={`rounded-lg border p-4 mb-6 ${riskBg[analysis.riskLevel]}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${riskColors[analysis.riskLevel]}`} />
          <div>
            <span className={`font-bold ${riskColors[analysis.riskLevel]}`}>
              Peak Attenuation: {analysis.peakLoss.toFixed(1)}%
            </span>
            <Badge variant="outline" className="ml-2 text-xs">{analysis.riskLevel.toUpperCase()}</Badge>
            <p className="text-sm text-foreground mt-1">
              {analysis.riskLevel === "critical" ? "Time-step too coarse — the storm peak is severely flattened." :
               analysis.riskLevel === "warning" ? "Moderate peak loss. Consider a finer time-step for critical designs." :
               "Time-step adequately captures the peak intensity."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={exportTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Analysis
          </Button>
          <Link to="/chapter/6"><Button variant="ghost" size="sm" className="gap-2"><BookOpen className="w-4 h-4" /> Read Chapter 6</Button></Link>
        </div>
        <Link to="/micro-apps/tornado-twister">
          <Button size="sm" className="gap-2">Next: Tornado Twister <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </div>
    </Card>
  );
};
