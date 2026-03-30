import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { Compass, GraduationCap, Briefcase, Shield, RotateCcw, ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: { label: string; scores: Record<string, number> }[];
}

const questions: QuizQuestion[] = [
  {
    question: "What is your experience level with hydraulic/hydrologic modeling?",
    options: [
      { label: "New to modeling — still learning fundamentals", scores: { student: 3, practitioner: 0, ethics: 1, comprehensive: 2 } },
      { label: "Practicing modeler — 2+ years experience", scores: { student: 0, practitioner: 3, ethics: 1, comprehensive: 2 } },
      { label: "Senior/expert — reviewing or mentoring others", scores: { student: 0, practitioner: 1, ethics: 3, comprehensive: 2 } },
    ],
  },
  {
    question: "What is your primary learning goal?",
    options: [
      { label: "Build a strong foundation in responsible modeling", scores: { student: 3, practitioner: 0, ethics: 1, comprehensive: 2 } },
      { label: "Quick refresher on best practices & common pitfalls", scores: { student: 0, practitioner: 3, ethics: 0, comprehensive: 1 } },
      { label: "Deepen understanding of uncertainty & ethics", scores: { student: 0, practitioner: 1, ethics: 3, comprehensive: 1 } },
      { label: "Complete mastery — cover everything", scores: { student: 1, practitioner: 0, ethics: 1, comprehensive: 3 } },
    ],
  },
  {
    question: "How much time can you dedicate?",
    options: [
      { label: "1–4 hours (quick overview)", scores: { student: 0, practitioner: 2, ethics: 3, comprehensive: 0 } },
      { label: "4–10 hours (focused study)", scores: { student: 3, practitioner: 2, ethics: 1, comprehensive: 1 } },
      { label: "10+ hours (deep dive)", scores: { student: 1, practitioner: 0, ethics: 0, comprehensive: 3 } },
    ],
  },
];

const pathwayInfo = {
  student: { title: "Student Path", icon: GraduationCap, color: "from-blue-500 to-cyan-500", time: "8-10 hours", chapters: 8, desc: "Foundation-first approach building concepts progressively from basics to advanced topics." },
  practitioner: { title: "Practitioner Review", icon: Briefcase, color: "from-emerald-500 to-teal-500", time: "4-5 hours", chapters: 6, desc: "Quick refresher focusing on best practices, common pitfalls, and advanced optimization." },
  ethics: { title: "Ethics & Uncertainty Deep Dive", icon: Shield, color: "from-purple-500 to-pink-500", time: "3-4 hours", chapters: 5, desc: "Explore the philosophical and ethical dimensions of modeling and uncertainty communication." },
  comprehensive: { title: "Comprehensive Journey", icon: Compass, color: "from-amber-500 to-orange-500", time: "15-20 hours", chapters: 17, desc: "Complete cover-to-cover reading for thorough understanding and deep expertise." },
};

export const FindYourPathQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ student: 0, practitioner: 0, ethics: 0, comprehensive: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const option = questions[currentQuestion].options[selectedOption];
    const newScores = { ...scores };
    for (const [key, value] of Object.entries(option.scores)) {
      newScores[key] = (newScores[key] || 0) + value;
    }
    setScores(newScores);
    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScores({ student: 0, practitioner: 0, ethics: 0, comprehensive: 0 });
    setSelectedOption(null);
    setShowResult(false);
  };

  const getRecommendation = () => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    return sorted[0][0] as keyof typeof pathwayInfo;
  };

  if (showResult) {
    const recommended = getRecommendation();
    const info = pathwayInfo[recommended];
    const Icon = info.icon;
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);

    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2">Your Recommended Path</h3>
          <p className="text-sm text-muted-foreground">Based on your answers, we recommend:</p>
        </div>

        <div className={`p-6 rounded-xl bg-gradient-to-br ${info.color} text-white mb-6`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-2xl font-bold">{info.title}</h4>
              <div className="flex items-center gap-3 text-sm text-white/80 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{info.time}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{info.chapters} chapters</span>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-sm">{info.desc}</p>
        </div>

        {/* Score breakdown */}
        <div className="mb-6 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Match Scores</p>
          {sorted.map(([key, score]) => {
            const pInfo = pathwayInfo[key as keyof typeof pathwayInfo];
            const maxScore = 9;
            const pct = Math.round((score / maxScore) * 100);
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-40 truncate">{pInfo.title}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${pInfo.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Link to="/study-guide" className="flex-1">
            <Button className="w-full group">
              Start This Path
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
        </div>
      </Card>
    );
  }

  const q = questions[currentQuestion];

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Compass className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Find Your Path</h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Answer 3 quick questions to get a personalized pathway recommendation.
      </p>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i < currentQuestion ? "bg-primary" : i === currentQuestion ? "bg-primary/50" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="mb-6">
        <Badge variant="outline" className="mb-3">Question {currentQuestion + 1} of {questions.length}</Badge>
        <h3 className="text-lg font-semibold text-foreground">{q.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedOption === i
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <span className="text-sm text-foreground">{option.label}</span>
          </button>
        ))}
      </div>

      <Button onClick={handleNext} disabled={selectedOption === null} className="w-full">
        {currentQuestion < questions.length - 1 ? "Next Question" : "See My Recommendation"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
};
