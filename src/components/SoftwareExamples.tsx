import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Laptop } from "lucide-react";

interface SoftwareExample {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
}

interface ChapterExamples {
  swmm5: SoftwareExample;
  icm: SoftwareExample;
}

const chapterExamples: Record<number, ChapterExamples> = {
  1: {
    swmm5: {
      title: "Creating Your First SWMM5 Model",
      description: "Build a simple subcatchment model to understand the modeling workflow from real-world observation to prediction.",
      steps: [
        "Open SWMM5 and create a new project",
        "Add a subcatchment by drawing on the study area map",
        "Define subcatchment properties: Area, Width, % Impervious, Slope",
        "Add an outfall node as the discharge point",
        "Connect subcatchment to outfall with a conduit or direct connection",
        "Add a simple rainfall time series (e.g., 1-inch, 1-hour storm)",
        "Run the simulation and observe the resulting hydrograph"
      ],
      tips: [
        "Start simple—one subcatchment teaches you more than copying a complex model",
        "Compare your runoff coefficient to published values for your land use",
        "The model is a decision tool, not a crystal ball"
      ]
    },
    icm: {
      title: "Creating Your First ICM Model",
      description: "Build a catchment model in InfoWorks ICM to experience the full modeling cycle from conceptualization to results.",
      steps: [
        "Create a new Network in ICM and set coordinate system",
        "Import or draw a subcatchment polygon",
        "Define runoff surface types (impervious/pervious percentages)",
        "Add a node (manhole or outfall) as collection point",
        "Create a link connecting the subcatchment runoff to the node",
        "Set up a rainfall event in the Event Editor",
        "Run a simulation and view results in the Results Analysis tool"
      ],
      tips: [
        "Use the 'Validate Network' tool early and often",
        "ICM's integrated 1D/2D capability doesn't mean you need 2D for every model",
        "Focus on whether results inform your decision, not pixel-perfect accuracy"
      ]
    }
  },
  2: {
    swmm5: {
      title: "Subcatchment Discretization in SWMM5",
      description: "Explore how subdividing a catchment affects model results and computational requirements.",
      steps: [
        "Create a model with a single large subcatchment (e.g., 100 acres)",
        "Run simulation and record peak flow, time to peak, and total volume",
        "Subdivide into 4 subcatchments with appropriate routing",
        "Re-run and compare results",
        "Further subdivide into 16 subcatchments",
        "Compare computational time vs. result changes",
        "Document the 'diminishing returns' point"
      ],
      tips: [
        "Width parameter is critical—it controls time of concentration",
        "More subcatchments ≠ better results, especially without spatial data",
        "Match discretization to your available data quality"
      ]
    },
    icm: {
      title: "Grid-Based vs. Subcatchment Discretization in ICM",
      description: "Compare polygon-based and grid-based spatial representations in ICM.",
      steps: [
        "Create a model using traditional subcatchment polygons",
        "Run and record key results (peaks, volumes, timing)",
        "Convert to a 2D mesh representation of the same area",
        "Set up equivalent rainfall and roughness parameters",
        "Run 2D simulation and compare results",
        "Analyze where differences occur (flat areas vs. defined channels)",
        "Evaluate computational cost vs. accuracy improvements"
      ],
      tips: [
        "2D adds value for surface flooding, not necessarily pipe hydraulics",
        "Mesh resolution should match your DEM accuracy",
        "The CFL condition controls timestep in 2D—finer mesh = slower runs"
      ]
    }
  },
  3: {
    swmm5: {
      title: "Data Quality Assessment in SWMM5",
      description: "Evaluate the reliability of input data and its impact on model uncertainty.",
      steps: [
        "Import a rainfall time series from a local gauge",
        "Check for gaps, zeros, and suspicious values",
        "Compare gauge data to regional estimates (NOAA Atlas 14)",
        "Import GIS-derived impervious percentages",
        "Cross-check with aerial imagery for sample areas",
        "Document data sources and quality ratings in project notes",
        "Run sensitivity tests on uncertain parameters"
      ],
      tips: [
        "Rainfall data quality drives 80% of model uncertainty",
        "Always document your data sources—future you will thank you",
        "Missing data is better acknowledged than silently interpolated"
      ]
    },
    icm: {
      title: "GIS Integration and Data Validation in ICM",
      description: "Leverage ICM's GIS capabilities to import, validate, and quality-control input data.",
      steps: [
        "Import pipe network from GIS shapefile or geodatabase",
        "Use the 'Validate Network' tool to find connectivity issues",
        "Import subcatchment boundaries and land use data",
        "Use SQL queries to identify suspect values (e.g., WHERE diameter < 0.1)",
        "Cross-reference imported elevations against survey data",
        "Flag low-confidence data using user-defined fields",
        "Generate a data quality report for project documentation"
      ],
      tips: [
        "ICM's SQL query engine is powerful for data QA/QC",
        "Don't trust GIS data blindly—field verify critical assets",
        "Separate 'as-built' confidence from 'assumed' values in your database"
      ]
    }
  },
  4: {
    swmm5: {
      title: "Optimal Complexity Selection in SWMM5",
      description: "Compare simple and complex model configurations to find the appropriate level of detail.",
      steps: [
        "Build a simple model: lumped subcatchment, single outlet",
        "Run baseline simulation and record key metrics",
        "Add complexity: multiple subcatchments, realistic routing",
        "Compare results—does added detail change decisions?",
        "Add more complexity: LID controls, groundwater, water quality",
        "Document the point where additional complexity stops improving answers",
        "Select the model that adequately answers your question"
      ],
      tips: [
        "Parsimony: choose the simplest model that serves your purpose",
        "Complexity should be justified by data availability and decision needs",
        "Over-parameterized models can calibrate well but predict poorly"
      ]
    },
    icm: {
      title: "1D vs. 1D/2D Model Complexity in ICM",
      description: "Evaluate when integrated 2D modeling adds value vs. unnecessary complexity.",
      steps: [
        "Build a 1D pipe network model for a flooding study",
        "Run and identify locations of predicted surcharge/flooding",
        "Add 2D mesh to surface flood areas only",
        "Run 1D/2D coupled simulation",
        "Compare flood extents: 1D estimate vs. 2D simulation",
        "Calculate the additional computational cost",
        "Document whether 2D changed your design/management decision"
      ],
      tips: [
        "2D is essential for surface flood mapping, optional for pipe sizing",
        "Partial 2D zones (hot-spots) often provide 80% of benefit at 20% cost",
        "Match complexity to project requirements and budget"
      ]
    }
  },
  5: {
    swmm5: {
      title: "Continuous Simulation in SWMM5",
      description: "Set up long-term continuous simulation to capture seasonal variability and antecedent conditions.",
      steps: [
        "Obtain multi-year rainfall and evaporation data",
        "Configure the model for extended period simulation",
        "Enable groundwater and aquifer modules if relevant",
        "Set appropriate initial conditions (soil moisture, water levels)",
        "Run continuous simulation (weeks to years)",
        "Analyze the full range of system responses",
        "Extract design storm equivalents from continuous results"
      ],
      tips: [
        "Continuous simulation reveals system behavior event models miss",
        "Warm-up period is critical—start simulation before your period of interest",
        "Antecedent moisture conditions dramatically affect peak flows"
      ]
    },
    icm: {
      title: "Long-Term Simulation in ICM",
      description: "Configure ICM for continuous simulation with full water balance tracking.",
      steps: [
        "Import or create multi-year rainfall and evaporation time series",
        "Configure RunoffSurfaces for proper water balance (pervious losses)",
        "Set up Trade Waste or sanitary flow patterns for realistic DWF",
        "Enable RTC rules if real-time controls exist",
        "Run multi-year simulation in 'Fast' mode for efficiency",
        "Analyze seasonal patterns using Results Analysis",
        "Generate flow duration curves and CSO statistics"
      ],
      tips: [
        "ICM's FAST engine is optimized for long simulations—use it",
        "Continuous simulation is essential for CSO compliance modeling",
        "Validate base flows before focusing on storm events"
      ]
    }
  },
  6: {
    swmm5: {
      title: "Stochastic Rainfall Generation for SWMM5",
      description: "Generate synthetic rainfall for Monte Carlo analysis of system performance.",
      steps: [
        "Analyze historical rainfall to extract statistics (depth, duration, inter-event time)",
        "Use external tools (SSOAP, statistical software) to generate synthetic storms",
        "Import synthetic rainfall series into SWMM5",
        "Run multiple simulations with different synthetic inputs",
        "Compile statistics on model outputs (peak flows, volumes, CSO events)",
        "Compare synthetic results to design storm assumptions",
        "Quantify the uncertainty range in your predictions"
      ],
      tips: [
        "Stochastic rainfall reveals the range of possible outcomes, not just one",
        "Synthetic storms should preserve key statistics of observed data",
        "Monte Carlo results are only as good as your rainfall generator"
      ]
    },
    icm: {
      title: "Synthetic Rainfall and Ensemble Runs in ICM",
      description: "Use ICM's capabilities for probabilistic analysis with synthetic rainfall inputs.",
      steps: [
        "Generate synthetic rainfall series using external tools or ICM's built-in options",
        "Create multiple rainfall events representing the statistical population",
        "Set up a scenario matrix with different rainfall inputs",
        "Use ICM's batch run capabilities for efficiency",
        "Post-process results to generate statistical summaries",
        "Create probability distributions of key outputs (CSOs, flooding)",
        "Compare to deterministic design storm results"
      ],
      tips: [
        "ICM Exchange can automate batch runs with varying inputs",
        "Synthetic rainfall analysis is critical for CSO long-term planning",
        "Document the statistical basis of your synthetic rainfall"
      ]
    }
  },
  7: {
    swmm5: {
      title: "Moving Storm Analysis in SWMM5",
      description: "Analyze how storm motion affects peak flows in different parts of your drainage system.",
      steps: [
        "Set up a model with multiple subcatchments in sequence",
        "Create a stationary storm rainfall input",
        "Run simulation and record peak at outlet",
        "Create moving storm variants (upstream-to-downstream, reverse)",
        "Shift rainfall timing between subcatchments to simulate motion",
        "Compare peaks for different storm motion scenarios",
        "Identify critical storm direction for your catchment"
      ],
      tips: [
        "Storms moving with the drainage direction often produce higher peaks",
        "Critical storm velocity depends on catchment time of concentration",
        "This analysis is crucial for long, narrow catchments"
      ]
    },
    icm: {
      title: "Spatial Rainfall Variation in ICM",
      description: "Model spatial and temporal rainfall patterns to capture storm dynamics.",
      steps: [
        "Create multiple rainfall profiles for different catchment zones",
        "Assign spatial rainfall using TVD (Thiessen) or grid-based methods",
        "Simulate a storm moving across the catchment",
        "Compare to uniform rainfall assumption",
        "Use radar rainfall data if available for realistic spatial patterns",
        "Analyze which subcatchments are most sensitive to storm position",
        "Document the range of results from spatial variability"
      ],
      tips: [
        "ICM supports radar rainfall directly—powerful for large catchments",
        "Uniform rainfall often underestimates peak flows in elongated catchments",
        "Spatial variability matters more for large catchments (>1 sq mile)"
      ]
    }
  },
  8: {
    swmm5: {
      title: "Design Storm Implementation in SWMM5",
      description: "Apply standard design storms correctly while understanding their limitations.",
      steps: [
        "Obtain IDF curves or design storm data for your location (NOAA Atlas 14)",
        "Create a SCS Type II or appropriate regional storm distribution",
        "Apply to model and run for multiple return periods (2-yr, 10-yr, 100-yr)",
        "Compare results to regulatory requirements",
        "Document the design storm's basis and applicability",
        "Consider running alternative storm patterns for sensitivity",
        "Recognize design storms as tools, not predictions"
      ],
      tips: [
        "Design storms represent statistical concepts, not real events",
        "Climate change may alter IDF curves—check for updated data",
        "Peak timing in synthetic storms can be unrealistic—be aware of limitations"
      ]
    },
    icm: {
      title: "Design Rainfall Application in ICM",
      description: "Implement design storms using ICM's flexible rainfall tools.",
      steps: [
        "Use the Rainfall Editor to create design storm profiles",
        "Apply depth-duration-frequency data from local sources",
        "Create storm distributions (symmetric, front-loaded, Chicago, etc.)",
        "Set up scenarios for multiple return periods",
        "Run simulations and check for pipe capacity and flooding",
        "Export results for regulatory submittals",
        "Compare design storm results to continuous simulation statistics"
      ],
      tips: [
        "ICM's Rainfall Generator can create multiple storm types automatically",
        "Design storms are regulatory tools—real storms behave differently",
        "Continuous simulation often gives more realistic risk assessment"
      ]
    }
  },
  9: {
    swmm5: {
      title: "Extreme Event Modeling in SWMM5",
      description: "Model rare, high-consequence events while understanding extrapolation uncertainty.",
      steps: [
        "Obtain historical data for the largest events on record",
        "Extrapolate to design return periods (100-yr, 500-yr) using frequency analysis",
        "Apply extreme rainfall to calibrated model",
        "Evaluate system performance under extreme conditions",
        "Identify failure points and cascading effects",
        "Document the uncertainty in extreme event estimates",
        "Present results as ranges, not single values"
      ],
      tips: [
        "Extreme events are where model uncertainty is highest",
        "Extrapolation beyond data range requires humility in predictions",
        "Failure modes matter as much as capacity checks"
      ]
    },
    icm: {
      title: "High-Consequence Event Analysis in ICM",
      description: "Model extreme scenarios using ICM's 2D capabilities for flood mapping.",
      steps: [
        "Set up extreme rainfall scenarios based on frequency analysis",
        "Enable 2D simulation for surface flooding representation",
        "Model dam-break or levee failure scenarios if relevant",
        "Run simulations and map inundation extents",
        "Analyze depth, velocity, and hazard (DxV) ratings",
        "Create flood hazard maps with appropriate uncertainty bounds",
        "Document model limitations for extreme events"
      ],
      tips: [
        "2D is essential for extreme flood mapping",
        "Model results for rare events should include uncertainty ranges",
        "Hazard mapping requires velocity as well as depth"
      ]
    }
  },
  10: {
    swmm5: {
      title: "Uncertainty Analysis in SWMM5",
      description: "Quantify prediction uncertainty using Monte Carlo and sensitivity methods.",
      steps: [
        "Identify key uncertain parameters (CN, roughness, impervious %)",
        "Define probability distributions for each parameter",
        "Use external tools (Excel, Python, R) to generate parameter sets",
        "Run SWMM5 multiple times with varying parameters (batch mode)",
        "Compile output distributions (peaks, volumes, timing)",
        "Calculate confidence intervals for predictions",
        "Present results with appropriate uncertainty bounds"
      ],
      tips: [
        "100-500 Monte Carlo runs typically sufficient for stable estimates",
        "Parameter correlations matter—don't assume independence",
        "Uncertainty is not a weakness—it's honest communication"
      ]
    },
    icm: {
      title: "Probabilistic Analysis in ICM",
      description: "Leverage ICM's capabilities for systematic uncertainty quantification.",
      steps: [
        "Use Scenario Manager to create parameter variation runs",
        "Vary key parameters: roughness, runoff coefficients, pipe conditions",
        "Run multiple scenarios using batch processing",
        "Use Results Analysis to compare across scenarios",
        "Export to statistical software for distribution fitting",
        "Generate confidence bounds on model predictions",
        "Document parameter uncertainty in project reports"
      ],
      tips: [
        "ICM Exchange enables automated Monte Carlo runs",
        "Focus uncertainty analysis on parameters that drive decisions",
        "Sensitivity analysis first, then Monte Carlo on sensitive parameters"
      ]
    }
  },
  11: {
    swmm5: {
      title: "Sensitivity Analysis in SWMM5",
      description: "Identify which parameters most influence model results.",
      steps: [
        "List all model parameters that have uncertainty",
        "Define base case and ±10% or ±1 standard deviation variations",
        "Run simulations varying one parameter at a time (OAT)",
        "Calculate sensitivity indices (% change output / % change input)",
        "Rank parameters by influence on key outputs",
        "Focus calibration and data collection on sensitive parameters",
        "Document insensitive parameters—they may not need refinement"
      ],
      tips: [
        "Width and % Impervious often dominate subcatchment sensitivity",
        "Roughness matters most in long pipes with partial flow",
        "Insensitive parameters can use default values confidently"
      ]
    },
    icm: {
      title: "Parameter Sensitivity in ICM",
      description: "Use ICM tools to systematically evaluate parameter importance.",
      steps: [
        "Create a base case model with calibrated parameters",
        "Use Scenario Manager to create parameter variation runs",
        "Vary one parameter at a time across its uncertainty range",
        "Run all scenarios and export key results",
        "Calculate sensitivity ratios for each parameter-output pair",
        "Create tornado diagrams to visualize sensitivities",
        "Prioritize parameters for data collection and calibration"
      ],
      tips: [
        "ICM's SQL can help batch-modify parameters efficiently",
        "Global sensitivity methods (Morris, Sobol) are more robust than OAT",
        "Sensitivity rankings may differ for different outputs (peak vs. volume)"
      ]
    }
  },
  12: {
    swmm5: {
      title: "Understanding State Variables in SWMM5",
      description: "Visualize how system state (storage, flows) evolves through time.",
      steps: [
        "Set up a model with storage nodes (ponds, tanks, or surcharged manholes)",
        "Run simulation and output detailed time series",
        "Plot storage volume vs. time for key locations",
        "Overlay inflow and outflow hydrographs",
        "Identify state variable trajectories during events",
        "Analyze how initial conditions affect the state path",
        "Understand the 'memory' in your system"
      ],
      tips: [
        "Storage nodes in SWMM5 are explicit state variables",
        "Surcharged pipes also have 'state'—their water level",
        "Initial conditions matter more for systems with storage"
      ]
    },
    icm: {
      title: "State Space Analysis in ICM",
      description: "Explore system dynamics using ICM's results analysis and animation tools.",
      steps: [
        "Run a simulation with storage facilities or RTC elements",
        "Use Long Section view to animate water levels through time",
        "Plot storage facility volume and water level time series",
        "Export state variable data for phase-space plots",
        "Analyze how the system moves through state space during an event",
        "Identify equilibrium points and transitions",
        "Use animations to communicate system dynamics to stakeholders"
      ],
      tips: [
        "ICM's animation tools are excellent for visualizing state evolution",
        "RTC elements explicitly use state variables for control logic",
        "Phase diagrams (volume vs. flow) reveal system behavior patterns"
      ]
    }
  },
  13: {
    swmm5: {
      title: "Model Performance Evaluation in SWMM5",
      description: "Quantify how well your model reproduces observed data.",
      steps: [
        "Obtain observed flow data for calibration/validation periods",
        "Run model for the same periods",
        "Export modeled results at observation points",
        "Calculate performance metrics: NSE, PBIAS, RMSE, R²",
        "Create visual comparisons: hydrograph overlays, scatter plots",
        "Evaluate volume balance (total modeled vs. observed)",
        "Document performance and identify systematic biases"
      ],
      tips: [
        "NSE > 0.5 is often considered 'acceptable', >0.75 is 'good'",
        "Visual inspection catches issues metrics miss",
        "Validate on independent events not used for calibration"
      ]
    },
    icm: {
      title: "Calibration Assessment in ICM",
      description: "Use ICM's built-in tools to evaluate model-observation agreement.",
      steps: [
        "Import observed flow data as a Time Series Database or CSV",
        "Set up observed data layers in the model",
        "Run simulation and enable comparison mode",
        "Use 'Compare Observed' in Results Analysis",
        "Review scatter plots and time series overlays",
        "Calculate statistics using ICM's built-in tools or export to Excel",
        "Document calibration performance in project reports"
      ],
      tips: [
        "ICM can display observed and modeled data on the same graph",
        "Check timing (peak time) as well as magnitude (peak value)",
        "Multiple metrics give a fuller picture than any single statistic"
      ]
    }
  },
  14: {
    swmm5: {
      title: "Parameter Optimization in SWMM5",
      description: "Use systematic methods to find optimal parameter values.",
      steps: [
        "Identify parameters to optimize (typically 5-10 key parameters)",
        "Define parameter bounds based on physical constraints",
        "Choose an objective function (e.g., minimize RMSE, maximize NSE)",
        "Use external optimization tools (PEST, Python scipy.optimize, R)",
        "Link optimizer to SWMM5 via command-line execution",
        "Run optimization and monitor convergence",
        "Validate optimized parameters on independent data"
      ],
      tips: [
        "SWMM5's .inp and .rpt files make external optimization straightforward",
        "Multi-objective optimization avoids over-fitting to single metrics",
        "Always validate—a well-calibrated model can still predict poorly"
      ]
    },
    icm: {
      title: "Automated Calibration in ICM",
      description: "Leverage ICM's optimization capabilities for efficient parameter estimation.",
      steps: [
        "Select parameters for optimization using Scenario Manager",
        "Define parameter ranges and objective functions",
        "Use ICM Exchange for automated batch runs if available",
        "Alternatively, use external tools with Ruby/Python scripting",
        "Run genetic algorithm or gradient-based optimization",
        "Review Pareto front for multi-objective problems",
        "Validate calibrated model on independent events"
      ],
      tips: [
        "ICM's Open Data Import/Export Centre enables scripted automation",
        "Consider equifinality—multiple parameter sets may fit equally well",
        "Document your objective function and optimization method"
      ]
    }
  },
  15: {
    swmm5: {
      title: "Real-Time Control Logic in SWMM5",
      description: "Implement and test control rules that could incorporate fuzzy logic concepts.",
      steps: [
        "Identify control points (orifices, weirs, pumps) in your model",
        "Define control rules using SWMM5's CONTROL section",
        "Start with simple IF-THEN rules based on water levels",
        "Test control behavior under various storm scenarios",
        "Consider how 'fuzzy' transitions could smooth control",
        "Implement membership function concepts via piecewise rules",
        "Evaluate control performance and energy/cost metrics"
      ],
      tips: [
        "SWMM5 controls are crisp (IF-THEN), but can approximate fuzzy behavior",
        "Smooth transitions prevent hydraulic shocks from sudden valve changes",
        "Test controls under extreme conditions, not just design events"
      ]
    },
    icm: {
      title: "Advanced RTC with Fuzzy Concepts in ICM",
      description: "Use ICM's Real-Time Control to implement sophisticated control strategies.",
      steps: [
        "Set up RTC elements (regulators, pumps) in your model",
        "Define control logic using ICM's RTC module",
        "Implement state-dependent rules that can emulate fuzzy transitions",
        "Use lookup tables or piecewise functions for smooth control",
        "Create 'linguistic' rule sets (e.g., IF level IS HIGH THEN...)",
        "Test control performance under Monte Carlo storm inputs",
        "Optimize control parameters for multiple objectives"
      ],
      tips: [
        "ICM's RTC is very flexible—many fuzzy concepts can be implemented",
        "Document control logic clearly for operators and future modelers",
        "Fuzzy control reduces sensitivity to sensor uncertainty"
      ]
    }
  },
  16: {
    swmm5: {
      title: "Real-Time Forecast Uncertainty in SWMM5",
      description: "Generate and communicate ensemble forecasts for real-time decision support.",
      steps: [
        "Set up model for real-time or near-real-time simulation",
        "Define uncertain inputs (rainfall forecast, initial conditions)",
        "Generate ensemble runs with perturbed inputs",
        "Run batch simulations for each ensemble member",
        "Compile results into probabilistic forecasts (percentiles)",
        "Create displays showing forecast range, not just single line",
        "Update forecasts as new observations become available"
      ],
      tips: [
        "Ensemble forecasts are more honest than deterministic predictions",
        "Decision-makers need to understand probability, not just 'the answer'",
        "Update models frequently during events for best accuracy"
      ]
    },
    icm: {
      title: "Probabilistic Forecasting in ICM",
      description: "Implement ensemble-based forecasting for operational decision support.",
      steps: [
        "Connect ICM to real-time data feeds (SCADA, rainfall)",
        "Set up ensemble rainfall forecasts from NWS or private sources",
        "Run multiple model instances with forecast variants",
        "Use ICM Live or batch processing for efficient ensemble runs",
        "Generate exceedance probability displays for key locations",
        "Create automated alerts based on probability thresholds",
        "Document forecast skill and update methods over time"
      ],
      tips: [
        "ICM Live is designed for real-time ensemble forecasting",
        "Probability of exceedance is often more useful than 'expected' value",
        "Calibrate your uncertainty—forecasts should be reliable and sharp"
      ]
    }
  },
  17: {
    swmm5: {
      title: "Responsible Modeling Workflow in SWMM5",
      description: "Integrate all principles into a comprehensive, defensible modeling practice.",
      steps: [
        "Document project purpose and success criteria before modeling",
        "Record all data sources, quality assessments, and assumptions",
        "Choose appropriate complexity based on objectives and data",
        "Calibrate with observed data; validate with independent data",
        "Quantify and communicate uncertainty honestly",
        "Archive models, inputs, and outputs for reproducibility",
        "Present results in decision-relevant formats with limitations stated"
      ],
      tips: [
        "Responsible modeling is a philosophy, not just a checklist",
        "Your model report should enable someone else to reproduce your work",
        "The goal is informed decisions, not impressive numbers"
      ]
    },
    icm: {
      title: "Best Practices Integration in ICM",
      description: "Apply responsible modeling principles throughout the ICM project lifecycle.",
      steps: [
        "Establish project documentation standards in ICM's Project panel",
        "Use Model Groups and scenarios to organize alternatives",
        "Document data sources and quality in object notes and custom fields",
        "Maintain calibration/validation records in the Project",
        "Generate uncertainty bounds on key predictions",
        "Use version control and change tracking",
        "Create clear, honest reports using Results Analysis exports"
      ],
      tips: [
        "ICM's built-in documentation features are powerful—use them",
        "Future modelers (including future you) will thank you for good notes",
        "Ethical modeling means honest communication of limitations"
      ]
    }
  }
};

interface SoftwareExamplesProps {
  chapterNumber: number;
}

export const SoftwareExamples = ({ chapterNumber }: SoftwareExamplesProps) => {
  const examples = chapterExamples[chapterNumber];
  
  if (!examples) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 hover:from-blue-500/20 hover:to-green-500/20 border-primary/20"
        >
          <Laptop className="w-4 h-4" />
          <span>Software Examples: SWMM5 & ICM InfoWorks</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            Chapter {chapterNumber}: Practical Software Examples
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="swmm5" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="swmm5" className="text-sm font-medium">
              🔵 EPA SWMM5
            </TabsTrigger>
            <TabsTrigger value="icm" className="text-sm font-medium">
              🟢 ICM InfoWorks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="swmm5" className="mt-4 space-y-4">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <h3 className="text-xl font-bold text-foreground mb-2">{examples.swmm5.title}</h3>
              <p className="text-muted-foreground mb-4">{examples.swmm5.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step-by-Step:</h4>
                  <ol className="space-y-2">
                    {examples.swmm5.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    💡 Practical Tips
                  </h4>
                  <ul className="space-y-1">
                    {examples.swmm5.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-blue-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="icm" className="mt-4 space-y-4">
            <Card className="p-6 border-l-4 border-l-green-500">
              <h3 className="text-xl font-bold text-foreground mb-2">{examples.icm.title}</h3>
              <p className="text-muted-foreground mb-4">{examples.icm.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Step-by-Step:</h4>
                  <ol className="space-y-2">
                    {examples.icm.steps.map((step, index) => (
                      <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    💡 Practical Tips
                  </h4>
                  <ul className="space-y-1">
                    {examples.icm.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-green-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-xs text-muted-foreground text-center border-t pt-4">
          Examples based on 50+ years of practical experience with SWMM (since SWMM3) and ICM InfoWorks
        </div>
      </DialogContent>
    </Dialog>
  );
};
