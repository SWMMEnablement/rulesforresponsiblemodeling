import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter6 = () => {
  return (
    <ChapterLayout chapterNumber={6} title="Rain Input Generation">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Stochastic Rainfall Models</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            When historical rainfall data is limited or synthetic scenarios are needed, stochastic 
            models generate statistically similar rainfall patterns. Disaggregation techniques convert 
            coarse temporal data into finer resolution needed for event modeling.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Historical Data] --> B[Statistical Analysis]
    B --> C[Parameter Extraction]
    C --> D{Model Type}
    D -->|Stochastic| E[Random Generation]
    D -->|Disaggregation| F[Temporal Refinement]
    E --> G[Synthetic Rainfall]
    F --> G
    G --> H[Validation]
    H --> I{Statistics Match?}
    I -->|No| C
    I -->|Yes| J[Model Application]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Analysis Techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Stochastic Methods</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Poisson cluster models</li>
                <li>• Markov chain approaches</li>
                <li>• Point process theory</li>
                <li>• Statistical preservation</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Disaggregation</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Temporal downscaling</li>
                <li>• Cascade models</li>
                <li>• Pattern-based methods</li>
                <li>• Correlation preservation</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Design storm development for infrastructure sizing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Climate change scenario generation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Risk analysis with synthetic ensembles</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the purpose of peer review in modeling?",
                options: [
                  "To delay project completion",
                  "To provide independent evaluation and improve model quality",
                  "To make models more complex",
                  "To avoid stakeholder input"
                ],
                correctAnswer: 1,
                explanation: "Peer review provides independent evaluation of model quality, assumptions, and methods, helping identify issues and improve overall model credibility."
              },
              {
                question: "When should peer review occur?",
                options: [
                  "Only at the end of the project",
                  "Throughout the modeling process",
                  "Never",
                  "Only if problems arise"
                ],
                correctAnswer: 1,
                explanation: "Peer review should occur throughout the modeling process to catch issues early and ensure continuous quality improvement."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter6;