import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { ClipboardList, Calculator, FileText, Users, Lightbulb } from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  type: "analysis" | "calculation" | "discussion" | "hands-on";
  chapters: number[];
  description: string;
  tasks: string[];
  deliverables: string[];
  hint?: string;
}

const exercises: Exercise[] = [
  {
    id: "ex-1",
    title: "Model Purpose Statement Workshop",
    difficulty: "beginner",
    duration: "30 min",
    type: "analysis",
    chapters: [1, 4],
    description: "Practice articulating clear model objectives before beginning any modeling project.",
    tasks: [
      "Select a hypothetical urban drainage problem (e.g., flooding at a specific intersection)",
      "Write a one-paragraph problem statement identifying stakeholders and constraints",
      "List 3-5 specific questions the model must answer",
      "Identify what 'success' looks like for this modeling effort",
      "Determine minimum acceptable accuracy for decision-making"
    ],
    deliverables: [
      "Problem statement document (1 page)",
      "Model objectives checklist",
      "Success criteria table"
    ],
    hint: "Focus on what decisions will be made with model results, not just what the model will simulate."
  },
  {
    id: "ex-2",
    title: "Discretization Sensitivity Experiment",
    difficulty: "intermediate",
    duration: "2 hours",
    type: "calculation",
    chapters: [2, 11],
    description: "Explore how spatial and temporal discretization choices affect model results.",
    tasks: [
      "Set up a simple subcatchment with known characteristics",
      "Run the model with 3 different subcatchment subdivision levels",
      "Run with 3 different time steps (e.g., 1 min, 5 min, 15 min)",
      "Compare peak flows and volumes across all combinations",
      "Plot results showing sensitivity to discretization choices"
    ],
    deliverables: [
      "Comparison table of results",
      "Sensitivity plot",
      "Written analysis (1-2 paragraphs) of optimal discretization"
    ],
    hint: "Consider the relationship between time step and time of concentration (CFL condition)."
  },
  {
    id: "ex-3",
    title: "Data Quality Audit",
    difficulty: "beginner",
    duration: "1 hour",
    type: "analysis",
    chapters: [3],
    description: "Practice systematic data quality assessment for model inputs.",
    tasks: [
      "Obtain a rainfall dataset (real or provided)",
      "Check for missing values and document gaps",
      "Identify suspicious values (negatives, outliers, constant periods)",
      "Compare with nearby stations if available",
      "Assign a quality rating to the dataset with justification"
    ],
    deliverables: [
      "Data quality checklist (completed)",
      "Gap analysis table",
      "Quality rating memo"
    ],
    hint: "Missing data is obvious; systematic errors (e.g., blocked gauge) are harder to detect."
  },
  {
    id: "ex-4",
    title: "Objective Function Comparison",
    difficulty: "intermediate",
    duration: "2 hours",
    type: "calculation",
    chapters: [9, 13],
    description: "Understand how different objective functions lead to different 'optimal' parameters.",
    tasks: [
      "Using a calibrated model or spreadsheet, calculate NSE, RMSE, PBIAS, and KGE",
      "Manually adjust parameters to improve NSE and record other metrics",
      "Repeat, optimizing for PBIAS instead",
      "Document trade-offs between metrics",
      "Recommend which metric to use for different modeling purposes"
    ],
    deliverables: [
      "Metrics comparison table",
      "Trade-off analysis",
      "Recommendations document"
    ],
    hint: "What matters most: peak accuracy, volume conservation, or overall fit?"
  },
  {
    id: "ex-5",
    title: "Monte Carlo Uncertainty Exercise",
    difficulty: "advanced",
    duration: "3 hours",
    type: "calculation",
    chapters: [10, 13],
    description: "Implement a simple Monte Carlo analysis to quantify prediction uncertainty.",
    tasks: [
      "Identify 3-5 uncertain parameters in your model",
      "Assign probability distributions based on literature or judgment",
      "Generate 100+ random parameter combinations",
      "Run model for each combination and record peak flow",
      "Calculate 5th, 50th, and 95th percentile predictions"
    ],
    deliverables: [
      "Parameter distribution table",
      "Histogram of results",
      "Confidence interval report"
    ],
    hint: "Use the interactive Monte Carlo calculator in Chapter 10 to explore concepts first."
  },
  {
    id: "ex-6",
    title: "Stakeholder Communication Role-Play",
    difficulty: "beginner",
    duration: "45 min",
    type: "discussion",
    chapters: [16, 17],
    description: "Practice explaining model uncertainty to non-technical decision-makers.",
    tasks: [
      "Prepare a 5-minute presentation on model results with uncertainty",
      "Present to a partner playing a skeptical city councilmember",
      "Answer challenging questions about model reliability",
      "Avoid jargon while maintaining technical accuracy",
      "Document lessons learned"
    ],
    deliverables: [
      "Presentation slides (5-7 slides)",
      "Anticipated Q&A document",
      "Reflection notes"
    ],
    hint: "Focus on what the uncertainty means for the decision, not on statistical details."
  }
];

const typeIcons = {
  analysis: FileText,
  calculation: Calculator,
  discussion: Users,
  "hands-on": ClipboardList
};

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-700 border-green-200",
  intermediate: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  advanced: "bg-red-500/10 text-red-700 border-red-200"
};

export const PracticalExercises = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold text-foreground mb-3">Practical Exercises</h2>
        <p className="text-muted-foreground">
          Reinforce your learning with hands-on activities. These exercises range from conceptual analysis 
          to computational practice, designed to build real modeling skills.
        </p>
      </Card>

      <Accordion type="single" collapsible className="space-y-3">
        {exercises.map((exercise) => {
          const TypeIcon = typeIcons[exercise.type];
          return (
            <AccordionItem 
              key={exercise.id} 
              value={exercise.id}
              className="border rounded-lg bg-card"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 text-left w-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{exercise.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
                        {exercise.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">⏱ {exercise.duration}</span>
                      <span className="text-xs text-muted-foreground">
                        Ch. {exercise.chapters.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{exercise.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Tasks:</h4>
                    <ol className="space-y-2 ml-4">
                      {exercise.tasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary mr-2">{idx + 1}.</span>
                          {task}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Deliverables:</h4>
                    <ul className="space-y-1 ml-4">
                      {exercise.deliverables.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exercise.hint && (
                    <Card className="p-4 bg-muted/30 border-l-4 border-l-yellow-500">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <div>
                          <span className="font-semibold text-foreground text-sm">Hint: </span>
                          <span className="text-sm text-muted-foreground">{exercise.hint}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
