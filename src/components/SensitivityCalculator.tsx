import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Parameter {
  name: string;
  baseValue: number;
  min: number;
  max: number;
  unit: string;
  sensitivity: "high" | "medium" | "low";
  description: string;
}

const parameters: Parameter[] = [
  {
    name: "Imperviousness",
    baseValue: 50,
    min: 0,
    max: 100,
    unit: "%",
    sensitivity: "high",
    description: "Percent of watershed area that is impervious"
  },
  {
    name: "Manning's n (Conduit)",
    baseValue: 0.015,
    min: 0.01,
    max: 0.03,
    unit: "",
    sensitivity: "medium",
    description: "Roughness coefficient for pipe flow"
  },
  {
    name: "Depression Storage",
    baseValue: 2.5,
    min: 0.5,
    max: 5.0,
    unit: "mm",
    sensitivity: "medium",
    description: "Initial abstraction before runoff begins"
  },
  {
    name: "Subcatchment Width",
    baseValue: 500,
    min: 100,
    max: 1000,
    unit: "m",
    sensitivity: "low",
    description: "Representative width for overland flow"
  },
  {
    name: "Infiltration Rate",
    baseValue: 25,
    min: 5,
    max: 75,
    unit: "mm/hr",
    sensitivity: "high",
    description: "Maximum rate water infiltrates into soil"
  }
];

// Simplified runoff model for demonstration
const calculateRunoff = (params: Record<string, number>, rainfall: number = 50): number => {
  const imperviousness = params["Imperviousness"] / 100;
  const depressionStorage = params["Depression Storage"];
  const infiltrationRate = params["Infiltration Rate"];
  const manningsN = params["Manning's n (Conduit)"];
  const width = params["Subcatchment Width"];
  
  // Effective rainfall after initial abstraction
  const effectiveRainfall = Math.max(0, rainfall - depressionStorage);
  
  // Runoff from impervious and pervious areas
  const imperviousRunoff = effectiveRainfall * imperviousness;
  const perviousRunoff = Math.max(0, effectiveRainfall - infiltrationRate * 0.5) * (1 - imperviousness);
  
  // Flow velocity factor (inverse of Manning's n, scaled by width)
  const velocityFactor = (0.02 / manningsN) * (width / 500);
  
  // Total runoff coefficient
  const runoff = (imperviousRunoff + perviousRunoff) * velocityFactor;
  
  return Math.max(0, Math.min(100, runoff));
};

export const SensitivityCalculator = () => {
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    Object.fromEntries(parameters.map(p => [p.name, p.baseValue]))
  );
  const [showAnalysis, setShowAnalysis] = useState(false);

  const baseRunoff = useMemo(() => {
    const baseParams = Object.fromEntries(parameters.map(p => [p.name, p.baseValue]));
    return calculateRunoff(baseParams);
  }, []);

  const currentRunoff = useMemo(() => calculateRunoff(paramValues), [paramValues]);

  const sensitivityResults = useMemo(() => {
    const results: { name: string; change: number; sensitivity: string }[] = [];
    
    parameters.forEach(param => {
      // Calculate output with parameter at min and max
      const minParams = { ...Object.fromEntries(parameters.map(p => [p.name, p.baseValue])), [param.name]: param.min };
      const maxParams = { ...Object.fromEntries(parameters.map(p => [p.name, p.baseValue])), [param.name]: param.max };
      
      const minRunoff = calculateRunoff(minParams);
      const maxRunoff = calculateRunoff(maxParams);
      
      const change = Math.abs(maxRunoff - minRunoff);
      results.push({ name: param.name, change, sensitivity: param.sensitivity });
    });
    
    return results.sort((a, b) => b.change - a.change);
  }, []);

  const handleReset = () => {
    setParamValues(Object.fromEntries(parameters.map(p => [p.name, p.baseValue])));
  };

  const percentChange = ((currentRunoff - baseRunoff) / baseRunoff) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Interactive Sensitivity Demonstrator</h3>
            <p className="text-sm text-muted-foreground">
              Adjust parameters to see how they affect model output (runoff coefficient)
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Parameter Sliders */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">Model Parameters</h4>
            {parameters.map((param) => (
              <div key={param.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{param.name}</span>
                    <Badge 
                      variant={param.sensitivity === "high" ? "destructive" : param.sensitivity === "medium" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {param.sensitivity}
                    </Badge>
                  </div>
                  <span className="text-sm font-mono text-primary">
                    {param.name === "Manning's n (Conduit)" 
                      ? paramValues[param.name].toFixed(3)
                      : paramValues[param.name].toFixed(1)
                    } {param.unit}
                  </span>
                </div>
                <Slider
                  value={[paramValues[param.name]]}
                  min={param.min}
                  max={param.max}
                  step={param.name === "Manning's n (Conduit)" ? 0.001 : 0.5}
                  onValueChange={(value) => 
                    setParamValues(prev => ({ ...prev, [param.name]: value[0] }))
                  }
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">{param.description}</p>
              </div>
            ))}
          </div>

          {/* Output Display */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">Model Output</h4>
            
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Runoff Coefficient</p>
                <div className="text-5xl font-bold text-primary mb-2">
                  {currentRunoff.toFixed(1)}%
                </div>
                <div className={`flex items-center justify-center gap-2 text-sm ${
                  percentChange > 0 ? "text-red-500" : percentChange < 0 ? "text-green-500" : "text-muted-foreground"
                }`}>
                  {percentChange !== 0 && <TrendingUp className="w-4 h-4" />}
                  <span>
                    {percentChange > 0 ? "+" : ""}{percentChange.toFixed(1)}% from baseline
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-secondary/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Interpretation</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.abs(percentChange) < 5 
                      ? "Current parameter values produce results close to baseline. The model is relatively stable."
                      : Math.abs(percentChange) < 20
                      ? "Moderate sensitivity detected. Consider uncertainty ranges for these parameters in your analysis."
                      : "High sensitivity detected! These parameter changes significantly impact output. Prioritize accurate measurement."}
                  </p>
                </div>
              </div>
            </Card>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? "Hide" : "Show"} Sensitivity Ranking
            </Button>

            {showAnalysis && (
              <Card className="p-4">
                <h5 className="font-semibold text-foreground mb-3">Parameter Sensitivity Ranking</h5>
                <div className="space-y-2">
                  {sensitivityResults.map((result, index) => (
                    <div key={result.name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{result.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Δ {result.change.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              result.sensitivity === "high" ? "bg-red-500" : 
                              result.sensitivity === "medium" ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(100, result.change * 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Key Learning Point</p>
            <p className="text-sm text-muted-foreground">
              This demonstrator illustrates Dr. James's principle that sensitivity analysis should 
              <em> precede</em> calibration. By understanding which parameters most strongly influence 
              outputs, you can focus limited resources on accurate measurement of critical parameters 
              and accept reasonable defaults for less influential ones.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
