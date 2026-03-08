import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useBookmarks } from "@/hooks/useBookmarks";
import { usePathwayProgress } from "@/hooks/usePathwayProgress";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { flashcardData } from "@/data/flashcardData";
import {
  BookOpen, Bookmark, Brain, Trophy, Target, ArrowRight,
  CheckCircle2, Clock, Sparkles, BarChart3
} from "lucide-react";

const chapterTitles: Record<number, string> = {
  1: "Introduction", 2: "Understanding Uncertainty", 3: "Data Quality and Sources",
  4: "Model Complexity", 5: "Continuous Simulation", 6: "Rainfall Analysis",
  7: "Storm Spatial Structure", 8: "Decision Support Systems", 9: "Objective Functions",
  10: "Uncertainty Analysis", 11: "Sensitivity Analysis", 12: "State Variable Representation",
  13: "Performance Metrics", 14: "Optimization Techniques", 15: "Fuzzy Logic Applications",
  16: "Model Error Analysis", 17: "Rules for Responsible Modeling",
};

const pathwayNames: Record<string, { name: string; chapters: number[] }> = {
  student: { name: "Student Path", chapters: [1, 2, 3, 4, 5, 9, 10, 11, 13, 17] },
  practitioner: { name: "Practitioner Path", chapters: [4, 6, 7, 9, 11, 14, 17] },
  ethics: { name: "Ethics Deep Dive", chapters: [1, 8, 16, 17] },
  comprehensive: { name: "Comprehensive Path", chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
};

const ProgressDashboard = () => {
  const { bookmarks } = useBookmarks();
  const { getCompletionPercentage, getCompletedCount, progress } = usePathwayProgress();
  const { getStats, getDueCards } = useSpacedRepetition(flashcardData);
  const flashcardStats = getStats();
  const dueCards = getDueCards();

  // Check which chapters have been visited (from localStorage reading-progress or bookmarks)
  const getChapterReadStatus = () => {
    const chaptersRead: number[] = [];
    for (let i = 1; i <= 17; i++) {
      const notesKey = `chapter-notes-${i}`;
      const hasNotes = localStorage.getItem(notesKey);
      const isBookmarked = bookmarks.some(b => b.chapterNumber === i);
      if (hasNotes || isBookmarked) {
        chaptersRead.push(i);
      }
    }
    return chaptersRead;
  };

  const chaptersEngaged = getChapterReadStatus();

  // Get quiz scores from localStorage
  const getQuizScore = () => {
    try {
      const stored = localStorage.getItem("responsibility-quiz-score");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  };
  const quizScore = getQuizScore();

  // Active pathways
  const activePathways = progress.filter(p => 
    Object.keys(pathwayNames).includes(p.pathwayId)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Your Progress</h1>
          </div>
          <p className="text-muted-foreground">Track your learning journey through Rules for Responsible Modeling</p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{chaptersEngaged.length}</div>
            <div className="text-xs text-muted-foreground">Chapters Engaged</div>
            <Progress value={(chaptersEngaged.length / 17) * 100} className="h-1.5 mt-2" />
          </Card>
          <Card className="p-4 text-center">
            <Bookmark className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{bookmarks.length}</div>
            <div className="text-xs text-muted-foreground">Bookmarks</div>
          </Card>
          <Card className="p-4 text-center">
            <Brain className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{flashcardStats.learned}</div>
            <div className="text-xs text-muted-foreground">Cards Mastered</div>
            <Progress value={(flashcardStats.learned / Math.max(flashcardStats.total, 1)) * 100} className="h-1.5 mt-2" />
          </Card>
          <Card className="p-4 text-center">
            <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{dueCards.length}</div>
            <div className="text-xs text-muted-foreground">Cards Due Today</div>
          </Card>
        </div>
      </section>

      {/* Flashcard Breakdown */}
      <section className="py-8 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Flashcard Progress (SM-2)</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">New</div>
              <div className="text-xl font-bold text-foreground">{flashcardStats.newCards}</div>
              <div className="text-xs text-muted-foreground">Not yet studied</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Learning</div>
              <div className="text-xl font-bold text-amber-500">{flashcardStats.total - flashcardStats.newCards - flashcardStats.learned}</div>
              <div className="text-xs text-muted-foreground">In progress</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Mastered</div>
              <div className="text-xl font-bold text-emerald-500">{flashcardStats.learned}</div>
              <div className="text-xs text-muted-foreground">3+ repetitions</div>
            </Card>
          </div>
          {dueCards.length > 0 && (
            <div className="mt-4">
              <Link to="/study-guide">
                <Button className="gap-2">
                  <Brain className="w-4 h-4" />
                  Review {dueCards.length} Due Cards
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Learning Pathways */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Learning Pathways</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(pathwayNames).map(([id, info]) => {
              const pct = getCompletionPercentage(id);
              const completed = getCompletedCount(id);
              const isActive = activePathways.some(p => p.pathwayId === id);
              return (
                <Card key={id} className={`p-4 ${isActive ? "border-l-4 border-l-primary" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{info.name}</h3>
                    {pct === 100 && (
                      <Badge className="bg-emerald-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" /> Complete
                      </Badge>
                    )}
                  </div>
                  <Progress value={pct} className="h-2 mb-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {completed} / {info.chapters.length} chapters
                    </span>
                    <span className="text-xs font-medium text-primary">{pct}%</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiz Score */}
      {quizScore && (
        <section className="py-8 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Responsibility Quiz Score</h2>
            </div>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary">{quizScore.score || quizScore}</div>
              <p className="text-sm text-muted-foreground mt-1">Your last responsibility score assessment</p>
            </Card>
          </div>
        </section>
      )}

      {/* Chapter Map */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">All 17 Chapters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 17 }, (_, i) => i + 1).map(num => {
              const engaged = chaptersEngaged.includes(num);
              const bookmarked = bookmarks.some(b => b.chapterNumber === num);
              return (
                <Link key={num} to={`/chapter/${num}`}>
                  <Card className={`p-3 hover:shadow-md transition-all ${engaged ? "border-l-4 border-l-emerald-500" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${engaged ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                        {engaged ? <CheckCircle2 className="w-4 h-4" /> : num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          Ch. {num}: {chapterTitles[num]}
                        </div>
                      </div>
                      {bookmarked && <Bookmark className="w-4 h-4 text-primary fill-primary shrink-0" />}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgressDashboard;
