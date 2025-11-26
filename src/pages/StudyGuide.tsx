import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, BookOpen, CheckCircle, HelpCircle, Target, Brain } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlashcardDeck } from "@/components/FlashcardDeck";

interface ChapterGuide {
  chapter: number;
  title: string;
  learningObjectives: string[];
  keyConcepts: string[];
  assessmentQuestions: string[];
}

const studyGuideData: ChapterGuide[] = [
  {
    chapter: 1,
    title: "The Modeling Process",
    learningObjectives: [
      "Understand the systematic approach to hydrological modeling",
      "Identify the key stages in model development from problem definition to implementation",
      "Recognize the importance of documentation and validation in responsible modeling",
      "Apply the modeling framework to real-world water management problems"
    ],
    keyConcepts: [
      "Problem definition and objective setting",
      "Model selection and conceptualization",
      "Data collection and quality assessment",
      "Calibration vs. validation distinction",
      "Documentation requirements for reproducibility",
      "Stakeholder communication strategies"
    ],
    assessmentQuestions: [
      "What are the five essential stages in the modeling process and why is their order important?",
      "Why must validation use independent data not used in calibration?",
      "How does clear problem definition influence all subsequent modeling decisions?",
      "What are the consequences of inadequate documentation in modeling projects?"
    ]
  },
  {
    chapter: 2,
    title: "Discretization and Uncertainty",
    learningObjectives: [
      "Understand spatial and temporal discretization concepts and their trade-offs",
      "Recognize different types and sources of model uncertainty",
      "Apply appropriate discretization strategies based on objectives and data availability",
      "Explain the relationship between discretization, numerical stability, and uncertainty"
    ],
    keyConcepts: [
      "Spatial discretization: subcatchment delineation",
      "Temporal discretization: time step selection",
      "CFL condition for numerical stability",
      "Epistemic vs. aleatory uncertainty",
      "Parameter, structural, and input uncertainty",
      "Discretization impacts on computational cost and accuracy"
    ],
    assessmentQuestions: [
      "What factors should guide the selection of subcatchment size in distributed models?",
      "How does the CFL condition relate time step to spatial resolution?",
      "Why can't epistemic uncertainty be completely eliminated even with perfect data?",
      "When is finer discretization counterproductive?"
    ]
  },
  {
    chapter: 3,
    title: "Reliability of Input",
    learningObjectives: [
      "Evaluate data quality and identify reliability issues in model inputs",
      "Apply systematic quality control procedures to hydrological data",
      "Understand the role of GIS in managing spatial data for modeling",
      "Quantify and communicate input data uncertainty"
    ],
    keyConcepts: [
      "Data categories: physical, meteorological, hydrological",
      "Quality control tests and procedures",
      "GIS concepts and applications in hydrology",
      "Missing data treatment methods",
      "Measurement error and uncertainty propagation",
      "Metadata and data provenance documentation"
    ],
    assessmentQuestions: [
      "What systematic checks should be performed on rainfall data before modeling?",
      "How should missing rainfall values be filled, and what documentation is required?",
      "Why is GIS integration essential for parameter extraction in distributed models?",
      "How does input data quality affect the reliability of model predictions?"
    ]
  },
  {
    chapter: 4,
    title: "Optimal Complexity",
    learningObjectives: [
      "Apply the parsimony principle to model selection and development",
      "Balance model complexity against data availability and objectives",
      "Understand equifinality and its implications for parameter identification",
      "Conduct sensitivity analysis to identify critical parameters"
    ],
    keyConcepts: [
      "Parsimony (Occam's Razor) in modeling",
      "Equifinality and parameter identifiability",
      "Structural vs. parameter complexity",
      "Local vs. global sensitivity analysis",
      "Diminishing returns of increasing complexity",
      "Data requirements scaling with complexity"
    ],
    assessmentQuestions: [
      "What is equifinality and why does it increase with model complexity?",
      "How does sensitivity analysis inform decisions about model simplification?",
      "When does adding parameters increase rather than decrease prediction uncertainty?",
      "What criteria determine 'adequate' model complexity for a given problem?"
    ]
  },
  {
    chapter: 5,
    title: "Continuous Models",
    learningObjectives: [
      "Understand the advantages of continuous simulation over single-event modeling",
      "Apply continuous models to long-term sustainability assessment",
      "Implement split-sample calibration and validation strategies",
      "Recognize ethical considerations in long-term water resource modeling"
    ],
    keyConcepts: [
      "Continuous vs. event-based simulation",
      "Water balance closure and accounting",
      "Antecedent moisture conditions",
      "Baseflow and groundwater interactions",
      "Seasonal patterns and climate variability",
      "Ecosystem sustainability assessment",
      "Intergenerational equity considerations"
    ],
    assessmentQuestions: [
      "What critical processes does continuous simulation capture that single-event models miss?",
      "Why is water balance closure essential in long-term modeling?",
      "How does split-sample validation test model predictive capability?",
      "What ethical responsibilities do modelers have when assessing long-term sustainability?"
    ]
  },
  {
    chapter: 6,
    title: "Rain Input Generation",
    learningObjectives: [
      "Understand stochastic rainfall generation methods and their applications",
      "Apply disaggregation techniques to convert coarse data to fine resolution",
      "Evaluate synthetic rainfall for statistical consistency with observations",
      "Use ensemble approaches for uncertainty quantification in design"
    ],
    keyConcepts: [
      "Stochastic point process models (Poisson cluster)",
      "Temporal disaggregation methods",
      "Statistical property preservation",
      "Design storm development",
      "Ensemble generation for risk analysis",
      "Validation of synthetic rainfall"
    ],
    assessmentQuestions: [
      "What are the key differences between stochastic generation and disaggregation?",
      "How is synthetic rainfall validated against historical records?",
      "Why use stochastic ensembles rather than deterministic design storms?",
      "What statistical properties must be preserved in disaggregation?"
    ]
  },
  {
    chapter: 7,
    title: "Dynamic Rain Systems",
    learningObjectives: [
      "Understand how storm movement affects catchment response",
      "Identify critical storm velocities and paths for peak flows",
      "Quantify timing uncertainty in dynamic rainfall systems",
      "Apply storm kinematics to conservative infrastructure design"
    ],
    keyConcepts: [
      "Storm cell velocity and direction",
      "Critical storm velocity concept",
      "Time of concentration relationship",
      "Runoff synchronization effects",
      "Upstream vs. downstream storm movement",
      "Radar-based storm tracking"
    ],
    assessmentQuestions: [
      "What is critical storm velocity and how is it related to time of concentration?",
      "Why do downstream-moving storms typically produce higher peaks than stationary storms?",
      "How should design analysis account for storm motion uncertainty?",
      "What role does radar data play in real-time storm tracking?"
    ]
  },
  {
    chapter: 8,
    title: "Decision Support",
    learningObjectives: [
      "Understand the role of decision support systems in practical modeling",
      "Evaluate PCSWMM features and capabilities for urban water management",
      "Apply scenario analysis for comparing management alternatives",
      "Use visualization tools for stakeholder communication"
    ],
    keyConcepts: [
      "PCSWMM and EPA SWMM relationship",
      "GIS integration and data management",
      "Scenario comparison and trade-off analysis",
      "Automated calibration tools",
      "Visualization and reporting capabilities",
      "Real-time control optimization"
    ],
    assessmentQuestions: [
      "How do decision support systems bridge the gap between models and decision-making?",
      "What advantages does PCSWMM add to the EPA SWMM computational engine?",
      "Why is scenario analysis valuable for evaluating management alternatives?",
      "How does visualization support stakeholder engagement in modeling?"
    ]
  },
  {
    chapter: 9,
    title: "Objective Functions",
    learningObjectives: [
      "Select appropriate objective functions for different modeling purposes",
      "Understand trade-offs in multi-objective calibration",
      "Interpret common performance metrics (NSE, RMSE, R², PBIAS, KGE)",
      "Apply Pareto optimization concepts to conflicting objectives"
    ],
    keyConcepts: [
      "Nash-Sutcliffe Efficiency (NSE)",
      "Root Mean Square Error (RMSE)",
      "Coefficient of determination (R²)",
      "Percent bias (PBIAS)",
      "Kling-Gupta Efficiency (KGE)",
      "Multi-objective optimization",
      "Pareto-optimal solutions",
      "Objective function selection criteria"
    ],
    assessmentQuestions: [
      "Why does a high NSE not guarantee good performance on all flow characteristics?",
      "What is a Pareto-optimal solution and what does it reveal about trade-offs?",
      "How should objective functions be selected based on modeling purpose?",
      "Why might optimizing for peak accuracy worsen volume conservation?"
    ]
  },
  {
    chapter: 10,
    title: "Sensitivity Analysis Methods",
    learningObjectives: [
      "Conduct local and global sensitivity analyses",
      "Identify critical parameters requiring careful calibration",
      "Understand parameter interactions and non-linear responses",
      "Use sensitivity results to guide model simplification"
    ],
    keyConcepts: [
      "Local sensitivity (one-at-a-time)",
      "Global sensitivity (variance-based)",
      "Sobol indices and Morris screening",
      "Parameter interactions",
      "Sensitivity vs. identifiability",
      "Computational efficiency considerations"
    ],
    assessmentQuestions: [
      "What are the limitations of local sensitivity analysis?",
      "How do Sobol indices decompose variance contributions?",
      "Why are highly sensitive parameters not always easily identifiable?",
      "When is global sensitivity analysis worth the computational cost?"
    ]
  },
  {
    chapter: 11,
    title: "Error and Validation",
    learningObjectives: [
      "Distinguish between different types of model errors",
      "Implement rigorous validation procedures",
      "Interpret validation results for model credibility assessment",
      "Apply cross-validation and split-sample techniques"
    ],
    keyConcepts: [
      "Systematic vs. random errors",
      "Calibration vs. validation distinction",
      "Independent data requirements",
      "Temporal and spatial validation",
      "Cross-validation techniques",
      "Performance degradation in validation"
    ],
    assessmentQuestions: [
      "Why must validation use data independent from calibration?",
      "What does performance degradation in validation indicate?",
      "How does spatial validation complement temporal validation?",
      "When is cross-validation appropriate for limited data situations?"
    ]
  },
  {
    chapter: 12,
    title: "Parameter Optimization",
    learningObjectives: [
      "Apply automated optimization algorithms to model calibration",
      "Understand the strengths and limitations of different optimization methods",
      "Recognize when manual calibration is preferable to automation",
      "Avoid overfitting through appropriate optimization strategies"
    ],
    keyConcepts: [
      "Gradient-based optimization",
      "Evolutionary algorithms (genetic algorithms)",
      "Local vs. global optima",
      "Parameter bounds and constraints",
      "Multi-start strategies",
      "Regularization to prevent overfitting"
    ],
    assessmentQuestions: [
      "What are the risks of purely automated calibration without expert judgment?",
      "When do gradient-based methods fail and global methods become necessary?",
      "How can optimization be constrained to produce physically realistic parameters?",
      "Why might the global optimum in calibration perform poorly in validation?"
    ]
  },
  {
    chapter: 13,
    title: "Uncertainty Propagation",
    learningObjectives: [
      "Understand how uncertainty propagates through model chains",
      "Apply Monte Carlo methods for uncertainty quantification",
      "Construct and interpret confidence bounds on predictions",
      "Communicate uncertainty effectively to decision-makers"
    ],
    keyConcepts: [
      "Monte Carlo simulation",
      "Latin hypercube sampling",
      "Uncertainty propagation principles",
      "Confidence interval construction",
      "Ensemble prediction systems",
      "Total uncertainty estimation"
    ],
    assessmentQuestions: [
      "How does uncertainty in inputs propagate to model outputs?",
      "Why is Latin hypercube sampling more efficient than pure random sampling?",
      "What do 95% confidence bounds actually mean for decision-making?",
      "How can different uncertainty sources be separated in analysis?"
    ]
  },
  {
    chapter: 14,
    title: "Ecosystem Impacts",
    learningObjectives: [
      "Assess long-term ecosystem impacts of water management decisions",
      "Understand the relationship between hydrology and ecological health",
      "Apply sustainability criteria to model evaluation",
      "Recognize ethical responsibilities in ecosystem impact assessment"
    ],
    keyConcepts: [
      "Environmental flow requirements",
      "Stream habitat sustainability",
      "Baseflow importance for ecology",
      "Flow duration curves",
      "Ecosystem services valuation",
      "Long-term sustainability metrics"
    ],
    assessmentQuestions: [
      "How does urbanization-induced baseflow reduction affect aquatic ecosystems?",
      "What hydrological indicators are most relevant for ecosystem health?",
      "Why is continuous simulation essential for ecosystem impact assessment?",
      "What ethical considerations arise when impacts span generations?"
    ]
  },
  {
    chapter: 15,
    title: "Fuzzy Logic",
    learningObjectives: [
      "Understand fuzzy set theory and its applications in hydrology",
      "Apply fuzzy logic to handle imprecise information and expert knowledge",
      "Design fuzzy rule-based systems for water management decisions",
      "Implement fuzzification and defuzzification procedures"
    ],
    keyConcepts: [
      "Fuzzy sets and membership functions",
      "Fuzzification process",
      "Fuzzy inference and rule evaluation",
      "Defuzzification methods",
      "Linguistic variables",
      "Expert knowledge incorporation"
    ],
    assessmentQuestions: [
      "How does fuzzy logic differ from crisp Boolean logic?",
      "What is defuzzification and why is it necessary?",
      "When is fuzzy logic preferable to probabilistic approaches?",
      "How can expert knowledge be encoded in fuzzy rule systems?"
    ]
  },
  {
    chapter: 16,
    title: "Real-Time Uncertainty",
    learningObjectives: [
      "Display uncertainty alongside real-time predictions",
      "Apply ensemble forecasting for operational decision support",
      "Update confidence bounds with incoming observations",
      "Communicate probabilistic forecasts to operators effectively"
    ],
    keyConcepts: [
      "Ensemble forecasting systems",
      "Bayesian updating",
      "Confidence interval dynamics",
      "Risk-based decision thresholds",
      "Parameter and input uncertainty in real-time",
      "Forecast visualization strategies"
    ],
    assessmentQuestions: [
      "Why display uncertainty bounds rather than single forecasts in operations?",
      "How does Bayesian updating improve forecasts as observations arrive?",
      "What confidence level should trigger different operational responses?",
      "How can ensemble spread indicate forecast reliability?"
    ]
  },
  {
    chapter: 17,
    title: "Conclusions",
    learningObjectives: [
      "Synthesize responsible modeling principles into a coherent framework",
      "Apply ethical considerations to modeling practice",
      "Recognize the evolving nature of modeling technology and enduring principles",
      "Commit to transparency and honesty in model communication"
    ],
    keyConcepts: [
      "Framework for responsible modeling practice",
      "Ethical obligations of modelers",
      "Transparency in uncertainty communication",
      "Long-term sustainability considerations",
      "Stakeholder engagement importance",
      "Continuous improvement mindset"
    ],
    assessmentQuestions: [
      "What principles remain fundamental regardless of technological advances?",
      "How should modelers balance complexity with transparency?",
      "What are the ethical responsibilities when model results influence policy?",
      "Why is honest communication of limitations essential for credibility?"
    ]
  }
];

const StudyGuide = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary-light to-secondary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Study Guide
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive learning objectives, key concepts, and self-assessment questions for each chapter 
            to support your understanding of responsible modeling practices.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <Tabs defaultValue="guide" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="guide" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Study Guide
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="gap-2">
              <Brain className="h-4 w-4" />
              Flashcards
            </TabsTrigger>
          </TabsList>

          {/* Study Guide Tab */}
          <TabsContent value="guide" className="space-y-12">
            {/* Introduction */}
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h2 className="text-2xl font-bold text-foreground mb-4">How to Use This Study Guide</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This study guide is designed to help you master the principles and practices of responsible 
                  hydrological modeling. For each chapter, you'll find:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground">Learning Objectives</h3>
                      <p className="text-sm">What you should be able to do after studying the chapter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground">Key Concepts</h3>
                      <p className="text-sm">Essential terminology and principles to understand</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground">Assessment Questions</h3>
                      <p className="text-sm">Questions to test your comprehension and application</p>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-sm italic">
                  💡 <strong>Tip:</strong> After reading each chapter, review the learning objectives to ensure 
                  you've achieved them, then attempt the self-assessment questions without referring back to the text. 
                  Use the key concepts as a checklist for your notes.
                </p>
              </div>
            </Card>

            {/* Chapter Guides */}
            <Accordion type="single" collapsible className="space-y-4">
          {studyGuideData.map((guide) => (
            <AccordionItem 
              key={guide.chapter} 
              value={`chapter-${guide.chapter}`}
              className="border rounded-lg bg-card"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold flex-shrink-0">
                    {guide.chapter}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Chapter {guide.chapter}: {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {guide.learningObjectives.length} objectives • {guide.keyConcepts.length} concepts • {guide.assessmentQuestions.length} questions
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  
                  {/* Learning Objectives */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-foreground">Learning Objectives</h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {guide.learningObjectives.map((objective, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          <span className="text-primary mr-2">•</span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Concepts */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-foreground">Key Concepts to Master</h4>
                    </div>
                    <div className="ml-7 grid md:grid-cols-2 gap-2">
                      {guide.keyConcepts.map((concept, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-primary text-xs mt-1">▸</span>
                          <span className="text-sm text-muted-foreground">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessment Questions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h4 className="font-bold text-foreground">Self-Assessment Questions</h4>
                    </div>
                    <div className="space-y-3 ml-7">
                      {guide.assessmentQuestions.map((question, idx) => (
                        <Card key={idx} className="p-4 bg-muted/30">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-bold text-foreground">{idx + 1}.</span> {question}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Chapter Link */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <Link to={`/chapter/${guide.chapter}`}>
                      <Button className="w-full sm:w-auto gap-2">
                        <BookOpen className="w-4 h-4" />
                        Go to Chapter {guide.chapter}
                      </Button>
                    </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Study Tips */}
        <Card className="p-8 mt-12 bg-gradient-to-br from-accent/10 to-background">
          <h2 className="text-2xl font-bold text-foreground mb-6">Effective Study Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-primary mb-3">Before Reading</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Review the learning objectives to set focus</li>
                <li>• Skim key concepts to preview terminology</li>
                <li>• Connect to previous chapters' content</li>
                <li>• Prepare questions you want answered</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3">During Reading</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Take notes on key concepts in your own words</li>
                <li>• Work through examples and case studies</li>
                <li>• Attempt in-chapter quiz questions</li>
                <li>• Highlight unfamiliar terms for glossary lookup</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3">After Reading</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Review learning objectives - can you meet them?</li>
                <li>• Answer self-assessment questions without notes</li>
                <li>• Summarize main ideas in 2-3 sentences</li>
                <li>• Identify real-world applications</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3">For Retention</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Space out review sessions over time</li>
                <li>• Teach concepts to others (or explain aloud)</li>
                <li>• Create concept maps linking chapters</li>
                <li>• Apply principles to your own projects</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">Glossary</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Look up definitions of technical terms
            </p>
            <Link to="/glossary">
              <Button variant="outline" className="w-full">
                View Glossary
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">Resources</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Access software, documentation, and tutorials
            </p>
            <Link to="/resources">
              <Button variant="outline" className="w-full">
                View Resources
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">Your Notes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Review your saved chapter notes
            </p>
            <Link to="/notes">
              <Button variant="outline" className="w-full">
                View Notes
              </Button>
            </Link>
          </Card>
        </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
              <h2 className="text-2xl font-bold text-foreground mb-4">Master Key Terminology with Flashcards</h2>
              <p className="text-muted-foreground">
                Use spaced repetition to efficiently memorize and retain important modeling concepts. 
                Cards you find difficult will appear more frequently until mastered.
              </p>
            </Card>
            
            <FlashcardDeck />
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <div className="mt-16 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Return to Book Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-6 mt-16 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Study guide for <em>Rules for Responsible Modeling</em> by William James (4th Edition, 2005)
            <br />
            Published by CHI (Computational Hydraulics International)
          </p>
        </div>
      </footer>
      </div>
      <Footer />
    </>
  );
};

export default StudyGuide;
