import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar, Monitor, Lightbulb, ChevronDown, ChevronUp, Code, Copy, Check, Download } from "lucide-react";
import { RubySyntaxHighlighter } from "./RubySyntaxHighlighter";

interface CodeSnippet {
  language: "ruby" | "python";
  platform: "SWMM5" | "ICM InfoWorks" | "ICM SWMM" | "pyswmm";
  title: string;
  code: string;
  description?: string;
}

interface Annotation {
  id: string;
  originalConcept: string;
  modernPerspective: string;
  softwareGuidance?: {
    swmm?: string;
    icm?: string;
    general?: string;
  };
  codeSnippets?: CodeSnippet[];
  practicalTip?: string;
}

interface ModernAnnotationProps {
  annotations: Annotation[];
}

// Python syntax highlighter (simplified)
const PythonHighlighter = ({ code }: { code: string }) => {
  const keywords = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'return', 'with', 'try', 'except', 'finally', 'raise', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'lambda', 'yield', 'pass', 'break', 'continue', 'global', 'nonlocal', 'assert', 'del'];
  const builtins = ['print', 'len', 'range', 'open', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'isinstance', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min', 'abs', 'round', 'sorted', 'reversed', 'any', 'all'];
  
  const lines = code.split('\n');
  
  const highlightLine = (line: string) => {
    const parts: JSX.Element[] = [];
    let remaining = line;
    let key = 0;
    
    // Simple tokenization
    while (remaining.length > 0) {
      // Comments
      if (remaining.startsWith('#')) {
        parts.push(<span key={key++} className="text-slate-500 italic">{remaining}</span>);
        break;
      }
      
      // Strings
      const stringMatch = remaining.match(/^(["']{3}[\s\S]*?["']{3}|["'][^"']*["'])/);
      if (stringMatch) {
        parts.push(<span key={key++} className="text-amber-400">{stringMatch[0]}</span>);
        remaining = remaining.slice(stringMatch[0].length);
        continue;
      }
      
      // Numbers
      const numMatch = remaining.match(/^\d+\.?\d*/);
      if (numMatch) {
        parts.push(<span key={key++} className="text-purple-400">{numMatch[0]}</span>);
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }
      
      // Words
      const wordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
      if (wordMatch) {
        const word = wordMatch[0];
        if (keywords.includes(word)) {
          parts.push(<span key={key++} className="text-red-400 font-semibold">{word}</span>);
        } else if (builtins.includes(word)) {
          parts.push(<span key={key++} className="text-blue-400">{word}</span>);
        } else if (word[0] === word[0].toUpperCase()) {
          parts.push(<span key={key++} className="text-yellow-300">{word}</span>);
        } else {
          parts.push(<span key={key++} className="text-slate-200">{word}</span>);
        }
        remaining = remaining.slice(word.length);
        continue;
      }
      
      // Other characters
      parts.push(<span key={key++} className="text-slate-300">{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
    
    return parts;
  };
  
  return (
    <div className="text-xs font-mono leading-relaxed">
      {lines.map((line, i) => (
        <div key={i} className="hover:bg-slate-800/50 px-2">
          {line ? highlightLine(line) : <span>&nbsp;</span>}
        </div>
      ))}
    </div>
  );
};

// Code block component with copy/download
const CodeBlock = ({ snippet }: { snippet: CodeSnippet }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const ext = snippet.language === 'ruby' ? 'rb' : 'py';
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const platformColors: Record<string, string> = {
    "SWMM5": "bg-green-500/10 text-green-600 border-green-500/30",
    "ICM InfoWorks": "bg-purple-500/10 text-purple-600 border-purple-500/30",
    "ICM SWMM": "bg-blue-500/10 text-blue-600 border-blue-500/30",
    "pyswmm": "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
  };
  
  return (
    <div className="rounded-lg border border-border bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${platformColors[snippet.platform] || ''}`}>
            {snippet.platform}
          </Badge>
          <span className="text-xs text-slate-400">{snippet.title}</span>
          <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
            {snippet.language === 'ruby' ? 'Ruby' : 'Python'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-slate-700 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-slate-700 transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
      {snippet.description && (
        <div className="px-3 py-2 bg-slate-800/30 border-b border-slate-700/50">
          <p className="text-xs text-slate-400">{snippet.description}</p>
        </div>
      )}
      <div className="p-3 overflow-x-auto max-h-64 overflow-y-auto">
        {snippet.language === 'ruby' ? (
          <RubySyntaxHighlighter code={snippet.code} defaultShowLineNumbers={false} />
        ) : (
          <PythonHighlighter code={snippet.code} />
        )}
      </div>
    </div>
  );
};

export const ModernAnnotation = ({ annotations }: ModernAnnotationProps) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!showAnnotations) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
        <Switch
          id="annotations-toggle"
          checked={showAnnotations}
          onCheckedChange={setShowAnnotations}
        />
        <Label htmlFor="annotations-toggle" className="text-sm text-muted-foreground cursor-pointer">
          Show 2025 Practitioner Notes
        </Label>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">2025 Practitioner's Notes</h3>
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
            Modern Perspective
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="annotations-toggle"
            checked={showAnnotations}
            onCheckedChange={setShowAnnotations}
          />
          <Label htmlFor="annotations-toggle" className="text-xs text-muted-foreground cursor-pointer">
            Show
          </Label>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="rounded-lg border border-border bg-background/60 overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === annotation.id ? null : annotation.id)}
              className="w-full p-3 text-left flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1">
                <span className="text-xs font-medium text-blue-600">Regarding:</span>
                <h4 className="font-medium text-foreground text-sm mt-0.5">
                  {annotation.originalConcept}
                </h4>
              </div>
              {expandedId === annotation.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
            
            {expandedId === annotation.id && (
              <div className="px-3 pb-3 space-y-3">
                {/* Modern Perspective */}
                <div className="p-3 rounded bg-blue-500/5 border-l-2 border-blue-500">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {annotation.modernPerspective}
                  </p>
                </div>

                {/* Software Guidance */}
                {annotation.softwareGuidance && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Monitor className="w-3.5 h-3.5" />
                      Software Implementation
                    </div>
                    <div className="grid gap-2">
                      {annotation.softwareGuidance.swmm && (
                        <div className="p-2 rounded bg-green-500/5 text-xs">
                          <span className="font-semibold text-green-700 dark:text-green-400">SWMM5:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.swmm}</span>
                        </div>
                      )}
                      {annotation.softwareGuidance.icm && (
                        <div className="p-2 rounded bg-purple-500/5 text-xs">
                          <span className="font-semibold text-purple-700 dark:text-purple-400">ICM:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.icm}</span>
                        </div>
                      )}
                      {annotation.softwareGuidance.general && (
                        <div className="p-2 rounded bg-muted/50 text-xs">
                          <span className="font-semibold text-foreground">General:</span>
                          <span className="text-muted-foreground ml-1">{annotation.softwareGuidance.general}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Code Snippets */}
                {annotation.codeSnippets && annotation.codeSnippets.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Code className="w-3.5 h-3.5" />
                      Automation Code Examples
                    </div>
                    {annotation.codeSnippets.length === 1 ? (
                      <CodeBlock snippet={annotation.codeSnippets[0]} />
                    ) : (
                      <Tabs defaultValue="0" className="w-full">
                        <TabsList className="w-full justify-start bg-muted/30 h-auto flex-wrap">
                          {annotation.codeSnippets.map((snippet, idx) => (
                            <TabsTrigger 
                              key={idx} 
                              value={String(idx)}
                              className="text-xs data-[state=active]:bg-background"
                            >
                              {snippet.platform}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {annotation.codeSnippets.map((snippet, idx) => (
                          <TabsContent key={idx} value={String(idx)} className="mt-2">
                            <CodeBlock snippet={snippet} />
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </div>
                )}

                {/* Practical Tip */}
                {annotation.practicalTip && (
                  <div className="flex items-start gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">Tip:</span>{" "}
                      {annotation.practicalTip}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Pre-defined annotations for chapters
export const chapterAnnotations: Record<number, Annotation[]> = {
  1: [
    {
      id: "model-purpose-2025",
      originalConcept: "Model Purpose and Decision Support",
      modernPerspective: "In 2025, this principle is more critical than ever. With AI/ML models becoming accessible, the temptation is to apply complex methods without clear decision objectives. Start every project with: 'What decision will this model inform?'",
      softwareGuidance: {
        swmm: "SWMM's flexibility allows many modeling approaches. Document your purpose in the model notes (Options > Title/Notes) and let it drive subcatchment resolution and routing choices.",
        icm: "ICM's project templates can lock in complexity. Before accepting defaults, verify they match your actual objectives—CSO vs. flooding vs. water quality have different requirements."
      },
      codeSnippets: [
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Document Model Purpose in Network",
          description: "Add decision statement to network description for traceability",
          code: `# Document model purpose in network metadata
net = WSApplication.current_network

# Define decision statement
decision_statement = <<-TEXT
DECISION SUPPORT OBJECTIVE:
- Primary: Size trunk sewers for 25-year flood protection
- Secondary: Evaluate CSO reduction alternatives
- Constraints: Budget $5M, 2-year implementation
- Key stakeholders: Utility, EPA, Residents
TEXT

# Store in network description
net['description'] = decision_statement
net.transaction_commit

puts "Model purpose documented in network metadata"`
        },
        {
          language: "python",
          platform: "pyswmm",
          title: "Model Purpose Documentation",
          description: "Create structured metadata file for SWMM project documentation",
          code: `# Create model purpose documentation
import json
from datetime import datetime

model_metadata = {
    "project_name": "Cedar Creek Trunk Sewer",
    "decision_objective": "Size infrastructure for 25-year protection",
    "model_purpose": "decision_support",
    "key_decisions": [
        "Pipe sizing for trunk sewer",
        "Detention basin locations",
        "Pump station capacity"
    ],
    "stakeholders": ["Utility", "EPA", "Public Works"],
    "created": datetime.now().isoformat(),
    "modeler": "J. Smith, PE",
    "version": "1.0"
}

with open("model_metadata.json", "w") as f:
    json.dump(model_metadata, f, indent=2)

print("Model purpose documented successfully")`
        }
      ],
      practicalTip: "Create a one-paragraph 'Decision Statement' at project start. If you can't articulate what decisions the model will inform, you're not ready to build it."
    },
    {
      id: "rules-overview-modern",
      originalConcept: "Rules for Responsible Modeling",
      modernPerspective: "Dr. James's rules remain the gold standard in 2025. Modern cloud computing and automation make following these rules easier—not optional. Automated validation, version control, and documentation tools remove excuses for poor practice.",
      softwareGuidance: {
        general: "Use Git for model version control. Create README files explaining model purpose, limitations, and validation status. Treat model files like code."
      },
      practicalTip: "Post Dr. James's rules near your workstation. Before delivering any model, check each rule against your work."
    }
  ],
  2: [
    {
      id: "discretization-2025",
      originalConcept: "Discretization Trade-offs",
      modernPerspective: "With 1m LiDAR and powerful computers, over-discretization is the modern trap. High resolution doesn't equal high accuracy when calibration data is limited. Dr. James's guidance on matching discretization to data remains essential.",
      softwareGuidance: {
        swmm: "SWMM5's performance scales with subcatchment count. Start with larger subcatchments (2-5 ha for urban) and refine only where data supports it.",
        icm: "ICM's automatic mesh generation can create excessive detail. Set minimum element sizes based on calibration data density, not just topography."
      },
      codeSnippets: [
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Analyze Subcatchment Size Distribution",
          description: "Generate statistics on subcatchment areas to identify over-discretization",
          code: `# Analyze subcatchment discretization
net = WSApplication.current_network

areas = []
net.row_objects('hw_subcatchment').each do |sc|
  areas << sc['total_area'].to_f if sc['total_area']
end

# Calculate statistics
min_area = areas.min
max_area = areas.max
avg_area = areas.sum / areas.size
median = areas.sort[areas.size / 2]

# Count potential over-discretization
small_count = areas.count { |a| a < 0.5 }  # < 0.5 ha

puts "Subcatchment Area Analysis:"
puts "  Count: #{areas.size}"
puts "  Min: #{min_area.round(2)} ha"
puts "  Max: #{max_area.round(2)} ha"
puts "  Mean: #{avg_area.round(2)} ha"
puts "  Median: #{median.round(2)} ha"
puts "  Small (<0.5 ha): #{small_count} (#{(100.0*small_count/areas.size).round(1)}%)"
puts "\\nConsider aggregating if >30% are small without data support"`
        },
        {
          language: "python",
          platform: "pyswmm",
          title: "Subcatchment Discretization Analysis",
          description: "Analyze SWMM model subcatchment sizes for optimization",
          code: `# Analyze subcatchment discretization in SWMM
from pyswmm import Simulation, Subcatchments
import statistics

with Simulation('model.inp') as sim:
    areas = []
    for sc in Subcatchments(sim):
        areas.append(sc.area)  # acres
    
# Convert to hectares and analyze
areas_ha = [a * 0.404686 for a in areas]

print("Subcatchment Discretization Analysis")
print(f"  Count: {len(areas_ha)}")
print(f"  Min: {min(areas_ha):.2f} ha")
print(f"  Max: {max(areas_ha):.2f} ha")
print(f"  Mean: {statistics.mean(areas_ha):.2f} ha")
print(f"  Median: {statistics.median(areas_ha):.2f} ha")

# Flag potential over-discretization
small = [a for a in areas_ha if a < 0.5]
print(f"  Small (<0.5 ha): {len(small)} ({100*len(small)/len(areas_ha):.1f}%)")`
        }
      ],
      practicalTip: "Before increasing spatial resolution, ask: 'Do I have calibration data at this scale?' If not, additional detail adds uncertainty, not accuracy."
    },
    {
      id: "timestep-modern",
      originalConcept: "Temporal Discretization",
      modernPerspective: "Modern continuous rainfall data (1-5 minute) enables finer timesteps, but CFL constraints and computational efficiency still matter for long-term simulations. Variable timesteps are now standard practice.",
      softwareGuidance: {
        swmm: "Use SWMM's variable timestep routing. Set wet-weather steps to 15-30 seconds, dry-weather to 5-15 minutes for efficiency.",
        icm: "ICM handles variable timesteps automatically. Monitor the 'minimum timestep used' in run logs to verify stability."
      },
      practicalTip: "For 30+ year simulations, balance accuracy against run time. A 20% faster model enables more sensitivity runs."
    }
  ],
  3: [
    {
      id: "data-reliability-2025",
      originalConcept: "Data Reliability Classification",
      modernPerspective: "With cloud-based monitoring and real-time SCADA, data quantity has exploded but quality assessment is more important than ever. Automate data quality checks as part of your workflow.",
      softwareGuidance: {
        swmm: "Use Python preprocessing scripts to flag data anomalies before import. Check for flat-line periods, negative values, and unrealistic jumps.",
        icm: "ICM's data import wizard includes some QA checks. Supplement with visual review of hydrographs before calibration."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Data Quality Assessment Script",
          description: "Automated QA/QC for monitoring data before model import",
          code: `# Data quality assessment for monitoring data
import pandas as pd
import numpy as np

def assess_data_quality(df, value_col, time_col='datetime'):
    """Assess data quality for modeling use"""
    results = {
        'total_records': len(df),
        'missing_values': df[value_col].isna().sum(),
        'negative_values': (df[value_col] < 0).sum(),
        'zeros': (df[value_col] == 0).sum(),
    }
    
    # Check for flat-line periods (stuck sensor)
    df['diff'] = df[value_col].diff()
    flatline = (df['diff'] == 0).rolling(6).sum() >= 6
    results['flatline_periods'] = flatline.sum()
    
    # Check for unrealistic jumps (>5x std dev)
    std = df[value_col].std()
    jumps = abs(df['diff']) > 5 * std
    results['suspicious_jumps'] = jumps.sum()
    
    # Completeness score
    expected = pd.date_range(df[time_col].min(), 
                              df[time_col].max(), freq='5min')
    results['completeness_pct'] = 100 * len(df) / len(expected)
    
    # Quality rating
    if results['completeness_pct'] > 95 and results['flatline_periods'] < 10:
        results['rating'] = 'HIGH'
    elif results['completeness_pct'] > 80:
        results['rating'] = 'MEDIUM'
    else:
        results['rating'] = 'LOW - Review before use'
    
    return results

# Usage
df = pd.read_csv('flow_data.csv', parse_dates=['datetime'])
quality = assess_data_quality(df, 'flow_cfs')
for k, v in quality.items():
    print(f"{k}: {v}")`
        },
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Validate Level Monitor Data",
          description: "Check imported level data for common quality issues",
          code: `# Validate level monitor data quality
net = WSApplication.current_network

net.row_objects('hw_level_monitor').each do |monitor|
  ts = monitor.ts_data('level')
  next unless ts
  
  values = ts.values
  times = ts.times
  
  # Quality checks
  negative = values.count { |v| v < 0 }
  max_val = values.max
  min_val = values.min
  range = max_val - min_val
  
  # Check for flatlines
  flatline_count = 0
  values.each_cons(6) do |window|
    flatline_count += 1 if window.uniq.size == 1
  end
  
  puts "Monitor: #{monitor.id}"
  puts "  Records: #{values.size}"
  puts "  Range: #{min_val.round(3)} - #{max_val.round(3)} m"
  puts "  Negative values: #{negative}"
  puts "  Flatline periods: #{flatline_count}"
  
  if negative > 0 || flatline_count > 10
    puts "  STATUS: REVIEW REQUIRED"
  else
    puts "  STATUS: OK"
  end
  puts ""
end`
        }
      ],
      practicalTip: "Create a data quality scorecard: rate each source 1-5 for completeness, accuracy, temporal resolution, and spatial relevance."
    },
    {
      id: "gis-data-modern",
      originalConcept: "GIS Data Integration",
      modernPerspective: "LiDAR and high-resolution DEMs are now standard, but their apparent precision can be misleading. Ground-truth critical elevations—inverts, overflows, structures—with survey data.",
      softwareGuidance: {
        swmm: "When using GIS-derived subcatchments, verify outlets manually. Auto-delineation often misses surface connectivity.",
        icm: "ICM's ground model import can use raw LiDAR, but review depression handling—real depressions vs. artifacts."
      },
      practicalTip: "For critical structures (detention ponds, outfalls), spend the money on survey. LiDAR is great for terrain but not for below-grade infrastructure."
    }
  ],
  4: [
    {
      id: "optimal-complexity-2025",
      originalConcept: "Optimal Order of Model Complexity",
      modernPerspective: "Today, this principle is more relevant than ever. With easy access to 2D/3D modeling in ICM and sophisticated LID modules in SWMM, the temptation to over-complicate is constant. Always start simple and justify each complexity increase with data.",
      softwareGuidance: {
        swmm: "Use the built-in sensitivity analysis or connect SWMM to Python/R for Morris screening before adding subcatchment detail.",
        icm: "Run 1D baseline before 2D mesh. ICM's 2D often shows minimal difference for pipe-dominated systems.",
        general: "Document your complexity justification in the model report—reviewers increasingly expect this."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Morris Sensitivity Screening",
          description: "Identify which parameters matter before adding model complexity",
          code: `# Morris method sensitivity analysis for SWMM
from SALib.sample import morris as morris_sample
from SALib.analyze import morris as morris_analyze
from pyswmm import Simulation, Subcatchments
import numpy as np

# Define parameter bounds
problem = {
    'num_vars': 4,
    'names': ['n_imperv', 'n_perv', 'destore_imperv', 'destore_perv'],
    'bounds': [[0.01, 0.025], [0.1, 0.4], [0.5, 2.0], [2.0, 10.0]]
}

# Generate samples
param_values = morris_sample.sample(problem, N=50)

def run_model(params):
    """Run SWMM with given parameters, return peak flow"""
    # Modify INP file with params (simplified)
    with Simulation('model.inp') as sim:
        max_flow = 0
        for step in sim:
            for node in sim.nodes:
                max_flow = max(max_flow, node.total_inflow)
    return max_flow

# Run simulations
Y = np.array([run_model(p) for p in param_values])

# Analyze
Si = morris_analyze.analyze(problem, param_values, Y)
print("Morris Sensitivity Results:")
print("Parameter        | mu*   | sigma")
print("-" * 40)
for i, name in enumerate(problem['names']):
    print(f"{name:16} | {Si['mu_star'][i]:5.2f} | {Si['sigma'][i]:5.2f}")
print("\\nHigh mu* = influential; High sigma = nonlinear/interactive")`
        },
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Compare 1D vs 2D Flood Extents",
          description: "Quantify benefit of 2D modeling for complexity decision",
          code: `# Compare 1D vs 2D results to justify complexity
net = WSApplication.current_network

# Get flood results from both simulations
sim_1d = 'Baseline_1D'
sim_2d = 'Baseline_2D'

# Compare at key locations
comparison_nodes = ['MH_101', 'MH_205', 'OF_001']

puts "1D vs 2D Comparison - Peak Water Levels (m)"
puts "Node       | 1D Max  | 2D Max  | Diff   | %Diff"
puts "-" * 55

comparison_nodes.each do |node_id|
  node = net.row_object('hw_node', node_id)
  
  # Get max levels from each simulation
  ts_1d = node.ts_data('level', sim_1d)
  ts_2d = node.ts_data('level', sim_2d)
  
  max_1d = ts_1d.values.max
  max_2d = ts_2d.values.max
  diff = max_2d - max_1d
  pct = 100 * diff / max_1d
  
  puts "#{node_id.ljust(10)} | #{max_1d.round(3).to_s.ljust(7)} | " +
       "#{max_2d.round(3).to_s.ljust(7)} | #{diff.round(3).to_s.ljust(6)} | #{pct.round(1)}%"
end

puts "\\nIf differences < 5%, 1D may be sufficient for this application"`
        }
      ],
      practicalTip: "Create a 'complexity log' in your project folder: every time you add detail, note why and what data supports it."
    },
    {
      id: "parsimony-modern",
      originalConcept: "Parsimony Principle",
      modernPerspective: "In 2025, this is your QA/QC plan section. Document your source, confidence rating, and rationale for every major parameter. Regulators and peer reviewers expect explicit parsimony justification.",
      softwareGuidance: {
        swmm: "SWMM's RDII parameters are classic parsimony targets—can you use 3-triangle vs. 9-triangle representation?",
        icm: "ICM's automatic subcatchment generation can create unnecessary complexity. Review and simplify before calibration."
      },
      practicalTip: "For each parameter, ask: 'What data would I need to calibrate this?' If you don't have that data, consider fixing it to a literature value."
    }
  ],
  5: [
    {
      id: "continuous-2025",
      originalConcept: "Continuous Simulation Benefits",
      modernPerspective: "Cloud computing makes 100-year continuous simulations routine. There's no excuse for event-based shortcuts when continuous simulation is feasible and provides frequency-concentration data that event models cannot.",
      softwareGuidance: {
        swmm: "SWMM5 handles 30+ year continuous runs efficiently. Use climate file (.cli) format for long-term rainfall. Consider hourly timesteps for computational efficiency.",
        icm: "ICM's long-term simulation modes are optimized for multi-decade runs. Use the 'Fast' engine mode for initial screening."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Extract Annual Maxima from Continuous Simulation",
          description: "Post-process continuous simulation for frequency analysis",
          code: `# Extract annual maxima from continuous SWMM simulation
from pyswmm import Simulation, Nodes
import pandas as pd
from datetime import datetime

# Run long-term simulation and collect peak flows
results = []

with Simulation('continuous_30yr.inp') as sim:
    outfall = Nodes(sim)['Outfall_1']
    current_year = None
    year_max = 0
    
    for step in sim:
        year = sim.current_time.year
        flow = outfall.total_inflow
        
        if year != current_year:
            if current_year is not None:
                results.append({
                    'year': current_year,
                    'annual_max_cfs': year_max
                })
            current_year = year
            year_max = flow
        else:
            year_max = max(year_max, flow)

# Create DataFrame and analyze
df = pd.DataFrame(results)
df = df.sort_values('annual_max_cfs', ascending=False)
df['rank'] = range(1, len(df) + 1)
df['return_period'] = (len(df) + 1) / df['rank']

print("Annual Maximum Series:")
print(df.to_string(index=False))
print(f"\\n10-year flow estimate: {df[df['return_period'] >= 10].iloc[0]['annual_max_cfs']:.1f} cfs")`
        },
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Run Continuous Simulation Batch",
          description: "Automate multi-year simulation with efficient settings",
          code: `# Run continuous simulation with optimized settings
net = WSApplication.current_network

# Create run for continuous simulation
run = net.new_run

run['name'] = 'Continuous_30yr'
run['simulation_type'] = 'HYDROLOGY'
run['start_date'] = DateTime.new(1990, 1, 1)
run['end_date'] = DateTime.new(2020, 12, 31)

# Optimize for long-term run
run['timestep_results'] = 3600      # Hourly output
run['timestep_multiplier'] = 4      # Larger internal steps
run['max_timestep'] = 300           # 5 min max
run['results_selection'] = 'NODES_ONLY'  # Reduce output

# Add rainfall
run['rainfall_event'] = 'Historical_1990_2020'

puts "Starting 30-year continuous simulation..."
puts "Estimated run time: 2-4 hours"

run.run
net.transaction_commit

puts "Simulation complete. Check results at key nodes."`
        }
      ],
      practicalTip: "For sustainability assessments, always prefer continuous over event-based. The additional insight into water balance and antecedent conditions is invaluable."
    },
    {
      id: "calibration-continuous-modern",
      originalConcept: "Calibration for Continuous Models",
      modernPerspective: "Dr. James's insight remains valid: short, accurate calibration periods suffice. Modern practice adds: calibrate to extremes (low flows and peaks) not just overall fit, and validate across seasons.",
      softwareGuidance: {
        swmm: "Split your calibration period by season. Verify the model performs well for both summer low flows and winter baseflow.",
        icm: "Use ICM's calibration wizard but manually check low-flow and high-flow performance separately."
      },
      practicalTip: "A model that fits annual totals but misses seasonal patterns may fail for ecological or water supply applications."
    }
  ],
  6: [
    {
      id: "rainfall-uncertainty-2025",
      originalConcept: "Rainfall Input Uncertainty",
      modernPerspective: "Radar-rainfall products (MRMS, gauge-adjusted radar) are now standard, but temporal disaggregation is still needed for sub-hourly modeling. Ensemble rainfall products enable probabilistic approaches.",
      softwareGuidance: {
        swmm: "SWMM accepts rain gauge or interface files. For ensemble runs, script multiple .dat files with pyswmm and process as Monte Carlo.",
        icm: "ICM's rainfall generator can create stochastic series. Combine with sensitivity analysis for comprehensive uncertainty assessment."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Generate Rainfall Ensemble for Monte Carlo",
          description: "Create multiple rainfall scenarios varying intensity and temporal pattern",
          code: `# Generate rainfall ensemble for uncertainty analysis
import numpy as np
from scipy import stats
import os

def generate_rainfall_ensemble(base_depths, n_realizations=100):
    """Generate rainfall ensemble with varied intensities"""
    
    # Uncertainty factors (from literature)
    intensity_cv = 0.15  # 15% coefficient of variation
    
    for i in range(n_realizations):
        # Sample intensity multiplier
        multiplier = np.random.normal(1.0, intensity_cv)
        multiplier = max(0.5, min(1.5, multiplier))  # Bound
        
        # Apply to depths
        adjusted = base_depths * multiplier
        
        # Write SWMM rain file
        filename = f'rainfall_ensemble/rain_{i:03d}.dat'
        with open(filename, 'w') as f:
            for j, depth in enumerate(adjusted):
                # Format: STA01 2024 1 15 0 j*5  depth
                f.write(f"GAGE1 2024 1 15 0 {j*5:3d} {depth:.4f}\\n")
    
    return n_realizations

# Example usage
base_storm = np.array([0.1, 0.2, 0.5, 1.2, 0.8, 0.4, 0.2, 0.1])  # inches/5min
os.makedirs('rainfall_ensemble', exist_ok=True)
n = generate_rainfall_ensemble(base_storm)
print(f"Generated {n} rainfall realizations in rainfall_ensemble/")`
        }
      ],
      practicalTip: "Don't use a sophisticated routing model with a single design storm. The routing precision is wasted if rainfall uncertainty dominates."
    },
    {
      id: "disaggregation-modern",
      originalConcept: "Temporal Disaggregation",
      modernPerspective: "Modern rainfall databases often include sub-hourly data, reducing disaggregation needs. However, for long historical records or climate scenarios, disaggregation remains essential.",
      softwareGuidance: {
        general: "Tools like HYETOS, disaggregation R packages, or custom Python scripts can generate sub-hourly rainfall preserving daily statistics."
      },
      practicalTip: "Always validate disaggregated rainfall against available sub-hourly records before using for design."
    }
  ],
  7: [
    {
      id: "storm-motion-2025",
      originalConcept: "Storm Cell Kinematics",
      modernPerspective: "Radar tracking and NWP models now provide real-time storm motion estimates. For design, this means exploring critical storm paths—not assuming stationary rainfall.",
      softwareGuidance: {
        swmm: "Script multiple rain gauge files with different spatial patterns representing storm motion. Compare peak responses.",
        icm: "ICM's spatial rainfall can accept moving storm patterns. Create scenarios with upstream-to-downstream and reverse motion."
      },
      codeSnippets: [
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Create Moving Storm Scenarios",
          description: "Generate rainfall profiles for different storm track directions",
          code: `# Create moving storm scenarios for critical analysis
net = WSApplication.current_network

# Define gauge locations (x, y) and storm velocity
gauges = {
  'RG_North' => [1000, 5000],
  'RG_Central' => [1000, 2500],
  'RG_South' => [1000, 0]
}

storm_velocity = 10  # m/s (36 km/h typical)
catchment_length = 5000  # m north-south

# Base storm hyetograph (mm per 5-min)
base_storm = [1, 3, 8, 15, 12, 6, 3, 1]
timestep = 300  # 5 minutes in seconds

scenarios = ['North_to_South', 'South_to_North', 'Stationary']

scenarios.each do |scenario|
  puts "Creating scenario: #{scenario}"
  
  gauges.each do |gauge_id, coords|
    y_pos = coords[1]
    
    case scenario
    when 'North_to_South'
      delay = (catchment_length - y_pos) / storm_velocity
    when 'South_to_North'
      delay = y_pos / storm_velocity
    else
      delay = 0
    end
    
    delay_steps = (delay / timestep).round
    
    # Create offset hyetograph
    profile = Array.new(delay_steps, 0) + base_storm
    
    puts "  #{gauge_id}: #{delay_steps * 5} min delay"
  end
end

puts "\\nCompare peak flows at outfall for each scenario"`
        }
      ],
      practicalTip: "For elongated catchments, always test critical storm velocity—where storm speed matches time of concentration."
    }
  ],
  8: [
    {
      id: "dss-2025",
      originalConcept: "Decision Support Systems",
      modernPerspective: "Modern DSS extend beyond PCSWMM to include cloud platforms, API integrations, and real-time dashboards. The principle remains: tools should support, not replace, professional judgment.",
      softwareGuidance: {
        swmm: "PCSWMM, InfoSWMM, and open-source tools like pyswmm provide DSS capabilities. Choose based on team skills and project needs.",
        icm: "ICM's scenario manager and reporting tools provide DSS functionality. Integrate with GIS for stakeholder communication."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Build Scenario Comparison Dashboard Data",
          description: "Extract key metrics from multiple scenarios for decision support",
          code: `# Generate scenario comparison data for DSS dashboard
from pyswmm import Simulation, Nodes, Links
import pandas as pd
import json

scenarios = {
    'Baseline': 'baseline.inp',
    'Option_A_Pipes': 'option_a.inp',
    'Option_B_Storage': 'option_b.inp',
    'Option_C_Combined': 'option_c.inp'
}

results = []

for name, inp_file in scenarios.items():
    with Simulation(inp_file) as sim:
        flooding_volume = 0
        max_surcharge = 0
        
        for step in sim:
            for node in Nodes(sim):
                flooding_volume += node.flooding * sim.step
                if node.depth > node.crown_elev - node.invert_elev:
                    max_surcharge = max(max_surcharge, node.depth)
        
        results.append({
            'scenario': name,
            'flooding_volume_cf': flooding_volume,
            'max_surcharge_ft': max_surcharge,
            'cost_estimate': get_cost(name),  # Custom function
            'benefit_ratio': flooding_volume / get_cost(name)
        })

df = pd.DataFrame(results)
print("\\nScenario Comparison for Decision Support:")
print(df.to_string(index=False))

# Export for web dashboard
df.to_json('scenario_comparison.json', orient='records')`
        },
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Generate Scenario Comparison Report",
          description: "Automated comparison of multiple scenarios for stakeholder review",
          code: `# Generate scenario comparison report
net = WSApplication.current_network

scenarios = ['Baseline', 'Alt1_Pipes', 'Alt2_Storage', 'Alt3_GI']

puts "=" * 70
puts "SCENARIO COMPARISON REPORT"
puts "=" * 70

# Key performance indicators
scenarios.each do |scenario|
  puts "\\nScenario: #{scenario}"
  puts "-" * 40
  
  # Get simulation results
  flood_nodes = 0
  total_flood_vol = 0
  cso_vol = 0
  
  net.row_objects('hw_node').each do |node|
    ts = node.ts_data('flood_volume', scenario)
    next unless ts
    
    max_flood = ts.values.max
    if max_flood > 0
      flood_nodes += 1
      total_flood_vol += ts.values.sum
    end
  end
  
  net.row_objects('hw_outfall').each do |of|
    ts = of.ts_data('total_volume', scenario)
    cso_vol += ts.values.sum if ts && of['outfall_type'] == 'CSO'
  end
  
  puts "  Flooded nodes: #{flood_nodes}"
  puts "  Total flood volume: #{total_flood_vol.round(0)} m³"
  puts "  CSO volume: #{cso_vol.round(0)} m³"
end

puts "\\n" + "=" * 70
puts "Use these metrics for stakeholder decision matrix"`
        }
      ],
      practicalTip: "Train staff on DSS tools so they understand what's happening 'under the hood'—automation without understanding leads to errors."
    }
  ],
  9: [
    {
      id: "objective-functions-2025",
      originalConcept: "Objective Function Selection",
      modernPerspective: "KGE (Kling-Gupta Efficiency) has emerged as a preferred metric because it decomposes into correlation, bias, and variability components. But application-specific metrics still matter most.",
      softwareGuidance: {
        swmm: "Python libraries (hydroeval, spotpy) calculate multiple metrics automatically. Use them for comprehensive assessment.",
        icm: "ICM reports NSE and RMSE. Export time series to Python/R for KGE and other advanced metrics."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Calculate KGE and Component Metrics",
          description: "Comprehensive objective function calculation for calibration",
          code: `# Calculate Kling-Gupta Efficiency and components
import numpy as np
from scipy import stats

def calculate_kge(observed, simulated):
    """
    Calculate KGE and its three components:
    - r: Pearson correlation
    - alpha: variability ratio (std_sim / std_obs)
    - beta: bias ratio (mean_sim / mean_obs)
    """
    # Remove NaN pairs
    mask = ~(np.isnan(observed) | np.isnan(simulated))
    obs = observed[mask]
    sim = simulated[mask]
    
    # Correlation
    r = np.corrcoef(obs, sim)[0, 1]
    
    # Variability ratio
    alpha = np.std(sim) / np.std(obs)
    
    # Bias ratio
    beta = np.mean(sim) / np.mean(obs)
    
    # KGE
    kge = 1 - np.sqrt((r - 1)**2 + (alpha - 1)**2 + (beta - 1)**2)
    
    # Also calculate NSE for comparison
    nse = 1 - np.sum((obs - sim)**2) / np.sum((obs - np.mean(obs))**2)
    
    # PBIAS (percent bias)
    pbias = 100 * np.sum(sim - obs) / np.sum(obs)
    
    return {
        'KGE': round(kge, 3),
        'r': round(r, 3),
        'alpha': round(alpha, 3),
        'beta': round(beta, 3),
        'NSE': round(nse, 3),
        'PBIAS': round(pbias, 1)
    }

# Example usage
obs = np.array([10, 25, 50, 75, 45, 20, 12])
sim = np.array([12, 28, 48, 70, 42, 22, 14])

metrics = calculate_kge(obs, sim)
print("Calibration Metrics:")
for k, v in metrics.items():
    print(f"  {k}: {v}")
print("\\nKGE > 0.5 is acceptable; > 0.75 is good")`
        }
      ],
      practicalTip: "Always report multiple metrics. If they disagree, that disagreement is information about model behavior."
    }
  ],
  10: [
    {
      id: "uncertainty-2025",
      originalConcept: "Uncertainty Analysis",
      modernPerspective: "Monte Carlo simulation is now standard practice, not an advanced technique. Both SWMM (via Python integration) and ICM have built-in Monte Carlo tools. Present results as confidence intervals, not single lines on a graph.",
      softwareGuidance: {
        swmm: "Use pyswmm or SWMM-EPANET-Integration for automated Monte Carlo. Sample from parameter distributions, run batch simulations, plot confidence bands.",
        icm: "ICM's Risk Assessment module provides built-in Monte Carlo. Use it for design storm analysis to show 10th/90th percentile flood extents.",
        general: "For presentations, show the uncertainty band first, then explain what it means. Stakeholders need to understand range before point estimates."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Monte Carlo Uncertainty Analysis",
          description: "Sample parameters and run ensemble simulations",
          code: `# Monte Carlo uncertainty analysis for SWMM
import numpy as np
from pyswmm import Simulation, Nodes
import matplotlib.pyplot as plt

# Parameter distributions (mean, std)
params = {
    'imperv_pct': (65, 10),      # % impervious
    'n_imperv': (0.015, 0.003),  # Manning's n
    'slope': (0.5, 0.1),         # % slope
    'width': (400, 50)           # characteristic width
}

n_runs = 100
peak_flows = []

for i in range(n_runs):
    # Sample parameters
    sampled = {k: np.random.normal(v[0], v[1]) 
               for k, v in params.items()}
    
    # Modify INP and run (simplified)
    with Simulation('model.inp') as sim:
        outfall = Nodes(sim)['Outfall']
        max_flow = 0
        for step in sim:
            max_flow = max(max_flow, outfall.total_inflow)
        peak_flows.append(max_flow)

# Calculate statistics
peak_flows = np.array(peak_flows)
percentiles = [10, 25, 50, 75, 90]
results = np.percentile(peak_flows, percentiles)

print("Monte Carlo Results (Peak Flow at Outfall):")
print(f"  Mean: {np.mean(peak_flows):.1f} cfs")
print(f"  Std Dev: {np.std(peak_flows):.1f} cfs")
for p, r in zip(percentiles, results):
    print(f"  {p}th percentile: {r:.1f} cfs")
print(f"\\n90% Confidence Interval: [{results[0]:.1f}, {results[4]:.1f}] cfs")`
        },
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Extract Monte Carlo Results",
          description: "Process Risk Assessment results for reporting",
          code: `# Process Monte Carlo / Risk Assessment results
net = WSApplication.current_network

# Get Monte Carlo run results
mc_run = 'MonteCarlo_100runs'

# Key reporting locations
report_nodes = ['MH_Critical_1', 'MH_Critical_2', 'Outfall_Main']

puts "Monte Carlo Uncertainty Analysis Results"
puts "=" * 60

report_nodes.each do |node_id|
  node = net.row_object('hw_node', node_id)
  
  # Get percentile results from Risk Assessment
  ts_p10 = node.ts_data('level_p10', mc_run)
  ts_p50 = node.ts_data('level_p50', mc_run)
  ts_p90 = node.ts_data('level_p90', mc_run)
  
  next unless ts_p50
  
  max_p10 = ts_p10.values.max
  max_p50 = ts_p50.values.max
  max_p90 = ts_p90.values.max
  
  puts "\\nNode: #{node_id}"
  puts "  10th percentile max level: #{max_p10.round(3)} m"
  puts "  50th percentile max level: #{max_p50.round(3)} m"
  puts "  90th percentile max level: #{max_p90.round(3)} m"
  puts "  Uncertainty range: ±#{((max_p90 - max_p10) / 2).round(3)} m"
  
  if max_p90 > node['ground_level'].to_f
    puts "  WARNING: Flooding possible at 90th percentile"
  end
end`
        }
      ],
      practicalTip: "Start with just 3-5 key parameters for Monte Carlo. Adding all parameters makes interpretation difficult and may not improve decision-relevance."
    },
    {
      id: "sensitivity-modern",
      originalConcept: "Sensitivity Analysis",
      modernPerspective: "Global sensitivity methods (Sobol, Morris) are now computationally feasible even for complex models. Local sensitivity is still useful for quick checks, but don't rely on it for parameter selection.",
      softwareGuidance: {
        swmm: "SALib library in Python pairs well with pyswmm for Sobol sensitivity analysis. Run overnight for complex models.",
        icm: "ICM's sensitivity analysis wizard provides one-at-a-time testing. For global sensitivity, export to Python."
      },
      practicalTip: "Present sensitivity rankings to clients—it helps them understand why you focused calibration effort on specific parameters."
    }
  ],
  11: [
    {
      id: "calibration-2025",
      originalConcept: "Model Calibration",
      modernPerspective: "Automatic calibration tools are powerful but dangerous without sensitivity analysis first. Modern practice: sensitivity analysis → select 5-10 key parameters → automatic calibration → manual refinement → validation.",
      softwareGuidance: {
        swmm: "PEST and SWMM-EPANET-Integration support gradient-based and genetic algorithm calibration. Define tight bounds based on physical reasoning.",
        icm: "ICM's calibration wizard is effective but verify results manually. Watch for equifinality—multiple parameter sets may produce similar fits."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Automated Calibration with spotpy",
          description: "Use DREAM algorithm for SWMM parameter calibration",
          code: `# Automated calibration using spotpy DREAM algorithm
import spotpy
from pyswmm import Simulation, Nodes
import numpy as np

class SWMM_Calibration(spotpy.objectivefunctions.calculate_nse):
    
    def __init__(self, observed_data):
        self.observed = observed_data
        
        # Define calibration parameters with bounds
        self.params = [
            spotpy.parameter.Uniform('n_imperv', 0.01, 0.025),
            spotpy.parameter.Uniform('n_perv', 0.1, 0.4),
            spotpy.parameter.Uniform('destore_imperv', 0.5, 3.0),
            spotpy.parameter.Uniform('infil_rate', 0.5, 4.0),
        ]
    
    def parameters(self):
        return spotpy.parameter.generate(self.params)
    
    def simulation(self, params):
        # Modify model and run
        modify_inp('model.inp', params)
        
        with Simulation('model.inp') as sim:
            results = []
            for step in sim:
                outfall = Nodes(sim)['Outfall']
                results.append(outfall.total_inflow)
        return np.array(results)
    
    def evaluation(self):
        return self.observed
    
    def objectivefunction(self, sim, obs):
        return spotpy.objectivefunctions.kge(obs, sim)

# Run calibration
observed = np.loadtxt('observed_flow.txt')
model = SWMM_Calibration(observed)
sampler = spotpy.algorithms.dream(model, dbname='calibration', dbformat='csv')
sampler.sample(5000)

# Get best parameters
results = spotpy.analyser.load_csv_results('calibration')
best_idx = np.argmax(results['like1'])
print(f"Best KGE: {results['like1'][best_idx]:.3f}")`
        }
      ],
      practicalTip: "Document three things for every calibration: (1) parameters adjusted, (2) events used, (3) objective function and final value. This is your calibration audit trail."
    },
    {
      id: "objective-functions-modern",
      originalConcept: "Objective Functions",
      modernPerspective: "Don't use R² alone—it's insensitive to timing and bias. Modern multi-objective calibration uses NSE, KGE, and PBIAS together. Report all three in calibration documentation.",
      softwareGuidance: {
        swmm: "Calculate KGE using Python: kling_gupta = 1 - sqrt((r-1)² + (α-1)² + (β-1)²) where r=correlation, α=variability ratio, β=bias ratio.",
        icm: "ICM reports NSE and RMSE. Supplement with volume balance checks for water balance verification."
      },
      practicalTip: "Plot observed vs. simulated on 1:1 line with validation events clearly distinguished from calibration events."
    }
  ],
  12: [
    {
      id: "state-space-2025",
      originalConcept: "State Variable Representation",
      modernPerspective: "With real-time control systems becoming common in water infrastructure, state space methods are increasingly practical. Model Predictive Control (MPC) uses these concepts for optimal gate/pump operations.",
      softwareGuidance: {
        icm: "ICM Live integrates state-space concepts for real-time control optimization. The RTC rules can be thought of as state-dependent actions.",
        general: "Python control libraries (python-control) can interface with water models for advanced control design."
      },
      codeSnippets: [
        {
          language: "ruby",
          platform: "ICM InfoWorks",
          title: "Implement State-Based RTC Rules",
          description: "Real-time control based on system state variables",
          code: `# State-based Real-Time Control logic
# This runs during simulation at each control timestep

def rtc_logic(net, current_time)
  # Define state variables
  upstream_level = net.row_object('hw_node', 'Tank_Upstream')['level']
  downstream_level = net.row_object('hw_node', 'Tank_Downstream')['level']
  pump_station_level = net.row_object('hw_node', 'PS_Main')['level']
  
  # State thresholds
  high_level = 2.5  # m
  low_level = 0.8   # m
  
  # Get control actuators
  gate = net.row_object('hw_sluice', 'Gate_Control')
  pump = net.row_object('hw_pump', 'Pump_Main')
  
  # State-based control logic
  if upstream_level > high_level
    # High upstream - open gate to transfer flow
    gate['setting'] = 1.0
    
    if downstream_level < high_level
      pump['status'] = 'ON'
    end
    
  elsif upstream_level < low_level
    # Low upstream - close gate, reduce pumping
    gate['setting'] = 0.2
    pump['status'] = 'OFF'
    
  else
    # Normal operation - proportional control
    gate['setting'] = (upstream_level - low_level) / (high_level - low_level)
  end
  
  # Log state for analysis
  puts "#{current_time}: UL=#{upstream_level.round(2)}, " +
       "DL=#{downstream_level.round(2)}, Gate=#{gate['setting']}"
end`
        }
      ],
      practicalTip: "Even if you don't use formal state-space methods, thinking in terms of 'what variables define system state' improves control system design."
    }
  ],
  13: [
    {
      id: "performance-2025",
      originalConcept: "Performance Evaluation Survey",
      modernPerspective: "The proliferation of metrics can overwhelm. Focus on a small set aligned with your application, but always include at least one error metric, one efficiency metric, and one bias metric.",
      softwareGuidance: {
        general: "Python's hydroeval package calculates 18+ metrics automatically. Use it as a starting point, then select the most relevant."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Comprehensive Performance Metrics",
          description: "Calculate full suite of model performance metrics",
          code: `# Comprehensive model performance evaluation
import numpy as np

def evaluate_performance(observed, simulated):
    """Calculate comprehensive performance metrics"""
    
    obs = np.array(observed)
    sim = np.array(simulated)
    
    # Remove any NaN values
    mask = ~(np.isnan(obs) | np.isnan(sim))
    obs, sim = obs[mask], sim[mask]
    
    n = len(obs)
    
    # Error metrics
    me = np.mean(sim - obs)                    # Mean Error
    mae = np.mean(np.abs(sim - obs))           # Mean Absolute Error
    rmse = np.sqrt(np.mean((sim - obs)**2))    # Root Mean Square Error
    
    # Efficiency metrics
    ss_res = np.sum((obs - sim)**2)
    ss_tot = np.sum((obs - np.mean(obs))**2)
    nse = 1 - (ss_res / ss_tot)                # Nash-Sutcliffe
    
    # KGE components
    r = np.corrcoef(obs, sim)[0, 1]
    alpha = np.std(sim) / np.std(obs)
    beta = np.mean(sim) / np.mean(obs)
    kge = 1 - np.sqrt((r-1)**2 + (alpha-1)**2 + (beta-1)**2)
    
    # Bias metrics
    pbias = 100 * np.sum(sim - obs) / np.sum(obs)
    
    # Peak-specific
    obs_peak_idx = np.argmax(obs)
    peak_error = (sim[obs_peak_idx] - obs[obs_peak_idx]) / obs[obs_peak_idx] * 100
    peak_timing_error = np.argmax(sim) - obs_peak_idx  # timesteps
    
    return {
        'N': n,
        'ME': round(me, 3),
        'MAE': round(mae, 3),
        'RMSE': round(rmse, 3),
        'NSE': round(nse, 3),
        'KGE': round(kge, 3),
        'r': round(r, 3),
        'PBIAS_%': round(pbias, 1),
        'Peak_Error_%': round(peak_error, 1),
        'Peak_Timing_Error': peak_timing_error
    }

# Example
obs = [10, 25, 55, 80, 65, 35, 18, 10]
sim = [12, 28, 52, 75, 60, 32, 20, 11]
metrics = evaluate_performance(obs, sim)

print("Model Performance Evaluation")
print("=" * 40)
for k, v in metrics.items():
    print(f"  {k}: {v}")`
        }
      ],
      practicalTip: "Create a standard performance report template for your organization. Consistency across projects enables meaningful comparisons."
    }
  ],
  14: [
    {
      id: "optimization-2025",
      originalConcept: "Genetic Algorithm Optimization",
      modernPerspective: "Modern alternatives include Differential Evolution, CMA-ES, and Bayesian optimization. GAs remain robust for complex problems, but newer methods may converge faster.",
      softwareGuidance: {
        swmm: "spotpy provides multiple optimization algorithms for SWMM. Try ROPE (RObust Parameter Estimation) for multi-objective problems.",
        icm: "ICM's optimization uses efficient algorithms. For complex problems, export to Python and use deap or pymoo libraries."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Multi-Objective Optimization with pymoo",
          description: "NSGA-II for BMP sizing with cost-performance tradeoff",
          code: `# Multi-objective BMP optimization using NSGA-II
from pymoo.core.problem import Problem
from pymoo.algorithms.moo.nsga2 import NSGA2
from pymoo.optimize import minimize
import numpy as np

class BMPOptimization(Problem):
    def __init__(self):
        super().__init__(
            n_var=4,      # 4 BMP sizes to optimize
            n_obj=2,      # 2 objectives: cost and flood reduction
            n_constr=1,   # 1 constraint: budget
            xl=np.array([0, 0, 0, 0]),      # Min sizes
            xu=np.array([1000, 500, 2000, 300])  # Max sizes (m³)
        )
        self.costs = [50, 75, 40, 100]  # $/m³ for each BMP
        
    def _evaluate(self, X, out, *args, **kwargs):
        # X is array of solutions, each row is a design
        n_solutions = X.shape[0]
        
        costs = np.zeros(n_solutions)
        flood_reduction = np.zeros(n_solutions)
        
        for i, design in enumerate(X):
            # Calculate cost
            costs[i] = sum(design * self.costs)
            
            # Run SWMM and get flood reduction (simplified)
            flood_reduction[i] = run_swmm_with_bmps(design)
        
        # Objectives (minimize both: cost and negative reduction)
        out["F"] = np.column_stack([costs, -flood_reduction])
        
        # Constraint: budget <= $500,000
        out["G"] = costs - 500000

# Run optimization
problem = BMPOptimization()
algorithm = NSGA2(pop_size=50)
result = minimize(problem, algorithm, ('n_gen', 100))

print("Pareto-optimal solutions found:")
print("Cost ($) | Flood Reduction (%)")
for sol in result.F:
    print(f"{sol[0]:,.0f} | {-sol[1]:.1f}%")`
        }
      ],
      practicalTip: "Run optimization multiple times with different random seeds. If results vary significantly, you may have equifinality issues."
    }
  ],
  15: [
    {
      id: "fuzzy-2025",
      originalConcept: "Fuzzy Logic Applications",
      modernPerspective: "Fuzzy logic remains valuable for control systems and expert knowledge integration. Neural-fuzzy hybrids (ANFIS) combine fuzzy reasoning with learning capabilities.",
      softwareGuidance: {
        general: "Python's scikit-fuzzy provides fuzzy logic tools. MATLAB's Fuzzy Logic Toolbox offers more comprehensive features."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Fuzzy Logic Pump Control",
          description: "Implement fuzzy rules for adaptive pump operation",
          code: `# Fuzzy logic pump control
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# Define fuzzy variables
level = ctrl.Antecedent(np.arange(0, 5, 0.1), 'level')
rate_of_rise = ctrl.Antecedent(np.arange(-0.5, 0.5, 0.01), 'rate_of_rise')
pump_speed = ctrl.Consequent(np.arange(0, 100, 1), 'pump_speed')

# Define membership functions
level['low'] = fuzz.trimf(level.universe, [0, 0, 1.5])
level['medium'] = fuzz.trimf(level.universe, [1, 2, 3])
level['high'] = fuzz.trimf(level.universe, [2.5, 4, 5])

rate_of_rise['falling'] = fuzz.trimf(rate_of_rise.universe, [-0.5, -0.3, 0])
rate_of_rise['steady'] = fuzz.trimf(rate_of_rise.universe, [-0.1, 0, 0.1])
rate_of_rise['rising'] = fuzz.trimf(rate_of_rise.universe, [0, 0.3, 0.5])

pump_speed['off'] = fuzz.trimf(pump_speed.universe, [0, 0, 20])
pump_speed['low'] = fuzz.trimf(pump_speed.universe, [10, 30, 50])
pump_speed['medium'] = fuzz.trimf(pump_speed.universe, [40, 60, 80])
pump_speed['high'] = fuzz.trimf(pump_speed.universe, [70, 100, 100])

# Fuzzy rules (expert knowledge)
rule1 = ctrl.Rule(level['low'] & rate_of_rise['falling'], pump_speed['off'])
rule2 = ctrl.Rule(level['low'] & rate_of_rise['steady'], pump_speed['off'])
rule3 = ctrl.Rule(level['low'] & rate_of_rise['rising'], pump_speed['low'])
rule4 = ctrl.Rule(level['medium'] & rate_of_rise['falling'], pump_speed['low'])
rule5 = ctrl.Rule(level['medium'] & rate_of_rise['steady'], pump_speed['medium'])
rule6 = ctrl.Rule(level['medium'] & rate_of_rise['rising'], pump_speed['high'])
rule7 = ctrl.Rule(level['high'], pump_speed['high'])

# Create control system
pump_ctrl = ctrl.ControlSystem([rule1, rule2, rule3, rule4, rule5, rule6, rule7])
pump_sim = ctrl.ControlSystemSimulation(pump_ctrl)

# Test
pump_sim.input['level'] = 2.3
pump_sim.input['rate_of_rise'] = 0.15
pump_sim.compute()
print(f"Pump speed setting: {pump_sim.output['pump_speed']:.1f}%")`
        }
      ],
      practicalTip: "Use fuzzy logic when you have expert operators who can articulate rules linguistically but struggle to quantify exact thresholds."
    }
  ],
  16: [
    {
      id: "realtime-uncertainty-2025",
      originalConcept: "Real-Time Uncertainty Display",
      modernPerspective: "Ensemble forecasting is now operational practice for major flood systems. The challenge has shifted from 'can we generate ensembles' to 'how do we communicate them effectively to decision-makers'.",
      softwareGuidance: {
        icm: "ICM Live provides ensemble generation and display capabilities. Configure confidence bands based on local operator preferences.",
        general: "Dashboard tools (Grafana, custom web apps) can display probabilistic forecasts intuitively."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Generate Real-Time Ensemble Forecast",
          description: "Create probabilistic forecast display data",
          code: `# Generate ensemble forecast for real-time display
import numpy as np
import json
from datetime import datetime, timedelta

def generate_ensemble_forecast(current_level, n_members=50, forecast_hours=6):
    """Generate ensemble flood forecast"""
    
    timesteps = forecast_hours * 12  # 5-minute steps
    times = [datetime.now() + timedelta(minutes=5*i) for i in range(timesteps)]
    
    # Base forecast (deterministic model)
    base = np.zeros(timesteps)
    base[0] = current_level
    
    # Simulate rising limb then recession
    peak_time = timesteps // 3
    for t in range(1, timesteps):
        if t < peak_time:
            base[t] = base[t-1] + np.random.normal(0.05, 0.01)
        else:
            base[t] = base[t-1] * 0.95
    
    # Generate ensemble with increasing uncertainty
    ensemble = np.zeros((n_members, timesteps))
    for m in range(n_members):
        for t in range(timesteps):
            uncertainty = 0.1 * (t / timesteps)  # Growing uncertainty
            ensemble[m, t] = base[t] * np.random.normal(1.0, uncertainty)
    
    # Calculate percentiles
    percentiles = {
        'times': [t.isoformat() for t in times],
        'p10': np.percentile(ensemble, 10, axis=0).tolist(),
        'p25': np.percentile(ensemble, 25, axis=0).tolist(),
        'p50': np.percentile(ensemble, 50, axis=0).tolist(),
        'p75': np.percentile(ensemble, 75, axis=0).tolist(),
        'p90': np.percentile(ensemble, 90, axis=0).tolist(),
        'threshold_warning': 2.0,
        'threshold_critical': 2.5
    }
    
    return percentiles

# Generate and save for dashboard
forecast = generate_ensemble_forecast(current_level=1.2)
with open('ensemble_forecast.json', 'w') as f:
    json.dump(forecast, f)
print("Ensemble forecast generated for dashboard")`
        }
      ],
      practicalTip: "Train operators to interpret probabilistic forecasts. A 70% chance of flooding is useful information, but only if the operator understands what to do with it."
    }
  ],
  17: [
    {
      id: "ethics-2025",
      originalConcept: "Ethical Responsibility",
      modernPerspective: "In 2025, climate uncertainty adds another dimension. Be explicit about whether your model uses historical or adjusted rainfall. Stakeholder trust depends on clear communication of what the model does and doesn't include.",
      softwareGuidance: {
        general: "Create a 'Model Limitations' section in every report. Include: (1) conditions not tested, (2) data gaps, (3) extrapolation warnings, (4) climate assumptions."
      },
      codeSnippets: [
        {
          language: "python",
          platform: "pyswmm",
          title: "Generate Model Limitations Report",
          description: "Automated documentation of model limitations and assumptions",
          code: `# Generate model limitations documentation
from datetime import datetime

def generate_limitations_report(model_info):
    """Create standardized model limitations documentation"""
    
    report = f"""
MODEL LIMITATIONS AND ASSUMPTIONS REPORT
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
Model: {model_info['name']}
Version: {model_info['version']}
Modeler: {model_info['modeler']}

{'='*60}

1. CONDITIONS NOT TESTED
------------------------
{chr(10).join('• ' + c for c in model_info['untested_conditions'])}

2. DATA GAPS AND UNCERTAINTIES
------------------------------
{chr(10).join('• ' + d for d in model_info['data_gaps'])}

3. EXTRAPOLATION WARNINGS
-------------------------
{chr(10).join('• ' + e for e in model_info['extrapolation_warnings'])}

4. CLIMATE ASSUMPTIONS
----------------------
Rainfall data period: {model_info['rainfall_period']}
Climate adjustment: {model_info['climate_adjustment']}
IDF curves vintage: {model_info['idf_vintage']}

5. MODEL BOUNDARY CONDITIONS
----------------------------
{chr(10).join('• ' + b for b in model_info['boundary_conditions'])}

{'='*60}
DISCLAIMER: This model is a decision support tool. Results represent
our best estimate given available data and stated assumptions.
Actual conditions may differ from model predictions.
"""
    return report

# Example usage
info = {
    'name': 'Cedar Creek Drainage Model',
    'version': '2.1',
    'modeler': 'J. Smith, PE',
    'untested_conditions': [
        'Flows exceeding 500-year return period',
        'Multiple pump failures',
        'Debris blockage scenarios'
    ],
    'data_gaps': [
        'Limited flow monitoring in upper watershed',
        'Infiltration rates estimated from soil maps',
        'Private detention facilities not surveyed'
    ],
    'extrapolation_warnings': [
        'Extreme events beyond calibration range',
        'Future land use changes not modeled',
        'Sea level rise effects not included'
    ],
    'rainfall_period': '1990-2020',
    'climate_adjustment': 'None - historical data only',
    'idf_vintage': 'NOAA Atlas 14 (2019)',
    'boundary_conditions': [
        'Downstream: Fixed stage at river confluence',
        'Upstream: No inflows from adjacent watershed'
    ]
}

report = generate_limitations_report(info)
print(report)
with open('model_limitations.txt', 'w') as f:
    f.write(report)`
        }
      ],
      practicalTip: "Before any presentation, ask: 'If this model is wrong, who gets hurt?' That question should guide how you communicate uncertainty."
    },
    {
      id: "communication-modern",
      originalConcept: "Communicate Uncertainty",
      modernPerspective: "Modern practice includes probabilistic flood mapping and risk-based decision frameworks. Present flooding as probability of occurrence, not just depth at a return period.",
      softwareGuidance: {
        icm: "ICM's 2D Risk Assessment generates probability maps directly. Present these alongside deterministic 100-year maps.",
        general: "Use phrases like 'the model suggests' and 'based on available data' rather than 'the model shows' or 'the flooding will be.'"
      },
      practicalTip: "Create a verbal disclaimer you use consistently: 'This model is a tool for decision support, not a perfect prediction of the future.'"
    }
  ]
};
