import { Card } from "./ui/card";
import { MermaidDiagram } from "./MermaidDiagram";

export const FrameworkMindMap = () => {
  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Responsible Modeling Framework</h3>
        <p className="text-muted-foreground text-sm mb-6">
          This mind-map illustrates the core principles and their interconnections in Dr. James's framework.
        </p>
        <MermaidDiagram chart={`
mindmap
  root((Responsible Modeling))
    Problem Definition
      Clear objectives
      Stakeholder needs
      Data availability
      Resource constraints
    Model Selection
      Appropriate complexity
      Parsimony principle
      Physical basis
      Computational feasibility
    Data Quality
      Input reliability
      Uncertainty quantification
      GIS integration
      Documentation
    Calibration
      Objective functions
      Sensitivity analysis
      Parameter optimization
      Avoid overfitting
    Validation
      Independent data
      Split-sample testing
      Performance metrics
      Uncertainty bounds
    Communication
      Transparency
      Uncertainty display
      Stakeholder engagement
      Ethical responsibility
        `} />
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Modeling Process Timeline</h3>
        <p className="text-muted-foreground text-sm mb-6">
          The evolution of a modeling project from conception to application.
        </p>
        <MermaidDiagram chart={`
timeline
    title Model Development Lifecycle
    section Planning
        Problem Definition : Identify objectives
                           : Assess data needs
                           : Define success criteria
    section Development
        Conceptualization : Select model structure
                         : Define parameters
                         : Set discretization
    section Calibration
        Data Preparation : Quality control
                        : Gap filling
                        : Uncertainty estimation
        Parameter Fitting : Sensitivity analysis
                         : Optimization
                         : Manual adjustment
    section Validation
        Testing : Independent data
               : Performance metrics
               : Uncertainty analysis
    section Application
        Deployment : Scenario analysis
                   : Decision support
                   : Documentation
        `} />
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Optimal Complexity Trade-offs</h3>
        <p className="text-muted-foreground text-sm mb-6">
          Balancing model complexity against data requirements and uncertainty.
        </p>
        <MermaidDiagram chart={`
quadrantChart
    title Model Complexity Decision Space
    x-axis Low Data Availability --> High Data Availability
    y-axis Simple Model --> Complex Model
    quadrant-1 Overparameterized Risk
    quadrant-2 Optimal Zone
    quadrant-3 Underperformance Risk
    quadrant-4 Data-Limited Zone
    Lumped model: [0.25, 0.2]
    Distributed model: [0.7, 0.75]
    Neural network: [0.85, 0.9]
    Empirical equation: [0.15, 0.1]
    Optimal complexity: [0.6, 0.5]
        `} />
      </Card>
    </div>
  );
};
