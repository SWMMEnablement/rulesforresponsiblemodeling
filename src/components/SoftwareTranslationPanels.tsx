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
      { rule: "Match spatial resolution to data and purpose", swmm: "Start with fewer subcatchments; test if adding more changes your design decision", icm: "Before trusting 2D flood extents, check that the ground model can represent the flow paths that matter (kerbs, walls, narrow channels). A coarse ground model can still suit broad screening." },
      { rule: "Time steps must resolve what the decision depends on", swmm: "The reporting step only controls how often results are saved; it is separate from the wet-weather runoff step and the routing step. Choose a reporting step short enough to capture the peaks and durations you will report, a rainfall interval that matches the data, and a routing step short enough for stable results, then check the continuity errors.", icm: "Choose a results timestep that captures the peaks you will report, and check the run's convergence and volume balance rather than relying on a fixed setting." },
    ],
  },
  {
    chapter: 4, title: "Optimal Complexity",
    translations: [
      { rule: "Optimal complexity is not maximum complexity", swmm: "Don't use DYNWAVE if KINWAVE gives acceptable results for your purpose", icm: "Don't enable full 2D unless the decision requires surface flood mapping" },
      { rule: "Match complexity to data availability", swmm: "A 500-subcatchment model calibrated with 2 rain gauges probably has more spatial detail than the rainfall data can support. Test whether the answer depends on that detail.", icm: "Ask whether the ground model and survey data support the 2D detail you plan to report." },
      { rule: "Simpler models may be more reliable", swmm: "Test: Does adding the 50th subcatchment change your design decision? If not, you don't need it.", icm: "Compare results between simplified and detailed network representations" },
    ],
  },
  {
    chapter: 9, title: "Objective Functions",
    translations: [
      { rule: "Use multiple objective functions", swmm: "Compare NSE, RMSE, and peak flow error — not just visual fit", icm: "Report fit statistics such as volume error, peak error and timing, from the software's comparison tools or your own scripts" },
      { rule: "Match the metric to the decision", swmm: "For CSO frequency, track overflow count, not just peak match", icm: "For flood mapping, prioritize depth accuracy over flow accuracy" },
    ],
  },
  {
    chapter: 10, title: "Uncertainty Analysis",
    translations: [
      { rule: "Uncertainty must be communicated honestly", swmm: "Run Monte Carlo on Manning's n, imperviousness, and depression storage", icm: "Run repeated simulations with your most uncertain parameters varied (scripted, or with built-in tools where your version has them)" },
      { rule: "Present confidence intervals, not single values", swmm: "Report peak flow as a range (e.g., 2.5-4.1 m³/s) not a point estimate", icm: "Use ensemble runs to generate confidence bands on flood extents" },
    ],
  },
  {
    chapter: 11, title: "Sensitivity Analysis",
    translations: [
      { rule: "Rank parameters by influence on output", swmm: "Vary one parameter at a time across a plausible range and plot the output response", icm: "Change one parameter at a time and rank the responses; check your version's documentation for any built-in sensitivity tools" },
      { rule: "Fix insensitive parameters to literature values", swmm: "If Dstore-perv doesn't change results, fix it at a documented literature value and stop calibrating it", icm: "Reduce calibration parameter set to only sensitive parameters" },
    ],
  },
  {
    chapter: 14, title: "Parameter Optimization",
    translations: [
      { rule: "Split calibration and validation datasets", swmm: "Never validate on the same events you calibrated to — use at least 1 separate event", icm: "If you use automated calibration (built-in or scripted, depending on version), still keep a held-out validation period" },
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
        Principles from the book translated into software actions. Click a chapter to expand.
      </p>
      <p className="text-muted-foreground mb-6 text-xs -mt-4">
        App-written practice guidance, not quotations. Feature names and menus differ between SWMM and InfoWorks ICM versions; check your version's documentation.
      </p>

      <div className="space-y-3">
        {translations.map((t, i) => (
          <TranslationPanel key={t.chapter} data={t} defaultOpen={i < 2} />
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
