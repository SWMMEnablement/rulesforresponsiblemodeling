import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Archive, Download, BookOpen, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Criterion {
  name: string;
  category: "documentation" | "reproducibility" | "institutional";
  weight: number;
}

const criteria: Criterion[] = [
  { name: "Model purpose documented", category: "documentation", weight: 15 },
  { name: "Input data sources recorded", category: "documentation", weight: 12 },
  { name: "Calibration log exists", category: "documentation", weight: 10 },
  { name: "Parameter ranges justified", category: "reproducibility", weight: 10 },
  { name: "Version control in place", category: "reproducibility", weight: 12 },
  { name: "Results reproducible by third party", category: "reproducibility", weight: 15 },
  { name: "Successor modeler identified", category: "institutional", weight: 8 },
  { name: "Training materials available", category: "institutional", weight: 8 },
  { name: "Archive format is open-standard", category: "institutional", weight: 10 },
];

/**
 * Ch.17 — Legacy Saver (Model Handover Readiness Scorer)
 * Score your model's readiness to survive a staff change.
 */
export const LegacySaver = () => {
  const [scores, setScores] = useState<number[]>(criteria.map(() => 50));

  const updateScore = (idx: number, val: number) => {
    setScores(prev => { const n = [...prev]; n[idx] = val; return n; });
  };

  const analysis = useMemo(() => {
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);
    const weightedScore = criteria.reduce((s, c, i) => s + (scores[i] / 100) * c.weight, 0);
    const overallPct = (weightedScore / totalWeight) * 100;

    const byCategory = (cat: Criterion["category"]) => {
      const items = criteria.map((c, i) => ({ ...c, score: scores[i] })).filter(c => c.category === cat);
      const catWeight = items.reduce((s, c) => s + c.weight, 0);
      const catScore = items.reduce((s, c) => s + (c.score / 100) * c.weight, 0);
      return catWeight > 0 ? (catScore / catWeight) * 100 : 0;
    };

    const categories = {
      documentation: byCategory("documentation"),
      reproducibility: byCategory("reproducibility"),
      institutional: byCategory("institutional"),
    };

    const riskLevel = overallPct < 40 ? "critical" : overallPct < 70 ? "warning" : "safe";
    const busFactorMonths = overallPct < 30 ? 1 : overallPct < 60 ? 6 : overallPct < 80 ? 18 : 36;

    return { overallPct, categories, riskLevel, busFactorMonths };
  }, [scores]);

  const exportTemplate = () => {
    const txt = `# Model Handover Readiness Assessment
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.17

## Overall Readiness Score: ${analysis.overallPct.toFixed(0)}%
## Estimated "Bus Factor" Survival: ${analysis.busFactorMonths} months

## Category Scores
- Documentation: ${analysis.categories.documentation.toFixed(0)}%
- Reproducibility: ${analysis.categories.reproducibility.toFixed(0)}%
- Institutional Knowledge: ${analysis.categories.institutional.toFixed(0)}%

## Item-Level Scores
${criteria.map((c, i) => `- ${c.name}: ${scores[i]}% (weight: ${c.weight})`).join("\n")}

## Action Items
${analysis.riskLevel === "critical" ? "- URGENT: Model is at extreme risk of being lost during staff turnover\n- Create minimum viable documentation immediately\n- Identify and brief a backup modeler" : ""}
${analysis.riskLevel === "warning" ? "- Complete calibration documentation\n- Set up version control if not in place\n- Schedule knowledge-transfer session" : ""}
- Review and update documentation quarterly

## Rule 17: Plan for Your Model's Legacy
"A model that dies with its creator was never truly finished."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "handover-readiness-assessment.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Handover assessment downloaded!");
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

  const catLabels: Record<string, string> = {
    documentation: "Documentation",
    reproducibility: "Reproducibility",
    institutional: "Institutional Knowledge",
  };

  // Gauge SVG
  const gaugeAngle = (analysis.overallPct / 100) * 180;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Archive className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Legacy Saver</h2>
          <p className="text-sm text-muted-foreground">Chapter 17: Planning Your Model's Legacy</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Score your model's readiness to survive a staff change. How long would your model last without you?
      </p>

      {/* Gauge */}
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 200 120" className="w-48">
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={12} strokeLinecap="round" />
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none"
            stroke={analysis.riskLevel === "critical" ? "hsl(0 70% 50%)" : analysis.riskLevel === "warning" ? "hsl(40 90% 50%)" : "hsl(150 60% 45%)"}
            strokeWidth={12} strokeLinecap="round"
            strokeDasharray={`${(gaugeAngle / 180) * 251.3} 251.3`}
          />
          <text x="100" y="90" textAnchor="middle" fill="currentColor" fontSize={28} fontWeight={700}>
            {analysis.overallPct.toFixed(0)}%
          </text>
          <text x="100" y="110" textAnchor="middle" fill="currentColor" fillOpacity={0.5} fontSize={10}>
            Handover Readiness
          </text>
        </svg>
      </div>

      {/* Category bars */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {(Object.entries(analysis.categories) as [string, number][]).map(([cat, val]) => (
          <div key={cat} className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">{catLabels[cat]}</p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${val}%` }} />
            </div>
            <p className="text-right text-xs text-muted-foreground mt-1">{val.toFixed(0)}%</p>
          </div>
        ))}
      </div>

      {/* Criteria sliders */}
      <div className="space-y-3 mb-6">
        {criteria.map((c, i) => (
          <div key={c.name} className="flex items-center gap-3">
            {scores[i] >= 70 ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> :
             scores[i] < 30 ? <XCircle className="w-4 h-4 text-red-500 shrink-0" /> :
             <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
            <span className="text-sm text-foreground min-w-[180px] shrink-0">{c.name}</span>
            <Slider value={[scores[i]]} onValueChange={([v]) => updateScore(i, v)} min={0} max={100} step={5} className="flex-1" />
            <span className="text-xs text-muted-foreground w-10 text-right">{scores[i]}%</span>
          </div>
        ))}
      </div>

      {/* Risk */}
      <div className={`rounded-lg border p-4 mb-6 ${riskBg[analysis.riskLevel]}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${riskColors[analysis.riskLevel]}`} />
          <div>
            <span className={`font-bold ${riskColors[analysis.riskLevel]}`}>
              Bus Factor: ~{analysis.busFactorMonths} months
            </span>
            <p className="text-sm text-foreground mt-1">
              {analysis.riskLevel === "critical"
                ? "Your model would likely be abandoned within weeks of your departure."
                : analysis.riskLevel === "warning"
                ? "Some knowledge transfer exists, but critical gaps remain."
                : "Strong handover readiness — the model can survive staff changes."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={exportTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Assessment
          </Button>
          <Link to="/chapter/17"><Button variant="ghost" size="sm" className="gap-2"><BookOpen className="w-4 h-4" /> Read Chapter 17</Button></Link>
        </div>
        <Link to="/micro-apps">
          <Button size="sm" variant="outline">View All Micro-Apps</Button>
        </Link>
      </div>
    </Card>
  );
};
