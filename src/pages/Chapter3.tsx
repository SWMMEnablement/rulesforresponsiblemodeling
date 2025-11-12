import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const Chapter3 = () => {
  return (
    <ChapterLayout chapterNumber={3} title="Reliability of Input">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Data Quality Management</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The reliability of model inputs directly affects output credibility. This chapter addresses 
            data categorization, quality assessment, uncertainty handling, and the critical role of GIS 
            in managing spatial data for hydrological models.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Data Sources] --&gt; B{Quality Check}
    B --&gt;|Pass| C[Data Categories]
    B --&gt;|Fail| D[Data Correction]
    D --&gt; B
    C --&gt; E[GIS Integration]
    C --&gt; F[Statistical Analysis]
    C --&gt; G[Uncertainty Quantification]
    E --&gt; H[Model Input]
    F --&gt; H
    G --&gt; H
    H --&gt; I[Documentation]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style I fill:#10b981,stroke:#059669,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Data Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Physical Data</h3>
              <p className="text-muted-foreground text-sm">Topography, soil properties, land use, drainage network characteristics</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Meteorological Data</h3>
              <p className="text-muted-foreground text-sm">Rainfall, temperature, evaporation, wind patterns</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Hydrological Data</h3>
              <p className="text-muted-foreground text-sm">Flow measurements, water levels, quality parameters</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">GIS Concepts in Modeling</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Spatial data layers for catchment characteristics</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Automated parameter extraction from digital terrain models</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>File management and metadata documentation standards</span>
            </li>
          </ul>
        </section>
      </div>
    </ChapterLayout>
  );
};

export default Chapter3;