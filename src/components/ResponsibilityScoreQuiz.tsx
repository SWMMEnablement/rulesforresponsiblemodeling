import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { ClipboardCheck, ChevronRight, RotateCcw, Share2, BookOpen, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Question {
  text: string;
  category: string;
  chapter: number;
  options: { label: string; score: number }[];
}

const questions: Question[] = [
  { text: "Have you documented the vintage (date) of your topographic data?", category: "Data Quality", chapter: 3, options: [{ label: "Yes, fully documented", score: 5 }, { label: "Partially documented", score: 3 }, { label: "Not documented", score: 0 }] },
  { text: "Have you characterized the uncertainty in your rainfall input data?", category: "Data Quality", chapter: 6, options: [{ label: "Yes, quantitatively", score: 5 }, { label: "Qualitative assessment only", score: 2 }, { label: "No", score: 0 }] },
  { text: "Can you justify your chosen level of spatial discretization?", category: "Complexity", chapter: 2, options: [{ label: "Tested multiple levels", score: 5 }, { label: "Based on experience", score: 3 }, { label: "Used maximum detail available", score: 1 }] },
  { text: "Is your model's complexity matched to your available data?", category: "Complexity", chapter: 4, options: [{ label: "Yes, deliberately matched", score: 5 }, { label: "Roughly appropriate", score: 3 }, { label: "Model is as detailed as possible", score: 1 }] },
  { text: "Have you used continuous simulation rather than design storms only?", category: "Complexity", chapter: 5, options: [{ label: "Yes, continuous simulation", score: 5 }, { label: "Both approaches used", score: 3 }, { label: "Design storms only", score: 1 }] },
  { text: "Have you run your model on a validation dataset separate from calibration?", category: "Calibration", chapter: 14, options: [{ label: "Yes, independent validation", score: 5 }, { label: "Split-sample only", score: 3 }, { label: "No separate validation", score: 0 }] },
  { text: "How many calibration events have you used?", category: "Calibration", chapter: 9, options: [{ label: "5 or more events", score: 5 }, { label: "2-4 events", score: 3 }, { label: "1 event or none", score: 0 }] },
  { text: "Have you used multiple objective functions for calibration?", category: "Calibration", chapter: 9, options: [{ label: "Yes, 3+ objectives", score: 5 }, { label: "2 objectives", score: 3 }, { label: "Single objective only", score: 1 }] },
  { text: "Can you quantify the uncertainty range of your peak flow prediction?", category: "Uncertainty", chapter: 10, options: [{ label: "Yes, confidence intervals computed", score: 5 }, { label: "Rough estimate", score: 2 }, { label: "No", score: 0 }] },
  { text: "Have you performed Monte Carlo analysis on uncertain parameters?", category: "Uncertainty", chapter: 10, options: [{ label: "Yes, comprehensive", score: 5 }, { label: "Limited analysis", score: 2 }, { label: "No", score: 0 }] },
  { text: "Have you communicated uncertainty to decision-makers honestly?", category: "Uncertainty", chapter: 16, options: [{ label: "Yes, with ranges and caveats", score: 5 }, { label: "Mentioned but not quantified", score: 2 }, { label: "Presented single values only", score: 0 }] },
  { text: "Have you tested sensitivity to your three most uncertain parameters?", category: "Sensitivity", chapter: 11, options: [{ label: "Full sensitivity analysis", score: 5 }, { label: "Tested a few parameters", score: 3 }, { label: "No sensitivity analysis", score: 0 }] },
  { text: "Have you ranked parameters by their influence on model output?", category: "Sensitivity", chapter: 11, options: [{ label: "Yes, quantitative ranking", score: 5 }, { label: "Informal assessment", score: 2 }, { label: "No", score: 0 }] },
  { text: "Do you understand which parameters your model is insensitive to?", category: "Sensitivity", chapter: 12, options: [{ label: "Yes, identified insensitive params", score: 5 }, { label: "Some awareness", score: 2 }, { label: "No", score: 0 }] },
  { text: "Could another modeler reproduce your results from your documentation alone?", category: "Documentation", chapter: 17, options: [{ label: "Yes, fully reproducible", score: 5 }, { label: "With some effort", score: 3 }, { label: "Unlikely", score: 0 }] },
  { text: "Have you documented all assumptions and limitations?", category: "Documentation", chapter: 1, options: [{ label: "Comprehensive documentation", score: 5 }, { label: "Key assumptions noted", score: 3 }, { label: "Not documented", score: 0 }] },
  { text: "Is your model's purpose clearly linked to a specific decision?", category: "Documentation", chapter: 1, options: [{ label: "Yes, decision clearly stated", score: 5 }, { label: "General purpose defined", score: 3 }, { label: "Purpose is vague", score: 1 }] },
  { text: "Have you considered the effect of storm movement and timing?", category: "Data Quality", chapter: 7, options: [{ label: "Yes, analyzed dynamic effects", score: 5 }, { label: "Aware but not analyzed", score: 2 }, { label: "Not considered", score: 0 }] },
  { text: "Have you evaluated your model against independent performance criteria?", category: "Calibration", chapter: 13, options: [{ label: "Yes, multiple criteria", score: 5 }, { label: "Single criterion", score: 2 }, { label: "No formal evaluation", score: 0 }] },
  { text: "Are you using a decision support system for practical implementation?", category: "Complexity", chapter: 8, options: [{ label: "Yes, DSS integrated", score: 5 }, { label: "Some tools used", score: 3 }, { label: "Manual processes only", score: 1 }] },
];

const categories = ["Data Quality", "Complexity", "Calibration", "Uncertainty", "Sensitivity", "Documentation"];

const categoryDescriptions: Record<string, string> = {
  "Data Quality": "Covers the quality, vintage, and resolution of your input data — rainfall, topography, and land use.",
  "Complexity": "Assesses whether your model's level of detail is justified by the available data and the decisions it supports.",
  "Calibration": "Evaluates how thoroughly you've calibrated and validated the model against observed data.",
  "Uncertainty": "Checks whether you've quantified and communicated the range of possible outcomes.",
  "Sensitivity": "Determines if you know which parameters actually matter and which don't affect results.",
  "Documentation": "Assesses reproducibility — could someone else understand and recreate your work?",
};

const getGrade = (pct: number) => {
  if (pct >= 95) return "A+";
  if (pct >= 90) return "A";
  if (pct >= 85) return "A-";
  if (pct >= 80) return "B+";
  if (pct >= 75) return "B";
  if (pct >= 70) return "B-";
  if (pct >= 65) return "C+";
  if (pct >= 60) return "C";
  if (pct >= 55) return "C-";
  if (pct >= 50) return "D";
  return "F";
};

const getGradeColor = (pct: number) => {
  if (pct >= 80) return "text-emerald-500";
  if (pct >= 60) return "text-amber-500";
  return "text-destructive";
};

export const ResponsibilityScoreQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResults(false);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 5;
  const pct = Math.round((totalScore / maxScore) * 100);

  const categoryScores = categories.map((cat) => {
    const catQuestions = questions.filter((q) => q.category === cat);
    const catAnswers = catQuestions.map((_, i) => {
      const globalIdx = questions.indexOf(catQuestions[i]);
      return answers[globalIdx] ?? 0;
    });
    const catMax = catQuestions.length * 5;
    const catTotal = catAnswers.reduce((a, b) => a + b, 0);
    return { category: cat, score: catMax > 0 ? Math.round((catTotal / catMax) * 100) : 0, fullMark: 100 };
  });

  const weakest = [...categoryScores].sort((a, b) => a.score - b.score)[0];
  const weakestChapters = questions
    .filter((q) => q.category === weakest?.category)
    .map((q) => q.chapter)
    .filter((v, i, a) => a.indexOf(v) === i);

  if (showResults) {
    return (
      <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardCheck className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Your Responsibility Score</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>Your score reflects how well your project aligns with Dr. James's 17 rules for responsible modeling. 80%+ is considered strong practice.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center space-y-4">
            <div className={`text-7xl font-bold ${getGradeColor(pct)}`}>{getGrade(pct)}</div>
            <div className="text-3xl font-semibold text-foreground">{pct}/100</div>
            <p className="text-muted-foreground text-sm">
              {pct >= 80 ? "Excellent! Your project follows responsible modeling practices." : pct >= 60 ? "Good foundation, but there are gaps to address." : "Significant gaps identified. Review the recommendations below."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={reset} variant="outline" size="sm"><RotateCcw className="w-4 h-4 mr-1" /> Retake</Button>
              <Button variant="outline" size="sm" onClick={() => {
                const text = `I scored ${pct}/100 (${getGrade(pct)}) on the Responsible Modeling Assessment! 🌊\n\nTest your project: rulesforresponsiblemodeling.lovable.app`;
                navigator.clipboard.writeText(text);
              }}>
                <Share2 className="w-4 h-4 mr-1" /> Share
              </Button>
            </div>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryScores}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="hsl(200 90% 45%)" fill="hsl(200 90% 45%)" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            Category Breakdown
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Each category groups related questions. Hover over category names below to learn what they measure.</p>
              </TooltipContent>
            </Tooltip>
          </h3>
          {categoryScores.map((cat) => (
            <div key={cat.category} className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm w-28 shrink-0 text-muted-foreground underline decoration-dotted cursor-help">{cat.category}</span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{categoryDescriptions[cat.category]}</p>
                </TooltipContent>
              </Tooltip>
              <Progress value={cat.score} className="h-3 flex-1" />
              <Badge variant={cat.score >= 80 ? "default" : cat.score >= 60 ? "secondary" : "destructive"} className="w-12 justify-center text-xs">{cat.score}%</Badge>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        {weakest && weakest.score < 80 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-2">
              <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-foreground">Top Recommendation</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You scored {weakest.score}% on <strong>{weakest.category}</strong>. Start with{" "}
                  {weakestChapters.map((ch, i) => (
                    <span key={ch}>
                      <a href={`/chapter/${ch}`} className="text-primary underline">Chapter {ch}</a>
                      {i < weakestChapters.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {" "}to strengthen this area.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
      </TooltipProvider>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <TooltipProvider delayDuration={200}>
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <ClipboardCheck className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Responsibility Score Quiz</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>A 20-question self-assessment based on Dr. James's framework. Each answer is scored 0–5 and mapped to one of six responsibility categories.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Score your current modeling project against Dr. James's framework. 20 questions, ~5 minutes.
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Question {currentQ + 1} of {questions.length}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">
                <Badge variant="outline" className="text-xs">{q.category}</Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{categoryDescriptions[q.category]}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <p className="text-lg font-medium text-foreground mb-6">{q.text}</p>
      <p className="text-xs text-muted-foreground mb-4">
        Reference: Chapter {q.chapter}
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1 align-text-top" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>This question is based on concepts from Chapter {q.chapter}. Visit the chapter for detailed guidance.</p>
          </TooltipContent>
        </Tooltip>
      </p>

      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.score)}
            className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group"
          >
            <span className="text-foreground">{opt.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </Card>
    </TooltipProvider>
  );
};
