import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter1 = () => {
  return (
    <ChapterLayout chapterNumber={1} title="Introduction">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">What is a Model?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A model is a simplified representation of a complex system designed to help us understand, predict, 
            and make decisions about real-world phenomena. In hydrological and environmental modeling, we create 
            mathematical representations of water systems to solve practical problems.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Real World System] --> B[Conceptualization]
    B --> C[Mathematical Model]
    C --> D[Computer Implementation]
    D --> E[Predictions & Decisions]
    E --> F[Validation Check]
    F --Refine--> B
    F --Acceptable--> G[Application]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style G fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Rules for Responsible Modeling</h2>
          <div className="space-y-4">
            {[
              { rule: 1, text: "Define the modeling objectives clearly" },
              { rule: 2, text: "Choose appropriate model complexity" },
              { rule: 3, text: "Ensure data quality and reliability" },
              { rule: 4, text: "Quantify and communicate uncertainty" },
              { rule: 5, text: "Validate with independent data" },
              { rule: 6, text: "Document assumptions and limitations" }
            ].map((item) => (
              <Card key={item.rule} className="p-4 border-l-4 border-l-primary hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg">
                    {item.rule}
                  </div>
                  <p className="text-foreground font-medium">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Applications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Urban Drainage</h3>
              <p className="text-muted-foreground text-sm">Stormwater management, flood prediction, and infrastructure design</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Water Quality</h3>
              <p className="text-muted-foreground text-sm">Pollutant transport, treatment optimization, and environmental impact</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Watershed Management</h3>
              <p className="text-muted-foreground text-sm">Resource planning, ecosystem protection, and climate adaptation</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Models are tools for understanding and decision-making, not absolute truth</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Responsible modeling requires transparency about limitations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>The goal is insight and informed decisions, not perfect predictions</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the primary purpose of responsible modeling?",
                options: [
                  "To create the most complex model possible",
                  "To develop defensible, credible models for decision-making",
                  "To avoid stakeholder engagement",
                  "To maximize computational efficiency"
                ],
                correctAnswer: 1,
                explanation: "Responsible modeling aims to create defensible, credible models that support effective decision-making while maintaining transparency and stakeholder trust."
              },
              {
                question: "Which is NOT one of the key principles of responsible modeling?",
                options: [
                  "Transparency",
                  "Stakeholder engagement",
                  "Model complexity maximization",
                  "Uncertainty characterization"
                ],
                correctAnswer: 2,
                explanation: "Model complexity should be appropriate to the problem, not maximized. The key principles include transparency, stakeholder engagement, and proper uncertainty characterization."
              },
              {
                question: "Why is stakeholder engagement important in modeling?",
                options: [
                  "It slows down the modeling process",
                  "It ensures models address real needs and build trust",
                  "It is not important",
                  "It only matters for academic models"
                ],
                correctAnswer: 1,
                explanation: "Stakeholder engagement ensures that models address real-world needs, incorporate diverse perspectives, and build trust in the modeling process and results."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter1;
