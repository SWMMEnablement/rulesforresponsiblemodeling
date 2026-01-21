import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  MessageSquareQuote, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  BookOpen
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
  }
];

interface CaseVignettesProps {
  compact?: boolean;
  maxItems?: number;
}

export const CaseVignettes = ({ compact = false, maxItems }: CaseVignettesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayVignettes = maxItems ? caseVignettes.slice(0, maxItems) : caseVignettes;

  const nextVignette = () => {
    setCurrentIndex((prev) => (prev + 1) % displayVignettes.length);
  };

  const prevVignette = () => {
    setCurrentIndex((prev) => (prev - 1 + displayVignettes.length) % displayVignettes.length);
  };

  const currentVignette = displayVignettes[currentIndex];

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
        return "bg-green-500/10 text-green-700 border-green-500/30";
      case "failure":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "lesson":
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-card to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquareQuote className="w-5 h-5 text-primary" />
            Rule in Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="min-h-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={getOutcomeColor(currentVignette.outcome)}>
                  {getOutcomeIcon(currentVignette.outcome)}
                  <span className="ml-1">{getOutcomeLabel(currentVignette.outcome)}</span>
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Rule {currentVignette.ruleNumber}
                </Badge>
              </div>
              
              <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
                "{currentVignette.story}"
              </blockquote>
              
              <p className="text-sm font-medium text-foreground">
                💡 {currentVignette.lesson}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex gap-1">
                {displayVignettes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to story ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevVignette}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextVignette}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2 mb-2">
          <MessageSquareQuote className="w-6 h-6 text-primary" />
          Rules in Action: Peer Vignettes
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real stories from the modeling community. Learn from both successes and failures—these 100-word vignettes 
          show how Dr. James's rules play out in practice.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {displayVignettes.map((vignette, idx) => (
          <Card 
            key={vignette.id} 
            className={`transition-all hover:shadow-lg ${
              idx === currentIndex ? "ring-2 ring-primary/50" : ""
            }`}
          >
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className={getOutcomeColor(vignette.outcome)}>
                  {getOutcomeIcon(vignette.outcome)}
                  <span className="ml-1">{getOutcomeLabel(vignette.outcome)}</span>
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Rule {vignette.ruleNumber}: {vignette.ruleTitle}
                </Badge>
              </div>

              <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 mb-3">
                "{vignette.story}"
              </blockquote>

              <div className="p-3 rounded-lg bg-accent/50 mb-3">
                <p className="text-sm font-medium text-foreground">
                  💡 {vignette.lesson}
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {vignette.relatedChapters.map(chNum => (
                  <Link key={chNum} to={`/chapter/${chNum}`}>
                    <Badge variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                      Ch {chNum}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
