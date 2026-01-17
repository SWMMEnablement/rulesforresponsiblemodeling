import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const Chapter8 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={8} title="Decision Support">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">PCSWMM and Software Tools</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Decision support systems integrate modeling capabilities with user-friendly interfaces, 
            visualization tools, and scenario analysis features. <GlossaryTooltip term="PCSWMM" /> exemplifies modern approaches 
            to practical urban drainage modeling and management, built on the <GlossaryTooltip term="SWMM" /> computational engine 
            with enhanced <GlossaryTooltip term="GIS" /> integration.
          </p>

          <Card className="p-6 bg-secondary/5 border-l-4 border-l-secondary mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Dr. James on Decision Support Systems</h3>
            <p className="text-muted-foreground italic mb-3">
              "A decision support system is more than a model with a pretty interface. It is a framework 
              that integrates data management, modeling, analysis, and communication into a coherent 
              workflow that supports the entire decision-making process—from problem definition through 
              implementation monitoring."
            </p>
            <p className="text-sm text-muted-foreground">
              Dr. James, as a key developer of PCSWMM at CHI, emphasized that effective decision support 
              bridges the gap between sophisticated modeling capabilities and practical decision-making needs. 
              The system should guide users toward appropriate methods while maintaining transparency about 
              underlying assumptions and limitations.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[User Interface] --> B[Model Setup]
    B --> C[Data Input]
    C --> D[SWMM Engine]
    D --> E[Simulation]
    E --> F[Results]
    F --> G[Visualization]
    F --> H[Analysis Tools]
    G --> I[Decision Making]
    H --> I
    I --> J{Scenarios}
    J -->|Iterate| B
    J -->|Finalize| K[Implementation]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Tool Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Integration</h3>
              <p className="text-muted-foreground text-sm">GIS connectivity, database management, CAD import/export</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Visualization</h3>
              <p className="text-muted-foreground text-sm">Time series plots, spatial maps, animation capabilities</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">Analysis</h3>
              <p className="text-muted-foreground text-sm">Sensitivity, calibration, optimization, reporting</p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Benefits</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Streamlined workflow from data to decisions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Scenario comparison and trade-off analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Stakeholder communication through visualization</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Practical Example: PCSWMM Application</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Case Study: Real-Time Control Optimization</h3>
            <p className="text-muted-foreground mb-4">
              A municipality implements adaptive control for combined sewer overflow (CSO) reduction:
            </p>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="p-3 bg-background rounded">
                <strong>Model Setup:</strong> 450 subcatchments, 600 conduits, 12 storage facilities with controllable 
                gates in PCSWMM environment
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Decision Support Features:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Real-time rainfall radar integration</li>
                  <li>• 6-hour forecast-based gate operations</li>
                  <li>• Multi-objective optimization (CSO volume, flood risk, treatment capacity)</li>
                  <li>• Scenario comparison dashboard for operators</li>
                  <li>• Automated report generation</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Results:</strong> First-year implementation achieves 35% CSO volume reduction compared to 
                static control. Visualization tools enable operators to understand system response and build 
                confidence in automated recommendations. Cost-benefit analysis justifies infrastructure investment.
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Decision Support System Components</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Data Integration</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• GIS and CAD connectivity</li>
                <li>• Real-time sensor networks (SCADA)</li>
                <li>• Weather forecast services</li>
                <li>• Asset management databases</li>
                <li>• Historical records and archives</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">User Interface</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Interactive mapping and visualization</li>
                <li>• Scenario management tools</li>
                <li>• Automated calibration wizards</li>
                <li>• Custom report templates</li>
                <li>• Stakeholder communication features</li>
              </ul>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Modern decision support systems like PCSWMM bridge the gap between complex hydrological models and 
            practical decision-making. They provide user-friendly interfaces that enable engineers and operators 
            to leverage sophisticated modeling capabilities without requiring deep expertise in numerical methods 
            or programming.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the primary purpose of decision support systems in modeling?",
                options: [
                  "To replace engineers",
                  "To integrate modeling with user-friendly tools for practical decision-making",
                  "To make models more complex",
                  "Only for visualization"
                ],
                correctAnswer: 1,
                explanation: "Decision support systems integrate modeling capabilities with accessible interfaces, visualization, and analysis tools to support practical decision-making by engineers and managers without requiring deep technical expertise."
              },
              {
                question: "How does PCSWMM enhance EPA SWMM?",
                options: [
                  "It doesn't add anything",
                  "Adds GIS integration, visualization, calibration tools, and user-friendly interface",
                  "Only makes it slower",
                  "Removes features"
                ],
                correctAnswer: 1,
                explanation: "PCSWMM enhances EPA SWMM by adding GIS connectivity, advanced visualization, automated calibration, scenario management, and a comprehensive user interface while maintaining the powerful SWMM computational engine."
              },
              {
                question: "What makes scenario analysis valuable in decision support?",
                options: [
                  "It's faster than single runs",
                  "Enables comparison of alternatives, trade-off evaluation, and uncertainty assessment",
                  "Not valuable",
                  "Only for reporting"
                ],
                correctAnswer: 1,
                explanation: "Scenario analysis allows comparison of management alternatives, evaluation of trade-offs between objectives, assessment of uncertainty impacts, and communication of options to stakeholders for informed decision-making."
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
              focusing on decision support systems, PCSWMM applications, and practical tools for water management modeling.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    <Footer />
    </>
  );
};

export default Chapter8;