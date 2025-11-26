import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

interface KeyboardShortcutsOptions {
  onOpenHelp?: () => void;
}

export const useKeyboardShortcuts = ({ onOpenHelp }: KeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Don't trigger if modifier keys are pressed (except Shift for ?)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case "d":
          // Toggle dark mode
          event.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
          break;

        case "?":
          // Show help modal
          event.preventDefault();
          onOpenHelp?.();
          break;

        case "h":
          // Navigate home
          event.preventDefault();
          navigate("/");
          break;

        case "g":
          // Navigate to glossary
          event.preventDefault();
          navigate("/glossary");
          break;

        case "s":
          // Navigate to study guide
          event.preventDefault();
          navigate("/study-guide");
          break;

        case "r":
          // Navigate to resources
          event.preventDefault();
          navigate("/resources");
          break;

        case "arrowleft":
          // Navigate to previous chapter
          event.preventDefault();
          navigateChapter(-1);
          break;

        case "arrowright":
          // Navigate to next chapter
          event.preventDefault();
          navigateChapter(1);
          break;

        case "escape":
          // Close modals or go back (can be extended)
          event.preventDefault();
          break;
      }
    };

    const navigateChapter = (direction: number) => {
      const match = location.pathname.match(/\/chapter\/(\d+)/);
      if (match) {
        const currentChapter = parseInt(match[1]);
        const nextChapter = currentChapter + direction;
        
        // Chapter range is 1-17
        if (nextChapter >= 1 && nextChapter <= 17) {
          navigate(`/chapter/${nextChapter}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate, location, setTheme, theme, onOpenHelp]);
};
