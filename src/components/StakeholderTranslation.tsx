import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HelpCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TranslationItem {
  technical: string;
  plain: string;
  action: "keep" | "simplify" | "omit";
}

const translations: TranslationItem[] = [
  { technical: "DYNWAVE simulation", plain: "our most detailed analysis", action: "simplify" },
  { technical: "Green-Ampt infiltration", plain: "how rainfall soaks into the ground", action: "simplify" },
  { technical: "5-minute timestep", plain: "(omit — technical detail)", action: "omit" },
  { technical: "Preissmann Slot for surcharge", plain: "(omit — nobody needs this)", action: "omit" },
  { technical: "peak HGL of 105.3 ft at node J-47", plain: "water rises to about 2 ft above the manhole rim at Elm Street", action: "simplify" },
  { technical: "NSE of 0.87", plain: "the model matches observed reality well", action: "simplify" },
  { technical: "continuity error of 0.23%", plain: "(omit — not decision-relevant)", action: "omit" },
];

const technicalParagraph = `The DYNWAVE simulation with Green-Ampt infiltration using a 5-minute timestep and Preissmann Slot for surcharge produced a peak HGL of 105.3 ft at node J-47 with an NSE of 0.87 against calibration data and a continuity error of 0.23%.`;

const plainParagraph = `During a 10-year storm, water in the sewer at Elm Street will rise to about 2 feet above the manhole rim. This means the intersection will flood to about 6 inches deep. Our confidence in this prediction is moderate — actual flooding could be somewhat less OR up to twice as deep. We recommend the 48-inch pipe upgrade because it protects against even the worst-case prediction.`;

export const StakeholderTranslation = () => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg">🗣️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Stakeholder Translation</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>The purpose of a model is to support a decision. Report what informs the decision, omit what only impresses other modelers. Ch. 17.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          See how technical jargon translates into plain language for decision-makers.
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <Button size="sm" variant={!showTranslation ? "default" : "outline"} onClick={() => setShowTranslation(false)}>
            <Eye className="w-4 h-4" /> Technical View
          </Button>
          <Button size="sm" variant={showTranslation ? "default" : "outline"} onClick={() => setShowTranslation(true)}>
            <ArrowRight className="w-4 h-4" /> Plain Language
          </Button>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${!showTranslation ? "border-primary bg-primary/5" : "border-border opacity-60"}`}>
            <Badge variant="outline" className="mb-3">What the Modeler Says</Badge>
            <p className="text-sm text-foreground leading-relaxed">{technicalParagraph}</p>
          </div>
          <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${showTranslation ? "border-primary bg-primary/5" : "border-border opacity-60"}`}>
            <Badge variant="default" className="mb-3">What the Council Needs to Hear</Badge>
            <p className="text-sm text-foreground leading-relaxed">{plainParagraph}</p>
          </div>
        </div>

        {/* Translation table */}
        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Term-by-Term Translation:</h3>
          {translations.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg border border-border hover:border-primary/30 transition-all cursor-default"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className={`text-xs flex-1 ${hoveredIndex === i ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {t.technical}
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className={`text-xs flex-1 ${hoveredIndex === i ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {t.plain}
              </span>
              <Badge variant={t.action === "omit" ? "destructive" : t.action === "simplify" ? "secondary" : "outline"} className="text-[10px] shrink-0">
                {t.action}
              </Badge>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-primary/5 mb-4">
          <p className="text-xs text-muted-foreground italic">
            💡 James's Rule: "The purpose of a model is to support a DECISION. Report the information that informs the decision. Omit the information that only impresses other modelers."
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/17">Ch. 17: Conclusions</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
