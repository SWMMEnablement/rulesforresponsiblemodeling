import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const gaugePositions: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 30, y: 40 }, { x: 70, y: 60 }],
  3: [{ x: 25, y: 30 }, { x: 60, y: 50 }, { x: 40, y: 75 }],
  5: [{ x: 20, y: 20 }, { x: 75, y: 25 }, { x: 50, y: 50 }, { x: 25, y: 75 }, { x: 80, y: 78 }],
  8: [{ x: 15, y: 15 }, { x: 50, y: 15 }, { x: 85, y: 20 }, { x: 20, y: 50 }, { x: 55, y: 50 }, { x: 85, y: 55 }, { x: 30, y: 82 }, { x: 70, y: 80 }],
  10: [{ x: 12, y: 12 }, { x: 38, y: 10 }, { x: 65, y: 15 }, { x: 88, y: 18 }, { x: 15, y: 45 }, { x: 50, y: 42 }, { x: 82, y: 48 }, { x: 25, y: 78 }, { x: 55, y: 80 }, { x: 80, y: 82 }],
};

const getGauges = (count: number) => {
  const keys = Object.keys(gaugePositions).map(Number).sort((a, b) => a - b);
  const best = keys.reduce((prev, curr) => curr <= count ? curr : prev, keys[0]);
  return gaugePositions[best].slice(0, count);
};

export const RainGaugeDensity = () => {
  const [gauges, setGauges] = useState(3);
  const [subcatchments, setSubcatchments] = useState(50);

  const ratio = subcatchments / gauges;
  const maxRecommended = gauges * 5;
  const isOversubscribed = ratio > 5;

  const gaugePoints = useMemo(() => getGauges(gauges), [gauges]);

  // Storm cell position (moves across)
  const stormX = 30;
  const stormY = 35;
  const stormRadius = 18;

  const capturedGauges = gaugePoints.filter(
    g => Math.sqrt((g.x - stormX) ** 2 + (g.y - stormY) ** 2) < stormRadius + 10
  ).length;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🌧️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Rain Gauge Density</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>How many rain gauges do you need? James says: subcatchments should not exceed 3–5× gauge count. Ch. 6, 7, & 4.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Adjust gauge count and subcatchments to see spatial coverage and James's recommended ratios.
        </p>

        {/* Sliders */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Rain Gauges</span>
              <Badge variant="outline">{gauges}</Badge>
            </div>
            <Slider value={[gauges]} onValueChange={([v]) => setGauges(v)} min={1} max={10} step={1} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Subcatchments</span>
              <Badge variant="outline">{subcatchments}</Badge>
            </div>
            <Slider value={[subcatchments]} onValueChange={([v]) => setSubcatchments(v)} min={3} max={200} step={1} />
          </div>
        </div>

        {/* Watershed visualization */}
        <div className="relative bg-muted/20 rounded-xl border border-border mb-6 overflow-hidden" style={{ height: 220 }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Watershed boundary */}
            <ellipse cx="50" cy="50" rx="45" ry="42" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 1" />

            {/* Storm cell */}
            <circle cx={stormX} cy={stormY} r={stormRadius} fill="hsl(200, 80%, 50%)" opacity={0.15} />
            <circle cx={stormX} cy={stormY} r={stormRadius * 0.6} fill="hsl(200, 80%, 50%)" opacity={0.25} />
            <text x={stormX} y={stormY - stormRadius - 2} textAnchor="middle" fontSize="3" fill="hsl(var(--muted-foreground))">Storm Cell</text>

            {/* Gauges */}
            {gaugePoints.map((g, i) => {
              const isCapturing = Math.sqrt((g.x - stormX) ** 2 + (g.y - stormY) ** 2) < stormRadius + 10;
              return (
                <g key={i}>
                  <circle cx={g.x} cy={g.y} r="2.5" fill={isCapturing ? "hsl(150, 80%, 40%)" : "hsl(var(--primary))"} />
                  <circle cx={g.x} cy={g.y} r="8" fill="none" stroke={isCapturing ? "hsl(150, 80%, 40%)" : "hsl(var(--primary))"} strokeWidth="0.3" opacity={0.4} />
                  <text x={g.x} y={g.y + 5} textAnchor="middle" fontSize="2.5" fill="hsl(var(--muted-foreground))">G{i + 1}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Ratio analysis */}
        <div className={`p-4 rounded-lg mb-4 ${isOversubscribed ? "bg-destructive/10" : "bg-emerald-500/10"}`}>
          <div className="flex items-start gap-2">
            {isOversubscribed && <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />}
            <div>
              <p className="font-semibold text-sm text-foreground">
                Ratio: {Math.round(ratio)}:1 (Recommended max: 5:1)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isOversubscribed
                  ? `You have ${Math.round(ratio)} subcatchments per gauge. Most receive IDENTICAL rainfall. Reduce subcatchments to ≤${maxRecommended} or add more gauges.`
                  : `Good ratio. Each gauge supports ${Math.round(ratio)} subcatchments — spatial variability is adequately represented.`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Storm cell captured by {capturedGauges}/{gauges} gauge{capturedGauges !== 1 ? "s" : ""}.
                {capturedGauges === 0 ? " ⚠ Storm completely missed!" : capturedGauges === 1 ? " Minimal coverage." : " Good spatial capture."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/6">Ch. 6: Rain Input</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/7">Ch. 7: Dynamic Rain</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/4">Ch. 4: Optimal Complexity</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
