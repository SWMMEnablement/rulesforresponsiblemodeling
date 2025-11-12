import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FlashcardProps {
  term: string;
  definition: string;
  chapter?: number;
}

export const Flashcard = ({ term, definition, chapter }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full h-64">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">{term}</h3>
            {chapter && (
              <p className="text-sm text-muted-foreground">Chapter {chapter}</p>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Click to reveal definition
            </p>
          </div>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/5 to-primary/5 border-2 border-secondary/20">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-primary">{term}</p>
            <p className="text-base text-foreground leading-relaxed">{definition}</p>
            {chapter && (
              <p className="text-xs text-muted-foreground">Chapter {chapter}</p>
            )}
          </div>
        </Card>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 mx-auto flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          setIsFlipped(!isFlipped);
        }}
      >
        <RotateCcw className="h-4 w-4" />
        Flip Card
      </Button>
    </div>
  );
};