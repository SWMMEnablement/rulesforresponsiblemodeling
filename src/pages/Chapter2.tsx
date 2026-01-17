import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const Chapter2 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={2} title="Discretization & Complexity">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Understanding Discretization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            <GlossaryTooltip term="Discretization" /> is the fundamental process of transforming continuous spatial domains and temporal 
            processes into discrete units suitable for computational analysis. This transformation forms the 
            bridge between real-world hydrological phenomena and numerical simulation (James, 2005).
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The discretization process involves two critical dimensions: spatial subdivision of watersheds into 
            manageable computational elements, and temporal division of continuous time into discrete steps. 
            Both choices profoundly influence model accuracy, computational requirements, data needs, and the 
            ability to represent key physical processes. Understanding the <GlossaryTooltip term="CFL Condition" /> is 
            essential for ensuring numerical stability.
          </p>

          <Card className="p-6 bg-secondary/5 border-l-4 border-l-secondary mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Discretization Error</h3>
            <p className="text-muted-foreground italic mb-3">
              "Discretization error is often the largest source of model uncertainty, yet it is frequently 
              overlooked in favor of parameter uncertainty. The choice of spatial and temporal resolution 
              should be treated with the same rigor as parameter calibration."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James emphasized that discretization errors arise from approximating continuous processes 
              with discrete calculations. These errors can dominate total model uncertainty, particularly 
              when spatial or temporal gradients are steep—such as during flash flood events or in areas 
              with complex topography.
            </p>
          </Card>

          <Card className="p-6 bg-muted/50 border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-foreground mb-3">The Discretization Dilemma</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every modeler faces a fundamental trade-off: finer discretization captures more detail and 
              physical realism but demands more data, increases computational burden, and may introduce 
              additional parameter uncertainty. The art lies in finding the optimal balance for your specific 
              modeling objectives (James, 2005).
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Spatial Discretization Approaches</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Spatial discretization transforms a continuous watershed into discrete computational elements. 
            Several approaches exist, each with distinct advantages and limitations.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10 mb-8">
            <MermaidDiagram chart={`
graph TD
    A[Continuous System] --> B[Spatial Discretization]
    A --> C[Temporal Discretization]
    B --> D[Grid Cells/Elements]
    C --> E[Time Steps]
    D --> F[Resolution Trade-offs]
    E --> F
    F --> G{Balance Point}
    G -->|Too Coarse| H[Loss of Detail]
    G -->|Too Fine| I[Computational Cost]
    G -->|Optimal| J[Effective Model]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>

          <h3 className="text-2xl font-bold text-foreground mb-4">Subcatchment-Based Approach</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The <GlossaryTooltip term="Subcatchment" /> method divides the <GlossaryTooltip term="Watershed" /> into hydrologically homogeneous areas that drain to 
            specific nodes in the drainage network. This approach, commonly used in urban drainage models like 
            <GlossaryTooltip term="SWMM" />, balances computational efficiency with physical representation.
          </p>
          
          <Card className="p-6 bg-card mb-6">
            <h4 className="text-lg font-bold text-primary mb-3">Example: Urban Watershed Subdivision</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Consider a 5 km² urban catchment with a complex storm sewer network. A coarse discretization 
              might use 10-20 subcatchments, while fine discretization could employ 100+ subcatchments. Studies 
              show that subcatchment areas below 5 hectares (0.05 km²) often provide diminishing returns unless 
              highly localized phenomena are critical to objectives.
            </p>
            <p className="text-muted-foreground text-sm italic">
              The optimal subdivision depends on drainage network complexity, land use heterogeneity, and the 
              spatial scale of management decisions.
            </p>
          </Card>

          <h3 className="text-2xl font-bold text-foreground mb-4">Grid-Based Methods</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Grid-based discretization overlays a regular mesh (typically square cells) on the watershed. This 
            approach integrates naturally with GIS and remote sensing data but may not align with natural 
            drainage patterns.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-lg font-bold text-primary mb-3">Advantages</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Direct integration with raster GIS data</li>
                <li>• Consistent spatial representation</li>
                <li>• Simplified parameter assignment</li>
                <li>• Well-suited for overland flow routing</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h4 className="text-lg font-bold text-primary mb-3">Limitations</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• May not follow natural drainage boundaries</li>
                <li>• Potential stair-stepping artifacts</li>
                <li>• Higher computational requirements</li>
                <li>• Grid orientation sensitivity</li>
              </ul>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Temporal Discretization</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Temporal discretization involves selecting the time step (Δt) for numerical integration of model 
            equations. This choice affects numerical stability, accuracy, and computational efficiency.
          </p>

          <Card className="p-6 bg-muted/50 mb-6">
            <h3 className="text-xl font-bold text-foreground mb-3">The Courant-Friedrichs-Lewy (CFL) Condition</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For explicit numerical schemes solving flow equations, stability requires that the time step be 
              small enough that information doesn't propagate faster than the numerical scheme can handle. The 
              CFL number (C = v·Δt/Δx, where v is flow velocity, Δx is spatial discretization) should typically 
              be less than 1 for stability.
            </p>
            <p className="text-muted-foreground italic text-sm">
              This constraint often dictates minimum time step requirements in dynamic wave routing models.
            </p>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Event Simulation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                For individual storm events, time steps of 1-5 minutes are typical in urban drainage. Finer 
                resolution (30 seconds - 1 minute) may be needed for small, fast-responding catchments or 
                detailed hydraulic analysis.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Continuous Simulation</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Long-term continuous simulation often uses variable time steps: coarse (5-15 minutes) during 
                dry periods for efficiency, automatically reducing to finer steps during wet weather when 
                processes change rapidly (James, 2005).
              </p>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Model Complexity Considerations</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Complexity in hydrological modeling extends beyond discretization to include process representation, 
            parameter requirements, and data needs. Understanding the relationship between complexity, 
            uncertainty, and reliability is crucial for responsible modeling.
          </p>

          <h3 className="text-xl font-bold text-foreground mb-3">The Complexity-Uncertainty Trade-off</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            James (2005) emphasizes that increasing model complexity does not automatically improve predictions. 
            Beyond an optimal point, additional parameters and detail may increase <GlossaryTooltip term="Epistemic Uncertainty">uncertainty</GlossaryTooltip> due to:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span><strong>Parameter identifiability:</strong> More parameters make it harder to uniquely 
              determine optimal values from limited data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span><strong><GlossaryTooltip term="Equifinality" />:</strong> Multiple parameter sets may produce equally good fits to 
              observed data, reducing predictive confidence</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span><strong>Error accumulation:</strong> Each additional parameter introduces potential error 
              that propagates through the model</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary">•</span>
              <span><strong>Data limitations:</strong> Complex models require more calibration data, which may 
              not be available</span>
            </li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Practical Guidelines for Discretization</h2>
          <div className="space-y-4">
            {[
              {
                title: "Match to Objectives",
                desc: "Discretization should align with decision-making needs. If management occurs at the neighborhood scale, subcatchment-level detail suffices."
              },
              {
                title: "Consider Data Availability",
                desc: "Fine spatial discretization requires detailed parameter data. Don't discretize finer than your data can reliably support."
              },
              {
                title: "Respect Process Scales",
                desc: "Time steps should be small enough to capture the fastest relevant processes (typically infiltration or routing)."
              },
              {
                title: "Perform Sensitivity Analysis",
                desc: "Test how model outputs respond to changes in spatial and temporal resolution to identify optimal settings."
              },
              {
                title: "Balance Efficiency and Accuracy",
                desc: "For continuous simulation over years, computational efficiency matters. Use adaptive time-stepping when possible."
              }
            ].map((item, idx) => (
              <Card key={idx} className="p-4 border-l-4 border-l-primary">
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Case Study: Urban Catchment Discretization</h2>
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-bold text-primary mb-4">150-Hectare Mixed-Use Development</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A modeling study for a new 150-hectare development compared three discretization schemes:
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-muted/30 rounded">
                <p className="font-semibold text-foreground">Coarse (10 subcatchments, 5-min timestep)</p>
                <p className="text-sm text-muted-foreground">Fast computation, captured peak flows within 8%, 
                missed localized flooding patterns</p>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <p className="font-semibold text-foreground">Medium (45 subcatchments, 2-min timestep)</p>
                <p className="text-sm text-muted-foreground">Good balance, peak flows within 3%, identified most 
                critical locations, 5x computational cost</p>
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <p className="font-semibold text-foreground">Fine (200 subcatchments, 30-sec timestep)</p>
                <p className="text-sm text-muted-foreground">Highest detail but required extensive parameter 
                data, only marginally better than medium, 40x computational cost</p>
              </div>
            </div>
            <p className="text-muted-foreground italic text-sm">
              The medium discretization was selected as optimal, providing sufficient detail for decision-making 
              without excessive computational burden or data demands.
            </p>
          </Card>
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
              with focus on understanding and quantifying model uncertainty in hydrological applications.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the primary challenge in discretization?",
                options: [
                  "Making models as complex as possible",
                  "Balancing detail with computational efficiency and data availability",
                  "Using the finest possible resolution always",
                  "Avoiding spatial subdivision"
                ],
                correctAnswer: 1,
                explanation: "The primary challenge is finding the optimal balance between model detail, computational efficiency, and available data quality - finer isn't always better."
              },
              {
                question: "What does the CFL condition relate to?",
                options: [
                  "Spatial discretization only",
                  "Numerical stability in time-stepping schemes",
                  "Parameter estimation",
                  "Data quality"
                ],
                correctAnswer: 1,
                explanation: "The Courant-Friedrichs-Lewy condition ensures numerical stability by requiring that the time step be small enough relative to spatial discretization and flow velocities."
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

export default Chapter2;