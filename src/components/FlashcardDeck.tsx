import { useState, useEffect } from "react";
import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSpacedRepetition, FlashcardData } from "@/hooks/useSpacedRepetition";
import { flashcardData } from "@/data/flashcardData";
import { 
  Brain, 
  RotateCcw, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Shuffle
} from "lucide-react";
import { toast } from "sonner";

export const FlashcardDeck = () => {
  const {
    updateCard,
    getDueCards,
    getNewCards,
    getStats,
    resetProgress,
    getCardProgress,
  } = useSpacedRepetition(flashcardData);

  const [currentCards, setCurrentCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"new" | "review" | "all">("new");
  const [showAnswer, setShowAnswer] = useState(false);

  const stats = getStats();

  useEffect(() => {
    loadCards(mode);
  }, [mode]);

  const loadCards = (cardMode: "new" | "review" | "all") => {
    let cards: FlashcardData[];
    
    if (cardMode === "new") {
      cards = getNewCards().slice(0, 10); // Limit to 10 new cards per session
    } else if (cardMode === "review") {
      cards = getDueCards();
    } else {
      cards = [...flashcardData].sort(() => Math.random() - 0.5).slice(0, 20);
    }

    if (cards.length === 0) {
      if (cardMode === "review") {
        toast.info("No cards due for review! Come back later.");
        setMode("new");
      } else if (cardMode === "new") {
        toast.info("All cards learned! Try review mode.");
        setMode("review");
      }
      return;
    }

    setCurrentCards(cards);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleDifficulty = (difficulty: "again" | "hard" | "good" | "easy") => {
    if (currentCards.length === 0) return;

    const currentCard = currentCards[currentIndex];
    updateCard(currentCard.id, difficulty);

    const messages = {
      again: "Card reset - will see again soon",
      hard: "Marked as hard - shorter interval",
      good: "Good! Normal interval applied",
      easy: "Easy! Longer interval until next review",
    };

    toast.success(messages[difficulty]);

    // Move to next card
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      toast.success("Session complete! Great work!");
      loadCards(mode);
    }
  };

  const currentCard = currentCards[currentIndex];
  const progress = currentCards.length > 0 
    ? ((currentIndex) / currentCards.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Cards</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.learned}</p>
              <p className="text-sm text-muted-foreground">Mastered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/20 to-accent/10">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-accent-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.due}</p>
              <p className="text-sm text-muted-foreground">Due for Review</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-muted/40 to-muted/20">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.newCards}</p>
              <p className="text-sm text-muted-foreground">New Cards</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mode Selection */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "new" ? "default" : "outline"}
              onClick={() => setMode("new")}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              New Cards ({stats.newCards})
            </Button>
            <Button
              variant={mode === "review" ? "default" : "outline"}
              onClick={() => setMode("review")}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Review Due ({stats.due})
            </Button>
            <Button
              variant={mode === "all" ? "default" : "outline"}
              onClick={() => setMode("all")}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Practice All
            </Button>
          </div>
          
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Reset all progress? This cannot be undone.")) {
                resetProgress();
                toast.success("Progress reset successfully");
                loadCards(mode);
              }
            }}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </Button>
        </div>
      </Card>

      {/* Flashcard Display */}
      {currentCard ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Card {currentIndex + 1} of {currentCards.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <Flashcard
                term={currentCard.term}
                definition={currentCard.definition}
                chapter={currentCard.chapter}
              />
            </div>
          </div>

          {/* Difficulty Buttons */}
          <Card className="p-6 bg-muted/20">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">How well did you know this?</h3>
                <p className="text-sm text-muted-foreground">Your response determines when you'll see this card again</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="destructive"
                  onClick={() => handleDifficulty("again")}
                  className="flex-col h-auto py-4"
                >
                  <span className="text-lg font-bold">Again</span>
                  <span className="text-xs opacity-90">{"<1 day"}</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDifficulty("hard")}
                  className="flex-col h-auto py-4 border-destructive/50 hover:bg-destructive/10"
                >
                  <span className="text-lg font-bold">Hard</span>
                  <span className="text-xs opacity-70">~3 days</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDifficulty("good")}
                  className="flex-col h-auto py-4 border-secondary/50 hover:bg-secondary/10"
                >
                  <span className="text-lg font-bold">Good</span>
                  <span className="text-xs opacity-70">~6 days</span>
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => handleDifficulty("easy")}
                  className="flex-col h-auto py-4 bg-secondary hover:bg-secondary/90"
                >
                  <span className="text-lg font-bold">Easy</span>
                  <span className="text-xs opacity-90">~14+ days</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Next Review Info */}
          {mode === "review" && (
            <Card className="p-4 bg-accent/10 border-accent/30">
              <p className="text-sm text-center text-accent-foreground">
                <strong>Spaced Repetition:</strong> Cards you find easy will be shown less frequently, 
                while difficult cards appear more often until mastered.
              </p>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-secondary mx-auto" />
            <h3 className="text-xl font-semibold text-foreground">No cards available</h3>
            <p className="text-muted-foreground">
              {mode === "review" 
                ? "All caught up! No cards due for review right now."
                : "All cards have been learned! Try review mode or reset progress."}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};