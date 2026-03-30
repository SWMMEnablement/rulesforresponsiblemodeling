import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Skull, ChevronDown, ChevronUp, Search, HelpCircle, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type AutopsyCategory = "calibration" | "data-quality" | "complexity" | "uncertainty" | "flood-risk" | "validation";

interface Autopsy {
  id: number;
  project: string;
  failure: string;
  reality: string;
  rootCause: string;
  rulesViolated: number[];
  whatShouldHaveDone: string;
  chapters: number[];
  outcome: "failure" | "lesson";
  categories: AutopsyCategory[];
}

const categoryConfig: Record<AutopsyCategory, { label: string; color: string }> = {
  "calibration": { label: "Calibration", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30" },
  "data-quality": { label: "Data Quality", color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
  "complexity": { label: "Complexity", color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30" },
  "uncertainty": { label: "Uncertainty", color: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30" },
  "flood-risk": { label: "Flood Risk", color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30" },
  "validation": { label: "Validation", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
};

const autopsies: Autopsy[] = [
  { id: 1, project: "Combined sewer overflow study", failure: "Model predicted 2 overflows/year", reality: "14 overflows/year", rootCause: "Manning's n calibrated to dry-weather flow only", rulesViolated: [4, 9, 14, 16], whatShouldHaveDone: "Split calibration into dry and wet weather events", chapters: [9, 14], outcome: "failure", categories: ["calibration", "validation"] },
  { id: 2, project: "Flood risk mapping — urban creek", failure: "100-year flood extent missed 12 homes", reality: "Flood damaged homes not in the mapped zone", rootCause: "Used 30-year-old topographic data (Rule 3 violation)", rulesViolated: [3, 10, 16], whatShouldHaveDone: "Verified topographic data vintage; used LiDAR data", chapters: [3, 16], outcome: "failure", categories: ["data-quality", "flood-risk"] },
  { id: 3, project: "Stormwater detention pond sizing", failure: "Pond undersized by 40%", reality: "Pond overflowed in 5-year event", rootCause: "Used design storm instead of continuous simulation; missed antecedent moisture", rulesViolated: [5, 6, 10], whatShouldHaveDone: "Used continuous simulation with actual rainfall record", chapters: [5, 6], outcome: "failure", categories: ["data-quality", "flood-risk"] },
  { id: 4, project: "Sewer capacity assessment — 500 subcatchments", failure: "Model results contradicted field observations", reality: "Multiple pipes showed reverse flow in model only", rootCause: "Over-parameterized model with only 2 rain gages; couldn't constrain 500 subcatchments", rulesViolated: [2, 4, 14], whatShouldHaveDone: "Reduced to 40-80 subcatchments appropriate for available data", chapters: [2, 4], outcome: "lesson", categories: ["complexity", "calibration"] },
  { id: 5, project: "Real-time flood forecasting system", failure: "False alarm rate of 60%", reality: "System lost credibility; operators ignored warnings", rootCause: "No uncertainty bounds presented; single deterministic forecast", rulesViolated: [10, 16], whatShouldHaveDone: "Presented ensemble forecasts with confidence intervals", chapters: [10, 16], outcome: "failure", categories: ["uncertainty", "flood-risk"] },
  { id: 6, project: "Green infrastructure retrofit analysis", failure: "Model showed 50% reduction in peak flows", reality: "Measured reduction was 15-20%", rootCause: "Bioretention parameters used from manufacturer specs, not field-validated", rulesViolated: [3, 11, 13], whatShouldHaveDone: "Performed sensitivity analysis on GI parameters; validated against monitored sites", chapters: [11, 13], outcome: "lesson", categories: ["validation", "data-quality"] },
  { id: 7, project: "Watershed master plan — 10,000 ha", failure: "Model took 6 months; results questioned by peer review", reality: "Simpler model by competing firm produced same design recommendations", rootCause: "Complexity far exceeded data support; 2,000 subcatchments for 3 flow monitors", rulesViolated: [1, 4, 17], whatShouldHaveDone: "Started with purpose-driven complexity; tested whether detail changed decisions", chapters: [1, 4], outcome: "lesson", categories: ["complexity"] },
  { id: 8, project: "Industrial site runoff compliance model", failure: "Predicted no exceedances of effluent limits", reality: "3 permit violations in first year of operation", rootCause: "Single calibration event in dry season; no wet season validation", rulesViolated: [9, 13, 14], whatShouldHaveDone: "Calibrated across wet and dry seasons; validated on independent events", chapters: [9, 14], outcome: "failure", categories: ["calibration", "validation"] },
  { id: 9, project: "Dam safety inflow design flood", failure: "PMF estimate 30% lower than revised analysis", reality: "Dam safety factor reduced below standard", rootCause: "Rainfall disaggregation method underestimated temporal peaking", rulesViolated: [6, 7], whatShouldHaveDone: "Used multiple disaggregation methods; tested sensitivity to storm temporal pattern", chapters: [6, 7], outcome: "failure", categories: ["data-quality", "uncertainty", "flood-risk"] },
  { id: 10, project: "Municipal infrastructure renewal prioritization", failure: "Model ranked 50 pipes for replacement", reality: "Field inspections showed only 8 truly needed replacement", rootCause: "Model sensitivity to pipe roughness not tested; default values used throughout", rulesViolated: [11, 12, 13], whatShouldHaveDone: "Performed sensitivity analysis to identify which pipe parameters actually mattered", chapters: [11, 12], outcome: "lesson", categories: ["calibration", "validation"] },
];

export const ModelAutopsies = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterRule, setFilterRule] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<AutopsyCategory | null>(null);

  const filtered = autopsies.filter((a) => {
    const matchesSearch = search === "" || 
      a.project.toLowerCase().includes(search.toLowerCase()) ||
      a.rootCause.toLowerCase().includes(search.toLowerCase());
    const matchesRule = filterRule === null || a.rulesViolated.includes(filterRule);
    const matchesCategory = filterCategory === null || a.categories.includes(filterCategory);
    return matchesSearch && matchesRule && matchesCategory;
  });

  const allRules = [...new Set(autopsies.flatMap((a) => a.rulesViolated))].sort((a, b) => a - b);
  const allCategories = Object.keys(categoryConfig) as AutopsyCategory[];

  return (
    <TooltipProvider delayDuration={200}>
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Skull className="w-7 h-7 text-destructive" />
        <h2 className="text-2xl font-bold text-foreground">Model Autopsies</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>Real-world case studies of modeling failures. Each autopsy identifies what went wrong, which rules were violated, and what should have been done differently.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-muted-foreground mb-4 text-sm">
        Learn from failures. Each autopsy details a real-world modeling failure, the rules violated, and what should have been done differently.
      </p>

      {/* Category Filter Tags */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            All Categories
          </button>
          {allCategories.map((cat) => {
            const config = categoryConfig[cat];
            const count = autopsies.filter(a => a.categories.includes(cat)).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filterCategory === cat
                    ? config.color + " border-current"
                    : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search autopsies..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button variant={filterRule === null ? "default" : "outline"} size="sm" onClick={() => setFilterRule(null)}>All Ch.</Button>
          {allRules.map((r) => (
            <Button key={r} variant={filterRule === r ? "default" : "outline"} size="sm" onClick={() => setFilterRule(filterRule === r ? null : r)}>
              Ch.{r}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Showing {filtered.length} of {autopsies.length} case studies
      </p>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div key={a.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Badge variant={a.outcome === "failure" ? "destructive" : "secondary"} className="shrink-0 text-xs cursor-help">
                        #{a.id}
                      </Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{a.outcome === "failure" ? "Project failure — real-world consequences occurred" : "Lesson learned — issue caught before major consequences"}</p>
                  </TooltipContent>
                </Tooltip>
                <span className="font-medium text-foreground text-sm truncate">{a.project}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <div className="hidden sm:flex gap-1">
                  {a.categories.slice(0, 2).map((cat) => (
                    <span key={cat} className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryConfig[cat].color}`}>
                      {categoryConfig[cat].label}
                    </span>
                  ))}
                </div>
                <div className="hidden md:flex gap-1">
                  {a.rulesViolated.map((r) => (
                    <Badge key={r} variant="outline" className="text-xs">Ch.{r}</Badge>
                  ))}
                </div>
                {expanded === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {expanded === a.id && (
              <div className="border-t border-border p-4 bg-muted/30 space-y-3 text-sm animate-fade-in">
                {/* Category tags in expanded view */}
                <div className="flex flex-wrap gap-1.5">
                  {a.categories.map((cat) => (
                    <span key={cat} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryConfig[cat].color}`}>
                      {categoryConfig[cat].label}
                    </span>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">MODEL PREDICTED</p>
                    <p className="text-foreground">{a.failure}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">REALITY</p>
                    <p className="text-destructive font-medium">{a.reality}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">ROOT CAUSE</p>
                  <p className="text-foreground">{a.rootCause}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">WHAT SHOULD HAVE BEEN DONE</p>
                  <p className="text-foreground">{a.whatShouldHaveDone}</p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Chapters:</span>
                  {a.chapters.map((ch) => (
                    <a key={ch} href={`/chapter/${ch}`} className="text-primary text-xs underline">Ch. {ch}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No autopsies match your filters.</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearch(""); setFilterRule(null); setFilterCategory(null); }}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </Card>
    </TooltipProvider>
  );
};
