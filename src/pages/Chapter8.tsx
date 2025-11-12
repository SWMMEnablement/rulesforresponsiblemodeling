import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter8 = () => {
  return (
    <ChapterLayout chapterNumber={8} title="Decision Support">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">PCSWMM and Software Tools</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Decision support systems integrate modeling capabilities with user-friendly interfaces, 
            visualization tools, and scenario analysis features. PCSWMM exemplifies modern approaches 
            to practical urban drainage modeling and management.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[User Interface] --> B[Model Setup]
    B --> C[Data Input]
    C --> D[SWMM Engine]
    D --> E[Simulation]
    E --> F[Results]
    F --> G[Visualization]
    F --> H[Analysis Tools]
    G --> I[Decision Making]
    H --> I
    I --> J{Scenarios}
    J -->|Iterate| B
    J -->|Finalize| K[Implementation]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Tool Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Integration</h3>
              <p className="text-muted-foreground text-sm">GIS connectivity, database management, CAD import/export</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Visualization</h3>
              <p className="text-muted-foreground text-sm">Time series plots, spatial maps, animation capabilities</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Analysis</h3>
              <p className="text-muted-foreground text-sm">Sensitivity, calibration, optimization, reporting</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Benefits</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Streamlined workflow from data to decisions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Scenario comparison and trade-off analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Stakeholder communication through visualization</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is data quality assurance?",
                options: [
                  "Ignoring data errors",
                  "Systematic processes to ensure data accuracy and reliability",
                  "Using any available data",
                  "Avoiding data documentation"
                ],
                correctAnswer: 1,
                explanation: "Data quality assurance involves systematic processes to verify, validate, and ensure the accuracy, completeness, and reliability of data used in models."
              },
              {
                question: "Why is data provenance important?",
                options: [
                  "It's not important",
                  "It tracks data sources and transformations for transparency",
                  "It makes data more complex",
                  "Only for legal purposes"
                ],
                correctAnswer: 1,
                explanation: "Data provenance tracks the origin, collection methods, and transformations of data, ensuring transparency and enabling quality assessment."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter8;