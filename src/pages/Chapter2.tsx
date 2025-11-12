import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter2 = () => {
  return (
    <ChapterLayout chapterNumber={2} title="Discretization & Complexity">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Spatial and Temporal Resolution</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Discretization involves breaking down continuous systems into discrete spatial and temporal units 
            that can be computationally modeled. The choice of resolution significantly impacts model accuracy, 
            computational cost, and data requirements.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Continuous System] --&gt; B[Spatial Discretization]
    A --&gt; C[Temporal Discretization]
    B --&gt; D[Grid Cells/Elements]
    C --&gt; E[Time Steps]
    D --&gt; F[Resolution Trade-offs]
    E --&gt; F
    F --&gt; G{Balance Point}
    G --&gt;|Too Coarse| H[Loss of Detail]
    G --&gt;|Too Fine| I[Computational Cost]
    G --&gt;|Optimal| J[Effective Model]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Considerations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Spatial Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Watershed subdivision methods</li>
                <li>• Sub-catchment delineation</li>
                <li>• Grid vs. element approaches</li>
                <li>• GIS integration requirements</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Temporal Complexity</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Time step selection criteria</li>
                <li>• Event vs. continuous simulation</li>
                <li>• Stability considerations</li>
                <li>• Data storage requirements</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Match discretization to data availability and modeling objectives</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Consider computational resources when selecting resolution</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Perform sensitivity analysis on discretization choices</span>
            </li>
          </ul>
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter2;