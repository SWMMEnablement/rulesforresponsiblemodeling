import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter13 = () => {
  return (
    <ChapterLayout chapterNumber={13} title="Performance Evaluation">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Evaluation Survey</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This chapter presents a comprehensive survey of performance evaluation functions used in 
            hydrological modeling. Understanding the strengths and limitations of different metrics 
            is essential for robust model assessment.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Evaluation Need] --&gt; B{Metric Category}
    B --&gt;|Goodness of Fit| C[NSE, R²]
    B --&gt;|Error Based| D[RMSE, MAE]
    B --&gt;|Relative| E[Percent Bias]
    B --&gt;|Custom| F[Domain Specific]
    C --&gt; G[Performance Assessment]
    D --&gt; G
    E --&gt; G
    F --&gt; G
    G --&gt; H{Adequate?}
    H --&gt;|No| I[Model Revision]
    H --&gt;|Yes| J[Model Acceptance]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style H fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Evaluation Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Absolute Metrics</h3>
              <p className="text-muted-foreground text-sm">RMSE, MAE, mean error - dimensional measures</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Relative Metrics</h3>
              <p className="text-muted-foreground text-sm">NSE, R², normalized statistics - dimensionless</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Visual Assessment</h3>
              <p className="text-muted-foreground text-sm">Hydrograph comparison, residual plots</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Use multiple complementary metrics for comprehensive assessment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Consider metric sensitivity to outliers and bias</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Align metrics with modeling objectives and decision context</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is optimization in modeling?",
                options: [
                  "Making models faster",
                  "Finding the best solution given objectives and constraints",
                  "Removing all parameters",
                  "Simplifying equations"
                ],
                correctAnswer: 1,
                explanation: "Optimization is the process of finding the best solution to a problem given defined objectives and constraints, such as minimizing cost or maximizing performance."
              },
              {
                question: "What is a constraint in optimization?",
                options: [
                  "A limitation or requirement that must be satisfied",
                  "An error in the model",
                  "An objective function",
                  "A data source"
                ],
                correctAnswer: 0,
                explanation: "A constraint is a limitation or requirement that feasible solutions must satisfy, such as capacity limits, budget restrictions, or regulatory requirements."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter13;