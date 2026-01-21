import { useState, useEffect, useCallback } from "react";

interface ChapterProgress {
  chapterNumber: number;
  completed: boolean;
  completedAt?: number;
}

interface PathwayProgress {
  pathwayId: string;
  chapters: ChapterProgress[];
  startedAt: number;
  lastAccessedAt: number;
}

const STORAGE_KEY = "pathway-progress";

export const usePathwayProgress = () => {
  const [progress, setProgress] = useState<PathwayProgress[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse pathway progress:", e);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: PathwayProgress[]) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  // Mark a chapter as complete for a pathway
  const markChapterComplete = useCallback((pathwayId: string, chapterNumber: number, pathwayChapters: number[]) => {
    setProgress(prev => {
      let updated = [...prev];
      let pathwayProgress = updated.find(p => p.pathwayId === pathwayId);
      
      if (!pathwayProgress) {
        // Initialize pathway progress
        pathwayProgress = {
          pathwayId,
          chapters: pathwayChapters.map(num => ({
            chapterNumber: num,
            completed: num === chapterNumber,
            completedAt: num === chapterNumber ? Date.now() : undefined
          })),
          startedAt: Date.now(),
          lastAccessedAt: Date.now()
        };
        updated.push(pathwayProgress);
      } else {
        // Update existing pathway
        const chapterIndex = pathwayProgress.chapters.findIndex(c => c.chapterNumber === chapterNumber);
        if (chapterIndex >= 0) {
          pathwayProgress.chapters[chapterIndex] = {
            ...pathwayProgress.chapters[chapterIndex],
            completed: true,
            completedAt: Date.now()
          };
        }
        pathwayProgress.lastAccessedAt = Date.now();
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Unmark a chapter as complete
  const unmarkChapterComplete = useCallback((pathwayId: string, chapterNumber: number) => {
    setProgress(prev => {
      const updated = prev.map(p => {
        if (p.pathwayId === pathwayId) {
          return {
            ...p,
            chapters: p.chapters.map(c => 
              c.chapterNumber === chapterNumber 
                ? { ...c, completed: false, completedAt: undefined }
                : c
            ),
            lastAccessedAt: Date.now()
          };
        }
        return p;
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toggle chapter completion
  const toggleChapterComplete = useCallback((pathwayId: string, chapterNumber: number, pathwayChapters: number[]) => {
    const pathwayProgress = progress.find(p => p.pathwayId === pathwayId);
    const chapter = pathwayProgress?.chapters.find(c => c.chapterNumber === chapterNumber);
    
    if (chapter?.completed) {
      unmarkChapterComplete(pathwayId, chapterNumber);
    } else {
      markChapterComplete(pathwayId, chapterNumber, pathwayChapters);
    }
  }, [progress, markChapterComplete, unmarkChapterComplete]);

  // Get progress for a specific pathway
  const getPathwayProgress = useCallback((pathwayId: string): PathwayProgress | undefined => {
    return progress.find(p => p.pathwayId === pathwayId);
  }, [progress]);

  // Get completion percentage for a pathway
  const getCompletionPercentage = useCallback((pathwayId: string): number => {
    const pathwayProgress = progress.find(p => p.pathwayId === pathwayId);
    if (!pathwayProgress || pathwayProgress.chapters.length === 0) return 0;
    
    const completed = pathwayProgress.chapters.filter(c => c.completed).length;
    return Math.round((completed / pathwayProgress.chapters.length) * 100);
  }, [progress]);

  // Get completed chapter count for a pathway
  const getCompletedCount = useCallback((pathwayId: string): number => {
    const pathwayProgress = progress.find(p => p.pathwayId === pathwayId);
    if (!pathwayProgress) return 0;
    return pathwayProgress.chapters.filter(c => c.completed).length;
  }, [progress]);

  // Check if a chapter is completed for a pathway
  const isChapterCompleted = useCallback((pathwayId: string, chapterNumber: number): boolean => {
    const pathwayProgress = progress.find(p => p.pathwayId === pathwayId);
    const chapter = pathwayProgress?.chapters.find(c => c.chapterNumber === chapterNumber);
    return chapter?.completed ?? false;
  }, [progress]);

  // Reset a pathway's progress
  const resetPathwayProgress = useCallback((pathwayId: string) => {
    setProgress(prev => {
      const updated = prev.filter(p => p.pathwayId !== pathwayId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    progress,
    markChapterComplete,
    unmarkChapterComplete,
    toggleChapterComplete,
    getPathwayProgress,
    getCompletionPercentage,
    getCompletedCount,
    isChapterCompleted,
    resetPathwayProgress
  };
};
