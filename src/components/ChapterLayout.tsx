import { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BookmarkButton } from "./BookmarkButton";
import { ChapterNotes } from "./ChapterNotes";

interface ChapterLayoutProps {
  chapterNumber: number;
  title: string;
  children: ReactNode;
}

export const ChapterLayout = ({ chapterNumber, title, children }: ChapterLayoutProps) => {
  const prevChapter = chapterNumber > 1 ? chapterNumber - 1 : null;
  const nextChapter = chapterNumber < 17 ? chapterNumber + 1 : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <BookmarkButton chapterNumber={chapterNumber} title={title} />
            <div className="text-sm text-muted-foreground">
              Chapter {chapterNumber} of 17
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Hero */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-sm font-medium text-primary mb-2">
            Chapter {chapterNumber}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {children}
          
          {/* Personal Notes Section */}
          <section>
            <ChapterNotes chapterNumber={chapterNumber} />
          </section>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <Link to={`/chapter/${prevChapter}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Chapter {prevChapter}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link to={`/chapter/${nextChapter}`}>
                <Button variant="outline">
                  Chapter {nextChapter}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
