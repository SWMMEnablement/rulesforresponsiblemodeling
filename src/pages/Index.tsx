import { Hero } from "@/components/Hero";
import { KeyQuotes } from "@/components/KeyQuotes";
import { ModelingProcess } from "@/components/ModelingProcess";
import { Chapters } from "@/components/Chapters";
import { ConceptDiagram } from "@/components/ConceptDiagram";
import { KeyConcepts } from "@/components/KeyConcepts";
import { Timeline } from "@/components/Timeline";
import { SearchBar } from "@/components/SearchBar";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useNotes } from "@/hooks/useNotes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bookmark, StickyNote } from "lucide-react";

const Index = () => {
  const { bookmarks } = useBookmarks();
  const { notes } = useNotes();
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Search Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Find What You're Looking For
            </h2>
            {notes.length > 0 && (
              <Link to="/notes">
                <Button variant="outline" className="gap-2">
                  <StickyNote className="w-4 h-4" />
                  View All Notes ({notes.length})
                </Button>
              </Link>
            )}
          </div>
          <SearchBar />
        </div>
      </section>
      
      {/* Bookmarked Chapters */}
      {bookmarks.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Bookmark className="w-6 h-6 text-primary fill-primary" />
              <h2 className="text-3xl font-bold text-foreground">Your Bookmarks</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((bookmark) => (
                  <Link key={bookmark.chapterNumber} to={`/chapter/${bookmark.chapterNumber}`}>
                    <Card className="p-6 hover:shadow-[var(--shadow-hover)] transition-all border-l-4 border-l-primary">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-primary">
                          Chapter {bookmark.chapterNumber}
                        </span>
                        <Bookmark className="w-4 h-4 text-primary fill-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{bookmark.title}</h3>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
      
      <KeyQuotes />
      <Timeline />
      <ModelingProcess />
      <ConceptDiagram />
      <KeyConcepts />
      <Chapters />
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-2">
            Rules for Responsible Modeling by <Link to="/about-author" className="text-primary hover:underline font-medium">William James</Link>, 4th Edition
          </p>
          <p className="text-sm text-muted-foreground">
            Published by CHI (Computational Hydraulics International) • ISBN 0-9683681-5-8
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-3">
            <Link to="/study-guide" className="text-sm text-primary hover:underline">
              Study Guide
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/resources" className="text-sm text-primary hover:underline">
              Resources
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/glossary" className="text-sm text-primary hover:underline">
              Glossary
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            © 2005 CHI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
