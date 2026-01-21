import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: "concept" | "methodology" | "technology";
  details: string;
  examples: string[];
  relatedChapters: number[];
}

export const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const events: TimelineEvent[] = [
    {
      year: "1960s-70s",
      title: "Early Hydrological Models",
      description: "Introduction of deterministic rainfall-runoff models and the foundation of computational hydraulics",
      category: "methodology",
      details: "The Stanford Watershed Model (1966) and early versions of HEC models established the paradigm of conceptual rainfall-runoff modeling. These models divided watersheds into storages and used continuity equations.",
      examples: ["Stanford Watershed Model IV", "HEC-1 Flood Hydrograph Package", "ILLUDAS for urban drainage"],
      relatedChapters: [1, 2]
    },
    {
      year: "1980s",
      title: "Spatial Discretization",
      description: "Development of GIS integration and spatial analysis methods for watershed modeling",
      category: "concept",
      details: "Geographic Information Systems revolutionized how modelers represented spatial variability. Grid-based and subcatchment-based discretization became standard practice.",
      examples: ["Digital Elevation Model analysis", "Thiessen polygon rainfall", "Land use classification"],
      relatedChapters: [2, 3]
    },
    {
      year: "1990s",
      title: "Uncertainty Analysis",
      description: "Recognition of parameter uncertainty and development of Monte Carlo methods",
      category: "methodology",
      details: "Researchers recognized that single 'best' parameter sets were misleading. Monte Carlo simulation and GLUE methodology emerged to quantify parameter uncertainty.",
      examples: ["Monte Carlo simulation", "GLUE methodology", "Confidence interval estimation"],
      relatedChapters: [10, 16]
    },
    {
      year: "Mid-1990s",
      title: "Genetic Algorithms",
      description: "Application of evolutionary optimization for parameter calibration",
      category: "technology",
      details: "Evolutionary algorithms offered robust global optimization, avoiding local minima that plagued gradient-based methods. Population-based search became standard for complex calibration.",
      examples: ["SCE-UA algorithm", "NSGA-II for multi-objective", "Differential Evolution"],
      relatedChapters: [14]
    },
    {
      year: "Late 1990s",
      title: "Real-Time Modeling",
      description: "Emergence of continuous simulation and real-time forecasting systems",
      category: "methodology",
      details: "Continuous simulation revealed the importance of antecedent conditions. Real-time systems with data assimilation improved operational forecasting.",
      examples: ["Kalman filtering", "Data assimilation", "Operational flood warning systems"],
      relatedChapters: [5, 16]
    },
    {
      year: "Early 2000s",
      title: "Multi-Objective Optimization",
      description: "Development of Pareto-based approaches for competing objectives",
      category: "concept",
      details: "Single objective functions couldn't capture all aspects of model performance. Pareto optimization revealed trade-offs and supported informed decision-making.",
      examples: ["Pareto frontier analysis", "Trade-off curves", "Multiple performance criteria"],
      relatedChapters: [9, 12]
    },
    {
      year: "2000s",
      title: "Fuzzy Logic Integration",
      description: "Application of fuzzy set theory to handle imprecision in hydrological parameters",
      category: "technology",
      details: "Fuzzy logic bridged the gap between expert knowledge and mathematical models, allowing linguistic rules and gradual membership in categories.",
      examples: ["Fuzzy reservoir operation", "Linguistic variable encoding", "Fuzzy inference systems"],
      relatedChapters: [15]
    },
    {
      year: "Present",
      title: "Integrated Frameworks",
      description: "Comprehensive decision support systems with uncertainty quantification",
      category: "methodology",
      details: "Modern frameworks integrate data management, modeling, uncertainty analysis, and visualization into coherent workflows supporting the entire decision-making process.",
      examples: ["PCSWMM decision support", "Ensemble forecasting", "Integrated water resources management"],
      relatedChapters: [8, 17]
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = timelineRef.current?.querySelectorAll(".timeline-item");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "concept":
        return "from-primary to-primary-light";
      case "methodology":
        return "from-secondary to-secondary-light";
      case "technology":
        return "from-accent to-primary";
      default:
        return "from-primary to-primary-light";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "concept":
        return "Concept";
      case "methodology":
        return "Methodology";
      case "technology":
        return "Technology";
      default:
        return "Other";
    }
  };

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Evolution of Modeling Concepts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A journey through the development of responsible hydrological modeling
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transform md:-translate-x-1/2" />

          {/* Timeline events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={index}
                className={`timeline-item opacity-0 relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
              {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                  <div 
                    className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                        {getCategoryLabel(event.category)}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="p-1 rounded-full hover:bg-muted transition-colors">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-sm">{event.details}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {event.description}
                    </p>
                    <div className="text-sm font-semibold text-primary mb-2">
                      {event.year}
                    </div>
                    
                    {/* Expanded details */}
                    {expandedIndex === index && (
                      <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                        <div className={`space-y-3 ${index % 2 === 0 ? "md:text-left" : ""}`}>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-1">Key Examples:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {event.examples.map((ex, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  {ex}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {event.relatedChapters.map((ch) => (
                              <Link
                                key={ch}
                                to={`/chapter/${ch}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                              >
                                Chapter {ch}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getCategoryColor(event.category)} ring-4 ring-background`} />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
