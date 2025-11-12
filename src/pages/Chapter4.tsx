import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter4 = () => {
  return (
    <ChapterLayout chapterNumber={4} title="Optimal Complexity">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Finding the Right Balance</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Model complexity should match the problem at hand, available data, and computational resources. 
            Too simple, and critical processes are missed. Too complex, and the model becomes unreliable 
            due to parameter uncertainty and overfitting.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Problem Definition] --&gt; B{Assess Factors}
    B --&gt; C[Data Availability]
    B --&gt; D[Computational Resources]
    B --&gt; E[Uncertainty Budget]
    C --&gt; F[Complexity Selection]
    D --&gt; F
    E --&gt; F
    F --&gt; G{Appropriate Level?}
    G --&gt;|Too Simple| H[Increase Detail]
    G --&gt;|Too Complex| I[Simplify Model]
    G --&gt;|Optimal| J[Implement & Test]
    H --&gt; F
    I --&gt; F
    J --&gt; K[Validate Performance]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Complexity Measures</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Structural Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Number of model parameters</li>
                <li>• Process representation detail</li>
                <li>• Spatial and temporal resolution</li>
                <li>• Interaction between components</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Uncertainty Impact</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Parameter identifiability</li>
                <li>• Model equifinality issues</li>
                <li>• Prediction confidence bounds</li>
                <li>• Data requirement scaling</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Parsimony Principle</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Use the simplest model that adequately represents the system</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Additional parameters must be justified by improved performance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Consider diminishing returns of increasing complexity</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the purpose of sensitivity analysis?",
                options: [
                  "To make models more complex",
                  "To identify which parameters most influence model outputs",
                  "To eliminate all uncertainty",
                  "To avoid validation"
                ],
                correctAnswer: 1,
                explanation: "Sensitivity analysis identifies which parameters have the greatest influence on model outputs, helping prioritize data collection and understand model behavior."
              },
              {
                question: "What does a high sensitivity indicate?",
                options: [
                  "The parameter has little effect on outputs",
                  "The model is incorrect",
                  "Small changes in the parameter cause large changes in outputs",
                  "The parameter should be ignored"
                ],
                correctAnswer: 2,
                explanation: "High sensitivity means small changes in a parameter lead to large changes in model outputs, indicating the parameter is critical and requires careful estimation."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter4;