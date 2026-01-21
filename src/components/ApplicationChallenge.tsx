import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle, Brain, Lightbulb, RotateCcw } from "lucide-react";

interface ChallengeOption {
  label: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

interface Challenge {
  scenario: string;
  question: string;
  context?: string;
  options: ChallengeOption[];
  keyPrinciple: string;
  chapterReference: number;
}

interface ApplicationChallengeProps {
  challenge: Challenge;
}

export const ApplicationChallenge = ({ challenge }: ApplicationChallengeProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };

  const selectedAnswer = selectedOption !== null ? challenge.options[selectedOption] : null;

  return (
    <Card className="bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-accent" />
            Test Your Judgment
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Practical Application
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario */}
        <div className="p-4 rounded-lg bg-background border border-border">
          <h4 className="font-semibold text-foreground mb-2">Scenario</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {challenge.scenario}
          </p>
          {challenge.context && (
            <p className="text-xs text-muted-foreground mt-2 italic border-t border-border pt-2">
              {challenge.context}
            </p>
          )}
        </div>

        {/* Question */}
        <div className="font-medium text-foreground">
          {challenge.question}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {challenge.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const showResult = showFeedback && isSelected;
            
            return (
              <button
                key={index}
                onClick={() => !showFeedback && handleSelect(index)}
                disabled={showFeedback}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  showFeedback
                    ? option.isCorrect
                      ? "bg-green-500/10 border-green-500/50"
                      : isSelected
                      ? "bg-destructive/10 border-destructive/50"
                      : "bg-muted/30 border-border opacity-60"
                    : "bg-background border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`font-bold text-sm shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    showFeedback
                      ? option.isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-destructive text-white"
                        : "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {option.label}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      showFeedback && option.isCorrect
                        ? "text-green-700 dark:text-green-400 font-medium"
                        : showFeedback && isSelected && !option.isCorrect
                        ? "text-destructive"
                        : "text-foreground"
                    }`}>
                      {option.text}
                    </p>
                    {showResult && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                        {option.feedback}
                      </p>
                    )}
                  </div>
                  {showFeedback && (
                    option.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    ) : null
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Panel */}
        {showFeedback && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer?.isCorrect
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-amber-500/10 border border-amber-500/30"
          }`}>
            <div className="flex items-start gap-3">
              <Lightbulb className={`w-5 h-5 shrink-0 ${
                selectedAnswer?.isCorrect ? "text-green-600" : "text-amber-600"
              }`} />
              <div>
                <h5 className={`font-semibold text-sm mb-1 ${
                  selectedAnswer?.isCorrect ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
                }`}>
                  {selectedAnswer?.isCorrect ? "Correct!" : "Not Quite Right"}
                </h5>
                <p className="text-sm text-muted-foreground">
                  <strong>Key Principle:</strong> {challenge.keyPrinciple}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  See Chapter {challenge.chapterReference} for more on this topic.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mt-3 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Pre-defined challenges for key chapters
export const chapterChallenges: Record<number, Challenge> = {
  4: {
    scenario: "You're modeling a 50-acre suburban watershed for a green infrastructure retrofit study. You have LiDAR terrain data, 10 years of rain gauge records, and limited sewer CCTV data. The client wants to know if bioretention cells will reduce flooding at a critical intersection.",
    question: "According to the 'Optimal Complexity' principle, which modeling approach is MOST appropriate?",
    context: "Budget allows for 3 weeks of modeling work. Design storm analysis is acceptable for this planning-level study.",
    options: [
      {
        label: "A",
        text: "Build a highly detailed 2D overland flow model with 1-meter mesh resolution using the LiDAR data",
        isCorrect: false,
        feedback: "This approach over-parameterizes the model relative to available calibration data. The CCTV data is insufficient to calibrate a detailed 2D model, leading to equifinality issues."
      },
      {
        label: "B",
        text: "Use a calibrated 1D hydrologic/hydraulic model (SWMM) with representative subcatchments and the LID module",
        isCorrect: true,
        feedback: "This matches complexity to data availability. SWMM's LID module can simulate bioretention, the 10-year rain record enables continuous calibration, and 1D routing is appropriate for planning-level analysis."
      },
      {
        label: "C",
        text: "Apply the Rational Method with adjusted runoff coefficients for green infrastructure",
        isCorrect: false,
        feedback: "Too simplistic for evaluating bioretention performance. The Rational Method cannot model detention, infiltration, or temporal dynamics needed to assess LID effectiveness."
      },
      {
        label: "D",
        text: "Create a coupled surface-groundwater model to capture all subsurface interactions",
        isCorrect: false,
        feedback: "Adds unnecessary complexity. Without groundwater monitoring data, subsurface parameters cannot be calibrated, and the additional uncertainty outweighs any potential accuracy gains."
      }
    ],
    keyPrinciple: "The optimal model complexity matches the decision requirements, available data, and project resources. Adding detail beyond what data can support increases uncertainty through equifinality.",
    chapterReference: 4
  },
  10: {
    scenario: "Your SWMM model is calibrated and validated. The client asks you to present flood elevations for a 100-year design storm scenario. Your calibration was performed using three observed events with peak flows ranging from 2-year to 10-year recurrence.",
    question: "How should you handle uncertainty when presenting the 100-year flood results?",
    context: "The project is for municipal infrastructure planning with a 50-year design life.",
    options: [
      {
        label: "A",
        text: "Present a single flood elevation since the model is calibrated and validated",
        isCorrect: false,
        feedback: "This ignores extrapolation uncertainty. The model was calibrated for smaller events; extrapolating to 100-year conditions introduces substantial uncertainty that decision-makers need to understand."
      },
      {
        label: "B",
        text: "Provide flood elevation ranges using Monte Carlo simulation of uncertain parameters",
        isCorrect: true,
        feedback: "Correct approach. Monte Carlo captures parameter uncertainty and shows decision-makers the range of possible outcomes, enabling risk-informed infrastructure decisions."
      },
      {
        label: "C",
        text: "Add a fixed safety factor (e.g., +2 feet) to account for uncertainty",
        isCorrect: false,
        feedback: "Arbitrary safety factors don't communicate the actual uncertainty or its sources. They may over-design some scenarios while under-designing others."
      },
      {
        label: "D",
        text: "Decline to model the 100-year event since it exceeds calibration range",
        isCorrect: false,
        feedback: "While extrapolation concerns are valid, models are routinely used for design events. The key is to quantify and communicate the increased uncertainty, not to refuse the analysis."
      }
    ],
    keyPrinciple: "Model predictions always carry uncertainty that should be quantified and communicated. Extrapolating beyond calibration conditions increases uncertainty that must be explicitly addressed.",
    chapterReference: 10
  },
  11: {
    scenario: "You're calibrating a watershed model and have flow monitoring data from two gauges: one with 3 years of continuous 15-minute data (downstream), and one with 6 months of daily data (upstream tributary). The downstream gauge shows good correlation but the upstream is harder to match.",
    question: "What is the most responsible calibration approach?",
    context: "The model will be used to evaluate upstream detention options.",
    options: [
      {
        label: "A",
        text: "Calibrate only to the downstream gauge since it has more data",
        isCorrect: false,
        feedback: "This would miss important upstream processes. Since the application involves upstream detention, the model must represent upstream conditions accurately, even with less data."
      },
      {
        label: "B",
        text: "Perform sensitivity analysis first, then calibrate the most sensitive parameters using both gauges with appropriate weighting",
        isCorrect: true,
        feedback: "Sensitivity analysis identifies key parameters. Weighting by data quality and relevance to the application (upstream detention) ensures appropriate calibration priorities."
      },
      {
        label: "C",
        text: "Adjust parameters until both gauges match perfectly",
        isCorrect: false,
        feedback: "Pursuing perfect matches often leads to overfitting. The upstream gauge's daily data cannot constrain peak flow timing, so 'perfect' matching would be illusory."
      },
      {
        label: "D",
        text: "Use automatic calibration software to optimize all parameters simultaneously",
        isCorrect: false,
        feedback: "Without prior sensitivity analysis, automatic calibration may adjust insensitive parameters while missing key ones. It also doesn't address the data quality differences between gauges."
      }
    ],
    keyPrinciple: "Calibration should prioritize parameters relevant to the model's intended application, use sensitivity analysis to focus efforts, and weight observations appropriately by quality and relevance.",
    chapterReference: 11
  },
  17: {
    scenario: "Your flood model shows a proposed development will increase downstream flooding by 15%. The developer's consultant disputes your results, citing their own model that shows only 3% increase. You're presenting to the planning commission next week.",
    question: "What is the most ethical way to present your findings?",
    context: "Both models used similar input data but different approaches. The decision affects 200+ downstream homeowners.",
    options: [
      {
        label: "A",
        text: "Emphasize the weaknesses in the developer's model to establish your results as correct",
        isCorrect: false,
        feedback: "Advocacy undermines scientific credibility. Both models have limitations; attacking the other model doesn't address legitimate uncertainty in your own results."
      },
      {
        label: "B",
        text: "Present your results with uncertainty bounds and acknowledge areas of legitimate disagreement between the models",
        isCorrect: true,
        feedback: "This maintains scientific integrity while providing decision-makers with information to make risk-informed choices. Honest acknowledgment of uncertainty builds long-term credibility."
      },
      {
        label: "C",
        text: "Average the two model results to present a compromise value",
        isCorrect: false,
        feedback: "Averaging models with different structures doesn't produce a more accurate result. It obscures the real uncertainty and may misrepresent both analyses."
      },
      {
        label: "D",
        text: "Present your results as definitive since you believe your model is more accurate",
        isCorrect: false,
        feedback: "Presenting uncertain results as definitive violates the modeler's ethical responsibility. Decision-makers deserve to understand the range of possible outcomes."
      }
    ],
    keyPrinciple: "Modelers have an ethical responsibility to communicate uncertainty honestly and avoid advocacy. Present limitations alongside results so decision-makers can make informed choices.",
    chapterReference: 17
  },
  3: {
    scenario: "You're starting a combined sewer overflow (CSO) modeling project. The client provides flow monitoring data from three locations, but upon review you find one meter was installed in a location prone to surcharging, one has significant data gaps during storms, and one appears reliable but covers only 4 months.",
    question: "How should you handle this data quality situation?",
    context: "The project requires continuous simulation over 10 years for regulatory compliance.",
    options: [
      {
        label: "A",
        text: "Use all three monitors equally since they all provide some information",
        isCorrect: false,
        feedback: "Treating unreliable data equally with reliable data propagates errors. The surcharging location may produce systematically biased readings during the events that matter most."
      },
      {
        label: "B",
        text: "Document quality issues, rate each source's reliability, and weight their use in calibration accordingly",
        isCorrect: true,
        feedback: "Data quality documentation enables informed decisions about data use. Lower-quality data can still inform parameter ranges while reliable data drives calibration."
      },
      {
        label: "C",
        text: "Discard all monitoring data and use literature values for calibration",
        isCorrect: false,
        feedback: "Even imperfect local data is typically more valuable than generic literature values. The key is appropriate weighting, not wholesale rejection."
      },
      {
        label: "D",
        text: "Request the client install new monitors and postpone modeling until better data exists",
        isCorrect: false,
        feedback: "While better data helps, projects have timelines and budgets. A responsible modeler works with available data while documenting limitations and their impact on reliability."
      }
    ],
    keyPrinciple: "All data sources should be evaluated for reliability and their limitations documented. Data quality directly affects model uncertainty and should be explicitly addressed in calibration and reporting.",
    chapterReference: 3
  }
};
