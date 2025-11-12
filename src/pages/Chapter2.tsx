import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter2 = () => {
  return (
    <ChapterLayout chapterNumber={2} title="Discretization & Complexity">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Spatial and Temporal Resolution</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Discretization involves breaking down continuous systems into discrete spatial and temporal units 
            that can be computationally modeled. The choice of resolution significantly impacts model accuracy, 
            computational cost, and data requirements.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Continuous System] --> B[Spatial Discretization]
    A --> C[Temporal Discretization]
    B --> D[Grid Cells/Elements]
    C --> E[Time Steps]
    D --> F[Resolution Trade-offs]
    E --> F
    F --> G{Balance Point}
    G -->|Too Coarse| H[Loss of Detail]
    G -->|Too Fine| I[Computational Cost]
    G -->|Optimal| J[Effective Model]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Considerations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Spatial Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Watershed subdivision methods</li>
                <li>• Sub-catchment delineation</li>
                <li>• Grid vs. element approaches</li>
                <li>• GIS integration requirements</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Temporal Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Time step selection criteria</li>
                <li>• Event vs. continuous simulation</li>
                <li>• Stability considerations</li>
                <li>• Data storage requirements</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Match discretization to data availability and modeling objectives</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Consider computational resources when selecting resolution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Perform sensitivity analysis on discretization choices</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the main purpose of model objectives?",
                options: [
                  "To make the model more complex",
                  "To clearly define what the model should achieve",
                  "To exclude stakeholders",
                  "To avoid documentation"
                ],
                correctAnswer: 1,
                explanation: "Model objectives clearly define what the model should achieve, guiding the entire modeling process and ensuring alignment with decision-making needs."
              },
              {
                question: "Why should objectives be SMART?",
                options: [
                  "To impress stakeholders",
                  "To ensure they are Specific, Measurable, Achievable, Relevant, and Time-bound",
                  "To make them complex",
                  "SMART is not relevant to modeling"
                ],
                correctAnswer: 1,
                explanation: "SMART objectives ensure clarity, measurability, and achievability, making it easier to evaluate whether the model meets its intended purpose."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter2;