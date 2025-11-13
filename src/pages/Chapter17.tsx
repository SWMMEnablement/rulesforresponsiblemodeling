import { ChapterLayout } from "@/components/ChapterLayout";
import { Card } from "@/components/ui/card";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Quiz } from "@/components/Quiz";
import { Navigation } from "@/components/Navigation";

const Chapter17 = () => {
  return (
    <>
      <Navigation />
      <ChapterLayout chapterNumber={17} title="Conclusions">
      <div className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Framework for Responsible Modeling</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            This concluding chapter synthesizes key principles into a comprehensive framework for 
            continuous hydrological modeling. It provides practical recommendations and emphasizes 
            the ethical responsibilities of modelers.
          </p>

          <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
            <MermaidDiagram chart={`
graph TD
    A[Problem Definition] --> B[Model Selection]
    B --> C[Data Assembly]
    C --> D[Calibration]
    D --> E[Validation]
    E --> F{Performance Adequate?}
    F -->|No| G[Refine Approach]
    F -->|Yes| H[Uncertainty Analysis]
    G --> B
    H --> I[Application]
    I --> J[Documentation]
    J --> K[Communication]
    K --> L[Continuous Improvement]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style L fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f59e0b,stroke:#d97706,color:#fff
            `} />
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Core Recommendations</h2>
          <div className="space-y-4">
            {[
              { num: 1, text: "Match model complexity to data availability and objectives" },
              { num: 2, text: "Quantify and communicate uncertainty transparently" },
              { num: 3, text: "Validate with independent data whenever possible" },
              { num: 4, text: "Document assumptions, limitations, and decisions thoroughly" },
              { num: 5, text: "Consider long-term sustainability and ethical implications" },
              { num: 6, text: "Engage stakeholders in the modeling process" }
            ].map((item) => (
              <Card key={item.num} className="p-4 border-l-4 border-l-primary">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold">
                    {item.num}
                  </div>
                  <p className="text-foreground font-medium">{item.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Moving Forward</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Continuous modeling enables better understanding of long-term processes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Technology advances create new opportunities and responsibilities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span>Ethical practice requires honesty about what models can and cannot do</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Synthesis: Responsible Modeling in Practice</h2>
          <Card className="p-6 bg-card border-l-4 border-l-primary">
            <h3 className="text-xl font-bold text-primary mb-3">Bringing It All Together</h3>
            <p className="text-muted-foreground mb-4">
              Throughout this guide, we have explored the essential elements of responsible deterministic modeling:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-3 bg-background rounded">
                <strong>Foundational Principles:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Data quality and reliability (Ch. 1-3)</li>
                  <li>• Optimal complexity and parsimony (Ch. 4)</li>
                  <li>• Continuous simulation capabilities (Ch. 5)</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Technical Methods:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Rainfall generation and uncertainty (Ch. 6-7)</li>
                  <li>• Calibration and objective functions (Ch. 8-9)</li>
                  <li>• Sensitivity and error analysis (Ch. 10-11)</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Advanced Topics:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Parameter optimization (Ch. 12-13)</li>
                  <li>• Ecosystem sustainability (Ch. 14)</li>
                  <li>• Fuzzy logic and uncertainty (Ch. 15-16)</li>
                </ul>
              </div>
              <div className="p-3 bg-background rounded">
                <strong>Ethical Obligations:</strong>
                <ul className="ml-4 mt-2 space-y-1">
                  <li>• Transparent uncertainty communication</li>
                  <li>• Long-term sustainability consideration</li>
                  <li>• Honest limitation acknowledgment</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-4">Essential Practices for Modelers</h2>
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-lg font-bold text-primary mb-3">1. Model Selection and Scoping</h3>
              <p className="text-muted-foreground text-sm">
                Begin by clearly defining objectives. Choose model complexity appropriate to available data, 
                resources, and decision needs. Resist pressure to over-complicate—parsimony serves reliability. 
                Document the rationale for structural choices and parameter selection.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-lg font-bold text-primary mb-3">2. Calibration and Validation</h3>
              <p className="text-muted-foreground text-sm">
                Never rely on calibration alone. Split available data for independent validation. Use multiple 
                objective functions reflecting project goals. Conduct sensitivity analysis to identify critical 
                parameters. Accept that perfect fits often indicate overfitting, not superior models.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-lg font-bold text-primary mb-3">3. Uncertainty Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Quantify and communicate uncertainty at every stage. Use ensemble approaches, Monte Carlo methods, 
                or scenario analysis as appropriate. Display confidence bounds alongside predictions. Educate 
                stakeholders that uncertainty acknowledgment strengthens rather than weakens credibility.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-lg font-bold text-primary mb-3">4. Documentation and Communication</h3>
              <p className="text-muted-foreground text-sm">
                Document assumptions, data sources, methods, and limitations thoroughly. Make models reproducible. 
                Communicate results honestly, including what the model cannot do. Use visualization effectively 
                but avoid misleading precision in graphics. Archive models and data for future use.
              </p>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">The Future of Responsible Modeling</h2>
          <p className="text-muted-foreground mb-4">
            As computational power increases and data become more abundant, the temptation to build ever-more 
            complex models grows. However, the fundamental principles remain unchanged:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong>Simplicity</strong> balanced with adequate representation remains superior to 
              unnecessary complexity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong>Uncertainty</strong> must be quantified and communicated, regardless of model 
              sophistication</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong>Validation</strong> with independent data remains essential for establishing 
              credibility</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">→</span>
              <span><strong>Ethical responsibility</strong> to long-term sustainability and honest communication 
              transcends technical capability</span>
            </li>
          </ul>
          <p className="text-muted-foreground mt-4 italic">
            Models are tools for understanding, not truth-generating machines. Our responsibility as modelers 
            is to wield these tools with humility, transparency, and commitment to serving the broader good.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">Final Assessment</h2>
          <Quiz
            questions={[
              {
                question: "What is the most important principle in responsible modeling?",
                options: [
                  "Always use the most complex model available",
                  "Transparency about assumptions, limitations, and uncertainties",
                  "Avoid all simplifications",
                  "Never show uncertainty to stakeholders"
                ],
                correctAnswer: 1,
                explanation: "Transparency about assumptions, data limitations, structural choices, and uncertainties is fundamental to responsible modeling. It builds trust and enables informed decision-making."
              },
              {
                question: "How should models evolve with advancing technology?",
                options: [
                  "Always maximize complexity with available computing power",
                  "Maintain principles of parsimony, validation, and uncertainty quantification",
                  "Abandon all traditional methods",
                  "Focus only on visualization"
                ],
                correctAnswer: 1,
                explanation: "While technology enables new capabilities, fundamental principles remain valid: use appropriate complexity, validate independently, quantify uncertainty, and communicate honestly regardless of computational power."
              },
              {
                question: "What defines ethical modeling practice?",
                options: [
                  "Producing results that please clients",
                  "Honest communication of capabilities and limitations with consideration for long-term impacts",
                  "Using the most expensive software",
                  "Avoiding uncertainty analysis"
                ],
                correctAnswer: 1,
                explanation: "Ethical practice requires honest communication about what models can and cannot do, transparent handling of uncertainty, consideration of long-term sustainability, and serving the broader public good over narrow interests."
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
              This concluding chapter synthesizes original educational content inspired by the James textbook, 
              providing a comprehensive framework for responsible deterministic modeling in urban water systems 
              with emphasis on ethical practice and long-term sustainability.
            </p>
          </div>
        </section>
      </div>
    </ChapterLayout>
    </>
  );
};

export default Chapter17;