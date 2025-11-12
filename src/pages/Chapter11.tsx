import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter11 = () => {
  return (
    <ChapterLayout chapterNumber={11} title="Sensitivity Analysis">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Parameter Influence Assessment</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Sensitivity analysis identifies which parameters most strongly influence model outputs. 
            This guides data collection priorities, calibration efforts, and uncertainty analysis, 
            while revealing model behavior and potential issues.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Parameter Set] --&gt; B[Perturbation]
    B --&gt; C[Model Runs]
    C --&gt; D[Output Analysis]
    D --&gt; E{Sensitivity Metric}
    E --&gt;|Local| F[Gradient Method]
    E --&gt;|Global| G[Variance Method]
    F --&gt; H[Sensitivity Index]
    G --&gt; H
    H --&gt; I{Ranking}
    I --&gt;|High| J[Priority Parameters]
    I --&gt;|Low| K[Fixed Parameters]
    J --&gt; L[Focus Calibration]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Analysis Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Local Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• One-at-a-time variations</li>
                <li>• Partial derivatives</li>
                <li>• Linear approximations</li>
                <li>• Computationally efficient</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Global Sensitivity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Variance decomposition</li>
                <li>• Monte Carlo sampling</li>
                <li>• Parameter interactions</li>
                <li>• Full uncertainty space</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Identify parameters requiring precise measurement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Reduce dimensionality of calibration problem</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Understand model behavior and limitations</span>
            </li>
          </ul>
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter11;