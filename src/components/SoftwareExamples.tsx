import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Laptop, Scale } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SoftwareExample {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
}

interface ComparisonItem {
  feature: string;
  swmm5: string;
  icm: string;
}

interface ChapterExamples {
  swmm5: SoftwareExample;
  icm: SoftwareExample;
  comparison: ComparisonItem[];
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
    },
    comparison: [
      { feature: "Interface", swmm5: "Simple, lightweight GUI", icm: "Feature-rich GIS-integrated interface" },
      { feature: "Learning Curve", swmm5: "Easier for beginners", icm: "Steeper but more powerful" },
      { feature: "Cost", swmm5: "Free, open-source (EPA)", icm: "Commercial license required" },
      { feature: "2D Capability", swmm5: "Limited (requires external tools)", icm: "Fully integrated 1D/2D" },
      { feature: "GIS Integration", swmm5: "Basic import/export", icm: "Native geodatabase support" },
      { feature: "Model Size", swmm5: "Best for small-medium models", icm: "Scales to very large networks" }
    ]
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
    },
    comparison: [
      { feature: "Spatial Resolution", swmm5: "User-defined subcatchments", icm: "Flexible polygon or mesh-based" },
      { feature: "Routing Options", swmm5: "Kinematic or dynamic wave", icm: "Multiple routing engines including 2D" },
      { feature: "Auto-Discretization", swmm5: "Manual or external tools", icm: "Built-in mesh generation" },
      { feature: "Terrain Handling", swmm5: "Simplified slope parameters", icm: "Direct DEM integration" },
      { feature: "Performance", swmm5: "Fast for 1D networks", icm: "Optimized for large 1D/2D models" },
      { feature: "Visual Feedback", swmm5: "Basic profile/map views", icm: "3D visualization, animations" }
    ]
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
    },
    comparison: [
      { feature: "Data Import", swmm5: "CSV, text files, basic GIS", icm: "Native geodatabase, ODBC, many formats" },
      { feature: "Validation Tools", swmm5: "Basic error checking", icm: "Comprehensive network validation suite" },
      { feature: "SQL Queries", swmm5: "Not available", icm: "Built-in SQL for data analysis" },
      { feature: "Data Flagging", swmm5: "Manual notes only", icm: "Custom fields for confidence levels" },
      { feature: "Audit Trail", swmm5: "Manual documentation", icm: "Built-in versioning and history" },
      { feature: "Reporting", swmm5: "Basic text reports", icm: "Customizable report templates" }
    ]
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
    },
    comparison: [
      { feature: "Model Types", swmm5: "1D hydrology and hydraulics", icm: "1D, 2D, and coupled 1D/2D" },
      { feature: "LID/SUDS", swmm5: "Built-in LID controls", icm: "SUDS via runoff surfaces and RTCs" },
      { feature: "Water Quality", swmm5: "Integrated WQ module", icm: "Separate but powerful WQ engine" },
      { feature: "Groundwater", swmm5: "Simplified aquifer model", icm: "Groundwater infiltration module" },
      { feature: "RTC", swmm5: "Basic control rules", icm: "Advanced RTC with scripting" },
      { feature: "Optimization", swmm5: "External tools required", icm: "Built-in optimization capabilities" }
    ]
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
    },
    comparison: [
      { feature: "Simulation Speed", swmm5: "Good for moderate periods", icm: "FAST engine for multi-year runs" },
      { feature: "Water Balance", swmm5: "Complete hydrologic cycle", icm: "Detailed runoff surface accounting" },
      { feature: "Evaporation", swmm5: "Daily or monthly data", icm: "Flexible temporal resolution" },
      { feature: "Initial Conditions", swmm5: "User-specified or hotstart", icm: "Hotstart files, initial state editor" },
      { feature: "Statistics", swmm5: "Post-processing required", icm: "Built-in flow duration curves" },
      { feature: "CSO Analysis", swmm5: "Manual event counting", icm: "Automated CSO volume/frequency stats" }
    ]
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
    },
    comparison: [
      { feature: "Rainfall Generation", swmm5: "External tools (SSOAP, etc.)", icm: "External or built-in patterns" },
      { feature: "Batch Processing", swmm5: "Command-line scripting", icm: "ICM Exchange automation" },
      { feature: "Parameter Variation", swmm5: "Manual or Python scripts", icm: "Scenario manager, sensitivity tool" },
      { feature: "Monte Carlo", swmm5: "External implementation", icm: "Can be set up with Exchange" },
      { feature: "Results Statistics", swmm5: "External post-processing", icm: "Built-in statistics and graphs" },
      { feature: "Automation", swmm5: "Python, MATLAB interfaces", icm: "Ruby API, Exchange platform" }
    ]
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
    },
    comparison: [
      { feature: "Spatial Rainfall", swmm5: "Rain gage assignment per subcatch", icm: "TVD, grid, radar options" },
      { feature: "Radar Data", swmm5: "Not directly supported", icm: "Native radar rainfall import" },
      { feature: "Moving Storms", swmm5: "Manual lag implementation", icm: "Spatial profiles with timing" },
      { feature: "Visualization", swmm5: "Static rain gage map", icm: "Animated rainfall display" },
      { feature: "Large Catchments", swmm5: "Cumbersome for many gages", icm: "Efficient for regional models" },
      { feature: "Climate Scenarios", swmm5: "Manual factor application", icm: "Scenario-based rainfall factors" }
    ]
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
    },
    comparison: [
      { feature: "Storm Types", swmm5: "User-defined time series", icm: "Built-in generator for standard types" },
      { feature: "IDF Curves", swmm5: "Manual input", icm: "IDF database with interpolation" },
      { feature: "Return Periods", swmm5: "One storm per run", icm: "Scenario matrix for multiple" },
      { feature: "Chicago Storm", swmm5: "Manual creation", icm: "Automatic generation" },
      { feature: "Climate Factors", swmm5: "Manual scaling", icm: "Built-in uplift factors" },
      { feature: "Nested Storms", swmm5: "Manual nesting", icm: "Standard nested storm options" }
    ]
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
    },
    comparison: [
      { feature: "Extreme Storms", swmm5: "Standard input, no special handling", icm: "Same, but better flood mapping" },
      { feature: "Flood Mapping", swmm5: "Requires external GIS", icm: "Built-in flood mapping tools" },
      { feature: "Dam Break", swmm5: "Not supported", icm: "Built-in dam break modeling" },
      { feature: "Hazard Rating", swmm5: "Manual calculation", icm: "Automatic DxV hazard maps" },
      { feature: "Levee Failure", swmm5: "Not supported", icm: "Breach modeling available" },
      { feature: "Uncertainty Display", swmm5: "Manual in reports", icm: "Scenario comparison tools" }
    ]
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
        "Use ICM's sensitivity analysis tool to identify key parameters",
        "Set up parameter ranges and distributions",
        "Configure batch runs using scenario management",
        "Run multiple scenarios systematically",
        "Use built-in results comparison tools",
        "Generate probabilistic outputs and confidence bounds",
        "Document parameter sensitivity rankings"
      ],
      tips: [
        "ICM's sensitivity tool quickly identifies dominant parameters",
        "Focus uncertainty effort on parameters that matter most",
        "Consider both input and structural uncertainty"
      ]
    },
    comparison: [
      { feature: "Sensitivity Analysis", swmm5: "Manual parameter variation", icm: "Built-in sensitivity tool" },
      { feature: "Monte Carlo", swmm5: "External implementation", icm: "Can be automated via Exchange" },
      { feature: "Batch Runs", swmm5: "Command-line, scripting", icm: "Scenario manager, scheduling" },
      { feature: "Parameter Ranges", swmm5: "User tracks externally", icm: "Stored in model database" },
      { feature: "Results Comparison", swmm5: "External post-processing", icm: "Built-in comparison tools" },
      { feature: "Confidence Bounds", swmm5: "Calculate externally", icm: "Statistical output options" }
    ]
  },
  11: {
    swmm5: {
      title: "Calibration Protocol in SWMM5",
      description: "Systematically calibrate model parameters using observed data.",
      steps: [
        "Gather observed flow and rainfall data for calibration events",
        "Set initial parameters based on physical measurements and literature",
        "Run model and compare simulated vs. observed hydrographs",
        "Adjust parameters systematically (infiltration, roughness, width)",
        "Use objective functions (NSE, RMSE, PBIAS) to measure fit",
        "Validate with independent events not used in calibration",
        "Document final parameters and their justification"
      ],
      tips: [
        "Calibrate to multiple events covering different conditions",
        "Visual comparison matters as much as statistics",
        "Perfect calibration on one event often means overfitting"
      ]
    },
    icm: {
      title: "Automated Calibration in ICM",
      description: "Use ICM's calibration tools to efficiently optimize model parameters.",
      steps: [
        "Import observed flow data into ICM's calibration database",
        "Define calibration parameters and allowable ranges",
        "Select objective functions (volume, peak, timing)",
        "Use the auto-calibration tool or genetic algorithm optimizer",
        "Review parameter values for physical reasonableness",
        "Run validation simulations with final parameters",
        "Generate calibration report with statistics and plots"
      ],
      tips: [
        "Auto-calibration finds optimal values faster, but review for realism",
        "Multi-objective calibration reveals parameter trade-offs",
        "Calibration should improve understanding, not just statistics"
      ]
    },
    comparison: [
      { feature: "Observed Data", swmm5: "Manual time series import", icm: "Calibration database with QA tools" },
      { feature: "Auto-Calibration", swmm5: "External tools (PEST, etc.)", icm: "Built-in optimizer" },
      { feature: "Objective Functions", swmm5: "Calculate externally", icm: "Multiple built-in options" },
      { feature: "Parameter Bounds", swmm5: "Track manually", icm: "Stored with optimization setup" },
      { feature: "Validation", swmm5: "Separate runs, manual compare", icm: "Validation events in same setup" },
      { feature: "Reporting", swmm5: "Manual report creation", icm: "Auto-generated calibration reports" }
    ]
  },
  12: {
    swmm5: {
      title: "Validation and Testing in SWMM5",
      description: "Verify model performance on independent data and boundary conditions.",
      steps: [
        "Reserve independent events for validation (not used in calibration)",
        "Run model with calibrated parameters on validation events",
        "Calculate performance metrics (NSE, RMSE, etc.)",
        "Test model at boundary conditions (dry weather, extreme events)",
        "Check mass balance and continuity errors",
        "Identify systematic biases and document limitations",
        "Perform split-sample testing if data allows"
      ],
      tips: [
        "Validation performance is usually worse than calibration—expect it",
        "Test base flow accuracy separately from storm response",
        "A model validated under limited conditions should note those limits"
      ]
    },
    icm: {
      title: "Comprehensive Model Validation in ICM",
      description: "Use ICM's validation tools for rigorous model testing.",
      steps: [
        "Set up validation events separate from calibration dataset",
        "Use the flow survey manager for observed data handling",
        "Run validation simulations using calibrated parameters",
        "Generate comparison plots (observed vs. simulated)",
        "Calculate performance statistics automatically",
        "Check water balance reports for continuity",
        "Document validation results and model limitations"
      ],
      tips: [
        "ICM's comparison tools make validation visualization easy",
        "Include dry weather flow validation for combined sewer models",
        "Validation scope should match intended model use"
      ]
    },
    comparison: [
      { feature: "Validation Events", swmm5: "Same workflow as calibration", icm: "Dedicated validation datasets" },
      { feature: "Comparison Plots", swmm5: "Export for external plotting", icm: "Built-in overlay charts" },
      { feature: "Statistics", swmm5: "External calculation", icm: "Automatic performance metrics" },
      { feature: "Water Balance", swmm5: "Summary in status report", icm: "Detailed balance reports" },
      { feature: "Multi-Event", swmm5: "Run each separately", icm: "Batch validation possible" },
      { feature: "Documentation", swmm5: "Manual report writing", icm: "Template-based reports" }
    ]
  },
  13: {
    swmm5: {
      title: "Peer Review Preparation in SWMM5",
      description: "Document and organize model for external review and quality assurance.",
      steps: [
        "Organize project files in logical folder structure",
        "Document all data sources with dates and quality ratings",
        "Create a model development memo covering key decisions",
        "Export summary tables of all model parameters",
        "Generate comparison plots for calibration/validation",
        "Prepare a list of model limitations and caveats",
        "Package model for independent reviewer to run"
      ],
      tips: [
        "If you can't explain a parameter value, reconsider it",
        "Peer review improves models—embrace it, don't fear it",
        "Document not just what you did, but why"
      ]
    },
    icm: {
      title: "Model Documentation in ICM",
      description: "Leverage ICM's documentation features for thorough peer review preparation.",
      steps: [
        "Use model group descriptions to document purpose",
        "Add notes to key elements explaining assumptions",
        "Generate network summaries and parameter tables",
        "Export calibration/validation reports",
        "Use scenario descriptions for change documentation",
        "Create a model run log with key results",
        "Package transportable database for reviewer"
      ],
      tips: [
        "ICM's built-in notes travel with the model—use them liberally",
        "Transportable databases preserve model integrity for review",
        "Version control through model groups aids transparency"
      ]
    },
    comparison: [
      { feature: "Documentation", swmm5: "External documents", icm: "Notes embedded in database" },
      { feature: "Version Control", swmm5: "Manual file naming", icm: "Model groups, scenarios" },
      { feature: "Parameter Export", swmm5: "Report or manual tables", icm: "Direct database queries" },
      { feature: "Transferability", swmm5: "Send INP + data files", icm: "Transportable database" },
      { feature: "Audit Trail", swmm5: "Manual logging", icm: "Built-in modification tracking" },
      { feature: "Reviewer Access", swmm5: "Needs SWMM5 (free)", icm: "Needs ICM license" }
    ]
  },
  14: {
    swmm5: {
      title: "Stakeholder Communication in SWMM5",
      description: "Translate model results into meaningful information for decision-makers.",
      steps: [
        "Identify the key questions stakeholders need answered",
        "Extract relevant results (not all model outputs)",
        "Create clear visualizations (maps, charts, tables)",
        "Translate technical terms to plain language",
        "Prepare uncertainty ranges, not just single values",
        "Develop scenarios that bracket the decision space",
        "Present model limitations honestly but constructively"
      ],
      tips: [
        "Stakeholders care about decisions, not model mechanics",
        "Visual communication often beats numerical tables",
        "Uncertainty is valuable information, not a weakness"
      ]
    },
    icm: {
      title: "Results Visualization in ICM",
      description: "Use ICM's visualization tools to communicate effectively with stakeholders.",
      steps: [
        "Create thematic maps showing results spatially",
        "Generate animations of flood progression",
        "Use the long section tool for pipe capacity views",
        "Export results to GIS for integration with other data",
        "Create dashboard views for key performance indicators",
        "Generate comparison plots for scenario analysis",
        "Prepare presentation-quality graphics for reports"
      ],
      tips: [
        "ICM's animations are powerful for public meetings",
        "Maps communicate spatial patterns better than tables",
        "Always show the uncertainty range, not just central estimates"
      ]
    },
    comparison: [
      { feature: "Visualization", swmm5: "Basic maps and graphs", icm: "Advanced 3D, animations" },
      { feature: "GIS Export", swmm5: "Shapefiles with post-processing", icm: "Native geodatabase export" },
      { feature: "Animations", swmm5: "Limited capability", icm: "Full flood progression animations" },
      { feature: "Long Sections", swmm5: "Profile plots available", icm: "Interactive long sections" },
      { feature: "Dashboards", swmm5: "External tools needed", icm: "Built-in results analysis" },
      { feature: "Report Generation", swmm5: "Manual report creation", icm: "Template-based reporting" }
    ]
  },
  15: {
    swmm5: {
      title: "Scenario Analysis in SWMM5",
      description: "Compare alternatives systematically to support decision-making.",
      steps: [
        "Define baseline condition and document assumptions",
        "Create alternative scenarios (future conditions, alternatives)",
        "Modify only the relevant parameters for each scenario",
        "Run all scenarios using consistent methods",
        "Compile comparative results in tables and charts",
        "Identify the scenarios that bracket the decision",
        "Present trade-offs clearly for decision-makers"
      ],
      tips: [
        "Change one thing at a time to understand impacts",
        "Scenarios should span the realistic range of futures",
        "The goal is decision support, not prediction precision"
      ]
    },
    icm: {
      title: "Scenario Management in ICM",
      description: "Use ICM's scenario tools for efficient alternative analysis.",
      steps: [
        "Create a master scenario representing baseline",
        "Use scenario inheritance for efficient alternative creation",
        "Modify parameters using scenario-specific overrides",
        "Set up batch runs for multiple scenarios",
        "Use Results Analysis for scenario comparison",
        "Generate difference maps (Scenario A vs. B)",
        "Document scenario assumptions and rationale"
      ],
      tips: [
        "Scenario inheritance prevents duplication and errors",
        "Difference maps quickly show where scenarios diverge",
        "Scenario descriptions are crucial for future users"
      ]
    },
    comparison: [
      { feature: "Scenario Setup", swmm5: "Copy and modify INP files", icm: "Scenario inheritance system" },
      { feature: "Parameter Overrides", swmm5: "Edit each file separately", icm: "Override tables by scenario" },
      { feature: "Batch Processing", swmm5: "Command-line scripting", icm: "Built-in batch runner" },
      { feature: "Comparison", swmm5: "External post-processing", icm: "Built-in comparison tools" },
      { feature: "Difference Maps", swmm5: "GIS post-processing", icm: "Direct scenario differencing" },
      { feature: "Traceability", swmm5: "Manual documentation", icm: "Scenario tree visualization" }
    ]
  },
  16: {
    swmm5: {
      title: "Real-Time Control Modeling in SWMM5",
      description: "Implement control rules and evaluate RTC strategies.",
      steps: [
        "Identify controllable elements (pumps, gates, diversions)",
        "Define control logic using SWMM5's control rules",
        "Specify control variables (depth, flow, time)",
        "Test rules with simple scenarios first",
        "Run continuous simulations to evaluate performance",
        "Compare controlled vs. uncontrolled operation",
        "Document control logic and operational constraints"
      ],
      tips: [
        "Simple rules often outperform complex ones in practice",
        "Test control logic failure modes, not just optimal operation",
        "Coordinate with operations staff on realistic constraints"
      ]
    },
    icm: {
      title: "Advanced RTC Modeling in ICM",
      description: "Leverage ICM's powerful RTC capabilities for smart infrastructure modeling.",
      steps: [
        "Set up regulator objects (orifices, weirs, pumps)",
        "Define RTC rules using the RTC editor",
        "Use variables (levels, flows) as control triggers",
        "Implement complex logic with IF-THEN-ELSE structures",
        "Test with historical rainfall for realistic evaluation",
        "Analyze control performance using results analysis",
        "Export control time series for operator review"
      ],
      tips: [
        "ICM's RTC can implement MPC and optimization-based control",
        "Test control rules under failure scenarios",
        "Validate RTC behavior with operations records if available"
      ]
    },
    comparison: [
      { feature: "Control Rules", swmm5: "IF-THEN control statements", icm: "Full scripting language" },
      { feature: "Variables", swmm5: "Depth, flow, time", icm: "Any model variable" },
      { feature: "Logic Complexity", swmm5: "Basic conditional logic", icm: "Advanced logic, loops, arrays" },
      { feature: "Optimization", swmm5: "Not built-in", icm: "MPC optimization possible" },
      { feature: "Debugging", swmm5: "Trial and error", icm: "RTC trace and debugging" },
      { feature: "Export", swmm5: "Manual result extraction", icm: "Control time series export" }
    ]
  },
  17: {
    swmm5: {
      title: "Model Maintenance and Updates in SWMM5",
      description: "Establish practices for keeping models current and useful over time.",
      steps: [
        "Create a model update protocol document",
        "Establish version numbering conventions",
        "Document each update with date, author, and changes",
        "Periodically re-validate against new observed data",
        "Update parameters as new information becomes available",
        "Archive old versions before making changes",
        "Train successors on model structure and assumptions"
      ],
      tips: [
        "Models are living tools—plan for their evolution",
        "Clear documentation enables future updates",
        "The next modeler may be you, years from now"
      ]
    },
    icm: {
      title: "Model Lifecycle Management in ICM",
      description: "Use ICM's data management features for long-term model sustainability.",
      steps: [
        "Use model groups to version major updates",
        "Leverage workspaces for team collaboration",
        "Set up automatic backup schedules",
        "Use data flags to track data age and confidence",
        "Implement database maintenance routines",
        "Document model in embedded notes, not just external docs",
        "Create training materials for model handover"
      ],
      tips: [
        "ICM's database structure supports long-term management",
        "Model groups create clear version history",
        "Embedded documentation survives better than external files"
      ]
    },
    comparison: [
      { feature: "Version Control", swmm5: "File naming, manual", icm: "Model groups, scenarios" },
      { feature: "Collaboration", swmm5: "File sharing", icm: "Multi-user workgroups" },
      { feature: "Backup", swmm5: "Manual or IT systems", icm: "Built-in backup tools" },
      { feature: "Data Management", swmm5: "External databases/GIS", icm: "Integrated database" },
      { feature: "Documentation", swmm5: "External documents", icm: "Embedded notes and metadata" },
      { feature: "Training", swmm5: "Free software, docs online", icm: "Vendor training available" }
    ]
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="swmm5" className="text-sm font-medium">
              🔵 EPA SWMM5
            </TabsTrigger>
            <TabsTrigger value="icm" className="text-sm font-medium">
              🟢 ICM InfoWorks
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-sm font-medium">
              <Scale className="w-4 h-4 mr-1" />
              Compare
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
          
          <TabsContent value="compare" className="mt-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Feature Comparison: SWMM5 vs ICM InfoWorks
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Feature</TableHead>
                      <TableHead className="font-bold text-blue-600">🔵 SWMM5</TableHead>
                      <TableHead className="font-bold text-green-600">🟢 ICM InfoWorks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examples.comparison.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.feature}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.swmm5}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.icm}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Both tools are excellent—choose based on project needs, budget, and team expertise.
              </p>
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
