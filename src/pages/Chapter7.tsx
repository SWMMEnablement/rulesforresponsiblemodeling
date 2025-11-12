import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter7 = () => {
  return (
    <ChapterLayout chapterNumber={7} title="Dynamic Rain Systems">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Storm Cell Kinematics</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Moving storm systems introduce spatial and temporal variability that significantly impacts 
            urban drainage response. Understanding storm velocity, direction, and timing uncertainties 
            is crucial for accurate flood prediction.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Storm Cell] --&gt; B[Movement Vector]
    B --&gt; C[Velocity]
    B --&gt; D[Direction]
    C --&gt; E[Catchment Response]
    D --&gt; E
    E --&gt; F{Peak Timing}
    F --&gt;|Early| G[Different Hydrograph]
    F --&gt;|Late| H[Different Hydrograph]
    F --&gt;|Optimal| I[Critical Condition]
    G --&gt; J[Sensitivity Analysis]
    H --&gt; J
    I --&gt; J
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Factors</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Storm Characteristics</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Translation velocity</li>
                <li>• Movement direction</li>
                <li>• Cell dimensions</li>
                <li>• Intensity distribution</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Catchment Response</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Time of concentration effects</li>
                <li>• Spatial rainfall patterns</li>
                <li>• Critical storm paths</li>
                <li>• Peak flow sensitivity</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Timing Error Analysis</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Radar tracking for storm motion estimation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Uncertainty propagation through the model chain</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Critical duration and path identification</span>
            </li>
          </ul>
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter7;