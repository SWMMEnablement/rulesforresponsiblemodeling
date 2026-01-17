import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { WaterBalanceCalculator } from "@/components/WaterBalanceCalculator";
import { SoftwareExamples } from "@/components/SoftwareExamples";

const Chapter5 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={5} title="Continuous Models">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={5} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Long-Term Sustainability Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            <GlossaryTooltip term="Continuous Simulation" /> models run over extended periods to capture seasonal variations, 
            ecosystem processes, and long-term trends. Dr. James emphasizes that continuous modeling is essential 
            because unlike "event" models that use arbitrary startup conditions, continuous models include 
            dry-weather processes (pollutant build-up, evapo-transpiration) and provide critical frequency-concentration 
            information that only long-term simulations can offer.
          </p>

          <Card className="p-6 bg-primary/5 border-l-4 border-l-primary mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Key Insight from James</h3>
            <p className="text-muted-foreground italic">
              "Continuous models are necessary for sustainability analysis. Only long-term simulations 
              (e.g., 75 years) can provide the frequency-concentration information needed for informed 
              environmental design decisions."
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Continuous Input] --> B[Hydrological Processes]
    B --> C[Runoff Generation]
    B --> D[Infiltration]
    B --> E[Evapotranspiration]
    B --> B1[Pollutant Build-up]
    C --> F[Water Balance]
    D --> F
    E --> F
    B1 --> F
    F --> G[Frequency Analysis]
    F --> H[Sustainability Metrics]
    G --> I[Long-term Design]
    H --> I
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style I fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Continuous vs. Event Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Dr. James distinguishes between event-based and continuous modeling approaches:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-destructive">
              <h3 className="text-xl font-bold text-primary mb-3">Event-Based Models</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Simulate individual storm events with specified initial conditions.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">−</span>
                  <span>Arbitrary startup conditions (initial moisture, storage)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">−</span>
                  <span>Cannot capture antecedent conditions naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">−</span>
                  <span>Miss dry-weather processes (pollutant accumulation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Computationally efficient for design storms</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-primary mb-3">Continuous Models</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Simulate extended periods including inter-event processes.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Natural evolution of antecedent conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Capture pollutant build-up and washoff dynamics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Enable frequency analysis from synthetic record</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Required for sustainability and climate analysis</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">The Calibration Rule for Continuous Models</h2>
          <Card className="p-6 bg-muted/30">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Dr. James provides a practical insight: <strong>short, accurate observed time series are sufficient 
              for parameter optimization</strong>; long-term inferential runs can use transposed or synthetic 
              rainfall data.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded">
                <h4 className="font-semibold text-foreground mb-2">Short-term Calibration</h4>
                <p className="text-sm text-muted-foreground">
                  Use high-quality observed data (1-3 years) to calibrate parameters. Focus on accuracy 
                  over duration.
                </p>
              </div>
              <div className="p-4 bg-background rounded">
                <h4 className="font-semibold text-foreground mb-2">Long-term Inference</h4>
                <p className="text-sm text-muted-foreground">
                  Once calibrated, run the model with extended or synthetic rainfall (25-100+ years) for 
                  frequency analysis.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Applications</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
          
          <WaterBalanceCalculator />
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
              A 5-year <GlossaryTooltip term="Continuous Simulation">continuous simulation</GlossaryTooltip> evaluates urbanization impacts on stream <GlossaryTooltip term="Baseflow" />:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Rainfall Input:</strong> 5-minute resolution for 1825 days (2001-2005)</li>
              <li><strong>Results:</strong> Pre-development: 125 mm/year baseflow; Post-development: 45 mm/year</li>
              <li><strong>Ecological Impact:</strong> 64% reduction threatens aquatic habitat during summer low flows</li>
              <li><strong><GlossaryTooltip term="Validation" />:</strong> Stream gauge data confirms model predictions within 15% error</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Continuous modeling reveals that increased impervious area reduces infiltration, lowering groundwater 
              recharge and stream baseflow. Single-event analysis would miss this critical long-term impact on 
              ecosystem sustainability. The findings support recommendations for infiltration-based best management practices.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4"><GlossaryTooltip term="Calibration" /> and <GlossaryTooltip term="Validation" /> Strategies</h2>
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