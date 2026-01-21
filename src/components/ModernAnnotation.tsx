import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Calendar, Monitor, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface Annotation {
  id: string;
  originalConcept: string;
  modernPerspective: string;
  softwareGuidance?: {
    swmm?: string;
    icm?: string;
    general?: string;
  };
  practicalTip?: string;
}

interface ModernAnnotationProps {
  annotations: Annotation[];
}

export const ModernAnnotation = ({ annotations }: ModernAnnotationProps) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!showAnnotations) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
        <Switch
          id="annotations-toggle"
          checked={showAnnotations}
          onCheckedChange={setShowAnnotations}
        />
        <Label htmlFor="annotations-toggle" className="text-sm text-muted-foreground cursor-pointer">
          Show 2025 Practitioner Notes
        </Label>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">2025 Practitioner's Notes</h3>
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
            Modern Perspective
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="annotations-toggle"
            checked={showAnnotations}
            onCheckedChange={setShowAnnotations}
          />
          <Label htmlFor="annotations-toggle" className="text-xs text-muted-foreground cursor-pointer">
            Show
          </Label>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="rounded-lg border border-border bg-background/60 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === annotation.id ? null : annotation.id)}
              className="w-full p-3 text-left flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1">
                <span className="text-xs font-medium text-blue-600">Regarding:</span>
                <h4 className="font-medium text-foreground text-sm mt-0.5">
                  {annotation.originalConcept}
                </h4>
              </div>
              {expandedId === annotation.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
            
            {expandedId === annotation.id && (
              <div className="px-3 pb-3 space-y-3">
                {/* Modern Perspective */}
                <div className="p-3 rounded bg-blue-500/5 border-l-2 border-blue-500">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {annotation.modernPerspective}
                  </p>
                </div>

                {/* Software Guidance */}
                {annotation.softwareGuidance && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Monitor className="w-3.5 h-3.5" />
                      Software Implementation
                    </div>
                    <div className="grid gap-2">
                      {annotation.softwareGuidance.swmm && (
                        <div className="p-2 rounded bg-green-500/5 text-xs">
                          <span className="font-semibold text-green-700 dark:text-green-400">SWMM5:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.swmm}</span>
                        </div>
                      )}
                      {annotation.softwareGuidance.icm && (
                        <div className="p-2 rounded bg-purple-500/5 text-xs">
                          <span className="font-semibold text-purple-700 dark:text-purple-400">ICM:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.icm}</span>
                        </div>
                      )}
                      {annotation.softwareGuidance.general && (
                        <div className="p-2 rounded bg-muted/50 text-xs">
                          <span className="font-semibold text-foreground">General:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.general}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Practical Tip */}
                {annotation.practicalTip && (
                  <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Tip:</span>{" "}
                      {annotation.practicalTip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Pre-defined annotations for chapters
export const chapterAnnotations: Record<number, Annotation[]> = {
  4: [
    {
      id: "optimal-complexity-2025",
      originalConcept: "Optimal Order of Model Complexity",
      modernPerspective: "Today, this principle is more relevant than ever. With easy access to 2D/3D modeling in ICM and sophisticated LID modules in SWMM, the temptation to over-complicate is constant. Always start simple and justify each complexity increase with data.",
      softwareGuidance: {
        swmm: "Use the built-in sensitivity analysis or connect SWMM to Python/R for Morris screening before adding subcatchment detail.",
        icm: "Run 1D baseline before 2D mesh. ICM's 2D often shows minimal difference for pipe-dominated systems.",
        general: "Document your complexity justification in the model report—reviewers increasingly expect this."
      },
      practicalTip: "Create a 'complexity log' in your project folder: every time you add detail, note why and what data supports it."
    },
    {
      id: "parsimony-modern",
      originalConcept: "Parsimony Principle",
      modernPerspective: "In 2025, this is your QA/QC plan section. Document your source, confidence rating, and rationale for every major parameter. Regulators and peer reviewers expect explicit parsimony justification.",
      softwareGuidance: {
        swmm: "SWMM's RDII parameters are classic parsimony targets—can you use 3-triangle vs. 9-triangle representation?",
        icm: "ICM's automatic subcatchment generation can create unnecessary complexity. Review and simplify before calibration."
      },
      practicalTip: "For each parameter, ask: 'What data would I need to calibrate this?' If you don't have that data, consider fixing it to a literature value."
    }
  ],
  10: [
    {
      id: "uncertainty-2025",
      originalConcept: "Uncertainty Analysis",
      modernPerspective: "Monte Carlo simulation is now standard practice, not an advanced technique. Both SWMM (via Python integration) and ICM have built-in Monte Carlo tools. Present results as confidence intervals, not single lines on a graph.",
      softwareGuidance: {
        swmm: "Use pyswmm or SWMM-EPANET-Integration for automated Monte Carlo. Sample from parameter distributions, run batch simulations, plot confidence bands.",
        icm: "ICM's Risk Assessment module provides built-in Monte Carlo. Use it for design storm analysis to show 10th/90th percentile flood extents.",
        general: "For presentations, show the uncertainty band first, then explain what it means. Stakeholders need to understand range before point estimates."
      },
      practicalTip: "Start with just 3-5 key parameters for Monte Carlo. Adding all parameters makes interpretation difficult and may not improve decision-relevance."
    },
    {
      id: "sensitivity-modern",
      originalConcept: "Sensitivity Analysis",
      modernPerspective: "Global sensitivity methods (Sobol, Morris) are now computationally feasible even for complex models. Local sensitivity is still useful for quick checks, but don't rely on it for parameter selection.",
      softwareGuidance: {
        swmm: "SALib library in Python pairs well with pyswmm for Sobol sensitivity analysis. Run overnight for complex models.",
        icm: "ICM's sensitivity analysis wizard provides one-at-a-time testing. For global sensitivity, export to Python."
      },
      practicalTip: "Present sensitivity rankings to clients—it helps them understand why you focused calibration effort on specific parameters."
    }
  ],
  11: [
    {
      id: "calibration-2025",
      originalConcept: "Model Calibration",
      modernPerspective: "Automatic calibration tools are powerful but dangerous without sensitivity analysis first. Modern practice: sensitivity analysis → select 5-10 key parameters → automatic calibration → manual refinement → validation.",
      softwareGuidance: {
        swmm: "PEST and SWMM-EPANET-Integration support gradient-based and genetic algorithm calibration. Define tight bounds based on physical reasoning.",
        icm: "ICM's calibration wizard is effective but verify results manually. Watch for equifinality—multiple parameter sets may produce similar fits."
      },
      practicalTip: "Document three things for every calibration: (1) parameters adjusted, (2) events used, (3) objective function and final value. This is your calibration audit trail."
    },
    {
      id: "objective-functions-modern",
      originalConcept: "Objective Functions",
      modernPerspective: "Don't use R² alone—it's insensitive to timing and bias. Modern multi-objective calibration uses NSE, KGE, and PBIAS together. Report all three in calibration documentation.",
      softwareGuidance: {
        swmm: "Calculate KGE using Python: kling_gupta = 1 - sqrt((r-1)² + (α-1)² + (β-1)²) where r=correlation, α=variability ratio, β=bias ratio.",
        icm: "ICM reports NSE and RMSE. Supplement with volume balance checks for water balance verification."
      },
      practicalTip: "Plot observed vs. simulated on 1:1 line with validation events clearly distinguished from calibration events."
    }
  ],
  17: [
    {
      id: "ethics-2025",
      originalConcept: "Ethical Responsibility",
      modernPerspective: "In 2025, climate uncertainty adds another dimension. Be explicit about whether your model uses historical or adjusted rainfall. Stakeholder trust depends on clear communication of what the model does and doesn't include.",
      softwareGuidance: {
        general: "Create a 'Model Limitations' section in every report. Include: (1) conditions not tested, (2) data gaps, (3) extrapolation warnings, (4) climate assumptions."
      },
      practicalTip: "Before any presentation, ask: 'If this model is wrong, who gets hurt?' That question should guide how you communicate uncertainty."
    },
    {
      id: "communication-modern",
      originalConcept: "Communicate Uncertainty",
      modernPerspective: "Modern practice includes probabilistic flood mapping and risk-based decision frameworks. Present flooding as probability of occurrence, not just depth at a return period.",
      softwareGuidance: {
        icm: "ICM's 2D Risk Assessment generates probability maps directly. Present these alongside deterministic 100-year maps.",
        general: "Use phrases like 'the model suggests' and 'based on available data' rather than 'the model shows' or 'the flooding will be.'"
      },
      practicalTip: "Create a verbal disclaimer you use consistently: 'This model is a tool for decision support, not a perfect prediction of the future.'"
    }
  ],
  3: [
    {
      id: "data-reliability-2025",
      originalConcept: "Data Reliability Classification",
      modernPerspective: "With cloud-based monitoring and real-time SCADA, data quantity has exploded but quality assessment is more important than ever. Automate data quality checks as part of your workflow.",
      softwareGuidance: {
        swmm: "Use Python preprocessing scripts to flag data anomalies before import. Check for flat-line periods, negative values, and unrealistic jumps.",
        icm: "ICM's data import wizard includes some QA checks. Supplement with visual review of hydrographs before calibration."
      },
      practicalTip: "Create a data quality scorecard: rate each source 1-5 for completeness, accuracy, temporal resolution, and spatial relevance."
    },
    {
      id: "gis-data-modern",
      originalConcept: "GIS Data Integration",
      modernPerspective: "LiDAR and high-resolution DEMs are now standard, but their apparent precision can be misleading. Ground-truth critical elevations—inverts, overflows, structures—with survey data.",
      softwareGuidance: {
        swmm: "When using GIS-derived subcatchments, verify outlets manually. Auto-delineation often misses surface connectivity.",
        icm: "ICM's ground model import can use raw LiDAR, but review depression handling—real depressions vs. artifacts."
      },
      practicalTip: "For critical structures (detention ponds, outfalls), spend the money on survey. LiDAR is great for terrain but not for below-grade infrastructure."
    }
  ]
};
