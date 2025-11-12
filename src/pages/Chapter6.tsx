import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter6 = () => {
  return (
    <ChapterLayout chapterNumber={6} title="Rain Input Generation">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Stochastic Rainfall Models</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            When historical rainfall data is limited or synthetic scenarios are needed, stochastic 
            models generate statistically similar rainfall patterns. Disaggregation techniques convert 
            coarse temporal data into finer resolution needed for event modeling.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Historical Data] --&gt; B[Statistical Analysis]
    B --&gt; C[Parameter Extraction]
    C --&gt; D{Model Type}
    D --&gt;|Stochastic| E[Random Generation]
    D --&gt;|Disaggregation| F[Temporal Refinement]
    E --&gt; G[Synthetic Rainfall]
    F --&gt; G
    G --&gt; H[Validation]
    H --&gt; I{Statistics Match?}
    I --&gt;|No| C
    I --&gt;|Yes| J[Model Application]
    
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
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter6;