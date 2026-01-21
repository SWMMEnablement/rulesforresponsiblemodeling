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

const Chapter9 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={9} title="Objective Functions">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={9} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Performance Measurement</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            <GlossaryTooltip term="Objective Function">Objective functions</GlossaryTooltip> quantify how well model predictions match observations. The choice of 
            performance metric significantly influences <GlossaryTooltip term="Calibration" /> results and should align with 
            modeling objectives. Key metrics include <GlossaryTooltip term="Nash-Sutcliffe Efficiency" />, <GlossaryTooltip term="RMSE" />, 
            <GlossaryTooltip term="PBIAS" />, and <GlossaryTooltip term="KGE" />.
          </p>

          <Card className="p-6 bg-secondary/5 border-l-4 border-l-secondary mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Objective Functions</h3>
            <p className="text-muted-foreground italic mb-3">
              "The choice of objective function is itself a modeling decision that deserves careful 
              consideration. Different objectives will lead to different 'optimal' parameter sets, 
              and no single metric captures all aspects of model performance. The objective function 
              should reflect what matters most for your specific application."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James cautioned against blindly adopting standard metrics without considering project 
              context. For flood management, peak accuracy may be paramount. For water supply, long-term 
              volumes matter most. For ecological applications, low-flow simulation could be critical. 
              Match your metrics to your decisions.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Observed Data] --> B[Model Predictions]
    A --> C[Objective Function]
    B --> C
    C --> D{Function Type}
    D -->|Single| E[Scalar Metric]
    D -->|Multi| F[Vector Metrics]
    E --> G[Optimization]
    F --> H[Pareto Solutions]
    G --> I[Best Parameters]
    H --> J[Trade-off Analysis]
    I --> K[Model Evaluation]
    J --> K
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Common Metrics</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Statistical Measures</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Nash-Sutcliffe efficiency</li>
                <li>• Root mean square error</li>
                <li>• Coefficient of determination</li>
                <li>• Percent bias</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Response Functions</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Peak flow accuracy</li>
                <li>• Volume conservation</li>
                <li>• Timing errors</li>
                <li>• Shape similarity</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4"><GlossaryTooltip term="Multi-Objective Optimization" /> Considerations</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Different objectives may conflict (e.g., peak vs. volume accuracy)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span><GlossaryTooltip term="Pareto-Optimal Solution">Pareto-optimal solutions</GlossaryTooltip> represent trade-offs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Weight selection should reflect stakeholder priorities</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Multi-Objective Calibration</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Watershed Model Calibration Challenge</h3>
            <p className="text-muted-foreground mb-4">
              Calibrating a continuous watershed model requires balancing multiple performance criteria:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Available Data:</strong> 3 years of 5-minute rainfall and flow data at watershed outlet
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Competing Objectives:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Nash-Sutcliffe Efficiency (NSE): Overall goodness of fit</li>
                  <li>• Peak Error: Critical for flood management</li>
                  <li>• Volume Error: Important for water balance</li>
                  <li>• Timing Error: Affects real-time response</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Results:</strong> Single-objective optimization (maximize NSE=0.85) produces 22% peak 
                underestimation. Multi-objective approach yields Pareto set: NSE=0.79 with peak error &lt;8% represents 
                better trade-off for flood management objectives. Decision depends on project priorities—no single 
                "best" solution exists.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Common Objective Functions</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Statistical Metrics</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <strong>NSE:</strong> -∞ to 1, 1=perfect fit</li>
                <li>• <strong>RMSE:</strong> Root mean square error (lower better)</li>
                <li>• <strong>R²:</strong> Explained variance (0 to 1)</li>
                <li>• <strong>PBIAS:</strong> Percent bias (volume error)</li>
                <li>• <strong>KGE:</strong> Kling-Gupta efficiency (balanced metric)</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Application-Specific</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Peak flow accuracy (flood design)</li>
                <li>• Baseflow index (ecology)</li>
                <li>• Water balance closure (mass conservation)</li>
                <li>• Flow duration curves (long-term patterns)</li>
                <li>• Event-specific metrics (pollutant loading)</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            No single objective function is universally best. Choice depends on modeling purpose: flood prediction 
            emphasizes peaks, water supply focuses on volumes, ecological studies need baseflow accuracy. 
            Multi-objective approaches acknowledge these trade-offs and provide solution sets rather than single answers.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What does Nash-Sutcliffe Efficiency (NSE) measure?",
                options: [
                  "Only peak flows",
                  "Overall goodness of fit compared to using mean as predictor",
                  "Computational speed",
                  "Model complexity"
                ],
                correctAnswer: 1,
                explanation: "NSE compares model predictions to using the mean of observations as a predictor. NSE=1 is perfect, NSE=0 means model performs no better than mean, NSE<0 means model is worse than using the mean."
              },
              {
                question: "Why use multi-objective calibration?",
                options: [
                  "It's easier",
                  "Different objectives may conflict; multi-objective reveals trade-offs",
                  "Single objectives are always wrong",
                  "To avoid making decisions"
                ],
                correctAnswer: 1,
                explanation: "Objectives often conflict (e.g., optimizing for peaks may worsen volume accuracy). Multi-objective approaches reveal these trade-offs through Pareto-optimal solutions, enabling informed decisions based on project priorities."
              },
              {
                question: "What is a Pareto-optimal solution?",
                options: [
                  "The single best solution",
                  "A solution where improving one objective worsens another",
                  "Always the highest NSE",
                  "The fastest computation"
                ],
                correctAnswer: 1,
                explanation: "Pareto-optimal solutions cannot be improved in one objective without worsening another. The Pareto set shows trade-offs between competing objectives, with no single solution being universally best."
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
              focusing on objective functions, performance metrics, and multi-objective calibration in hydrological modeling.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter9;