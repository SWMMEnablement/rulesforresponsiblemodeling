import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, BookOpen, Quote, FileText, HelpCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { glossaryTerms } from "@/data/glossaryData";
import { keyQuotesFlashcardData } from "@/data/keyQuotesFlashcardData";

interface SearchResult {
  type: "chapter" | "glossary" | "quote" | "page";
  title: string;
  description: string;
  matchText: string;
  path: string;
  chapter?: number;
}

const chapterData = [
  { number: 1, title: "Introduction", description: "Understanding models and their role in resolving complex problems", topics: ["Model Definition", "Design Problems", "Applications", "purpose", "representation", "simulation", "prediction", "stormwater", "SWMM", "urban drainage"] },
  { number: 2, title: "Discretization & Complexity", description: "Breaking down systems into manageable spatial and temporal components", topics: ["Spatial Resolution", "Temporal Resolution", "Data Management", "grid", "mesh", "time step", "subcatchments", "nodes", "links"] },
  { number: 3, title: "Reliability of Input", description: "Managing data quality, uncertainty, and file documentation", topics: ["Data Categories", "GIS Concepts", "File Management", "data quality", "input data", "GIS", "geographic", "documentation"] },
  { number: 4, title: "Optimal Complexity", description: "Finding the balance between detail and computational efficiency", topics: ["Complexity Measures", "Data Availability", "Uncertainty", "parsimony", "Occam's razor", "over-fitting", "optimal order"] },
  { number: 5, title: "Continuous Models", description: "Long-term modeling for sustainability and ecosystem impacts", topics: ["Sustainability", "Ecosystem Processes", "Ethics", "continuous simulation", "water balance", "annual", "seasonal"] },
  { number: 6, title: "Rain Input Generation", description: "Stochastic and disaggregation models for rainfall patterns", topics: ["Stochastic Models", "Disaggregation", "Analysis Techniques", "rainfall", "precipitation", "IDF curves", "design storms"] },
  { number: 7, title: "Dynamic Rain Systems", description: "Understanding storm cell kinematics and timing uncertainties", topics: ["Storm Velocity", "Timing Error", "Sensitivity", "storm movement", "radar", "convective", "spatial variability"] },
  { number: 8, title: "Decision Support", description: "Tools and systems like PCSWMM for practical implementation", topics: ["PCSWMM", "Software Tools", "Integration", "DSS", "decision support", "software", "GIS integration"] },
  { number: 9, title: "Objective Functions", description: "Measuring and evaluating model performance", topics: ["Response Functions", "Multi-objective", "Statistics", "Nash-Sutcliffe", "RMSE", "R-squared", "goodness of fit"] },
  { number: 10, title: "Uncertainty Analysis", description: "Sources of error and methods for quantifying model reliability", topics: ["Error Sources", "Analysis Methods", "Model Reliability", "Monte Carlo", "confidence intervals", "probability"] },
  { number: 11, title: "Sensitivity Analysis", description: "Testing how parameters impact model outputs", topics: ["Sensitivity Gradients", "Parameter Testing", "Hydrological Models", "Morris", "Sobol", "variance-based"] },
  { number: 12, title: "State Variable Space", description: "Mathematical representation of system states", topics: ["State Variables", "Sub-spaces", "Mathematical Framework", "state space", "phase space", "dimensionality"] },
  { number: 13, title: "Performance Evaluation", description: "Comprehensive survey of evaluation functions", topics: ["Evaluation Metrics", "Function Survey", "Best Practices", "validation", "verification", "calibration assessment"] },
  { number: 14, title: "Parameter Optimization", description: "Calibration techniques including genetic algorithms", topics: ["Genetic Algorithms", "Calibration", "Validation", "optimization", "automatic calibration", "GA", "SCE-UA"] },
  { number: 15, title: "Fuzzy Logic", description: "Applying fuzzy reasoning to handle imprecision", topics: ["Fuzzification", "Defuzzification", "Reasoning", "membership functions", "linguistic variables", "fuzzy sets"] },
  { number: 16, title: "Real-Time Uncertainty", description: "Presenting model reliability and uncertainty continuously", topics: ["Parameter Uncertainty", "Error Analysis", "Real-Time Display", "Kalman filter", "forecasting"] },
  { number: 17, title: "Conclusions", description: "Framework for continuous modeling and recommendations", topics: ["Framework", "Recommendations", "Best Practices", "guidelines", "summary", "principles"] },
];

const pageData = [
  { title: "Study Guide", description: "Learning objectives, exercises, and flashcards for each chapter", path: "/study-guide", keywords: ["study", "learn", "exercises", "flashcards", "quiz", "practice"] },
  { title: "Resources", description: "Software links, abbreviations database, and Ruby scripts", path: "/resources", keywords: ["software", "tools", "abbreviations", "scripts", "ruby", "links"] },
  { title: "Glossary", description: "Definitions of key modeling terms and concepts", path: "/glossary", keywords: ["definitions", "terms", "vocabulary", "concepts"] },
  { title: "Key Quotes", description: "Important quotes from each chapter", path: "/key-quotes", keywords: ["quotes", "wisdom", "insights", "key points"] },
  { title: "About the Author", description: "Information about Dr. William James", path: "/about-author", keywords: ["author", "william james", "biography", "background"] },
];

export const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search chapters
    chapterData.forEach((chapter) => {
      const titleMatch = chapter.title.toLowerCase().includes(searchTerm);
      const descMatch = chapter.description.toLowerCase().includes(searchTerm);
      const topicMatch = chapter.topics.some(t => t.toLowerCase().includes(searchTerm));

      if (titleMatch || descMatch || topicMatch) {
        const matchText = titleMatch 
          ? chapter.title 
          : descMatch 
            ? chapter.description 
            : chapter.topics.find(t => t.toLowerCase().includes(searchTerm)) || "";
        
        matches.push({
          type: "chapter",
          title: `Chapter ${chapter.number}: ${chapter.title}`,
          description: chapter.description,
          matchText,
          path: `/chapter/${chapter.number}`,
          chapter: chapter.number,
        });
      }
    });

    // Search glossary
    glossaryTerms.forEach((term) => {
      if (term.term.toLowerCase().includes(searchTerm) || 
          term.definition.toLowerCase().includes(searchTerm)) {
        matches.push({
          type: "glossary",
          title: term.term,
          description: term.definition.slice(0, 100) + "...",
          matchText: term.term.toLowerCase().includes(searchTerm) ? term.term : "Definition match",
          path: `/glossary#${term.term.toLowerCase().replace(/\s+/g, '-')}`,
        });
      }
    });

    // Search key quotes
    keyQuotesFlashcardData.forEach((quote) => {
      if (quote.term.toLowerCase().includes(searchTerm) || 
          quote.definition.toLowerCase().includes(searchTerm)) {
        matches.push({
          type: "quote",
          title: quote.term,
          description: quote.definition.slice(0, 100) + "...",
          matchText: quote.definition.slice(0, 50) + "...",
          path: `/chapter/${quote.chapter}`,
          chapter: quote.chapter,
        });
      }
    });

    // Search pages
    pageData.forEach((page) => {
      if (page.title.toLowerCase().includes(searchTerm) || 
          page.description.toLowerCase().includes(searchTerm) ||
          page.keywords.some(k => k.toLowerCase().includes(searchTerm))) {
        matches.push({
          type: "page",
          title: page.title,
          description: page.description,
          matchText: page.title,
          path: page.path,
        });
      }
    });

    return matches.slice(0, 15);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery("");
    setIsOpen(false);
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "chapter": return <BookOpen className="h-4 w-4" />;
      case "glossary": return <HelpCircle className="h-4 w-4" />;
      case "quote": return <Quote className="h-4 w-4" />;
      case "page": return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: SearchResult["type"]) => {
    switch (type) {
      case "chapter": return <Badge variant="default" className="text-xs">Chapter</Badge>;
      case "glossary": return <Badge variant="secondary" className="text-xs">Glossary</Badge>;
      case "quote": return <Badge variant="outline" className="text-xs">Quote</Badge>;
      case "page": return <Badge className="text-xs bg-accent">Page</Badge>;
    }
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-primary/20 dark:bg-primary/30 px-0.5 rounded">{part}</mark> : part
    );
  };


  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search chapters, glossary, quotes, resources..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 py-6 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-xl overflow-hidden">
          <ScrollArea className="max-h-96">
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.path}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground truncate">
                          {highlightMatch(result.title, query)}
                        </span>
                        {getTypeBadge(result.type)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {highlightMatch(result.description, query)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg p-4">
          <p className="text-muted-foreground text-center">No results found for "{query}"</p>
        </Card>
      )}
    </div>
  );
};
