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
  1: [
    {
      id: "model-purpose-2025",
      originalConcept: "Model Purpose and Decision Support",
      modernPerspective: "In 2025, this principle is more critical than ever. With AI/ML models becoming accessible, the temptation is to apply complex methods without clear decision objectives. Start every project with: 'What decision will this model inform?'",
      softwareGuidance: {
        swmm: "SWMM's flexibility allows many modeling approaches. Document your purpose in the model notes (Options > Title/Notes) and let it drive subcatchment resolution and routing choices.",
        icm: "ICM's project templates can lock in complexity. Before accepting defaults, verify they match your actual objectives—CSO vs. flooding vs. water quality have different requirements."
      },
      practicalTip: "Create a one-paragraph 'Decision Statement' at project start. If you can't articulate what decisions the model will inform, you're not ready to build it."
    },
    {
      id: "rules-overview-modern",
      originalConcept: "Rules for Responsible Modeling",
      modernPerspective: "Dr. James's rules remain the gold standard in 2025. Modern cloud computing and automation make following these rules easier—not optional. Automated validation, version control, and documentation tools remove excuses for poor practice.",
      softwareGuidance: {
        general: "Use Git for model version control. Create README files explaining model purpose, limitations, and validation status. Treat model files like code."
      },
      practicalTip: "Post Dr. James's rules near your workstation. Before delivering any model, check each rule against your work."
    }
  ],
  2: [
    {
      id: "discretization-2025",
      originalConcept: "Discretization Trade-offs",
      modernPerspective: "With 1m LiDAR and powerful computers, over-discretization is the modern trap. High resolution doesn't equal high accuracy when calibration data is limited. Dr. James's guidance on matching discretization to data remains essential.",
      softwareGuidance: {
        swmm: "SWMM5's performance scales with subcatchment count. Start with larger subcatchments (2-5 ha for urban) and refine only where data supports it.",
        icm: "ICM's automatic mesh generation can create excessive detail. Set minimum element sizes based on calibration data density, not just topography."
      },
      practicalTip: "Before increasing spatial resolution, ask: 'Do I have calibration data at this scale?' If not, additional detail adds uncertainty, not accuracy."
    },
    {
      id: "timestep-modern",
      originalConcept: "Temporal Discretization",
      modernPerspective: "Modern continuous rainfall data (1-5 minute) enables finer timesteps, but CFL constraints and computational efficiency still matter for long-term simulations. Variable timesteps are now standard practice.",
      softwareGuidance: {
        swmm: "Use SWMM's variable timestep routing. Set wet-weather steps to 15-30 seconds, dry-weather to 5-15 minutes for efficiency.",
        icm: "ICM handles variable timesteps automatically. Monitor the 'minimum timestep used' in run logs to verify stability."
      },
      practicalTip: "For 30+ year simulations, balance accuracy against run time. A 20% faster model enables more sensitivity runs."
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
  ],
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
  5: [
    {
      id: "continuous-2025",
      originalConcept: "Continuous Simulation Benefits",
      modernPerspective: "Cloud computing makes 100-year continuous simulations routine. There's no excuse for event-based shortcuts when continuous simulation is feasible and provides frequency-concentration data that event models cannot.",
      softwareGuidance: {
        swmm: "SWMM5 handles 30+ year continuous runs efficiently. Use climate file (.cli) format for long-term rainfall. Consider hourly timesteps for computational efficiency.",
        icm: "ICM's long-term simulation modes are optimized for multi-decade runs. Use the 'Fast' engine mode for initial screening."
      },
      practicalTip: "For sustainability assessments, always prefer continuous over event-based. The additional insight into water balance and antecedent conditions is invaluable."
    },
    {
      id: "calibration-continuous-modern",
      originalConcept: "Calibration for Continuous Models",
      modernPerspective: "Dr. James's insight remains valid: short, accurate calibration periods suffice. Modern practice adds: calibrate to extremes (low flows and peaks) not just overall fit, and validate across seasons.",
      softwareGuidance: {
        swmm: "Split your calibration period by season. Verify the model performs well for both summer low flows and winter baseflow.",
        icm: "Use ICM's calibration wizard but manually check low-flow and high-flow performance separately."
      },
      practicalTip: "A model that fits annual totals but misses seasonal patterns may fail for ecological or water supply applications."
    }
  ],
  6: [
    {
      id: "rainfall-uncertainty-2025",
      originalConcept: "Rainfall Input Uncertainty",
      modernPerspective: "Radar-rainfall products (MRMS, gauge-adjusted radar) are now standard, but temporal disaggregation is still needed for sub-hourly modeling. Ensemble rainfall products enable probabilistic approaches.",
      softwareGuidance: {
        swmm: "SWMM accepts rain gauge or interface files. For ensemble runs, script multiple .dat files with pyswmm and process as Monte Carlo.",
        icm: "ICM's rainfall generator can create stochastic series. Combine with sensitivity analysis for comprehensive uncertainty assessment."
      },
      practicalTip: "Don't use a sophisticated routing model with a single design storm. The routing precision is wasted if rainfall uncertainty dominates."
    },
    {
      id: "disaggregation-modern",
      originalConcept: "Temporal Disaggregation",
      modernPerspective: "Modern rainfall databases often include sub-hourly data, reducing disaggregation needs. However, for long historical records or climate scenarios, disaggregation remains essential.",
      softwareGuidance: {
        general: "Tools like HYETOS, disaggregation R packages, or custom Python scripts can generate sub-hourly rainfall preserving daily statistics."
      },
      practicalTip: "Always validate disaggregated rainfall against available sub-hourly records before using for design."
    }
  ],
  7: [
    {
      id: "storm-motion-2025",
      originalConcept: "Storm Cell Kinematics",
      modernPerspective: "Radar tracking and NWP models now provide real-time storm motion estimates. For design, this means exploring critical storm paths—not assuming stationary rainfall.",
      softwareGuidance: {
        swmm: "Script multiple rain gauge files with different spatial patterns representing storm motion. Compare peak responses.",
        icm: "ICM's spatial rainfall can accept moving storm patterns. Create scenarios with upstream-to-downstream and reverse motion."
      },
      practicalTip: "For elongated catchments, always test critical storm velocity—where storm speed matches time of concentration."
    }
  ],
  8: [
    {
      id: "dss-2025",
      originalConcept: "Decision Support Systems",
      modernPerspective: "Modern DSS extend beyond PCSWMM to include cloud platforms, API integrations, and real-time dashboards. The principle remains: tools should support, not replace, professional judgment.",
      softwareGuidance: {
        swmm: "PCSWMM, InfoSWMM, and open-source tools like pyswmm provide DSS capabilities. Choose based on team skills and project needs.",
        icm: "ICM's scenario manager and reporting tools provide DSS functionality. Integrate with GIS for stakeholder communication."
      },
      practicalTip: "Train staff on DSS tools so they understand what's happening 'under the hood'—automation without understanding leads to errors."
    }
  ],
  9: [
    {
      id: "objective-functions-2025",
      originalConcept: "Objective Function Selection",
      modernPerspective: "KGE (Kling-Gupta Efficiency) has emerged as a preferred metric because it decomposes into correlation, bias, and variability components. But application-specific metrics still matter most.",
      softwareGuidance: {
        swmm: "Python libraries (hydroeval, spotpy) calculate multiple metrics automatically. Use them for comprehensive assessment.",
        icm: "ICM reports NSE and RMSE. Export time series to Python/R for KGE and other advanced metrics."
      },
      practicalTip: "Always report multiple metrics. If they disagree, that disagreement is information about model behavior."
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
  12: [
    {
      id: "state-space-2025",
      originalConcept: "State Variable Representation",
      modernPerspective: "With real-time control systems becoming common in water infrastructure, state space methods are increasingly practical. Model Predictive Control (MPC) uses these concepts for optimal gate/pump operations.",
      softwareGuidance: {
        icm: "ICM Live integrates state-space concepts for real-time control optimization. The RTC rules can be thought of as state-dependent actions.",
        general: "Python control libraries (python-control) can interface with water models for advanced control design."
      },
      practicalTip: "Even if you don't use formal state-space methods, thinking in terms of 'what variables define system state' improves control system design."
    }
  ],
  13: [
    {
      id: "performance-2025",
      originalConcept: "Performance Evaluation Survey",
      modernPerspective: "The proliferation of metrics can overwhelm. Focus on a small set aligned with your application, but always include at least one error metric, one efficiency metric, and one bias metric.",
      softwareGuidance: {
        general: "Python's hydroeval package calculates 18+ metrics automatically. Use it as a starting point, then select the most relevant."
      },
      practicalTip: "Create a standard performance report template for your organization. Consistency across projects enables meaningful comparisons."
    }
  ],
  14: [
    {
      id: "optimization-2025",
      originalConcept: "Genetic Algorithm Optimization",
      modernPerspective: "Modern alternatives include Differential Evolution, CMA-ES, and Bayesian optimization. GAs remain robust for complex problems, but newer methods may converge faster.",
      softwareGuidance: {
        swmm: "spotpy provides multiple optimization algorithms for SWMM. Try ROPE (RObust Parameter Estimation) for multi-objective problems.",
        icm: "ICM's optimization uses efficient algorithms. For complex problems, export to Python and use deap or pymoo libraries."
      },
      practicalTip: "Run optimization multiple times with different random seeds. If results vary significantly, you may have equifinality issues."
    }
  ],
  15: [
    {
      id: "fuzzy-2025",
      originalConcept: "Fuzzy Logic Applications",
      modernPerspective: "Fuzzy logic remains valuable for control systems and expert knowledge integration. Neural-fuzzy hybrids (ANFIS) combine fuzzy reasoning with learning capabilities.",
      softwareGuidance: {
        general: "Python's scikit-fuzzy provides fuzzy logic tools. MATLAB's Fuzzy Logic Toolbox offers more comprehensive features."
      },
      practicalTip: "Use fuzzy logic when you have expert operators who can articulate rules linguistically but struggle to quantify exact thresholds."
    }
  ],
  16: [
    {
      id: "realtime-uncertainty-2025",
      originalConcept: "Real-Time Uncertainty Display",
      modernPerspective: "Ensemble forecasting is now operational practice for major flood systems. The challenge has shifted from 'can we generate ensembles' to 'how do we communicate them effectively to decision-makers'.",
      softwareGuidance: {
        icm: "ICM Live provides ensemble generation and display capabilities. Configure confidence bands based on local operator preferences.",
        general: "Dashboard tools (Grafana, custom web apps) can display probabilistic forecasts intuitively."
      },
      practicalTip: "Train operators to interpret probabilistic forecasts. A 70% chance of flooding is useful information, but only if the operator understands what to do with it."
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
  ]
};
