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

const Chapter16 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={16} title="Real-Time Uncertainty">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={16} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Continuous Reliability Assessment</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Real-time systems must present model uncertainty alongside predictions. This chapter addresses 
            methods for continuously updating uncertainty bounds, displaying <GlossaryTooltip term="Confidence Interval">confidence intervals</GlossaryTooltip>, and 
            communicating reliability to decision-makers during live operations. <GlossaryTooltip term="Ensemble Forecasting" /> 
            is a key technique for quantifying prediction uncertainty.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Real-Time Data] --> B[Model Update]
    B --> C[Prediction]
    B --> D[Uncertainty Estimation]
    C --> E[Central Forecast]
    D --> F[Confidence Bounds]
    E --> G[Visualization]
    F --> G
    G --> H[Decision Support]
    H --> I{Action Needed?}
    I -->|Yes| J[Implement Response]
    I -->|Monitor| A
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Uncertainty Sources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Parameter Uncertainty</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Calibration errors</li>
                <li>• Temporal parameter variation</li>
                <li>• Measurement noise</li>
                <li>• Model structural error</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Input Uncertainty</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Rainfall forecast errors</li>
                <li>• Sensor accuracy</li>
                <li>• Spatial interpolation</li>
                <li>• Boundary conditions</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Display Strategies</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Ensemble forecasts showing range of possible outcomes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Confidence intervals with probability levels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Risk-based decision thresholds incorporating uncertainty</span>
            </li>
          </ul>

          <Card className="p-6 bg-background/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Model Certainty</h3>
            <p className="text-muted-foreground italic mb-3">
              "Model error is not a sign of failure—it is an inherent characteristic of all models. 
              The responsible approach is not to minimize error at any cost, but to characterize it 
              honestly and communicate it effectively. Decision-makers deserve to know the confidence 
              they should place in model predictions."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James advocated for transparent uncertainty communication, arguing that false precision 
              undermines trust and leads to poor decisions. Real-time systems should display uncertainty 
              bounds prominently, enabling operators to calibrate their responses appropriately.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Ensemble Flood Forecasting</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Real-Time Warning System Implementation</h3>
            <p className="text-muted-foreground mb-4">
              A city operates a 6-hour ahead flood warning system with real-time uncertainty quantification:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>System Components:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Ensemble rainfall forecasts (20 members from weather service)</li>
                  <li>• Parameter uncertainty (100 sets from calibration)</li>
                  <li>• Continuous model updating with real-time observations</li>
                  <li>• Bayesian updating of confidence intervals</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Display Strategy:</strong> Operators see central forecast plus 50%, 80%, and 95% confidence 
                bounds. Decision thresholds based on risk tolerance: 80% confidence for routine alerts, 50% for 
                high-consequence areas requiring early action.
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Performance:</strong> 6-month evaluation shows 85% of actual peaks fall within 80% bounds. 
                False alarm rate reduced 40% versus deterministic forecasts because uncertainty communication enables 
                risk-informed decisions. Operators trust system more due to honest uncertainty representation.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4"><GlossaryTooltip term="Uncertainty Analysis">Uncertainty Quantification</GlossaryTooltip> Methods</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Probabilistic Approaches</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <GlossaryTooltip term="Monte Carlo Simulation">Monte Carlo ensemble generation</GlossaryTooltip></li>
                <li>• Bayesian updating with observations</li>
                <li>• Particle filtering for state estimation</li>
                <li>• Ensemble Kalman filtering</li>
                <li>• <GlossaryTooltip term="Confidence Interval" /> construction</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Communication Strategies</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Spaghetti plots (ensemble trajectories)</li>
                <li>• Shaded confidence regions</li>
                <li>• Probability of exceedance curves</li>
                <li>• Risk matrices (likelihood × consequence)</li>
                <li>• Plain language uncertainty statements</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Effective real-time uncertainty display requires balancing information richness with clarity. 
            Too much detail overwhelms operators; too little leads to overconfidence. Best practices include 
            showing central forecast prominently, providing multiple confidence levels, and training users to 
            interpret probabilistic information for decision-making.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "Why display uncertainty in real-time systems rather than single forecasts?",
                options: [
                  "To confuse operators",
                  "Enables risk-informed decisions and builds trust through honest communication",
                  "Single forecasts are always better",
                  "To avoid responsibility"
                ],
                correctAnswer: 1,
                explanation: "Displaying uncertainty enables operators to make risk-informed decisions appropriate to consequences, reduces false confidence in precise predictions, and builds long-term trust through transparent communication of model limitations."
              },
              {
                question: "What is ensemble forecasting?",
                options: [
                  "Running model only once",
                  "Running model multiple times with varied inputs/parameters to show range of outcomes",
                  "Averaging all forecasts",
                  "Using oldest forecast"
                ],
                correctAnswer: 1,
                explanation: "Ensemble forecasting runs the model multiple times with systematically varied inputs and parameters to generate a range of equally-plausible outcomes, representing prediction uncertainty through the spread of ensemble members."
              },
              {
                question: "How should confidence bounds be used in decision-making?",
                options: [
                  "Always ignore them",
                  "Set action thresholds based on risk tolerance and consequences",
                  "Only use central forecast",
                  "Take no action if any uncertainty exists"
                ],
                correctAnswer: 1,
                explanation: "Decision thresholds should reflect risk tolerance: use wider bounds (lower confidence) for high-consequence decisions requiring early action, narrower bounds (higher confidence) for routine operations, balancing false alarms against missed events."
              }
            ]}
          />
        </section>

        {/* Modern Annotations */}
        {chapterAnnotations[16] && (
          <section>
            <ModernAnnotation annotations={chapterAnnotations[16]} />
          </section>
        )}

        {/* Application Challenge */}
        {chapterChallenges[16] && (
          <section>
            <ApplicationChallenge challenge={chapterChallenges[16]} />
          </section>
        )}

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
              focusing on real-time uncertainty assessment and communication in operational hydrological systems.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter16;