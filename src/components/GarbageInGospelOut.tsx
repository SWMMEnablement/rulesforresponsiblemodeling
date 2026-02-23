import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { HelpCircle, AlertTriangle, ArrowDown, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const phases = [
  {
    title: "INPUT DATA",
    icon: "📥",
    items: [
      { label: "Topography", status: "warn", detail: "15 years old" },
      { label: "Land use", status: "warn", detail: "10 years old" },
      { label: "Pipe data", status: "ok", detail: "Recent survey" },
      { label: "Rainfall", status: "ok", detail: "Current gauge" },
      { label: "Soil data", status: "warn", detail: "County average" },
    ],
    quality: "Mixed quality",
  },
  {
    title: "MODEL PROCESSING",
    icon: "⚙️",
    description: "Thousands of equations, millions of timesteps. Nobody can see inside. The errors are HIDDEN.",
  },
  {
    title: "MODEL OUTPUT",
    icon: "📊",
    peakFlow: 47.342816,
    actualRange: { low: 19, high: 76 },
    uncertainty: 60,
  },
  {
    title: "CONSEQUENCE",
    icon: "🌊",
    realPeak: 68,
    designPeak: 47.3,
    floodCost: "$2.3M",
    dataCost: "$15K",
  },
];

export const GarbageInGospelOut = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showUncertainty, setShowUncertainty] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = () => {
    setIsAnimating(true);
    setCurrentPhase(0);
    setShowUncertainty(false);
    const delays = [0, 1500, 3000, 4500];
    delays.forEach((delay, i) => {
      setTimeout(() => setCurrentPhase(i), delay);
    });
    setTimeout(() => setIsAnimating(false), 5000);
  };

  useEffect(() => {
    runAnimation();
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-lg">💀</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Garbage In, Gospel Out</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>The REAL danger isn't "Garbage In, Garbage Out" — it's when bad data produces plausible-looking results that nobody questions. Based on Chapters 3, 10, and 17.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Watch how questionable input data flows through a model and produces dangerously precise-looking output.
        </p>

        <div className="space-y-4">
          {/* Phase 0: Input */}
          <div className={`border rounded-lg p-4 transition-all duration-700 ${currentPhase >= 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📥</span>
              <h3 className="font-semibold text-foreground text-sm">INPUT DATA</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {phases[0].items.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs">
                  {item.status === "ok" ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                  )}
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">— {item.detail}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-2 bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full w-[55%] bg-amber-500/60 rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall: Mixed quality</p>
          </div>

          {currentPhase >= 0 && <ArrowDown className={`w-5 h-5 text-muted-foreground mx-auto transition-all duration-500 ${currentPhase >= 1 ? "opacity-100" : "opacity-30"}`} />}

          {/* Phase 1: Model */}
          <div className={`border rounded-lg p-4 transition-all duration-700 ${currentPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} bg-muted/20`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚙️</span>
              <h3 className="font-semibold text-foreground text-sm">MODEL PROCESSING</h3>
            </div>
            <div className="text-center py-4 font-mono text-xs text-muted-foreground space-y-1">
              <p>░░░ SWMM5 / ICM ░░░░░░░</p>
              <p>Thousands of equations</p>
              <p>Millions of timesteps</p>
              <p className="text-foreground font-semibold mt-2">Nobody can see inside.</p>
              <p className="text-amber-500">The errors are HIDDEN.</p>
            </div>
          </div>

          {currentPhase >= 1 && <ArrowDown className={`w-5 h-5 text-muted-foreground mx-auto transition-all duration-500 ${currentPhase >= 2 ? "opacity-100" : "opacity-30"}`} />}

          {/* Phase 2: Output */}
          <div className={`border rounded-lg p-4 transition-all duration-700 ${currentPhase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h3 className="font-semibold text-foreground text-sm">MODEL OUTPUT</h3>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="show-uncertainty" checked={showUncertainty} onCheckedChange={setShowUncertainty} />
                <Label htmlFor="show-uncertainty" className="text-xs flex items-center gap-1">
                  {showUncertainty ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  Show uncertainty
                </Label>
              </div>
            </div>

            {!showUncertainty ? (
              <div className="space-y-2">
                <div className="font-mono text-lg text-foreground text-center py-3 bg-muted/30 rounded">
                  Peak Flow: <span className="text-primary font-bold">47.342816 CFS</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  6 decimal places. Looks <span className="text-foreground font-medium">precise</span>. Looks <span className="text-foreground font-medium">trustworthy</span>.
                </p>
                <p className="text-xs text-center text-destructive font-medium">
                  This precision is a LIE.
                </p>
              </div>
            ) : (
              <div className="space-y-2 animate-fade-in">
                <div className="font-mono text-lg text-foreground text-center py-3 bg-destructive/10 rounded border-2 border-destructive/30">
                  Peak Flow: <span className="font-bold">~47 CFS</span>
                  <span className="text-destructive font-bold"> (±60%)</span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground font-medium">Range: 19–76 CFS</p>
                  <p className="text-xs text-muted-foreground mt-1">That is a <strong className="text-destructive">4:1 range</strong></p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2 bg-muted/30 rounded text-center">
                    <p className="text-muted-foreground">At 47 CFS: 36" pipe</p>
                    <p className="text-foreground font-medium">Saves $200K</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded text-center">
                    <p className="text-muted-foreground">At 76 CFS: 48" pipe</p>
                    <p className="text-foreground font-medium">Costs $200K more</p>
                  </div>
                </div>
                <p className="text-xs text-center text-primary font-medium mt-2">
                  Which decision is responsible?
                </p>
              </div>
            )}
          </div>

          {currentPhase >= 2 && <ArrowDown className={`w-5 h-5 text-muted-foreground mx-auto transition-all duration-500 ${currentPhase >= 3 ? "opacity-100" : "opacity-30"}`} />}

          {/* Phase 3: Consequence */}
          <div className={`border-2 border-destructive/30 rounded-lg p-4 transition-all duration-700 ${currentPhase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} bg-destructive/5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🌊</span>
              <h3 className="font-semibold text-destructive text-sm">THE CONSEQUENCE</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">Reality: Peak flow was <strong>68 CFS</strong></p>
              <p className="text-muted-foreground">Pipe designed for 47.3 CFS <span className="text-destructive font-medium">surcharges and floods</span></p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-center">
                <div className="p-2 bg-destructive/10 rounded">
                  <p className="text-destructive font-bold">$2.3M</p>
                  <p className="text-muted-foreground">Flood damage</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded">
                  <p className="text-emerald-500 font-bold">$15K</p>
                  <p className="text-muted-foreground">Data update cost</p>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded">
                  <p className="text-emerald-500 font-bold">$0</p>
                  <p className="text-muted-foreground">Uncertainty analysis</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2 italic">
                The most dangerous model is one that LOOKS right.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6 flex-wrap">
          <Button variant="outline" size="sm" onClick={runAnimation} disabled={isAnimating}>
            Replay Animation
          </Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/3">Ch. 3: Input Reliability</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/10">Ch. 10: Uncertainty</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/17">Ch. 17: Conclusions</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
