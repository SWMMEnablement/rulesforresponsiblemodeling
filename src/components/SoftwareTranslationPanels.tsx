import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, Monitor, AlertTriangle, BookOpen } from "lucide-react";
import { useState } from "react";

interface TranslationRule {
  rule: string;
  swmm: string;
  icm: string;
}

interface ChapterTranslation {
  chapter: number;
  title: string;
  translations: TranslationRule[];
}

const translations: ChapterTranslation[] = [
  {
    chapter: 2, title: "Discretization & Complexity",
    translations: [
      { rule: "Match spatial resolution to data and purpose", swmm: "Start with fewer subcatchments; test if adding more changes your design decision", icm: "Don't use 2D surface flooding if your DTM is 10m resolution" },
      { rule: "Temporal resolution must match rainfall data", swmm: "Use reporting timestep ≤ wet-weather timestep; ensure routing timestep < conduit travel time", icm: "Set timestep multiplier appropriately; use adaptive timestepping for stability" },
    ],
  },
  {
    chapter: 4, title: "Optimal Complexity",
    translations: [
      { rule: "Optimal complexity is not maximum complexity", swmm: "Don't use DYNWAVE if KINWAVE gives acceptable results for your purpose", icm: "Don't enable full 2D unless the decision requires surface flood mapping" },
      { rule: "Match complexity to data availability", swmm: "A 500-subcatchment model calibrated to 2 rain gages is lying to you", icm: "Don't use 2D surface flooding if your DTM is 10m resolution" },
      { rule: "Simpler models may be more reliable", swmm: "Test: Does adding the 50th subcatchment change your design decision? If not, you don't need it.", icm: "Compare results between simplified and detailed network representations" },
    ],
  },
  {
    chapter: 9, title: "Objective Functions",
    translations: [
      { rule: "Use multiple objective functions", swmm: "Compare NSE, RMSE, and peak flow error — not just visual fit", icm: "Use ICM's built-in statistics (R², volume error, peak timing) in calibration reports" },
      { rule: "Match the metric to the decision", swmm: "For CSO frequency, track overflow count, not just peak match", icm: "For flood mapping, prioritize depth accuracy over flow accuracy" },
    ],
  },
  {
    chapter: 10, title: "Uncertainty Analysis",
    translations: [
      { rule: "Uncertainty must be communicated honestly", swmm: "Run Monte Carlo on Manning's n, imperviousness, and depression storage", icm: "Use ICM's Monte Carlo sensitivity tool on your top 5 uncertain parameters" },
      { rule: "Present confidence intervals, not single values", swmm: "Report peak flow as a range (e.g., 2.5-4.1 m³/s) not a point estimate", icm: "Use ensemble runs to generate confidence bands on flood extents" },
    ],
  },
  {
    chapter: 11, title: "Sensitivity Analysis",
    translations: [
      { rule: "Rank parameters by influence on output", swmm: "Vary one parameter at a time across ±20% and plot output response", icm: "Use ICM's sensitivity analysis module to auto-rank parameter importance" },
      { rule: "Fix insensitive parameters to literature values", swmm: "If Dstore-perv doesn't change results, use 5mm and stop calibrating it", icm: "Reduce calibration parameter set to only sensitive parameters" },
    ],
  },
  {
    chapter: 14, title: "Parameter Optimization",
    translations: [
      { rule: "Split calibration and validation datasets", swmm: "Never validate on the same events you calibrated to — use at least 1 separate event", icm: "Use ICM's auto-calibration with a held-out validation period" },
      { rule: "Avoid over-parameterization", swmm: "If you have 50 subcatchments but only 1 rain gage and 1 event, you cannot independently constrain all parameters", icm: "Reduce degrees of freedom by grouping similar subcatchments" },
    ],
  },
];

export const SoftwareTranslationPanels = () => {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Monitor className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">SWMM5 / ICM Translation Panels</h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        James's principles translated into specific software actions. Click a chapter to expand.
      </p>

      <div className="space-y-3">
        {translations.map((t) => (
          <TranslationPanel key={t.chapter} data={t} />
        ))}
      </div>
    </Card>
  );
};

const TranslationPanel = ({ data, defaultOpen = false }: { data: ChapterTranslation; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all text-left">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="shrink-0">Ch. {data.chapter}</Badge>
          <span className="font-medium text-foreground text-sm">{data.title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pb-1 px-1">
        <div className="space-y-3">
          {data.translations.map((tr, i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  {tr.rule}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="p-3">
                  <Badge variant="default" className="mb-2 text-xs">SWMM5</Badge>
                  <p className="text-xs text-muted-foreground">{tr.swmm}</p>
                </div>
                <div className="p-3">
                  <Badge variant="secondary" className="mb-2 text-xs">ICM</Badge>
                  <p className="text-xs text-muted-foreground">{tr.icm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
