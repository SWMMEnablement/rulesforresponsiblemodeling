import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquareQuote, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Filter,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

interface CaseVignette {
  id: string;
  ruleNumber: number;
  ruleTitle: string;
  story: string;
  lesson: string;
  outcome: "success" | "failure" | "lesson";
  relatedChapters: number[];
}

const caseVignettes: CaseVignette[] = [
  {
    id: "cv1",
    ruleNumber: 3,
    ruleTitle: "Data Reliability",
    story: "We trusted old land-use maps for a combined sewer model without verification. During calibration, the model consistently under-predicted flows. After two weeks of frustration, we discovered the maps were 15 years outdated—entire subdivisions were missing.",
    lesson: "Always verify data currency and source reliability before building your model. The time spent on QA upfront is always less than debugging later.",
    outcome: "failure",
    relatedChapters: [3, 7]
  },
  {
    id: "cv2",
    ruleNumber: 4,
    ruleTitle: "Optimal Complexity",
    story: "A client insisted on a full 2D hydraulic model for a simple drainage study. We pushed back, demonstrating that a 1D model with key 2D nodes would answer their questions at 1/10th the cost. They agreed after seeing the side-by-side results.",
    lesson: "Match model complexity to the decision being made, not to what the software can do. Stakeholders often don't know what they need—educate them.",
    outcome: "success",
    relatedChapters: [4, 2]
  },
  {
    id: "cv3",
    ruleNumber: 10,
    ruleTitle: "Uncertainty Quantification",
    story: "We delivered a flood map with precise-looking boundaries to a planning commission. When a property owner challenged us on why their lot was included, we had no uncertainty analysis to explain the confidence level. It undermined the entire project's credibility.",
    lesson: "Never present deterministic results for inherently uncertain predictions. Confidence bands protect both you and the decisions being made.",
    outcome: "failure",
    relatedChapters: [10, 17]
  },
  {
    id: "cv4",
    ruleNumber: 11,
    ruleTitle: "Split-Sample Validation",
    story: "We reserved 3 storms for validation before starting calibration on a new watershed model. When the model performed poorly on validation, we identified a systematic bias in our impervious area estimates—something we would have missed if we'd calibrated on all events.",
    lesson: "Always reserve independent data for validation. It's tempting to use everything for calibration, but you'll never know if your model generalizes without it.",
    outcome: "success",
    relatedChapters: [11, 14]
  },
  {
    id: "cv5",
    ruleNumber: 17,
    ruleTitle: "Ethical Communication",
    story: "We inherited a model that 'proved' a development wouldn't cause flooding. Looking deeper, we found the modeler had silently removed several undersized culverts from the network. We reported the finding, the client was upset, but lives and properties were protected.",
    lesson: "Your obligation is to the truth and public safety, not to the answer someone wants. Document everything and never hide inconvenient findings.",
    outcome: "lesson",
    relatedChapters: [17, 1]
  },
  {
    id: "cv6",
    ruleNumber: 12,
    ruleTitle: "Calibration Strategy",
    story: "I once calibrated a SWMM model by adjusting 15 parameters simultaneously until R² looked good. The model failed spectacularly on validation. Now I use sensitivity analysis first, calibrate only 3-5 key parameters, and document every adjustment.",
    lesson: "Systematic calibration with sensitivity-guided parameter selection beats trial-and-error every time. Fewer parameters, better results.",
    outcome: "lesson",
    relatedChapters: [12, 13]
  },
  {
    id: "cv7",
    ruleNumber: 5,
    ruleTitle: "Continuous Simulation",
    story: "A municipality kept using design storm analysis for infrastructure sizing. We showed them continuous simulation results revealing that antecedent conditions from frequent smaller storms caused more flooding than the 'design' event. They redesigned their whole approach.",
    lesson: "Design storms miss the real-world complexity of sequential events. Continuous simulation reveals vulnerabilities that event-based modeling hides.",
    outcome: "success",
    relatedChapters: [5, 6]
  },
  {
    id: "cv8",
    ruleNumber: 9,
    ruleTitle: "Objective Functions",
    story: "We calibrated a model to maximize NSE and got excellent scores. But the model systematically over-predicted peak flows by 20%. Adding peak flow bias as a second objective revealed a trade-off we'd been ignoring. Multi-objective optimization saved the project.",
    lesson: "Single objective functions hide important trade-offs. Always use multiple metrics that represent different aspects of model performance.",
    outcome: "lesson",
    relatedChapters: [9, 12]
  },
  {
    id: "cv9",
    ruleNumber: 1,
    ruleTitle: "Problem Definition",
    story: "We built a detailed model before fully understanding what decisions it would inform. Halfway through, the client revealed they only needed relative comparisons between scenarios. We'd over-engineered the absolute accuracy when ranking was all that mattered.",
    lesson: "Define the decision before the model. Understanding how results will be used shapes every modeling choice that follows.",
    outcome: "failure",
    relatedChapters: [1, 2]
  },
  {
    id: "cv10",
    ruleNumber: 14,
    ruleTitle: "Genetic Algorithm Optimization",
    story: "We let PEST run overnight to auto-calibrate our watershed model. In the morning, we had excellent fit statistics but physically impossible parameter values—negative evaporation and infiltration rates exceeding rainfall. The algorithm found a mathematical optimum, not a physical one.",
    lesson: "Always constrain automated optimization with physical bounds and review results for plausibility. Algorithms don't understand physics.",
    outcome: "failure",
    relatedChapters: [14, 12]
  },
  {
    id: "cv11",
    ruleNumber: 6,
    ruleTitle: "Rainfall Representation",
    story: "A single rain gauge served a 50 km² watershed. After repeated poor calibration results, we invested in radar rainfall data. The spatial variability was dramatic—the gauge was in a consistently drier microclimate. Model performance improved immediately.",
    lesson: "Point rainfall rarely represents watershed-scale processes. Invest in understanding your precipitation data's spatial representativeness.",
    outcome: "success",
    relatedChapters: [6, 7]
  },
  {
    id: "cv12",
    ruleNumber: 8,
    ruleTitle: "Software Application",
    story: "We spent days debugging why SWMM produced different results on two computers. Eventually, we traced it to different solver settings in the options file—one engineer had tweaked them for a previous project. Now we version-control every input file.",
    lesson: "Version control isn't optional for reproducible modeling. Every file, every setting, every time. Future you will be grateful.",
    outcome: "lesson",
    relatedChapters: [8, 3]
  }
];

const outcomeFilters = [
  { value: "all", label: "All Stories", icon: MessageSquareQuote },
  { value: "success", label: "Success Stories", icon: CheckCircle },
  { value: "failure", label: "Lessons from Failures", icon: AlertTriangle },
  { value: "lesson", label: "Key Insights", icon: BookOpen },
];

const ruleNumbers = [...new Set(caseVignettes.map(v => v.ruleNumber))].sort((a, b) => a - b);

const CaseVignettesPage = () => {
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [ruleFilter, setRuleFilter] = useState<number | null>(null);

  const filteredVignettes = caseVignettes.filter(v => {
    if (outcomeFilter !== "all" && v.outcome !== outcomeFilter) return false;
    if (ruleFilter !== null && v.ruleNumber !== ruleFilter) return false;
    return true;
  });

  const getOutcomeIcon = (outcome: CaseVignette["outcome"]) => {
    switch (outcome) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failure":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "lesson":
        return <BookOpen className="w-4 h-4 text-primary" />;
    }
  };

  const getOutcomeLabel = (outcome: CaseVignette["outcome"]) => {
    switch (outcome) {
      case "success":
        return "Success Story";
      case "failure":
        return "Lesson Learned";
      case "lesson":
        return "Key Insight";
    }
  };

  const getOutcomeColor = (outcome: CaseVignette["outcome"]) => {
    switch (outcome) {
      case "success":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
      case "failure":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "lesson":
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  const clearFilters = () => {
    setOutcomeFilter("all");
    setRuleFilter(null);
  };

  const hasActiveFilters = outcomeFilter !== "all" || ruleFilter !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquareQuote className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Rules in Action
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Real stories from the modeling community. Learn from both successes and failures—these peer vignettes 
            show how Dr. James's rules play out in practice.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Outcome Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter by Outcome</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {outcomeFilters.map(filter => (
                  <Button
                    key={filter.value}
                    variant={outcomeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOutcomeFilter(filter.value)}
                    className="gap-1.5"
                  >
                    <filter.icon className="w-3.5 h-3.5" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rule Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter by Rule</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ruleNumbers.map(num => (
                  <Button
                    key={num}
                    variant={ruleFilter === num ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-8 p-0"
                    onClick={() => setRuleFilter(ruleFilter === num ? null : num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Showing {filteredVignettes.length} of {caseVignettes.length} stories
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 gap-1">
                <X className="w-3 h-3" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Vignettes Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {filteredVignettes.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquareQuote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No stories match your filters</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filter criteria</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredVignettes.map((vignette) => (
              <Card key={vignette.id} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={getOutcomeColor(vignette.outcome)}>
                      {getOutcomeIcon(vignette.outcome)}
                      <span className="ml-1">{getOutcomeLabel(vignette.outcome)}</span>
                    </Badge>
                    <Badge variant="secondary">
                      Rule {vignette.ruleNumber}: {vignette.ruleTitle}
                    </Badge>
                  </div>

                  <blockquote className="text-muted-foreground italic border-l-2 border-primary/30 pl-4 mb-4">
                    "{vignette.story}"
                  </blockquote>

                  <div className="p-4 rounded-lg bg-accent/50 mb-4">
                    <p className="text-sm font-medium text-foreground">
                      💡 <span className="font-semibold">Lesson:</span> {vignette.lesson}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs text-muted-foreground mr-1">Related chapters:</span>
                      {vignette.relatedChapters.map(chNum => (
                        <Link key={chNum} to={`/chapter/${chNum}`}>
                          <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                            Ch {chNum}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CaseVignettesPage;
