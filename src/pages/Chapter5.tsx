import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Chapter5 = () => {
  return (
    <>
      <Navigation />
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Multi-Year Water Balance</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Stream Restoration Assessment</h3>
            <p className="text-muted-foreground mb-4">
              A 5-year continuous simulation evaluates urbanization impacts on stream baseflow:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Rainfall Input:</strong> 5-minute resolution for 1825 days (2001-2005)</li>
              <li><strong>Results:</strong> Pre-development: 125 mm/year baseflow; Post-development: 45 mm/year</li>
              <li><strong>Ecological Impact:</strong> 64% reduction threatens aquatic habitat during summer low flows</li>
              <li><strong>Validation:</strong> Stream gauge data confirms model predictions within 15% error</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Continuous modeling reveals that increased impervious area reduces infiltration, lowering groundwater 
              recharge and stream baseflow. Single-event analysis would miss this critical long-term impact on 
              ecosystem sustainability. The findings support recommendations for infiltration-based best management practices.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Calibration and Validation Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Calibration Approach</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Use 2-3 years of continuous data</li>
                <li>• Target multiple objectives (peaks, volumes, baseflow)</li>
                <li>• Manual adjustment + automated optimization</li>
                <li>• Check water balance closure</li>
                <li>• Document parameter sensitivities</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Validation Testing</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Independent time period (split-sample)</li>
                <li>• Different climate conditions</li>
                <li>• Spatial validation at multiple gauges</li>
                <li>• Process-based checks (infiltration rates)</li>
                <li>• Extreme event performance</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Calibration on one period and validation on independent data prevents over-fitting and builds 
            confidence in predictive capability. Continuous models should perform well across seasons, 
            storm types, and antecedent conditions to demonstrate robustness.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "Why use continuous simulation rather than single-event modeling?",
                options: [
                  "It is always easier",
                  "It captures long-term processes, water balance, and antecedent conditions",
                  "Single events are never useful",
                  "It requires less data"
                ],
                correctAnswer: 1,
                explanation: "Continuous simulation captures temporal dynamics, antecedent moisture conditions, seasonal patterns, and long-term water balance that single-event models miss, essential for sustainability assessment."
              },
              {
                question: "What is split-sample validation?",
                options: [
                  "Using half the spatial domain",
                  "Calibrating on one time period and testing on an independent period",
                  "Splitting the model into pieces",
                  "Dividing the watershed"
                ],
                correctAnswer: 1,
                explanation: "Split-sample validation uses data from one time period for calibration and an independent period for validation, testing whether the calibrated model can predict conditions it was not trained on."
              },
              {
                question: "What ethical consideration is most important in long-term modeling?",
                options: [
                  "Minimizing cost",
                  "Assessing intergenerational impacts and ecosystem sustainability",
                  "Speed of computation",
                  "Complexity maximization"
                ],
                correctAnswer: 1,
                explanation: "Long-term modeling carries ethical responsibilities to assess impacts on future generations and ecosystem health, requiring transparency about sustainability implications and model limitations."
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
              focusing on continuous simulation for long-term sustainability assessment and ethical 
              considerations in water resource modeling.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter5;