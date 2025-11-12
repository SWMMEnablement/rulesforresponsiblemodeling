import { Hero } from "@/components/Hero";
import { KeyQuotes } from "@/components/KeyQuotes";
import { ModelingProcess } from "@/components/ModelingProcess";
import { Chapters } from "@/components/Chapters";
import { ConceptDiagram } from "@/components/ConceptDiagram";
import { KeyConcepts } from "@/components/KeyConcepts";
import { Timeline } from "@/components/Timeline";
import { SearchBar } from "@/components/SearchBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      {/* Search Section */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
            Find What You're Looking For
          </h2>
          <SearchBar />
        </div>
      </section>
      
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
            Rules for Responsible Modeling, 4th Edition
          </p>
          <p className="text-sm text-muted-foreground">
            Published by CHI (Computational Hydraulics International) • ISBN 0-9683681-5-8
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © 2005 CHI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
