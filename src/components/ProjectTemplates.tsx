import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  FileText, 
  Download, 
  BarChart3, 
  AlertTriangle,
  FileCheck,
  Eye,
  CheckCircle2
} from "lucide-react";
import { jsPDF } from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface TemplateSection {
  title: string;
  items: string[];
}

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  filename: string;
  color: string;
  sections: TemplateSection[];
  guidelines: string[];
  references: { chapter: number; topic: string }[];
}

const templates: Template[] = [
  {
    id: "scoping",
    title: "Model Scoping Report Template",
    description: "Document project objectives, data inventory, and modeling approach decisions before building.",
    icon: <FileText className="w-6 h-6" />,
    filename: "model-scoping-report-template.pdf",
    color: "from-blue-500 to-blue-600",
    sections: [
      {
        title: "1. Project Overview",
        items: [
          "Project Title: _______________________",
          "Client/Organization: _______________________",
          "Project Manager: _______________________",
          "Date: _______________________",
          "Document Version: _______________________"
        ]
      },
      {
        title: "2. Problem Definition",
        items: [
          "Primary Decision to be Informed: _______________________",
          "Secondary Objectives:",
          "  □ ________________________________",
          "  □ ________________________________",
          "Key Questions the Model Must Answer:",
          "  1. ________________________________",
          "  2. ________________________________",
          "  3. ________________________________"
        ]
      },
      {
        title: "3. Stakeholder Analysis",
        items: [
          "Primary Stakeholders:",
          "  Name: _____________ Role: _____________ Information Needs: _____________",
          "  Name: _____________ Role: _____________ Information Needs: _____________",
          "Secondary Stakeholders:",
          "  ________________________________",
          "Communication Requirements:",
          "  □ Technical reports    □ Executive summaries    □ Visualizations",
          "  □ Presentations        □ Interactive dashboards"
        ]
      },
      {
        title: "4. Data Inventory",
        items: [
          "Available Data Sources:",
          "  Data Type: _____________ Source: _____________ Quality Rating (A-D): ___",
          "  Data Type: _____________ Source: _____________ Quality Rating (A-D): ___",
          "  Data Type: _____________ Source: _____________ Quality Rating (A-D): ___",
          "Identified Data Gaps:",
          "  □ ________________________________ Impact: High / Medium / Low",
          "  □ ________________________________ Impact: High / Medium / Low",
          "Data Gap Mitigation Strategy: _______________________"
        ]
      },
      {
        title: "5. Model Selection & Complexity",
        items: [
          "Candidate Models Considered:",
          "  Model 1: _____________ Pros: _____________ Cons: _____________",
          "  Model 2: _____________ Pros: _____________ Cons: _____________",
          "Selected Model: _______________________",
          "Justification for Complexity Level:",
          "  ________________________________",
          "  ________________________________",
          "Spatial Discretization: _______________________",
          "Temporal Resolution: _______________________"
        ]
      },
      {
        title: "6. Success Criteria",
        items: [
          "Calibration Targets:",
          "  Parameter: _____________ Target Metric: _____________ Acceptance: ___",
          "  Parameter: _____________ Target Metric: _____________ Acceptance: ___",
          "Validation Requirements:",
          "  □ Split-sample testing    □ Independent dataset    □ Multi-site validation",
          "Performance Metrics to Report:",
          "  □ NSE    □ KGE    □ PBIAS    □ RMSE    □ R²    □ Other: _______"
        ]
      },
      {
        title: "7. Constraints & Limitations",
        items: [
          "Budget Constraints: _______________________",
          "Timeline: _______________________",
          "Computational Resources: _______________________",
          "Known Limitations:",
          "  ________________________________",
          "  ________________________________",
          "Assumptions:",
          "  ________________________________",
          "  ________________________________"
        ]
      },
      {
        title: "8. Approvals",
        items: [
          "Prepared By: _____________ Signature: _____________ Date: _______",
          "Reviewed By: _____________ Signature: _____________ Date: _______",
          "Approved By: _____________ Signature: _____________ Date: _______"
        ]
      }
    ],
    guidelines: [
      "Complete this template BEFORE beginning model construction",
      "Rate data quality using James's A-D reliability categories",
      "Justify complexity choices with reference to data availability",
      "Document all assumptions explicitly for future reference"
    ],
    references: [
      { chapter: 1, topic: "Model Purpose & Objectives" },
      { chapter: 3, topic: "The Ten Rules for Responsible Modeling" },
      { chapter: 4, topic: "Optimal Complexity Selection" },
      { chapter: 5, topic: "Data Reliability Categories" }
    ]
  },
  {
    id: "calibration",
    title: "Calibration & Validation Log",
    description: "Track parameter adjustments, performance metrics, and validation results systematically.",
    icon: <BarChart3 className="w-6 h-6" />,
    filename: "calibration-validation-log.pdf",
    color: "from-green-500 to-green-600",
    sections: [
      {
        title: "1. Calibration Setup",
        items: [
          "Model Name/Version: _______________________",
          "Calibration Period: _____________ to _____________",
          "Validation Period: _____________ to _____________",
          "Objective Function(s): _______________________",
          "Calibration Method: □ Manual    □ Automatic    □ Hybrid",
          "Optimization Algorithm (if auto): _______________________"
        ]
      },
      {
        title: "2. Parameter Sensitivity Ranking",
        items: [
          "Pre-calibration sensitivity analysis completed: □ Yes  □ No",
          "",
          "Rank  Parameter Name           Sensitivity Index   Range (Min-Max)",
          "___   ____________________     _________________   ______________",
          "___   ____________________     _________________   ______________",
          "___   ____________________     _________________   ______________",
          "___   ____________________     _________________   ______________",
          "___   ____________________     _________________   ______________",
          "",
          "Parameters fixed during calibration (low sensitivity):",
          "  ________________________________"
        ]
      },
      {
        title: "3. Calibration Iterations Log",
        items: [
          "Iteration  Date      Parameters Changed      NSE    KGE    PBIAS   Notes",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________",
          "________   _______   ___________________     ____   ____   _____   _________"
        ]
      },
      {
        title: "4. Final Calibrated Parameters",
        items: [
          "Parameter Name           Initial Value    Final Value    Physical Basis",
          "____________________     _____________    ___________    _______________",
          "____________________     _____________    ___________    _______________",
          "____________________     _____________    ___________    _______________",
          "____________________     _____________    ___________    _______________",
          "____________________     _____________    ___________    _______________",
          "",
          "All parameter values within physically realistic ranges: □ Yes  □ No",
          "If No, justification: _______________________"
        ]
      },
      {
        title: "5. Calibration Performance Summary",
        items: [
          "                        Target          Achieved        Status",
          "Nash-Sutcliffe (NSE):   ___________     ___________     □ Pass  □ Fail",
          "Kling-Gupta (KGE):      ___________     ___________     □ Pass  □ Fail",
          "Percent Bias (PBIAS):   ___________     ___________     □ Pass  □ Fail",
          "RMSE:                   ___________     ___________     □ Pass  □ Fail",
          "R²:                     ___________     ___________     □ Pass  □ Fail",
          "Other: ____________     ___________     ___________     □ Pass  □ Fail",
          "",
          "Visual inspection of hydrograph fit: □ Satisfactory  □ Unsatisfactory"
        ]
      },
      {
        title: "6. Validation Results",
        items: [
          "Independent validation dataset used: □ Yes  □ No",
          "Validation period different from calibration: □ Yes  □ No",
          "",
          "                        Calibration     Validation      Degradation",
          "Nash-Sutcliffe (NSE):   ___________     ___________     ___________",
          "Kling-Gupta (KGE):      ___________     ___________     ___________",
          "Percent Bias (PBIAS):   ___________     ___________     ___________",
          "RMSE:                   ___________     ___________     ___________",
          "",
          "Performance degradation acceptable (<10-15%): □ Yes  □ No",
          "If No, corrective action: _______________________"
        ]
      },
      {
        title: "7. Equifinality Assessment",
        items: [
          "Multiple parameter sets achieve similar performance: □ Yes  □ No",
          "If Yes, number of acceptable parameter sets: _______",
          "Method used to select final set: _______________________",
          "Uncertainty due to equifinality documented: □ Yes  □ No"
        ]
      },
      {
        title: "8. Sign-off",
        items: [
          "Calibration completed by: _____________ Date: _______",
          "Peer reviewed by: _____________ Date: _______",
          "Notes and recommendations:",
          "  ________________________________",
          "  ________________________________"
        ]
      }
    ],
    guidelines: [
      "Complete sensitivity analysis BEFORE starting calibration",
      "Document every parameter change with rationale",
      "Use multiple performance metrics, not just NSE",
      "Always validate on data not used for calibration"
    ],
    references: [
      { chapter: 8, topic: "Calibration Principles" },
      { chapter: 9, topic: "Model Validation" },
      { chapter: 11, topic: "Sensitivity Analysis" },
      { chapter: 12, topic: "Objective Functions" }
    ]
  },
  {
    id: "uncertainty",
    title: "Uncertainty Disclosure Template",
    description: "Communicate model limitations and prediction confidence to stakeholders transparently.",
    icon: <AlertTriangle className="w-6 h-6" />,
    filename: "uncertainty-disclosure-template.pdf",
    color: "from-amber-500 to-amber-600",
    sections: [
      {
        title: "1. Model Identification",
        items: [
          "Model Name: _______________________",
          "Version: _______________________",
          "Application: _______________________",
          "Date of Analysis: _______________________",
          "Prepared By: _______________________"
        ]
      },
      {
        title: "2. Executive Summary of Uncertainty",
        items: [
          "Overall Confidence Level:  □ High   □ Medium   □ Low",
          "",
          "Key uncertainty statement for decision-makers (plain language):",
          "________________________________________________________________________",
          "________________________________________________________________________",
          "________________________________________________________________________",
          "",
          "Recommended decision buffer/safety factor: _______________________"
        ]
      },
      {
        title: "3. Input Data Uncertainty",
        items: [
          "Data Category          Reliability    Uncertainty   Impact on Output",
          "                       (A-D)          Range (+/-)   (High/Med/Low)",
          "__________________     _______        ___________   _______________",
          "__________________     _______        ___________   _______________",
          "__________________     _______        ___________   _______________",
          "__________________     _______        ___________   _______________",
          "",
          "Most critical data uncertainty: _______________________",
          "Data gap with highest impact: _______________________"
        ]
      },
      {
        title: "4. Parameter Uncertainty",
        items: [
          "Uncertainty quantification method used:",
          "  □ Monte Carlo simulation (runs: _______)",
          "  □ GLUE analysis",
          "  □ Bayesian inference",
          "  □ Expert judgment",
          "  □ Other: _______________________",
          "",
          "Key Parameter       Best Estimate    95% Confidence Interval",
          "________________    _____________    ________ to ________",
          "________________    _____________    ________ to ________",
          "________________    _____________    ________ to ________"
        ]
      },
      {
        title: "5. Structural Uncertainty",
        items: [
          "Model structure limitations:",
          "  □ ________________________________",
          "  □ ________________________________",
          "  □ ________________________________",
          "",
          "Processes not represented:",
          "  □ ________________________________",
          "  □ ________________________________",
          "",
          "Assumptions that may not hold:",
          "  □ ________________________________",
          "  □ ________________________________"
        ]
      },
      {
        title: "6. Prediction Uncertainty Bounds",
        items: [
          "Prediction Variable   Best Estimate   Lower Bound   Upper Bound   CI Level",
          "__________________    _____________   ___________   ___________   _______",
          "__________________    _____________   ___________   ___________   _______",
          "__________________    _____________   ___________   ___________   _______",
          "__________________    _____________   ___________   ___________   _______",
          "",
          "Method for calculating bounds: _______________________"
        ]
      },
      {
        title: "7. Conditions for Valid Application",
        items: [
          "The model predictions are valid under the following conditions:",
          "  □ ________________________________",
          "  □ ________________________________",
          "  □ ________________________________",
          "",
          "THE MODEL SHOULD NOT BE USED IF:",
          "  ⚠ ________________________________",
          "  ⚠ ________________________________",
          "  ⚠ ________________________________"
        ]
      },
      {
        title: "8. Risk Communication Matrix",
        items: [
          "Outcome                  Likelihood      Consequence    Risk Level",
          "                         (H/M/L)         (H/M/L)        (H/M/L)",
          "Overestimate impact      _______         _______        _______",
          "Underestimate impact     _______         _______        _______",
          "Miss critical event      _______         _______        _______",
          "False positive           _______         _______        _______",
          "",
          "Most significant risk: _______________________",
          "Recommended mitigation: _______________________"
        ]
      },
      {
        title: "9. Recommendations for Future Improvement",
        items: [
          "Data collection priorities to reduce uncertainty:",
          "  1. ________________________________",
          "  2. ________________________________",
          "  3. ________________________________",
          "",
          "Monitoring recommendations:",
          "  □ ________________________________",
          "  □ ________________________________"
        ]
      },
      {
        title: "10. Certification",
        items: [
          "I certify that this uncertainty disclosure represents my professional",
          "assessment of model limitations and prediction confidence.",
          "",
          "Modeler: _____________ Signature: _____________ Date: _______",
          "Reviewer: _____________ Signature: _____________ Date: _______",
          "",
          "Disclaimer:",
          "This model represents a simplification of reality. Actual outcomes may",
          "differ from predictions. Decisions should consider this uncertainty."
        ]
      }
    ],
    guidelines: [
      "Always quantify uncertainty, never just acknowledge it exists",
      "Use plain language summaries for non-technical stakeholders",
      "Be explicit about conditions where the model should NOT be used",
      "Include confidence intervals on all key predictions"
    ],
    references: [
      { chapter: 10, topic: "Monte Carlo Uncertainty Analysis" },
      { chapter: 17, topic: "Ethics of Prediction Disclosure" },
      { chapter: 5, topic: "Data Reliability Categories" },
      { chapter: 3, topic: "Rule 9: Communicate Uncertainty" }
    ]
  }
];

export const ProjectTemplates = () => {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const generateTemplatePDF = (template: Template) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;
    const margin = 15;
    const lineHeight = 5;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(template.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 8;

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Based on Rules for Responsible Modeling by Dr. William James", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Guidelines box
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 25, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("GUIDELINES:", margin + 3, y + 5);
    doc.setFont("helvetica", "normal");
    template.guidelines.forEach((guideline, i) => {
      doc.text(`• ${guideline}`, margin + 3, y + 10 + i * 5);
    });
    y += 30;

    // Sections
    template.sections.forEach((section) => {
      // Check page break
      const sectionHeight = (section.items.length + 2) * lineHeight + 10;
      if (y + sectionHeight > 280) {
        doc.addPage();
        y = 15;
      }

      // Section header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, margin, y);
      y += 6;

      // Section items
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      section.items.forEach((item) => {
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        const lines = doc.splitTextToSize(item, pageWidth - 2 * margin);
        doc.text(lines, margin, y);
        y += lines.length * lineHeight;
      });
      y += 5;
    });

    // References footer
    if (y > 250) {
      doc.addPage();
      y = 15;
    }
    y += 5;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Related Chapters:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    template.references.forEach((ref) => {
      doc.text(`• Chapter ${ref.chapter}: ${ref.topic}`, margin, y);
      y += 4;
    });

    // Footer
    const today = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      `Generated: ${today} | rulesforresponsiblemodeling.lovable.app`,
      pageWidth / 2,
      285,
      { align: "center" }
    );

    doc.save(template.filename);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileCheck className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Project Templates
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional document templates based on Dr. James's framework. Download, customize, and use in your modeling projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col overflow-hidden group hover:shadow-lg transition-all">
              <CardHeader className={`bg-gradient-to-br ${template.color} text-white`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {template.icon}
                  </div>
                  <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {template.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="text-xs font-medium text-foreground">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 4).map((section, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {section.title.split(". ")[1] || section.title}
                      </Badge>
                    ))}
                    {template.sections.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.sections.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  <span className="font-medium">References: </span>
                  {template.references.map(r => `Ch.${r.chapter}`).join(", ")}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {template.icon}
                          {template.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {/* Guidelines */}
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                          <h4 className="font-semibold text-sm mb-2 text-foreground">Guidelines</h4>
                          <ul className="space-y-1">
                            {template.guidelines.map((g, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Sections preview */}
                        <div className="space-y-3">
                          {template.sections.map((section, i) => (
                            <div key={i} className="border border-border rounded-lg p-3">
                              <h4 className="font-semibold text-sm text-foreground mb-2">
                                {section.title}
                              </h4>
                              <div className="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded max-h-32 overflow-y-auto">
                                {section.items.slice(0, 5).map((item, j) => (
                                  <div key={j}>{item}</div>
                                ))}
                                {section.items.length > 5 && (
                                  <div className="text-primary mt-1">
                                    ... and {section.items.length - 5} more fields
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => generateTemplatePDF(template)} 
                          className="w-full gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => generateTemplatePDF(template)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-12 text-center">
          <Card className="inline-block p-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground mb-3">
              💡 <span className="font-medium">Pro Tip:</span> Use these templates alongside the{" "}
              <span className="text-primary font-medium">Checklist Generator</span> to ensure comprehensive project documentation.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
