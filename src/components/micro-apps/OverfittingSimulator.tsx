import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { TrendingDown, Download, BookOpen, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const OverfittingSimulator = () => {
  const [paramCount, setParamCount] = useState(3);
  const [dataPoints, setDataPoints] = useState(20);
  const [noiseLevel, setNoiseLevel] = useState(30);

  const analysis = useMemo(() => {
    const ratio = paramCount / Math.max(dataPoints, 1);
    
    // Training error decreases monotonically with more parameters
    const trainErrors = Array.from({ length: 20 }, (_, i) => {
      const p = i + 1;
      const base = 40 * Math.exp(-0.3 * p) + (noiseLevel / 100) * 5;
      return { params: p, error: Math.max(base, 1) };
    });

    // Validation error has a U-shape — decreases then increases
    const optimalParams = Math.max(2, Math.floor(dataPoints / 5));
    const valErrors = Array.from({ length: 20 }, (_, i) => {
      const p = i + 1;
      const underfitPenalty = 30 * Math.exp(-0.4 * p);
      const overfitPenalty = Math.max(0, (p - optimalParams) * (3 + noiseLevel / 20));
      const noise = (noiseLevel / 100) * 8;
      return { params: p, error: underfitPenalty + overfitPenalty + noise + 3 };
    });

    const currentTrainError = trainErrors[paramCount - 1]?.error ?? 0;
    const currentValError = valErrors[paramCount - 1]?.error ?? 0;
    const gap = currentValError - currentTrainError;

    const status =
      paramCount > optimalParams + 3 ? "overfitting" :
      paramCount < optimalParams - 1 ? "underfitting" :
      "optimal";

    return { trainErrors, valErrors, optimalParams, currentTrainError, currentValError, gap, status };
  }, [paramCount, dataPoints, noiseLevel]);

  const exportResult = () => {
    const txt = `# Overfitting Analysis Report
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.4

## Configuration
- Parameters: ${paramCount}
- Data Points: ${dataPoints}
- Noise Level: ${noiseLevel}%
- Optimal Parameter Count: ~${analysis.optimalParams}

## Results
- Training Error: ${analysis.currentTrainError.toFixed(1)}%
- Validation Error: ${analysis.currentValError.toFixed(1)}%
- Generalization Gap: ${analysis.gap.toFixed(1)}%
- Status: ${analysis.status.toUpperCase()}

## Recommendation
${analysis.status === "overfitting"
  ? `WARNING: Model is overfitting. Reduce parameters from ${paramCount} to ~${analysis.optimalParams}.
Consider: Simplify subcatchment discretization, reduce calibration parameters, use global sensitivity analysis (Ch.11).`
  : analysis.status === "underfitting"
  ? `Model may be too simple. Consider adding ${analysis.optimalParams - paramCount} more parameters.
But verify with sensitivity analysis (Ch.11) that additional complexity is warranted.`
  : `Model complexity appears appropriate for available data. Proceed with calibration (Ch.12).`}

## James's Rule 4: Optimal Complexity
"The ideal model is the simplest one that adequately serves
the purpose for which it was developed."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "overfitting-analysis.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Analysis report downloaded!");
  };

  // SVG chart
  const svgW = 600, svgH = 280;
  const pad = { top: 20, right: 20, bottom: 45, left: 55 };
  const cW = svgW - pad.left - pad.right;
  const cH = svgH - pad.top - pad.bottom;

  const maxError = 60;
  const xS = (p: number) => pad.left + ((p - 1) / 19) * cW;
  const yS = (e: number) => pad.top + cH - (Math.min(e, maxError) / maxError) * cH;

  const trainPath = analysis.trainErrors.map((d, i) =>
    `${i === 0 ? "M" : "L"}${xS(d.params).toFixed(1)},${yS(d.error).toFixed(1)}`
  ).join(" ");

  const valPath = analysis.valErrors.map((d, i) =>
    `${i === 0 ? "M" : "L"}${xS(d.params).toFixed(1)},${yS(d.error).toFixed(1)}`
  ).join(" ");

  const statusColors = {
    overfitting: "text-red-600 dark:text-red-400",
    underfitting: "text-amber-600 dark:text-amber-400",
    optimal: "text-emerald-600 dark:text-emerald-400",
  };

  const statusBg = {
    overfitting: "bg-red-500/10 border-red-500/30",
    underfitting: "bg-amber-500/10 border-amber-500/30",
    optimal: "bg-emerald-500/10 border-emerald-500/30",
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingDown className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Overfitting Simulator</h2>
          <p className="text-sm text-muted-foreground">Chapter 4: Optimal Complexity</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Watch what happens as you add parameters: training error drops, but validation error eventually rises — the classic U-curve of overfitting.
      </p>

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Parameters: <span className="text-primary font-bold">{paramCount}</span>
          </label>
          <Slider value={[paramCount]} onValueChange={([v]) => setParamCount(v)} min={1} max={20} step={1} />
          <p className="text-xs text-muted-foreground mt-1">Number of calibration parameters</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Data Points: <span className="text-primary font-bold">{dataPoints}</span>
          </label>
          <Slider value={[dataPoints]} onValueChange={([v]) => setDataPoints(v)} min={5} max={100} step={5} />
          <p className="text-xs text-muted-foreground mt-1">Available calibration data</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Noise Level: <span className="text-primary font-bold">{noiseLevel}%</span>
          </label>
          <Slider value={[noiseLevel]} onValueChange={([v]) => setNoiseLevel(v)} min={5} max={80} step={5} />
          <p className="text-xs text-muted-foreground mt-1">Measurement noise in data</p>
        </div>
      </div>

      {/* U-Curve Chart */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-4 mb-3">
          <h4 className="text-sm font-medium text-foreground">Training vs Validation Error</h4>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> Training</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> Validation</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
          {/* Grid */}
          {[0, 15, 30, 45, 60].map(v => (
            <g key={v}>
              <line x1={pad.left} y1={yS(v)} x2={svgW - pad.right} y2={yS(v)}
                stroke="currentColor" strokeOpacity={0.08} strokeDasharray="4,4" />
              <text x={pad.left - 8} y={yS(v) + 4} textAnchor="end"
                fill="currentColor" fillOpacity={0.4} fontSize={10}>{v}%</text>
            </g>
          ))}
          {/* Optimal zone */}
          <rect x={xS(analysis.optimalParams - 1)} y={pad.top} width={xS(analysis.optimalParams + 2) - xS(analysis.optimalParams - 1)}
            height={cH} fill="currentColor" fillOpacity={0.03} rx={4} />
          <text x={xS(analysis.optimalParams)} y={svgH - 28} textAnchor="middle"
            fill="currentColor" fillOpacity={0.3} fontSize={9}>optimal zone</text>
          {/* Lines */}
          <path d={trainPath} fill="none" stroke="rgb(59,130,246)" strokeWidth={2} />
          <path d={valPath} fill="none" stroke="rgb(239,68,68)" strokeWidth={2} />
          {/* Current position marker */}
          <circle cx={xS(paramCount)} cy={yS(analysis.currentTrainError)} r={5}
            fill="rgb(59,130,246)" stroke="white" strokeWidth={2} />
          <circle cx={xS(paramCount)} cy={yS(analysis.currentValError)} r={5}
            fill="rgb(239,68,68)" stroke="white" strokeWidth={2} />
          {/* Vertical line at current */}
          <line x1={xS(paramCount)} y1={yS(analysis.currentTrainError)}
            x2={xS(paramCount)} y2={yS(analysis.currentValError)}
            stroke="currentColor" strokeOpacity={0.2} strokeDasharray="3,3" />
          {/* Gap label */}
          <text x={xS(paramCount) + 8}
            y={(yS(analysis.currentTrainError) + yS(analysis.currentValError)) / 2 + 4}
            fill="currentColor" fillOpacity={0.5} fontSize={9}>
            Gap: {analysis.gap.toFixed(1)}%
          </text>
          {/* X axis */}
          {[1, 5, 10, 15, 20].map(p => (
            <text key={p} x={xS(p)} y={svgH - 8} textAnchor="middle"
              fill="currentColor" fillOpacity={0.4} fontSize={10}>{p}</text>
          ))}
          <text x={svgW / 2} y={svgH - 0} textAnchor="middle"
            fill="currentColor" fillOpacity={0.3} fontSize={10}>Parameters →</text>
        </svg>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500/20">
          <div className="text-xs text-muted-foreground mb-1">Training Error</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{analysis.currentTrainError.toFixed(1)}%</div>
        </div>
        <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/20">
          <div className="text-xs text-muted-foreground mb-1">Validation Error</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">{analysis.currentValError.toFixed(1)}%</div>
        </div>
        <div className={`rounded-lg p-3 text-center border ${statusBg[analysis.status]}`}>
          <div className="text-xs text-muted-foreground mb-1">Status</div>
          <div className={`text-xl font-bold ${statusColors[analysis.status]}`}>
            {analysis.status === "overfitting" ? "⚠️ Overfit" :
             analysis.status === "underfitting" ? "📉 Underfit" : "✅ Optimal"}
          </div>
        </div>
      </div>

      {/* Warning */}
      {analysis.status === "overfitting" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Overfitting Detected!</p>
            <p className="text-muted-foreground">
              You have {paramCount} parameters but optimal is ~{analysis.optimalParams} for {dataPoints} data points.
              The model fits noise instead of signal. Reduce complexity or gather more data.
              See <Link to="/chapter/4" className="text-primary underline">Chapter 4</Link> and <Link to="/chapter/11" className="text-primary underline">Chapter 11</Link>.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link to="/micro-apps/crystal-ball">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Crystal Ball Test
            </Button>
          </Link>
          <Button onClick={exportResult} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Analysis
          </Button>
        </div>
        <Link to="/micro-apps/error-metric-lab">
          <Button size="sm" className="gap-2">
            Next: Error Metric Lab
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
