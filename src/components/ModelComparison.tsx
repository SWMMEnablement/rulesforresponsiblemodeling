import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { GitCompareArrows, AlertTriangle, CheckCircle2, BookOpen, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Assessment {
  label: string;
  yourValue: string;
  jamesStandard: string;
  status: "ok" | "warning" | "critical";
  chapter: number;
}

export const ModelComparison = () => {
  const [subcatchments, setSubcatchments] = useState(100);
  const [rainGages, setRainGages] = useState(2);
  const [calEvents, setCalEvents] = useState(1);
  const [valEvents, setValEvents] = useState(0);
  const [hasUncertainty, setHasUncertainty] = useState(false);
  const [hasSensitivity, setHasSensitivity] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const getAssessments = (): Assessment[] => {
    const minGages = Math.max(2, Math.ceil(subcatchments / 30));
    const gageStatus = rainGages >= minGages ? "ok" : rainGages >= minGages * 0.5 ? "warning" : "critical";

    const optimalSub = Math.min(80, Math.max(20, rainGages * 25));
    const subStatus = subcatchments <= optimalSub * 1.5 ? "ok" : subcatchments <= optimalSub * 3 ? "warning" : "critical";

    return [
      {
        label: "Subcatchments",
        yourValue: String(subcatchments),
        jamesStandard: `Optimal for your data: ~${Math.round(optimalSub / 10) * 10}-${Math.round(optimalSub * 1.3 / 10) * 10}`,
        status: subStatus,
        chapter: 4,
      },
      {
        label: "Rain Gages",
        yourValue: String(rainGages),
        jamesStandard: `Minimum for ${subcatchments} subcatchments: ~${minGages}-${minGages + 2}`,
        status: gageStatus,
        chapter: 6,
      },
      {
        label: "Calibration Events",
        yourValue: String(calEvents),
        jamesStandard: "Minimum: 3-5 events",
        status: calEvents >= 3 ? "ok" : calEvents >= 2 ? "warning" : "critical",
        chapter: 9,
      },
      {
        label: "Validation Events",
        yourValue: valEvents === 0 ? "0" : String(valEvents),
        jamesStandard: "Minimum: 1-2 (SEPARATE from calibration)",
        status: valEvents >= 1 ? "ok" : "critical",
        chapter: 14,
      },
      {
        label: "Uncertainty Analysis",
        yourValue: hasUncertainty ? "Yes" : "No",
        jamesStandard: "Required (Ch. 10)",
        status: hasUncertainty ? "ok" : "critical",
        chapter: 10,
      },
      {
        label: "Sensitivity Analysis",
        yourValue: hasSensitivity ? "Yes" : "No",
        jamesStandard: "Required (Ch. 11)",
        status: hasSensitivity ? "ok" : "critical",
        chapter: 11,
      },
    ];
  };

  const assessments = showResults ? getAssessments() : [];
  const criticalCount = assessments.filter((a) => a.status === "critical").length;
  const warningCount = assessments.filter((a) => a.status === "warning").length;

  const diagnosis = criticalCount >= 3
    ? "Your model has significant gaps relative to responsible modeling standards. Prioritize the flagged items."
    : criticalCount >= 1
    ? "Your model has some critical gaps. Address the ⚠️ items to improve reliability."
    : warningCount >= 2
    ? "Your model is on the right track but could be improved in several areas."
    : "Your model aligns well with James's framework. Keep up the responsible modeling!";

  return (
    <TooltipProvider delayDuration={200}>
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <GitCompareArrows className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">James vs. Your Model</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>Compare your model setup against Dr. James's recommended standards. Enter your model's details and see where it meets or falls short of best practices.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Input your model details and see how it compares to Dr. James's standards.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Subcatchments
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Total number of subcatchments in your model. More isn't always better — it should match available rain gage coverage.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{subcatchments}</Badge>
          </div>
          <Slider value={[subcatchments]} onValueChange={([v]) => { setSubcatchments(v); }} min={5} max={500} step={5} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Rain Gages
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Number of rain gages providing input data. James recommends roughly 1 gage per 25–30 subcatchments as a minimum.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{rainGages}</Badge>
          </div>
          <Slider value={[rainGages]} onValueChange={([v]) => { setRainGages(v); setShowResults(false); }} min={1} max={20} step={1} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Calibration Events
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Number of observed storm events used to calibrate the model. James recommends a minimum of 3–5 independent events.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{calEvents}</Badge>
          </div>
          <Slider value={[calEvents]} onValueChange={([v]) => { setCalEvents(v); setShowResults(false); }} min={0} max={10} step={1} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Validation Events
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Events used to test the model AFTER calibration — must be separate from calibration events. At least 1–2 are required.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{valEvents}</Badge>
          </div>
          <Slider value={[valEvents]} onValueChange={([v]) => { setValEvents(v); setShowResults(false); }} min={0} max={10} step={1} />
        </div>
        <div className="flex items-center gap-3">
          <Switch id="uncertainty" checked={hasUncertainty} onCheckedChange={(v) => { setHasUncertainty(v); setShowResults(false); }} />
          <Label htmlFor="uncertainty" className="text-sm flex items-center gap-1">
            Uncertainty analysis performed
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent className="max-w-xs"><p>Have you quantified output uncertainty through methods like Monte Carlo simulation? This is essential per Chapter 10.</p></TooltipContent>
            </Tooltip>
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="sensitivity" checked={hasSensitivity} onCheckedChange={(v) => { setHasSensitivity(v); setShowResults(false); }} />
          <Label htmlFor="sensitivity" className="text-sm flex items-center gap-1">
            Sensitivity analysis performed
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent className="max-w-xs"><p>Have you tested which parameters most influence your results? Identifies where to focus calibration effort (Chapter 11).</p></TooltipContent>
            </Tooltip>
          </Label>
        </div>
      </div>

      {!showResults && (
        <Button onClick={() => setShowResults(true)} className="w-full">
          Compare Against James's Standards
        </Button>
      )}

      {showResults && (
        <div className="space-y-4 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">Metric</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Your Model</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">James's Standard</th>
                  <th className="text-center py-2 font-medium text-muted-foreground">
                    Status
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1 align-text-top" /></TooltipTrigger>
                      <TooltipContent className="max-w-xs"><p>✅ Meets standard · ⚠️ Warning — could be improved · 🔴 Critical gap that should be addressed</p></TooltipContent>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a.label} className="border-b border-muted">
                    <td className="py-3 font-medium text-foreground">{a.label}</td>
                    <td className="py-3 text-foreground">{a.yourValue}</td>
                    <td className="py-3 text-muted-foreground text-xs">{a.jamesStandard}</td>
                    <td className="py-3 text-center">
                      {a.status === "ok" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />
                      ) : a.status === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500 inline" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-destructive inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`p-4 rounded-lg ${criticalCount >= 3 ? "bg-destructive/10" : criticalCount >= 1 ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground">Diagnosis</p>
                <p className="text-sm text-muted-foreground mt-1">{diagnosis}</p>
                {criticalCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended chapters:{" "}
                    {assessments
                      .filter((a) => a.status === "critical")
                      .map((a, i) => (
                        <span key={a.chapter}>
                          <a href={`/chapter/${a.chapter}`} className="text-primary underline">Ch. {a.chapter}</a>
                          {i < assessments.filter((x) => x.status === "critical").length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button onClick={() => setShowResults(false)} variant="outline" size="sm">
            Adjust Inputs
          </Button>
        </div>
      )}
    </Card>
    </TooltipProvider>
  );
};
