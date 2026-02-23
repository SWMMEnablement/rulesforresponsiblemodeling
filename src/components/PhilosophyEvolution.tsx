import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Era {
  decade: string;
  title: string;
  description: string;
  belief: string;
  limitation: string;
  chapters: number[];
  color: string;
}

const eras: Era[] = [
  {
    decade: "1960s", title: "The Model Is Always Right",
    description: "Computer output treated as absolute truth. No concept of model uncertainty.",
    belief: "\"The computer said so\" was sufficient justification.",
    limitation: "No framework for questioning model outputs.",
    chapters: [], color: "hsl(200, 70%, 50%)",
  },
  {
    decade: "1970s", title: "Garbage In, Garbage Out",
    description: "First recognition that input quality matters. But no systematic framework for measuring or reporting data quality.",
    belief: "Bad inputs produce bad outputs — but good inputs guarantee good outputs (wrong).",
    limitation: "No recognition that the MODEL itself introduces uncertainty.",
    chapters: [3], color: "hsl(180, 60%, 45%)",
  },
  {
    decade: "1980s", title: "Calibrate and Validate",
    description: "Calibration becomes standard practice. But validation often skipped or confused with calibration.",
    belief: "A calibrated model is a reliable model.",
    limitation: "Equifinality not understood. Overfitting not recognized as a risk.",
    chapters: [9, 13, 14], color: "hsl(150, 60%, 40%)",
  },
  {
    decade: "1990s", title: "Uncertainty Matters",
    description: "Monte Carlo methods emerge. Parameter uncertainty acknowledged — but rarely communicated to decision-makers.",
    belief: "We should quantify uncertainty (but we don't have to tell anyone).",
    limitation: "Uncertainty analysis done but buried in appendices, not in executive summaries.",
    chapters: [10, 11], color: "hsl(45, 80%, 50%)",
  },
  {
    decade: "2000s", title: "All Models Are Wrong",
    description: "George Box's quote gains widespread acceptance. James (2005) provides the answer: 17 chapters of rules for responsible practice.",
    belief: "Models are wrong, but some are useful — IF used responsibly.",
    limitation: "Knowing models are wrong doesn't tell you WHAT TO DO about it. James fills this gap.",
    chapters: [1, 4, 17], color: "hsl(25, 80%, 50%)",
  },
  {
    decade: "2020s", title: "AI Will Fix Everything",
    description: "Machine learning models and neural network hydrology. James's rules apply MORE than ever — AI models are wrong in ways we cannot even diagnose.",
    belief: "Data-driven models eliminate the need for physical understanding.",
    limitation: "AI models have LESS interpretability. Uncertainty is now WORSE, not better. Equifinality is magnified by orders of magnitude.",
    chapters: [4, 10, 12, 17], color: "hsl(0, 70%, 55%)",
  },
];

export const PhilosophyEvolution = () => {
  const [activeEra, setActiveEra] = useState(0);
  const era = eras[activeEra];

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">📜</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Evolution of Modeling Philosophy</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>How our relationship with models has evolved over 60 years — and why James's rules remain essential.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          Click through decades to see how modeling philosophy evolved — and where James's contributions fit.
        </p>

        {/* Timeline bar */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
          {eras.map((e, i) => (
            <button
              key={e.decade}
              onClick={() => setActiveEra(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                i === activeEra
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {e.decade}
            </button>
          ))}
        </div>

        {/* Active era card */}
        <div className="rounded-xl border-2 border-primary/30 p-5 mb-6 transition-all duration-500" style={{ borderLeftColor: era.color, borderLeftWidth: 4 }}>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="default" className="text-sm">{era.decade}</Badge>
            <h3 className="text-lg font-bold text-foreground">"{era.title}"</h3>
          </div>
          <p className="text-sm text-foreground mb-3">{era.description}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Prevailing Belief</p>
              <p className="text-xs text-foreground italic">{era.belief}</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Key Limitation</p>
              <p className="text-xs text-foreground">{era.limitation}</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${((activeEra + 1) / eras.length) * 100}%` }} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button size="sm" variant="outline" onClick={() => setActiveEra(Math.max(0, activeEra - 1))} disabled={activeEra === 0}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-xs text-muted-foreground">{activeEra + 1} of {eras.length}</span>
          <Button size="sm" variant="outline" onClick={() => setActiveEra(Math.min(eras.length - 1, activeEra + 1))} disabled={activeEra === eras.length - 1}>
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {era.chapters.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {era.chapters.map(ch => (
              <Button key={ch} variant="outline" size="sm" asChild>
                <a href={`/chapter/${ch}`}>Ch. {ch}</a>
              </Button>
            ))}
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
};
