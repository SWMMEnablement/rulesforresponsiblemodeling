import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Laptop, Scale, ExternalLink, Youtube, Copy, Check, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RubySyntaxHighlighter } from "./RubySyntaxHighlighter";

interface SoftwareExample {
  title: string;
  description: string;
  steps: string[];
  tips: string[];
  rubyCode?: string;
}

interface ComparisonItem {
  feature: string;
  swmm5: string;
  icmSwmm: string;
  icm: string;
}

interface ChapterExamples {
  swmm5: SoftwareExample;
  icmSwmm: SoftwareExample;
  icm: SoftwareExample;
  comparison: ComparisonItem[];
}

// Ruby code examples for ICM InfoWorks
const icmRubyCode: Record<number, string> = {
  1: `# Chapter 1: Creating Your First ICM Model with Ruby
# This script creates a simple subcatchment and runs a simulation

net = WSApplication.current_network
net.transaction_begin

# Create a new subcatchment
subcatch = net.new_row_object('hw_subcatchment')
subcatch['subcatchment_id'] = 'SC1'
subcatch['total_area'] = 10.0  # hectares
subcatch['runoff_routing_type'] = 'DIRECT'
subcatch.write

# Create an outfall node
outfall = net.new_row_object('hw_node')
outfall['node_id'] = 'OUT1'
outfall['node_type'] = 'Outfall'
outfall['x'] = 100.0
outfall['y'] = 100.0
outfall.write

net.transaction_commit
puts "Model created successfully - remember: it's a decision tool!"`,

  2: `# Chapter 2: Subcatchment Discretization Analysis
# Compare results with different discretization levels

net = WSApplication.current_network
results = []

# Get all subcatchments and analyze areas
net.row_objects('hw_subcatchment').each do |sc|
  area = sc['total_area']
  width = sc['width'] || Math.sqrt(area * 10000)  # Estimate if not set
  
  results << {
    id: sc['subcatchment_id'],
    area: area,
    width: width,
    tc_estimate: (width / 100.0) * 60  # Simple time of concentration
  }
end

puts "Discretization Analysis:"
results.each { |r| puts "#{r[:id]}: #{r[:area]} ha, Width: #{r[:width]} m" }
puts "\\nRemember: More subcatchments ≠ better results without spatial data"`,

  3: `# Chapter 3: Data Quality Assessment Script
# Validate network data and identify potential issues

net = WSApplication.current_network
issues = []

# Check for missing or suspicious values
net.row_objects('hw_conduit').each do |link|
  if link['us_invert'].nil? || link['ds_invert'].nil?
    issues << "#{link['link_id']}: Missing invert levels"
  end
  
  if link['conduit_width'] && link['conduit_width'] < 0.1
    issues << "#{link['link_id']}: Suspicious diameter < 100mm"
  end
  
  # Check for adverse gradients
  if link['us_invert'] && link['ds_invert']
    if link['ds_invert'] > link['us_invert']
      issues << "#{link['link_id']}: Adverse gradient detected"
    end
  end
end

puts "Data Quality Report:"
puts "Found #{issues.length} potential issues:"
issues.each { |i| puts "  - #{i}" }
puts "\\nAlways document data sources and confidence levels!"`,

  4: `# Chapter 4: Model Complexity Comparison
# Analyze model complexity metrics

net = WSApplication.current_network

# Count model elements
stats = {
  subcatchments: net.row_objects('hw_subcatchment').length,
  nodes: net.row_objects('hw_node').length,
  links: net.row_objects('hw_conduit').length,
  pumps: net.row_objects('hw_pump').length,
  weirs: net.row_objects('hw_weir').length
}

total_elements = stats.values.sum
complexity_score = total_elements + (stats[:pumps] * 5) + (stats[:weirs] * 3)

puts "Model Complexity Analysis:"
stats.each { |k, v| puts "  #{k}: #{v}" }
puts "\\nTotal elements: #{total_elements}"
puts "Complexity score: #{complexity_score}"
puts "\\nParsimony principle: Choose simplest model that answers your question"`,

  5: `# Chapter 5: Continuous Simulation Setup
# Configure and analyze long-term simulation results

net = WSApplication.current_network

# Analyze time series data availability
rainfall_events = []
net.row_objects('hw_rainfall_event').each do |event|
  duration = event['duration'] || 0
  rainfall_events << {
    name: event['event_name'],
    duration: duration,
    type: duration > 24 ? 'Continuous' : 'Event'
  }
end

puts "Time Series Analysis:"
continuous = rainfall_events.select { |e| e[:type] == 'Continuous' }
puts "Continuous series available: #{continuous.length}"
puts "Event-based available: #{rainfall_events.length - continuous.length}"

puts "\\nFor continuous simulation:"
puts "  - Ensure adequate warm-up period"
puts "  - Check antecedent moisture conditions"
puts "  - Use FAST engine for efficiency"`,

  6: `# Chapter 6: Calibration Helper Script
# Compare simulated vs observed flows at calibration points

net = WSApplication.current_network

# Define calibration targets (example)
calibration_points = [
  { node: 'MH101', observed_peak: 0.85, observed_volume: 1200 },
  { node: 'MH205', observed_peak: 1.20, observed_volume: 2100 }
]

puts "Calibration Checklist:"
puts "1. Volume balance - adjust impervious %"
puts "2. Peak flow - adjust width, slope"
puts "3. Timing - adjust routing parameters"
puts "4. Base flow - check groundwater/infiltration"

calibration_points.each do |cp|
  puts "\\nTarget: #{cp[:node]}"
  puts "  Observed Peak: #{cp[:observed_peak]} m³/s"
  puts "  Observed Volume: #{cp[:observed_volume]} m³"
end

puts "\\nRemember: Keep parameters physically reasonable!"`,

  7: `# Chapter 7: Event Selection and Analysis
# Analyze rainfall events and select appropriate design storms

net = WSApplication.current_network

# Analyze available events
events = []
net.row_objects('hw_rainfall_event').each do |event|
  total_depth = event['total_depth'] || 0
  duration = event['duration'] || 1
  
  events << {
    name: event['event_name'],
    depth: total_depth,
    duration: duration,
    intensity: total_depth / duration
  }
end

# Sort by intensity
events.sort_by! { |e| -e[:intensity] }

puts "Event Analysis (sorted by intensity):"
events.first(5).each do |e|
  puts "  #{e[:name]}: #{e[:depth]}mm in #{e[:duration]}hrs (#{e[:intensity].round(2)} mm/hr)"
end

puts "\\nConsider both design storms AND historical events"`,

  8: `# Chapter 8: Decision Support - Scenario Comparison
# Compare multiple design scenarios

scenarios = ['Baseline', 'Option_A_Pipes', 'Option_B_Storage', 'Option_C_SuDS']

puts "Decision Support Analysis"
puts "=" * 50

scenarios.each do |scenario|
  # In practice, load each scenario's results
  puts "\\nScenario: #{scenario}"
  puts "  - Peak flow reduction: [from results]"
  puts "  - Flood volume: [from results]"
  puts "  - Cost estimate: [from analysis]"
  puts "  - Carbon footprint: [from LCA]"
end

puts "\\nKey Decision Criteria:"
puts "  1. Does it meet regulatory requirements?"
puts "  2. Is it cost-effective?"
puts "  3. Is it resilient to climate change?"
puts "  4. Does it provide co-benefits?"`,

  9: `# Chapter 9: Objective Function Calculator
# Calculate performance metrics for model evaluation

def calculate_nse(observed, simulated)
  return nil if observed.length != simulated.length
  
  mean_obs = observed.sum / observed.length.to_f
  
  numerator = observed.zip(simulated).map { |o, s| (o - s) ** 2 }.sum
  denominator = observed.map { |o| (o - mean_obs) ** 2 }.sum
  
  return denominator == 0 ? nil : 1 - (numerator / denominator)
end

def calculate_pbias(observed, simulated)
  sum_obs = observed.sum
  diff_sum = observed.zip(simulated).map { |o, s| o - s }.sum
  
  return sum_obs == 0 ? nil : (diff_sum / sum_obs) * 100
end

# Example usage
observed = [0.5, 1.2, 2.1, 1.8, 1.0, 0.6]
simulated = [0.4, 1.1, 2.3, 1.7, 0.9, 0.5]

puts "Performance Metrics:"
puts "  NSE: #{calculate_nse(observed, simulated)&.round(3)}"
puts "  PBIAS: #{calculate_pbias(observed, simulated)&.round(2)}%"
puts "\\nNo single metric tells the whole story!"`,

  10: `# Chapter 10: Sensitivity Analysis Framework
# Systematically vary parameters and record output changes

net = WSApplication.current_network

# Define parameters to test
sensitivity_params = [
  { name: 'Impervious %', field: 'pct_impervious', range: [-20, -10, 0, 10, 20] },
  { name: 'Roughness', field: 'mannings_n', range: [-30, -15, 0, 15, 30] },
  { name: 'Slope', field: 'slope', range: [-25, 0, 25] }
]

puts "Sensitivity Analysis Setup"
puts "=" * 50

sensitivity_params.each do |param|
  puts "\\nParameter: #{param[:name]}"
  puts "  Field: #{param[:field]}"
  puts "  Variations: #{param[:range].map { |v| "#{v}%" }.join(', ')}"
end

puts "\\nProcedure:"
puts "  1. Run baseline simulation"
puts "  2. Vary each parameter individually"
puts "  3. Record output changes (peak, volume, timing)"
puts "  4. Rank parameters by influence"
puts "  5. Focus calibration on most sensitive parameters"`,

  11: `# Chapter 11: Uncertainty Quantification
# Monte Carlo simulation setup for uncertainty analysis

# Define uncertain parameters with distributions
uncertain_params = [
  { name: 'Impervious %', mean: 45, std_dev: 10, distribution: 'normal' },
  { name: 'Roughness n', mean: 0.013, std_dev: 0.002, distribution: 'normal' },
  { name: 'Rainfall depth', mean: 50, std_dev: 8, distribution: 'normal' }
]

n_simulations = 100
results = []

puts "Monte Carlo Uncertainty Analysis"
puts "=" * 50
puts "\\nParameter Distributions:"

uncertain_params.each do |p|
  puts "  #{p[:name]}: #{p[:distribution]} (μ=#{p[:mean]}, σ=#{p[:std_dev]})"
end

puts "\\nPlanned simulations: #{n_simulations}"
puts "\\nOutputs to track:"
puts "  - Peak flow (5th, 50th, 95th percentiles)"
puts "  - Total volume confidence bounds"
puts "  - Flood extent probability maps"
puts "\\nPresent results as ranges, not single values!"`,

  12: `# Chapter 12: Verification and Validation Workflow
# Split-sample testing for model validation

net = WSApplication.current_network

# Define calibration and validation events
calibration_events = ['Event_2019_07', 'Event_2020_03', 'Event_2020_09']
validation_events = ['Event_2021_05', 'Event_2021_11']

puts "Verification & Validation Protocol"
puts "=" * 50

puts "\\nCalibration Events (for parameter adjustment):"
calibration_events.each { |e| puts "  - #{e}" }

puts "\\nValidation Events (independent testing):"
validation_events.each { |e| puts "  - #{e}" }

puts "\\nValidation Criteria:"
puts "  - NSE > 0.5 (acceptable)"
puts "  - NSE > 0.7 (good)"
puts "  - PBIAS < ±25%"
puts "  - Timing within ±15 minutes"

puts "\\nWarning Signs:"
puts "  - Validation much worse than calibration → overfitting"
puts "  - Systematic bias → model structure issue"`,

  13: `# Chapter 13: Model Documentation Generator
# Generate comprehensive model documentation

net = WSApplication.current_network
timestamp = Time.now.strftime("%Y-%m-%d %H:%M")

puts "=" * 60
puts "MODEL DOCUMENTATION REPORT"
puts "Generated: #{timestamp}"
puts "=" * 60

# Model inventory
puts "\\n1. MODEL INVENTORY"
puts "-" * 40
elements = {
  'Subcatchments' => net.row_objects('hw_subcatchment').length,
  'Nodes' => net.row_objects('hw_node').length,
  'Conduits' => net.row_objects('hw_conduit').length,
  'Pumps' => net.row_objects('hw_pump').length
}
elements.each { |k, v| puts "   #{k}: #{v}" }

puts "\\n2. DATA SOURCES"
puts "-" * 40
puts "   [Document your data sources here]"
puts "   - Pipe survey: [source, date, confidence]"
puts "   - Rainfall: [gauge, period, QC status]"
puts "   - Land use: [GIS source, vintage]"

puts "\\n3. CALIBRATION SUMMARY"
puts "-" * 40
puts "   [Document calibration events and results]"

puts "\\n4. KNOWN LIMITATIONS"
puts "-" * 40
puts "   [Document model limitations and assumptions]"`,

  14: `# Chapter 14: Parameter Estimation from GIS Data
# Derive model parameters from spatial datasets

net = WSApplication.current_network

# Land use to impervious mapping (example)
land_use_imperv = {
  'Commercial' => 85,
  'Industrial' => 72,
  'Residential_High' => 65,
  'Residential_Med' => 45,
  'Residential_Low' => 25,
  'Open_Space' => 5
}

puts "Parameter Estimation from GIS"
puts "=" * 50

puts "\\nLand Use → Impervious % Lookup:"
land_use_imperv.each { |lu, imp| puts "  #{lu}: #{imp}%" }

# Soil type to infiltration mapping
soil_infiltration = {
  'A' => { horton_max: 75, horton_min: 25 },
  'B' => { horton_max: 50, horton_min: 15 },
  'C' => { horton_max: 25, horton_min: 8 },
  'D' => { horton_max: 12, horton_min: 3 }
}

puts "\\nSoil Group → Infiltration Parameters:"
soil_infiltration.each do |sg, params|
  puts "  Group #{sg}: Max=#{params[:horton_max]}, Min=#{params[:horton_min]} mm/hr"
end

puts "\\nRemember: Field-verify GIS-derived parameters!"`,

  15: `# Chapter 15: Error Analysis and Diagnostics
# Analyze residuals to identify systematic model errors

def analyze_residuals(observed, simulated)
  residuals = observed.zip(simulated).map { |o, s| o - s }
  
  mean_residual = residuals.sum / residuals.length.to_f
  std_residual = Math.sqrt(residuals.map { |r| (r - mean_residual) ** 2 }.sum / residuals.length)
  
  # Check for bias
  bias = mean_residual.abs > (std_residual * 0.5) ? 'BIASED' : 'OK'
  
  {
    mean: mean_residual,
    std: std_residual,
    max: residuals.max,
    min: residuals.min,
    bias_check: bias
  }
end

# Example analysis
observed = [1.0, 2.5, 3.2, 2.8, 1.5]
simulated = [0.9, 2.3, 3.5, 2.6, 1.4]

results = analyze_residuals(observed, simulated)

puts "Error Analysis Report"
puts "=" * 50
puts "  Mean Residual: #{results[:mean].round(3)}"
puts "  Std Residual: #{results[:std].round(3)}"
puts "  Max Error: #{results[:max].round(3)}"
puts "  Min Error: #{results[:min].round(3)}"
puts "  Bias Check: #{results[:bias_check]}"
puts "\\nSystematic errors need model structure changes!"`,

  16: `# Chapter 16: Continuous Modeling Optimization
# Best practices for efficient long-term simulations

net = WSApplication.current_network

puts "Continuous Modeling Best Practices"
puts "=" * 50

puts "\\n1. SIMULATION SETTINGS"
puts "   - Use FAST simulation engine"
puts "   - Adaptive timestep: ON"
puts "   - Minimum timestep: 1-5 seconds"
puts "   - Maximum timestep: 60-300 seconds"

puts "\\n2. OUTPUT MANAGEMENT"
puts "   - Report timestep: 5-15 minutes (not every second!)"
puts "   - Store only key nodes/links"
puts "   - Use statistical summaries where possible"

puts "\\n3. WATER BALANCE CHECKS"
net.row_objects('hw_subcatchment').each do |sc|
  total_area = sc['total_area'] || 0
  imperv = sc['pct_impervious'] || 0
  puts "   #{sc['subcatchment_id']}: #{total_area} ha, #{imperv}% imperv"
end

puts "\\n4. RUNTIME ESTIMATES"
puts "   - 1 year continuous: ~5-30 minutes"
puts "   - 10 year continuous: ~30-180 minutes"
puts "   - Depends on network size and 2D usage"`,

  17: `# Chapter 17: Future Directions - Advanced Automation
# Examples of emerging capabilities in ICM Ruby scripting

puts "Future Directions in ICM Automation"
puts "=" * 50

puts "\\n1. MACHINE LEARNING INTEGRATION"
puts <<-CODE
   # Example: ML-assisted parameter estimation
   require 'json'
   
   # Export data for ML training
   training_data = subcatchments.map do |sc|
     { features: extract_features(sc), target: observed_runoff(sc) }
   end
   File.write('training_data.json', training_data.to_json)
CODE

puts "\\n2. REAL-TIME FORECASTING (ICM Live)"
puts "   - Telemetry data integration"
puts "   - Ensemble forecasting"
puts "   - Alert generation"

puts "\\n3. CLIMATE CHANGE SCENARIOS"
puts "   - Automated rainfall uplift"
puts "   - Batch scenario generation"
puts "   - Sensitivity to climate factors"

puts "\\n4. API INTEGRATION"
puts "   - REST API for external systems"
puts "   - Dashboard data feeds"
puts "   - Automated reporting"

puts "\\nThe future is automated, integrated, and data-driven!"`
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
    icmSwmm: {
      title: "Creating Your First ICM SWMM Model",
      description: "Build a subcatchment model using the SWMM engine within the ICM platform for familiar SWMM workflows with enhanced tools.",
      steps: [
        "Create a new SWMM Network in ICM",
        "Set the coordinate system and import background maps",
        "Draw or import a subcatchment polygon",
        "Define SWMM-style properties: Area, Width, % Impervious, Slope",
        "Add junction and outfall nodes",
        "Create conduits connecting the network",
        "Set up rainfall using SWMM time series format",
        "Run SWMM simulation and view results"
      ],
      tips: [
        "ICM SWMM uses the EPA SWMM engine—results match standalone SWMM5",
        "Benefit from ICM's GIS tools while keeping SWMM compatibility",
        "Easy to import existing SWMM5 .inp files directly"
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
      { feature: "Interface", swmm5: "Simple, lightweight GUI", icmSwmm: "ICM platform with SWMM engine", icm: "Feature-rich GIS-integrated interface" },
      { feature: "Learning Curve", swmm5: "Easiest for beginners", icmSwmm: "Familiar SWMM with ICM tools", icm: "Steeper but most powerful" },
      { feature: "Cost", swmm5: "Free, open-source (EPA)", icmSwmm: "Commercial license required", icm: "Commercial license required" },
      { feature: "2D Capability", swmm5: "Limited (external tools)", icmSwmm: "Available via ICM coupling", icm: "Fully integrated 1D/2D" },
      { feature: "GIS Integration", swmm5: "Basic import/export", icmSwmm: "Full ICM GIS capabilities", icm: "Native geodatabase support" },
      { feature: "SWMM Compatibility", swmm5: "Native format", icmSwmm: "Direct .inp import/export", icm: "Import only, different engine" }
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
    icmSwmm: {
      title: "Subcatchment Discretization in ICM SWMM",
      description: "Use ICM's GIS tools to efficiently discretize catchments while maintaining SWMM compatibility.",
      steps: [
        "Import catchment boundary from GIS",
        "Use ICM's polygon tools to subdivide based on drainage areas",
        "Auto-calculate areas and derive widths from geometry",
        "Connect subcatchments to appropriate nodes",
        "Run baseline and refined discretization models",
        "Use Results Analysis to compare hydrographs",
        "Export final model as SWMM .inp if needed"
      ],
      tips: [
        "ICM's spatial tools make discretization faster than manual SWMM5 work",
        "Width calculation can be automated from subcatchment geometry",
        "Maintain SWMM5 compatibility for regulatory submittals"
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
      { feature: "Spatial Resolution", swmm5: "User-defined subcatchments", icmSwmm: "User-defined with GIS assist", icm: "Flexible polygon or mesh-based" },
      { feature: "Routing Options", swmm5: "Kinematic or dynamic wave", icmSwmm: "SWMM routing engines", icm: "Multiple engines including 2D" },
      { feature: "Auto-Discretization", swmm5: "Manual or external tools", icmSwmm: "GIS-based subdivision tools", icm: "Built-in mesh generation" },
      { feature: "Width Calculation", swmm5: "Manual input", icmSwmm: "Auto-calculate from geometry", icm: "N/A (different hydrology)" },
      { feature: "Performance", swmm5: "Fast for 1D networks", icmSwmm: "Similar to SWMM5", icm: "Optimized for large 1D/2D" },
      { feature: "Visual Feedback", swmm5: "Basic profile/map views", icmSwmm: "ICM visualization suite", icm: "3D visualization, animations" }
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
    icmSwmm: {
      title: "Data Validation in ICM SWMM Networks",
      description: "Leverage ICM's data management while maintaining SWMM data structures.",
      steps: [
        "Import SWMM .inp file or GIS data into ICM SWMM network",
        "Use Validate Network to find connectivity and data issues",
        "Run SQL queries to identify suspicious parameter values",
        "Cross-reference with survey data and aerial imagery",
        "Flag uncertain data using user-defined fields",
        "Document data sources in model notes",
        "Export cleaned model for SWMM5 if required"
      ],
      tips: [
        "ICM's validation catches errors SWMM5 might miss",
        "SQL queries help find outliers across large networks",
        "Maintain data quality documentation in the ICM database"
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
      { feature: "Data Import", swmm5: "CSV, text files, basic GIS", icmSwmm: "GIS + direct .inp import", icm: "Native geodatabase, ODBC, many formats" },
      { feature: "Validation Tools", swmm5: "Basic error checking", icmSwmm: "ICM validation suite", icm: "Comprehensive validation suite" },
      { feature: "SQL Queries", swmm5: "Not available", icmSwmm: "Full SQL support", icm: "Built-in SQL for data analysis" },
      { feature: "Data Flagging", swmm5: "Manual notes only", icmSwmm: "Custom fields available", icm: "Custom fields for confidence levels" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Direct .inp export", icm: "Not applicable" },
      { feature: "Reporting", swmm5: "Basic text reports", icmSwmm: "ICM report templates", icm: "Customizable report templates" }
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
    icmSwmm: {
      title: "Complexity Selection in ICM SWMM Networks",
      description: "Balance SWMM model complexity with ICM's enhanced visualization and analysis tools.",
      steps: [
        "Start with a simple SWMM network in ICM",
        "Run and review results using ICM's analysis tools",
        "Progressively add complexity (subcatchments, LIDs, controls)",
        "Use scenario management to compare complexity levels",
        "Leverage ICM's 2D if surface flooding detail is needed",
        "Document the optimal complexity for your project goals",
        "Maintain SWMM export compatibility where required"
      ],
      tips: [
        "ICM SWMM lets you add 2D selectively without leaving SWMM",
        "Use scenarios to test different complexity levels efficiently",
        "Match model complexity to project questions, not software capability"
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
      { feature: "Model Types", swmm5: "1D hydrology and hydraulics", icmSwmm: "SWMM 1D + optional ICM 2D", icm: "1D, 2D, and coupled 1D/2D" },
      { feature: "LID/SUDS", swmm5: "Built-in LID controls", icmSwmm: "Full SWMM LID support", icm: "SUDS via runoff surfaces and RTCs" },
      { feature: "Water Quality", swmm5: "Integrated WQ module", icmSwmm: "SWMM WQ module", icm: "Separate but powerful WQ engine" },
      { feature: "Groundwater", swmm5: "Simplified aquifer model", icmSwmm: "SWMM aquifer model", icm: "Groundwater infiltration module" },
      { feature: "2D Integration", swmm5: "Not available", icmSwmm: "Can couple with ICM 2D", icm: "Fully integrated" },
      { feature: "Optimization", swmm5: "External tools required", icmSwmm: "ICM optimization available", icm: "Built-in optimization capabilities" }
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
    icmSwmm: {
      title: "Continuous Simulation in ICM SWMM",
      description: "Run long-term SWMM simulations with ICM's enhanced data handling and analysis.",
      steps: [
        "Import multi-year rainfall and evaporation time series",
        "Configure SWMM network for continuous simulation",
        "Set up initial conditions and groundwater if needed",
        "Use ICM's simulation scheduling for long runs",
        "Analyze results using ICM's statistics tools",
        "Generate flow duration curves and CSO statistics",
        "Export results or model for external use"
      ],
      tips: [
        "ICM handles large time series more efficiently than standalone SWMM5",
        "Use ICM's statistics tools to analyze continuous results",
        "Results remain SWMM-compatible for regulatory purposes"
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
      { feature: "Simulation Speed", swmm5: "Good for moderate periods", icmSwmm: "Improved data handling", icm: "FAST engine for multi-year runs" },
      { feature: "Water Balance", swmm5: "Complete hydrologic cycle", icmSwmm: "SWMM hydrologic cycle", icm: "Detailed runoff surface accounting" },
      { feature: "Evaporation", swmm5: "Daily or monthly data", icmSwmm: "Flexible temporal resolution", icm: "Flexible temporal resolution" },
      { feature: "Initial Conditions", swmm5: "User-specified or hotstart", icmSwmm: "Hotstart files supported", icm: "Hotstart files, initial state editor" },
      { feature: "Statistics", swmm5: "Post-processing required", icmSwmm: "ICM statistics tools", icm: "Built-in flow duration curves" },
      { feature: "CSO Analysis", swmm5: "Manual event counting", icmSwmm: "ICM CSO tools available", icm: "Automated CSO volume/frequency stats" }
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
    icmSwmm: {
      title: "Probabilistic Analysis in ICM SWMM",
      description: "Use ICM's batch capabilities for Monte Carlo analysis of SWMM networks.",
      steps: [
        "Generate synthetic rainfall series externally or via ICM tools",
        "Create scenario matrix with varying rainfall inputs",
        "Configure ICM batch runs for efficiency",
        "Run SWMM simulations across all scenarios",
        "Post-process results using ICM statistics tools",
        "Create probability distributions of key outputs",
        "Document uncertainty ranges in deliverables"
      ],
      tips: [
        "ICM's batch runner streamlines Monte Carlo for SWMM models",
        "Maintain traceability between scenarios and results",
        "Synthetic rainfall statistics should match your project location"
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
      { feature: "Rainfall Generation", swmm5: "External tools (SSOAP, etc.)", icmSwmm: "External or ICM patterns", icm: "External or built-in patterns" },
      { feature: "Batch Processing", swmm5: "Command-line scripting", icmSwmm: "ICM batch runner", icm: "ICM Exchange automation" },
      { feature: "Parameter Variation", swmm5: "Manual or Python scripts", icmSwmm: "Scenario manager", icm: "Scenario manager, sensitivity tool" },
      { feature: "SWMM Compatibility", swmm5: "Native", icmSwmm: "Full compatibility", icm: "Import only" },
      { feature: "Results Statistics", swmm5: "External post-processing", icmSwmm: "ICM statistics tools", icm: "Built-in statistics and graphs" },
      { feature: "Automation", swmm5: "Python, MATLAB interfaces", icmSwmm: "ICM Ruby API", icm: "Ruby API, Exchange platform" }
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
    icmSwmm: {
      title: "Spatial Rainfall in ICM SWMM Networks",
      description: "Model spatial rainfall patterns in SWMM networks using ICM's enhanced rainfall tools.",
      steps: [
        "Set up SWMM network with multiple rain gages",
        "Assign subcatchments to appropriate rain gages",
        "Create moving storm scenarios by lagging rainfall inputs",
        "Use ICM's rainfall tools to generate spatial patterns",
        "Run scenarios and compare peak flows",
        "Identify critical storm directions for your system",
        "Document spatial sensitivity in project reports"
      ],
      tips: [
        "ICM's rainfall tools simplify spatial pattern creation for SWMM",
        "Multiple rain gages in SWMM allow spatial variation",
        "Moving storm analysis is critical for elongated catchments"
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
      { feature: "Spatial Rainfall", swmm5: "Rain gage assignment", icmSwmm: "Multi-gage + ICM tools", icm: "TVD, grid, radar options" },
      { feature: "Radar Data", swmm5: "Not directly supported", icmSwmm: "Via ICM rainfall tools", icm: "Native radar rainfall import" },
      { feature: "Moving Storms", swmm5: "Manual lag implementation", icmSwmm: "Easier with ICM tools", icm: "Spatial profiles with timing" },
      { feature: "Visualization", swmm5: "Static rain gage map", icmSwmm: "ICM rainfall display", icm: "Animated rainfall display" },
      { feature: "Large Catchments", swmm5: "Cumbersome for many gages", icmSwmm: "Better gage management", icm: "Efficient for regional models" },
      { feature: "Climate Scenarios", swmm5: "Manual factor application", icmSwmm: "Scenario-based factors", icm: "Scenario-based rainfall factors" }
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
    icmSwmm: {
      title: "Design Storms in ICM SWMM Networks",
      description: "Apply design storms to SWMM networks with ICM's rainfall generation tools.",
      steps: [
        "Use ICM's rainfall tools to create design storm profiles",
        "Apply standard distributions (SCS, Chicago, etc.)",
        "Set up multiple return period scenarios",
        "Run SWMM simulations for each scenario",
        "Compare results to regulatory requirements",
        "Use ICM's comparison tools for analysis",
        "Export results for regulatory submittals"
      ],
      tips: [
        "ICM's rainfall generator simplifies design storm creation",
        "Maintain SWMM export capability for regulatory agencies",
        "Design storms remain regulatory tools—understand their limitations"
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
      { feature: "Storm Types", swmm5: "User-defined time series", icmSwmm: "ICM generator + SWMM format", icm: "Built-in generator for standard types" },
      { feature: "IDF Curves", swmm5: "Manual input", icmSwmm: "ICM IDF tools available", icm: "IDF database with interpolation" },
      { feature: "Return Periods", swmm5: "One storm per run", icmSwmm: "Scenario matrix", icm: "Scenario matrix for multiple" },
      { feature: "Chicago Storm", swmm5: "Manual creation", icmSwmm: "Auto-generation available", icm: "Automatic generation" },
      { feature: "Climate Factors", swmm5: "Manual scaling", icmSwmm: "Built-in uplift factors", icm: "Built-in uplift factors" },
      { feature: "Regulatory Export", swmm5: "Native format", icmSwmm: "Direct SWMM export", icm: "Various export options" }
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
    icmSwmm: {
      title: "Extreme Events in ICM SWMM Networks",
      description: "Model extreme scenarios using SWMM with optional ICM 2D for flood mapping.",
      steps: [
        "Set up extreme rainfall scenarios in ICM",
        "Run SWMM simulations for extreme return periods",
        "Identify surcharge and flooding locations",
        "Optionally couple with ICM 2D for surface flooding",
        "Map flood extents using ICM's visualization",
        "Document uncertainty ranges in results",
        "Present findings with appropriate caveats"
      ],
      tips: [
        "ICM 2D can enhance SWMM results for surface flood mapping",
        "Extreme event uncertainty should be clearly communicated",
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
      { feature: "Extreme Storms", swmm5: "Standard input", icmSwmm: "ICM rainfall tools", icm: "Same, better flood mapping" },
      { feature: "Flood Mapping", swmm5: "Requires external GIS", icmSwmm: "ICM mapping + optional 2D", icm: "Built-in flood mapping tools" },
      { feature: "Dam Break", swmm5: "Not supported", icmSwmm: "Via ICM 2D coupling", icm: "Built-in dam break modeling" },
      { feature: "Hazard Rating", swmm5: "Manual calculation", icmSwmm: "ICM hazard tools", icm: "Automatic DxV hazard maps" },
      { feature: "Levee Failure", swmm5: "Not supported", icmSwmm: "Via ICM 2D coupling", icm: "Breach modeling available" },
      { feature: "SWMM Export", swmm5: "Native", icmSwmm: "Full export capability", icm: "Not applicable" }
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
    icmSwmm: {
      title: "Uncertainty Analysis in ICM SWMM",
      description: "Quantify uncertainty in SWMM networks using ICM's sensitivity tools.",
      steps: [
        "Identify key uncertain parameters in SWMM network",
        "Use ICM's sensitivity analysis to rank parameter importance",
        "Set up parameter ranges and distributions",
        "Configure batch runs for Monte Carlo analysis",
        "Run multiple SWMM simulations systematically",
        "Analyze output distributions using ICM tools",
        "Present results with confidence intervals"
      ],
      tips: [
        "ICM's sensitivity tool works with SWMM parameters",
        "Focus uncertainty effort on dominant parameters",
        "Maintain SWMM export for regulatory documentation"
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
      { feature: "Sensitivity Analysis", swmm5: "Manual parameter variation", icmSwmm: "ICM sensitivity tool", icm: "Built-in sensitivity tool" },
      { feature: "Monte Carlo", swmm5: "External implementation", icmSwmm: "ICM batch automation", icm: "Can be automated via Exchange" },
      { feature: "Batch Runs", swmm5: "Command-line, scripting", icmSwmm: "ICM batch runner", icm: "Scenario manager, scheduling" },
      { feature: "Parameter Ranges", swmm5: "User tracks externally", icmSwmm: "Stored in ICM", icm: "Stored in model database" },
      { feature: "Results Comparison", swmm5: "External post-processing", icmSwmm: "ICM comparison tools", icm: "Built-in comparison tools" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Full export capability", icm: "Not applicable" }
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
    icmSwmm: {
      title: "Calibration in ICM SWMM Networks",
      description: "Calibrate SWMM networks using ICM's calibration tools.",
      steps: [
        "Import observed flow data into ICM",
        "Define SWMM calibration parameters and ranges",
        "Use ICM's calibration tools for systematic adjustment",
        "Run calibration simulations and compare results",
        "Review parameter values for physical reasonableness",
        "Validate with independent events",
        "Export calibrated model for SWMM5 if needed"
      ],
      tips: [
        "ICM's calibration tools streamline SWMM parameter adjustment",
        "Maintain physical realism in calibrated parameters",
        "Calibrated SWMM models can be exported for external use"
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
      { feature: "Observed Data", swmm5: "Manual time series import", icmSwmm: "ICM calibration database", icm: "Calibration database with QA tools" },
      { feature: "Auto-Calibration", swmm5: "External tools (PEST, etc.)", icmSwmm: "ICM optimizer available", icm: "Built-in optimizer" },
      { feature: "Objective Functions", swmm5: "Calculate externally", icmSwmm: "ICM objective functions", icm: "Multiple built-in options" },
      { feature: "Parameter Bounds", swmm5: "Track manually", icmSwmm: "ICM parameter management", icm: "Stored with optimization setup" },
      { feature: "Validation", swmm5: "Separate runs, manual compare", icmSwmm: "ICM validation workflow", icm: "Validation events in same setup" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Export calibrated model", icm: "Not applicable" }
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
    icmSwmm: {
      title: "Validation in ICM SWMM Networks",
      description: "Validate SWMM models using ICM's comparison and analysis tools.",
      steps: [
        "Set up validation events separate from calibration",
        "Run SWMM model with calibrated parameters",
        "Use ICM comparison tools for observed vs. simulated plots",
        "Calculate performance statistics automatically",
        "Check water balance and continuity",
        "Document validation results and limitations",
        "Export validated model for regulatory use"
      ],
      tips: [
        "ICM's comparison tools simplify validation visualization",
        "Validation scope should match intended model use",
        "Document limitations clearly in project deliverables"
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
      { feature: "Validation Events", swmm5: "Same workflow as calibration", icmSwmm: "ICM validation datasets", icm: "Dedicated validation datasets" },
      { feature: "Comparison Plots", swmm5: "Export for external plotting", icmSwmm: "Built-in overlay charts", icm: "Built-in overlay charts" },
      { feature: "Statistics", swmm5: "External calculation", icmSwmm: "Automatic metrics", icm: "Automatic performance metrics" },
      { feature: "Water Balance", swmm5: "Summary in status report", icmSwmm: "ICM balance reports", icm: "Detailed balance reports" },
      { feature: "Multi-Event", swmm5: "Run each separately", icmSwmm: "Batch validation possible", icm: "Batch validation possible" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Full export capability", icm: "Not applicable" }
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
    icmSwmm: {
      title: "Documentation in ICM SWMM Networks",
      description: "Prepare SWMM networks for peer review using ICM's documentation features.",
      steps: [
        "Use ICM notes to document key model decisions",
        "Generate parameter summary reports",
        "Export calibration/validation plots",
        "Create transportable database for reviewer",
        "Document data sources and quality ratings",
        "Export SWMM .inp for independent verification",
        "Prepare limitation and caveat documentation"
      ],
      tips: [
        "ICM's embedded notes travel with the model",
        "Transportable databases preserve model integrity",
        "SWMM export allows review in free SWMM5 software"
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
      { feature: "Documentation", swmm5: "External documents", icmSwmm: "ICM embedded notes", icm: "Notes embedded in database" },
      { feature: "Version Control", swmm5: "Manual file naming", icmSwmm: "ICM model groups", icm: "Model groups, scenarios" },
      { feature: "Parameter Export", swmm5: "Report or manual tables", icmSwmm: "ICM reports + SWMM export", icm: "Direct database queries" },
      { feature: "Transferability", swmm5: "Send INP + data files", icmSwmm: "Transportable DB + INP", icm: "Transportable database" },
      { feature: "Reviewer Access", swmm5: "Needs SWMM5 (free)", icmSwmm: "ICM or free SWMM5", icm: "Needs ICM license" },
      { feature: "Audit Trail", swmm5: "Manual logging", icmSwmm: "ICM modification tracking", icm: "Built-in modification tracking" }
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
    icmSwmm: {
      title: "Results Communication in ICM SWMM",
      description: "Use ICM's visualization for effective stakeholder communication of SWMM results.",
      steps: [
        "Use ICM's thematic mapping for spatial results",
        "Create profile plots and long sections",
        "Generate time series charts for key locations",
        "Export results to GIS for integration",
        "Create scenario comparison visualizations",
        "Prepare uncertainty ranges in results",
        "Develop stakeholder-friendly summaries"
      ],
      tips: [
        "ICM visualization enhances SWMM results presentation",
        "Focus on decision-relevant information",
        "Use scenarios to bracket the decision space"
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
      { feature: "Visualization", swmm5: "Basic maps and graphs", icmSwmm: "ICM visualization suite", icm: "Advanced 3D, animations" },
      { feature: "GIS Export", swmm5: "Shapefiles with post-processing", icmSwmm: "Native geodatabase export", icm: "Native geodatabase export" },
      { feature: "Animations", swmm5: "Limited capability", icmSwmm: "ICM animation tools", icm: "Full flood progression animations" },
      { feature: "Long Sections", swmm5: "Profile plots available", icmSwmm: "Interactive long sections", icm: "Interactive long sections" },
      { feature: "Dashboards", swmm5: "External tools needed", icmSwmm: "ICM results analysis", icm: "Built-in results analysis" },
      { feature: "Report Generation", swmm5: "Manual report creation", icmSwmm: "ICM report templates", icm: "Template-based reporting" }
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
    icmSwmm: {
      title: "Scenario Management in ICM SWMM",
      description: "Use ICM's scenario tools for efficient SWMM alternative analysis.",
      steps: [
        "Create baseline SWMM scenario in ICM",
        "Use scenario inheritance for alternatives",
        "Modify SWMM parameters using overrides",
        "Set up batch runs for multiple scenarios",
        "Use Results Analysis for comparison",
        "Generate difference maps between scenarios",
        "Export scenarios to SWMM if needed"
      ],
      tips: [
        "Scenario inheritance prevents duplication errors",
        "ICM's comparison tools streamline alternative analysis",
        "SWMM export maintains regulatory compatibility"
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
      { feature: "Scenario Setup", swmm5: "Copy and modify INP files", icmSwmm: "ICM scenario inheritance", icm: "Scenario inheritance system" },
      { feature: "Parameter Overrides", swmm5: "Edit each file separately", icmSwmm: "Override tables", icm: "Override tables by scenario" },
      { feature: "Batch Processing", swmm5: "Command-line scripting", icmSwmm: "Built-in batch runner", icm: "Built-in batch runner" },
      { feature: "Comparison", swmm5: "External post-processing", icmSwmm: "ICM comparison tools", icm: "Built-in comparison tools" },
      { feature: "Difference Maps", swmm5: "GIS post-processing", icmSwmm: "Direct scenario differencing", icm: "Direct scenario differencing" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Export each scenario", icm: "Not applicable" }
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
    icmSwmm: {
      title: "RTC in ICM SWMM Networks",
      description: "Implement control rules in SWMM networks with ICM's enhanced RTC capabilities.",
      steps: [
        "Set up controllable elements in SWMM network",
        "Define control rules using SWMM syntax or ICM RTC",
        "Test rules with simple scenarios",
        "Use ICM's RTC debugging tools",
        "Evaluate performance over continuous simulation",
        "Compare controlled vs. baseline operation",
        "Document control logic thoroughly"
      ],
      tips: [
        "ICM RTC can supplement SWMM's native control rules",
        "RTC debugging tools help identify logic errors",
        "Export final model with SWMM-compatible controls"
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
      { feature: "Control Rules", swmm5: "IF-THEN control statements", icmSwmm: "SWMM rules + ICM RTC option", icm: "Full scripting language" },
      { feature: "Variables", swmm5: "Depth, flow, time", icmSwmm: "SWMM variables + ICM access", icm: "Any model variable" },
      { feature: "Logic Complexity", swmm5: "Basic conditional logic", icmSwmm: "Basic to advanced", icm: "Advanced logic, loops, arrays" },
      { feature: "Optimization", swmm5: "Not built-in", icmSwmm: "ICM optimization available", icm: "MPC optimization possible" },
      { feature: "Debugging", swmm5: "Trial and error", icmSwmm: "ICM RTC trace tools", icm: "RTC trace and debugging" },
      { feature: "SWMM Export", swmm5: "Native format", icmSwmm: "Export SWMM controls", icm: "Not applicable" }
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
    icmSwmm: {
      title: "Model Lifecycle in ICM SWMM",
      description: "Manage SWMM network lifecycle using ICM's data management features.",
      steps: [
        "Use model groups for version control",
        "Document updates in ICM notes and logs",
        "Set up backup schedules for ICM database",
        "Periodically validate against new data",
        "Track data age using custom fields",
        "Export SWMM versions for archive",
        "Create handover documentation for successors"
      ],
      tips: [
        "ICM's versioning supports long-term model management",
        "SWMM exports provide insurance for data portability",
        "Embedded documentation survives personnel changes"
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
      { feature: "Version Control", swmm5: "File naming, manual", icmSwmm: "ICM model groups", icm: "Model groups, scenarios" },
      { feature: "Collaboration", swmm5: "File sharing", icmSwmm: "ICM multi-user", icm: "Multi-user workgroups" },
      { feature: "Backup", swmm5: "Manual or IT systems", icmSwmm: "ICM backup tools", icm: "Built-in backup tools" },
      { feature: "Data Management", swmm5: "External databases/GIS", icmSwmm: "Integrated + SWMM export", icm: "Integrated database" },
      { feature: "Documentation", swmm5: "External documents", icmSwmm: "ICM notes + external", icm: "Embedded notes and metadata" },
      { feature: "Portability", swmm5: "Universal INP format", icmSwmm: "INP export available", icm: "ICM-specific format" }
    ]
  }
};

// Ruby Code Block Component with Copy and Download functionality
const RubyCodeBlock = ({ 
  code, 
  chapterNumber, 
  chapterTitle 
}: { 
  code: string; 
  chapterNumber: number; 
  chapterTitle: string;
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Ruby code has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const filename = `icm_chapter_${chapterNumber}_${chapterTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.rb`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started!",
      description: `${filename} is being downloaded.`,
    });
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-green-500/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-green-400 flex items-center gap-2">
          <Code className="w-4 h-4" />
          ICM Ruby Code Example
        </h4>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-400" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="text-xs">Download .rb</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[300px] bg-slate-950 rounded p-3">
        <RubySyntaxHighlighter code={code} />
      </ScrollArea>
      <p className="text-xs text-slate-400 mt-3 italic">
        💎 Run this in ICM's Ruby Console (Tools → Ruby Console) or save as .rb file
      </p>
    </div>
  );
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
          className="gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-green-500/20 border-primary/20"
        >
          <Laptop className="w-4 h-4" />
          <span>Software Examples: SWMM5, ICM SWMM & ICM</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            Chapter {chapterNumber}: Practical Software Examples
          </DialogTitle>
          <DialogDescription>
            Compare implementation approaches across EPA SWMM5, ICM SWMM Networks, and InfoWorks ICM
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="swmm5" className="mt-4 flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="swmm5" className="text-xs sm:text-sm font-medium">
              🔵 EPA SWMM5
            </TabsTrigger>
            <TabsTrigger value="icmSwmm" className="text-xs sm:text-sm font-medium">
              🟣 ICM SWMM
            </TabsTrigger>
            <TabsTrigger value="icm" className="text-xs sm:text-sm font-medium">
              🟢 ICM InfoWorks
            </TabsTrigger>
            <TabsTrigger value="compare" className="text-xs sm:text-sm font-medium">
              <Scale className="w-4 h-4 mr-1" />
              Compare
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="swmm5" className="mt-0 space-y-4">
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
                  
                  <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-2">
                    <a 
                      href="https://www.epa.gov/water-research/storm-water-management-model-swmm" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      EPA SWMM Official Documentation
                    </a>
                    <div className="flex flex-col gap-1">
                      <a 
                        href="https://www.youtube.com/watch?v=w0F_RXzP7KY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        EPA SWMM5 Getting Started Tutorial
                      </a>
                      <a 
                        href="https://www.youtube.com/watch?v=0k5PNE4xKsI" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        SWMM5 Complete Course Playlist
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="icmSwmm" className="mt-0 space-y-4">
              <Card className="p-6 border-l-4 border-l-purple-500">
                <h3 className="text-xl font-bold text-foreground mb-2">{examples.icmSwmm.title}</h3>
                <p className="text-muted-foreground mb-4">{examples.icmSwmm.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Step-by-Step:</h4>
                    <ol className="space-y-2">
                      {examples.icmSwmm.steps.map((step, index) => (
                        <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      💡 Practical Tips
                    </h4>
                    <ul className="space-y-1">
                      {examples.icmSwmm.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-purple-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-2">
                    <a 
                      href="https://help.autodesk.com/view/IWICMS/2025/ENU/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Autodesk ICM SWMM Documentation
                    </a>
                    <div className="flex flex-col gap-1">
                      <a 
                        href="https://www.youtube.com/watch?v=VYx3rG_HXGU" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        ICM SWMM Network Fundamentals
                      </a>
                      <a 
                        href="https://www.youtube.com/watch?v=dN3Iq_s8iMQ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        Migrating from SWMM5 to ICM SWMM
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="icm" className="mt-0 space-y-4">
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
                  
                  {/* Ruby Code Example */}
                  {icmRubyCode[chapterNumber] && (
                    <RubyCodeBlock 
                      code={icmRubyCode[chapterNumber]} 
                      chapterNumber={chapterNumber}
                      chapterTitle={examples.icm.title}
                    />
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-green-500/20 space-y-2">
                    <a 
                      href="https://help.autodesk.com/view/IWICMS/2025/ENU/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Autodesk ICM InfoWorks Documentation
                    </a>
                    <div className="flex flex-col gap-1">
                      <a 
                        href="https://www.youtube.com/watch?v=wBpfZ4BGQEY" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        InfoWorks ICM Introduction
                      </a>
                      <a 
                        href="https://www.youtube.com/watch?v=3p6yDdMnRAs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                      >
                        <Youtube className="w-4 h-4" />
                        ICM 2D Modeling Tutorial
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="compare" className="mt-0">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Feature Comparison: SWMM5 vs ICM SWMM vs ICM InfoWorks
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold min-w-[120px]">Feature</TableHead>
                        <TableHead className="font-bold text-blue-600 min-w-[150px]">🔵 SWMM5</TableHead>
                        <TableHead className="font-bold text-purple-600 min-w-[150px]">🟣 ICM SWMM</TableHead>
                        <TableHead className="font-bold text-green-600 min-w-[150px]">🟢 ICM InfoWorks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examples.comparison.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.feature}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.swmm5}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.icmSwmm}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.icm}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  All three platforms are excellent—choose based on project needs, budget, team expertise, and regulatory requirements.
                </p>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="mt-4 text-xs text-muted-foreground text-center border-t pt-4">
          Examples based on 50+ years of practical experience with SWMM (since SWMM3) and ICM InfoWorks
        </div>
      </DialogContent>
    </Dialog>
  );
};
