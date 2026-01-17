import { Hero } from "@/components/Hero";
import { KeyQuotes } from "@/components/KeyQuotes";
import { ModelingProcess } from "@/components/ModelingProcess";
import { Chapters } from "@/components/Chapters";
import { ConceptDiagram } from "@/components/ConceptDiagram";
import { KeyConcepts } from "@/components/KeyConcepts";
import { Timeline } from "@/components/Timeline";
import { SearchBar } from "@/components/SearchBar";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ReadingPathways } from "@/components/ReadingPathways";
import { PersonalIntroduction } from "@/components/PersonalIntroduction";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useNotes } from "@/hooks/useNotes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bookmark, StickyNote, Compass } from "lucide-react";

const Index = () => {
  const { bookmarks } = useBookmarks();
  const { notes } = useNotes();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      <PersonalIntroduction />
      
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
      
      {/* Reading Pathways Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Compass className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Learning Pathways</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Choose a guided reading path based on your experience level and learning goals.
          </p>
          <ReadingPathways compact />
          <div className="mt-6 text-center">
            <Link to="/study-guide">
              <Button variant="outline" size="lg">
                View All Pathways & Study Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <KeyQuotes />
      <Timeline />
      <ModelingProcess />
      <ConceptDiagram />
      <KeyConcepts />
      <Chapters />
      
      <Footer />
    </div>
  );
};

export default Index;
