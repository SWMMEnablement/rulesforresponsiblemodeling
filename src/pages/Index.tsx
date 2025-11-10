import { Hero } from "@/components/Hero";
import { KeyQuotes } from "@/components/KeyQuotes";
import { ModelingProcess } from "@/components/ModelingProcess";
import { Chapters } from "@/components/Chapters";
import { ConceptDiagram } from "@/components/ConceptDiagram";
import { KeyConcepts } from "@/components/KeyConcepts";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <KeyQuotes />
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
