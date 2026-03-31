import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { 
  ClipboardList, 
  Download, 
  ChevronDown,
  ChevronUp,
  FileText,
  Settings,
  BarChart3,
  FileCheck,
  Printer
} from "lucide-react";
import { jsPDF } from "jspdf";

type ProjectPhase = "scoping" | "build" | "calibrate" | "report";

interface ChecklistItem {
  id: string;
  text: string;
  chapterRef: number;
  priority: "required" | "recommended" | "optional";
}

interface PhaseChecklist {
  phase: ProjectPhase;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

const phaseChecklists: PhaseChecklist[] = [
  {
    phase: "scoping",
    title: "Scoping Phase",
    description: "Define objectives, assess data, and plan the modeling approach",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { id: "s1", text: "Define the specific decision the model must inform", chapterRef: 1, priority: "required" },
      { id: "s2", text: "Identify key stakeholders and their information needs", chapterRef: 1, priority: "required" },
      { id: "s3", text: "Inventory available data sources and assess quality", chapterRef: 3, priority: "required" },
      { id: "s4", text: "Document data gaps and their impact on model reliability", chapterRef: 3, priority: "required" },
      { id: "s5", text: "Justify the spatial and temporal discretization choices", chapterRef: 2, priority: "required" },
      { id: "s6", text: "Select model complexity appropriate to data and objectives", chapterRef: 4, priority: "required" },
      { id: "s7", text: "Establish preliminary acceptance criteria for calibration", chapterRef: 12, priority: "recommended" },
      { id: "s8", text: "Identify calibration and validation data sets", chapterRef: 11, priority: "recommended" },
      { id: "s9", text: "Document assumptions and limitations upfront", chapterRef: 15, priority: "required" },
      { id: "s10", text: "Assess computational and resource constraints", chapterRef: 4, priority: "optional" }
    ]
  },
  {
    phase: "build",
    title: "Build Phase",
    description: "Construct the model with appropriate detail and process representation",
    icon: <Settings className="w-5 h-5" />,
    items: [
      { id: "b1", text: "Verify model structure matches conceptual understanding", chapterRef: 5, priority: "required" },
      { id: "b2", text: "Ensure all dominant physical processes are represented", chapterRef: 5, priority: "required" },
      { id: "b3", text: "Assign initial parameter values from literature or local knowledge", chapterRef: 8, priority: "required" },
      { id: "b4", text: "Check model mass balance closes under test conditions", chapterRef: 9, priority: "required" },
      { id: "b5", text: "Verify boundary conditions are correctly specified", chapterRef: 7, priority: "required" },
      { id: "b6", text: "Document data sources for all inputs", chapterRef: 3, priority: "required" },
      { id: "b7", text: "Rate reliability of each data source", chapterRef: 3, priority: "recommended" },
      { id: "b8", text: "Perform initial sensitivity analysis", chapterRef: 4, priority: "recommended" },
      { id: "b9", text: "Create model version control log", chapterRef: 16, priority: "recommended" },
      { id: "b10", text: "Test model behavior at boundaries and extremes", chapterRef: 13, priority: "optional" }
    ]
  },
  {
    phase: "calibrate",
    title: "Calibrate Phase",
    description: "Adjust parameters systematically and validate model performance",
    icon: <BarChart3 className="w-5 h-5" />,
    items: [
      { id: "c1", text: "Complete sensitivity analysis to identify key parameters", chapterRef: 4, priority: "required" },
      { id: "c2", text: "Define objective function(s) for calibration", chapterRef: 12, priority: "required" },
      { id: "c3", text: "Calibrate most sensitive parameters first", chapterRef: 11, priority: "required" },
      { id: "c4", text: "Document all parameter adjustments and rationale", chapterRef: 11, priority: "required" },
      { id: "c5", text: "Check for equifinality issues (multiple good parameter sets)", chapterRef: 4, priority: "required" },
      { id: "c6", text: "Validate model on independent data not used in calibration", chapterRef: 14, priority: "required" },
      { id: "c7", text: "Report multiple performance metrics (NSE, KGE, PBIAS)", chapterRef: 12, priority: "required" },
      { id: "c8", text: "Quantify parameter uncertainty using Monte Carlo or similar", chapterRef: 10, priority: "recommended" },
      { id: "c9", text: "Test model under conditions different from calibration", chapterRef: 13, priority: "recommended" },
      { id: "c10", text: "Verify physically reasonable parameter values", chapterRef: 8, priority: "required" }
    ]
  },
  {
    phase: "report",
    title: "Report Phase",
    description: "Document results and communicate findings appropriately",
    icon: <FileCheck className="w-5 h-5" />,
    items: [
      { id: "r1", text: "Document model purpose and intended applications", chapterRef: 1, priority: "required" },
      { id: "r2", text: "Describe model structure and key assumptions", chapterRef: 5, priority: "required" },
      { id: "r3", text: "Present calibration and validation results with metrics", chapterRef: 14, priority: "required" },
      { id: "r4", text: "Quantify and display prediction uncertainty", chapterRef: 10, priority: "required" },
      { id: "r5", text: "List model limitations explicitly", chapterRef: 17, priority: "required" },
      { id: "r6", text: "Document data sources, quality ratings, and gaps", chapterRef: 3, priority: "required" },
      { id: "r7", text: "Provide parameter values and justification", chapterRef: 8, priority: "required" },
      { id: "r8", text: "Include uncertainty bounds on all key predictions", chapterRef: 10, priority: "required" },
      { id: "r9", text: "State conditions under which model should not be used", chapterRef: 17, priority: "recommended" },
      { id: "r10", text: "Provide recommendations for model maintenance", chapterRef: 16, priority: "optional" }
    ]
  }
];

export const ChecklistGenerator = () => {
  const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<ProjectPhase | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("checklist-progress");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const togglePhase = (phase: ProjectPhase) => {
    setSelectedPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  const toggleExpandPhase = (phase: ProjectPhase) => {
    setExpandedPhase(prev => prev === phase ? null : phase);
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    const lineHeight = 7;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Model Review Checklist", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Based on Rules for Responsible Modeling by Dr. William James", pageWidth / 2, y, { align: "center" });
    y += 15;

    const phasesToInclude = selectedPhases.length > 0 
      ? phaseChecklists.filter(p => selectedPhases.includes(p.phase))
      : phaseChecklists;

    phasesToInclude.forEach((phase) => {
      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Phase header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(phase.title, margin, y);
      y += lineHeight;

      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(phase.description, margin, y);
      y += lineHeight + 3;

      // Items
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      phase.items.forEach((item) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        // Checkbox square
        doc.rect(margin, y - 4, 4, 4);

        // Priority badge
        const priorityText = item.priority === "required" ? "[REQ]" : 
                            item.priority === "recommended" ? "[REC]" : "[OPT]";
        doc.setFontSize(8);
        doc.text(priorityText, margin + 6, y);

        // Item text - wrap long text
        doc.setFontSize(10);
        const textX = margin + 18;
        const maxWidth = contentWidth - 20;
        const splitText = doc.splitTextToSize(`${item.text} (Ch. ${item.chapterRef})`, maxWidth);
        doc.text(splitText, textX, y);
        
        y += lineHeight * splitText.length + 2;
      });

      y += 8;
    });

    // Footer
    const today = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(`Generated: ${today} | rulesforresponsiblemodeling.lovable.app`, pageWidth / 2, 285, { align: "center" });

    doc.save("model-review-checklist.pdf");
  };

  const selectedChecklists = selectedPhases.length > 0
    ? phaseChecklists.filter(p => selectedPhases.includes(p.phase))
    : phaseChecklists;

  const totalItems = selectedChecklists.reduce((sum, p) => sum + p.items.length, 0);
  const completedItems = selectedChecklists.reduce(
    (sum, p) => sum + p.items.filter(item => checkedItems.has(item.id)).length,
    0
  );

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-primary" />
          Model Review Checklist Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate a customized checklist based on your project phase. Each item references Dr. James's rules.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase Selection */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Select Project Phases:</h4>
          <div className="flex flex-wrap gap-2">
            {phaseChecklists.map((phase) => (
              <Button
                key={phase.phase}
                variant={selectedPhases.includes(phase.phase) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePhase(phase.phase)}
                className="gap-2"
              >
                {phase.icon}
                {phase.title}
              </Button>
            ))}
          </div>
          {selectedPhases.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Select phases to customize, or leave empty for a complete checklist.
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">
            Progress: {completedItems} / {totalItems} items checked
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.print()}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Checklists */}
        <div className="space-y-4">
          {selectedChecklists.map((phase) => (
            <div key={phase.phase} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpandPhase(phase.phase)}
                className="w-full p-4 flex items-center justify-between bg-background hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {phase.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-foreground">{phase.title}</h4>
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {phase.items.filter(i => checkedItems.has(i.id)).length}/{phase.items.length}
                  </Badge>
                  {expandedPhase === phase.phase ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedPhase === phase.phase && (
                <div className="p-4 border-t border-border bg-muted/10 space-y-2">
                  {phase.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        checkedItems.has(item.id)
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-background border-border"
                      }`}
                    >
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={item.id}
                        className={`flex-1 text-sm cursor-pointer ${
                          checkedItems.has(item.id) ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {item.text}
                      </label>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.priority === "required"
                              ? "bg-red-500/10 text-red-600 border-red-500/30"
                              : item.priority === "recommended"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.priority === "required" ? "Required" : item.priority === "recommended" ? "Recommended" : "Optional"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Ch.{item.chapterRef}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
