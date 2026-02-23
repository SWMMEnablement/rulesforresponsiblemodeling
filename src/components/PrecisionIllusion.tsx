import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const PrecisionIllusion = () => {
  const [dataQuality, setDataQuality] = useState(50); // 0-100 scale
  const [animStep, setAnimStep] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);

  const fullValue = "47.342816";
  const meaningfulDigits = dataQuality >= 90 ? 6 : dataQuality >= 75 ? 4 : dataQuality >= 50 ? 3 : dataQuality >= 30 ? 2 : 1;
  const uncertaintyPct = Math.round(100 - dataQuality * 0.9);
  const peakFlow = 47;
  const low = Math.round(peakFlow * (1 - uncertaintyPct / 100));
  const high = Math.round(peakFlow * (1 + uncertaintyPct / 100));

  const getDisplayValue = () => {
    const chars = fullValue.split("");
    return chars.map((char, i) => {
      if (char === ".") return { char, visible: true };
      const digitIndex = i > fullValue.indexOf(".") ? i - 1 : i; // account for dot
      const actualDigitPos = i <= fullValue.indexOf(".") ? i + 1 : i;
      const isVisible = actualDigitPos <= meaningfulDigits + 1; // +1 for the dot offset
      return { char, visible: isVisible };
    });
  };

  const dissolve = () => {
    setIsDissolving(true);
    setAnimStep(0);
    for (let i = 0; i < 7; i++) {
      setTimeout(() => setAnimStep(i + 1), 300 * (i + 1));
    }
    setTimeout(() => setIsDissolving(false), 2800);
  };

  useEffect(() => {
    dissolve();
  }, []);

  const qualityLabel = dataQuality >= 80 ? "Excellent" : dataQuality >= 60 ? "Good" : dataQuality >= 40 ? "Fair" : "Poor";

  const reportExamples = [
    { quality: "Poor", value: "~47 CFS", sigFigs: "1 sig fig", range: `${low}–${high} CFS` },
    { quality: "Fair", value: "~47 CFS", sigFigs: "2 sig figs", range: `${low}–${high} CFS` },
    { quality: "Good", value: "47.3 CFS", sigFigs: "3 sig figs", range: `${low}–${high} CFS` },
    { quality: "Excellent", value: "47.34 CFS", sigFigs: "4 sig figs", range: `${low}–${high} CFS` },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🔢</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">The Precision Illusion</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Computers output 6+ significant figures. Most are meaningless. You can never have more significant figures in output than in your worst input. Based on Chapters 10 and 17.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Watch meaningless digits dissolve as data quality decreases.
        </p>

        {/* Data quality slider */}
        <div className="mb-8 max-w-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Data Quality</span>
            <Badge variant="outline">{qualityLabel} ({dataQuality}%)</Badge>
          </div>
          <Slider value={[dataQuality]} onValueChange={([v]) => setDataQuality(v)} min={10} max={95} step={5} />
        </div>

        {/* The dissolving number */}
        <div className="text-center mb-8">
          <p className="text-xs text-muted-foreground mb-2">WHAT THE MODEL OUTPUTS:</p>
          <div className="font-mono text-3xl sm:text-5xl tracking-wider py-6 bg-muted/20 rounded-lg">
            <span className="text-muted-foreground text-lg sm:text-2xl mr-2">Peak:</span>
            {fullValue.split("").map((char, i) => {
              if (char === ".") return <span key={i} className="text-foreground">.</span>;
              const pos = i < fullValue.indexOf(".") ? i + 1 : i;
              const isMeaningful = pos <= meaningfulDigits;
              return (
                <span
                  key={i}
                  className={`inline-block transition-all duration-500 ${
                    isMeaningful
                      ? "text-foreground"
                      : "text-muted-foreground/20 line-through decoration-destructive/50"
                  }`}
                  style={{
                    transform: isMeaningful ? "translateY(0)" : "translateY(2px)",
                    opacity: isMeaningful ? 1 : 0.2,
                  }}
                >
                  {char}
                </span>
              );
            })}
            <span className="text-muted-foreground text-lg sm:text-2xl ml-2">CFS</span>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            <span className="text-primary font-semibold">{meaningfulDigits}</span> meaningful digit{meaningfulDigits !== 1 ? "s" : ""} at {qualityLabel.toLowerCase()} data quality
          </p>
        </div>

        {/* What you should report */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="border border-destructive/30 rounded-lg p-4 bg-destructive/5">
            <p className="text-xs font-medium text-destructive mb-2">❌ DON'T REPORT</p>
            <p className="font-mono text-lg text-foreground">"Peak flow: 47.342816 CFS"</p>
            <p className="text-xs text-muted-foreground mt-1">False precision implies false confidence</p>
          </div>
          <div className="border border-emerald-500/30 rounded-lg p-4 bg-emerald-500/5">
            <p className="text-xs font-medium text-emerald-500 mb-2">✓ DO REPORT</p>
            <p className="font-mono text-lg text-foreground">"~{peakFlow} CFS (±{uncertaintyPct}%)"</p>
            <p className="text-xs text-foreground mt-1">Range: {low}–{high} CFS</p>
          </div>
        </div>

        {/* Responsible reporting example */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-2">✓ RESPONSIBLE REPORTING</p>
          <p className="text-sm text-foreground italic leading-relaxed">
            "Peak flow is estimated at approximately {peakFlow} CFS. Given data quality and parameter uncertainty, flows between {low} and {high} CFS are plausible. The {high <= 62 ? "36" : "48"}-inch pipe is adequate for flows up to {high <= 62 ? "62" : "82"} CFS."
          </p>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button variant="outline" size="sm" onClick={dissolve}>Replay Animation</Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/10">Ch. 10: Uncertainty</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/17">Ch. 17: Conclusions</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
