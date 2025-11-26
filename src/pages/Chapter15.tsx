import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Chapter15 = () => {
  return (
    <>
      <Navigation />
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Fuzzy Rule-Based Control</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Real-Time Flood Gate Operation</h3>
            <p className="text-muted-foreground mb-4">
              A detention pond control system uses fuzzy logic to handle imprecise sensor readings and uncertain forecasts:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Input Variables (Fuzzy):</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Pond level: {"{Low, Medium, High, Very High}"}</li>
                  <li>• Rainfall intensity: {"{Light, Moderate, Heavy}"}</li>
                  <li>• Forecast reliability: {"{Poor, Fair, Good}"}</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Fuzzy Rules:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• IF level is High AND rainfall is Heavy THEN opening is Small</li>
                  <li>• IF level is Low AND forecast is Good THEN opening is Large</li>
                  <li>• IF level is Medium AND reliability is Poor THEN opening is Medium</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Benefits:</strong> System handles sensor noise gracefully, incorporates expert operator 
                knowledge, provides smooth control transitions (no abrupt valve changes), and makes reasonable 
                decisions even with incomplete information—unlike crisp rule-based systems that fail when 
                thresholds are uncertain.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Fuzzy Set Theory Fundamentals</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Membership Functions</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Triangular (simple, commonly used)</li>
                <li>• Trapezoidal (flat peak regions)</li>
                <li>• Gaussian (smooth transitions)</li>
                <li>• Sigmoidal (S-curves)</li>
                <li>• Custom shapes from expert knowledge</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Fuzzy Operations</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• AND: minimum of memberships</li>
                <li>• OR: maximum of memberships</li>
                <li>• NOT: 1 minus membership</li>
                <li>• Aggregation: combine rule outputs</li>
                <li>• Defuzzification: centroid, max methods</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Fuzzy logic bridges the gap between precise mathematical models and linguistic expert knowledge. 
            It excels when dealing with imprecise measurements, uncertain conditions, and qualitative reasoning. 
            However, rule design requires careful consideration—too few rules miss important cases, too many 
            create complexity and potential conflicts.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What distinguishes fuzzy logic from crisp Boolean logic?",
                options: [
                  "Fuzzy logic is always wrong",
                  "Fuzzy logic allows partial membership (degrees between 0 and 1)",
                  "They are identical",
                  "Fuzzy logic only uses True/False"
                ],
                correctAnswer: 1,
                explanation: "Fuzzy logic allows partial membership where elements can belong to sets with degrees between 0 and 1, enabling representation of imprecise concepts like 'high water level' or 'heavy rainfall.'"
              },
              {
                question: "What is defuzzification?",
                options: [
                  "Making models more complex",
                  "Converting fuzzy output to a crisp value for system control",
                  "Removing all uncertainty",
                  "Creating fuzzy sets"
                ],
                correctAnswer: 1,
                explanation: "Defuzzification converts fuzzy inference results into crisp numerical values needed for actual control actions, commonly using methods like centroid (center of area) or maximum membership."
              },
              {
                question: "When is fuzzy logic most valuable in modeling?",
                options: [
                  "Always better than alternatives",
                  "When incorporating expert knowledge and handling imprecise information",
                  "Never useful",
                  "Only for academic research"
                ],
                correctAnswer: 1,
                explanation: "Fuzzy logic excels when incorporating linguistic expert knowledge, handling sensor imprecision, managing uncertain conditions, and making decisions under incomplete information—common situations in water management."
              }
            ]}
          />
        </section>

        <section className="bg-gradient-to-br from-accent/20 to-background rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">References & Further Reading</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">James, W.</strong> (2005). <em>Rules for Responsible Modeling</em> (4th ed.). 
              Computational Hydraulics International (CHI). Guelph, Ontario, Canada.
            </p>
            <p className="text-sm">
              Available at:{" "}
              <a 
                href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html
              </a>
            </p>
            <p className="mt-4 text-sm italic">
              This chapter presents original educational content inspired by concepts from the James textbook, 
              focusing on fuzzy logic applications in hydrological modeling and handling imprecision in decision-making.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter15;