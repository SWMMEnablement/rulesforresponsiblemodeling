import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Code, FileCode, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Chapter titles
const chapterTitles: Record<number, string> = {
  1: "Introduction to Modeling",
  2: "Subcatchment Discretization",
  3: "Data Quality",
  4: "Model Complexity",
  5: "Continuous Simulation",
  6: "Calibration",
  7: "Event Selection",
  8: "Decision Support",
  9: "Objective Functions",
  10: "Sensitivity Analysis",
  11: "Uncertainty Quantification",
  12: "Verification & Validation",
  13: "Documentation",
  14: "Parameter Estimation",
  15: "Error Analysis",
  16: "Continuous Modeling",
  17: "Future Directions"
};

// ICM InfoWorks Ruby code
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
};

// ICM SWMM Ruby code
const icmSwmmRubyCode: Record<number, string> = {
  1: `# Chapter 1: Creating Your First ICM SWMM Model with Ruby
# This script creates a simple SWMM network using ICM's Ruby API

net = WSApplication.current_network
net.transaction_begin

# Create a SWMM junction node
junction = net.new_row_object('cswmm_node')
junction['node_id'] = 'J1'
junction['x'] = 100.0
junction['y'] = 100.0
junction['ground_level'] = 10.0
junction['invert'] = 7.0
junction.write

# Create an outfall
outfall = net.new_row_object('cswmm_node')
outfall['node_id'] = 'OUT1'
outfall['x'] = 200.0
outfall['y'] = 100.0
outfall['node_type'] = 'Outfall'
outfall['ground_level'] = 8.0
outfall['invert'] = 5.0
outfall.write

# Create a conduit between them
conduit = net.new_row_object('cswmm_conduit')
conduit['link_id'] = 'C1'
conduit['us_node_id'] = 'J1'
conduit['ds_node_id'] = 'OUT1'
conduit['shape'] = 'CIRCULAR'
conduit['geom1'] = 0.6  # diameter in meters
conduit['length'] = 100.0
conduit.write

net.transaction_commit
puts "SWMM Network created - remember: model wisely, decide responsibly!"`,

  2: `# Chapter 2: SWMM Subcatchment Discretization Analysis
# Analyze subcatchment properties for proper discretization

net = WSApplication.current_network
results = []

# Get all SWMM subcatchments
net.row_objects('cswmm_subcatchment').each do |sc|
  area = sc['area'] || 0
  width = sc['width'] || Math.sqrt(area * 10000)
  imperv = sc['imperv'] || 0
  
  results << {
    id: sc['subcatchment_id'],
    area: area,
    width: width,
    imperv: imperv,
    tc_estimate: (width / 100.0) * 60  # Simple Tc estimate
  }
end

puts "SWMM Subcatchment Discretization Analysis:"
puts "=" * 50
results.each do |r| 
  puts "#{r[:id]}: Area=#{r[:area]} ha, Width=#{r[:width]} m, Imperv=#{r[:imperv]}%"
end
puts "\\nRemember: Discretization should match your data resolution"`,

  3: `# Chapter 3: SWMM Network Data Quality Check
# Validate SWMM network data and identify issues

net = WSApplication.current_network
issues = []

# Check SWMM conduits for data quality
net.row_objects('cswmm_conduit').each do |link|
  # Check for missing geometry
  if link['geom1'].nil? || link['geom1'] <= 0
    issues << "#{link['link_id']}: Missing or invalid geometry"
  end
  
  # Check for valid length
  if link['length'].nil? || link['length'] <= 0
    issues << "#{link['link_id']}: Missing or invalid length"
  end
  
  # Check roughness value
  if link['roughness'] && (link['roughness'] < 0.01 || link['roughness'] > 0.03)
    issues << "#{link['link_id']}: Unusual roughness value"
  end
end

# Check SWMM nodes
net.row_objects('cswmm_node').each do |node|
  if node['invert'].nil?
    issues << "#{node['node_id']}: Missing invert elevation"
  end
end

puts "SWMM Data Quality Report:"
puts "Found #{issues.length} potential issues:"
issues.each { |i| puts "  - #{i}" }`,

  4: `# Chapter 4: SWMM Model Complexity Metrics
# Analyze model complexity for SWMM networks

net = WSApplication.current_network

# Count SWMM model elements
stats = {
  subcatchments: net.row_objects('cswmm_subcatchment').length,
  junctions: net.row_objects('cswmm_node').count { |n| n['node_type'] != 'Outfall' },
  outfalls: net.row_objects('cswmm_node').count { |n| n['node_type'] == 'Outfall' },
  conduits: net.row_objects('cswmm_conduit').length,
  pumps: net.row_objects('cswmm_pump').length,
  orifices: net.row_objects('cswmm_orifice').length,
  weirs: net.row_objects('cswmm_weir').length
}

total = stats.values.sum
complexity = total + (stats[:pumps] * 5) + (stats[:orifices] * 3) + (stats[:weirs] * 3)

puts "SWMM Model Complexity Analysis:"
puts "=" * 50
stats.each { |k, v| puts "  #{k.to_s.capitalize}: #{v}" }
puts "\\nTotal elements: #{total}"
puts "Complexity score: #{complexity}"
puts "\\nApply parsimony - only add complexity when justified by data"`,

  5: `# Chapter 5: SWMM Continuous Simulation Setup
# Configure long-term simulation parameters

net = WSApplication.current_network

puts "SWMM Continuous Simulation Configuration"
puts "=" * 50

# Analyze subcatchment antecedent conditions
net.row_objects('cswmm_subcatchment').each do |sc|
  area = sc['area'] || 0
  imperv = sc['imperv'] || 0
  slope = sc['slope'] || 0
  
  # Estimate time to equilibrium
  tte = (area * 10000) ** 0.5 / (slope ** 0.5 + 0.1) / 60
  
  puts "#{sc['subcatchment_id']}:"
  puts "  Area: #{area} ha, Imperv: #{imperv}%"
  puts "  Est. time to equilibrium: #{tte.round(1)} min"
end

puts "\\nContinuous Simulation Tips:"
puts "  - Set adequate spin-up period (1-7 days)"
puts "  - Check evaporation and recovery parameters"
puts "  - Use Green-Ampt or Horton for infiltration"
puts "  - Monitor groundwater if applicable"`,

  6: `# Chapter 6: SWMM Calibration Helper
# Setup calibration targets for SWMM network

net = WSApplication.current_network

# Define typical calibration parameters for SWMM
calibration_params = [
  { name: 'N-Imperv', typical: '0.01-0.015', affects: 'Peak timing' },
  { name: 'N-Perv', typical: '0.1-0.8', affects: 'Pervious runoff timing' },
  { name: 'Dstore-Imperv', typical: '0.05-0.1 in', affects: 'Initial abstraction' },
  { name: 'Dstore-Perv', typical: '0.1-0.3 in', affects: 'Pervious losses' },
  { name: '%Imperv', typical: 'Varies', affects: 'Volume' },
  { name: 'Width', typical: 'Varies', affects: 'Peak magnitude/timing' }
]

puts "SWMM Calibration Parameter Guide"
puts "=" * 50
calibration_params.each do |p|
  puts "  #{p[:name]}: #{p[:typical]} -> #{p[:affects]}"
end

puts "\\nCalibration Priority:"
puts "  1. Match total runoff volume first"
puts "  2. Adjust peak flow magnitude"
puts "  3. Fine-tune timing"
puts "  4. Check recession curve shape"
puts "\\nKeep parameters within physically reasonable bounds!"`,

  7: `# Chapter 7: SWMM Event Analysis
# Analyze and compare rainfall events for SWMM modeling

puts "SWMM Event Selection Guide"
puts "=" * 50

# Example synthetic design storms
design_storms = [
  { name: 'SCS Type II', duration: '24 hr', use: 'Urban design, Midwest/East US' },
  { name: 'SCS Type I', duration: '24 hr', use: 'Pacific maritime climate' },
  { name: 'Huff 1st Quartile', duration: 'Varies', use: 'Short, intense events' },
  { name: 'Huff 4th Quartile', duration: 'Varies', use: 'Long, gradual events' },
  { name: 'Chicago Storm', duration: 'User-defined', use: 'Custom IDF-based' }
]

puts "\\nDesign Storm Options:"
design_storms.each do |ds|
  puts "  #{ds[:name]} (#{ds[:duration]}): #{ds[:use]}"
end

puts "\\nHistorical Event Guidelines:"
puts "  - Use for calibration/validation"
puts "  - Include range of magnitudes"
puts "  - Check antecedent conditions"
puts "  - Document data source and quality"
puts "\\nConsider both design AND historical events!"`,

  8: `# Chapter 8: SWMM Decision Support Scenarios
# Compare multiple design alternatives in SWMM

scenarios = [
  { name: 'Baseline', desc: 'Existing conditions' },
  { name: 'Upsized_Pipes', desc: 'Increase pipe diameters 20%' },
  { name: 'Detention_Pond', desc: 'Add detention storage' },
  { name: 'LID_Controls', desc: 'Green infrastructure BMPs' }
]

puts "SWMM Decision Support Analysis"
puts "=" * 50

puts "\\nScenarios to Compare:"
scenarios.each do |s|
  puts "  #{s[:name]}: #{s[:desc]}"
end

puts "\\nMetrics to Evaluate:"
puts "  - Peak flow at critical points"
puts "  - Flood volume reduction"
puts "  - CSO frequency (if applicable)"
puts "  - Cost-effectiveness"

puts "\\nSWMM LID Controls Available:"
puts "  - Rain barrels, Cisterns"
puts "  - Green roofs, Bio-retention"
puts "  - Porous pavement, Infiltration trenches"
puts "  - Vegetative swales, Rain gardens"
puts "\\nModel informs decisions - decisions aren't automatic!"`,

  9: `# Chapter 9: SWMM Performance Metrics
# Calculate objective functions for SWMM calibration

def nash_sutcliffe(obs, sim)
  mean_obs = obs.sum / obs.length.to_f
  numerator = obs.zip(sim).map { |o, s| (o - s) ** 2 }.sum
  denominator = obs.map { |o| (o - mean_obs) ** 2 }.sum
  denominator == 0 ? nil : 1 - (numerator / denominator)
end

def rmse(obs, sim)
  Math.sqrt(obs.zip(sim).map { |o, s| (o - s) ** 2 }.sum / obs.length)
end

def peak_error(obs, sim)
  ((sim.max - obs.max) / obs.max) * 100
end

# Example comparison
observed = [0.2, 0.8, 1.5, 2.1, 1.8, 1.2, 0.6]
simulated = [0.18, 0.75, 1.6, 2.0, 1.7, 1.1, 0.55]

puts "SWMM Calibration Metrics"
puts "=" * 50
puts "  NSE: #{nash_sutcliffe(observed, simulated)&.round(3)}"
puts "  RMSE: #{rmse(observed, simulated).round(4)} m³/s"
puts "  Peak Error: #{peak_error(observed, simulated).round(1)}%"
puts "\\nNo single metric tells the whole story!"`,

  10: `# Chapter 10: SWMM Sensitivity Analysis
# Systematic parameter sensitivity testing

net = WSApplication.current_network

# Key SWMM parameters for sensitivity analysis
sensitivity_params = [
  { param: '%Imperv', range: [-20, -10, 0, 10, 20], output: 'Volume, Peak' },
  { param: 'Width', range: [-30, -15, 0, 15, 30], output: 'Peak, Timing' },
  { param: 'N-Imperv', range: [-30, 0, 30], output: 'Peak timing' },
  { param: 'Conduit roughness', range: [-20, 0, 20], output: 'Peak, HGL' },
  { param: 'Dstore-Imperv', range: [-50, 0, 50], output: 'Initial loss' }
]

puts "SWMM Sensitivity Analysis Framework"
puts "=" * 50

sensitivity_params.each do |p|
  puts "\\n#{p[:param]}:"
  puts "  Variations: #{p[:range].map { |v| "#{v}%" }.join(', ')}"
  puts "  Affects: #{p[:output]}"
end

puts "\\nProcedure:"
puts "  1. Run baseline simulation"
puts "  2. Vary ONE parameter at a time"
puts "  3. Record change in key outputs"
puts "  4. Rank by influence on results"
puts "  5. Focus calibration effort on sensitive parameters"`,

  11: `# Chapter 11: SWMM Uncertainty Quantification
# Monte Carlo setup for SWMM uncertainty analysis

# Define uncertain SWMM parameters
uncertain_params = [
  { name: '%Imperv', mean: 45, cv: 0.15, dist: 'Normal' },
  { name: 'Width', mean: 150, cv: 0.25, dist: 'Normal' },
  { name: 'Conduit_n', mean: 0.013, cv: 0.15, dist: 'Normal' },
  { name: 'Rain depth', mean: 75, cv: 0.20, dist: 'Normal' }
]

n_runs = 100

puts "SWMM Monte Carlo Uncertainty Analysis"
puts "=" * 50

puts "\\nUncertain Parameters:"
uncertain_params.each do |p|
  std = p[:mean] * p[:cv]
  puts "  #{p[:name]}: μ=#{p[:mean]}, σ=#{std.round(3)} (CV=#{(p[:cv]*100).round}%)"
end

puts "\\nPlanned Simulations: #{n_runs}"
puts "\\nOutputs to Track:"
puts "  - Peak flow distribution (min, mean, max)"
puts "  - Time to peak range"
puts "  - Flooding probability at each node"
puts "  - Surcharging frequency"
puts "\\nPresent results as confidence intervals!"`,

  12: `# Chapter 12: SWMM Verification & Validation
# Split-sample testing for SWMM models

calibration_events = ['Storm_2020_06_15', 'Storm_2021_03_22', 'Storm_2021_09_10']
validation_events = ['Storm_2022_04_08', 'Storm_2022_11_17']

puts "SWMM Verification & Validation Protocol"
puts "=" * 50

puts "\\nCalibration Events (parameter adjustment):"
calibration_events.each { |e| puts "  - #{e}" }

puts "\\nValidation Events (independent testing):"
validation_events.each { |e| puts "  - #{e}" }

puts "\\nAcceptance Criteria:"
puts "  - Volume error < ±20%"
puts "  - Peak error < ±25%"
puts "  - NSE > 0.5 (acceptable), > 0.7 (good)"
puts "  - Timing within ±15 minutes"

puts "\\nSWMM Continuity Checks:"
puts "  - Runoff continuity error < 1%"
puts "  - Flow routing continuity error < 1%"
puts "  - Review SWMM status report for warnings"`,

  13: `# Chapter 13: SWMM Model Documentation
# Generate comprehensive SWMM model documentation

net = WSApplication.current_network
timestamp = Time.now.strftime("%Y-%m-%d %H:%M")

puts "=" * 60
puts "SWMM MODEL DOCUMENTATION"
puts "Generated: #{timestamp}"
puts "=" * 60

# Model inventory
puts "\\n1. MODEL INVENTORY"
puts "-" * 40
inventory = {
  'Subcatchments' => net.row_objects('cswmm_subcatchment').length,
  'Junctions' => net.row_objects('cswmm_node').count { |n| n['node_type'] != 'Outfall' },
  'Outfalls' => net.row_objects('cswmm_node').count { |n| n['node_type'] == 'Outfall' },
  'Conduits' => net.row_objects('cswmm_conduit').length,
  'Pumps' => net.row_objects('cswmm_pump').length,
  'Storage Units' => net.row_objects('cswmm_storage').length
}
inventory.each { |k, v| puts "   #{k}: #{v}" }

puts "\\n2. SWMM OPTIONS"
puts "-" * 40
puts "   [Document routing method, infiltration model, etc.]"

puts "\\n3. CALIBRATION STATUS"
puts "-" * 40
puts "   [Document calibration events and performance]"`,

  14: `# Chapter 14: SWMM Parameter Estimation
# Derive SWMM parameters from GIS and field data

# Land use to SWMM parameter mapping
land_use_params = {
  'Commercial' => { imperv: 85, n_imperv: 0.012, dstore_imperv: 0.05 },
  'Industrial' => { imperv: 72, n_imperv: 0.012, dstore_imperv: 0.05 },
  'Residential_HD' => { imperv: 65, n_imperv: 0.013, dstore_imperv: 0.06 },
  'Residential_MD' => { imperv: 40, n_imperv: 0.013, dstore_imperv: 0.06 },
  'Residential_LD' => { imperv: 20, n_imperv: 0.013, dstore_imperv: 0.08 },
  'Open_Space' => { imperv: 5, n_imperv: 0.015, dstore_imperv: 0.10 }
}

puts "SWMM Parameter Estimation from GIS"
puts "=" * 50

puts "\\nLand Use → SWMM Parameters:"
land_use_params.each do |lu, params|
  puts "  #{lu}:"
  puts "    %Imperv=#{params[:imperv]}, N-Imperv=#{params[:n_imperv]}, Dstore=#{params[:dstore_imperv]}"
end

# Soil to infiltration mapping (Green-Ampt)
puts "\\nSoil Type → Green-Ampt Parameters:"
puts "  Sand: Ks=4.74 in/hr, ψ=1.93 in, θd=0.34"
puts "  Sandy Loam: Ks=0.43 in/hr, ψ=4.33 in, θd=0.33"
puts "  Clay: Ks=0.01 in/hr, ψ=12.45 in, θd=0.23"
puts "\\nAlways field-verify GIS-derived parameters!"`,

  15: `# Chapter 15: SWMM Error Diagnostics
# Analyze SWMM simulation errors and residuals

def analyze_swmm_errors(obs, sim)
  residuals = obs.zip(sim).map { |o, s| o - s }
  
  mean_res = residuals.sum / residuals.length.to_f
  std_res = Math.sqrt(residuals.map { |r| (r - mean_res) ** 2 }.sum / residuals.length)
  
  # Check for timing errors (cross-correlation would be ideal)
  peak_obs_idx = obs.index(obs.max)
  peak_sim_idx = sim.index(sim.max)
  timing_error = peak_sim_idx - peak_obs_idx  # timesteps
  
  {
    mean_residual: mean_res,
    std_residual: std_res,
    timing_error: timing_error,
    peak_ratio: sim.max / obs.max
  }
end

observed = [0.3, 1.0, 2.5, 3.2, 2.8, 1.5, 0.7]
simulated = [0.25, 0.9, 2.3, 3.0, 2.9, 1.6, 0.65]

results = analyze_swmm_errors(observed, simulated)

puts "SWMM Error Diagnostics"
puts "=" * 50
puts "  Mean Residual: #{results[:mean_residual].round(3)} m³/s"
puts "  Std Residual: #{results[:std_residual].round(3)} m³/s"
puts "  Timing Error: #{results[:timing_error]} timesteps"
puts "  Peak Ratio: #{results[:peak_ratio].round(2)}"
puts "\\nSystematic errors require structural changes!"`,

  16: `# Chapter 16: SWMM Continuous Modeling Tips
# Best practices for long-term SWMM simulations

net = WSApplication.current_network

puts "SWMM Continuous Modeling Best Practices"
puts "=" * 50

puts "\\n1. ROUTING OPTIONS"
puts "   - Dynamic Wave: Most accurate, slowest"
puts "   - Kinematic Wave: Good for steep pipes"
puts "   - Choose based on network characteristics"

puts "\\n2. TIMESTEP SETTINGS"
puts "   - Routing timestep: 15-30 seconds typical"
puts "   - Reporting timestep: 5-15 minutes"
puts "   - Dry weather timestep: can be larger"

puts "\\n3. ANTECEDENT CONDITIONS"
puts "   - Set initial soil moisture"
puts "   - Define groundwater table if used"
puts "   - Include evaporation data"

puts "\\n4. CONTINUITY CHECKS"
puts "   - Target < 1% for both runoff and routing"
puts "   - Review status report after each run"

# Quick subcatchment summary
puts "\\n5. MODEL SUMMARY"
total_area = 0
net.row_objects('cswmm_subcatchment').each do |sc|
  total_area += sc['area'] || 0
end
puts "   Total catchment area: #{total_area.round(2)} ha"`,

  17: `# Chapter 17: SWMM Future Directions
# Advanced automation and integration capabilities

puts "SWMM Future Directions in ICM"
puts "=" * 50

puts "\\n1. ENHANCED LID MODELING"
puts "   - Layer-based LID representation"
puts "   - Seasonal performance factors"
puts "   - LID maintenance effects"

puts "\\n2. CLIMATE CHANGE ANALYSIS"
puts <<-CODE
   # Automated rainfall scaling
   climate_factors = [1.0, 1.1, 1.2, 1.3]  # RCP scenarios
   climate_factors.each do |cf|
     puts "Running #{(cf*100-100).round}% uplift scenario..."
     # Modify rainfall and run
   end
CODE

puts "\\n3. REAL-TIME CONTROL"
puts "   - RTC rules for pump/gate operation"
puts "   - Sensor-based triggers"
puts "   - Optimization algorithms"

puts "\\n4. BATCH PROCESSING"
puts "   - Automated scenario runs"
puts "   - Results extraction to CSV"
puts "   - Report generation"

puts "\\nThe future: Integrated, automated, climate-ready!"`
};

interface SearchMatch {
  chapter: number;
  title: string;
  software: 'ICM InfoWorks' | 'ICM SWMM';
  code: string;
  lineNumber: number;
  lineContent: string;
  matchStart: number;
  matchEnd: number;
}

// Helper to highlight text with match
const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <span>{text}</span>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-400/60 dark:bg-yellow-500/40 text-foreground px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const RubyScriptsSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  // Search across all scripts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const matches: SearchMatch[] = [];
    const query = searchQuery.toLowerCase();
    
    // Search ICM InfoWorks scripts
    Object.entries(icmRubyCode).forEach(([chapterStr, code]) => {
      const chapter = parseInt(chapterStr);
      const lines = code.split('\n');
      
      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase();
        let searchStart = 0;
        let matchIndex: number;
        
        while ((matchIndex = lowerLine.indexOf(query, searchStart)) !== -1) {
          matches.push({
            chapter,
            title: chapterTitles[chapter] || `Chapter ${chapter}`,
            software: 'ICM InfoWorks',
            code,
            lineNumber: lineIndex + 1,
            lineContent: line,
            matchStart: matchIndex,
            matchEnd: matchIndex + query.length
          });
          searchStart = matchIndex + 1;
        }
      });
    });
    
    // Search ICM SWMM scripts
    Object.entries(icmSwmmRubyCode).forEach(([chapterStr, code]) => {
      const chapter = parseInt(chapterStr);
      const lines = code.split('\n');
      
      lines.forEach((line, lineIndex) => {
        const lowerLine = line.toLowerCase();
        let searchStart = 0;
        let matchIndex: number;
        
        while ((matchIndex = lowerLine.indexOf(query, searchStart)) !== -1) {
          matches.push({
            chapter,
            title: chapterTitles[chapter] || `Chapter ${chapter}`,
            software: 'ICM SWMM',
            code,
            lineNumber: lineIndex + 1,
            lineContent: line,
            matchStart: matchIndex,
            matchEnd: matchIndex + query.length
          });
          searchStart = matchIndex + 1;
        }
      });
    });
    
    return matches;
  }, [searchQuery]);

  // Group results by chapter and software
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchMatch[]> = {};
    
    searchResults.forEach(match => {
      const key = `${match.software}-ch${match.chapter}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(match);
    });
    
    return groups;
  }, [searchResults]);

  const toggleExpand = (key: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedResults(newExpanded);
  };

  const totalMatches = searchResults.length;
  const groupCount = Object.keys(groupedResults).length;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileCode className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Ruby Scripts Search</h3>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4">
        Search across all ICM Ruby code examples (34 scripts, 17 chapters × 2 platforms)
      </p>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search Ruby code (e.g., NSE, calibration, row_objects)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {searchQuery.length >= 2 && (
        <div className="mb-4">
          <Badge variant="secondary" className="mr-2">
            {totalMatches} match{totalMatches !== 1 ? 'es' : ''} in {groupCount} script{groupCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}
      
      {searchQuery.length >= 2 && totalMatches > 0 && (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {Object.entries(groupedResults)
              .sort(([a], [b]) => {
                // Sort by software then chapter
                const [swA, chA] = a.split('-ch');
                const [swB, chB] = b.split('-ch');
                if (swA !== swB) return swA.localeCompare(swB);
                return parseInt(chA) - parseInt(chB);
              })
              .map(([key, matches]) => {
                const firstMatch = matches[0];
                const isExpanded = expandedResults.has(key);
                const softwareColor = firstMatch.software === 'ICM InfoWorks' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400';
                
                return (
                  <Collapsible 
                    key={key} 
                    open={isExpanded} 
                    onOpenChange={() => toggleExpand(key)}
                  >
                    <Card className={`p-3 border ${firstMatch.software === 'ICM InfoWorks' ? 'border-emerald-500/20' : 'border-purple-500/20'}`}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between p-0 h-auto hover:bg-transparent"
                        >
                          <div className="flex items-center gap-3">
                            <Badge className={softwareColor}>
                              {firstMatch.software === 'ICM InfoWorks' ? '🟢' : '🟣'} {firstMatch.software}
                            </Badge>
                            <span className="font-medium text-foreground">
                              Chapter {firstMatch.chapter}: {firstMatch.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {matches.length} match{matches.length !== 1 ? 'es' : ''}
                            </Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-3">
                        <div className="bg-slate-950 rounded-lg p-3 space-y-1 font-mono text-sm">
                          {matches.slice(0, 20).map((match, idx) => (
                            <div 
                              key={idx} 
                              className="flex gap-3 hover:bg-slate-900/50 rounded px-2 py-1"
                            >
                              <span className="text-slate-500 select-none w-8 text-right shrink-0">
                                {match.lineNumber}
                              </span>
                              <code className="text-slate-300 overflow-x-auto whitespace-pre">
                                <HighlightedText text={match.lineContent} query={searchQuery} />
                              </code>
                            </div>
                          ))}
                          {matches.length > 20 && (
                            <div className="text-slate-500 text-center py-2">
                              ... and {matches.length - 20} more matches
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
          </div>
        </ScrollArea>
      )}
      
      {searchQuery.length >= 2 && totalMatches === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Code className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No matches found for "{searchQuery}"</p>
          <p className="text-sm mt-1">Try different keywords like: NSE, calibration, subcatchment, validation</p>
        </div>
      )}
      
      {searchQuery.length < 2 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Type at least 2 characters to search</p>
          <p className="text-sm mt-2">Example searches: <code className="bg-muted px-1 rounded">NSE</code>, <code className="bg-muted px-1 rounded">row_objects</code>, <code className="bg-muted px-1 rounded">Monte Carlo</code></p>
        </div>
      )}
    </Card>
  );
};

export default RubyScriptsSearch;
