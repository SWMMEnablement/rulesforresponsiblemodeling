import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

const rulesData = [
  {
    chapter: 1,
    title: "Purpose of Modeling",
    rule: "Models inform decisions, not predict perfectly",
    quote: "The purpose of modeling is not to predict the future perfectly, but to inform decisions about future actions."
  },
  {
    chapter: 2,
    title: "Discretization Error",
    rule: "Treat resolution with calibration rigor",
    quote: "Discretization error is often the largest source of model uncertainty, yet it is frequently overlooked."
  },
  {
    chapter: 3,
    title: "Data Quality",
    rule: "Known imperfection beats unknown quality",
    quote: "Unknown data quality is far more dangerous than known imperfection."
  },
  {
    chapter: 4,
    title: "Optimal Complexity",
    rule: "Find the complexity sweet spot",
    quote: "There exists an optimal order of model complexity for any given application."
  },
  {
    chapter: 5,
    title: "Continuous Simulation",
    rule: "Continuous ≠ sequential events",
    quote: "Continuous simulation fundamentally changes how we think about antecedent conditions and long-term behavior."
  },
  {
    chapter: 6,
    title: "Rainfall Uncertainty",
    rule: "Prioritize rainfall characterization",
    quote: "A sophisticated routing model fed with poor rainfall input produces poor results elegantly."
  },
  {
    chapter: 7,
    title: "Storm Spatial Structure",
    rule: "Storm movement affects peaks dramatically",
    quote: "The spatial structure and movement of rainfall can dramatically affect peak flows—sometimes more than total depth."
  },
  {
    chapter: 8,
    title: "Decision Support Systems",
    rule: "DSS integrates the full workflow",
    quote: "A decision support system integrates data management, modeling, analysis, and communication into a coherent workflow."
  },
  {
    chapter: 9,
    title: "Objective Functions",
    rule: "Metric choice is a modeling decision",
    quote: "The choice of objective function deserves careful consideration. No single metric captures all aspects of performance."
  },
  {
    chapter: 10,
    title: "Uncertainty Communication",
    rule: "Quantify and communicate uncertainty",
    quote: "Uncertainty is not a weakness to be hidden—it is an inherent characteristic that should be quantified and communicated."
  },
  {
    chapter: 11,
    title: "Sensitivity Analysis",
    rule: "Sensitivity guides calibration focus",
    quote: "Sensitivity analysis tells us where to focus calibration efforts, which data to collect, and how confident we can be."
  },
  {
    chapter: 12,
    title: "State Variable Representation",
    rule: "State space reveals system interactions",
    quote: "State variable representation reveals how different parts of the system interact and where instabilities may arise."
  },
  {
    chapter: 13,
    title: "Performance Metrics",
    rule: "Metrics embody value judgments",
    quote: "Performance evaluation functions are not neutral—they embody value judgments about what aspects matter most."
  },
  {
    chapter: 14,
    title: "Optimization Limits",
    rule: "Optimization follows, not replaces, construction",
    quote: "A well-optimized poor model will still give poor predictions. Optimization should follow careful model construction."
  },
  {
    chapter: 15,
    title: "Fuzzy Logic",
    rule: "Bridge human reasoning and computation",
    quote: "Fuzzy logic excels where traditional crisp models struggle—where expert knowledge exists but precise relationships do not."
  },
  {
    chapter: 16,
    title: "Model Error",
    rule: "Characterize error honestly",
    quote: "Model error is not a sign of failure—the responsible approach is to characterize it honestly and communicate it effectively."
  },
  {
    chapter: 17,
    title: "Rules as Lessons",
    rule: "Rules are hard-won lessons",
    quote: "The rules for responsible modeling are lessons learned from decades of practice addressing common failure modes."
  }
];

interface PDFReferenceCardProps {
  variant?: "compact" | "full";
  className?: string;
}

export const PDFReferenceCard = ({ variant = "full", className = "" }: PDFReferenceCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Rules for Responsible Modeling", pageWidth / 2, yPos, { align: "center" });
      yPos += 8;

      // Subtitle
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("by William James, Ph.D., P.Eng. — Quick Reference Card", pageWidth / 2, yPos, { align: "center" });
      yPos += 12;

      // Divider line
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Rules
      doc.setFontSize(9);
      
      rulesData.forEach((rule, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 35) {
          doc.addPage();
          yPos = margin;
        }

        // Chapter number and title
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.text(`${rule.chapter}. ${rule.title}`, margin, yPos);
        yPos += 5;

        // Rule summary
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`→ ${rule.rule}`, margin + 3, yPos);
        yPos += 5;

        // Quote (wrapped)
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        const quoteLines = doc.splitTextToSize(`"${rule.quote}"`, contentWidth - 6);
        doc.text(quoteLines, margin + 3, yPos);
        yPos += quoteLines.length * 4 + 6;
      });

      // Footer on last page
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(128, 128, 128);
      
      const footerY = pageHeight - 10;
      doc.text(
        "Source: James, W. (2005). Rules for Responsible Modeling. CHI, Guelph, Ontario.",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );
      doc.text(
        "Interactive Edition: rulesforresponsiblemodeling.lovable.app",
        pageWidth / 2,
        footerY + 4,
        { align: "center" }
      );

      // Save the PDF
      doc.save("Rules-for-Responsible-Modeling-Reference-Card.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === "compact") {
    return (
      <Button 
        onClick={generatePDF} 
        disabled={isGenerating}
        variant="outline"
        className={`gap-2 ${className}`}
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Download PDF Reference
      </Button>
    );
  }

  return (
    <Card className={`p-6 bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-1">
            Printable Reference Card
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download a one-page PDF summary of all 17 rules with key quotes. 
            Perfect for printing and keeping at your desk.
          </p>
          <Button 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF Reference Card
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
