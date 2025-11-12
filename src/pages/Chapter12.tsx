import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter12 = () => {
  return (
    <ChapterLayout chapterNumber={12} title="State Variable Space">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Mathematical Framework</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            State variable space provides a rigorous mathematical framework for representing system 
            dynamics. This approach enables systematic analysis of model behavior, parameter interactions, 
            and optimal control strategies.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[State Variables] --&gt; B[State Space]
    B --&gt; C[System Dynamics]
    C --&gt; D[Differential Equations]
    D --&gt; E[Numerical Solution]
    E --&gt; F{Analysis Type}
    F --&gt;|Stability| G[Equilibrium Points]
    F --&gt;|Control| H[Optimal Trajectory]
    F --&gt;|Sensitivity| I[Perturbation]
    G --&gt; J[System Understanding]
    H --&gt; J
    I --&gt; J
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Concepts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">State Variables</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Storage volumes</li>
                <li>• Flow rates</li>
                <li>• Water quality parameters</li>
                <li>• System conditions</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Sub-spaces</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Feasible region</li>
                <li>• Constraint boundaries</li>
                <li>• Objective contours</li>
                <li>• Optimal solutions</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Applications</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Real-time control system design</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>System stability analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Optimization problem formulation</span>
            </li>
          </ul>
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter12;