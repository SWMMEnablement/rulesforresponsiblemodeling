import { useState, useMemo, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { 
  Play, 
  RefreshCw, 
  BarChart3, 
  TrendingUp,
  Info
} from "lucide-react";

interface ParameterDist {
  name: string;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  unit: string;
  description: string;
}

const parameters: ParameterDist[] = [
  {
    name: "Imperviousness",
    mean: 50,
    stdDev: 10,
    min: 0,
    max: 100,
    unit: "%",
    description: "Uncertain due to land use mapping accuracy"
  },
  {
    name: "Infiltration Rate",
    mean: 25,
    stdDev: 8,
    min: 5,
    max: 75,
    unit: "mm/hr",
    description: "High spatial variability in soil properties"
  },
  {
    name: "Rainfall Intensity",
    mean: 40,
    stdDev: 15,
    min: 10,
    max: 100,
    unit: "mm/hr",
    description: "Measurement and interpolation uncertainty"
  }
];

// Simple runoff model for demonstration
const calculateRunoff = (imp: number, infil: number, rain: number): number => {
  const imperviousness = Math.max(0, Math.min(100, imp)) / 100;
  const infiltration = Math.max(1, infil);
  const rainfall = Math.max(0, rain);
  
  const imperviousRunoff = rainfall * imperviousness * 0.95;
  const perviousRunoff = Math.max(0, rainfall - infiltration * 0.5) * (1 - imperviousness) * 0.6;
  
  return Math.max(0, imperviousRunoff + perviousRunoff);
};

// Box-Muller transform for normal distribution
const normalRandom = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
};

interface SimulationResult {
  values: number[];
  mean: number;
  stdDev: number;
  p5: number;
  p50: number;
  p95: number;
  histogram: { bin: number; count: number }[];
}

export const MonteCarloCalculator = () => {
  const [paramMeans, setParamMeans] = useState<Record<string, number>>(
    Object.fromEntries(parameters.map(p => [p.name, p.mean]))
  );
  const [paramStdDevs, setParamStdDevs] = useState<Record<string, number>>(
    Object.fromEntries(parameters.map(p => [p.name, p.stdDev]))
  );
  const [numSimulations, setNumSimulations] = useState(500);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    
    // Simulate async processing
    setTimeout(() => {
      const values: number[] = [];
      
      for (let i = 0; i < numSimulations; i++) {
        const imp = normalRandom(paramMeans["Imperviousness"], paramStdDevs["Imperviousness"]);
        const infil = normalRandom(paramMeans["Infiltration Rate"], paramStdDevs["Infiltration Rate"]);
        const rain = normalRandom(paramMeans["Rainfall Intensity"], paramStdDevs["Rainfall Intensity"]);
        
        const runoff = calculateRunoff(imp, infil, rain);
        values.push(runoff);
      }
      
      // Sort for percentiles
      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      const p5 = sorted[Math.floor(values.length * 0.05)];
      const p50 = sorted[Math.floor(values.length * 0.5)];
      const p95 = sorted[Math.floor(values.length * 0.95)];
      
      // Create histogram
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const binCount = 15;
      const binWidth = (maxVal - minVal) / binCount;
      
      const histogram: { bin: number; count: number }[] = [];
      for (let i = 0; i < binCount; i++) {
        const binStart = minVal + i * binWidth;
        const binEnd = binStart + binWidth;
        const count = values.filter(v => v >= binStart && v < binEnd).length;
        histogram.push({ bin: binStart + binWidth / 2, count });
      }
      
      setResults({ values, mean, stdDev, p5, p50, p95, histogram });
      setIsRunning(false);
    }, 100);
  }, [numSimulations, paramMeans, paramStdDevs]);

  const handleReset = () => {
    setParamMeans(Object.fromEntries(parameters.map(p => [p.name, p.mean])));
    setParamStdDevs(Object.fromEntries(parameters.map(p => [p.name, p.stdDev])));
    setResults(null);
  };

  const maxHistogramCount = useMemo(() => {
    if (!results) return 0;
    return Math.max(...results.histogram.map(h => h.count));
  }, [results]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Monte Carlo Uncertainty Demonstrator</h3>
            <p className="text-sm text-muted-foreground">
              Define parameter distributions and run simulations to see output uncertainty
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Parameter Distributions */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Input Parameter Distributions
            </h4>
            
            {parameters.map((param) => (
              <Card key={param.name} className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{param.name}</span>
                  <Badge variant="outline" className="text-xs">Normal</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{param.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Mean (μ)</span>
                      <span className="font-mono text-primary">
                        {paramMeans[param.name].toFixed(1)} {param.unit}
                      </span>
                    </div>
                    <Slider
                      value={[paramMeans[param.name]]}
                      min={param.min}
                      max={param.max}
                      step={1}
                      onValueChange={(value) => 
                        setParamMeans(prev => ({ ...prev, [param.name]: value[0] }))
                      }
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Std Dev (σ)</span>
                      <span className="font-mono text-secondary">
                        ± {paramStdDevs[param.name].toFixed(1)} {param.unit}
                      </span>
                    </div>
                    <Slider
                      value={[paramStdDevs[param.name]]}
                      min={1}
                      max={param.max * 0.3}
                      step={0.5}
                      onValueChange={(value) => 
                        setParamStdDevs(prev => ({ ...prev, [param.name]: value[0] }))
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of Simulations</span>
                <span className="font-mono text-foreground">{numSimulations}</span>
              </div>
              <Slider
                value={[numSimulations]}
                min={100}
                max={2000}
                step={100}
                onValueChange={(value) => setNumSimulations(value[0])}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={runSimulation}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Monte Carlo Simulation
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Output Distribution (Runoff)
            </h4>

            {results ? (
              <>
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3 text-center bg-gradient-to-br from-green-500/10 to-green-600/5">
                    <p className="text-xs text-muted-foreground mb-1">5th Percentile</p>
                    <p className="text-lg font-bold text-green-600">{results.p5.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">mm/hr</p>
                  </Card>
                  <Card className="p-3 text-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <p className="text-xs text-muted-foreground mb-1">Median</p>
                    <p className="text-lg font-bold text-primary">{results.p50.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">mm/hr</p>
                  </Card>
                  <Card className="p-3 text-center bg-gradient-to-br from-red-500/10 to-red-600/5">
                    <p className="text-xs text-muted-foreground mb-1">95th Percentile</p>
                    <p className="text-lg font-bold text-red-600">{results.p95.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">mm/hr</p>
                  </Card>
                </div>

                {/* Histogram */}
                <Card className="p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Output Distribution Histogram</p>
                  <div className="flex items-end gap-1 h-32">
                    {results.histogram.map((bar, i) => (
                      <div 
                        key={i}
                        className="flex-1 bg-primary/70 hover:bg-primary transition-colors rounded-t"
                        style={{ 
                          height: `${(bar.count / maxHistogramCount) * 100}%`,
                          minHeight: bar.count > 0 ? '4px' : '0'
                        }}
                        title={`${bar.bin.toFixed(1)} mm/hr: ${bar.count} samples`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{results.histogram[0]?.bin.toFixed(0)} mm/hr</span>
                    <span>{results.histogram[results.histogram.length - 1]?.bin.toFixed(0)} mm/hr</span>
                  </div>
                </Card>

                {/* Summary Stats */}
                <Card className="p-4 bg-secondary/5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Mean:</span>
                      <span className="ml-2 font-mono">{results.mean.toFixed(2)} mm/hr</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Std Dev:</span>
                      <span className="ml-2 font-mono">±{results.stdDev.toFixed(2)} mm/hr</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">90% CI:</span>
                      <span className="ml-2 font-mono">[{results.p5.toFixed(1)}, {results.p95.toFixed(1)}]</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CV:</span>
                      <span className="ml-2 font-mono">{((results.stdDev / results.mean) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Interpretation</p>
                      <p className="text-xs text-muted-foreground">
                        {results.stdDev / results.mean < 0.2 
                          ? "Low uncertainty (CV < 20%). Predictions are relatively reliable."
                          : results.stdDev / results.mean < 0.4
                          ? "Moderate uncertainty. Consider which parameters contribute most to variance."
                          : "High uncertainty (CV > 40%). Parameter uncertainty significantly affects predictions. Focus on reducing input uncertainty."}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-8 bg-muted/20 border-dashed">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No Simulation Results</p>
                  <p className="text-sm mt-2">
                    Adjust parameter distributions and click "Run Monte Carlo Simulation" to see output uncertainty.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Key Learning Point</p>
            <p className="text-sm text-muted-foreground">
              This demonstrator illustrates how input uncertainty propagates through a model to create 
              output uncertainty. By adjusting parameter standard deviations, you can see how 
              <em> reducing input uncertainty</em> (better data, more measurements) directly reduces 
              prediction uncertainty—a core principle of responsible modeling.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
