import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

type Relevance = "primary" | "secondary" | null;

interface ChapterActivity {
  chapter: number;
  title: string;
  activities: Record<string, Relevance>;
  summary: string;
}

const ACTIVITIES = [
  { key: "scoping", label: "Scoping", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { key: "data", label: "Data", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { key: "build", label: "Build", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { key: "calibrate", label: "Calibrate", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { key: "validate", label: "Validate", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { key: "report", label: "Report", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
];

const CHAPTERS: ChapterActivity[] = [
  { chapter: 1, title: "Introduction", activities: { scoping: "primary", data: null, build: null, calibrate: null, validate: null, report: "secondary" }, summary: "Defines modeling purpose and sets the philosophical foundation for responsible practice." },
  { chapter: 2, title: "Modeling Objectives", activities: { scoping: "primary", data: "secondary", build: null, calibrate: null, validate: null, report: "secondary" }, summary: "How to define clear, measurable objectives that drive every subsequent modeling decision." },
  { chapter: 3, title: "Model Selection", activities: { scoping: "primary", data: "secondary", build: "primary", calibrate: null, validate: null, report: null }, summary: "Choosing the right model complexity and software for your specific problem." },
  { chapter: 4, title: "Optimal Complexity", activities: { scoping: "primary", data: "secondary", build: "primary", calibrate: "secondary", validate: null, report: null }, summary: "The critical balance between model complexity and data availability — James's central thesis." },
  { chapter: 5, title: "Data Requirements", activities: { scoping: "secondary", data: "primary", build: "secondary", calibrate: "secondary", validate: "secondary", report: null }, summary: "What data you need, data quality assessment, and the 'garbage in, gospel out' problem." },
  { chapter: 6, title: "Spatial Representation", activities: { scoping: null, data: "primary", build: "primary", calibrate: null, validate: null, report: null }, summary: "Subcatchment delineation, discretization effects, and spatial resolution decisions." },
  { chapter: 7, title: "Temporal Representation", activities: { scoping: null, data: "primary", build: "primary", calibrate: null, validate: null, report: null }, summary: "Time step selection, continuous vs event simulation, and temporal resolution effects." },
  { chapter: 8, title: "Parameter Estimation", activities: { scoping: null, data: "secondary", build: "primary", calibrate: "primary", validate: null, report: null }, summary: "Initial parameter values from physical characteristics and literature guidance." },
  { chapter: 9, title: "Calibration", activities: { scoping: null, data: "secondary", build: null, calibrate: "primary", validate: "secondary", report: "secondary" }, summary: "Objective functions, sensitive parameters, and systematic calibration approaches." },
  { chapter: 10, title: "Sensitivity Analysis", activities: { scoping: null, data: null, build: "secondary", calibrate: "primary", validate: "secondary", report: "primary" }, summary: "Identifying which parameters matter most and quantifying model response." },
  { chapter: 11, title: "Uncertainty Analysis", activities: { scoping: null, data: "secondary", build: null, calibrate: "secondary", validate: "primary", report: "primary" }, summary: "Sources of uncertainty, propagation methods, and communicating confidence bounds." },
  { chapter: 12, title: "Validation", activities: { scoping: null, data: "secondary", build: null, calibrate: null, validate: "primary", report: "primary" }, summary: "Independent testing with withheld data to confirm model reliability." },
  { chapter: 13, title: "Documentation", activities: { scoping: "secondary", data: null, build: null, calibrate: null, validate: null, report: "primary" }, summary: "What to document, assumptions log, and creating reproducible modeling records." },
  { chapter: 14, title: "Automatic Calibration", activities: { scoping: null, data: null, build: null, calibrate: "primary", validate: "secondary", report: null }, summary: "Optimization algorithms, multi-objective calibration, and when automation helps or hurts." },
  { chapter: 15, title: "Urban Drainage", activities: { scoping: "secondary", data: "secondary", build: "primary", calibrate: "secondary", validate: "secondary", report: null }, summary: "Application to urban stormwater and drainage systems with SWMM5/ICM examples." },
  { chapter: 16, title: "Water Quality", activities: { scoping: "secondary", data: "primary", build: "primary", calibrate: "secondary", validate: "secondary", report: "secondary" }, summary: "Water quality modeling considerations, additional complexity, and data challenges." },
  { chapter: 17, title: "The 10 Rules", activities: { scoping: "primary", data: "primary", build: "primary", calibrate: "primary", validate: "primary", report: "primary" }, summary: "James's definitive 10 rules for responsible modeling — the synthesis of the entire book." },
];

export const CrossReferenceMatrix = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const filteredChapters = selectedActivity
    ? CHAPTERS.filter((ch) => ch.activities[selectedActivity])
    : CHAPTERS;

  const getActivityCount = (activityKey: string, relevance: Relevance) =>
    CHAPTERS.filter((ch) => ch.activities[activityKey] === relevance).length;

  return (
    <div className="space-y-8">
      {/* Activity Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedActivity === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedActivity(null)}
        >
          All Activities
        </Button>
        {ACTIVITIES.map((a) => (
          <Button
            key={a.key}
            variant={selectedActivity === a.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedActivity(selectedActivity === a.key ? null : a.key)}
            className="gap-1.5"
          >
            {a.label}
            <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
              {getActivityCount(a.key, "primary")}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" /> Primary relevance
        </span>
        <span className="flex items-center gap-1.5">
          <Circle className="w-4 h-4 text-muted-foreground" /> Secondary relevance
        </span>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 font-semibold text-foreground border-b border-border min-w-[200px]">
                Chapter
              </th>
              {ACTIVITIES.map((a) => (
                <th
                  key={a.key}
                  className={`p-3 text-center font-semibold border-b border-border min-w-[90px] cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedActivity === a.key ? "bg-accent/30" : ""
                  }`}
                  onClick={() => setSelectedActivity(selectedActivity === a.key ? null : a.key)}
                >
                  <span className="text-foreground text-sm">{a.label}</span>
                </th>
              ))}
              <th className="p-3 text-center border-b border-border min-w-[60px]" />
            </tr>
          </thead>
          <tbody>
            {filteredChapters.map((ch) => (
              <Tooltip key={ch.chapter}>
                <TooltipTrigger asChild>
                  <tr
                    className={`group cursor-pointer transition-colors hover:bg-accent/20 ${
                      selectedChapter === ch.chapter ? "bg-accent/30" : ""
                    }`}
                    onClick={() => setSelectedChapter(selectedChapter === ch.chapter ? null : ch.chapter)}
                  >
                    <td className="p-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-6">
                          {ch.chapter}
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {ch.title}
                        </span>
                      </div>
                    </td>
                    {ACTIVITIES.map((a) => (
                      <td
                        key={a.key}
                        className={`p-3 text-center border-b border-border ${
                          selectedActivity === a.key ? "bg-accent/10" : ""
                        }`}
                      >
                        {ch.activities[a.key] === "primary" && (
                          <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                        )}
                        {ch.activities[a.key] === "secondary" && (
                          <Circle className="w-4 h-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                    <td className="p-3 border-b border-border text-center">
                      <Link to={`/chapter/${ch.chapter}`} onClick={(e) => e.stopPropagation()}>
                        <ArrowRight className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors mx-auto" />
                      </Link>
                    </td>
                  </tr>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">{ch.summary}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Chapter Detail */}
      {selectedChapter && (
        <Card className="p-6 border-primary/30">
          {(() => {
            const ch = CHAPTERS.find((c) => c.chapter === selectedChapter)!;
            const relevant = ACTIVITIES.filter((a) => ch.activities[a.key]);
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    Chapter {ch.chapter}: {ch.title}
                  </h3>
                  <Link to={`/chapter/${ch.chapter}`}>
                    <Button size="sm" className="gap-1.5">
                      Read Chapter <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">{ch.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {relevant.map((a) => (
                    <Badge
                      key={a.key}
                      variant="outline"
                      className={a.color}
                    >
                      {a.label} — {ch.activities[a.key]}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Activity Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACTIVITIES.map((a) => {
          const primary = getActivityCount(a.key, "primary");
          const secondary = getActivityCount(a.key, "secondary");
          return (
            <Card
              key={a.key}
              className={`p-4 text-center cursor-pointer transition-all hover:shadow-md ${
                selectedActivity === a.key ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedActivity(selectedActivity === a.key ? null : a.key)}
            >
              <div className="text-2xl font-bold text-foreground">{primary}</div>
              <div className="text-xs text-muted-foreground mt-1">primary chapters</div>
              <div className="text-sm font-medium text-foreground mt-2">{a.label}</div>
              <div className="text-xs text-muted-foreground">{secondary} supporting</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
