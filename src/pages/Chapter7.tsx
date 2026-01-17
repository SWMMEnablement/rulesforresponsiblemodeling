import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";
import { SoftwareExamples } from "@/components/SoftwareExamples";

const Chapter7 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={7} title="Dynamic Rain Systems">
      <div className="space-y-12">
        <div className="flex justify-center mb-8">
          <SoftwareExamples chapterNumber={7} />
        </div>
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Storm Cell Kinematics</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Moving <GlossaryTooltip term="Storm Cell" /> systems introduce spatial and temporal variability that significantly impacts 
            urban drainage response. Understanding storm velocity, direction, and timing uncertainties 
            is crucial for accurate flood prediction. The <GlossaryTooltip term="Time of Concentration" /> concept is 
            particularly important for dynamic rainfall analysis.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Storm Cell] --> B[Movement Vector]
    B --> C[Velocity]
    B --> D[Direction]
    C --> E[Catchment Response]
    D --> E
    E --> F{Peak Timing}
    F -->|Early| G[Different Hydrograph]
    F -->|Late| H[Different Hydrograph]
    F -->|Optimal| I[Critical Condition]
    G --> J[Sensitivity Analysis]
    H --> J
    I --> J
    
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
              <h3 className="text-xl font-bold text-primary mb-3"><GlossaryTooltip term="Catchment" /> Response</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• <GlossaryTooltip term="Time of Concentration" /> effects</li>
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

          <Card className="p-6 bg-background/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Spatial Rainfall</h3>
            <p className="text-muted-foreground italic mb-3">
              "Urban watersheds are often smaller than individual storm cells. This means the spatial 
              structure and movement of rainfall across the catchment can dramatically affect peak flows—
              sometimes more than total rainfall depth. Models that ignore storm kinematics may 
              seriously underestimate or overestimate flood risk."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James's research demonstrated that storm velocity and direction interact with catchment 
              geometry to produce widely varying responses. Conservative design should evaluate critical 
              storm paths rather than assuming uniform or stationary rainfall.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: Critical Storm Path Analysis</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Flood Peak Sensitivity to Storm Motion</h3>
            <p className="text-muted-foreground mb-4">
              A 12 km² urban watershed analysis evaluates how storm velocity affects peak discharge:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Storm Characteristics:</strong> 50mm total depth, 60-minute duration, 3km cell diameter
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Velocity Analysis:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Stationary (0 km/h): Peak = 45 m³/s at t=80 min</li>
                  <li>• Slow motion (20 km/h upstream): Peak = 38 m³/s at t=95 min</li>
                  <li>• Critical velocity (35 km/h downstream): Peak = 67 m³/s at t=65 min (MAXIMUM)</li>
                  <li>• Fast motion (60 km/h): Peak = 52 m³/s at t=55 min</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Findings:</strong> When storm velocity matches <GlossaryTooltip term="Catchment" /> <GlossaryTooltip term="Time of Concentration">time of concentration</GlossaryTooltip> (35 km/h downstream), 
                <GlossaryTooltip term="Runoff" /> from all <GlossaryTooltip term="Subcatchment">subcatchments</GlossaryTooltip> synchronizes at outlet, producing 49% higher peak than stationary storm. 
                Design must consider this critical condition, not just stationary assumption.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Uncertainty Analysis Methods</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Storm Motion Uncertainty</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Radar-based velocity estimation</li>
                <li>• Historical storm tracking data</li>
                <li>• Seasonal and regional patterns</li>
                <li>• Ensemble forecasts for real-time</li>
                <li>• Monte Carlo simulation of paths</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Response Characterization</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Time of concentration calculation</li>
                <li>• Critical velocity identification</li>
                <li>• Sensitivity to direction</li>
                <li>• Sub-catchment synchronization</li>
                <li>• Confidence bounds on peaks</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Understanding storm kinematics is crucial for emergency response and infrastructure design. Real-time 
            systems must account for storm motion uncertainty when issuing flood warnings. Design analyses should 
            evaluate critical storm paths that produce maximum loading on drainage systems.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the critical storm velocity?",
                options: [
                  "The fastest possible storm speed",
                  "The velocity that causes maximum synchronization of catchment runoff",
                  "Always zero (stationary)",
                  "The slowest storm movement"
                ],
                correctAnswer: 1,
                explanation: "Critical storm velocity occurs when the storm movement matches the catchment time of concentration, causing runoff from all parts of the watershed to arrive simultaneously at the outlet, maximizing peak flow."
              },
              {
                question: "Why does storm direction matter for peak flows?",
                options: [
                  "It doesn't affect peaks",
                  "Downstream-moving storms can synchronize runoff; upstream-moving storms spread it out",
                  "Only intensity matters",
                  "Direction only affects volume"
                ],
                correctAnswer: 1,
                explanation: "Downstream-moving storms at critical velocity cause runoff synchronization and higher peaks. Upstream-moving storms desynchronize runoff, spreading it over time and reducing peak flows."
              },
              {
                question: "How should design account for storm motion uncertainty?",
                options: [
                  "Ignore it completely",
                  "Evaluate critical storm paths and directions producing maximum loading",
                  "Always assume stationary storms",
                  "Only use historical storm tracks"
                ],
                correctAnswer: 1,
                explanation: "Conservative design should evaluate critical storm paths, velocities, and directions that produce maximum loading, not just assume stationary storms which may underestimate peak flows."
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
              focusing on dynamic rain systems, storm cell kinematics, and timing uncertainty in hydrological modeling.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter7;