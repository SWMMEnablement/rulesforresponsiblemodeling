import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Tornado, Download, BookOpen, ArrowRight, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Param {
  name: string;
  base: number;
  min: number;
  max: number;
  unit: string;
}

const defaultParams: Param[] = [
  { name: "Manning's n", base: 0.013, min: 0.008, max: 0.025, unit: "" },
  { name: "Imperviousness", base: 50, min: 10, max: 95, unit: "%" },
  { name: "Slope", base: 2, min: 0.5, max: 8, unit: "%" },
  { name: "Pipe Diameter", base: 600, min: 300, max: 1200, unit: "mm" },
  { name: "Depression Storage", base: 5, min: 1, max: 15, unit: "mm" },
  { name: "Infiltration Rate", base: 25, min: 5, max: 80, unit: "mm/hr" },
];

/**
 * Ch.11 — Tornado Twister (Sensitivity Tornado Diagram)
 * Adjust parameter ranges and see which ones dominate the output.
 */
export const TornadoTwister = () => {
  const [ranges, setRanges] = useState<number[]>(defaultParams.map(() => 50));

  const updateRange = (idx: number, val: number) => {
    setRanges(prev => { const n = [...prev]; n[idx] = val; return n; });
  };

  const results = useMemo(() => {
    // Simplified sensitivity: output swing proportional to range × weight
    const weights = [0.35, 0.25, 0.15, 0.12, 0.08, 0.05]; // relative sensitivity
    const swings = defaultParams.map((p, i) => {
      const rangeFraction = ranges[i] / 100;
      const spread = (p.max - p.min) * rangeFraction;
      const swing = spread * weights[i] * 100 / p.base;
      return { ...p, swing, rangePct: ranges[i], low: p.base - spread / 2, high: p.base + spread / 2 };
    });
    swings.sort((a, b) => b.swing - a.swing);
    return swings;
  }, [ranges]);

  const maxSwing = Math.max(...results.map(r => r.swing), 1);

  const exportTemplate = () => {
    const txt = `# Sensitivity Analysis Summary
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.11

## Parameter Sensitivity Ranking
${results.map((r, i) => `${i + 1}. ${r.name}: ±${r.swing.toFixed(1)}% output swing (range: ${r.low.toFixed(3)}–${r.high.toFixed(3)} ${r.unit})`).join("\n")}

## Key Finding
Most sensitive parameter: ${results[0].name} (±${results[0].swing.toFixed(1)}%)
Least sensitive parameter: ${results[results.length - 1].name} (±${results[results.length - 1].swing.toFixed(1)}%)

## Rule 11: Test Sensitivity Before Calibrating
"Know which parameters matter before spending time tuning all of them."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "sensitivity-analysis.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Sensitivity analysis downloaded!");
  };

  // SVG tornado chart
  const svgW = 600, svgH = 280;
  const pad = { top: 15, right: 20, bottom: 15, left: 140 };
  const cW = svgW - pad.left - pad.right;
  const barH = 30;
  const gap = 8;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Tornado className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Tornado Twister</h2>
          <p className="text-sm text-muted-foreground">Chapter 11: Sensitivity Analysis</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Adjust each parameter's uncertainty range and watch the tornado diagram reveal which ones dominate the output.
      </p>

      {/* Sliders */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {defaultParams.map((p, i) => (
          <div key={p.name}>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {p.name}: <span className="text-primary font-bold">±{ranges[i]}%</span>
            </label>
            <Slider value={[ranges[i]]} onValueChange={([v]) => updateRange(i, v)} min={5} max={100} step={5} />
          </div>
        ))}
      </div>

      {/* Tornado chart */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Tornado Diagram — Output Sensitivity
        </h4>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
          {/* Center line */}
          <line x1={pad.left + cW / 2} y1={pad.top} x2={pad.left + cW / 2} y2={svgH - pad.bottom}
            stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
          {results.map((r, i) => {
            const y = pad.top + i * (barH + gap);
            const barWidth = (r.swing / maxSwing) * (cW / 2);
            const cx = pad.left + cW / 2;
            const colors = ["hsl(var(--primary))", "hsl(var(--primary)/0.8)", "hsl(var(--primary)/0.6)", "hsl(var(--primary)/0.45)", "hsl(var(--primary)/0.3)", "hsl(var(--primary)/0.2)"];
            return (
              <g key={r.name}>
                {/* Left bar (low) */}
                <rect x={cx - barWidth} y={y} width={barWidth} height={barH}
                  fill={colors[i]} rx={3} />
                {/* Right bar (high) */}
                <rect x={cx} y={y} width={barWidth} height={barH}
                  fill={colors[i]} rx={3} />
                {/* Label */}
                <text x={pad.left - 4} y={y + barH / 2 + 4} textAnchor="end"
                  fill="currentColor" fillOpacity={0.7} fontSize={11} fontWeight={i === 0 ? 700 : 400}>
                  {r.name}
                </text>
                {/* Value */}
                <text x={cx + barWidth + 4} y={y + barH / 2 + 4}
                  fill="currentColor" fillOpacity={0.5} fontSize={10}>
                  ±{r.swing.toFixed(1)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Insight */}
      <div className="rounded-lg border p-4 mb-6 bg-primary/5 border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-bold text-primary">{results[0].name}</span> dominates output variability at ±{results[0].swing.toFixed(1)}%.
          Focus calibration effort here first. The bottom parameters contribute &lt;{results[results.length - 1].swing.toFixed(1)}% — fix them at defaults.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={exportTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Analysis
          </Button>
          <Link to="/chapter/11"><Button variant="ghost" size="sm" className="gap-2"><BookOpen className="w-4 h-4" /> Read Chapter 11</Button></Link>
        </div>
        <Link to="/micro-apps/genetic-algorithm-zoo">
          <Button size="sm" className="gap-2">Next: Genetic Algorithm Zoo <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </div>
    </Card>
  );
};
