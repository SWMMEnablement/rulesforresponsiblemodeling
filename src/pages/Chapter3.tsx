import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Chapter3 = () => {
  return (
    <>
      <Navigation />
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
    A[Data Sources] --> B{Quality Check}
    B -->|Pass| C[Data Categories]
    B -->|Fail| D[Data Correction]
    D --> B
    C --> E[GIS Integration]
    C --> F[Statistical Analysis]
    C --> G[Uncertainty Quantification]
    E --> H[Model Input]
    F --> H
    G --> H
    H --> I[Documentation]
    
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

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Urban Catchment Data Assessment</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Downtown Drainage System</h3>
            <p className="text-muted-foreground mb-4">
              A 250-hectare urban catchment requires model development for flood management. Data assessment reveals:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Physical Data:</strong> High-quality GIS layers with 2m resolution DTM (excellent)</li>
              <li><strong>Rainfall Data:</strong> 15-minute rain gauge data with 5% missing values (good with interpolation)</li>
              <li><strong>Flow Data:</strong> Single downstream gauge with occasional sensor drift (requires quality control)</li>
              <li><strong>Land Use:</strong> Outdated by 3 years, significant new development (needs field verification)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              The modeler documents each limitation, implements data correction procedures, and quantifies uncertainty 
              impacts through sensitivity analysis. Missing rainfall values are filled using nearby stations with documented 
              correlation coefficients.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Statistical Analysis Methods</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Quality Control Tests</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Range checking (min/max values)</li>
                <li>• Consistency checks (mass balance)</li>
                <li>• Outlier detection (z-scores, box plots)</li>
                <li>• Temporal coherence (rate of change)</li>
                <li>• Cross-validation with nearby stations</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Uncertainty Quantification</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Measurement error estimation</li>
                <li>• Propagation through model chain</li>
                <li>• Monte Carlo simulation</li>
                <li>• Confidence interval calculation</li>
                <li>• Sensitivity to data quality</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Systematic statistical analysis helps identify problematic data points, assess overall data quality, 
            and provide quantitative measures of reliability. This information directly informs model calibration 
            strategies and uncertainty bounds on predictions.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the most critical factor affecting input data reliability?",
                options: [
                  "File format",
                  "Systematic documentation of sources, methods, and quality checks",
                  "Computer storage capacity",
                  "Graphical presentation"
                ],
                correctAnswer: 1,
                explanation: "Systematic documentation of data sources, collection methods, and quality control procedures is essential for assessing and maintaining input data reliability throughout the modeling process."
              },
              {
                question: "How should missing rainfall data best be handled?",
                options: [
                  "Ignore the gaps and proceed",
                  "Fill with zeros",
                  "Use correlation with nearby stations and document the method",
                  "Delete the entire dataset"
                ],
                correctAnswer: 2,
                explanation: "Missing data should be filled using validated methods like correlation with nearby stations, and the approach must be documented with uncertainty quantification to maintain transparency."
              },
              {
                question: "Why is GIS integration important for hydrological modeling?",
                options: [
                  "It makes prettier maps",
                  "It enables systematic extraction of spatial parameters and maintains data consistency",
                  "It is not important",
                  "Only for large watersheds"
                ],
                correctAnswer: 1,
                explanation: "GIS integration allows systematic extraction of catchment characteristics, maintains spatial consistency, enables parameter updates, and provides essential documentation of physical model inputs."
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
              focusing on data reliability, quality assessment, and the critical role of GIS in managing 
              hydrological model inputs.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter3;