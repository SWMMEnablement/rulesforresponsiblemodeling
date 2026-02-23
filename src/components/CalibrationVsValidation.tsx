import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { HelpCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const generateData = (seed: number, noise: number, n: number) => {
  const points = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = Math.sin(t * Math.PI * 2) * 40 + 50 + Math.sin(t * Math.PI * 4) * 15;
    const noiseVal = (Math.sin(seed * 13.7 + i * 7.3) * 0.5 + Math.cos(seed * 5.1 + i * 11.9) * 0.5) * noise;
    points.push(Math.max(5, Math.min(95, base + noiseVal)));
  }
  return points;
};

export const CalibrationVsValidation = () => {
  const [numParams, setNumParams] = useState(15);
  const [animStep, setAnimStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const n = 20;
  const calObserved = generateData(1, 12, n);
  const valObserved = generateData(2, 12, n);

  const overfitFactor = Math.min(1, numParams / 50);
  const calNSE = 0.55 + overfitFactor * 0.42;
  const valNSE = 0.75 - overfitFactor * 0.45;

  const calModel = calObserved.map((v, i) => {
    const error = (1 - overfitFactor) * (Math.sin(i * 3.7) * 10);
    return v + error;
  });

  const valModel = valObserved.map((v, i) => {
    const error = overfitFactor * (Math.sin(i * 5.3 + 2) * 25) + (1 - overfitFactor) * (Math.sin(i * 3.7) * 8);
    return v + error;
  });

  const runAnimation = () => {
    setIsRunning(true);
    setAnimStep(0);
    const steps = [500, 1200, 2000, 2800];
    steps.forEach((delay, i) => {
      setTimeout(() => setAnimStep(i + 1), delay);
    });
    setTimeout(() => setIsRunning(false), 3500);
  };

  const svgWidth = 280;
  const svgHeight = 120;
  const pointsToPath = (points: number[]) => {
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * svgWidth;
      const y = svgHeight - (p / 100) * svgHeight;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
  };

  const isOverfit = numParams > 25;
  const gapNSE = Math.abs(calNSE - valNSE);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">⚖️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Calibration vs. Validation</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Demonstrates how adding too many parameters can make calibration look great while validation collapses. The simpler model is often more reliable. Based on Chapters 9, 13, and 14.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Adjust calibration parameters and watch how calibration fit improves while validation fit may collapse.
        </p>

        {/* Parameter slider */}
        <div className="mb-6 max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground flex items-center gap-1">
              Calibration Parameters
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Free parameters adjusted during calibration. More parameters = better calibration fit but higher overfitting risk.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{numParams}</Badge>
          </div>
          <Slider value={[numParams]} onValueChange={([v]) => setNumParams(v)} min={3} max={50} step={1} />
        </div>

        {/* Split screen */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Calibration panel */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-1">Calibration Data</h3>
            <p className="text-xs text-muted-foreground mb-3">Data the model was trained on</p>
            <div className="bg-muted/30 rounded p-2 mb-3">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24">
                {/* Observed dots */}
                {calObserved.map((p, i) => (
                  <circle
                    key={i}
                    cx={(i / (n - 1)) * svgWidth}
                    cy={svgHeight - (p / 100) * svgHeight}
                    r={3}
                    fill="hsl(200 90% 45%)"
                    opacity={0.7}
                  />
                ))}
                {/* Model line */}
                <path
                  d={pointsToPath(calModel)}
                  fill="none"
                  stroke="hsl(0 84% 55%)"
                  strokeWidth={2}
                  opacity={0.8}
                />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">NSE:</span>
              <Badge variant={calNSE > 0.8 ? "default" : "secondary"} className="text-xs">
                {calNSE.toFixed(2)} {calNSE > 0.9 ? "🎯" : calNSE > 0.8 ? "✓" : ""}
              </Badge>
            </div>
          </div>

          {/* Validation panel */}
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-1">Validation Data</h3>
            <p className="text-xs text-muted-foreground mb-3">Data the model has NEVER seen</p>
            <div className="bg-muted/30 rounded p-2 mb-3">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24">
                {valObserved.map((p, i) => (
                  <circle
                    key={i}
                    cx={(i / (n - 1)) * svgWidth}
                    cy={svgHeight - (p / 100) * svgHeight}
                    r={3}
                    fill="hsl(200 90% 45%)"
                    opacity={0.7}
                  />
                ))}
                <path
                  d={pointsToPath(valModel)}
                  fill="none"
                  stroke="hsl(0 84% 55%)"
                  strokeWidth={2}
                  opacity={0.8}
                />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">NSE:</span>
              <Badge variant={valNSE > 0.7 ? "default" : valNSE > 0.5 ? "secondary" : "destructive"} className="text-xs">
                {valNSE.toFixed(2)} {valNSE < 0.4 ? "⚠️" : valNSE < 0.6 ? "😐" : ""}
              </Badge>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className={`p-4 rounded-lg ${isOverfit ? "bg-destructive/10" : gapNSE > 0.15 ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
          <div className="flex items-start gap-2">
            {isOverfit ? (
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm text-foreground">
                {isOverfit ? "⚠ OVERFITTING DETECTED" : gapNSE > 0.15 ? "Moderate overfitting risk" : "Good balance"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isOverfit
                  ? `Cal NSE (${calNSE.toFixed(2)}) vs Val NSE (${valNSE.toFixed(2)}) — gap of ${gapNSE.toFixed(2)}. The model learned NOISE in calibration data, not the underlying PHYSICS. Try reducing parameters to ~${Math.round(numParams * 0.4)}.`
                  : gapNSE > 0.15
                  ? "Some gap between calibration and validation performance. Consider simplifying."
                  : "Calibration and validation performance are well-matched. The model is learning signal, not noise."}
              </p>
              {isOverfit && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  "Calibration without validation is self-deception." — William James, Ch. 14
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/9">Ch. 9: Objective Functions</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/13">Ch. 13: Performance</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/14">Ch. 14: Parameter Optimization</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
