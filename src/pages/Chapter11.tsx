import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const Chapter11 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={11} title="Sensitivity Analysis">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Parameter Influence Assessment</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            <GlossaryTooltip term="Sensitivity Analysis" /> identifies which parameters most strongly influence model outputs. 
            This guides data collection priorities, <GlossaryTooltip term="Calibration" /> efforts, and <GlossaryTooltip term="Uncertainty Analysis" />, 
            while revealing model behavior and potential issues.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Parameter Set] --> B[Perturbation]
    B --> C[Model Runs]
    C --> D[Output Analysis]
    D --> E{Sensitivity Metric}
    E -->|Local| F[Gradient Method]
    E -->|Global| G[Variance Method]
    F --> H[Sensitivity Index]
    G --> H
    H --> I{Ranking}
    I -->|High| J[Priority Parameters]
    I -->|Low| K[Fixed Parameters]
    J --> L[Focus Calibration]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Analysis Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Local Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• One-at-a-time variations</li>
                <li>• Partial derivatives</li>
                <li>• Linear approximations</li>
                <li>• Computationally efficient</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Global Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Variance decomposition</li>
                <li>• <GlossaryTooltip term="Monte Carlo Simulation">Monte Carlo sampling</GlossaryTooltip></li>
                <li>• Parameter interactions</li>
                <li>• Full <GlossaryTooltip term="Epistemic Uncertainty">uncertainty space</GlossaryTooltip></li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Identify parameters requiring precise measurement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Reduce dimensionality of calibration problem</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Understand model behavior and limitations</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is scenario analysis?",
                options: [
                  "Predicting exact futures",
                  "Exploring plausible future conditions and their impacts",
                  "Eliminating uncertainty",
                  "Avoiding planning"
                ],
                correctAnswer: 1,
                explanation: "Scenario analysis explores a range of plausible future conditions to understand potential impacts and develop robust strategies across different futures."
              },
              {
                question: "Why use multiple scenarios?",
                options: [
                  "To make analysis more complex",
                  "To test robustness across different possible futures",
                  "It's not necessary",
                  "To avoid decisions"
                ],
                correctAnswer: 1,
                explanation: "Multiple scenarios help test the robustness of decisions and strategies across different possible futures, leading to more resilient planning."
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

export default Chapter11;