import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, Play, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ParamPoint { n: number; imp: number; iteration: number }

const generateDancePath = (): ParamPoint[] => {
  const path: ParamPoint[] = [
    { n: 0.020, imp: 50, iteration: 0 },
    { n: 0.016, imp: 50, iteration: 1 },
    { n: 0.016, imp: 62, iteration: 2 },
    { n: 0.014, imp: 62, iteration: 3 },
    { n: 0.014, imp: 68, iteration: 4 },
    { n: 0.013, imp: 68, iteration: 5 },
    { n: 0.013, imp: 70, iteration: 6 },
    { n: 0.0125, imp: 70, iteration: 7 },
    { n: 0.0125, imp: 71, iteration: 8 },
  ];
  return path;
};

const nToY = (n: number) => ((0.022 - n) / 0.014) * 200;
const impToX = (imp: number) => ((imp - 45) / 45) * 280;

export const CalibrationDance = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const path = generateDancePath();

  useEffect(() => {
    if (isPlaying && step < path.length - 1) {
      timerRef.current = setTimeout(() => setStep(s => s + 1), 800);
    } else if (step >= path.length - 1) {
      setIsPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, step, path.length]);

  const reset = () => { setStep(0); setIsPlaying(false); };
  const current = path[step];

  const adjustmentText = step === 0
    ? "Starting point — parameters at initial estimates"
    : step % 2 === 1
    ? `Adjusted Manning's n to improve timing → peak is now wrong`
    : `Adjusted imperviousness to fix peak → timing shifts again`;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">💃</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">The Calibration Dance</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Adjusting one parameter forces changes to others. Watch parameters "dance" toward convergence — or compensating errors. Ch. 12 & 14.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Watch how calibrating one parameter forces re-adjustment of others, creating a "dance" through parameter space.
        </p>

        {/* Controls */}
        <div className="flex gap-2 mb-6">
          <Button size="sm" onClick={() => setIsPlaying(true)} disabled={isPlaying || step >= path.length - 1}>
            <Play className="w-4 h-4" /> Play
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
          <Badge variant="outline">Iteration {step}/{path.length - 1}</Badge>
        </div>

        {/* Parameter space visualization */}
        <div className="relative bg-muted/30 rounded-lg p-4 mb-6 overflow-hidden" style={{ height: 260 }}>
          {/* Axes */}
          <div className="absolute bottom-8 left-12 right-4 h-px bg-border" />
          <div className="absolute bottom-8 left-12 top-4 w-px bg-border" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">Imperviousness (%)</span>
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-muted-foreground">Manning's n</span>

          {/* Axis labels */}
          <span className="absolute bottom-4 left-10 text-[9px] text-muted-foreground">50%</span>
          <span className="absolute bottom-4 right-2 text-[9px] text-muted-foreground">90%</span>
          <span className="absolute top-2 left-1 text-[9px] text-muted-foreground">0.022</span>
          <span className="absolute bottom-10 left-1 text-[9px] text-muted-foreground">0.008</span>

          {/* Path lines */}
          {path.slice(0, step + 1).map((p, i) => {
            if (i === 0) return null;
            const prev = path[i - 1];
            return (
              <line
                key={i}
                x1={impToX(prev.imp) + 48}
                y1={nToY(prev.n) + 16}
                x2={impToX(p.imp) + 48}
                y2={nToY(p.n) + 16}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray={i % 2 === 1 ? "4 2" : "none"}
                style={{ position: "absolute" }}
              />
            );
          })}

          {/* SVG overlay for path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 260" preserveAspectRatio="none">
            {path.slice(0, step + 1).map((p, i) => {
              if (i === 0) return null;
              const prev = path[i - 1];
              return (
                <line
                  key={i}
                  x1={impToX(prev.imp) + 48} y1={nToY(prev.n) + 16}
                  x2={impToX(p.imp) + 48} y2={nToY(p.n) + 16}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  opacity={0.5}
                  strokeDasharray={i % 2 === 1 ? "4 2" : ""}
                />
              );
            })}
            {path.slice(0, step + 1).map((p, i) => (
              <circle
                key={i}
                cx={impToX(p.imp) + 48} cy={nToY(p.n) + 16}
                r={i === step ? 6 : 3}
                fill={i === step ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                opacity={i === step ? 1 : 0.4}
              />
            ))}
          </svg>
        </div>

        {/* Current state */}
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-lg border border-border text-center">
            <p className="text-xs text-muted-foreground">Manning's n</p>
            <p className="text-lg font-bold text-foreground">{current.n.toFixed(4)}</p>
          </div>
          <div className="p-3 rounded-lg border border-border text-center">
            <p className="text-xs text-muted-foreground">Imperviousness</p>
            <p className="text-lg font-bold text-foreground">{current.imp}%</p>
          </div>
          <div className="p-3 rounded-lg border border-border text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-xs font-medium text-foreground mt-1">{adjustmentText}</p>
          </div>
        </div>

        {step >= path.length - 1 && (
          <div className="p-4 rounded-lg bg-amber-500/10 mb-4">
            <p className="text-sm font-semibold text-foreground">Parameters converged — but are they physically correct?</p>
            <p className="text-xs text-muted-foreground mt-1">
              The parameters may have compensated for each other's errors. A good fit doesn't mean correct physics.
              Use independent data (field measurements, literature values) to verify parameter reasonableness.
            </p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/12">Ch. 12: State Variable Space</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/14">Ch. 14: Parameter Optimization</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
