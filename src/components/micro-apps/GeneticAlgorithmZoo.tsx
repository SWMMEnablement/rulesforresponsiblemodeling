import { useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import { Dna, Download, BookOpen, ArrowRight, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Individual {
  x: number;
  y: number;
  fitness: number;
}

// Target function: Rastrigin-like with two peaks
const fitnessFunc = (x: number, y: number) => {
  const a = 10;
  return -(a * 2 + (x * x - a * Math.cos(2 * Math.PI * x)) + (y * y - a * Math.cos(2 * Math.PI * y)));
};

const randomIndividual = (): Individual => {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  return { x, y, fitness: fitnessFunc(x, y) };
};

/**
 * Ch.14 — Genetic Algorithm Zoo
 * Watch a population of "creatures" evolve toward optimal parameter sets.
 */
export const GeneticAlgorithmZoo = () => {
  const [popSize, setPopSize] = useState(30);
  const [mutationRate, setMutationRate] = useState(20);
  const [crossoverRate, setCrossoverRate] = useState(70);
  const [population, setPopulation] = useState<Individual[]>(() =>
    Array.from({ length: 30 }, randomIndividual)
  );
  const [generation, setGeneration] = useState(0);
  const [bestEver, setBestEver] = useState<Individual | null>(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    const newPop = Array.from({ length: popSize }, randomIndividual);
    setPopulation(newPop);
    setGeneration(0);
    setBestEver(null);
    setHistory([]);
  }, [popSize]);

  const step = useCallback((pop: Individual[]) => {
    const sorted = [...pop].sort((a, b) => b.fitness - a.fitness);
    const elite = sorted.slice(0, Math.max(2, Math.floor(pop.length * 0.2)));
    const newPop: Individual[] = [...elite];

    while (newPop.length < pop.length) {
      const p1 = elite[Math.floor(Math.random() * elite.length)];
      const p2 = elite[Math.floor(Math.random() * elite.length)];

      let childX: number, childY: number;
      if (Math.random() * 100 < crossoverRate) {
        childX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 0.5;
        childY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 0.5;
      } else {
        childX = p1.x;
        childY = p1.y;
      }

      if (Math.random() * 100 < mutationRate) {
        childX += (Math.random() - 0.5) * 2;
        childY += (Math.random() - 0.5) * 2;
      }

      childX = Math.max(-5, Math.min(5, childX));
      childY = Math.max(-5, Math.min(5, childY));

      newPop.push({ x: childX, y: childY, fitness: fitnessFunc(childX, childY) });
    }

    return newPop;
  }, [crossoverRate, mutationRate]);

  const toggleRun = useCallback(() => {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setPopulation(prev => {
        const next = step(prev);
        const best = next.reduce((a, b) => a.fitness > b.fitness ? a : b);
        setBestEver(prev2 => (!prev2 || best.fitness > prev2.fitness) ? best : prev2);
        setGeneration(g => g + 1);
        setHistory(h => [...h.slice(-49), best.fitness]);
        return next;
      });
    }, 200);
  }, [running, step]);

  const exportTemplate = () => {
    const best = population.reduce((a, b) => a.fitness > b.fitness ? a : b);
    const txt = `# Genetic Algorithm Calibration Log
Generated: ${new Date().toLocaleDateString()}
Based on Rules for Responsible Modeling — Ch.14

## GA Settings
- Population Size: ${popSize}
- Mutation Rate: ${mutationRate}%
- Crossover Rate: ${crossoverRate}%
- Generations Run: ${generation}

## Best Solution Found
- Parameters: x=${best.x.toFixed(4)}, y=${best.y.toFixed(4)}
- Fitness: ${best.fitness.toFixed(4)}
${bestEver ? `- Best Ever Fitness: ${bestEver.fitness.toFixed(4)}` : ""}

## Rule 14: Automated Calibration Needs Human Oversight
"GA finds optimal numbers — but only you can judge if they're physically meaningful."
`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ga-calibration-log.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("GA calibration log downloaded!");
  };

  // SVG scatter plot
  const svgW = 600, svgH = 300;
  const pad = { top: 15, right: 15, bottom: 30, left: 40 };
  const cW = svgW - pad.left - pad.right;
  const cH = svgH - pad.top - pad.bottom;
  const xS = (v: number) => pad.left + ((v + 5) / 10) * cW;
  const yS = (v: number) => pad.top + cH - ((v + 5) / 10) * cH;

  const bestCurrent = population.reduce((a, b) => a.fitness > b.fitness ? a : b);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Dna className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Genetic Algorithm Zoo</h2>
          <p className="text-sm text-muted-foreground">Chapter 14: Automated Calibration</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Watch a population evolve toward optimal parameter values. Tweak mutation, crossover, and population size to see how GA behavior changes.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Population: <span className="text-primary font-bold">{popSize}</span>
          </label>
          <Slider value={[popSize]} onValueChange={([v]) => { setPopSize(v); }} min={10} max={80} step={5} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Mutation: <span className="text-primary font-bold">{mutationRate}%</span>
          </label>
          <Slider value={[mutationRate]} onValueChange={([v]) => setMutationRate(v)} min={1} max={80} step={1} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Crossover: <span className="text-primary font-bold">{crossoverRate}%</span>
          </label>
          <Slider value={[crossoverRate]} onValueChange={([v]) => setCrossoverRate(v)} min={10} max={100} step={5} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={toggleRun} size="sm" variant={running ? "destructive" : "default"} className="gap-2">
          <Play className="w-4 h-4" /> {running ? "Pause" : "Evolve"}
        </Button>
        <Button onClick={reset} size="sm" variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <Badge variant="outline" className="ml-auto">Gen {generation}</Badge>
        <Badge variant="secondary">Best: {bestCurrent.fitness.toFixed(2)}</Badge>
      </div>

      {/* Scatter plot */}
      <div className="bg-muted/30 rounded-xl p-4 mb-6 overflow-x-auto">
        <h4 className="text-sm font-medium text-foreground mb-3">Parameter Space (x, y)</h4>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[600px] mx-auto">
          {/* Grid */}
          {[-4, -2, 0, 2, 4].map(v => (
            <g key={v}>
              <line x1={xS(v)} y1={pad.top} x2={xS(v)} y2={svgH - pad.bottom} stroke="currentColor" strokeOpacity={0.08} />
              <line x1={pad.left} y1={yS(v)} x2={svgW - pad.right} y2={yS(v)} stroke="currentColor" strokeOpacity={0.08} />
              <text x={xS(v)} y={svgH - 8} textAnchor="middle" fill="currentColor" fillOpacity={0.3} fontSize={9}>{v}</text>
              <text x={pad.left - 6} y={yS(v) + 3} textAnchor="end" fill="currentColor" fillOpacity={0.3} fontSize={9}>{v}</text>
            </g>
          ))}
          {/* Population dots */}
          {population.map((ind, i) => (
            <circle key={i} cx={xS(ind.x)} cy={yS(ind.y)} r={3}
              fill="hsl(var(--primary))" fillOpacity={0.5} />
          ))}
          {/* Best */}
          <circle cx={xS(bestCurrent.x)} cy={yS(bestCurrent.y)} r={6}
            fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />
          {bestEver && (
            <circle cx={xS(bestEver.x)} cy={yS(bestEver.y)} r={4}
              fill="hsl(var(--destructive))" />
          )}
        </svg>
      </div>

      {/* Fitness history */}
      {history.length > 1 && (
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-foreground mb-2">Fitness Over Generations</h4>
          <svg viewBox="0 0 400 80" className="w-full max-w-[400px]">
            {(() => {
              const mn = Math.min(...history);
              const mx = Math.max(...history);
              const range = mx - mn || 1;
              return (
                <path
                  d={history.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (history.length - 1)) * 380 + 10},${70 - ((v - mn) / range) * 60}`).join(" ")}
                  fill="none" stroke="hsl(var(--primary))" strokeWidth={1.5}
                />
              );
            })()}
          </svg>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={exportTemplate} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export Log
          </Button>
          <Link to="/chapter/14"><Button variant="ghost" size="sm" className="gap-2"><BookOpen className="w-4 h-4" /> Read Chapter 14</Button></Link>
        </div>
        <Link to="/micro-apps/legacy-saver">
          <Button size="sm" className="gap-2">Next: Legacy Saver <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </div>
    </Card>
  );
};
