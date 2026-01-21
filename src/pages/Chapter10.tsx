import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { MonteCarloCalculator } from "@/components/MonteCarloCalculator";
import { SoftwareExamples } from "@/components/SoftwareExamples";
import { ApplicationChallenge, chapterChallenges } from "@/components/ApplicationChallenge";
import { ModernAnnotation, chapterAnnotations } from "@/components/ModernAnnotation";

const Chapter10 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={10} title="Uncertainty Analysis">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={10} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Sources of Uncertainty</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Every model prediction contains uncertainty from multiple sources. Understanding and quantifying 
            these uncertainties through <GlossaryTooltip term="Uncertainty Analysis" /> is essential for responsible modeling. 
            As Dr. James emphasizes, "all models are wrong" — the key is understanding <em>how</em> wrong and 
            <em>when</em> they remain useful. Methods like <GlossaryTooltip term="Monte Carlo Simulation" /> help propagate 
            and quantify uncertainty, while recognizing <GlossaryTooltip term="Equifinality" /> in parameter identification.
          </p>

          <Card className="p-6 bg-primary/5 border-l-4 border-l-primary mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Key Insight from James</h3>
            <p className="text-muted-foreground italic">
              "Model error arises from discretization (spatial and temporal resolution choices) and monitoring 
              (measurement uncertainty in calibration data). Both must be quantified to understand prediction reliability."
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Total Model Uncertainty] --> B[Input Uncertainty]
    A --> C[Parameter Uncertainty]
    A --> D[Structural Uncertainty]
    A --> E[Calibration Uncertainty]
    
    B --> F[Rainfall Measurement]
    B --> G[Initial Conditions]
    B --> B1[Discretization Error]
    
    C --> H[Physical Parameters]
    C --> I[Empirical Coefficients]
    
    D --> J[Model Structure]
    D --> K[Process Representation]
    
    E --> L[Objective Function Choice]
    E --> M[Equifinality]
    E --> N[Monitoring Error]
    
    style A fill:#dc2626,stroke:#b91c1c,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
    style E fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Discretization and Monitoring Errors</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Dr. James identifies two fundamental sources of model error that must be addressed in any uncertainty analysis:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold text-primary mb-3">Discretization Error</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Errors arising from spatial and temporal resolution choices in model setup.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Spatial:</strong> Subcatchment size, node spacing, conduit segmentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Temporal:</strong> Time step selection, rainfall aggregation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Numerical:</strong> Solution method convergence tolerances</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-secondary">
              <h3 className="text-xl font-bold text-primary mb-3">Monitoring Error</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Errors in the observed data used for calibration and validation.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Rainfall:</strong> Gauge density, spatial variability, missing data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Flow:</strong> Rating curve uncertainty, sensor drift, debris</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Quality:</strong> Sampling frequency, lab accuracy, representativeness</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4"><GlossaryTooltip term="Uncertainty Analysis">Uncertainty Quantification</GlossaryTooltip> Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3"><GlossaryTooltip term="Monte Carlo Simulation" /></h3>
              <p className="text-muted-foreground text-sm mb-4">
                Repeatedly sample from parameter distributions and propagate through model
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Simple conceptually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Handles non-linearity well</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">-</span>
                  <span>Computationally intensive</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">GLUE Method</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Generalized Likelihood Uncertainty Estimation for parameter uncertainty
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Identifies behavioral parameters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Accounts for <GlossaryTooltip term="Equifinality" /></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">-</span>
                  <span>Subjective threshold selection</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Bayesian Methods</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Formal statistical framework combining prior knowledge with observations
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Rigorous statistical basis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Updates with new data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">-</span>
                  <span>Complex implementation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">First-Order Analysis</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Linear approximation of uncertainty propagation using derivatives
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Fast computation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">+</span>
                  <span>Analytical solutions possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">-</span>
                  <span>Limited to near-linear systems</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Uncertainty Analysis Workflow</h2>
          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Identify Uncertainty Sources] --> B[Define Probability Distributions]
    B --> C[Generate Parameter Samples]
    C --> D[Run Model Ensemble]
    D --> E[Analyze Output Distribution]
    E --> F[Confidence Intervals]
    E --> G[Prediction Bands]
    E --> H[Sensitivity Ranking]
    
    F --> I[Communicate Results]
    G --> I
    H --> I
    
    I --> J[Acceptable Check]
    J --No--> K[Refine Model/Data]
    J --Yes--> L[Decision Making]
    K --> A
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style J fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Try It Yourself: Monte Carlo Simulator</h2>
          <p className="text-muted-foreground mb-6">
            Use this interactive tool to explore how parameter uncertainty propagates through a model. 
            Adjust the mean and standard deviation of input parameters to see how they affect output uncertainty.
          </p>
          <MonteCarloCalculator />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Communicating Uncertainty</h2>
          <Card className="p-6 bg-muted/50">
            <p className="text-muted-foreground mb-4">
              Effective communication of uncertainty to decision-makers is critical:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">1.</span>
                <span><strong>Visualization:</strong> Use confidence bands, probability plots, and ensemble displays</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">2.</span>
                <span><strong>Quantitative Metrics:</strong> Report prediction intervals and exceedance probabilities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">3.</span>
                <span><strong>Plain Language:</strong> Explain what uncertainty means for decisions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">4.</span>
                <span><strong>Scenario Analysis:</strong> Present best, worst, and expected cases</span>
              </li>
            </ul>
          </Card>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>All models contain uncertainty - ignoring it leads to overconfident predictions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Multiple methods exist for uncertainty quantification - choose based on problem</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Communication of uncertainty is as important as its quantification</span>
            </li>
          </ul>
        </section>

        {/* Modern Annotations */}
        {chapterAnnotations[10] && (
          <section>
            <ModernAnnotation annotations={chapterAnnotations[10]} />
          </section>
        )}

        {/* Application Challenge */}
        {chapterChallenges[10] && (
          <section>
            <ApplicationChallenge challenge={chapterChallenges[10]} />
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is Monte Carlo simulation used for?",
                options: [
                  "Eliminating uncertainty",
                  "Quantifying uncertainty through repeated random sampling",
                  "Making models more complex",
                  "Avoiding probability distributions"
                ],
                correctAnswer: 1,
                explanation: "Monte Carlo simulation uses repeated random sampling from probability distributions to quantify uncertainty and generate probability distributions of model outputs."
              },
              {
                question: "What does a probability distribution describe?",
                options: [
                  "Exact future values",
                  "The range and likelihood of possible values",
                  "Only worst-case scenarios",
                  "Model errors"
                ],
                correctAnswer: 1,
                explanation: "A probability distribution describes the range of possible values a variable can take and the relative likelihood of each value occurring."
              }
            ]}
          />
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter10;
