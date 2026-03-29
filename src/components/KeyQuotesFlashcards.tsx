import { safeStorage } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSpacedRepetition, FlashcardData } from "@/hooks/useSpacedRepetition";
import { keyQuotesFlashcardData } from "@/data/keyQuotesFlashcardData";
import { Link } from "react-router-dom";
import { 
  Brain, 
  RotateCcw, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Shuffle,
  Quote,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "quote-flashcard-progress";

// Custom hook for quote flashcards with separate storage
const useQuoteSpacedRepetition = (flashcards: FlashcardData[]) => {
  const [progress, setProgress] = useState<Map<string, any>>(() => {
    const stored = safeStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(
        Object.entries(parsed).map(([id, data]: [string, any]) => [
          id,
          {
            ...data,
            nextReview: new Date(data.nextReview),
            lastReviewed: data.lastReviewed ? new Date(data.lastReviewed) : undefined,
          },
        ])
      );
    }
    return new Map();
  });

  useEffect(() => {
    const progressObj = Object.fromEntries(progress);
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(progressObj));
  }, [progress]);

  const getCardProgress = (id: string) => {
    return (
      progress.get(id) || {
        id,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: new Date(),
      }
    );
  };

  const updateCard = (id: string, difficulty: "again" | "hard" | "good" | "easy") => {
    const current = getCardProgress(id);
    let { easeFactor, interval, repetitions } = current;

    let quality: number;
    switch (difficulty) {
      case "again": quality = 0; break;
      case "hard": quality = 3; break;
      case "good": quality = 4; break;
      case "easy": quality = 5; break;
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) interval = 1;
      else if (repetitions === 2) interval = 6;
      else interval = Math.round(interval * easeFactor);
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    setProgress(new Map(progress.set(id, {
      id, easeFactor, interval, repetitions, nextReview, lastReviewed: new Date()
    })));
  };

  const getDueCards = () => {
    const now = new Date();
    return flashcards.filter((card) => {
      const cardProgress = progress.get(card.id);
      return !cardProgress || cardProgress.nextReview <= now;
    });
  };

  const getNewCards = () => flashcards.filter((card) => !progress.has(card.id));

  const getStats = () => {
    const total = flashcards.length;
    const learned = Array.from(progress.values()).filter((p) => p.repetitions >= 3).length;
    const due = getDueCards().length;
    const newCards = getNewCards().length;
    return { total, learned, due, newCards };
  };

  const resetProgress = () => {
    setProgress(new Map());
    safeStorage.removeItem(STORAGE_KEY);
  };

  return { updateCard, getDueCards, getNewCards, getStats, resetProgress, getCardProgress };
};

export const KeyQuotesFlashcards = () => {
  const { updateCard, getDueCards, getNewCards, getStats, resetProgress } = useQuoteSpacedRepetition(keyQuotesFlashcardData);
  
  const [currentCards, setCurrentCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"new" | "review" | "all">("all");
  const [isFlipped, setIsFlipped] = useState(false);

  const stats = getStats();

  useEffect(() => {
    loadCards(mode);
  }, [mode]);

  const loadCards = (cardMode: "new" | "review" | "all") => {
    let cards: FlashcardData[];
    
    if (cardMode === "new") {
      cards = getNewCards();
    } else if (cardMode === "review") {
      cards = getDueCards();
    } else {
      cards = [...keyQuotesFlashcardData];
    }

    if (cards.length === 0 && cardMode !== "all") {
      toast.info(cardMode === "review" ? "No quotes due for review!" : "All quotes learned!");
      setMode("all");
      return;
    }

    setCurrentCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleDifficulty = (difficulty: "again" | "hard" | "good" | "easy") => {
    if (!currentCards[currentIndex]) return;

    updateCard(currentCards[currentIndex].id, difficulty);

    const messages = {
      again: "Will review again soon",
      hard: "Marked as challenging",
      good: "Good progress!",
      easy: "Mastered! Extended interval",
    };
    toast.success(messages[difficulty]);

    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      toast.success("Session complete! 🎉");
      loadCards(mode);
    }
  };

  const navigateCard = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "next" && currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setIsFlipped(false);
  };

  const currentCard = currentCards[currentIndex];
  const progress = currentCards.length > 0 ? ((currentIndex + 1) / currentCards.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-3">
            <Quote className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Quotes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-xl font-bold text-foreground">{stats.learned}</p>
              <p className="text-xs text-muted-foreground">Mastered</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-500" />
            <div>
              <p className="text-xl font-bold text-foreground">{stats.due}</p>
              <p className="text-xs text-muted-foreground">Due for Review</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-xl font-bold text-foreground">{stats.newCards}</p>
              <p className="text-xs text-muted-foreground">New Quotes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Mode Selection */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={mode === "new" ? "default" : "outline"}
              onClick={() => setMode("new")}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              New ({stats.newCards})
            </Button>
            <Button
              size="sm"
              variant={mode === "review" ? "default" : "outline"}
              onClick={() => setMode("review")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Review ({stats.due})
            </Button>
            <Button
              size="sm"
              variant={mode === "all" ? "default" : "outline"}
              onClick={() => setMode("all")}
            >
              <Shuffle className="h-4 w-4 mr-1" />
              All Quotes
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm("Reset all progress?")) {
                resetProgress();
                toast.success("Progress reset");
                loadCards(mode);
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Progress Bar */}
      {currentCards.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Quote {currentIndex + 1} of {currentCards.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Flashcard */}
      {currentCard ? (
        <div className="space-y-4">
          {/* Card Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("prev")}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* The Flashcard */}
            <div 
              className="perspective-1000 w-full max-w-2xl h-72 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
                {/* Front - Chapter Title */}
                <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/30 hover:border-primary/50 transition-all">
                  <Quote className="w-10 h-10 text-primary/50 mb-4" />
                  <h3 className="text-2xl font-bold text-foreground text-center mb-2">{currentCard.term}</h3>
                  <Badge variant="secondary" className="mt-4">
                    Click to reveal quote
                  </Badge>
                </Card>

                {/* Back - Quote */}
                <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-secondary/10 via-secondary/5 to-primary/10 border-2 border-secondary/30">
                  <div className="text-center space-y-4 overflow-auto">
                    <Quote className="w-8 h-8 text-secondary/50 mx-auto" />
                    <p className="text-base text-foreground leading-relaxed italic">
                      "{currentCard.definition}"
                    </p>
                    <p className="text-sm text-primary font-medium">— Dr. William James</p>
                    <Link to={`/chapter/${currentCard.chapter}`}>
                      <Button variant="link" size="sm" className="gap-1">
                        Read Chapter {currentCard.chapter} <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateCard("next")}
              disabled={currentIndex === currentCards.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Difficulty Rating */}
          <Card className="p-6 bg-muted/30">
            <p className="text-center text-sm text-muted-foreground mb-4">
              How well do you understand this principle?
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDifficulty("again")}
                className="flex-col h-auto py-3"
              >
                <span className="font-bold">Again</span>
                <span className="text-xs opacity-80">{"<1d"}</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDifficulty("hard")}
                className="flex-col h-auto py-3 border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
              >
                <span className="font-bold">Hard</span>
                <span className="text-xs opacity-70">~3d</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDifficulty("good")}
                className="flex-col h-auto py-3 border-blue-500/50 text-blue-600 hover:bg-blue-500/10"
              >
                <span className="font-bold">Good</span>
                <span className="text-xs opacity-70">~6d</span>
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleDifficulty("easy")}
                className="flex-col h-auto py-3 bg-green-600 hover:bg-green-700"
              >
                <span className="font-bold">Easy</span>
                <span className="text-xs opacity-90">14d+</span>
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
          <p className="text-muted-foreground mt-2">
            No quotes to review right now. Come back later or practice all quotes.
          </p>
        </Card>
      )}
    </div>
  );
};
