import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Laptop, Code, Filter, X, ExternalLink, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

interface SoftwareExample {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
}

interface ChapterData {
  chapterNumber: number;
  chapterTitle: string;
  swmm5: SoftwareExample;
  icmSwmm: SoftwareExample;
  icm: SoftwareExample;
}

const chapterTitles: Record<number, string> = {
  1: "Why Model?",
  2: "Space Discretization",
  3: "Data Quality",
  4: "Model Complexity",
  5: "Time Considerations",
  6: "Calibration Basics",
  7: "Event Selection",
  8: "Decision Support",
  9: "Objective Functions",
  10: "Sensitivity Analysis",
  11: "Uncertainty",
  12: "Verification & Validation",
  13: "Model Documentation",
  14: "Parameter Estimation",
  15: "Error Analysis",
  16: "Continuous Modeling",
  17: "Future Directions"
};

const softwareExamples: ChapterData[] = [
  {
    chapterNumber: 1,
    chapterTitle: "Why Model?",
    swmm5: {
      title: "Creating Your First SWMM5 Model",
      description: "Build a simple subcatchment model to understand the modeling workflow.",
      steps: ["Open SWMM5 and create a new project", "Add a subcatchment", "Define properties: Area, Width, % Impervious", "Add an outfall node", "Run simulation"],
      tips: ["Start simple—one subcatchment teaches more than copying complex models", "Compare runoff coefficient to published values"]
    },
    icmSwmm: {
      title: "Creating Your First ICM SWMM Model",
      description: "Build a subcatchment model using the SWMM engine within ICM platform.",
      steps: ["Create a new SWMM Network in ICM", "Set coordinate system", "Draw subcatchment polygon", "Define SWMM-style properties", "Run simulation"],
      tips: ["ICM SWMM uses EPA SWMM engine—results match standalone SWMM5", "Easy to import existing .inp files"]
    },
    icm: {
      title: "Creating Your First ICM Model",
      description: "Build a catchment model in InfoWorks ICM.",
      steps: ["Create a new Network", "Import or draw subcatchment polygon", "Define runoff surface types", "Add nodes and links", "Run simulation"],
      tips: ["Use 'Validate Network' tool early and often", "Focus on decision-informing results"]
    }
  },
  {
    chapterNumber: 2,
    chapterTitle: "Space Discretization",
    swmm5: {
      title: "Subcatchment Discretization in SWMM5",
      description: "Explore how subdividing a catchment affects model results.",
      steps: ["Create a single large subcatchment", "Record peak flow and timing", "Subdivide into 4 subcatchments", "Compare results", "Document diminishing returns"],
      tips: ["Width parameter controls time of concentration", "Match discretization to data quality"]
    },
    icmSwmm: {
      title: "Subcatchment Discretization in ICM SWMM",
      description: "Use ICM's GIS tools for efficient discretization.",
      steps: ["Import catchment boundary", "Use polygon tools to subdivide", "Auto-calculate areas and widths", "Compare baseline and refined models"],
      tips: ["ICM's spatial tools make discretization faster", "Width can be automated from geometry"]
    },
    icm: {
      title: "Grid-Based vs. Subcatchment Discretization",
      description: "Compare polygon-based and grid-based representations.",
      steps: ["Create model with subcatchment polygons", "Convert to 2D mesh representation", "Compare results", "Evaluate computational cost vs accuracy"],
      tips: ["2D adds value for surface flooding", "Mesh resolution should match DEM accuracy"]
    }
  },
  {
    chapterNumber: 3,
    chapterTitle: "Data Quality",
    swmm5: {
      title: "Data Quality Assessment in SWMM5",
      description: "Evaluate reliability of input data and uncertainty impact.",
      steps: ["Import rainfall time series", "Check for gaps and suspicious values", "Compare to regional estimates", "Document data sources"],
      tips: ["Rainfall data quality drives 80% of model uncertainty", "Always document data sources"]
    },
    icmSwmm: {
      title: "Data Validation in ICM SWMM Networks",
      description: "Leverage ICM's data management with SWMM structures.",
      steps: ["Import data into ICM SWMM network", "Use Validate Network tool", "Run SQL queries for outliers", "Flag uncertain data"],
      tips: ["ICM validation catches errors SWMM5 might miss", "SQL queries help find outliers"]
    },
    icm: {
      title: "GIS Integration and Data Validation",
      description: "Leverage ICM's GIS capabilities for data quality control.",
      steps: ["Import pipe network from GIS", "Use Validate Network tool", "Run SQL queries", "Generate data quality report"],
      tips: ["Don't trust GIS data blindly—field verify critical assets"]
    }
  },
  {
    chapterNumber: 4,
    chapterTitle: "Model Complexity",
    swmm5: {
      title: "Optimal Complexity Selection in SWMM5",
      description: "Compare simple and complex model configurations.",
      steps: ["Build simple lumped model", "Add complexity progressively", "Document where added detail stops improving answers"],
      tips: ["Parsimony: choose simplest model that serves your purpose", "Over-parameterized models can calibrate well but predict poorly"]
    },
    icmSwmm: {
      title: "Complexity Selection in ICM SWMM",
      description: "Balance SWMM model complexity with ICM tools.",
      steps: ["Start with simple SWMM network", "Add complexity progressively", "Use scenario management to compare"],
      tips: ["ICM SWMM lets you add 2D selectively", "Match complexity to project questions"]
    },
    icm: {
      title: "1D vs. 1D/2D Model Complexity",
      description: "Evaluate when integrated 2D modeling adds value.",
      steps: ["Build 1D pipe network model", "Add 2D mesh to flood areas", "Compare flood extents", "Document decision impact"],
      tips: ["2D is essential for surface flood mapping", "Partial 2D zones often provide 80% of benefit"]
    }
  },
  {
    chapterNumber: 5,
    chapterTitle: "Time Considerations",
    swmm5: {
      title: "Continuous Simulation in SWMM5",
      description: "Set up long-term continuous simulation.",
      steps: ["Obtain multi-year rainfall data", "Configure extended period simulation", "Enable groundwater modules", "Analyze full range of responses"],
      tips: ["Continuous simulation reveals behavior event models miss", "Warm-up period is critical"]
    },
    icmSwmm: {
      title: "Continuous Simulation in ICM SWMM",
      description: "Run long-term SWMM simulations with ICM tools.",
      steps: ["Import multi-year time series", "Configure continuous simulation", "Use ICM statistics tools", "Generate flow duration curves"],
      tips: ["ICM handles large time series more efficiently", "Use statistics tools for analysis"]
    },
    icm: {
      title: "Long-Term Simulation in ICM",
      description: "Configure ICM for continuous simulation with water balance.",
      steps: ["Create multi-year rainfall series", "Configure RunoffSurfaces", "Run multi-year simulation", "Generate CSO statistics"],
      tips: ["ICM's FAST engine is optimized for long simulations"]
    }
  },
  {
    chapterNumber: 6,
    chapterTitle: "Calibration Basics",
    swmm5: {
      title: "Manual Calibration in SWMM5",
      description: "Step-by-step manual calibration process.",
      steps: ["Import observed flow data", "Adjust impervious percentage", "Tune width parameter", "Refine Manning's n values"],
      tips: ["Calibrate volume first, then peak, then timing", "Keep parameter values physically reasonable"]
    },
    icmSwmm: {
      title: "Calibration Workflow in ICM SWMM",
      description: "Calibrate SWMM models using ICM visualization.",
      steps: ["Import observed data as time series", "Use overlay plots for comparison", "Adjust parameters systematically", "Document calibration metrics"],
      tips: ["ICM's overlay plots speed up visual calibration", "Export calibrated model for SWMM5 if needed"]
    },
    icm: {
      title: "Calibration Tools in ICM",
      description: "Use ICM's built-in calibration and sensitivity tools.",
      steps: ["Set up observed data connections", "Define calibration parameters", "Run sensitivity analysis", "Use optimization tools"],
      tips: ["Start with sensitivity analysis to identify key parameters"]
    }
  },
  {
    chapterNumber: 7,
    chapterTitle: "Event Selection",
    swmm5: {
      title: "Design Storm Selection in SWMM5",
      description: "Select appropriate design events for analysis.",
      steps: ["Define project design criteria", "Create synthetic design storms", "Model historical events", "Compare results"],
      tips: ["Design storms are useful for comparative analysis", "Historical events better capture antecedent conditions"]
    },
    icmSwmm: {
      title: "Event Management in ICM SWMM",
      description: "Manage multiple events efficiently in ICM SWMM.",
      steps: ["Create event library", "Set up batch simulations", "Compare results across events", "Generate statistical summaries"],
      tips: ["Use ICM's batch processing for multiple events", "Event libraries enable consistent analysis"]
    },
    icm: {
      title: "Event Selection in ICM",
      description: "Use ICM's event management for comprehensive analysis.",
      steps: ["Create events from rainfall data", "Define return period storms", "Run multiple events", "Generate flow frequency curves"],
      tips: ["ICM can derive return periods from continuous results"]
    }
  },
  {
    chapterNumber: 8,
    chapterTitle: "Decision Support",
    swmm5: {
      title: "Scenario Comparison in SWMM5",
      description: "Compare design alternatives using SWMM5.",
      steps: ["Create baseline model", "Develop alternative scenarios", "Run all scenarios", "Compare key performance metrics"],
      tips: ["Use consistent naming conventions", "Document assumptions for each scenario"]
    },
    icmSwmm: {
      title: "Scenario Management in ICM SWMM",
      description: "Leverage ICM's scenario tools with SWMM networks.",
      steps: ["Create scenario tree", "Define parameter differences", "Run scenarios in batch", "Generate comparison reports"],
      tips: ["Scenarios share common data—efficient for what-if analysis", "Export selected scenarios as SWMM files"]
    },
    icm: {
      title: "Decision Support with ICM",
      description: "Use ICM's full decision support capabilities.",
      steps: ["Set up objective criteria", "Create alternative designs", "Run optimization", "Evaluate trade-offs"],
      tips: ["ICM's scenario comparison tools enable informed decisions"]
    }
  },
  {
    chapterNumber: 9,
    chapterTitle: "Objective Functions",
    swmm5: {
      title: "Performance Metrics in SWMM5",
      description: "Calculate objective functions for model evaluation.",
      steps: ["Export simulated and observed data", "Calculate NSE, RMSE, PBIAS", "Plot scatter and time series", "Document performance"],
      tips: ["No single metric tells the whole story", "Report multiple performance measures"]
    },
    icmSwmm: {
      title: "Objective Functions in ICM SWMM",
      description: "Use ICM tools to evaluate SWMM model performance.",
      steps: ["Link observed data to nodes", "Use built-in statistics", "Generate comparison plots", "Export metrics"],
      tips: ["ICM calculates statistics automatically when observed data is linked"]
    },
    icm: {
      title: "Calibration Metrics in ICM",
      description: "Evaluate model performance with ICM statistics.",
      steps: ["Connect observed data sources", "Define calibration targets", "Run statistical analysis", "Generate calibration reports"],
      tips: ["ICM's calibration reports provide comprehensive metrics"]
    }
  },
  {
    chapterNumber: 10,
    chapterTitle: "Sensitivity Analysis",
    swmm5: {
      title: "Parameter Sensitivity in SWMM5",
      description: "Identify most influential model parameters.",
      steps: ["Select parameters to test", "Vary each parameter ±10-50%", "Record output changes", "Rank parameter influence"],
      tips: ["Focus calibration effort on most sensitive parameters", "Document baseline values"]
    },
    icmSwmm: {
      title: "Sensitivity Analysis in ICM SWMM",
      description: "Use ICM tools for efficient sensitivity testing.",
      steps: ["Define parameter ranges", "Set up batch runs", "Analyze output variations", "Identify key parameters"],
      tips: ["ICM's batch capabilities speed up sensitivity analysis"]
    },
    icm: {
      title: "Sensitivity Tools in ICM",
      description: "Use ICM's built-in sensitivity analysis.",
      steps: ["Define parameter variations", "Run sensitivity simulations", "View tornado diagrams", "Focus on influential parameters"],
      tips: ["Tornado diagrams quickly show parameter importance"]
    }
  },
  {
    chapterNumber: 11,
    chapterTitle: "Uncertainty",
    swmm5: {
      title: "Uncertainty Analysis in SWMM5",
      description: "Quantify prediction uncertainty.",
      steps: ["Identify uncertain parameters", "Define probability distributions", "Run Monte Carlo simulations", "Present confidence bounds"],
      tips: ["External tools like PEST or R can automate Monte Carlo", "Present results as ranges, not single values"]
    },
    icmSwmm: {
      title: "Uncertainty in ICM SWMM",
      description: "Assess uncertainty in SWMM models via ICM.",
      steps: ["Define parameter distributions", "Use Monte Carlo capabilities", "Analyze result distributions", "Report confidence intervals"],
      tips: ["ICM's simulation capabilities support uncertainty quantification"]
    },
    icm: {
      title: "Monte Carlo in ICM",
      description: "Use ICM for formal uncertainty quantification.",
      steps: ["Define uncertain parameters", "Set up Monte Carlo analysis", "Run ensemble simulations", "Generate probability maps"],
      tips: ["Flood probability maps are powerful for risk communication"]
    }
  },
  {
    chapterNumber: 12,
    chapterTitle: "Verification & Validation",
    swmm5: {
      title: "Model Verification in SWMM5",
      description: "Verify model with independent data.",
      steps: ["Split available data", "Calibrate on training set", "Validate on test set", "Compare performance metrics"],
      tips: ["True validation requires independent events", "Poor validation suggests overfitting"]
    },
    icmSwmm: {
      title: "Verification in ICM SWMM",
      description: "Validate SWMM models systematically.",
      steps: ["Define calibration and validation periods", "Run both periods", "Compare statistics", "Document results"],
      tips: ["Use ICM's plotting tools to compare periods visually"]
    },
    icm: {
      title: "Validation Workflow in ICM",
      description: "Comprehensive model validation in ICM.",
      steps: ["Set up validation events", "Run independent tests", "Compare predictions to observations", "Generate validation report"],
      tips: ["ICM reports support formal documentation requirements"]
    }
  },
  {
    chapterNumber: 13,
    chapterTitle: "Model Documentation",
    swmm5: {
      title: "Documenting SWMM5 Models",
      description: "Create comprehensive model documentation.",
      steps: ["Document data sources", "Record calibration decisions", "Export model summary", "Create user guide"],
      tips: ["Future users (including yourself) will thank you", "Version control your .inp files"]
    },
    icmSwmm: {
      title: "Documentation in ICM SWMM",
      description: "Use ICM's documentation features for SWMM models.",
      steps: ["Add notes to model objects", "Generate automated reports", "Export documentation", "Maintain version history"],
      tips: ["ICM's database structure preserves documentation with the model"]
    },
    icm: {
      title: "Model Documentation in ICM",
      description: "Comprehensive documentation with ICM tools.",
      steps: ["Use built-in notes and metadata", "Generate standard reports", "Create model audit trails", "Export for external review"],
      tips: ["Audit trails are essential for regulatory compliance"]
    }
  },
  {
    chapterNumber: 14,
    chapterTitle: "Parameter Estimation",
    swmm5: {
      title: "Parameter Estimation in SWMM5",
      description: "Estimate parameters from physical data.",
      steps: ["Review literature values", "Use field measurements", "Apply regional relationships", "Document sources"],
      tips: ["Physical meaning constrains parameter values", "Regional data often more relevant than literature"]
    },
    icmSwmm: {
      title: "Parameter Estimation in ICM SWMM",
      description: "Derive SWMM parameters using ICM tools.",
      steps: ["Import GIS data for land use", "Apply lookup tables", "Calculate spatially-weighted values", "Verify against field data"],
      tips: ["GIS-derived parameters should be verified with spot checks"]
    },
    icm: {
      title: "Parameter Estimation in ICM",
      description: "Use ICM's GIS integration for parameter derivation.",
      steps: ["Link land use and soil data", "Apply standard relationships", "Calculate catchment parameters", "Quality-check derived values"],
      tips: ["ICM's SQL tools help identify parameter outliers"]
    }
  },
  {
    chapterNumber: 15,
    chapterTitle: "Error Analysis",
    swmm5: {
      title: "Error Analysis in SWMM5",
      description: "Analyze and understand model errors.",
      steps: ["Calculate residuals", "Plot error distributions", "Identify systematic biases", "Investigate error sources"],
      tips: ["Residual patterns reveal model deficiencies", "Random errors are acceptable; systematic errors need attention"]
    },
    icmSwmm: {
      title: "Error Analysis in ICM SWMM",
      description: "Use ICM tools for error investigation.",
      steps: ["Calculate difference time series", "Plot residual distributions", "Identify temporal patterns", "Link errors to model components"],
      tips: ["ICM's plotting tools help visualize error patterns"]
    },
    icm: {
      title: "Error Diagnostics in ICM",
      description: "Comprehensive error analysis with ICM.",
      steps: ["Generate error statistics", "Visualize spatial error patterns", "Identify problematic areas", "Target model improvements"],
      tips: ["Spatial error maps guide where to improve the model"]
    }
  },
  {
    chapterNumber: 16,
    chapterTitle: "Continuous Modeling",
    swmm5: {
      title: "Continuous Modeling Best Practices",
      description: "Optimize SWMM5 for long-term simulations.",
      steps: ["Select appropriate time steps", "Configure water balance", "Set up reporting", "Manage output file sizes"],
      tips: ["Longer reporting steps reduce file sizes", "Continuous models need careful water balance checking"]
    },
    icmSwmm: {
      title: "Continuous Modeling in ICM SWMM",
      description: "Run efficient long-term SWMM simulations.",
      steps: ["Configure simulation settings", "Optimize time steps", "Set up statistics collection", "Manage large outputs"],
      tips: ["ICM handles large output files more efficiently than standalone SWMM5"]
    },
    icm: {
      title: "Continuous Modeling in ICM",
      description: "Best practices for long-term ICM simulations.",
      steps: ["Use FAST simulation mode", "Configure appropriate outputs", "Set up statistical summarization", "Generate compliance reports"],
      tips: ["FAST mode dramatically reduces computation time for long runs"]
    }
  },
  {
    chapterNumber: 17,
    chapterTitle: "Future Directions",
    swmm5: {
      title: "Emerging Capabilities in SWMM",
      description: "Explore new features and integrations.",
      steps: ["Review recent SWMM updates", "Explore Python integration", "Consider GUI alternatives", "Stay connected with community"],
      tips: ["Open-source development enables community contributions", "Python wrappers like pyswmm extend capabilities"]
    },
    icmSwmm: {
      title: "Future Features in ICM SWMM",
      description: "Upcoming capabilities for ICM SWMM users.",
      steps: ["Follow Autodesk updates", "Explore Ruby scripting", "Consider cloud computing", "Engage with user community"],
      tips: ["ICM SWMM continues to evolve with new SWMM engine versions"]
    },
    icm: {
      title: "Future Directions for ICM",
      description: "Emerging capabilities in ICM platform.",
      steps: ["Explore machine learning integration", "Consider real-time applications", "Investigate cloud deployment", "Stay current with training"],
      tips: ["ICM Live enables real-time forecasting applications"]
    }
  }
];

const SoftwareExamplesSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<"all" | "swmm5" | "icmSwmm" | "icm">("all");

  const filteredExamples = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return softwareExamples.filter(chapter => {
      const matchesQuery = (example: SoftwareExample) => {
        if (!query) return true;
        return (
          example.title.toLowerCase().includes(query) ||
          example.description.toLowerCase().includes(query) ||
          example.steps.some(step => step.toLowerCase().includes(query)) ||
          example.tips.some(tip => tip.toLowerCase().includes(query))
        );
      };

      const chapterMatches = 
        chapter.chapterTitle.toLowerCase().includes(query) ||
        `chapter ${chapter.chapterNumber}`.includes(query);

      if (selectedSoftware === "all") {
        return chapterMatches || matchesQuery(chapter.swmm5) || matchesQuery(chapter.icmSwmm) || matchesQuery(chapter.icm);
      } else if (selectedSoftware === "swmm5") {
        return chapterMatches || matchesQuery(chapter.swmm5);
      } else if (selectedSoftware === "icmSwmm") {
        return chapterMatches || matchesQuery(chapter.icmSwmm);
      } else {
        return chapterMatches || matchesQuery(chapter.icm);
      }
    });
  }, [searchQuery, selectedSoftware]);

  const getExample = (chapter: ChapterData) => {
    if (selectedSoftware === "swmm5") return chapter.swmm5;
    if (selectedSoftware === "icmSwmm") return chapter.icmSwmm;
    if (selectedSoftware === "icm") return chapter.icm;
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Laptop className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Software Examples Search</h2>
          <p className="text-muted-foreground text-sm">Find practical examples across all 17 chapters for SWMM5, ICM SWMM, and ICM InfoWorks</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by topic, keyword, or chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedSoftware === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSoftware("all")}
            className="text-xs"
          >
            All Software
          </Button>
          <Button
            variant={selectedSoftware === "swmm5" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSoftware("swmm5")}
            className="text-xs"
          >
            🔵 SWMM5
          </Button>
          <Button
            variant={selectedSoftware === "icmSwmm" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSoftware("icmSwmm")}
            className="text-xs"
          >
            🟣 ICM SWMM
          </Button>
          <Button
            variant={selectedSoftware === "icm" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSoftware("icm")}
            className="text-xs"
          >
            🟢 ICM InfoWorks
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Found <span className="font-semibold text-foreground">{filteredExamples.length}</span> of 17 chapters
        </p>
        {searchQuery && (
          <Badge variant="secondary" className="gap-1">
            <Filter className="w-3 h-3" />
            Filtered
          </Badge>
        )}
      </div>

      {/* Results */}
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {filteredExamples.map((chapter) => (
            <Card key={chapter.chapterNumber} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <Link 
                    to={`/chapter/${chapter.chapterNumber}`}
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                  >
                    Chapter {chapter.chapterNumber}: {chapter.chapterTitle}
                  </Link>
                </div>
                <Link to={`/chapter/${chapter.chapterNumber}`}>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    <Code className="w-3 h-3" />
                    View Chapter
                  </Button>
                </Link>
              </div>

              {selectedSoftware === "all" ? (
                <Tabs defaultValue="swmm5" className="mt-2">
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="swmm5" className="text-xs">🔵 SWMM5</TabsTrigger>
                    <TabsTrigger value="icmSwmm" className="text-xs">🟣 ICM SWMM</TabsTrigger>
                    <TabsTrigger value="icm" className="text-xs">🟢 ICM InfoWorks</TabsTrigger>
                  </TabsList>
                  <TabsContent value="swmm5" className="mt-2">
                    <ExampleCard example={chapter.swmm5} color="blue" />
                  </TabsContent>
                  <TabsContent value="icmSwmm" className="mt-2">
                    <ExampleCard example={chapter.icmSwmm} color="purple" />
                  </TabsContent>
                  <TabsContent value="icm" className="mt-2">
                    <ExampleCard example={chapter.icm} color="green" />
                  </TabsContent>
                </Tabs>
              ) : (
                <ExampleCard 
                  example={getExample(chapter)!} 
                  color={selectedSoftware === "swmm5" ? "blue" : selectedSoftware === "icmSwmm" ? "purple" : "green"} 
                />
              )}
            </Card>
          ))}

          {filteredExamples.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No examples found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Documentation Links */}
      <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 justify-center">
        <a 
          href="https://www.epa.gov/water-research/storm-water-management-model-swmm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          EPA SWMM Docs
        </a>
        <a 
          href="https://help.autodesk.com/view/IWICMS/2025/ENU/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Autodesk ICM Docs
        </a>
        <a 
          href="https://www.youtube.com/results?search_query=swmm+tutorial"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <Youtube className="w-4 h-4" />
          Video Tutorials
        </a>
      </div>
    </Card>
  );
};

const ExampleCard = ({ example, color }: { example: SoftwareExample; color: "blue" | "purple" | "green" }) => {
  const colorClasses = {
    blue: "border-l-blue-500 bg-blue-500/5",
    purple: "border-l-purple-500 bg-purple-500/5",
    green: "border-l-green-500 bg-green-500/5"
  };

  const dotClasses = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-green-500"
  };

  return (
    <div className={`border-l-2 pl-3 py-2 rounded-r ${colorClasses[color]}`}>
      <h4 className="font-semibold text-foreground text-sm mb-1">{example.title}</h4>
      <p className="text-xs text-muted-foreground mb-2">{example.description}</p>
      <div className="flex flex-wrap gap-1">
        {example.tips.slice(0, 2).map((tip, index) => (
          <span key={index} className={`text-xs ${dotClasses[color]}`}>• {tip}</span>
        ))}
      </div>
    </div>
  );
};

export default SoftwareExamplesSearch;
