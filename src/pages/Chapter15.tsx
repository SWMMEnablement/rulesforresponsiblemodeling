import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";

const Chapter15 = () => {
  return (
    <ChapterLayout chapterNumber={15} title="Fuzzy Logic">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Handling Imprecision</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Fuzzy logic provides a framework for reasoning with imprecise or uncertain information. 
            In hydrological modeling, it's particularly useful for incorporating expert knowledge, 
            managing linguistic variables, and decision-making under uncertainty.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Crisp Input] --> B[Fuzzification]
    B --> C[Fuzzy Sets]
    C --> D[Inference Engine]
    D --> E[Rule Evaluation]
    E --> F[Fuzzy Output]
    F --> G[Defuzzification]
    G --> H[Crisp Output]
    I[Expert Rules] --> D
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style H fill:#10b981,stroke:#059669,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Core Components</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Fuzzification</h3>
              <p className="text-muted-foreground text-sm">Convert crisp values to fuzzy membership degrees</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Reasoning</h3>
              <p className="text-muted-foreground text-sm">Apply IF-THEN rules using fuzzy operators</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Defuzzification</h3>
              <p className="text-muted-foreground text-sm">Extract crisp output from fuzzy result</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Applications in Hydrology</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Flood risk assessment with linguistic terms (low, medium, high)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Real-time control decisions based on imprecise measurements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Integration of expert knowledge into model frameworks</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is adaptive management?",
                options: [
                  "Fixed long-term plans",
                  "Learning by doing and adjusting based on monitoring",
                  "Avoiding changes",
                  "Only theoretical planning"
                ],
                correctAnswer: 1,
                explanation: "Adaptive management is a structured, iterative approach that involves learning from implementation, monitoring outcomes, and adjusting strategies based on results."
              },
              {
                question: "Why is monitoring important in adaptive management?",
                options: [
                  "It's not important",
                  "It provides feedback to evaluate and adjust strategies",
                  "Only for compliance",
                  "To increase costs"
                ],
                correctAnswer: 1,
                explanation: "Monitoring provides essential feedback on how well strategies are working, enabling evidence-based adjustments and continuous improvement."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter15;