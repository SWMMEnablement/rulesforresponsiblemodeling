import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CheckItem {
  id: string;
  label: string;
  beforeText: string;
  afterText: string;
}

const checklistItems: CheckItem[] = [
  {
    id: "calibration",
    label: "Calibration metrics",
    beforeText: "The model was calibrated to three storm events.",
    afterText: "Calibrated to Oct 2022, Mar 2023, Jul 2023. NSE: 0.84, R²: 0.91, PBIAS: -3%.",
  },
  {
    id: "validation",
    label: "Validation results (separate from calibration)",
    beforeText: "(not mentioned)",
    afterText: "Validated against Sep 2023, Nov 2023. NSE: 0.72, R²: 0.83. Performance drops moderately.",
  },
  {
    id: "sensitivity",
    label: "Sensitivity analysis",
    beforeText: "(not included)",
    afterText: "Imperviousness (±28%) and Manning's n (±18%) are dominant. Drying time has <3% impact.",
  },
  {
    id: "uncertainty",
    label: "Uncertainty range",
    beforeText: "Peak flows range from 23 to 187 CFS.",
    afterText: "Peak flow at outfall: 47 CFS. 90% CI: 28–72 CFS. Pipe sized for upper bound.",
  },
  {
    id: "dataquality",
    label: "Data quality statement",
    beforeText: "(not mentioned)",
    afterText: "Topo from 2021 (current). Land use verified against 2023 aerial. Pipes from 2019 CCTV.",
  },
  {
    id: "limitations",
    label: "Limitations disclosure",
    beforeText: "(not mentioned)",
    afterText: "Model not validated for storms >10yr. 100-year predictions are extrapolated.",
  },
  {
    id: "confidence",
    label: "Confidence assessment",
    beforeText: "(not mentioned)",
    afterText: "High confidence for 2–10yr events. Low confidence for 100yr. See Section 5.3.",
  },
];

export const ReportCard = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const score = checked.size;
  const pct = Math.round((score / checklistItems.length) * 100);
  const grade = pct >= 90 ? "A" : pct >= 70 ? "B" : pct >= 50 ? "C" : pct >= 30 ? "D" : "F";
  const gradeColor = pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-destructive";

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Model Report Card</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Grade your modeling report against James's standards. Does it include everything a responsible report should? Ch. 17.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Check each item your report includes and watch it transform from a typical report to a responsible one.
        </p>

        {/* Grade display */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-xl ${gradeColor} flex items-center justify-center text-white font-bold text-2xl transition-all duration-500`}>
            {grade}
          </div>
          <div className="flex-1">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${gradeColor} transition-all duration-500 rounded-full`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{score}/{checklistItems.length} items — {pct}%</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2 mb-6">
          {checklistItems.map(item => {
            const isChecked = checked.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${isChecked ? "border-emerald-500/50 bg-emerald-500/5" : "border-border hover:border-primary/30"}`}
              >
                <div className="flex items-start gap-3">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className={`text-xs mt-1 transition-all duration-300 ${isChecked ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {isChecked ? item.afterText : item.beforeText}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {score === checklistItems.length && (
          <div className="p-4 rounded-lg bg-emerald-500/10 mb-4">
            <p className="text-sm font-semibold text-foreground">🎉 Perfect score! This is a responsible modeling report.</p>
            <p className="text-xs text-muted-foreground mt-1">Every section adds transparency, builds trust, and protects both the modeler and the client.</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/17">Ch. 17: Conclusions</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/13">Ch. 13: Performance Evaluation</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
