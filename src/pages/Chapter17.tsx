import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter17 = () => {
  return (
    <ChapterLayout chapterNumber={17} title="Conclusions">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Framework for Responsible Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This concluding chapter synthesizes key principles into a comprehensive framework for 
            continuous hydrological modeling. It provides practical recommendations and emphasizes 
            the ethical responsibilities of modelers.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Problem Definition] --&gt; B[Model Selection]
    B --&gt; C[Data Assembly]
    C --&gt; D[Calibration]
    D --&gt; E[Validation]
    E --&gt; F{Performance Adequate?}
    F --&gt;|No| G[Refine Approach]
    F --&gt;|Yes| H[Uncertainty Analysis]
    G --&gt; B
    H --&gt; I[Application]
    I --&gt; J[Documentation]
    J --&gt; K[Communication]
    K --&gt; L[Continuous Improvement]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Core Recommendations</h2>
          <div className="space-y-4">
            {[
              { num: 1, text: "Match model complexity to data availability and objectives" },
              { num: 2, text: "Quantify and communicate uncertainty transparently" },
              { num: 3, text: "Validate with independent data whenever possible" },
              { num: 4, text: "Document assumptions, limitations, and decisions thoroughly" },
              { num: 5, text: "Consider long-term sustainability and ethical implications" },
              { num: 6, text: "Engage stakeholders in the modeling process" }
            ].map((item) => (
              <Card key={item.num} className="p-4 border-l-4 border-l-primary">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold">
                    {item.num}
                  </div>
                  <p className="text-foreground font-medium">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Moving Forward</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Continuous modeling enables better understanding of long-term processes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Technology advances create new opportunities and responsibilities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Ethical practice requires honesty about what models can and cannot do</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is model integration?",
                options: [
                  "Using only one model",
                  "Combining multiple models to address complex problems",
                  "Avoiding complexity",
                  "Simplifying all models"
                ],
                correctAnswer: 1,
                explanation: "Model integration involves combining multiple models (e.g., hydrologic, economic, ecological) to address complex, interdisciplinary problems more comprehensively."
              },
              {
                question: "What is a challenge in model integration?",
                options: [
                  "Models become too simple",
                  "Ensuring consistency across different spatial and temporal scales",
                  "Reduced capabilities",
                  "Less realistic results"
                ],
                correctAnswer: 1,
                explanation: "A major challenge is ensuring consistency when integrating models that may operate at different spatial scales, temporal resolutions, or with different assumptions."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter17;