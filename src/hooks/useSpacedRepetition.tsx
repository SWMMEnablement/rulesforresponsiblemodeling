import { useState, useEffect } from "react";
import { safeStorage } from "@/lib/storage";

export interface FlashcardData {
  id: string;
  term: string;
  definition: string;
  chapter: number;
}

export interface CardProgress {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed?: Date;
}

type Difficulty = "again" | "hard" | "good" | "easy";

const STORAGE_KEY = "flashcard-progress";

export const useSpacedRepetition = (flashcards: FlashcardData[]) => {
  const [progress, setProgress] = useState<Map<string, CardProgress>>(() => {
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

  const getCardProgress = (id: string): CardProgress => {
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

  const updateCard = (id: string, difficulty: Difficulty) => {
    const current = getCardProgress(id);
    let { easeFactor, interval, repetitions } = current;

    // SM-2 Algorithm
    let quality: number;
    switch (difficulty) {
      case "again":
        quality = 0;
        break;
      case "hard":
        quality = 3;
        break;
      case "good":
        quality = 4;
        break;
      case "easy":
        quality = 5;
        break;
    }

    // Update ease factor
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Update interval and repetitions
    if (quality < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const updated: CardProgress = {
      id,
      easeFactor,
      interval,
      repetitions,
      nextReview,
      lastReviewed: new Date(),
    };

    setProgress(new Map(progress.set(id, updated)));
  };

  const getDueCards = (): FlashcardData[] => {
    const now = new Date();
    return flashcards.filter((card) => {
      const cardProgress = progress.get(card.id);
      return !cardProgress || cardProgress.nextReview <= now;
    });
  };

  const getNewCards = (): FlashcardData[] => {
    return flashcards.filter((card) => !progress.has(card.id));
  };

  const getStats = () => {
    const total = flashcards.length;
    const learned = Array.from(progress.values()).filter((p) => p.repetitions >= 3).length;
    const due = getDueCards().length;
    const newCards = getNewCards().length;

    return { total, learned, due, newCards };
  };

  const resetProgress = () => {
    setProgress(new Map());
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    updateCard,
    getDueCards,
    getNewCards,
    getStats,
    resetProgress,
    getCardProgress,
  };
};