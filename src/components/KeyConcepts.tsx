import { CheckCircle2 } from "lucide-react";

export const KeyConcepts = () => {
  const concepts = [
    {
      title: "Optimal Complexity",
      description: "Balance between model detail and computational efficiency - making things as simple as possible, but not simpler"
    },
    {
      title: "Uncertainty Quantification",
      description: "Understanding and communicating the reliability and confidence levels of model predictions"
    },
    {
      title: "Data Reliability",
      description: "Ensuring input parameters and datasets are well-documented, validated, and appropriately categorized"
    },
    {
      title: "Parameter Optimization",
      description: "Using advanced techniques like genetic algorithms to calibrate models for accurate predictions"
    },
    {
      title: "Sensitivity Analysis",
      description: "Testing how changes in parameters affect model outputs to understand system behavior"
    },
    {
      title: "Continuous Simulation",
      description: "Long-term modeling approach for understanding ecosystem impacts and sustainability"
    },
    {
      title: "Fuzzy Logic Application",
      description: "Handling imprecision and uncertainty through fuzzy reasoning techniques"
    },
    {
      title: "Performance Evaluation",
      description: "Comprehensive metrics and functions to assess model quality and reliability"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Core Concepts
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Fundamental principles for responsible and ethical modeling practices
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {concepts.map((concept, index) => (
            <div
              key={index}
              className="group flex gap-4 p-6 rounded-xl bg-card border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {concept.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {concept.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
