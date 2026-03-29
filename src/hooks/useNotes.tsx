import { useState, useEffect } from "react";
import { safeStorage } from "@/lib/storage";

const NOTES_KEY = "chapter-notes";

export interface ChapterNote {
  chapterNumber: number;
  content: string;
  lastModified: number;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<ChapterNote[]>([]);

  useEffect(() => {
    const stored = safeStorage.getItem(NOTES_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse notes:", e);
      }
    }
  }, []);

  const saveNotes = (newNotes: ChapterNote[]) => {
    setNotes(newNotes);
    localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes));
  };

  const saveNote = (chapterNumber: number, content: string) => {
    const existing = notes.find((n) => n.chapterNumber === chapterNumber);
    
    if (existing) {
      const updated = notes.map((n) =>
        n.chapterNumber === chapterNumber
          ? { ...n, content, lastModified: Date.now() }
          : n
      );
      saveNotes(updated);
    } else {
      const newNote: ChapterNote = {
        chapterNumber,
        content,
        lastModified: Date.now(),
      };
      saveNotes([...notes, newNote]);
    }
  };

  const getNote = (chapterNumber: number): ChapterNote | undefined => {
    return notes.find((n) => n.chapterNumber === chapterNumber);
  };

  const deleteNote = (chapterNumber: number) => {
    const filtered = notes.filter((n) => n.chapterNumber !== chapterNumber);
    saveNotes(filtered);
  };

  return {
    notes,
    saveNote,
    getNote,
    deleteNote,
  };
};
