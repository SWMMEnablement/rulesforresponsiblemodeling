import { BookOpen, Activity, TrendingUp, Code2, ExternalLink, Github, GraduationCap, Briefcase, Shield, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const quickPaths = [
  { to: "/study-guide", icon: GraduationCap, title: "Student Path", desc: "Foundation-first approach", time: "8-10 hrs", color: "from-blue-500 to-cyan-500" },
  { to: "/study-guide", icon: Briefcase, title: "Practitioner Review", desc: "Quick refresher for pros", time: "4-5 hrs", color: "from-emerald-500 to-teal-500" },
  { to: "/study-guide", icon: Shield, title: "Ethics Deep Dive", desc: "Philosophy & uncertainty", time: "3-4 hrs", color: "from-purple-500 to-pink-500" },
];

export const Hero = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary px-6 py-20">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 animate-fade-in">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">4th Edition • 2005</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-slide-up">
          Rules for Responsible Modeling
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          by <span className="font-semibold">William James, Ph.D., P.Eng.</span>
        </p>
        
        <p className="text-base md:text-lg text-white/70 mb-4 italic animate-slide-up" style={{ animationDelay: "0.15s" }}>
          Interactive Edition — Reimagined by Robert Dickinson
        </p>
        
        {/* Clear Value Proposition */}
        <p className="text-xl md:text-2xl text-white font-semibold mb-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Master Responsible Hydraulic Modeling
        </p>
        <p className="text-lg text-white/80 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.25s" }}>
          17 chapters, 15 interactive animations, flashcards, quizzes, and real-world case studies — 
          all in one searchable, interactive platform.
        </p>
        
        {/* Pathway Cards — Primary CTAs */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {quickPaths.map((path) => (
            <Link key={path.title} to={path.to}>
              <div className="group p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-left">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center text-white mb-3`}>
                  <path.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{path.title}</h3>
                <p className="text-xs text-white/70 mb-2">{path.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{path.time}</span>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">17</div>
              <div className="text-xs text-white/80">Chapters</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <TrendingUp className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">303</div>
              <div className="text-xs text-white/80">Pages</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Activity className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-xl font-bold text-white">15</div>
              <div className="text-xs text-white/80">Animations</div>
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
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Original Publication
            </Button>
          </a>
          
          <Button 
            onClick={() => setShowCodeDialog(true)}
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
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
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
