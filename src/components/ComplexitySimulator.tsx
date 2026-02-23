import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { Activity, AlertTriangle, CheckCircle2, Info, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const ComplexitySimulator = () => {
  const [subcatchments, setSubcatchments] = useState(50);
  const [calParams, setCalParams] = useState(10);
  const [dataQuality, setDataQuality] = useState(70);

  const { chartData, optimalPoint, currentReliability, zone } = useMemo(() => {
    const dataFactor = dataQuality / 100;
    const paramPenalty = calParams / 50;
    const optimalX = Math.round(15 + dataFactor * 80 - paramPenalty * 20);
    const peakReliability = 0.4 + dataFactor * 0.5 - paramPenalty * 0.1;

    const data = [];
    for (let x = 5; x <= 500; x += 5) {
      const normalized = x / optimalX;
      let reliability;
      if (normalized <= 1) {
        reliability = peakReliability * (1 - Math.exp(-3 * normalized));
      } else {
        const overfit = (normalized - 1) * 1.5;
        reliability = peakReliability * Math.exp(-overfit * overfit * 0.5);
      }
      reliability = Math.max(0.05, Math.min(0.95, reliability));
      data.push({
        subcatchments: x,
        reliability: parseFloat((reliability * 100).toFixed(1)),
        optimal: x === Math.round(optimalX / 5) * 5 ? parseFloat((peakReliability * 100).toFixed(1)) : undefined,
      });
    }

    const closest = data.reduce((prev, curr) =>
      Math.abs(curr.subcatchments - subcatchments) < Math.abs(prev.subcatchments - subcatchments) ? curr : prev
    );

    const zoneType = subcatchments < optimalX * 0.6
      ? "underfitting"
      : subcatchments <= optimalX * 1.4
      ? "optimal"
      : "overfitting";

    return {
      chartData: data,
      optimalPoint: Math.round(optimalX / 5) * 5,
      currentReliability: closest.reliability,
      zone: zoneType,
    };
  }, [subcatchments, calParams, dataQuality]);

  const zoneConfig = {
    underfitting: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Info, label: "Underfitting Zone", desc: "Model is too simple — missing important physical processes." },
    optimal: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2, label: "Optimal Zone", desc: "Complexity is well-matched to available data." },
    overfitting: { color: "text-destructive", bg: "bg-destructive/10", icon: AlertTriangle, label: "Overfitting Zone", desc: "Adding complexity is reducing reliability — parameters can't be independently constrained." },
  };

  const zoneInfo = zoneConfig[zone];
  const ZoneIcon = zoneInfo.icon;

  return (
    <TooltipProvider delayDuration={200}>
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Complexity vs. Reliability Simulator</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p>This simulator demonstrates the trade-off between model complexity and predictive reliability — a core theme of Chapter 4.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Adjust the sliders to see how model complexity, calibration parameters, and data quality affect reliability. <em>Based on Chapter 4: Optimal Complexity.</em>
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Subcatchments
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>The number of spatial units your catchment is divided into. More subcatchments = finer spatial detail but more parameters to constrain.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{subcatchments}</Badge>
          </div>
          <Slider value={[subcatchments]} onValueChange={([v]) => setSubcatchments(v)} min={5} max={500} step={5} />
          <p className="text-xs text-muted-foreground">Spatial discretization level</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Calibration Parameters
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Free parameters adjusted during calibration. Too many leads to equifinality — multiple parameter sets fitting the data equally well but for wrong reasons.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{calParams}</Badge>
          </div>
          <Slider value={[calParams]} onValueChange={([v]) => setCalParams(v)} min={3} max={50} step={1} />
          <p className="text-xs text-muted-foreground">Free parameters to optimize</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground flex items-center gap-1">
              Data Quality
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs"><p>Higher quality data (better spatial/temporal resolution, fewer gaps) supports more complex models. Poor data makes simple models more reliable.</p></TooltipContent>
              </Tooltip>
            </span>
            <Badge variant="outline">{dataQuality}%</Badge>
          </div>
          <Slider value={[dataQuality]} onValueChange={([v]) => setDataQuality(v)} min={10} max={100} step={5} />
          <p className="text-xs text-muted-foreground">Resolution & coverage of input data</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] sm:h-[350px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="reliabilityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200 90% 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(200 90% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="subcatchments" label={{ value: "Subcatchments", position: "insideBottom", offset: -3, style: { fontSize: 12 } }} tick={{ fontSize: 11 }} />
            <YAxis label={{ value: "Reliability (%)", angle: -90, position: "insideLeft", style: { fontSize: 12 } }} tick={{ fontSize: 11 }} domain={[0, 100]} />
            <RechartsTooltip formatter={(value: number) => [`${value}%`, "Reliability"]} labelFormatter={(v) => `${v} subcatchments`} />
            <Area type="monotone" dataKey="reliability" stroke="hsl(200 90% 45%)" fill="url(#reliabilityGradient)" strokeWidth={2.5} dot={false} />
            <ReferenceLine x={optimalPoint} stroke="hsl(142 70% 45%)" strokeDasharray="5 5" label={{ value: `Optimal: ${optimalPoint}`, position: "top", style: { fontSize: 11, fill: "hsl(142 70% 45%)" } }} />
            <ReferenceLine x={subcatchments} stroke="hsl(0 84% 60%)" strokeWidth={2} label={{ value: `You: ${subcatchments}`, position: "top", style: { fontSize: 11, fill: "hsl(0 84% 60%)" } }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status */}
      <div className={`flex items-start gap-3 p-4 rounded-lg ${zoneInfo.bg}`}>
        <ZoneIcon className={`w-5 h-5 mt-0.5 shrink-0 ${zoneInfo.color}`} />
        <div>
          <p className={`font-semibold text-sm ${zoneInfo.color}`}>
            {zoneInfo.label} — Reliability: {currentReliability}%
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1.5 align-text-top" /></TooltipTrigger>
              <TooltipContent className="max-w-xs"><p>Reliability reflects how well the model is expected to perform on unseen data — not just how well it fits calibration data.</p></TooltipContent>
            </Tooltip>
          </p>
          <p className="text-sm text-muted-foreground mt-1">{zoneInfo.desc}</p>
          {zone === "overfitting" && (
            <p className="text-sm text-muted-foreground mt-2">
              💡 Try reducing subcatchments to ~{optimalPoint} or improving data quality to support current complexity.
            </p>
          )}
        </div>
      </div>
    </Card>
    </TooltipProvider>
  );
};
