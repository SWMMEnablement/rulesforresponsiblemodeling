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

const Chapter6 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={6} title="Rain Input Generation">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={6} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Stochastic Rainfall Models</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            When historical rainfall data is limited or synthetic scenarios are needed, <GlossaryTooltip term="Stochastic Model">stochastic 
            models</GlossaryTooltip> generate statistically similar rainfall patterns. <GlossaryTooltip term="Disaggregation" /> techniques convert 
            coarse temporal data into finer resolution needed for event modeling. Understanding <GlossaryTooltip term="Return Period" /> 
            and <GlossaryTooltip term="Design Storm" /> concepts is essential.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Historical Data] --> B[Statistical Analysis]
    B --> C[Parameter Extraction]
    C --> D{Model Type}
    D -->|Stochastic| E[Random Generation]
    D -->|Disaggregation| F[Temporal Refinement]
    E --> G[Synthetic Rainfall]
    F --> G
    G --> H[Validation]
    H --> I{Statistics Match?}
    I -->|No| C
    I -->|Yes| J[Model Application]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Analysis Techniques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Stochastic Methods</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Poisson cluster models</li>
                <li>• Markov chain approaches</li>
                <li>• Point process theory</li>
                <li>• Statistical preservation</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Disaggregation</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Temporal downscaling</li>
                <li>• Cascade models</li>
                <li>• Pattern-based methods</li>
                <li>• Correlation preservation</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Design storm development for infrastructure sizing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Climate change scenario generation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Risk analysis with synthetic ensembles</span>
            </li>
          </ul>

          <Card className="p-6 bg-background/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Rainfall Input</h3>
            <p className="text-muted-foreground italic mb-3">
              "Rainfall is typically the largest source of uncertainty in urban drainage modeling, 
              yet modelers often spend more effort on hydraulic parameters than on rainfall characterization. 
              A sophisticated routing model fed with poor rainfall input produces poor results elegantly."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James emphasized that rainfall input deserves at least as much attention as model 
              calibration. Stochastic methods and proper uncertainty propagation help capture the 
              true range of possible outcomes, rather than false precision from a single design storm.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Synthetic Storm Generation</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Design Storm Development</h3>
            <p className="text-muted-foreground mb-4">
              A site has only daily rainfall data but requires 5-minute resolution for urban drainage design:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Challenge:</strong> 40 years of daily data, but storm structure unknown at sub-hourly scale. 
                Historical design storms may not represent future climate conditions.
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Solution:</strong> Implement cascade-based temporal disaggregation:
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Preserve daily volumes and wet/dry statistics</li>
                  <li>• Generate realistic sub-hourly variability</li>
                  <li>• Create 100-year ensemble for risk analysis</li>
                  <li>• Validate against limited sub-hourly records</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Results:</strong> Generated storms maintain statistical properties (mean, variance, extremes) 
                while providing temporal detail needed for <GlossaryTooltip term="SWMM" />. Ensemble approach quantifies <GlossaryTooltip term="Confidence Interval">uncertainty bounds</GlossaryTooltip> 
                (50th-95th percentile) on infrastructure sizing.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Stochastic Rainfall Models</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Poisson Cluster Models</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Storm arrivals: Poisson process</li>
                <li>• Rain cells: clustered around storms</li>
                <li>• Parameters: cell intensity, duration, spacing</li>
                <li>• Captures intermittency naturally</li>
                <li>• Widely used (e.g., Bartlett-Lewis, NSRP)</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Disaggregation Methods</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Cascade models (multiplicative)</li>
                <li>• Method of fragments</li>
                <li>• Scaling relationships</li>
                <li>• Preserves coarse-scale statistics</li>
                <li>• Less physically based than point process</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Choice between generation and disaggregation depends on available data and objectives. Stochastic 
            generation creates entirely synthetic series useful for risk analysis. Disaggregation refines 
            existing coarse data, maintaining consistency with observed large-scale patterns while adding 
            realistic fine-scale variability.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the main purpose of rainfall disaggregation?",
                options: [
                  "To remove data",
                  "To convert coarse temporal resolution data into finer resolution needed for modeling",
                  "To aggregate fine data",
                  "To eliminate uncertainty"
                ],
                correctAnswer: 1,
                explanation: "Disaggregation converts coarse temporal resolution (e.g., daily) rainfall data into finer resolution (e.g., 5-minute) needed for event-based urban drainage modeling while preserving statistical properties."
              },
              {
                question: "What is a key requirement when generating synthetic rainfall?",
                options: [
                  "Make it look different from observed data",
                  "Preserve statistical properties of the historical record",
                  "Always use the same pattern",
                  "Ignore extreme events"
                ],
                correctAnswer: 1,
                explanation: "Synthetic rainfall must preserve key statistics (mean, variance, extremes, temporal structure) of the historical record to ensure generated storms are representative and produce realistic model responses."
              },
              {
                question: "Why use stochastic ensembles rather than single design storms?",
                options: [
                  "They are easier to generate",
                  "To quantify uncertainty and explore range of possible outcomes",
                  "Design storms are always wrong",
                  "Computational efficiency"
                ],
                correctAnswer: 1,
                explanation: "Stochastic ensembles provide a range of equally-probable scenarios that quantify uncertainty, assess risk across multiple storm characteristics, and avoid bias from single design storm selection."
              }
            ]}
          />
        </section>

        {/* Modern Annotations */}
        {chapterAnnotations[6] && (
          <section>
            <ModernAnnotation annotations={chapterAnnotations[6]} />
          </section>
        )}

        {/* Application Challenge */}
        {chapterChallenges[6] && (
          <section>
            <ApplicationChallenge challenge={chapterChallenges[6]} />
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
              focusing on stochastic rainfall generation and disaggregation techniques for hydrological modeling.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter6;