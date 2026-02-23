import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const equifinalitySets = [
  { n: 0.010, imp: 75, label: "Low n, High Imp" },
  { n: 0.013, imp: 65, label: "Mid n, Mid Imp" },
  { n: 0.018, imp: 55, label: "High n, Low Imp" },
  { n: 0.020, imp: 48, label: "Very High n, Low Imp" },
];

export const EquifinalityProblem = () => {
  const [manningN, setManningN] = useState(13); // x1000
  const [imperviousness, setImperviousness] = useState(65);
  const [showFuture, setShowFuture] = useState(false);

  const currentQ = useMemo(() => {
    const nEffect = (0.015 - manningN / 1000) * 800;
    const impEffect = (imperviousness - 60) * 0.4;
    return Math.round(47 + nEffect + impEffect);
  }, [manningN, imperviousness]);

  const futureQ = useMemo(() => {
    const futureImp = Math.min(95, imperviousness + 15);
    const nEffect = (0.015 - manningN / 1000) * 800;
    const impEffect = (futureImp - 60) * 0.6;
    return Math.round(47 + nEffect + impEffect);
  }, [manningN, imperviousness]);

  const nseScore = useMemo(() => {
    const diff = Math.abs(currentQ - 47);
    return Math.max(0, (1 - diff / 30)).toFixed(2);
  }, [currentQ]);

  const isGoodFit = Number(nseScore) > 0.8;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🔀</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">The Equifinality Problem</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Many different parameter combinations produce the same model output. Which is physically correct? Based on Chapters 12 & 14.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Adjust Manning's n and imperviousness — multiple combinations produce the same flow. But they predict very different futures.
        </p>

        {/* Parameter sliders */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Manning's n</span>
              <Badge variant="outline">{(manningN / 1000).toFixed(3)}</Badge>
            </div>
            <Slider value={[manningN]} onValueChange={([v]) => setManningN(v)} min={8} max={22} step={1} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">Imperviousness</span>
              <Badge variant="outline">{imperviousness}%</Badge>
            </div>
            <Slider value={[imperviousness]} onValueChange={([v]) => setImperviousness(v)} min={35} max={90} step={1} />
          </div>
        </div>

        {/* Current output */}
        <div className={`p-4 rounded-lg mb-4 ${isGoodFit ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
          <p className="font-semibold text-sm text-foreground">
            Current Peak Flow: {currentQ} CFS — NSE: {nseScore} {isGoodFit ? "✓ Good fit" : "✗ Poor fit"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Target: 47 CFS (observed)</p>
        </div>

        {/* Equifinality line */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Equifinality Line — All give Q ≈ 47 CFS:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {equifinalitySets.map((set, i) => (
              <button
                key={i}
                onClick={() => { setManningN(set.n * 1000); setImperviousness(set.imp); }}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all text-left"
              >
                <p className="text-xs font-medium text-foreground">n = {set.n.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground">Imp = {set.imp}%</p>
                <p className="text-[10px] text-muted-foreground mt-1">{set.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Future scenario toggle */}
        <div className="mb-4">
          <Button variant={showFuture ? "default" : "outline"} size="sm" onClick={() => setShowFuture(!showFuture)}>
            {showFuture ? "Hide" : "Show"} Future Scenario (+15% Development)
          </Button>
        </div>

        {showFuture && (
          <div className="p-4 rounded-lg bg-amber-500/10 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Future Peak Flow: {futureQ} CFS (+{Math.round(((futureQ - currentQ) / currentQ) * 100)}%)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Same calibration quality, but different parameter sets predict different futures.
                  Try clicking each equifinality point above and watch this value change.
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  💡 This is why calibration alone is insufficient. Physical reasoning must constrain parameters.
                </p>
              </div>
            </div>
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
