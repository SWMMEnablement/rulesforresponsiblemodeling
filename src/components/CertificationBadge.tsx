import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Award, CheckCircle2, Download, Share2 } from "lucide-react";
import { usePathwayProgress } from "@/hooks/usePathwayProgress";

interface CertQuestion {
  question: string;
  options: string[];
  correct: number;
}

const certQuestions: CertQuestion[] = [
  { question: "What is the primary purpose of a model according to Dr. James?", options: ["To predict exact outcomes", "To inform decisions", "To replace field measurements", "To satisfy regulatory requirements"], correct: 1 },
  { question: "What happens when model complexity exceeds data support?", options: ["Accuracy improves", "Reliability decreases due to overfitting", "Processing time decreases", "Results become more conservative"], correct: 1 },
  { question: "What is the minimum recommended number of calibration events?", options: ["1", "2", "3-5", "10+"], correct: 2 },
  { question: "Why must validation data be separate from calibration data?", options: ["To save time", "To test predictive ability on unseen data", "Because regulations require it", "To use different parameters"], correct: 1 },
  { question: "What is the largest source of uncertainty in urban drainage modeling?", options: ["Pipe roughness", "Subcatchment width", "Rainfall input", "Soil properties"], correct: 2 },
  { question: "What does sensitivity analysis help you identify?", options: ["Model runtime", "Parameters that most influence output", "The best software to use", "Data collection costs"], correct: 1 },
  { question: "How should uncertainty be communicated to decision-makers?", options: ["Hidden to avoid confusion", "As a single best estimate", "With confidence intervals and ranges", "Only if they ask"], correct: 2 },
  { question: "What does 'optimal complexity' mean?", options: ["Maximum possible detail", "Minimum possible detail", "Complexity matched to available data and purpose", "Using the newest software features"], correct: 2 },
  { question: "Why is continuous simulation preferred over design storms?", options: ["It runs faster", "It captures antecedent conditions and event sequences", "It uses less data", "It always gives larger flows"], correct: 1 },
  { question: "What is the final step in responsible modeling according to Ch. 17?", options: ["Submit the report", "Document all assumptions and limitations", "Delete the model files", "Begin the next project"], correct: 1 },
];

export const CertificationBadge = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { progress } = usePathwayProgress();

  const hasCompletedPathway = Object.values(progress).some(
    (p) => p && typeof p === "object" && "completed" in p && (p as any).completed
  );

  const score = answers.filter((a, i) => a === certQuestions[i].correct).length;
  const passed = score >= 8;

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < certQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const downloadBadge = () => {
    const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const content = `
╔═══════════════════════════════════════╗
║                                       ║
║   ✓ RESPONSIBLE MODELER               ║
║     Certified by the William          ║
║     James Framework                   ║
║                                       ║
║     Score: ${score}/10                       ║
║     Completed: ${date}             ║
║                                       ║
║     rulesforresponsiblemodeling        ║
║     .lovable.app                      ║
║                                       ║
╚═══════════════════════════════════════╝
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "responsible-modeler-certificate.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showResult) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <Award className={`w-16 h-16 mx-auto mb-4 ${passed ? "text-primary" : "text-muted-foreground"}`} />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {passed ? "Congratulations! 🎉" : "Not Quite Yet"}
        </h2>
        <div className={`text-5xl font-bold mb-2 ${passed ? "text-primary" : "text-destructive"}`}>
          {score}/10
        </div>
        <p className="text-muted-foreground mb-6">
          {passed
            ? "You've demonstrated a solid understanding of responsible modeling principles."
            : "You need 8/10 to earn the badge. Review the chapters and try again!"}
        </p>
        {passed ? (
          <div className="space-y-4">
            <div className="inline-block border-2 border-primary rounded-xl p-6 bg-primary/5">
              <div className="flex items-center gap-2 justify-center mb-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">RESPONSIBLE MODELER</span>
              </div>
              <p className="text-xs text-muted-foreground">Certified by the William James Framework</p>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={downloadBadge} className="gap-2"><Download className="w-4 h-4" /> Download Badge</Button>
              <Button variant="outline" onClick={() => {
                const text = `I earned the Responsible Modeler certification! 🌊 Score: ${score}/10\n\nTest yourself: rulesforresponsiblemodeling.lovable.app`;
                navigator.clipboard.writeText(text);
              }} className="gap-2"><Share2 className="w-4 h-4" /> Share</Button>
            </div>
          </div>
        ) : (
          <Button onClick={reset}>Try Again</Button>
        )}
      </Card>
    );
  }

  if (started) {
    const q = certQuestions[currentQ];
    return (
      <Card className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Certification Quiz</h3>
          <Badge variant="outline">{currentQ + 1}/{certQuestions.length}</Badge>
        </div>
        <Progress value={(currentQ / certQuestions.length) * 100} className="h-2 mb-6" />
        <p className="text-lg font-medium text-foreground mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary/50 transition-all text-sm text-foreground">
              {opt}
            </button>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Award className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Certified Responsible Modeler</h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Earn your badge by passing a 10-question quiz on Dr. James's framework. Score 8/10 or higher to earn the "Responsible Modeler" certification badge for your LinkedIn profile.
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center">
          <Award className="w-12 h-12 text-primary/40 mx-auto mb-3" />
          <p className="font-semibold text-foreground">Responsible Modeler Badge</p>
          <p className="text-xs text-muted-foreground mt-1">Complete the quiz to unlock</p>
        </div>
        <Button onClick={() => setStarted(true)} size="lg">Start Certification Quiz</Button>
      </div>
    </Card>
  );
};
