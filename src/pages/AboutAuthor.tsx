import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, BookOpen, Award, GraduationCap, FileText, ExternalLink, Calendar, Building2, User } from "lucide-react";

const AboutAuthor = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About the Author & Book
          </h1>
          <p className="text-xl text-muted-foreground">
            Dr. William James & Rules for Responsible Modeling
          </p>
        </div>
      </section>

      {/* Author Photos and Bio */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Author Profile Card */}
          <Card className="p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4 md:w-1/3">
                <div className="w-32 h-40 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Dr. William James
                </p>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Dr. William James
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Dr. William James is a pioneering figure in computational hydraulics and environmental 
                    modeling, with over four decades of experience advancing the science and practice of 
                    responsible water systems modeling. His work has fundamentally shaped how engineers 
                    approach uncertainty, sensitivity analysis, and model reliability.
                  </p>
                  <p>
                    As a principal researcher at <strong>Computational Hydraulics International (CHI)</strong>, 
                    Dr. James led the development of critical modeling tools including <strong>PCSWMM</strong> and 
                    the <strong>PC-TOOLBOX</strong> for sensitivity analysis. His emphasis on continuous simulation 
                    over event-based modeling has become a cornerstone of modern hydrological practice.
                  </p>
                  <p>
                    Dr. James's philosophy centers on a fundamental truth: <em>"All models are wrong, but 
                    some are useful."</em> His work helps practitioners understand when and how models 
                    provide reliable information for engineering decisions.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Contributions */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Key Contributions to the Field
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Continuous Simulation Advocacy</p>
                    <p className="text-sm text-muted-foreground">
                      Championed long-term continuous modeling (e.g., 75-year simulations) over event-based 
                      approaches for sustainability and frequency analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Sensitivity Analysis Framework</p>
                    <p className="text-sm text-muted-foreground">
                      Developed systematic approaches to parameter uncertainty and sensitivity gradients 
                      for water quality models.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">PCSWMM Development</p>
                    <p className="text-sm text-muted-foreground">
                      Co-developed PCSWMM4 (1993), integrating GIS, spatial data management, and 
                      advanced visualization with the SWMM engine.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Decision Support Systems</p>
                    <p className="text-sm text-muted-foreground">
                      Pioneered the integration of GUI, spatial data, and statistical tools for 
                      managing model reliability and output interpretation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Model vs. Program Distinction</p>
                    <p className="text-sm text-muted-foreground">
                      Clarified that a "program" (e.g., SWMM) only becomes a "model" when attached 
                      to specific hydro-topographic data and properly calibrated.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Optimal Complexity Principles</p>
                    <p className="text-sm text-muted-foreground">
                      Established guidelines for balancing model detail with available data and 
                      reliability requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About the Book */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              About "Rules for Responsible Modeling"
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">Rules for Responsible Modeling</span> is 
                Dr. James's comprehensive guide to deterministic surface water quality modeling. The full 
                title captures its scope: <em>"Optimal Complexity, Reliability, Error Analysis, Parameter 
                Optimization, Accuracy and Sensitivity Analysis for Large-Scale, Long-Term, Continuous, 
                Deterministic Surface Water Quality Modelling."</em>
              </p>
              <p>
                The publication addresses critical challenges in modeling practice: How do we balance model 
                complexity with data availability? How do we quantify and communicate uncertainty? How do 
                we ensure models provide reliable information for engineering decisions?
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <Card className="p-4 bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Original Publication Structure
                  </h3>
                  <ol className="space-y-1 text-sm">
                    <li>1. Abstract</li>
                    <li>2. Introduction (What/Why/How to Model)</li>
                    <li>3. Continuous Models</li>
                    <li>4. Decision Support Systems</li>
                    <li>5. Objective Functions</li>
                    <li>6. Performance Evaluation Functions</li>
                    <li>7. Model Error and Certainty</li>
                    <li>8. Optimal Order of Model Complexity</li>
                    <li>9. Sensitivity Analysis</li>
                    <li>10. Parameter Optimization</li>
                    <li>11. Conclusions & Recommendations</li>
                    <li>12. References</li>
                  </ol>
                </Card>
                
                <Card className="p-4 bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Publication Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Title:</strong> Rules for Responsible Modeling (R184)</p>
                    <p><strong>Author:</strong> Dr. William James</p>
                    <p><strong>Edition:</strong> 4th Edition (2005)</p>
                    <p><strong>Publisher:</strong> CHI (Computational Hydraulics International)</p>
                    <p><strong>Location:</strong> Guelph, Ontario, Canada</p>
                    <p><strong>ISBN:</strong> 0-9683681-5-8</p>
                    <p><strong>Pages:</strong> 303</p>
                    <p><strong>Original Draft:</strong> R177p.wp5 (1993-12-27)</p>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Core Concepts from the Book */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              Core Concepts from the Book
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">What is a Model?</h3>
                <p className="text-muted-foreground text-sm">
                  Dr. James defines a model as the <em>application</em> of a deterministic water quality 
                  model (WQM) to a specific hydro-topographic input data file. The distinction is crucial: 
                  SWMM is a <em>program</em>; it only becomes a <em>model</em> when attached to specific 
                  data and calibrated for a particular application.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">Continuous vs. Event Modeling</h3>
                <p className="text-muted-foreground text-sm">
                  Unlike "event" models that use arbitrary startup conditions, continuous models include 
                  dry-weather processes (pollutant build-up, evapo-transpiration) and provide frequency-concentration 
                  information only available through long-term simulations (e.g., 75 years of continuous data).
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">The Calibration Rule</h3>
                <p className="text-muted-foreground text-sm">
                  Short, accurate observed time series are sufficient for parameter optimization; long-term 
                  inferential runs can use transposed or synthetic rainfall data. This principle allows 
                  practical calibration while enabling extended simulation periods.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold text-foreground mb-2">Enhancements Needed in WQMs</h3>
                <p className="text-muted-foreground text-sm">
                  Dr. James identified research gaps including: thermal enrichment modeling (heat accumulation 
                  in pavement), rain cell dynamics (moving convective storms), and accounting for "inherent 
                  fuzziness" in pollutant build-up processes.
                </p>
              </div>
            </div>
          </Card>

          {/* About CHI */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">About CHI (Computational Hydraulics International)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CHI is a software and research organization based in Guelph, Ontario, Canada, dedicated to 
              advancing water resources modeling. Founded with the mission of developing practical, 
              scientifically-sound tools for water engineers, CHI has produced industry-leading software 
              including PCSWMM and maintains the Journal of Water Management Modeling.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.chiwater.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Visit CHI Website <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <a 
                href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Read Original Publication <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
              <a 
                href="https://www.chijournal.org/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Journal of Water Management Modeling <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </Card>

          {/* About This Reinterpretation */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Interactive Reinterpretation</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This web application is an interactive reinterpretation of Dr. James's work, created by 
              <strong> Robert Dickinson</strong> as a "Vibe APP." It transforms the original publication 
              into an engaging, modern learning experience with:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>17 interactive chapters with original educational content inspired by the source material</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Interactive Mermaid.js diagrams visualizing key concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Quizzes and flashcards for active learning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Glossary tooltips for technical terminology</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Reading pathways for different learning goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Bookmarking and note-taking features</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4 italic">
              Note: The chapter content in this app is original educational material inspired by Dr. James's 
              work, designed to respect copyright while making the core concepts accessible to modern learners.
            </p>
          </Card>

        </div>
      </section>

      </div>
      <Footer />
    </>
  );
};

export default AboutAuthor;