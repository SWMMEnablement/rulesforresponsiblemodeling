import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { findGlossaryTerm } from "@/data/glossaryData";

interface GlossaryTooltipProps {
  term: string;
  children?: ReactNode;
  className?: string;
}

export const GlossaryTooltip = ({ term, children, className = "" }: GlossaryTooltipProps) => {
  const glossaryEntry = findGlossaryTerm(term);

  if (!glossaryEntry) {
    return <span className={className}>{children || term}</span>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          className={`underline decoration-dotted decoration-primary/50 cursor-help hover:decoration-primary transition-colors ${className}`}
        >
          {children || term}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top" align="center">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{glossaryEntry.term}</h4>
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {glossaryEntry.definition}
          </p>
          {glossaryEntry.relatedChapters && glossaryEntry.relatedChapters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Related:</span>
              {glossaryEntry.relatedChapters.slice(0, 3).map((chapterNum) => (
                <Link key={chapterNum} to={`/chapter/${chapterNum}`}>
                  <Button variant="outline" size="sm" className="h-5 text-xs px-2">
                    Ch. {chapterNum}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
