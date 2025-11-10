import { Circle } from "lucide-react";

export const ModelingProcess = () => {
  const steps = [
    {
      title: "Define Problem",
      description: "Identify complexity and system requirements",
      color: "primary"
    },
    {
      title: "Discretization",
      description: "Break down spatial and temporal resolution",
      color: "primary-light"
    },
    {
      title: "Data Collection",
      description: "Gather reliable input parameters",
      color: "secondary"
    },
    {
      title: "Model Building",
      description: "Optimal complexity and structure",
      color: "secondary-light"
    },
    {
      title: "Calibration",
      description: "Parameter optimization and validation",
      color: "primary"
    },
    {
      title: "Analysis",
      description: "Uncertainty and sensitivity evaluation",
      color: "primary-light"
    },
    {
      title: "Results",
      description: "Reliable predictions with confidence",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          The Modeling Process
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          A structured approach to responsible and reliable modeling
        </p>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary hidden md:block opacity-20" />
          
          <div className="grid md:grid-cols-7 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${
                  step.color === 'primary' ? 'from-primary to-primary-light' :
                  step.color === 'primary-light' ? 'from-primary-light to-primary' :
                  step.color === 'secondary' ? 'from-secondary to-secondary-light' :
                  'from-secondary-light to-secondary'
                } flex items-center justify-center mb-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:scale-110`}>
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
