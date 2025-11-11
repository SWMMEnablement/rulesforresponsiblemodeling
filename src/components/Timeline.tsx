import { useEffect, useRef } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: "concept" | "methodology" | "technology";
}

export const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const events: TimelineEvent[] = [
    {
      year: "1960s-70s",
      title: "Early Hydrological Models",
      description: "Introduction of deterministic rainfall-runoff models and the foundation of computational hydraulics",
      category: "methodology"
    },
    {
      year: "1980s",
      title: "Spatial Discretization",
      description: "Development of GIS integration and spatial analysis methods for watershed modeling",
      category: "concept"
    },
    {
      year: "1990s",
      title: "Uncertainty Analysis",
      description: "Recognition of parameter uncertainty and development of Monte Carlo methods",
      category: "methodology"
    },
    {
      year: "Mid-1990s",
      title: "Genetic Algorithms",
      description: "Application of evolutionary optimization for parameter calibration",
      category: "technology"
    },
    {
      year: "Late 1990s",
      title: "Real-Time Modeling",
      description: "Emergence of continuous simulation and real-time forecasting systems",
      category: "methodology"
    },
    {
      year: "Early 2000s",
      title: "Multi-Objective Optimization",
      description: "Development of Pareto-based approaches for competing objectives",
      category: "concept"
    },
    {
      year: "2000s",
      title: "Fuzzy Logic Integration",
      description: "Application of fuzzy set theory to handle imprecision in hydrological parameters",
      category: "technology"
    },
    {
      year: "Present",
      title: "Integrated Frameworks",
      description: "Comprehensive decision support systems with uncertainty quantification",
      category: "methodology"
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
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}>
                      {getCategoryLabel(event.category)}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {event.description}
                    </p>
                    <div className="text-sm font-semibold text-primary">
                      {event.year}
                    </div>
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
