import { useState, useEffect, useCallback } from "react";
import { List, ChevronUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
  emoji: string;
  group: string;
}

const tocItems: TocItem[] = [
  { id: "complexity-simulator", label: "Complexity Curve", emoji: "📈", group: "Core Concepts" },
  { id: "uncertainty-funnel", label: "Uncertainty Funnel", emoji: "🔬", group: "Core Concepts" },
  { id: "calibration-validation", label: "Cal vs Val", emoji: "⚖️", group: "Core Concepts" },
  { id: "precision-illusion", label: "Precision Illusion", emoji: "🎯", group: "Core Concepts" },
  { id: "equifinality", label: "Equifinality", emoji: "🔀", group: "Core Concepts" },
  { id: "garbage-gospel", label: "Garbage In Gospel Out", emoji: "💀", group: "Data Quality" },
  { id: "data-decay", label: "Data Decay", emoji: "📅", group: "Data Quality" },
  { id: "rain-gauge", label: "Rain Gauge Density", emoji: "🌧️", group: "Data Quality" },
  { id: "sensitivity-spider", label: "Sensitivity Spider", emoji: "🕷️", group: "Analysis" },
  { id: "confidence-zones", label: "Confidence Zones", emoji: "🚦", group: "Analysis" },
  { id: "calibration-dance", label: "Calibration Dance", emoji: "💃", group: "Analysis" },
  { id: "stakeholder-translation", label: "Stakeholder Translation", emoji: "🗣️", group: "Communication" },
  { id: "report-card", label: "Report Card", emoji: "📋", group: "Communication" },
  { id: "software-translation", label: "Software Translation", emoji: "💻", group: "Communication" },
  { id: "philosophy-evolution", label: "Philosophy Evolution", emoji: "📜", group: "History" },
];

export const AnimationsToc = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY + 120;
    let current = "";
    for (const item of tocItems) {
      const el = document.getElementById(item.id);
      if (el && el.offsetTop <= scrollY) {
        current = item.id;
      }
    }
    setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  const groups = [...new Set(tocItems.map(i => i.group))];

  return (
    <>
      {/* Floating toggle button — hidden on mobile, visible on xl+ */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant="outline"
        className="fixed bottom-6 right-6 z-50 hidden xl:flex w-11 h-11 rounded-full shadow-lg border-primary/30 bg-background/90 backdrop-blur-sm hover:bg-primary/10"
        aria-label="Toggle table of contents"
      >
        {isOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
      </Button>

      {/* Floating TOC panel */}
      <div
        className={cn(
          "fixed right-6 bottom-20 z-50 w-64 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-xl transition-all duration-300 hidden xl:block",
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md">
          <p className="text-xs font-semibold text-foreground">Animations</p>
          <p className="text-[10px] text-muted-foreground">{tocItems.length} interactive visualizations</p>
        </div>
        <div className="p-2">
          {groups.map(group => (
            <div key={group} className="mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">{group}</p>
              {tocItems.filter(i => i.group === group).map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-xs transition-all flex items-center gap-2 hover:bg-muted/50",
                    activeId === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  <span className="text-[11px]">{item.emoji}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Back to top */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-full text-left px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted/50 flex items-center gap-2"
          >
            <ChevronUp className="w-3 h-3" />
            Back to top
          </button>
        </div>
      </div>
    </>
  );
};
