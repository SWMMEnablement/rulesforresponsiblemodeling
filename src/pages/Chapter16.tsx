import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter16 = () => {
  return (
    <ChapterLayout chapterNumber={16} title="Real-Time Uncertainty">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Continuous Reliability Assessment</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Real-time systems must present model uncertainty alongside predictions. This chapter addresses 
            methods for continuously updating uncertainty bounds, displaying confidence intervals, and 
            communicating reliability to decision-makers during live operations.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Real-Time Data] --> B[Model Update]
    B --> C[Prediction]
    B --> D[Uncertainty Estimation]
    C --> E[Central Forecast]
    D --> F[Confidence Bounds]
    E --> G[Visualization]
    F --> G
    G --> H[Decision Support]
    H --> I{Action Needed?}
    I -->|Yes| J[Implement Response]
    I -->|Monitor| A
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Uncertainty Sources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Parameter Uncertainty</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Calibration errors</li>
                <li>• Temporal parameter variation</li>
                <li>• Measurement noise</li>
                <li>• Model structural error</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Input Uncertainty</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Rainfall forecast errors</li>
                <li>• Sensor accuracy</li>
                <li>• Spatial interpolation</li>
                <li>• Boundary conditions</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Display Strategies</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Ensemble forecasts showing range of possible outcomes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Confidence intervals with probability levels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Risk-based decision thresholds incorporating uncertainty</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is risk analysis?",
                options: [
                  "Ignoring potential problems",
                  "Systematic evaluation of potential adverse outcomes",
                  "Assuming worst-case always",
                  "Avoiding uncertainty"
                ],
                correctAnswer: 1,
                explanation: "Risk analysis systematically evaluates potential adverse outcomes, their likelihood, and their consequences to support informed decision-making."
              },
              {
                question: "What does risk characterization involve?",
                options: [
                  "Only identifying risks",
                  "Estimating both probability and consequence of risks",
                  "Eliminating all risks",
                  "Accepting all risks"
                ],
                correctAnswer: 1,
                explanation: "Risk characterization involves estimating both the probability of adverse events and the magnitude of their potential consequences to fully understand risks."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter16;