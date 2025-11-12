import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter9 = () => {
  return (
    <ChapterLayout chapterNumber={9} title="Objective Functions">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Performance Measurement</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Objective functions quantify how well model predictions match observations. The choice of 
            performance metric significantly influences calibration results and should align with 
            modeling objectives and decision-making needs.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Observed Data] --> B[Model Predictions]
    A --> C[Objective Function]
    B --> C
    C --> D{Function Type}
    D -->|Single| E[Scalar Metric]
    D -->|Multi| F[Vector Metrics]
    E --> G[Optimization]
    F --> H[Pareto Solutions]
    G --> I[Best Parameters]
    H --> J[Trade-off Analysis]
    I --> K[Model Evaluation]
    J --> K
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Common Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Statistical Measures</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Nash-Sutcliffe efficiency</li>
                <li>• Root mean square error</li>
                <li>• Coefficient of determination</li>
                <li>• Percent bias</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Response Functions</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Peak flow accuracy</li>
                <li>• Volume conservation</li>
                <li>• Timing errors</li>
                <li>• Shape similarity</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Multi-Objective Considerations</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Different objectives may conflict (e.g., peak vs. volume accuracy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Pareto-optimal solutions represent trade-offs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Weight selection should reflect stakeholder priorities</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is model complexity?",
                options: [
                  "Always better when higher",
                  "The balance between detail and simplicity appropriate to objectives",
                  "Unimportant consideration",
                  "Should always be minimized"
                ],
                correctAnswer: 1,
                explanation: "Model complexity should be appropriate to the objectives - complex enough to answer key questions but simple enough to be understood and calibrated."
              },
              {
                question: "What is Occam's Razor in modeling?",
                options: [
                  "Always use the most complex model",
                  "Prefer simpler models when they perform equally well",
                  "Avoid all simplifications",
                  "Only use simple models"
                ],
                correctAnswer: 1,
                explanation: "Occam's Razor suggests that when multiple models perform equally well, the simpler model should be preferred for easier interpretation and fewer calibration issues."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter9;