import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Quote, ExternalLink, BookOpen, Brain } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { KeyQuotesFlashcards } from "@/components/KeyQuotesFlashcards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFReferenceCard } from "@/components/PDFReferenceCard";

const KeyQuotes = () => {
  const quotes = [
    {
      chapter: 1,
      title: "Introduction",
      quote: "The purpose of modeling is not to predict the future perfectly, but to inform decisions about future actions. A model that helps you make better decisions is valuable, even if its predictions contain uncertainty.",
      context: "Dr. James emphasized that models serve as decision support tools rather than crystal balls. The key question is not 'Is this model correct?' but rather 'Does this model help us make better decisions?'"
    },
    {
      chapter: 2,
      title: "Discretization & Complexity",
      quote: "Discretization error is often the largest source of model uncertainty, yet it is frequently overlooked in favor of parameter uncertainty. The choice of spatial and temporal resolution should be treated with the same rigor as parameter calibration.",
      context: "Dr. James emphasized that discretization errors arise from approximating continuous processes with discrete calculations. These errors can dominate total model uncertainty."
    },
    {
      chapter: 3,
      title: "Reliability of Input",
      quote: "Garbage in, garbage out is an oversimplification. The real challenge is that imperfect data, when carefully characterized and properly propagated through uncertainty analysis, can still support sound decisions. Unknown data quality is far more dangerous than known imperfection.",
      context: "Dr. James stressed that data quality assessment should be systematic and documented. The goal is not perfect data—which rarely exists—but rather honest characterization of data limitations."
    },
    {
      chapter: 4,
      title: "Optimal Complexity",
      quote: "There exists an optimal order of model complexity for any given application. Below this optimum, the model fails to capture essential physics. Above it, parameter uncertainty overwhelms any gain in structural accuracy. Finding this optimum requires systematic evaluation, not intuition.",
      context: "Dr. James's concept of 'optimal order of complexity' provides a framework for model selection based on data availability, decision stakes, and dominant physical processes."
    },
    {
      chapter: 5,
      title: "Continuous Modeling",
      quote: "Continuous simulation is not merely running single events back-to-back. It fundamentally changes how we think about antecedent conditions, inter-event processes, and long-term system behavior. The calibration requirements are also fundamentally different.",
      context: "Dr. James advocated for continuous simulation as essential for capturing long-term hydrological behavior and proper representation of antecedent moisture conditions."
    },
    {
      chapter: 6,
      title: "Rain Input Generation",
      quote: "Rainfall is typically the largest source of uncertainty in urban drainage modeling, yet modelers often spend more effort on hydraulic parameters than on rainfall characterization. A sophisticated routing model fed with poor rainfall input produces poor results elegantly.",
      context: "Dr. James emphasized that rainfall input deserves at least as much attention as model calibration for reliable predictions."
    },
    {
      chapter: 7,
      title: "Dynamic Rain Systems",
      quote: "Urban watersheds are often smaller than individual storm cells. This means the spatial structure and movement of rainfall across the catchment can dramatically affect peak flows—sometimes more than total rainfall depth.",
      context: "Dr. James's research demonstrated that storm velocity and direction interact with catchment geometry to produce widely varying responses."
    },
    {
      chapter: 8,
      title: "Decision Support",
      quote: "A decision support system is more than a model with a pretty interface. It is a framework that integrates data management, modeling, analysis, and communication into a coherent workflow that supports the entire decision-making process.",
      context: "Dr. James, as a key developer of PCSWMM at CHI, emphasized that effective decision support bridges the gap between sophisticated modeling and practical decision-making."
    },
    {
      chapter: 9,
      title: "Objective Functions",
      quote: "The choice of objective function is itself a modeling decision that deserves careful consideration. Different objectives will lead to different 'optimal' parameter sets, and no single metric captures all aspects of model performance.",
      context: "Dr. James cautioned against blindly adopting standard metrics without considering project context."
    },
    {
      chapter: 10,
      title: "Model Error & Certainty",
      quote: "Uncertainty is not a weakness to be hidden—it is an inherent characteristic of all models that should be quantified and communicated. Decision-makers deserve to know the confidence they should place in model predictions.",
      context: "Dr. James emphasized transparent uncertainty communication as fundamental to responsible modeling practice."
    },
    {
      chapter: 11,
      title: "Sensitivity Analysis",
      quote: "Sensitivity analysis is not merely a diagnostic tool—it is fundamental to responsible modeling. It tells us where to focus our calibration efforts, which data to collect, and how confident we can be in our predictions.",
      context: "Dr. James emphasized that sensitivity analysis should precede calibration, not follow it."
    },
    {
      chapter: 12,
      title: "State Variable Space",
      quote: "State variable representation provides a unified framework for understanding model behavior. It reveals how different parts of the system interact, where instabilities may arise, and what combinations of conditions lead to extreme outcomes.",
      context: "Dr. James applied state space concepts to water system optimization for systematic exploration of system behavior."
    },
    {
      chapter: 13,
      title: "Performance Evaluation",
      quote: "Performance evaluation functions are not neutral—they embody value judgments about what aspects of model behavior matter most. A high Nash-Sutcliffe efficiency does not guarantee a model is fit for purpose.",
      context: "Dr. James's survey of performance evaluation functions revealed that no single metric is universally appropriate."
    },
    {
      chapter: 14,
      title: "Parameter Optimization",
      quote: "Optimization is a powerful tool, but it is not magic. A well-optimized poor model will still give poor predictions. Optimization should follow, not replace, careful model construction.",
      context: "Dr. James emphasized that optimization algorithms find the best parameters for a given structure, but cannot compensate for structural inadequacy."
    },
    {
      chapter: 15,
      title: "Fuzzy Logic",
      quote: "Fuzzy logic excels where traditional crisp models struggle—in situations where expert knowledge is available but precise mathematical relationships are not. It provides a bridge between human reasoning and computational models.",
      context: "Dr. James recognized that many water management decisions involve qualitative judgments that resist precise quantification."
    },
    {
      chapter: 16,
      title: "Real-Time Uncertainty",
      quote: "Model error is not a sign of failure—it is an inherent characteristic of all models. The responsible approach is not to minimize error at any cost, but to characterize it honestly and communicate it effectively.",
      context: "Dr. James advocated for transparent uncertainty communication in real-time systems."
    },
    {
      chapter: 17,
      title: "Conclusions",
      quote: "The rules for responsible modeling are not arbitrary constraints—they are lessons learned from decades of practice. Each rule addresses a common failure mode that has led to poor decisions, wasted resources, or damaged credibility.",
      context: "Dr. James championed the view that modeling is fundamentally a service profession—the ultimate measure of success is contribution to better water management outcomes."
    }
  ];

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
            <div className="flex items-center gap-4 mb-4">
              <Quote className="w-12 h-12 text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Key Quotes from Dr. James
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl">
              Essential insights and principles from "Rules for Responsible Modeling" organized by chapter.
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          
          {/* Tabs for Browse vs Study Mode */}
          <Tabs defaultValue="study" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="study" className="gap-2">
                <Brain className="h-4 w-4" />
                Flashcard Study
              </TabsTrigger>
              <TabsTrigger value="browse" className="gap-2">
                <Quote className="h-4 w-4" />
                Browse Quotes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="study" className="mt-8">
              <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <Brain className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Spaced Repetition Study Mode</h2>
                    <p className="text-muted-foreground">
                      Master Dr. James's key principles using scientifically-proven spaced repetition. 
                      Cards you find difficult will appear more often, while mastered concepts are reviewed less frequently.
                    </p>
                  </div>
                </div>
              </Card>
              
              <PDFReferenceCard className="mb-6" />
              
              <KeyQuotesFlashcards />
            </TabsContent>
            
            <TabsContent value="browse" className="mt-8 space-y-12">
          
          {/* Source Reference Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <BookOpen className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Original Source</h2>
                <p className="text-muted-foreground mb-4">
                  These quotes and insights are inspired by Dr. William James's publication "Rules for Responsible Modeling" 
                  (4th Edition), published by Computational Hydraulics International (CHI).
                </p>
                <a 
                  href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Access the Original Publication <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>

          {/* Complexity-Uncertainty Diagram */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">The Optimal Complexity Concept</h2>
            <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
              <MermaidDiagram chart={`
graph TD
    subgraph Complexity["Model Complexity Spectrum"]
        A[Simple Model] --> B[Moderate Complexity]
        B --> C[High Complexity]
        C --> D[Very High Complexity]
    end
    
    subgraph Uncertainty["Sources of Uncertainty"]
        E[Structural Error<br/>Model too simple] 
        F[Optimal Balance<br/>Minimum Total Error]
        G[Parameter Uncertainty<br/>Too many unknowns]
    end
    
    A --> E
    B --> F
    C --> F
    D --> G
    
    E --> H{Total Model Error}
    F --> H
    G --> H
    
    H --> I[Decision Support Quality]
    
    style A fill:#ef4444,stroke:#dc2626,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#ef4444,stroke:#dc2626,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style I fill:#3b82f6,stroke:#2563eb,color:#fff
              `} />
            </Card>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-l-4 border-l-red-500">
                <h3 className="font-bold text-foreground mb-2">Too Simple</h3>
                <p className="text-sm text-muted-foreground">
                  Model fails to capture essential physics. Structural error dominates, leading to 
                  systematic bias in predictions regardless of calibration quality.
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-l-green-500">
                <h3 className="font-bold text-foreground mb-2">Optimal Complexity</h3>
                <p className="text-sm text-muted-foreground">
                  Balance point where structural adequacy meets data availability. Total uncertainty 
                  is minimized and predictions are most reliable.
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-l-red-500">
                <h3 className="font-bold text-foreground mb-2">Over-Parameterized</h3>
                <p className="text-sm text-muted-foreground">
                  Too many parameters for available data. Equifinality issues arise—many parameter 
                  sets fit equally well but predict differently.
                </p>
              </Card>
            </div>
          </section>

          {/* Error Components Diagram */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Components of Model Uncertainty</h2>
            <Card className="p-8 bg-gradient-to-br from-card to-accent/10">
              <MermaidDiagram chart={`
graph LR
    subgraph Input["Input Uncertainty"]
        A1[Rainfall Data]
        A2[Initial Conditions]
        A3[Boundary Conditions]
    end
    
    subgraph Structure["Structural Uncertainty"]
        B1[Process Representation]
        B2[Spatial Discretization]
        B3[Temporal Resolution]
    end
    
    subgraph Parameter["Parameter Uncertainty"]
        C1[Calibration Error]
        C2[Equifinality]
        C3[Transferability]
    end
    
    A1 --> D[Total Model Uncertainty]
    A2 --> D
    A3 --> D
    B1 --> D
    B2 --> D
    B3 --> D
    C1 --> D
    C2 --> D
    C3 --> D
    
    D --> E[Prediction Confidence Bounds]
    E --> F[Decision Making Under Uncertainty]
    
    style D fill:#f59e0b,stroke:#d97706,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
              `} />
            </Card>
          </section>

          {/* Quotes Grid */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Chapter-by-Chapter Insights</h2>
            <div className="grid gap-6">
              {quotes.map((item) => (
                <Card key={item.chapter} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold shrink-0">
                      {item.chapter}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-primary">
                          Chapter {item.chapter}: {item.title}
                        </h3>
                        <Link to={`/chapter/${item.chapter}`}>
                          <Button variant="outline" size="sm">
                            Read Chapter
                          </Button>
                        </Link>
                      </div>
                      <blockquote className="text-foreground italic border-l-4 border-primary/30 pl-4 mb-3">
                        "{item.quote}"
                      </blockquote>
                      <p className="text-sm text-muted-foreground">
                        {item.context}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Explore the Complete Publication
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              These quotes represent key insights from Dr. James's work. For the complete context and 
              detailed explanations, access the original publication.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Access Original CHI Publication
                </Button>
              </a>
              <Link to="/about-author">
                <Button variant="outline">
                  About Dr. William James
                </Button>
              </Link>
            </div>
          </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KeyQuotes;
