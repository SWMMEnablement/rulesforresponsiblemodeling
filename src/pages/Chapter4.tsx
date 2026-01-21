import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { SoftwareExamples } from "@/components/SoftwareExamples";
import { ApplicationChallenge, chapterChallenges } from "@/components/ApplicationChallenge";
import { ModernAnnotation, chapterAnnotations } from "@/components/ModernAnnotation";

const Chapter4 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={4} title="Optimal Complexity">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={4} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Finding the Right Balance</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Model complexity should match the problem at hand, available data, and computational resources. 
            Too simple, and critical processes are missed. Too complex, and the model becomes unreliable 
            due to parameter uncertainty and overfitting. The <GlossaryTooltip term="Parsimony" /> principle 
            and understanding <GlossaryTooltip term="Equifinality" /> are essential for finding the right balance.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Problem Definition] --> B{Assess Factors}
    B --> C[Data Availability]
    B --> D[Computational Resources]
    B --> E[Uncertainty Budget]
    C --> F[Complexity Selection]
    D --> F
    E --> F
    F --> G{Appropriate Level?}
    G -->|Too Simple| H[Increase Detail]
    G -->|Too Complex| I[Simplify Model]
    G -->|Optimal| J[Implement & Test]
    H --> F
    I --> F
    J --> K[Validate Performance]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Complexity Measures</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Structural Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Number of model parameters</li>
                <li>• Process representation detail</li>
                <li>• Spatial and temporal resolution</li>
                <li>• Interaction between components</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Uncertainty Impact</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Parameter identifiability</li>
                <li>• Model equifinality issues</li>
                <li>• Prediction confidence bounds</li>
                <li>• Data requirement scaling</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Parsimony Principle</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Use the simplest model that adequately represents the system</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Additional parameters must be justified by improved performance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Consider diminishing returns of increasing complexity</span>
            </li>
          </ul>

          <Card className="p-6 bg-background/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Optimal Complexity</h3>
            <p className="text-muted-foreground italic mb-3">
              "There exists an optimal order of model complexity for any given application. Below this 
              optimum, the model fails to capture essential physics. Above it, parameter uncertainty 
              overwhelms any gain in structural accuracy. Finding this optimum requires systematic 
              evaluation, not intuition."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James's concept of "optimal order of complexity" provides a framework for model selection. 
              The optimal complexity depends on data availability, decision stakes, and the specific physical 
              processes that dominate system behavior. This optimum can be identified through systematic 
              comparison of model performance across complexity levels.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Selecting Model Detail</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Watershed Management Decision</h3>
            <p className="text-muted-foreground mb-4">
              A municipality must choose between three modeling approaches for long-term planning:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Option A - Simple Rational Method:</strong> 3 parameters per subcatchment. Fast but misses 
                temporal dynamics. Suitable only for peak flow estimation.
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Option B - Continuous SWMM:</strong> 15 parameters per subcatchment. Captures storage, 
                infiltration, and temporal patterns. Requires calibration data but provides water balance.
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Option C - Distributed 2D Model:</strong> 100+ parameters. High resolution but parameter 
                uncertainty overwhelms additional detail. Data requirements exceed availability.
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              <strong>Decision:</strong> Option B selected. Continuous simulation needed for long-term assessment, 
              calibration data available, computational resources adequate. Option C rejected due to equifinality 
              issues—many parameter sets produce similar results, making calibration unreliable.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4"><GlossaryTooltip term="Sensitivity Analysis" /> Methods</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Local Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• One-at-a-time parameter variation</li>
                <li>• Derivative-based approaches</li>
                <li>• Fast computation</li>
                <li>• Limited to vicinity of base values</li>
                <li>• Misses parameter interactions</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Global Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Variance-based methods (Sobol indices)</li>
                <li>• Morris screening technique</li>
                <li>• Explores full parameter space</li>
                <li>• Captures interactions</li>
                <li>• Computationally intensive</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Sensitivity analysis reveals which parameters merit careful calibration and which can be set to 
            literature values. High sensitivity parameters become calibration targets; low sensitivity parameters 
            can often be fixed, reducing model complexity without sacrificing performance.
          </p>
        </section>

        {/* Modern Annotations */}
        {chapterAnnotations[4] && (
          <section>
            <ModernAnnotation annotations={chapterAnnotations[4]} />
          </section>
        )}

        {/* Application Challenge */}
        {chapterChallenges[4] && (
          <section>
            <ApplicationChallenge challenge={chapterChallenges[4]} />
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is equifinality in hydrological modeling?",
                options: [
                  "Having only one correct parameter set",
                  "Multiple different parameter sets producing similar model performance",
                  "Parameters that never change",
                  "Perfect model calibration"
                ],
                correctAnswer: 1,
                explanation: "Equifinality means multiple parameter combinations can produce equally good fits to observed data, making it impossible to identify a single 'correct' parameter set and increasing prediction uncertainty."
              },
              {
                question: "How does adding parameters affect model uncertainty?",
                options: [
                  "Always reduces uncertainty",
                  "Has no effect",
                  "Can increase uncertainty if parameters cannot be well-identified from available data",
                  "Only affects computational speed"
                ],
                correctAnswer: 2,
                explanation: "Adding parameters without sufficient data to constrain them increases model uncertainty through equifinality. More parameters require more data for reliable calibration."
              },
              {
                question: "What is the parsimony principle in modeling?",
                options: [
                  "Always use maximum detail",
                  "Use the simplest model that adequately captures system behavior",
                  "Avoid all simplifications",
                  "Minimize computer cost only"
                ],
                correctAnswer: 1,
                explanation: "Parsimony (Occam's Razor) advocates using the simplest model that adequately represents the system, balancing detail against data availability and reducing unnecessary complexity."
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
              focusing on optimal complexity, the parsimony principle, and balancing model detail against 
              data availability and uncertainty.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter4;