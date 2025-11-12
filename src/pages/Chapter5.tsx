import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter5 = () => {
  return (
    <ChapterLayout chapterNumber={5} title="Continuous Models">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Long-Term Sustainability Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Continuous simulation models run over extended periods to capture seasonal variations, 
            ecosystem processes, and long-term trends. These models are essential for sustainability 
            assessment, climate impact studies, and ethical water resource management.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Continuous Input] --> B[Hydrological Processes]
    B --> C[Runoff Generation]
    B --> D[Infiltration]
    B --> E[Evapotranspiration]
    C --> F[Water Balance]
    D --> F
    E --> F
    F --> G[Ecosystem Impact]
    F --> H[Sustainability Metrics]
    G --> I[Long-term Analysis]
    H --> I
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style I fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Applications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Water Balance</h3>
              <p className="text-muted-foreground text-sm">Long-term accounting of inputs, outputs, and storage changes</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Ecosystem Health</h3>
              <p className="text-muted-foreground text-sm">Stream flow patterns and habitat sustainability</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Climate Change</h3>
              <p className="text-muted-foreground text-sm">Impact assessment over multi-decadal periods</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ethical Considerations</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Intergenerational equity in water resource planning</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Environmental flow requirements for ecosystem protection</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Transparent communication of model limitations and uncertainties</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is model calibration?",
                options: [
                  "Making the model more complex",
                  "Adjusting parameters to match observed data",
                  "Removing uncertainty",
                  "Ignoring validation"
                ],
                correctAnswer: 1,
                explanation: "Model calibration is the process of adjusting model parameters so that model outputs match observed historical data as closely as possible."
              },
              {
                question: "Why is validation important?",
                options: [
                  "It's not important",
                  "It tests model performance on independent data",
                  "It eliminates all errors",
                  "It makes models simpler"
                ],
                correctAnswer: 1,
                explanation: "Validation tests model performance using independent data not used in calibration, providing confidence that the model can make reliable predictions."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter5;