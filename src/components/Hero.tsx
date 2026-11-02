import { BookOpen, Activity, Code2, ExternalLink, Github, GraduationCap, Shield, ArrowRight, Search, Compass, SearchX, Layers, Sparkles, PlayCircle, Route, FlaskConical, Archive } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { usePathwayProgress } from "@/hooks/usePathwayProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { hasProgress, loadSession, stepsDone } from "@/lib/workedCaseSession";

const routes = [
  { to: "/study-guide", icon: GraduationCap, title: "Learn", desc: "Read the 17 chapters through a Student (8–10 hrs), Practitioner (4–5 hrs) or Ethics (3–4 hrs) path.", cta: "Choose a path" },
  { to: "/playground", icon: FlaskConical, title: "Experiment", desc: "Run the real SWMM 5.2 engine: change roughness, imperviousness and rainfall, run ensembles, or draw a network.", cta: "Open the Playground" },
  { to: "/model-library", icon: Archive, title: "Review my model", desc: "Keep your own .inp files in this browser, run them and check flows and continuity errors.", cta: "Open the Model Library" },
];

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const Hero = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const { progress } = usePathwayProgress();
  const { bookmarks } = useBookmarks();
  const [caseSession] = useState(() => loadSession());
  const caseInProgress = hasProgress(caseSession);
  const caseSteps = stepsDone(caseSession);

  // Find most recent pathway / bookmark for "resume"
  const lastPathway = [...progress].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)[0];
  const lastPathwayCompleted = lastPathway?.chapters.filter(c => c.completed).length ?? 0;
  const lastPathwayTotal = lastPathway?.chapters.length ?? 0;
  const lastBookmark = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp)[0];
  const hasProgress = !!lastPathway || !!lastBookmark;
  const resumeHref = lastPathway
    ? "/study-guide"
    : lastBookmark
    ? `/chapter/${lastBookmark.chapterNumber}`
    : null;
  const resumeLabel = lastPathway
    ? `Resume Study Guide · ${lastPathwayCompleted}/${lastPathwayTotal} chapters`
    : lastBookmark
    ? `Resume Chapter ${lastBookmark.chapterNumber}: ${lastBookmark.title}`
    : null;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary px-6 py-20">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 animate-fade-in">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">Based on the 4th Edition (2005) — Interactive 2026</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-up">
          Rules for Responsible Modeling
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          by <span className="font-semibold">William James, Ph.D., P.Eng.</span>
        </p>

        <p className="text-base md:text-lg text-white/70 mb-4 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          Interactive Edition by Robert Dickinson
        </p>

        {/* Clear Value Proposition */}
        <p className="text-xl md:text-2xl text-white font-semibold mb-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Master Responsible Hydraulic Modeling
        </p>
        <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.25s" }}>
          17 chapters mapped directly to <span className="font-semibold text-white">SWMM5 &amp; InfoWorks ICM</span> — with simulators, illustrative failure autopsies, and a 10-question completion badge.
        </p>

        {/* One main action, then three routes */}
        <div className="flex flex-col items-center gap-3 mb-4 animate-slide-up" style={{ animationDelay: "0.28s" }}>
          <Link to="/worked-case">
            <Button size="lg" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90 font-semibold shadow-lg gap-2">
              {caseInProgress ? <PlayCircle className="w-6 h-6" /> : <Route className="w-6 h-6" />}
              {caseInProgress ? `Resume the worked case · ${caseSteps} of 5 steps done` : "Start the worked case"}
            </Button>
          </Link>
          <p className="text-sm text-white/80 max-w-xl">
            One made-up catchment from observed data through calibration, validation and uncertainty to a review package, on the real SWMM engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-slide-up" style={{ animationDelay: "0.29s" }}>
          {hasProgress && resumeHref && (
            <Link to={resumeHref}>
              <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 gap-2">
                <BookOpen className="w-4 h-4" /> {resumeLabel}
              </Button>
            </Link>
          )}
          <Button size="sm" variant="outline" onClick={() => scrollTo("diagnostic-tool")} className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 gap-2">
            <Compass className="w-4 h-4" /> 3-question diagnostic
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              scrollTo("global-search");
              setTimeout(() => {
                const input = document.querySelector<HTMLInputElement>('#global-search input');
                input?.focus();
              }, 400);
            }}
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 gap-2"
          >
            <Search className="w-4 h-4" /> Search chapters &amp; tools
          </Button>
        </div>

        <div className="mb-10 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="grid sm:grid-cols-3 gap-4">
            {routes.map((t) => (
              <Link key={t.to} to={t.to} className="group block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <div className="h-full p-5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 hover:bg-white/25 hover:border-white/50 hover:-translate-y-0.5 transition-all text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <t.icon className="w-5 h-5 text-white" />
                    <h3 className="font-semibold text-white text-lg">{t.title}</h3>
                  </div>
                  <p className="text-sm text-white/85 mb-3">{t.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-white">
                    {t.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Differentiator chips: SWMM5/ICM + Autopsies */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.32s" }}>
          <button
            onClick={() => scrollTo("software-translation")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm transition-colors"
          >
            <Layers className="w-4 h-4" />
            Every rule mapped to SWMM5 &amp; ICM
          </button>
          <button
            onClick={() => scrollTo("model-autopsies")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm transition-colors"
          >
            <SearchX className="w-4 h-4" />
            Model Autopsies — learn from failure
          </button>
          <Link
            to="/responsibility-quiz"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Earn completion badge
          </Link>
        </div>

        {/* Stats — user-benefit framed */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">17</div>
              <div className="text-xs text-white/80">Chapters</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Activity className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">17</div>
              <div className="text-xs text-white/80">Micro-Apps</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">15</div>
              <div className="text-xs text-white/80">Animations</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Shield className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">10-Q</div>
              <div className="text-xs text-white/80">Completion badge</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <a
            href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Original Publication
            </Button>
          </a>

          <Button
            onClick={() => setShowCodeDialog(true)}
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
          >
            <Code2 className="w-5 h-5 mr-2" />
            View Source Code
          </Button>
        </div>

        <p className="mt-4 text-sm text-white/60 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          Original publication hosted by CHI (Computational Hydraulics International)
        </p>
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              View Source Code
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>This interactive edition is built with React, TypeScript, Tailwind CSS, and shadcn/ui components.</p>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-semibold text-foreground mb-2">Option 1: Dev Mode (in Lovable)</p>
                  <p className="text-sm">Click the code icon <Code2 className="w-4 h-4 inline mx-1" /> in the top toolbar to toggle the code editor view.</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="font-semibold text-foreground mb-2">Option 2: Export to GitHub</p>
                  <p className="text-sm">Click the <Github className="w-4 h-4 inline mx-1" /> GitHub button in the top right to connect and sync to your repository.</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Tech stack: React 18 • TypeScript • Vite • Tailwind CSS • shadcn/ui • Mermaid.js
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Smoother dark-section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
    </section>
  );
};
