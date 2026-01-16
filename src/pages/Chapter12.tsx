import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const Chapter12 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={12} title="State Variable Space">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Mathematical Framework</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            State variable space provides a rigorous mathematical framework for representing system 
            dynamics. This approach enables systematic analysis of model behavior, parameter interactions, 
            and optimal control strategies.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[State Variables] --> B[State Space]
    B --> C[System Dynamics]
    C --> D[Differential Equations]
    D --> E[Numerical Solution]
    E --> F{Analysis Type}
    F -->|Stability| G[Equilibrium Points]
    F -->|Control| H[Optimal Trajectory]
    F -->|Sensitivity| I[Perturbation]
    G --> J[System Understanding]
    H --> J
    I --> J
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Concepts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">State Variables</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Storage volumes</li>
                <li>• Flow rates</li>
                <li>• Water quality parameters</li>
                <li>• System conditions</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Sub-spaces</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Feasible region</li>
                <li>• Constraint boundaries</li>
                <li>• Objective contours</li>
                <li>• Optimal solutions</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Real-time control system design</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>System stability analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Optimization problem formulation</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is state variable space?",
                options: [
                  "Physical storage location",
                  "Mathematical framework for representing system dynamics",
                  "Computer memory",
                  "Data storage system"
                ],
                correctAnswer: 1,
                explanation: "State variable space is a mathematical framework that represents system dynamics using state variables and their relationships in a multidimensional space."
              },
              {
                question: "What are state variables?",
                options: [
                  "Geographic locations",
                  "Variables that describe the current condition of a system",
                  "Government regulations",
                  "Software settings"
                ],
                correctAnswer: 1,
                explanation: "State variables are quantities that describe the current condition or status of a system, such as storage volumes, flow rates, or concentrations."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter12;