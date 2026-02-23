import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const zones = [
  { maxReturn: 5, label: "Well-calibrated", color: "bg-emerald-500", textColor: "text-emerald-500", icon: "🟢", uncertaintyMult: 0.15, description: "Model well-calibrated for events of this magnitude. Multiple calibration events at this scale available." },
  { maxReturn: 10, label: "Moderate extrapolation", color: "bg-amber-400", textColor: "text-amber-500", icon: "🟡", uncertaintyMult: 0.3, description: "Model extrapolating somewhat beyond calibration. Some validation data exists." },
  { maxReturn: 25, label: "Significant extrapolation", color: "bg-orange-500", textColor: "text-orange-500", icon: "🟠", uncertaintyMult: 0.5, description: "Significant extrapolation. No calibration data at this scale. Surcharge behavior unvalidated." },
  { maxReturn: 100, label: "Major extrapolation", color: "bg-destructive", textColor: "text-destructive", icon: "🔴", uncertaintyMult: 0.7, description: "Major extrapolation far beyond calibrated range. Flooding behavior uncertain." },
  { maxReturn: 9999, label: "Pure speculation", color: "bg-foreground", textColor: "text-foreground", icon: "⚫", uncertaintyMult: 0.9, description: "Pure extrapolation. Model was never designed for this. Results are speculative." },
];

const returnPeriods = [2, 5, 10, 25, 50, 100, 200, 500];

export const ConfidenceZones = () => {
  const [returnPeriod, setReturnPeriod] = useState(10);
  const [calRange, setCalRange] = useState(5); // max return period of cal events

  const currentZone = zones.find((z) => {
    const ratio = returnPeriod / calRange;
    if (ratio <= 1) return z.maxReturn === 5;
    if (ratio <= 2) return z.maxReturn === 10;
    if (ratio <= 5) return z.maxReturn === 25;
    if (ratio <= 20) return z.maxReturn === 100;
    return z.maxReturn === 9999;
  }) || zones[zones.length - 1];

  const basePeak = 30 + returnPeriod * 0.8 + Math.sqrt(returnPeriod) * 10;
  const peakFlow = Math.round(basePeak);
  const uncertainty = currentZone.uncertaintyMult;
  const low = Math.round(peakFlow * (1 - uncertainty));
  const high = Math.round(peakFlow * (1 + uncertainty));
  const ratio = (high / low).toFixed(1);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🚦</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Model Confidence Zones</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Shows how model confidence drops as you extrapolate beyond the calibration range. Most models are calibrated to 2–5 year events but used for 100-year predictions. Based on Chapters 10 and 16.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Increase the design storm return period and watch confidence collapse.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">Design Storm Return Period</span>
              <Badge variant="outline">{returnPeriod}-year</Badge>
            </div>
            <Slider
              value={[returnPeriods.indexOf(returnPeriod)]}
              onValueChange={([v]) => setReturnPeriod(returnPeriods[v])}
              min={0}
              max={returnPeriods.length - 1}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2-yr</span><span>500-yr</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground flex items-center gap-1">
                Max Calibration Event
                <Tooltip>
                  <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                  <TooltipContent className="max-w-xs"><p>The largest storm event your model was calibrated against. Everything beyond this is extrapolation.</p></TooltipContent>
                </Tooltip>
              </span>
              <Badge variant="outline">~{calRange}-year</Badge>
            </div>
            <Slider
              value={[returnPeriods.indexOf(calRange) >= 0 ? returnPeriods.indexOf(calRange) : 1]}
              onValueChange={([v]) => setCalRange(returnPeriods[v])}
              min={0}
              max={4}
              step={1}
            />
          </div>
        </div>

        {/* Zone display */}
        <div className="mb-6">
          {/* Traffic light bar */}
          <div className="flex h-6 rounded-full overflow-hidden mb-3">
            {zones.map((zone, i) => (
              <div
                key={i}
                className={`flex-1 ${zone.color} transition-all duration-300`}
                style={{ opacity: zone === currentZone ? 1 : 0.2 }}
              />
            ))}
          </div>

          <div className={`p-4 rounded-lg transition-all duration-500`} style={{ backgroundColor: `${currentZone.color === "bg-emerald-500" ? "rgba(16,185,129,0.1)" : currentZone.color === "bg-amber-400" ? "rgba(251,191,36,0.1)" : currentZone.color === "bg-orange-500" ? "rgba(249,115,22,0.1)" : "rgba(239,68,68,0.1)"}` }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{currentZone.icon}</span>
              <div>
                <p className={`font-semibold text-sm ${currentZone.textColor}`}>
                  {currentZone.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{currentZone.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction with uncertainty */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Peak Flow Estimate</p>
            <p className="text-2xl font-bold text-foreground">{peakFlow} CFS</p>
            <p className={`text-sm font-medium ${currentZone.textColor}`}>±{Math.round(uncertainty * 100)}%</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Plausible Range</p>
            <p className="text-2xl font-bold text-foreground">{low}–{high} CFS</p>
            <p className="text-sm text-muted-foreground">{ratio}:1 range</p>
          </div>
        </div>

        {returnPeriod > calRange * 5 && (
          <div className="p-3 rounded bg-destructive/10 text-sm text-muted-foreground mb-4 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-destructive inline mr-1" />
            Your {returnPeriod}-year prediction is {Math.round(returnPeriod / calRange)}× beyond calibration range. Consider this an order-of-magnitude estimate, not a design value.
          </div>
        )}

        <p className="text-xs text-muted-foreground italic mb-4">
          "Most models are calibrated to 2–5 year events but used to predict 100-year events. The gap between calibration range and application range is the gap between confidence and speculation."
        </p>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/10">Ch. 10: Uncertainty</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/16">Ch. 16: Real-Time Uncertainty</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
