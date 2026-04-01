import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Eye, TrendingDown, BarChart3, Dices, CloudRain, Tornado, Dna, Archive, ArrowRight, Zap, Expand, Database, GitBranch, Frame, Target, Sigma, FileText, Users, MessageSquare } from "lucide-react";
import { CrystalBallTest } from "@/components/micro-apps/CrystalBallTest";
import { OverfittingSimulator } from "@/components/micro-apps/OverfittingSimulator";
import { ErrorMetricLab } from "@/components/micro-apps/ErrorMetricLab";
import { MonteCarloSpinner } from "@/components/micro-apps/MonteCarloSpinner";
import { StormChopper } from "@/components/micro-apps/StormChopper";
import { TornadoTwister } from "@/components/micro-apps/TornadoTwister";
import { GeneticAlgorithmZoo } from "@/components/micro-apps/GeneticAlgorithmZoo";
import { LegacySaver } from "@/components/micro-apps/LegacySaver";
import { ScopeCreepDetector } from "@/components/micro-apps/ScopeCreepDetector";
import { DataAuditScorer } from "@/components/micro-apps/DataAuditScorer";
import { ModelSelector } from "@/components/micro-apps/ModelSelector";
import { BoundaryConditionLab } from "@/components/micro-apps/BoundaryConditionLab";
import { CalibrationCoach } from "@/components/micro-apps/CalibrationCoach";
import { UncertaintyRanger } from "@/components/micro-apps/UncertaintyRanger";
import { ReportCardBuilder } from "@/components/micro-apps/ReportCardBuilder";
import { PeerReviewSim } from "@/components/micro-apps/PeerReviewSim";
import { StakeholderTranslator } from "@/components/micro-apps/StakeholderTranslator";

const microApps = [
  { slug: "crystal-ball", title: "The Crystal Ball Test", chapter: 1, icon: Eye, desc: "Confidence vs Data: watch uncertainty explode", color: "from-violet-500 to-indigo-500" },
  { slug: "scope-creep", title: "The Scope Creep Detector", chapter: 2, icon: Expand, desc: "Adjust project parameters and see complexity compound", color: "from-red-500 to-orange-500" },
  { slug: "data-audit", title: "The Data Audit Scorer", chapter: 3, icon: Database, desc: "Score data quality across rainfall, flow, and more", color: "from-green-500 to-emerald-500" },
  { slug: "overfitting-simulator", title: "The Overfitting Simulator", chapter: 4, icon: TrendingDown, desc: "The U-curve: training vs validation error", color: "from-emerald-500 to-teal-500" },
  { slug: "model-selector", title: "The Model Selector", chapter: 5, icon: GitBranch, desc: "Define constraints and find the best-fit model", color: "from-blue-500 to-indigo-500" },
  { slug: "storm-chopper", title: "The Storm Chopper", chapter: 6, icon: CloudRain, desc: "Chop storms into time-steps and watch peaks flatten", color: "from-sky-500 to-blue-500" },
  { slug: "boundary-lab", title: "The Boundary Condition Lab", chapter: 7, icon: Frame, desc: "Set boundary conditions and see how they interact", color: "from-teal-500 to-cyan-500" },
  { slug: "calibration-coach", title: "The Calibration Coach", chapter: 8, icon: Target, desc: "Match simulated to observed hydrographs manually", color: "from-amber-500 to-orange-500" },
  { slug: "error-metric-lab", title: "The Error Metric Lab", chapter: 9, icon: BarChart3, desc: "Drag hydrographs and watch NSE, R², KGE change", color: "from-orange-500 to-amber-500" },
  { slug: "monte-carlo-spinner", title: "The Monte Carlo Spinner", chapter: 10, icon: Dices, desc: "Run simulations and see confidence intervals widen", color: "from-rose-500 to-pink-500" },
  { slug: "tornado-twister", title: "The Tornado Twister", chapter: 11, icon: Tornado, desc: "Build sensitivity tornado diagrams in real-time", color: "from-cyan-500 to-teal-500" },
  { slug: "uncertainty-ranger", title: "The Uncertainty Ranger", chapter: 12, icon: Sigma, desc: "Watch input uncertainties compound into prediction bands", color: "from-violet-500 to-purple-500" },
  { slug: "report-card", title: "The Report Card Builder", chapter: 13, icon: FileText, desc: "Score your modeling report's completeness", color: "from-lime-500 to-green-500" },
  { slug: "genetic-algorithm-zoo", title: "The Genetic Algorithm Zoo", chapter: 14, icon: Dna, desc: "Watch populations evolve toward optimal parameters", color: "from-purple-500 to-fuchsia-500" },
  { slug: "peer-review", title: "The Peer Review Simulator", chapter: 15, icon: Users, desc: "Rate review criteria and see the verdict", color: "from-blue-500 to-cyan-500" },
  { slug: "stakeholder-translator", title: "The Stakeholder Translator", chapter: 16, icon: MessageSquare, desc: "Translate technical results for any audience", color: "from-pink-500 to-rose-500" },
  { slug: "legacy-saver", title: "The Legacy Saver", chapter: 17, icon: Archive, desc: "Score your model's handover readiness", color: "from-amber-500 to-yellow-500" },
];

const appComponents: Record<string, React.FC> = {
  "crystal-ball": CrystalBallTest,
  "scope-creep": ScopeCreepDetector,
  "data-audit": DataAuditScorer,
  "overfitting-simulator": OverfittingSimulator,
  "model-selector": ModelSelector,
  "storm-chopper": StormChopper,
  "boundary-lab": BoundaryConditionLab,
  "calibration-coach": CalibrationCoach,
  "error-metric-lab": ErrorMetricLab,
  "monte-carlo-spinner": MonteCarloSpinner,
  "tornado-twister": TornadoTwister,
  "uncertainty-ranger": UncertaintyRanger,
  "report-card": ReportCardBuilder,
  "genetic-algorithm-zoo": GeneticAlgorithmZoo,
  "peer-review": PeerReviewSim,
  "stakeholder-translator": StakeholderTranslator,
  "legacy-saver": LegacySaver,
};

// Index page listing all micro-apps
const MicroAppsIndex = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Micro-Apps</h1>
            <p className="text-muted-foreground text-sm">Interactive 10-minute learning modules</p>
          </div>
        </div>
        <p className="text-muted-foreground mb-8 mt-3">
          Each micro-app is a standalone interactive tool tied to a specific chapter. Adjust parameters, see results in real-time, and export transferable outputs for your modeling projects.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {microApps.map((app) => {
            const Icon = app.icon;
            return (
              <Link key={app.slug} to={`/micro-apps/${app.slug}`}>
                <Card className="p-5 hover:shadow-lg transition-all border-l-4 border-l-primary group h-full">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${app.color} text-white shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-sm">{app.title}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">Ch. {app.chapter}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{app.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Badge variant="secondary">All 17 micro-apps available ✓</Badge>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

// Individual micro-app page
const MicroAppPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const Component = slug ? appComponents[slug] : null;

  if (!Component) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Micro-App Not Found</h1>
            <Link to="/micro-apps">
              <Button>View All Micro-Apps</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/micro-apps" className="text-sm text-primary hover:underline">← All Micro-Apps</Link>
          </div>
          <Component />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export { MicroAppsIndex, MicroAppPage };
export default MicroAppsIndex;
