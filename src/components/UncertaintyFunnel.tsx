import { useState, useMemo, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, AlertTriangle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const stages = [
  { label: "Input Data", sublabel: "Rainfall, topography, land use", color: "hsl(200 90% 45%)" },
  { label: "Model Processing", sublabel: "Equations, parameters, timesteps", color: "hsl(45 90% 50%)" },
  { label: "Output Predictions", sublabel: "Peak flows, volumes, depths", color: "hsl(0 84% 55%)" },
];

export const UncertaintyFunnel = () => {
  const [inputUncertainty, setInputUncertainty] = useState(15);
  const [animPhase, setAnimPhase] = useState(0);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modelUncertainty = useMemo(() => inputUncertainty * 1.6, [inputUncertainty]);
  const outputUncertainty = useMemo(() => {
    const combined = Math.sqrt(inputUncertainty ** 2 + modelUncertainty ** 2) * 1.3;
    return Math.min(95, Math.round(combined));
  }, [inputUncertainty, modelUncertainty]);

  const peakFlow = 47;
  const lowBound = Math.round(peakFlow * (1 - outputUncertainty / 100));
  const highBound = Math.round(peakFlow * (1 + outputUncertainty / 100));

  useEffect(() => {
    setAnimPhase(0);
    const t1 = setTimeout(() => setAnimPhase(1), 400);
    const t2 = setTimeout(() => setAnimPhase(2), 900);
    const t3 = setTimeout(() => setAnimPhase(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inputUncertainty]);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🔬</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Uncertainty Propagation Funnel</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Shows how uncertainty grows through each modeling stage. Small input errors can produce massive output uncertainty. Based on Chapters 3, 10, and 17.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Adjust input data uncertainty and watch how it amplifies through the modeling pipeline.
        </p>

        {/* Slider */}
        <div className="mb-8 max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground flex items-center gap-1">
              Input Data Uncertainty
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Combined uncertainty from rainfall depth, topography age, land use accuracy, and soil properties.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">±{inputUncertainty}%</Badge>
          </div>
          <Slider value={[inputUncertainty]} onValueChange={([v]) => setInputUncertainty(v)} min={5} max={40} step={1} />
        </div>

        {/* Funnel Visualization */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
          {stages.map((stage, i) => {
            const uncertainty = i === 0 ? inputUncertainty : i === 1 ? Math.round(modelUncertainty) : outputUncertainty;
            const width = 30 + uncertainty * 1.5;
            const isVisible = animPhase > i;

            return (
              <div key={stage.label} className="flex-1 flex flex-col items-center gap-2">
                {i > 0 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground hidden sm:block absolute -left-3 top-1/2" style={{ position: "relative" }} />
                )}
                <div
                  className="relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all duration-700 ease-out"
                  style={{
                    borderColor: stage.color,
                    backgroundColor: `${stage.color}10`,
                    opacity: isVisible ? 1 : 0.2,
                    transform: isVisible ? "scale(1)" : "scale(0.9)",
                    minHeight: "120px",
                  }}
                >
                  {/* Uncertainty bar visualization */}
                  <div className="relative w-full h-8 mb-3 rounded-full overflow-hidden bg-muted/30">
                    <div
                      className="absolute top-0 h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        backgroundColor: stage.color,
                        opacity: 0.3,
                        width: isVisible ? `${Math.min(100, width)}%` : "10%",
                        left: `${Math.max(0, 50 - width / 2)}%`,
                      }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 transition-all duration-700"
                      style={{
                        backgroundColor: stage.color,
                        left: "50%",
                      }}
                    />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{stage.label}</span>
                  <span className="text-xs text-muted-foreground">{stage.sublabel}</span>
                  <Badge
                    className="mt-2 transition-all duration-500"
                    variant={uncertainty > 40 ? "destructive" : uncertainty > 20 ? "secondary" : "outline"}
                  >
                    ±{uncertainty}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Output interpretation */}
        <div className={`p-4 rounded-lg transition-all duration-500 ${outputUncertainty > 50 ? "bg-destructive/10" : outputUncertainty > 30 ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
          <div className="flex items-start gap-2">
            {outputUncertainty > 40 && <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />}
            <div>
              <p className="font-semibold text-sm text-foreground">
                Peak Flow: {peakFlow} CFS → Range: {lowBound}–{highBound} CFS
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {outputUncertainty > 50
                  ? `A ${Math.round(highBound / lowBound)}:1 range. Your client sees "${peakFlow} CFS" but reality could be anywhere in that range. This is "Gospel Out."`
                  : outputUncertainty > 30
                  ? "Significant uncertainty — results should be reported with confidence intervals."
                  : "Manageable uncertainty — good data quality supports reliable predictions."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Reducing input uncertainty from ±{inputUncertainty}% to ±{Math.max(5, inputUncertainty - 10)}% would reduce output uncertainty to ±{Math.round(Math.sqrt(Math.max(5, inputUncertainty - 10) ** 2 + (Math.max(5, inputUncertainty - 10) * 1.6) ** 2) * 1.3)}%. <strong>Data quality matters.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/3">Ch. 3: Input Reliability</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/10">Ch. 10: Uncertainty</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/17">Ch. 17: Conclusions</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
