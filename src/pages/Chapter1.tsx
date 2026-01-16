import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlossaryTooltip } from "@/components/GlossaryTooltip";

const Chapter1 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={1} title="Introduction">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">What is a Model?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A model is a simplified representation of a complex system designed to help us understand, predict, 
            and make decisions about real-world phenomena. In hydrological and environmental modeling, we create 
            mathematical representations of water systems to solve practical problems.
          </p>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Models are essential tools in modern engineering and science. They allow us to:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6 mb-6">
              <li><strong>Test hypotheses</strong> without expensive field experiments</li>
              <li><strong>Predict future conditions</strong> under various scenarios</li>
              <li><strong>Optimize designs</strong> for infrastructure and management systems</li>
              <li><strong>Understand complex interactions</strong> between system components</li>
              <li><strong>Communicate</strong> technical concepts to stakeholders and decision-makers</li>
            </ul>
            
            <p className="text-muted-foreground leading-relaxed mb-4">
              In the context of urban drainage and hydrological systems, models range from simple empirical 
              equations to sophisticated computer simulations. The key is not to create the most complex model 
              possible, but rather to develop an appropriate representation that serves your specific purpose 
              while being defensible and transparent. Understanding concepts like <GlossaryTooltip term="Calibration" />, 
              <GlossaryTooltip term="Validation" />, and <GlossaryTooltip term="Uncertainty Analysis" /> is essential 
              for responsible modeling practice.
            </p>

            <Card className="p-6 bg-primary/5 border-l-4 border-l-primary mb-6">
              <h3 className="text-lg font-bold text-foreground mb-2">George Box's Famous Quote</h3>
              <p className="text-muted-foreground italic">
                "All models are wrong, but some are useful."
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                This statement captures the essence of modeling philosophy: we don't seek perfection, 
                we seek utility. A model's value lies not in its ability to perfectly replicate reality, 
                but in its capacity to provide insights and support decision-making.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph LR
    A[Real World System] --> B[Conceptualization]
    B --> C[Mathematical Model]
    C --> D[Computer Implementation]
    D --> E[Predictions & Decisions]
    E --> F[Validation Check]
    F --Refine--> B
    F --Acceptable--> G[Application]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style G fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>

          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">The Modeling Process</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="text-lg font-bold text-primary mb-3">1. Problem Definition</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Begin by clearly articulating what questions the model needs to answer. Is it for 
                  design, operation, planning, or compliance? Define success criteria and acceptable 
                  levels of uncertainty.
                </p>
                <p className="text-muted-foreground text-sm italic">
                  Example: "Predict peak flows for a 25-year storm to design detention basin capacity."
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-bold text-primary mb-3">2. Conceptual Model</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Develop a simplified representation of the physical system, identifying key processes, 
                  boundaries, and assumptions. This step requires understanding the dominant hydrological 
                  processes at your site.
                </p>
                <p className="text-muted-foreground text-sm italic">
                  Example: "Urban catchment with impervious surfaces, inlet time of 10 minutes, runoff routing through pipes."
                </p>
              </Card>

              <Card className="p-6">
              <h4 className="text-lg font-bold text-primary mb-3">3. Mathematical Formulation</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Translate the conceptual model into equations. This might include empirical relationships 
                  (e.g., <GlossaryTooltip term="Manning's Roughness">Manning's equation</GlossaryTooltip>) or physically-based equations (e.g., Saint-Venant equations).
                </p>
                <p className="text-muted-foreground text-sm italic">
                  Example: "Use kinematic wave routing for overland flow and dynamic wave for pipe network."
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-bold text-primary mb-3">4. Implementation & Calibration</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Implement the model in software, gather input data, and adjust parameters to match 
                  observed behavior. Calibration should be systematic and documented, not arbitrary tuning.
                </p>
                <p className="text-muted-foreground text-sm italic">
                  Example: "Adjust roughness coefficients to match observed peak flows within ±15%."
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Rules for Responsible Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            William James established these foundational principles to ensure models serve their intended 
            purpose while maintaining scientific integrity and stakeholder trust. Each rule represents 
            decades of lessons learned from modeling practice across diverse applications.
          </p>
          
          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Define the Modeling Objectives Clearly</h3>
                  <p className="text-muted-foreground mb-3">
                    Before writing a single equation or gathering data, articulate precisely what decisions 
                    the model will inform. Vague objectives lead to unfocused models that waste resources 
                    and fail to deliver actionable insights.
                  </p>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm font-semibold text-foreground mb-2">Case Study: Detention Basin Design</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Poor objective:</strong> "Model the watershed hydrology"
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Clear objective:</strong> "Determine minimum detention volume to maintain post-development 
                      peak discharge at or below pre-development levels for the 2, 10, and 25-year storm events, 
                      accounting for climate change projections through 2050."
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      The clear objective drives every subsequent modeling decision: temporal resolution, 
                      spatial discretization, required calibration accuracy, and acceptable uncertainty bounds.
                    </p>
                  </Card>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Choose Appropriate Model Complexity</h3>
                  <p className="text-muted-foreground mb-3">
                    More complex models are not inherently better. Each additional parameter increases 
                    uncertainty and data requirements. The principle of <GlossaryTooltip term="Parsimony" /> suggests using the 
                    simplest model that adequately addresses your objectives.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm font-semibold text-foreground mb-2">When Simpler is Better</p>
                      <p className="text-sm text-muted-foreground">
                        For preliminary design of a small urban catchment (&lt;50 acres), a rational method 
                        calculation may suffice. Adding a full hydrodynamic model with 50+ parameters 
                        introduces uncertainty that exceeds the benefit, especially if calibration data is limited.
                      </p>
                    </Card>
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm font-semibold text-foreground mb-2">When Complexity is Justified</p>
                      <p className="text-sm text-muted-foreground">
                        For real-time flood forecasting in a complex urban system with backwater effects 
                        and tide interactions, a fully dynamic 1D/2D model may be necessary. The added 
                        complexity is justified by the decision stakes and available monitoring data.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Ensure Data Quality and Reliability</h3>
                  <p className="text-muted-foreground mb-3">
                    Your model output can never be more reliable than your input data. Invest time in 
                    data quality assurance, document data sources, understand measurement uncertainties, 
                    and maintain data provenance throughout the modeling process.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Rainfall data:</strong> Check gauge locations, temporal resolution, missing data patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Topography:</strong> Verify survey dates, vertical datum, and accuracy specifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Land use:</strong> Confirm classification scheme matches model requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Infrastructure data:</strong> Field-verify critical pipe sizes, invert elevations, and conditions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Quantify and Communicate Uncertainty</h3>
                  <p className="text-muted-foreground mb-3">
                    All predictions contain uncertainty from input data, parameters, and model structure. 
                    Responsible modelers quantify these uncertainties and communicate them clearly to 
                    decision-makers, avoiding false precision.
                  </p>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Instead of reporting: "The 100-year peak flow is 142.7 cfs"
                      <br /><br />
                      Report: "The 100-year peak flow is estimated at 140 cfs, with a 90% <GlossaryTooltip term="Confidence Interval">confidence 
                      interval</GlossaryTooltip> of 115 to 170 cfs, based on <GlossaryTooltip term="Monte Carlo Simulation" /> analysis of parameter and rainfall 
                      uncertainties."
                    </p>
                  </Card>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Validate with Independent Data</h3>
                  <p className="text-muted-foreground mb-3">
                    Calibration shows that your model can reproduce observed behavior. Validation proves 
                    it can predict new conditions. Never validate on the same data used for calibration—this 
                    tests memorization, not predictive capability.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong><GlossaryTooltip term="Split-Sample Validation" />:</strong> Use 70% of events for calibration, reserve 30% for validation</p>
                    <p><strong>Spatial validation:</strong> Calibrate to one gauge, validate against another</p>
                    <p><strong>Temporal validation:</strong> Calibrate to one time period, validate on a different period</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg shrink-0">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Document Assumptions and Limitations</h3>
                  <p className="text-muted-foreground mb-3">
                    Every model rests on assumptions. Document them explicitly so users understand the 
                    model's appropriate domain of application. When conditions violate your assumptions, 
                    the model's predictions become unreliable.
                  </p>
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm font-semibold text-foreground mb-2">Essential Documentation</p>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Spatial and temporal scales of applicability</li>
                      <li>• Physical processes included and excluded</li>
                      <li>• Data sources and quality limitations</li>
                      <li>• Calibration events and achieved accuracy</li>
                      <li>• Known sensitivities and failure modes</li>
                      <li>• Appropriate and inappropriate uses</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Applications of Hydrological Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Hydrological models serve diverse applications across engineering, planning, and environmental management. 
            Understanding the specific requirements of each application type guides model selection and development.
          </p>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Urban Drainage Systems</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Models of urban drainage systems help engineers design infrastructure, predict flooding, 
                and manage stormwater in developed areas where natural hydrological processes are significantly altered.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Typical Applications:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Sizing pipes, inlets, and detention facilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Predicting flood extents and depths</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Evaluating green infrastructure performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Real-time control of storage and pumping</span>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm font-semibold text-foreground mb-2">Example Project</p>
                  <p className="text-sm text-muted-foreground">
                    A 500-acre mixed-use development requires detention to meet local ordinances. 
                    The model simulates pre- and post-development hydrology for design storms, 
                    sizing detention to limit peak discharge increases. Continuous simulation 
                    evaluates water quality performance over a 30-year rainfall record.
                  </p>
                </Card>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Water Quality Modeling</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Water quality models track pollutant fate and transport, supporting regulatory compliance, 
                treatment system design, and environmental impact assessment.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Key Processes Modeled:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Pollutant buildup and washoff from surfaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>In-stream transport and mixing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Chemical and biological transformations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>BMP treatment efficiency</span>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm font-semibold text-foreground mb-2">Example Project</p>
                  <p className="text-sm text-muted-foreground">
                    An industrial park must demonstrate compliance with Total Maximum Daily Load (TMDL) 
                    requirements for copper and zinc. The model simulates runoff quality from different 
                    land uses, treatment in bioretention cells, and loading to the receiving stream 
                    over 20 years of rainfall.
                  </p>
                </Card>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-3">Watershed Management</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Watershed-scale models integrate multiple processes across large areas, supporting 
                regional planning, ecosystem management, and policy development.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-sm">Management Questions:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>How will land use change affect streamflow?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>Where should we prioritize restoration?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>What are the effects of climate change?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>How do we allocate water resources?</span>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm font-semibold text-foreground mb-2">Example Project</p>
                  <p className="text-sm text-muted-foreground">
                    A 200-square-mile watershed faces competing demands from agriculture, urban growth, 
                    and endangered species habitat. The model evaluates scenarios of land use change, 
                    water use, and conservation measures over 30 years under climate change projections, 
                    informing the regional comprehensive plan.
                  </p>
                </Card>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Real-World Case Study: Combined Sewer Overflow Control</h2>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="text-xl font-bold text-foreground mb-3">City of Springfield CSO Reduction Project</h3>
            
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Background</h4>
                <p className="text-sm">
                  Springfield's combined sewer system serves 150,000 residents and overflows approximately 
                  40 times per year during wet weather, discharging untreated sewage to the river. The EPA 
                  consent decree requires reducing overflow frequency to no more than 4 times per year.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Modeling Approach</h4>
                <p className="text-sm mb-2">
                  A comprehensive <GlossaryTooltip term="SWMM" /> model was developed representing:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 45 square miles of tributary area with detailed land use mapping</li>
                  <li>• 280 miles of combined sewers and 15 miles of separate storm sewers</li>
                  <li>• Three treatment plants with detailed capacity and operational constraints</li>
                  <li>• 12 regulator structures and tide effects at the river outfalls</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2"><GlossaryTooltip term="Calibration" /> and <GlossaryTooltip term="Validation" /></h4>
                <p className="text-sm">
                  The model was calibrated to 8 monitored storm events over 2 years, comparing predicted 
                  and observed flows at 6 gauged locations and overflow volumes at 12 CSO points.
                  Validation used an independent set of 5 events, achieving Nash-Sutcliffe efficiency 
                  coefficients above 0.75 at all calibration points.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Scenario Analysis</h4>
                <p className="text-sm mb-2">
                  The calibrated model evaluated 15 potential solutions over 25 years of historical rainfall:
                </p>
                <div className="grid md:grid-cols-3 gap-3 mt-3">
                  <Card className="p-3 bg-background">
                    <p className="text-xs font-semibold text-foreground mb-1">Storage Tunnels</p>
                    <p className="text-xs">$280M capital cost</p>
                    <p className="text-xs">Reduces to 3 overflows/year</p>
                  </Card>
                  <Card className="p-3 bg-background">
                    <p className="text-xs font-semibold text-foreground mb-1">Green Infrastructure</p>
                    <p className="text-xs">$180M capital cost</p>
                    <p className="text-xs">Reduces to 8 overflows/year</p>
                  </Card>
                  <Card className="p-3 bg-background">
                    <p className="text-xs font-semibold text-foreground mb-1">Hybrid Approach</p>
                    <p className="text-xs">$210M capital cost</p>
                    <p className="text-xs">Reduces to 4 overflows/year</p>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Decision and Implementation</h4>
                <p className="text-sm">
                  The city selected the hybrid approach, combining 8 million gallons of tunnel storage 
                  with 500 acres of green infrastructure. The model supported detailed design, continues 
                  to be used for adaptive management, and is updated annually with monitoring data. 
                  After 3 years of implementation, actual overflow frequency matches model predictions 
                  within the uncertainty bounds identified during validation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Lessons Learned</h4>
                <ul className="text-sm space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Extensive monitoring was essential - initial model predictions had 30% errors before calibration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Stakeholder engagement throughout modeling built trust in results and the decision process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Clear documentation enabled third-party review and EPA approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Uncertainty analysis revealed that all alternatives met the requirement with &gt;90% confidence</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Models are tools for understanding and decision-making, not absolute truth</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Responsible modeling requires transparency about limitations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>The goal is insight and informed decisions, not perfect predictions</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Test Your Knowledge</h2>
          <Quiz
            questions={[
              {
                question: "What is the primary purpose of responsible modeling?",
                options: [
                  "To create the most complex model possible",
                  "To develop defensible, credible models for decision-making",
                  "To avoid stakeholder engagement",
                  "To maximize computational efficiency"
                ],
                correctAnswer: 1,
                explanation: "Responsible modeling aims to create defensible, credible models that support effective decision-making while maintaining transparency and stakeholder trust."
              },
              {
                question: "Which is NOT one of the key principles of responsible modeling?",
                options: [
                  "Transparency",
                  "Stakeholder engagement",
                  "Model complexity maximization",
                  "Uncertainty characterization"
                ],
                correctAnswer: 2,
                explanation: "Model complexity should be appropriate to the problem, not maximized. The key principles include transparency, stakeholder engagement, and proper uncertainty characterization."
              },
              {
                question: "Why is stakeholder engagement important in modeling?",
                options: [
                  "It slows down the modeling process",
                  "It ensures models address real needs and build trust",
                  "It is not important",
                  "It only matters for academic models"
                ],
                correctAnswer: 1,
                explanation: "Stakeholder engagement ensures that models address real-world needs, incorporate diverse perspectives, and build trust in the modeling process and results."
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

export default Chapter1;
