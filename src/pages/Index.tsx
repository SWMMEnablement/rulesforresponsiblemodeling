import { Hero } from "@/components/Hero";
import { KeyQuotes } from "@/components/KeyQuotes";
import { ModelingProcess } from "@/components/ModelingProcess";
import { Chapters } from "@/components/Chapters";
import { ConceptDiagram } from "@/components/ConceptDiagram";
import { KeyConcepts } from "@/components/KeyConcepts";
import { FrameworkMap } from "@/components/FrameworkMap";
import { Timeline } from "@/components/Timeline";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ReadingPathways } from "@/components/ReadingPathways";
import { PersonalIntroduction } from "@/components/PersonalIntroduction";
import { FrameworkDiagnostic } from "@/components/FrameworkDiagnostic";
import { ChecklistGenerator } from "@/components/ChecklistGenerator";
import { ProjectTemplates } from "@/components/ProjectTemplates";
import { CaseVignettes } from "@/components/CaseVignettes";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useNotes } from "@/hooks/useNotes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bookmark, StickyNote, Compass, MessageSquareQuote } from "lucide-react";

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
          <GlobalSearch />
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
      
      {/* Framework Diagnostic Tool */}
      <section id="diagnostic-tool" className="py-16 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <FrameworkDiagnostic />
        </div>
      </section>
      
      {/* Case Vignettes - Rules in Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquareQuote className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Rules in Action</h2>
                <p className="text-sm text-muted-foreground">Real stories from the modeling community</p>
              </div>
            </div>
            <Link to="/case-vignettes">
              <Button variant="outline" size="sm">
                View All Stories
              </Button>
            </Link>
          </div>
          <CaseVignettes compact />
        </div>
      </section>
      
      <Timeline />
      <ModelingProcess />
      
      {/* Checklist Generator */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ChecklistGenerator />
        </div>
      </section>
      
      <ProjectTemplates />
      
      <FrameworkMap />
      <ConceptDiagram />
      <KeyConcepts />
      <Chapters />
      
      <Footer />
    </div>
  );
};

export default Index;
