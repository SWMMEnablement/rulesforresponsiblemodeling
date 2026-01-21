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
  1: {
    scenario: "A client wants you to model flooding for a 500-acre development. They provide a 30-year rainfall record, 2020 LiDAR, and an outdated 1995 pipe survey. They want results 'as accurate as possible' for design.",
    question: "What is your FIRST priority before building the model?",
    context: "Budget is flexible but timeline is 3 months. The development includes a hospital requiring reliable flood protection.",
    options: [
      {
        label: "A",
        text: "Start building the model immediately using all available data to meet the timeline",
        isCorrect: false,
        feedback: "Starting without clear objectives risks building the wrong model. The hospital's critical nature requires specific accuracy targets that should be defined upfront."
      },
      {
        label: "B",
        text: "Define clear modeling objectives: What decisions will the model inform? What accuracy is needed for those decisions?",
        isCorrect: true,
        feedback: "Correct. Rule 1: Define objectives clearly. The hospital requires specific flood protection standards that should drive model requirements, data needs, and acceptable uncertainty levels."
      },
      {
        label: "C",
        text: "Recommend updating the pipe survey before any modeling begins",
        isCorrect: false,
        feedback: "While data quality matters (Rule 3), you cannot assess data adequacy without first defining what decisions the model must support. The survey may or may not be critical."
      },
      {
        label: "D",
        text: "Tell the client their request is too vague and refuse the project",
        isCorrect: false,
        feedback: "This avoids the modeler's responsibility to help clients clarify their needs. Professional modelers guide clients toward well-defined objectives."
      }
    ],
    keyPrinciple: "Before any technical work, clearly define what decisions the model will inform. Vague objectives lead to unfocused models that fail to deliver actionable insights.",
    chapterReference: 1
  },
  2: {
    scenario: "You're modeling a 2 km² urban catchment for a CSO long-term control plan. The client wants 15-minute timesteps with 200 subcatchments derived from 1m LiDAR. You have 6 months of 5-minute flow data for calibration.",
    question: "What discretization concern should you raise with the client?",
    context: "The project must simulate 30 years continuously for regulatory compliance.",
    options: [
      {
        label: "A",
        text: "The proposed setup is appropriate—proceed as specified",
        isCorrect: false,
        feedback: "200 subcatchments for 2 km² (1 per hectare) may exceed what 6 months of calibration data can reliably constrain, risking equifinality issues."
      },
      {
        label: "B",
        text: "Reduce subcatchment count since 6 months of data cannot reliably calibrate 200 subcatchments",
        isCorrect: true,
        feedback: "Correct. Limited calibration data cannot constrain highly discretized models. A coarser discretization matched to data availability reduces equifinality and improves reliability."
      },
      {
        label: "C",
        text: "Increase to 1-minute timesteps for better accuracy",
        isCorrect: false,
        feedback: "Finer timesteps increase computational burden without addressing the fundamental mismatch between spatial discretization and calibration data availability."
      },
      {
        label: "D",
        text: "Request 30 years of calibration data to match simulation period",
        isCorrect: false,
        feedback: "While more data helps, this is impractical. Dr. James notes that short, accurate calibration periods are sufficient—the issue is spatial over-discretization."
      }
    ],
    keyPrinciple: "Discretization should match data availability and modeling objectives. Finer resolution than data can support increases uncertainty through parameter identifiability problems.",
    chapterReference: 2
  },
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
  5: {
    scenario: "You're asked to assess urbanization impacts on stream baseflow for an ecological study. The client has 3 years of continuous flow data and wants to understand summer low-flow impacts on aquatic habitat.",
    question: "Why is continuous simulation essential for this project?",
    context: "The study will inform stream restoration and development limits.",
    options: [
      {
        label: "A",
        text: "Event-based modeling of summer storms would capture low-flow conditions adequately",
        isCorrect: false,
        feedback: "Event models miss inter-storm processes critical to baseflow: groundwater recharge, ET, soil moisture dynamics. They cannot simulate the seasonal patterns affecting summer low flows."
      },
      {
        label: "B",
        text: "Continuous simulation captures seasonal water balance, antecedent conditions, and groundwater-surface water interactions essential for baseflow assessment",
        isCorrect: true,
        feedback: "Correct. Baseflow depends on long-term processes: infiltration, groundwater recharge, ET, and seasonal patterns. Only continuous simulation can represent how urbanization alters these processes."
      },
      {
        label: "C",
        text: "Continuous simulation is unnecessary—use average annual water balance calculations",
        isCorrect: false,
        feedback: "Annual averages mask seasonal patterns critical for ecological assessment. Summer low flows, not annual totals, determine habitat viability."
      },
      {
        label: "D",
        text: "Use design drought conditions from frequency analysis",
        isCorrect: false,
        feedback: "Frequency analysis provides return period flows but not the temporal dynamics and antecedent condition evolution needed to understand urbanization impacts on baseflow."
      }
    ],
    keyPrinciple: "Continuous simulation is essential for sustainability analysis because it captures long-term water balance, seasonal variations, and inter-storm processes that event-based models miss.",
    chapterReference: 5
  },
  6: {
    scenario: "Your project has 50 years of daily rainfall data but needs 5-minute resolution for urban drainage modeling. The client suggests using a regional IDF curve with a standard hyetograph pattern.",
    question: "What is the limitation of the IDF/hyetograph approach that you should communicate?",
    context: "The project is for long-term CSO compliance requiring risk-based assessment.",
    options: [
      {
        label: "A",
        text: "IDF curves are always accurate—proceed as suggested",
        isCorrect: false,
        feedback: "IDF/hyetograph approaches provide a single 'design storm' that doesn't capture the range of actual storm characteristics affecting CSO activation."
      },
      {
        label: "B",
        text: "A single design storm cannot capture the variability in storm temporal patterns that affects CSO response; consider stochastic disaggregation",
        isCorrect: true,
        feedback: "Correct. CSO activation depends on storm intensity profiles, not just total depth. Stochastic disaggregation generates ensembles preserving observed statistics while providing sub-hourly detail."
      },
      {
        label: "C",
        text: "Daily data is sufficient—no disaggregation needed",
        isCorrect: false,
        feedback: "Daily data cannot capture peak intensities that activate CSOs. Urban drainage responds to sub-hourly rainfall variations that daily data completely misses."
      },
      {
        label: "D",
        text: "Use the design storm but add a 20% safety factor",
        isCorrect: false,
        feedback: "Arbitrary safety factors don't address the fundamental issue: single storms can't represent the range of conditions affecting long-term CSO frequency and volume."
      }
    ],
    keyPrinciple: "Rainfall input deserves as much attention as model calibration. Stochastic methods capture the range of temporal patterns affecting system response, avoiding false precision from single design storms.",
    chapterReference: 6
  },
  7: {
    scenario: "Your flood model consistently underpredicts peaks for fast-moving summer convective storms but matches well for slower frontal systems. The model uses a single stationary rainfall input derived from a gauge network.",
    question: "What is the most likely cause of this discrepancy?",
    context: "The watershed is 15 km long with 2-hour time of concentration.",
    options: [
      {
        label: "A",
        text: "The rainfall gauges are incorrectly calibrated",
        isCorrect: false,
        feedback: "Gauge errors would affect all storms, not systematically fast-moving convective storms. The pattern suggests storm motion is the issue."
      },
      {
        label: "B",
        text: "Fast-moving storms at critical velocity synchronize runoff, but stationary rainfall input cannot capture this effect",
        isCorrect: true,
        feedback: "Correct. When storm velocity matches catchment response time (critical velocity), runoff from all subcatchments arrives simultaneously, increasing peaks. Stationary input misses this effect."
      },
      {
        label: "C",
        text: "Convective storms have different infiltration characteristics",
        isCorrect: false,
        feedback: "While infiltration varies, the systematic underprediction for fast storms specifically points to storm kinematics—the interaction between storm motion and catchment response."
      },
      {
        label: "D",
        text: "Summer antecedent conditions are different",
        isCorrect: false,
        feedback: "Antecedent conditions would affect runoff volume, but the issue is peak magnitude for fast storms specifically, pointing to storm motion effects."
      }
    ],
    keyPrinciple: "Storm cell movement interacts with catchment geometry to affect peak flows. Critical storm velocity, where storm motion matches time of concentration, can dramatically increase peaks.",
    chapterReference: 7
  },
  8: {
    scenario: "A utility is implementing PCSWMM for system-wide modeling. Staff ask whether they should use the automated calibration tools or manually adjust parameters.",
    question: "What guidance aligns with responsible modeling practice?",
    context: "Staff have limited modeling experience but good system knowledge.",
    options: [
      {
        label: "A",
        text: "Use only automated calibration—it's more objective and faster",
        isCorrect: false,
        feedback: "Automated tools without understanding can produce physically unrealistic parameters. Manual review ensures results make sense given system knowledge."
      },
      {
        label: "B",
        text: "Use decision support features to combine automated optimization with manual review based on system knowledge",
        isCorrect: true,
        feedback: "Correct. DSS tools should augment, not replace, engineering judgment. Automated calibration finds mathematically optimal solutions; staff knowledge identifies physically meaningful ones."
      },
      {
        label: "C",
        text: "Avoid all automation—only manual calibration is trustworthy",
        isCorrect: false,
        feedback: "This wastes the efficiency benefits of decision support systems. The goal is leveraging tools while maintaining professional oversight."
      },
      {
        label: "D",
        text: "Hire consultants to do all modeling—staff shouldn't touch complex software",
        isCorrect: false,
        feedback: "This contradicts the purpose of decision support systems, which is to enable practitioners to leverage sophisticated tools effectively."
      }
    ],
    keyPrinciple: "Decision support systems integrate modeling with user-friendly interfaces to support—not replace—professional judgment. Staff knowledge of the physical system is essential context for interpreting optimization results.",
    chapterReference: 8
  },
  9: {
    scenario: "Your calibrated model has NSE=0.92 (excellent overall fit) but systematically underpredicts peak flows by 25%. The model will be used for flood infrastructure sizing.",
    question: "How should you address this calibration result?",
    context: "The client is impressed by the high NSE and wants to proceed to design.",
    options: [
      {
        label: "A",
        text: "NSE=0.92 indicates excellent calibration—proceed to design",
        isCorrect: false,
        feedback: "NSE alone is insufficient. For flood design, peak accuracy is critical. A high NSE with 25% peak underprediction would lead to undersized infrastructure."
      },
      {
        label: "B",
        text: "Re-calibrate using multi-objective approach that includes peak flow accuracy, explaining the trade-off to the client",
        isCorrect: true,
        feedback: "Correct. The objective function must match the application. Flood design requires peak accuracy. Multi-objective calibration reveals trade-offs and ensures fit-for-purpose results."
      },
      {
        label: "C",
        text: "Add a 25% safety factor to model results",
        isCorrect: false,
        feedback: "This treats the symptom, not the cause. The model should be recalibrated to properly weight peak accuracy for its intended flood design application."
      },
      {
        label: "D",
        text: "Report both metrics and let the client decide",
        isCorrect: false,
        feedback: "While transparency is good, the modeler should recommend recalibration. Professional responsibility means actively ensuring the model is fit for purpose."
      }
    ],
    keyPrinciple: "Objective functions embody value judgments about what matters. Match your metrics to your application—flood design requires peak accuracy, not just overall fit statistics.",
    chapterReference: 9
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
  12: {
    scenario: "You're designing a real-time control system for a stormwater network. The system has 5 controllable gates, 8 storage facilities, and 12 monitoring points. You need to understand how gate operations affect system-wide response.",
    question: "How does state variable space analysis help this application?",
    context: "The goal is optimal control to minimize combined sewer overflows.",
    options: [
      {
        label: "A",
        text: "It's not relevant—just run scenarios with different gate settings",
        isCorrect: false,
        feedback: "Scenario-based approaches explore limited combinations. State space analysis provides systematic understanding of control system behavior across all operating conditions."
      },
      {
        label: "B",
        text: "State space representation reveals how storage, flows, and gate positions interact, enabling systematic identification of optimal control trajectories",
        isCorrect: true,
        feedback: "Correct. State variables (storages, flows) and controls (gates) form a multi-dimensional space where optimal trajectories can be identified mathematically rather than by trial-and-error."
      },
      {
        label: "C",
        text: "Use state space only for visualizing results after optimization",
        isCorrect: false,
        feedback: "State space is a framework for analysis and optimization, not just visualization. It enables systematic control design rather than ad-hoc scenario testing."
      },
      {
        label: "D",
        text: "State space is only for academic research, not practical applications",
        isCorrect: false,
        feedback: "State space methods are used in many real-time control systems. They provide the mathematical foundation for optimal control of complex water systems."
      }
    ],
    keyPrinciple: "State variable space provides a unified framework for understanding system dynamics, revealing interactions between components and enabling systematic optimization of control strategies.",
    chapterReference: 12
  },
  13: {
    scenario: "A peer reviewer criticizes your model report for using only NSE to assess performance. The model is for long-term water supply planning requiring accurate annual yields.",
    question: "How should you respond to improve the performance evaluation?",
    context: "The model was calibrated to 10 years of monthly streamflow data.",
    options: [
      {
        label: "A",
        text: "Defend NSE as the standard metric—no changes needed",
        isCorrect: false,
        feedback: "NSE emphasizes high flows and can miss systematic volume bias important for water supply. Multiple metrics provide more complete assessment."
      },
      {
        label: "B",
        text: "Add complementary metrics (PBIAS for volume, flow duration curves for yield) that address water supply objectives",
        isCorrect: true,
        feedback: "Correct. Performance evaluation should include multiple metrics aligned with project objectives. PBIAS captures volume errors; flow duration curves show yield reliability."
      },
      {
        label: "C",
        text: "Switch to RMSE instead of NSE",
        isCorrect: false,
        feedback: "Replacing one single metric with another doesn't address the fundamental issue. Multiple complementary metrics are needed for comprehensive assessment."
      },
      {
        label: "D",
        text: "Show the reviewer that high flows drive NSE, so it's appropriate",
        isCorrect: false,
        feedback: "This confirms the reviewer's concern. Water supply depends on reliable yields, not peak flows. The evaluation needs metrics relevant to the application."
      }
    ],
    keyPrinciple: "Performance evaluation functions embody value judgments. No single metric is universally appropriate—select multiple complementary metrics that collectively address the range of behaviors relevant to your application.",
    chapterReference: 13
  },
  14: {
    scenario: "Your genetic algorithm calibration produces a parameter set with NSE=0.91, but manual inspection shows the 'optimal' infiltration rate is 10x higher than physically plausible for the soil type.",
    question: "What should you do with this optimization result?",
    context: "You're under pressure to deliver results quickly.",
    options: [
      {
        label: "A",
        text: "Accept the result—the algorithm found the mathematical optimum",
        isCorrect: false,
        feedback: "Optimization finds mathematical optima, not necessarily physical reality. Parameters must be physically plausible; otherwise, the model lacks predictive reliability."
      },
      {
        label: "B",
        text: "Constrain the infiltration parameter to physically plausible ranges and re-run optimization",
        isCorrect: true,
        feedback: "Correct. Optimization must respect physical constraints. The unrealistic parameter compensates for other model errors—constraining it forces the algorithm to find physically meaningful solutions."
      },
      {
        label: "C",
        text: "Report both the NSE and the parameter value, letting the client decide",
        isCorrect: false,
        feedback: "Professional responsibility requires ensuring model reliability. Reporting physically implausible parameters without correction abdicates this responsibility."
      },
      {
        label: "D",
        text: "Average this result with literature values",
        isCorrect: false,
        feedback: "Averaging doesn't resolve the underlying issue—the model structure or other parameters may be causing the optimizer to compensate with unrealistic infiltration."
      }
    ],
    keyPrinciple: "Optimization is powerful but not magic. A well-optimized poor model gives poor predictions. Parameters must be constrained to physically plausible ranges, and optimization should follow, not replace, careful model construction.",
    chapterReference: 14
  },
  15: {
    scenario: "Operators at a stormwater facility complain that the rule-based control system fails when sensor readings are noisy or near threshold values. Gates oscillate rapidly when levels hover around set points.",
    question: "How could fuzzy logic address this control problem?",
    context: "The facility has variable inflows and experienced operators who handle edge cases intuitively.",
    options: [
      {
        label: "A",
        text: "Add more crisp thresholds to handle the edge cases",
        isCorrect: false,
        feedback: "More thresholds create more edges to oscillate around. The fundamental problem is crisp logic's sensitivity to exact values near boundaries."
      },
      {
        label: "B",
        text: "Fuzzy logic allows gradual transitions in control response, incorporating operator expertise as linguistic rules to eliminate threshold oscillation",
        isCorrect: true,
        feedback: "Correct. Fuzzy sets provide smooth transitions rather than hard boundaries. Expert operator knowledge can be encoded as linguistic rules (e.g., 'IF level is fairly high...')."
      },
      {
        label: "C",
        text: "Replace the control system with manual operation only",
        isCorrect: false,
        feedback: "This abandons automation benefits. The goal is encoding operator expertise into the system, not eliminating automation."
      },
      {
        label: "D",
        text: "Add time delays to prevent rapid oscillation",
        isCorrect: false,
        feedback: "Delays treat the symptom but may cause sluggish response to real changes. Fuzzy logic addresses the root cause—inappropriate sensitivity to exact threshold values."
      }
    ],
    keyPrinciple: "Fuzzy logic provides a bridge between human reasoning and computational models, handling imprecision gracefully and enabling smooth control transitions that crisp rule-based systems cannot achieve.",
    chapterReference: 15
  },
  16: {
    scenario: "Your real-time flood forecast system shows a 65% probability of exceeding flood stage in 4 hours. The emergency manager asks for a 'definite' prediction to decide whether to issue evacuation orders.",
    question: "How should you communicate the forecast uncertainty?",
    context: "False alarms erode public trust; missed warnings endanger lives. Previous evacuations cost $2M and take 3 hours.",
    options: [
      {
        label: "A",
        text: "Round up to 'flooding likely' to err on the side of caution",
        isCorrect: false,
        feedback: "This converts probabilistic information to crisp statements, eliminating the uncertainty information that should inform risk-based decisions."
      },
      {
        label: "B",
        text: "Explain that 65% probability means flooding is more likely than not, and present decision options based on risk tolerance and consequences",
        isCorrect: true,
        feedback: "Correct. Honest uncertainty communication enables risk-informed decisions. The manager can weigh evacuation costs against 65% flooding probability and potential consequences."
      },
      {
        label: "C",
        text: "Wait for 90% probability before recommending action",
        isCorrect: false,
        feedback: "High-confidence thresholds may arrive too late for effective response. The 3-hour evacuation time requires earlier, probability-based decision-making."
      },
      {
        label: "D",
        text: "Tell the manager the model is too uncertain to be useful",
        isCorrect: false,
        feedback: "This abdicates responsibility. A 65% probability provides useful decision-support information if communicated properly with consequences context."
      }
    ],
    keyPrinciple: "Uncertainty is not a sign of failure—it is an inherent characteristic of all forecasts. The responsible approach is to communicate uncertainty honestly so decision-makers can calibrate responses to risk tolerance and consequences.",
    chapterReference: 16
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
