import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { glossaryTerms, GlossaryTerm } from "@/data/glossaryData";

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return glossaryTerms;
    
    const search = searchTerm.toLowerCase();
    return glossaryTerms.filter(
      item => 
        item.term.toLowerCase().includes(search) || 
        item.definition.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary-light to-secondary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Modeling Glossary
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive definitions of key terminology used throughout the Rules for Responsible Modeling textbook.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Search Bar */}
        <div className="mb-12">
          <Card className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
            </p>
          </Card>
        </div>

        {/* Quick Jump Navigation */}
        {letters.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <Button
                key={letter}
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.getElementById(`letter-${letter}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {letter}
              </Button>
            ))}
          </div>
        )}

        {/* Terms by Letter */}
        {filteredTerms.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No terms found matching "{searchTerm}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-12">
            {letters.map(letter => (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-8">
                <h2 className="text-3xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary/20">
                  {letter}
                </h2>
                <div className="space-y-6">
                  {groupedTerms[letter].map(item => (
                    <Card key={item.term} className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {item.term}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {item.definition}
                      </p>
                      {item.relatedChapters && item.relatedChapters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-sm text-muted-foreground">Related chapters:</span>
                          {item.relatedChapters.map(chapterNum => (
                            <Link key={chapterNum} to={`/chapter/${chapterNum}`}>
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                Chapter {chapterNum}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-16 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Return to Book Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-6 mt-16 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Glossary terms compiled from <em>Rules for Responsible Modeling</em> by William James (4th Edition, 2005)
            <br />
            Published by CHI (Computational Hydraulics International)
          </p>
        </div>
      </footer>
      </div>
      <Footer />
    </>
  );
};

export default Glossary;
