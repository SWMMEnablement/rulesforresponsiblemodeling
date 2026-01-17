import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Droplets, Sun, TreeDeciduous, Mountain, ArrowDown, ArrowRight, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WaterBalanceCalculatorProps {
  className?: string;
}

export const WaterBalanceCalculator = ({ className = "" }: WaterBalanceCalculatorProps) => {
  // Input parameters
  const [annualPrecipitation, setAnnualPrecipitation] = useState(1000); // mm/year
  const [imperviousness, setImperviousness] = useState(30); // %
  const [vegetationCover, setVegetationCover] = useState(50); // %
  const [soilInfiltrationRate, setSoilInfiltrationRate] = useState(25); // mm/hr
  const [averageTemperature, setAverageTemperature] = useState(15); // °C

  // Calculate water balance components
  const results = useMemo(() => {
    const P = annualPrecipitation;
    const imp = imperviousness / 100;
    const veg = vegetationCover / 100;
    const infRate = soilInfiltrationRate;
    const temp = averageTemperature;

    // Evapotranspiration estimation (simplified Thornthwaite-based)
    // Higher temperature and vegetation increase ET
    const potentialET = Math.min(P * 0.8, 50 + temp * 30 + veg * 200);
    const actualET = potentialET * (1 - imp * 0.7) * (0.5 + veg * 0.5);

    // Infiltration/Groundwater recharge
    // Higher soil rate and lower imperviousness increase infiltration
    const availableForInfiltration = P - actualET;
    const infiltrationCapacity = (infRate / 50) * (1 - imp);
    const infiltration = Math.max(0, availableForInfiltration * infiltrationCapacity * 0.6);

    // Surface runoff
    // Remaining water after ET and infiltration
    const surfaceRunoff = Math.max(0, P - actualET - infiltration);

    // Direct runoff from impervious surfaces
    const imperviousRunoff = P * imp * 0.9;
    
    // Pervious area runoff
    const perviousRunoff = Math.max(0, surfaceRunoff - imperviousRunoff);

    // Total runoff
    const totalRunoff = imperviousRunoff + perviousRunoff;

    // Groundwater contribution to baseflow (portion of infiltration)
    const baseflow = infiltration * 0.4;

    // Deep percolation
    const deepPercolation = infiltration * 0.6;

    // Check water balance closure
    const closure = P - actualET - totalRunoff - infiltration;

    return {
      precipitation: P,
      evapotranspiration: Math.round(actualET),
      infiltration: Math.round(infiltration),
      surfaceRunoff: Math.round(totalRunoff),
      baseflow: Math.round(baseflow),
      deepPercolation: Math.round(deepPercolation),
      runoffCoefficient: (totalRunoff / P * 100).toFixed(1),
      etFraction: (actualET / P * 100).toFixed(1),
      rechargeFraction: (infiltration / P * 100).toFixed(1),
      closure: Math.abs(closure) < 1 ? "Balanced" : `${closure.toFixed(0)} mm gap`
    };
  }, [annualPrecipitation, imperviousness, vegetationCover, soilInfiltrationRate, averageTemperature]);

  const ParameterSlider = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    unit,
    tooltip,
    icon: Icon
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void; 
    min: number; 
    max: number; 
    step: number;
    unit: string;
    tooltip: string;
    icon: React.ElementType;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Badge variant="secondary" className="font-mono">
          {value} {unit}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
      />
    </div>
  );

  const ResultBox = ({ 
    label, 
    value, 
    unit, 
    percentage,
    color,
    icon: Icon
  }: { 
    label: string; 
    value: number; 
    unit: string;
    percentage: string;
    color: string;
    icon: React.ElementType;
  }) => (
    <div className={`p-4 rounded-lg border-l-4 ${color} bg-card`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {percentage}% of precipitation
      </div>
    </div>
  );

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          Interactive Water Balance Calculator
        </h3>
        <p className="text-sm text-muted-foreground">
          Explore how catchment characteristics affect annual water balance partitioning. 
          Adjust parameters to see real-time changes in runoff, evapotranspiration, and groundwater recharge.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          <h4 className="font-semibold text-foreground border-b pb-2">Catchment Parameters</h4>
          
          <ParameterSlider
            label="Annual Precipitation"
            value={annualPrecipitation}
            onChange={setAnnualPrecipitation}
            min={400}
            max={2000}
            step={50}
            unit="mm/yr"
            tooltip="Total annual rainfall depth. Higher precipitation increases all water balance components."
            icon={Droplets}
          />

          <ParameterSlider
            label="Imperviousness"
            value={imperviousness}
            onChange={setImperviousness}
            min={0}
            max={90}
            step={5}
            unit="%"
            tooltip="Percentage of impervious surfaces (roads, roofs). Increases surface runoff, decreases infiltration and ET."
            icon={Mountain}
          />

          <ParameterSlider
            label="Vegetation Cover"
            value={vegetationCover}
            onChange={setVegetationCover}
            min={0}
            max={100}
            step={5}
            unit="%"
            tooltip="Percentage of vegetated area. Higher vegetation increases evapotranspiration through plant uptake."
            icon={TreeDeciduous}
          />

          <ParameterSlider
            label="Soil Infiltration Rate"
            value={soilInfiltrationRate}
            onChange={setSoilInfiltrationRate}
            min={5}
            max={100}
            step={5}
            unit="mm/hr"
            tooltip="Saturated hydraulic conductivity. Sandy soils: 50-100 mm/hr, Clay soils: 5-15 mm/hr."
            icon={ArrowDown}
          />

          <ParameterSlider
            label="Average Temperature"
            value={averageTemperature}
            onChange={setAverageTemperature}
            min={0}
            max={30}
            step={1}
            unit="°C"
            tooltip="Mean annual temperature. Higher temperatures increase potential evapotranspiration."
            icon={Sun}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h4 className="font-semibold text-foreground border-b pb-2">Annual Water Balance</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <ResultBox
              label="Surface Runoff"
              value={results.surfaceRunoff}
              unit="mm/yr"
              percentage={results.runoffCoefficient}
              color="border-l-blue-500"
              icon={ArrowRight}
            />
            <ResultBox
              label="Evapotranspiration"
              value={results.evapotranspiration}
              unit="mm/yr"
              percentage={results.etFraction}
              color="border-l-orange-500"
              icon={Sun}
            />
            <ResultBox
              label="Groundwater Recharge"
              value={results.infiltration}
              unit="mm/yr"
              percentage={results.rechargeFraction}
              color="border-l-green-500"
              icon={ArrowDown}
            />
            <ResultBox
              label="Baseflow"
              value={results.baseflow}
              unit="mm/yr"
              percentage={(results.baseflow / results.precipitation * 100).toFixed(1)}
              color="border-l-cyan-500"
              icon={Droplets}
            />
          </div>

          {/* Visual Balance Bar */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Water Balance Partitioning</span>
              <Badge variant="outline" className="text-xs">
                P = {results.precipitation} mm/yr
              </Badge>
            </div>
            <div className="h-8 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${results.runoffCoefficient}%` }}
                title={`Runoff: ${results.runoffCoefficient}%`}
              >
                {parseFloat(results.runoffCoefficient) > 15 && "Q"}
              </div>
              <div 
                className="bg-orange-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${results.etFraction}%` }}
                title={`ET: ${results.etFraction}%`}
              >
                {parseFloat(results.etFraction) > 15 && "ET"}
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ width: `${results.rechargeFraction}%` }}
                title={`Recharge: ${results.rechargeFraction}%`}
              >
                {parseFloat(results.rechargeFraction) > 15 && "GW"}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                Runoff (Q)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-orange-500 rounded-sm"></span>
                Evapotranspiration (ET)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                Recharge (GW)
              </span>
            </div>
          </div>

          {/* Interpretation */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h5 className="text-sm font-semibold mb-2">Interpretation</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {imperviousness > 50 
                ? "High imperviousness significantly increases surface runoff and reduces groundwater recharge. Consider LID practices to restore pre-development hydrology."
                : imperviousness > 25
                ? "Moderate urbanization. Surface runoff is elevated compared to natural conditions. Infiltration practices can help maintain baseflows."
                : "Low imperviousness maintains natural water balance partitioning with healthy groundwater recharge and baseflow contributions."
              }
              {vegetationCover < 30 && " Low vegetation cover reduces ET and may increase runoff and erosion risk."}
              {parseFloat(results.rechargeFraction) < 10 && " Groundwater recharge is critically low, which may impact long-term stream baseflows."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg text-xs text-muted-foreground">
        <strong>Note:</strong> This simplified calculator demonstrates water balance concepts. 
        Actual modeling requires detailed input data, process-based equations, and validation against observations.
        The water balance equation: P = ET + Q + ΔS (where ΔS ≈ GW recharge over long periods).
      </div>
    </Card>
  );
};
