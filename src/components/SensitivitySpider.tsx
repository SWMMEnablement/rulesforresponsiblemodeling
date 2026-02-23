import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const parameters = [
  { name: "Imperviousness", sensitivity: 28, color: "hsl(200 90% 45%)" },
  { name: "Manning's n", sensitivity: 18, color: "hsl(160 70% 40%)" },
  { name: "Width", sensitivity: 14, color: "hsl(45 90% 50%)" },
  { name: "Depression Storage", sensitivity: 11, color: "hsl(280 70% 50%)" },
  { name: "Slope", sensitivity: 6, color: "hsl(20 90% 50%)" },
  { name: "Conduit Roughness", sensitivity: 5, color: "hsl(340 70% 50%)" },
  { name: "Drying Time", sensitivity: 3, color: "hsl(100 50% 40%)" },
];

export const SensitivitySpider = () => {
  const [perturbation, setPerturbation] = useState(25);

  const scaledParams = useMemo(
    () => parameters.map((p) => ({
      ...p,
      impact: Math.round(p.sensitivity * (perturbation / 25)),
    })).sort((a, b) => b.impact - a.impact),
    [perturbation]
  );

  const maxImpact = Math.max(...scaledParams.map((p) => p.impact));

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🕸️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Sensitivity Tornado</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Shows which parameters actually control your model output. Focus calibration on the top parameters — the rest barely matter. Based on Chapters 11 and 12.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Change each parameter by ±X% and measure the impact on peak flow.
        </p>

        <div className="mb-6 max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Parameter Perturbation</span>
            <Badge variant="outline">±{perturbation}%</Badge>
          </div>
          <Slider value={[perturbation]} onValueChange={([v]) => setPerturbation(v)} min={5} max={50} step={5} />
        </div>

        {/* Tornado chart */}
        <div className="space-y-3 mb-6">
          <div className="flex text-xs text-muted-foreground">
            <span className="w-32 sm:w-40 shrink-0" />
            <div className="flex-1 flex justify-between">
              <span>-{Math.round(maxImpact * 1.2)}%</span>
              <span>0%</span>
              <span>+{Math.round(maxImpact * 1.2)}%</span>
            </div>
          </div>
          {scaledParams.map((param, i) => {
            const barWidth = (param.impact / (maxImpact * 1.2)) * 50;
            return (
              <div key={param.name} className="flex items-center gap-2">
                <span className="w-32 sm:w-40 shrink-0 text-sm text-foreground font-medium truncate flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  {param.name}
                </span>
                <div className="flex-1 relative h-6">
                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 w-px h-full bg-border" />
                  {/* Left bar (negative) */}
                  <div
                    className="absolute right-1/2 top-0.5 h-5 rounded-l transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: param.color,
                      opacity: 0.7,
                    }}
                  />
                  {/* Right bar (positive) */}
                  <div
                    className="absolute left-1/2 top-0.5 h-5 rounded-r transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: param.color,
                      opacity: 0.7,
                    }}
                  />
                  {/* Impact label */}
                  <span
                    className="absolute text-xs font-mono font-medium transition-all duration-500"
                    style={{
                      right: `${50 - barWidth - 2}%`,
                      top: "2px",
                      color: param.color,
                    }}
                  >
                    ±{param.impact}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="font-semibold text-sm text-foreground mb-1">Key Insight</p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{scaledParams[0].name}</strong> dominates with ±{scaledParams[0].impact}% impact. {" "}
            <strong className="text-foreground">{scaledParams[scaledParams.length - 1].name}</strong> has only ±{scaledParams[scaledParams.length - 1].impact}% impact. {" "}
            Spending time calibrating {scaledParams[scaledParams.length - 1].name.toLowerCase()} is wasted effort — it doesn't change the answer.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Focus calibration on parameters 1–3. Parameters 5–7 have minimal impact on results.
          </p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/11">Ch. 11: Sensitivity Analysis</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/12">Ch. 12: State Variables</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
