import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Eye, Download, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const CrystalBallTest = () => {
  const [confidence, setConfidence] = useState(50);
  const [dataQuality, setDataQuality] = useState(50);
  const [timeHorizon, setTimeHorizon] = useState(5);

  const analysis = useMemo(() => {
    // Uncertainty grows exponentially with confidence, shrinks with data, explodes with time
    const baseUncertainty = (confidence / 100) * (1 - dataQuality / 100);
    const timeMultiplier = Math.pow(1.3, timeHorizon);
    const totalUncertainty = Math.min(baseUncertainty * timeMultiplier * 100, 100);

    // Generate uncertainty cone data
    const points = Array.from({ length: 20 }, (_, i) => {
      const t = (i / 19) * timeHorizon;
      const spread = baseUncertainty * Math.pow(1.3, t) * 50;
      return {
        year: t,
        upper: 100 + spread,
        lower: Math.max(0, 100 - spread),
        central: 100,
      };
    });

    const riskLevel =
      totalUncertainty > 70 ? "critical" :
      totalUncertainty > 40 ? "warning" :
      "safe";

    const recommendation =
      riskLevel === "critical"
        ? "Your prediction confidence far exceeds what the data supports. Reduce scope or gather more data."
        : riskLevel === "warning"
        ? "Moderate risk. Consider additional validation events and sensitivity analysis."
        : "Predictions are reasonably supported by available data.";

    return { totalUncertainty, points, riskLevel, recommendation };
  }, [confidence, dataQuality, timeHorizon]);

  const exportTemplate = () => {
    const template = `# Model Scoping Template
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.1

## Project Parameters
- Stated Confidence Level: ${confidence}%
- Data Quality Rating: ${dataQuality}%
- Prediction Time Horizon: ${timeHorizon} years
- Estimated Uncertainty: ${analysis.totalUncertainty.toFixed(1)}%
- Risk Level: ${analysis.riskLevel.toUpperCase()}

## Recommendation
${analysis.recommendation}

## Required Actions Before Proceeding
${analysis.riskLevel === "critical" ? "- [ ] STOP: Reduce prediction confidence or increase data quality\n- [ ] Conduct independent peer review\n- [ ] Document uncertainty explicitly for stakeholders" : ""}
${analysis.riskLevel === "warning" ? "- [ ] Perform sensitivity analysis (Ch. 11)\n- [ ] Add validation events (Ch. 13)\n- [ ] Document assumptions" : ""}
- [ ] Define the specific decision this model must inform (Rule 1)
- [ ] Identify key stakeholders and their information needs
- [ ] Inventory available data sources and assess quality
- [ ] Document data gaps and their impact on model reliability

## James's Rule 1: Be Clear About the Purpose
"Always document the specific decisions the model will inform
before writing a single line of code."
`;
    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "model-scoping-template.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Scoping template downloaded!");
  };

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

  // SVG uncertainty cone
  const svgWidth = 600;
  const svgHeight = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const xScale = (v: number) => padding.left + (v / timeHorizon) * chartW;
  const yScale = (v: number) => padding.top + chartH - ((v / 200) * chartH);

  const upperPath = analysis.points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.year).toFixed(1)},${yScale(p.upper).toFixed(1)}`).join(" ");
  const lowerPath = analysis.points.map((p) => `L${xScale(p.year).toFixed(1)},${yScale(p.lower).toFixed(1)}`).reverse().join(" ");
  const conePath = `${upperPath} ${lowerPath} Z`;
  const centralLine = analysis.points.map((p, i) => `${i === 0 ? "M" : "L"}${xScale(p.year).toFixed(1)},${yScale(p.central).toFixed(1)}`).join(" ");

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Eye className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Crystal Ball Test</h2>
          <p className="text-sm text-muted-foreground">Chapter 1: Be Clear About the Purpose</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        How confident are you in your prediction? This tool shows how uncertainty explodes when confidence exceeds data quality.
      </p>

      {/* Controls */}
      <div className="grid sm:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Confidence in Prediction: <span className="text-primary font-bold">{confidence}%</span>
          </label>
          <Slider value={[confidence]} onValueChange={([v]) => setConfidence(v)} min={10} max={99} step={1} />
          <p className="text-xs text-muted-foreground mt-1">How certain are you in the result?</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Data Quality Available: <span className="text-primary font-bold">{dataQuality}%</span>
          </label>
          <Slider value={[dataQuality]} onValueChange={([v]) => setDataQuality(v)} min={5} max={99} step={1} />
          <p className="text-xs text-muted-foreground mt-1">Quality/completeness of your input data</p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Prediction Horizon: <span className="text-primary font-bold">{timeHorizon} years</span>
          </label>
          <Slider value={[timeHorizon]} onValueChange={([v]) => setTimeHorizon(v)} min={1} max={30} step={1} />
          <p className="text-xs text-muted-foreground mt-1">How far into the future?</p>
        </div>
      </div>

      {/* Uncertainty Cone Chart */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <h4 className="text-sm font-medium text-foreground mb-3">Uncertainty Cone</h4>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[600px] mx-auto">
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map(v => (
            <g key={v}>
              <line x1={padding.left} y1={yScale(v)} x2={svgWidth - padding.right} y2={yScale(v)}
                stroke="currentColor" strokeOpacity={0.1} strokeDasharray="4,4" />
              <text x={padding.left - 8} y={yScale(v) + 4} textAnchor="end"
                fill="currentColor" fillOpacity={0.4} fontSize={10}>{v}%</text>
            </g>
          ))}
          {/* X axis labels */}
          {Array.from({ length: Math.min(timeHorizon + 1, 7) }, (_, i) => {
            const yr = Math.round((i / 6) * timeHorizon);
            return (
              <text key={i} x={xScale(yr)} y={svgHeight - 8} textAnchor="middle"
                fill="currentColor" fillOpacity={0.4} fontSize={10}>Yr {yr}</text>
            );
          })}
          {/* Uncertainty cone */}
          <path d={conePath}
            fill={analysis.riskLevel === "critical" ? "rgba(239,68,68,0.15)" :
                  analysis.riskLevel === "warning" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)"}
            stroke="none" />
          {/* Central line */}
          <path d={centralLine} fill="none" stroke="currentColor" strokeOpacity={0.5}
            strokeWidth={1.5} strokeDasharray="6,4" />
          {/* Labels */}
          <text x={svgWidth - padding.right} y={yScale(analysis.points[analysis.points.length - 1].upper) - 6}
            textAnchor="end" fill="currentColor" fillOpacity={0.5} fontSize={9}>Upper bound</text>
          <text x={svgWidth - padding.right} y={yScale(analysis.points[analysis.points.length - 1].lower) + 14}
            textAnchor="end" fill="currentColor" fillOpacity={0.5} fontSize={9}>Lower bound</text>
        </svg>
      </div>

      {/* Risk Assessment */}
      <div className={`rounded-lg border p-4 mb-6 ${riskBg[analysis.riskLevel]}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${riskColors[analysis.riskLevel]}`} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold ${riskColors[analysis.riskLevel]}`}>
                {analysis.riskLevel === "critical" ? "CRITICAL RISK" :
                 analysis.riskLevel === "warning" ? "MODERATE RISK" : "ACCEPTABLE RISK"}
              </span>
              <Badge variant="outline" className="text-xs">
                Uncertainty: {analysis.totalUncertainty.toFixed(0)}%
              </Badge>
            </div>
            <p className="text-sm text-foreground">{analysis.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={exportTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Scoping Template
          </Button>
          <Link to="/chapter/1">
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Read Chapter 1
            </Button>
          </Link>
        </div>
        <Link to="/micro-apps/overfitting-simulator">
          <Button size="sm" className="gap-2">
            Next: Overfitting Simulator
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
