import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { BarChart3, Download, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Generate a synthetic "observed" hydrograph
const generateObserved = () => {
  const pts: number[] = [];
  for (let i = 0; i < 48; i++) {
    const t = i / 48;
    // Rising limb, peak, recession
    const base = 2;
    const peak = 45 * Math.exp(-Math.pow((t - 0.3) / 0.08, 2));
    const secondPeak = 15 * Math.exp(-Math.pow((t - 0.55) / 0.1, 2));
    pts.push(base + peak + secondPeak);
  }
  return pts;
};

const observed = generateObserved();

export const ErrorMetricLab = () => {
  const [peakShift, setPeakShift] = useState(0); // -10 to +10 timesteps
  const [peakScale, setPeakScale] = useState(100); // 50-150%
  const [volumeBias, setVolumeBias] = useState(0); // -50 to +50%
  const [recessionRate, setRecessionRate] = useState(100); // 50-150%

  const { predicted, metrics } = useMemo(() => {
    const pred = observed.map((_, i) => {
      // Shift the peak
      const shifted = i - peakShift;
      if (shifted < 0 || shifted >= 48) return 2 * (1 + volumeBias / 100);

      const val = observed[shifted] ?? 2;
      // Scale peak
      const base = 2;
      const exceedance = val - base;
      const scaled = base + exceedance * (peakScale / 100);
      // Apply volume bias
      const biased = scaled * (1 + volumeBias / 100);
      // Modify recession
      const t = i / 48;
      const recMod = t > 0.4 ? 1 + (recessionRate - 100) / 200 * (t - 0.4) : 1;
      return Math.max(0, biased * recMod);
    });

    // Calculate metrics
    const n = observed.length;
    const obsBar = observed.reduce((a, b) => a + b, 0) / n;
    const sumObs = observed.reduce((a, b) => a + b, 0);
    const sumPred = pred.reduce((a, b) => a + b, 0);

    let ssRes = 0, ssTot = 0, sumAbsErr = 0, sumSqObs = 0, sumSqPred = 0, sumProduct = 0;
    const predBar = pred.reduce((a, b) => a + b, 0) / n;

    for (let i = 0; i < n; i++) {
      ssRes += Math.pow(observed[i] - pred[i], 2);
      ssTot += Math.pow(observed[i] - obsBar, 2);
      sumAbsErr += Math.abs(observed[i] - pred[i]);
      sumSqObs += Math.pow(observed[i] - obsBar, 2);
      sumSqPred += Math.pow(pred[i] - predBar, 2);
      sumProduct += (observed[i] - obsBar) * (pred[i] - predBar);
    }

    const nse = 1 - ssRes / ssTot;
    const r2 = Math.pow(sumProduct / Math.sqrt(sumSqObs * sumSqPred), 2);
    const mae = sumAbsErr / n;
    const pbias = ((sumPred - sumObs) / sumObs) * 100;
    const rmse = Math.sqrt(ssRes / n);

    // KGE
    const r = sumProduct / Math.sqrt(sumSqObs * sumSqPred);
    const alpha = Math.sqrt(sumSqPred / n) / Math.sqrt(sumSqObs / n);
    const beta = predBar / obsBar;
    const kge = 1 - Math.sqrt(Math.pow(r - 1, 2) + Math.pow(alpha - 1, 2) + Math.pow(beta - 1, 2));

    return {
      predicted: pred,
      metrics: {
        nse: isFinite(nse) ? nse : 0,
        r2: isFinite(r2) ? r2 : 0,
        mae,
        pbias: isFinite(pbias) ? pbias : 0,
        rmse,
        kge: isFinite(kge) ? kge : 0,
      },
    };
  }, [peakShift, peakScale, volumeBias, recessionRate]);

  const exportCalibration = () => {
    const txt = `# Calibration Target Recommendations
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.9

## Current Metrics
- NSE: ${metrics.nse.toFixed(3)}
- R²: ${metrics.r2.toFixed(3)}
- KGE: ${metrics.kge.toFixed(3)}
- PBIAS: ${metrics.pbias.toFixed(1)}%
- RMSE: ${metrics.rmse.toFixed(2)}
- MAE: ${metrics.mae.toFixed(2)}

## Adjustments Applied
- Peak Timing Shift: ${peakShift > 0 ? "+" : ""}${peakShift} timesteps
- Peak Magnitude Scale: ${peakScale}%
- Volume Bias: ${volumeBias > 0 ? "+" : ""}${volumeBias}%
- Recession Rate: ${recessionRate}%

## Calibration Recommendations
${metrics.nse > 0.7 ? "✅ NSE > 0.7: Good overall fit" : "❌ NSE < 0.7: Improve overall fit — check data quality (Ch.3)"}
${Math.abs(metrics.pbias) < 15 ? "✅ |PBIAS| < 15%: Volume bias acceptable" : "❌ |PBIAS| > 15%: Volume mismatch — check rainfall input (Ch.6)"}
${metrics.kge > 0.5 ? "✅ KGE > 0.5: Balanced performance" : "❌ KGE < 0.5: Multiple error sources — use multi-objective calibration (Ch.14)"}

## James's Rule 9: Choose Appropriate Objective Functions
"No single objective function captures all aspects of model performance.
Use multiple metrics to evaluate different hydrograph features."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calibration-targets.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calibration recommendations downloaded!");
  };

  // Chart
  const svgW = 600, svgH = 250;
  const pad = { top: 15, right: 15, bottom: 35, left: 45 };
  const cW = svgW - pad.left - pad.right;
  const cH = svgH - pad.top - pad.bottom;
  const maxY = 55;

  const x = (i: number) => pad.left + (i / 47) * cW;
  const y = (v: number) => pad.top + cH - (Math.min(v, maxY) / maxY) * cH;

  const obsPath = observed.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const predPath = predicted.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const metricColor = (val: number, good: number, ok: number) =>
    val >= good ? "text-emerald-600 dark:text-emerald-400" :
    val >= ok ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Error Metric Lab</h2>
          <p className="text-sm text-muted-foreground">Chapter 9: Objective Functions</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Adjust the predicted hydrograph and watch how different error metrics respond. Learn why a single metric is never enough.
      </p>

      {/* Controls */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Peak Timing: <span className="text-primary font-bold">{peakShift > 0 ? "+" : ""}{peakShift}</span>
          </label>
          <Slider value={[peakShift]} onValueChange={([v]) => setPeakShift(v)} min={-10} max={10} step={1} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Peak Scale: <span className="text-primary font-bold">{peakScale}%</span>
          </label>
          <Slider value={[peakScale]} onValueChange={([v]) => setPeakScale(v)} min={50} max={150} step={5} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Volume Bias: <span className="text-primary font-bold">{volumeBias > 0 ? "+" : ""}{volumeBias}%</span>
          </label>
          <Slider value={[volumeBias]} onValueChange={([v]) => setVolumeBias(v)} min={-50} max={50} step={5} />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Recession: <span className="text-primary font-bold">{recessionRate}%</span>
          </label>
          <Slider value={[recessionRate]} onValueChange={([v]) => setRecessionRate(v)} min={50} max={150} step={5} />
        </div>
      </div>

      {/* Hydrograph */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="text-sm font-medium text-foreground">Hydrograph Comparison</h4>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Observed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-500 inline-block" /> Predicted</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
          {[0, 15, 30, 45].map(v => (
            <g key={v}>
              <line x1={pad.left} y1={y(v)} x2={svgW - pad.right} y2={y(v)}
                stroke="currentColor" strokeOpacity={0.08} strokeDasharray="4,4" />
              <text x={pad.left - 6} y={y(v) + 4} textAnchor="end"
                fill="currentColor" fillOpacity={0.4} fontSize={9}>{v}</text>
            </g>
          ))}
          <path d={obsPath} fill="none" stroke="rgb(59,130,246)" strokeWidth={2.5} />
          <path d={predPath} fill="none" stroke="rgb(249,115,22)" strokeWidth={2} strokeDasharray="6,3" />
          <text x={svgW / 2} y={svgH - 5} textAnchor="middle" fill="currentColor" fillOpacity={0.3} fontSize={10}>
            Time (hours) →
          </text>
        </svg>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {[
          { label: "NSE", value: metrics.nse.toFixed(3), color: metricColor(metrics.nse, 0.7, 0.4) },
          { label: "R²", value: metrics.r2.toFixed(3), color: metricColor(metrics.r2, 0.7, 0.4) },
          { label: "KGE", value: metrics.kge.toFixed(3), color: metricColor(metrics.kge, 0.5, 0.2) },
          { label: "PBIAS", value: `${metrics.pbias.toFixed(1)}%`, color: metricColor(1 - Math.abs(metrics.pbias) / 30, 0.5, 0.2) },
          { label: "RMSE", value: metrics.rmse.toFixed(2), color: metricColor(1 - metrics.rmse / 20, 0.5, 0.2) },
          { label: "MAE", value: metrics.mae.toFixed(2), color: metricColor(1 - metrics.mae / 15, 0.5, 0.2) },
        ].map(m => (
          <div key={m.label} className="bg-muted/50 rounded-lg p-2.5 text-center border border-border">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">{m.label}</div>
            <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="bg-accent/30 border border-border rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong>💡 Key insight:</strong>{" "}
          {Math.abs(peakShift) > 3 && metrics.r2 > 0.5
            ? "Notice how R² stays high despite timing errors — it only measures correlation, not accuracy. This is why NSE and KGE are preferred for hydrologic models."
            : peakScale > 120 && metrics.nse > 0.5
            ? "Even with peak over-prediction, NSE can remain acceptable. Always check PBIAS alongside NSE for volume balance."
            : Math.abs(volumeBias) > 20
            ? "Volume bias strongly affects PBIAS but may barely move R². Multiple metrics reveal different failure modes."
            : "Try shifting the peak timing to see how R² can be misleading — or scale the peak to discover NSE limitations."}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link to="/micro-apps/overfitting-simulator">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Overfitting Simulator
            </Button>
          </Link>
          <Button onClick={exportCalibration} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Recommendations
          </Button>
        </div>
        <Link to="/micro-apps/monte-carlo-spinner">
          <Button size="sm" className="gap-2">
            Next: Monte Carlo Spinner
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
