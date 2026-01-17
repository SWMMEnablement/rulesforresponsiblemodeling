import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  chapterNumber: number;
  title: string;
  matchType: "title" | "topic" | "description";
  matchText: string;
}

const searchData = [
  { 
    number: 1, 
    title: "Introduction", 
    description: "Understanding models and their role in resolving complex problems", 
    topics: ["Model Definition", "Design Problems", "Applications"],
    keywords: ["purpose", "representation", "simulation", "prediction", "stormwater", "SWMM", "urban drainage", "modeling philosophy", "responsible modeling"]
  },
  { 
    number: 2, 
    title: "Discretization & Complexity", 
    description: "Breaking down systems into manageable spatial and temporal components", 
    topics: ["Spatial Resolution", "Temporal Resolution", "Data Management"],
    keywords: ["grid", "mesh", "time step", "subcatchments", "nodes", "links", "computational", "discretization error", "numerical stability"]
  },
  { 
    number: 3, 
    title: "Reliability of Input", 
    description: "Managing data quality, uncertainty, and file documentation", 
    topics: ["Data Categories", "GIS Concepts", "File Management"],
    keywords: ["data quality", "input data", "GIS", "geographic", "documentation", "metadata", "reliability", "data sources", "measurements"]
  },
  { 
    number: 4, 
    title: "Optimal Complexity", 
    description: "Finding the balance between detail and computational efficiency", 
    topics: ["Complexity Measures", "Data Availability", "Uncertainty"],
    keywords: ["parsimony", "Occam's razor", "over-fitting", "under-fitting", "optimal order", "model complexity", "trade-off", "simplicity"]
  },
  { 
    number: 5, 
    title: "Continuous Models", 
    description: "Long-term modeling for sustainability and ecosystem impacts", 
    topics: ["Sustainability", "Ecosystem Processes", "Ethics"],
    keywords: ["long-term", "continuous simulation", "water balance", "annual", "seasonal", "hydrologic cycle", "ecosystem", "sustainability"]
  },
  { 
    number: 6, 
    title: "Rain Input Generation", 
    description: "Stochastic and disaggregation models for rainfall patterns", 
    topics: ["Stochastic Models", "Disaggregation", "Analysis Techniques"],
    keywords: ["rainfall", "precipitation", "synthetic", "IDF curves", "design storms", "temporal distribution", "spatial distribution", "rain gauge"]
  },
  { 
    number: 7, 
    title: "Dynamic Rain Systems", 
    description: "Understanding storm cell kinematics and timing uncertainties", 
    topics: ["Storm Velocity", "Timing Error", "Sensitivity"],
    keywords: ["storm movement", "radar", "convective", "frontal", "storm tracking", "temporal", "spatial variability", "nowcasting"]
  },
  { 
    number: 8, 
    title: "Decision Support", 
    description: "Tools and systems like PCSWMM for practical implementation", 
    topics: ["PCSWMM", "Software Tools", "Integration"],
    keywords: ["DSS", "decision support", "software", "interface", "GIS integration", "visualization", "real-time", "operational"]
  },
  { 
    number: 9, 
    title: "Objective Functions", 
    description: "Measuring and evaluating model performance", 
    topics: ["Response Functions", "Multi-objective", "Statistics"],
    keywords: ["Nash-Sutcliffe", "RMSE", "R-squared", "bias", "goodness of fit", "performance metrics", "error", "residuals"]
  },
  { 
    number: 10, 
    title: "Uncertainty Analysis", 
    description: "Sources of error and methods for quantifying model reliability", 
    topics: ["Error Sources", "Analysis Methods", "Model Reliability"],
    keywords: ["Monte Carlo", "confidence intervals", "probability", "error propagation", "epistemic", "aleatory", "stochastic", "reliability"]
  },
  { 
    number: 11, 
    title: "Sensitivity Analysis", 
    description: "Testing how parameters impact model outputs", 
    topics: ["Sensitivity Gradients", "Parameter Testing", "Hydrological Models"],
    keywords: ["parameter sensitivity", "one-at-a-time", "Morris", "Sobol", "variance-based", "local", "global", "screening", "factorial"]
  },
  { 
    number: 12, 
    title: "State Variable Space", 
    description: "Mathematical representation of system states", 
    topics: ["State Variables", "Sub-spaces", "Mathematical Framework"],
    keywords: ["state space", "phase space", "dimensionality", "system dynamics", "equations", "differential", "mathematical", "representation"]
  },
  { 
    number: 13, 
    title: "Performance Evaluation", 
    description: "Comprehensive survey of evaluation functions", 
    topics: ["Evaluation Metrics", "Function Survey", "Best Practices"],
    keywords: ["validation", "verification", "calibration assessment", "model skill", "benchmarking", "comparison", "evaluation criteria"]
  },
  { 
    number: 14, 
    title: "Parameter Optimization", 
    description: "Calibration techniques including genetic algorithms", 
    topics: ["Genetic Algorithms", "Calibration", "Validation"],
    keywords: ["optimization", "automatic calibration", "GA", "SCE-UA", "PEST", "parameter estimation", "inverse modeling", "fitting"]
  },
  { 
    number: 15, 
    title: "Fuzzy Logic", 
    description: "Applying fuzzy reasoning to handle imprecision", 
    topics: ["Fuzzification", "Defuzzification", "Reasoning"],
    keywords: ["membership functions", "linguistic variables", "fuzzy sets", "fuzzy rules", "inference", "imprecision", "vagueness", "soft computing"]
  },
  { 
    number: 16, 
    title: "Real-Time Uncertainty", 
    description: "Presenting model reliability and uncertainty continuously", 
    topics: ["Parameter Uncertainty", "Error Analysis", "Real-Time Display"],
    keywords: ["real-time control", "data assimilation", "Kalman filter", "updating", "forecasting", "operational", "adaptive", "online"]
  },
  { 
    number: 17, 
    title: "Conclusions", 
    description: "Framework for continuous modeling and recommendations", 
    topics: ["Framework", "Recommendations", "Best Practices"],
    keywords: ["guidelines", "summary", "principles", "ethics", "professional practice", "future directions", "lessons learned"]
  }
];

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    searchData.forEach((chapter) => {
      // Check title
      if (chapter.title.toLowerCase().includes(searchTerm)) {
        matches.push({
          chapterNumber: chapter.number,
          title: chapter.title,
          matchType: "title",
          matchText: chapter.title
        });
      }

      // Check description
      if (chapter.description.toLowerCase().includes(searchTerm)) {
        matches.push({
          chapterNumber: chapter.number,
          title: chapter.title,
          matchType: "description",
          matchText: chapter.description
        });
      }

      // Check topics
      chapter.topics.forEach((topic) => {
        if (topic.toLowerCase().includes(searchTerm)) {
          matches.push({
            chapterNumber: chapter.number,
            title: chapter.title,
            matchType: "topic",
            matchText: topic
          });
        }
      });

      // Check keywords for comprehensive search
      chapter.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(searchTerm)) {
          // Avoid duplicate matches for same chapter
          const existingMatch = matches.find(
            m => m.chapterNumber === chapter.number && m.matchText === keyword
          );
          if (!existingMatch) {
            matches.push({
              chapterNumber: chapter.number,
              title: chapter.title,
              matchType: "topic",
              matchText: keyword
            });
          }
        }
      });
    });

    // Remove duplicate chapter entries for same match type
    const uniqueMatches = matches.filter((match, index, self) => 
      index === self.findIndex(m => 
        m.chapterNumber === match.chapterNumber && m.matchText === match.matchText
      )
    );

    return uniqueMatches;
  }, [query]);

  const handleResultClick = (chapterNumber: number) => {
    navigate(`/chapter/${chapterNumber}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="Search chapters, topics, or concepts..."
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
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={`${result.chapterNumber}-${result.matchType}-${index}`}
                onClick={() => handleResultClick(result.chapterNumber)}
                className="w-full text-left p-3 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {result.chapterNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      <span className="capitalize">{result.matchType}:</span> {result.matchText}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {isOpen && query && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg p-4">
          <p className="text-muted-foreground text-center">No results found for "{query}"</p>
        </Card>
      )}
    </div>
  );
};