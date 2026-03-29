import { useState, useEffect } from "react";
import { safeStorage } from "@/lib/storage";
const BOOKMARKS_KEY = "chapter-bookmarks";

export interface Bookmark {
  chapterNumber: number;
  title: string;
  timestamp: number;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const stored = safeStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks:", e);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(newBookmarks);
    safeStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
  };

  const toggleBookmark = (chapterNumber: number, title: string) => {
    const exists = bookmarks.find((b) => b.chapterNumber === chapterNumber);
    
    if (exists) {
      const filtered = bookmarks.filter((b) => b.chapterNumber !== chapterNumber);
      saveBookmarks(filtered);
    } else {
      const newBookmark: Bookmark = {
        chapterNumber,
        title,
        timestamp: Date.now(),
      };
      saveBookmarks([...bookmarks, newBookmark]);
    }
  };

  const isBookmarked = (chapterNumber: number) => {
    return bookmarks.some((b) => b.chapterNumber === chapterNumber);
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
};
