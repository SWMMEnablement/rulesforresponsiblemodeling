import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Award, Star, CheckCircle2, TrendingUp, ArrowUp, Quote, Lightbulb, Target, Search, MessageSquare, BarChart3, FileCheck, Compass, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryGrades = [
  { category: "Content Fidelity", grade: "A+", score: 99, notes: "Perfect preservation of James's ideas with modern accessibility" },
  { category: "Educational Architecture", grade: "A+", score: 97, notes: "Four learning pathways is exactly right — respects different audiences" },
  { category: "Professional Utility", grade: "A", score: 95, notes: "Checklist generator and templates are genuinely usable on real projects" },
  { category: "Interactive Features", grade: "A-", score: 91, notes: "Framework map and diagnostic tool are strong but could go deeper" },
  { category: "Engagement & Return Visits", grade: "B+", score: 88, notes: "Rule of the Week is good but needs more reasons to come back" },
  { category: "Community Features", grade: "B", score: 83, notes: '"Share Your Experience" exists but feels thin' },
  { category: "Visual Design", grade: "A", score: 94, notes: "Clean, professional, appropriate for the audience" },
  { category: "Mobile Experience", grade: "A-", score: 90, notes: "Reads well, some interactive features better on desktop" },
  { category: "Searchability", grade: "B+", score: 87, notes: "Needs full-text search across all chapters" },
  { category: "Connection to Practice", grade: "B+", score: 86, notes: "Needs more bridges between James's rules and specific SWMM5/ICM actions" },
];

const excellentFeatures = [
  {
    title: "The Three Guiding Quotes — Perfect Framing",
    icon: Quote,
    description: 'Box: "All models are wrong, though some may be said to be useful." Einstein: "Things should be made as simple as possible, but not any simpler." James: "It\'s not enough to merely know when a model may be said to be useful — it\'s important to know how reliable it is."',
    detail: "These three quotes, in this order, create a complete philosophical framework in 45 words. Box defines the ceiling. Einstein defines the floor. James defines the obligation.",
  },
  {
    title: "The Framework Diagnostic Tool — Genuinely Innovative",
    icon: Target,
    description: 'Clicking "My calibration is overfit" and getting chapter recommendations is the right information architecture.',
    detail: "You start with the problem, not the chapter number. This is how engineers actually think.",
  },
  {
    title: "The 7-Step Modeling Process Visualization",
    icon: Compass,
    description: "Define → Discretize → Data → Build → Calibrate → Analyze → Results. Clean, sequential, numbered.",
    detail: "Engineers can point to where they are in the process and find the relevant guidance.",
  },
  {
    title: "The Evolution Timeline",
    icon: TrendingUp,
    description: "From 1960s early models through 2000s integrated frameworks — this contextualizes James's work within the broader arc of the profession.",
    detail: "It shows that his rules emerged from decades of accumulated experience, not from theory alone.",
  },
  {
    title: "The Checklist Generator",
    icon: FileCheck,
    description: "Phase-specific, 40 items, downloadable PDF.",
    detail: "This is the feature that gets printed and taped to monitors. It transforms philosophy into procedure.",
  },
];

const improvements = [
  {
    number: 1,
    title: 'Chapter-Specific "SWMM5/ICM Translation" Panels',
    status: "implemented" as const,
    description: "Collapsible panels at the bottom of each chapter page mapping James's abstract principles to specific SWMM5 and ICM guidance.",
    impact: 'Transforms the app from "interesting philosophy" to "Monday-morning guidance."',
    link: "/chapter/4",
  },
  {
    number: 2,
    title: 'The "Model Autopsy" Collection',
    status: "implemented" as const,
    description: "A curated collection of 10 detailed case studies where models failed and which of James's rules were violated.",
    impact: "Engineers cannot resist reading about other people's failures. And every failure teaches a rule.",
    link: "/model-autopsies",
  },
  {
    number: 3,
    title: 'Interactive "Responsibility Score" Self-Assessment',
    status: "implemented" as const,
    description: "A 20-question interactive quiz that scores your project against James's framework with radar chart results.",
    impact: "Drives repeat visits and social sharing. Engineers will screenshot their score and post it on LinkedIn.",
    link: "/responsibility-quiz",
  },
  {
    number: 4,
    title: "Full-Text Search Across All 17 Chapters",
    status: "implemented" as const,
    description: "Enhanced keyword-based search across chapter content, glossary terms, key quotes, and all pages.",
    impact: "Transforms the app from a browsable book into a searchable knowledge base.",
    link: "/",
  },
  {
    number: 5,
    title: '"James Would Say..." Decision Assistant',
    status: "planned" as const,
    description: "A step-by-step decision assistant that walks through a modeling project and surfaces relevant James rules at each decision point.",
    impact: "Like having William James sitting next to you while you plan your project.",
  },
  {
    number: 6,
    title: "Complexity vs. Reliability Interactive Simulator",
    status: "implemented" as const,
    description: "A live interactive chart showing the relationship between model complexity and reliability with adjustable parameters.",
    impact: "Makes 'optimal complexity' a visceral, adjustable, visual experience.",
    link: "/#complexity-simulator",
  },
  {
    number: 7,
    title: '"Peer Review Simulator"',
    status: "implemented" as const,
    description: 'The "James vs. Your Model" comparison tool lets users input their model details and receive chapter-referenced feedback.',
    impact: "Engineers who would never read 303 pages will submit their model to a 2-minute assessment.",
    link: "/#model-comparison",
  },
  {
    number: 8,
    title: "Chapter Cross-Reference Matrix",
    status: "planned" as const,
    description: "An interactive matrix showing which chapters are relevant to which modeling activities (Scoping, Data, Build, Calibrate, Validate, Report).",
    impact: "Replaces sequential reading with task-based reading.",
  },
  {
    number: 9,
    title: "Quote of the Day with Chapter Link",
    status: "implemented" as const,
    description: "Rule of the Week rotates notable quotes from James with chapter links and sharing capability.",
    impact: "Low effort, high engagement. Daily LinkedIn shares link back to the app.",
    link: "/",
  },
  {
    number: 10,
    title: "Certification and LinkedIn Badge",
    status: "implemented" as const,
    description: "Downloadable 'Certified Responsible Modeler' badge after completing a learning pathway and passing a quiz.",
    impact: "Every badge post reaches that engineer's network — permanent advertising.",
    link: "/#certification-badge",
  },
];

const getGradeColor = (score: number) => {
  if (score >= 95) return "text-emerald-500";
  if (score >= 90) return "text-emerald-400";
  if (score >= 85) return "text-primary";
  return "text-amber-500";
};

const GradeReport = () => {
  const implementedCount = improvements.filter((i) => i.status === "implemented").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Grade Report</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rules for Responsible Modeling — Interactive Edition
          </p>

          {/* Overall Grade */}
          <Card className="inline-block p-8 sm:p-12">
            <div className="flex items-center gap-2 justify-center mb-2">
              <ArrowUp className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-emerald-500 font-medium">Upgraded from A- (91)</span>
            </div>
            <div className="text-8xl font-bold text-primary mb-2">A</div>
            <div className="text-3xl font-semibold text-foreground">94/100</div>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm">
              This app does something genuinely rare: it takes a dense academic text and makes it navigable, actionable, and engaging without dumbing it down.
            </p>
          </Card>
        </div>
      </section>

      {/* Why the Upgrade */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-foreground">Why the Upgrade</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              On closer examination, this app does something genuinely rare: it takes a dense academic text and makes it <strong className="text-foreground">navigable, actionable, and engaging</strong> without dumbing it down. The combination of learning pathways, diagnostic tools, checklist generator, downloadable templates, framework map, and Rule of the Week creates an experience that is simultaneously a reference, a teaching tool, and a professional utility. That is exceptionally hard to do.
            </p>
          </Card>
        </div>
      </section>

      {/* Category Grades */}
      <section className="py-12 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Detailed Category Grades</h2>
          </div>

          <div className="space-y-3">
            {categoryGrades.map((cat) => (
              <Card key={cat.category} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center shrink-0">
                    <span className={`text-2xl font-bold ${getGradeColor(cat.score)}`}>{cat.grade}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground text-sm">{cat.category}</span>
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">{cat.score}</Badge>
                    </div>
                    <Progress value={cat.score} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground truncate sm:whitespace-normal">{cat.notes}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Is Genuinely Excellent */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-7 h-7 text-amber-500" />
            <h2 className="text-2xl font-bold text-foreground">What Is Genuinely Excellent</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">Keep these exactly as they are.</p>

          <div className="space-y-4">
            {excellentFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6">
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{i + 1}. {feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{feature.description}</p>
                      <p className="text-sm text-foreground/80 italic">{feature.detail}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Improvements */}
      <section className="py-12 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Recommended Improvements</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">
            {implementedCount} of {improvements.length} improvements implemented.
          </p>

          <div className="space-y-4">
            {improvements.map((imp) => (
              <Card key={imp.number} className={`p-6 ${imp.status === "implemented" ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-amber-500"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={imp.status === "implemented" ? "default" : "secondary"} className="text-xs">
                        {imp.status === "implemented" ? "✓ Implemented" : "Planned"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">#{imp.number}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">🔥 {imp.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{imp.description}</p>
                    <p className="text-sm text-foreground/80 italic">Impact: {imp.impact}</p>
                  </div>
                  {imp.link && (
                    <Link to={imp.link} className="shrink-0">
                      <Button variant="outline" size="sm">View →</Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Revised Grade */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Projected Grade After All Improvements</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { category: "Content Fidelity", current: 99, after: 99 },
              { category: "Educational Architecture", current: 97, after: 99 },
              { category: "Professional Utility", current: 95, after: 99 },
              { category: "Interactive Features", current: 91, after: 98 },
              { category: "Engagement & Return Visits", current: 88, after: 97 },
              { category: "Community Features", current: 83, after: 93 },
              { category: "Connection to Practice", current: 86, after: 98 },
              { category: "Searchability", current: 87, after: 96 },
            ].map((cat) => (
              <Card key={cat.category} className="p-4">
                <span className="text-sm font-medium text-foreground">{cat.category}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-muted-foreground text-sm">{cat.current}</span>
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className={`font-bold ${getGradeColor(cat.after)}`}>{cat.after}</span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-8 p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="text-5xl font-bold text-primary mb-2">A+ (98)</div>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Projected overall grade after all recommended improvements are implemented.
            </p>
          </Card>
        </div>
      </section>

      {/* Summary Quote */}
      <section className="py-12 px-6 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-xl sm:text-2xl font-medium text-foreground italic leading-relaxed">
            "This app already does what most technical educational tools fail to do: it makes wisdom accessible. The improvements would make it what most technical educational tools cannot even dream of being: a tool that changes behavior."
          </blockquote>
          <p className="text-muted-foreground mt-6 text-sm">
            James wanted modelers to think before they compute. This app shows them how. The improvements would make it impossible to avoid doing so.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GradeReport;
