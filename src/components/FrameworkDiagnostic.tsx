import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  HelpCircle,
  Target,
  Lightbulb,
  ArrowRight
} from "lucide-react";

interface DiagnosticIssue {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  relatedConcepts: string[];
  recommendedChapters: { number: number; title: string; relevance: string }[];
  commonPitfalls: string[];
  quickChecks: string[];
}

const diagnosticIssues: DiagnosticIssue[] = [
  {
    id: "overfitting",
    title: "My calibration is overfit",
    description: "The model performs well on calibration data but poorly on validation data or new scenarios.",
    symptoms: [
      "Excellent fit statistics (R² > 0.95) on training data",
      "Poor performance on independent validation events",
      "Model fails when applied to different conditions",
      "Too many parameters relative to data points"
    ],
    relatedConcepts: ["Parameter Optimization", "Sensitivity Testing", "Model Validation"],
    recommendedChapters: [
      { number: 4, title: "Optimal Complexity", relevance: "Parsimony principle to reduce parameters" },
      { number: 11, title: "Model Calibration", relevance: "Proper calibration techniques" },
      { number: 14, title: "Model Validation", relevance: "Split-sample testing and validation" }
    ],
    commonPitfalls: [
      "Using R² alone as the only performance metric",
      "Calibrating all parameters simultaneously",
      "Not reserving independent data for validation",
      "Over-parameterizing to match noise in data"
    ],
    quickChecks: [
      "Have you validated on an independent dataset?",
      "Is your parameter count justified by data availability?",
      "Have you performed sensitivity analysis to identify key parameters?"
    ]
  },
  {
    id: "poor-predictions",
    title: "Model predictions don't match reality",
    description: "Model outputs differ significantly from observed conditions or expected behavior.",
    symptoms: [
      "Peak flows consistently under or over-predicted",
      "Timing of hydrograph is off",
      "Water balance doesn't close",
      "Unrealistic parameter values needed for fit"
    ],
    relatedConcepts: ["Data Quality", "Process Representation", "Conceptualization"],
    recommendedChapters: [
      { number: 3, title: "Data Reliability", relevance: "Assess input data quality" },
      { number: 5, title: "Model Conceptualization", relevance: "Check process representation" },
      { number: 10, title: "Uncertainty Analysis", relevance: "Quantify and propagate uncertainty" }
    ],
    commonPitfalls: [
      "Trusting input data without quality assessment",
      "Missing dominant physical processes",
      "Incorrect spatial or temporal discretization",
      "Ignoring measurement uncertainty in observations"
    ],
    quickChecks: [
      "Have you verified your input data quality and sources?",
      "Are all dominant physical processes represented?",
      "Does the model's water balance close?"
    ]
  },
  {
    id: "uncertainty",
    title: "I don't know how uncertain my results are",
    description: "Unable to quantify or communicate the reliability of model predictions.",
    symptoms: [
      "Presenting single-line predictions without bounds",
      "No sensitivity analysis performed",
      "Stakeholders ask about confidence and you can't answer",
      "Multiple parameter sets give similar fits"
    ],
    relatedConcepts: ["Uncertainty Quantification", "Monte Carlo", "Sensitivity Analysis"],
    recommendedChapters: [
      { number: 10, title: "Uncertainty Analysis", relevance: "Methods for uncertainty quantification" },
      { number: 4, title: "Optimal Complexity", relevance: "Understanding equifinality" },
      { number: 17, title: "Ethical Responsibility", relevance: "Communicating uncertainty to stakeholders" }
    ],
    commonPitfalls: [
      "Ignoring parameter uncertainty",
      "Not considering input data uncertainty",
      "Presenting deterministic results for stochastic processes",
      "Equating model fit with prediction confidence"
    ],
    quickChecks: [
      "Have you quantified parameter uncertainty?",
      "Are you propagating input data uncertainty?",
      "Can you provide confidence intervals on predictions?"
    ]
  },
  {
    id: "complexity-choice",
    title: "I'm unsure what model complexity to use",
    description: "Difficulty choosing between simple and complex modeling approaches.",
    symptoms: [
      "Debate between lumped vs. distributed approaches",
      "Pressure to use 'advanced' 2D/3D models",
      "Limited data but complex system",
      "Uncertain about appropriate spatial/temporal resolution"
    ],
    relatedConcepts: ["Parsimony", "Data Availability", "Optimal Complexity"],
    recommendedChapters: [
      { number: 4, title: "Optimal Complexity", relevance: "Framework for complexity selection" },
      { number: 2, title: "Model Structure", relevance: "Matching structure to objectives" },
      { number: 6, title: "Discretization", relevance: "Spatial and temporal resolution" }
    ],
    commonPitfalls: [
      "Choosing complexity based on software capabilities, not data",
      "Assuming more detail always means better results",
      "Not considering computational constraints",
      "Ignoring the parsimony principle"
    ],
    quickChecks: [
      "Do you have sufficient data to support the chosen complexity?",
      "Have you considered a simpler approach first?",
      "Can you justify each added parameter with data?"
    ]
  },
  {
    id: "stakeholder-communication",
    title: "Stakeholders don't understand my results",
    description: "Difficulty explaining model outputs and their implications to decision-makers.",
    symptoms: [
      "Technical jargon confusion",
      "Questions about why results differ from expectations",
      "Resistance to model-based recommendations",
      "Misinterpretation of uncertainty information"
    ],
    relatedConcepts: ["Communication", "Visualization", "Decision Support"],
    recommendedChapters: [
      { number: 17, title: "Ethical Responsibility", relevance: "Clear communication of limitations" },
      { number: 15, title: "Model Documentation", relevance: "Transparent reporting" },
      { number: 1, title: "Problem Definition", relevance: "Aligning with stakeholder needs" }
    ],
    commonPitfalls: [
      "Using technical metrics stakeholders don't understand",
      "Not explaining model limitations upfront",
      "Presenting false precision in results",
      "Failing to connect results to decisions"
    ],
    quickChecks: [
      "Have you explained what the model can and cannot do?",
      "Are you presenting results in stakeholder-relevant terms?",
      "Have you clearly communicated uncertainty and limitations?"
    ]
  },
  {
    id: "data-quality",
    title: "My input data quality is questionable",
    description: "Uncertainty about the reliability of model inputs and how to handle data gaps.",
    symptoms: [
      "Missing data periods in records",
      "Inconsistent data from different sources",
      "Unknown measurement accuracy",
      "Spatial data doesn't match model needs"
    ],
    relatedConcepts: ["Data Quality Assessment", "Gap Filling", "Uncertainty"],
    recommendedChapters: [
      { number: 3, title: "Data Reliability", relevance: "Data quality assessment framework" },
      { number: 7, title: "Input Data Processing", relevance: "Handling data gaps and errors" },
      { number: 10, title: "Uncertainty Analysis", relevance: "Propagating data uncertainty" }
    ],
    commonPitfalls: [
      "Treating all data as equally reliable",
      "Not documenting data sources and quality",
      "Interpolating without uncertainty bounds",
      "Ignoring spatial representativeness issues"
    ],
    quickChecks: [
      "Have you rated the reliability of each data source?",
      "Are data gaps documented and handled appropriately?",
      "Is data uncertainty propagated through the model?"
    ]
  },
  {
    id: "calibration-approach",
    title: "I don't know how to calibrate effectively",
    description: "Uncertainty about calibration strategies and parameter estimation methods.",
    symptoms: [
      "Ad-hoc parameter adjustment",
      "Calibrating too many parameters at once",
      "No clear objective function",
      "Inconsistent calibration results"
    ],
    relatedConcepts: ["Objective Functions", "Sensitivity Analysis", "Optimization"],
    recommendedChapters: [
      { number: 11, title: "Model Calibration", relevance: "Systematic calibration approach" },
      { number: 4, title: "Optimal Complexity", relevance: "Sensitivity-based parameter selection" },
      { number: 12, title: "Performance Metrics", relevance: "Choosing objective functions" }
    ],
    commonPitfalls: [
      "Calibrating insensitive parameters",
      "Using single-objective optimization for multi-response systems",
      "Not considering parameter correlation",
      "Over-relying on automatic calibration"
    ],
    quickChecks: [
      "Have you identified the most sensitive parameters?",
      "Are you using multiple performance metrics?",
      "Is your calibration approach documented and reproducible?"
    ]
  },
  {
    id: "model-validation",
    title: "How do I know if my model is valid?",
    description: "Uncertainty about validation approaches and acceptance criteria.",
    symptoms: [
      "No independent validation data set aside",
      "Unclear what 'good enough' performance means",
      "Model not tested under different conditions",
      "Validation limited to same events as calibration"
    ],
    relatedConcepts: ["Split-Sample Testing", "Performance Metrics", "Model Acceptance"],
    recommendedChapters: [
      { number: 14, title: "Model Validation", relevance: "Validation strategies and criteria" },
      { number: 12, title: "Performance Metrics", relevance: "Objective performance assessment" },
      { number: 13, title: "Scenario Testing", relevance: "Testing under varied conditions" }
    ],
    commonPitfalls: [
      "Validating on the same data used for calibration",
      "Using only graphical 'eyeball' comparison",
      "Not testing extreme conditions",
      "Ignoring validation failure warning signs"
    ],
    quickChecks: [
      "Have you reserved independent data for validation?",
      "Are your acceptance criteria defined before validation?",
      "Have you tested the model under varied conditions?"
    ]
  }
];

export const FrameworkDiagnostic = () => {
  const [selectedIssue, setSelectedIssue] = useState<DiagnosticIssue | null>(null);

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          Framework Diagnostic Tool
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on your modeling challenge to get personalized guidance, recommended chapters, and common pitfalls to avoid.
        </p>
      </CardHeader>
      <CardContent>
        {!selectedIssue ? (
          <div className="grid sm:grid-cols-2 gap-3">
            {diagnosticIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="p-4 text-left rounded-lg border border-border bg-background hover:bg-accent/10 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedIssue.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(null)}>
                ← Back
              </Button>
            </div>

            {/* Related Concepts Highlighted */}
            <div className="flex flex-wrap gap-2">
              {selectedIssue.relatedConcepts.map((concept, idx) => (
                <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                  {concept}
                </Badge>
              ))}
            </div>

            {/* Symptoms */}
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Common Symptoms
              </h4>
              <ul className="space-y-1.5">
                {selectedIssue.symptoms.map((symptom, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Chapters */}
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                Recommended Reading
              </h4>
              <div className="space-y-2">
                {selectedIssue.recommendedChapters.map((chapter) => (
                  <Link
                    key={chapter.number}
                    to={`/chapter/${chapter.number}`}
                    className="block p-3 rounded-lg border border-border bg-background hover:bg-primary/5 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-primary">Chapter {chapter.number}</span>
                        <h5 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {chapter.title}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-0.5">{chapter.relevance}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Common Pitfalls */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-destructive" />
                Common Pitfalls to Avoid
              </h4>
              <ul className="space-y-1.5">
                {selectedIssue.commonPitfalls.map((pitfall, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    {pitfall}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Checks */}
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Quick Self-Check Questions
              </h4>
              <ul className="space-y-2">
                {selectedIssue.quickChecks.map((check, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
