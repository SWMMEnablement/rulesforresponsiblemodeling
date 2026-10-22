import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";

interface KeyboardShortcutsOptions {
  onOpenHelp?: () => void;
}

/**
 * True when a keystroke should be left alone: the user is typing, or has focus on
 * any interactive widget (button, slider, tab, select, menu, link, contenteditable),
 * or a dialog/sheet/popover is open. Single-letter shortcuts must only fire when
 * focus is on the page body itself.
 */
function keystrokeBelongsToWidget(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  if (target === document.body || target === document.documentElement) {
    // Still ignore if a Radix dialog / sheet / popover / menu is open.
    return !!document.querySelector('[role="dialog"][data-state="open"], [data-radix-popper-content-wrapper]');
  }
  // Any focusable control or anything inside one.
  return !!target.closest(
    'input, textarea, select, button, a, [contenteditable=""], [contenteditable="true"], ' +
      '[role="slider"], [role="tab"], [role="tablist"], [role="radio"], [role="switch"], [role="checkbox"], ' +
      '[role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="dialog"], [tabindex]'
  );
}

export const useKeyboardShortcuts = ({ onOpenHelp }: KeyboardShortcutsOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
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

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if modifier keys are pressed (except Shift for ?)
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.isComposing || event.repeat) return;
      if (keystrokeBelongsToWidget(event)) return;

      const key = event.key.toLowerCase();

      switch (key) {
        case "d":
          event.preventDefault();
          // resolvedTheme accounts for "system"; `theme` would be "system" and never toggle
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          break;
        case "?":
          event.preventDefault();
          onOpenHelp?.();
          break;
        case "h":
          event.preventDefault();
          navigate("/");
          break;
        case "g":
          event.preventDefault();
          navigate("/glossary");
          break;
        case "s":
          event.preventDefault();
          navigate("/study-guide");
          break;
        case "r":
          event.preventDefault();
          navigate("/resources");
          break;
        case "arrowleft":
          if (location.pathname.startsWith("/chapter/")) {
            event.preventDefault();
            navigateChapter(-1);
          }
          break;
        case "arrowright":
          if (location.pathname.startsWith("/chapter/")) {
            event.preventDefault();
            navigateChapter(1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, location, setTheme, resolvedTheme, onOpenHelp]);
};
