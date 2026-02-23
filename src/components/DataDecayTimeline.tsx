import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { HelpCircle, AlertTriangle, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const dataTypes = [
  {
    name: "Topographic Data",
    icon: "🗺️",
    decayRate: 4, // % reliability lost per year
    reason: "Development adds 2-5% impervious area per decade in growing areas",
    warning10: "Major subdivisions may be missing",
    warning20: "Entire neighborhoods may be missing",
    chapter: 3,
  },
  {
    name: "Land Use Data",
    icon: "🏘️",
    decayRate: 7,
    reason: "Zoning changes, infill, redevelopment occur continuously",
    warning10: "Unreliable for calibration in developing areas",
    warning20: "May bear little resemblance to current conditions",
    chapter: 3,
  },
  {
    name: "Pipe Diameter Data",
    icon: "🔧",
    decayRate: 1.5,
    reason: "Pipes don't change but corrosion, sediment, roots reduce effective diameter",
    warning10: "Effective roughness may have increased 20%+",
    warning20: "Effective diameter may be reduced 10-15%",
    chapter: 3,
  },
  {
    name: "Rainfall Records",
    icon: "🌧️",
    decayRate: 0.5,
    reason: "Historical data stays valid but climate change shifts statistics",
    warning10: "IDF curves may underestimate current storms by 5-10%",
    warning20: "IDF curves may underestimate by 10-20%",
    chapter: 6,
  },
  {
    name: "Soil / Infiltration Data",
    icon: "🌱",
    decayRate: 3,
    reason: "Compaction, development, and land use changes alter infiltration rates",
    warning10: "Field conditions may differ significantly from mapped soils",
    warning20: "Soil maps may be unreliable for disturbed areas",
    chapter: 3,
  },
];

export const DataDecayTimeline = () => {
  const [dataAge, setDataAge] = useState(10);

  const getReliability = (decayRate: number) => {
    return Math.max(5, Math.round(100 - decayRate * dataAge));
  };

  const getColor = (reliability: number) => {
    if (reliability >= 80) return "text-emerald-500";
    if (reliability >= 60) return "text-amber-500";
    if (reliability >= 40) return "text-orange-500";
    return "text-destructive";
  };

  const getBgColor = (reliability: number) => {
    if (reliability >= 80) return "bg-emerald-500";
    if (reliability >= 60) return "bg-amber-500";
    if (reliability >= 40) return "bg-orange-500";
    return "bg-destructive";
  };

  const getLabel = (reliability: number) => {
    if (reliability >= 80) return "Good";
    if (reliability >= 60) return "Acceptable";
    if (reliability >= 40) return "Questionable";
    return "Outdated";
  };

  const currentYear = 2024;
  const dataYear = currentYear - dataAge;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Data Decay Timeline</h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Shows how data reliability degrades over time at different rates for different data types. Based on Chapter 3: Reliability of Input Data.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-muted-foreground mb-6 text-sm">
          How old is too old? Drag the slider to see how data freshness affects reliability.
        </p>

        {/* Year slider */}
        <div className="mb-8 max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Data Vintage</span>
            <Badge variant="outline">{dataYear} ({dataAge} years old)</Badge>
          </div>
          <Slider value={[dataAge]} onValueChange={([v]) => setDataAge(v)} min={0} max={30} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current ({currentYear})</span>
            <span>30 years old ({currentYear - 30})</span>
          </div>
        </div>

        {/* Data type bars */}
        <div className="space-y-4">
          {dataTypes.map((dt) => {
            const reliability = getReliability(dt.decayRate);
            const warning = dataAge >= 20 ? dt.warning20 : dataAge >= 10 ? dt.warning10 : null;

            return (
              <div key={dt.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <span>{dt.icon}</span>
                    {dt.name}
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent className="max-w-xs"><p>{dt.reason}</p></TooltipContent>
                    </Tooltip>
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={reliability >= 60 ? "outline" : "destructive"} className="text-xs">
                      {getLabel(reliability)}
                    </Badge>
                    <span className={`font-bold text-sm ${getColor(reliability)}`}>{reliability}%</span>
                  </div>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${getBgColor(reliability)}`}
                    style={{ width: `${reliability}%`, opacity: 0.8 }}
                  />
                </div>
                {warning && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-fade-in">
                    <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{warning}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {dataAge >= 10 && (
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 animate-fade-in">
            <p className="text-sm text-foreground font-semibold">
              ⚠ Data is {dataAge} years old
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              James Rule 3: "Data age and relevance must be explicitly evaluated against the model's decision timeframe." Consider verifying against current aerial imagery before proceeding.
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button variant="outline" size="sm" asChild><a href="/chapter/3">Ch. 3: Input Reliability</a></Button>
          <Button variant="outline" size="sm" asChild><a href="/chapter/6">Ch. 6: Rain Input</a></Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};
