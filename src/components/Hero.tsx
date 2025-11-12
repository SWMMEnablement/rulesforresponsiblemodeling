import { BookOpen, Activity, TrendingUp, Code2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export const Hero = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary px-6 py-20">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6 animate-fade-in">
          <Activity className="w-4 h-4" />
          <span className="text-sm font-medium">4th Edition</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
          Rules for Responsible Modeling
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          by William James reinterpretation by Robert Dickinson in a Vibe APP
        </p>
        
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
          A comprehensive guide to deterministic modeling for urban water systems, 
          covering reliability, uncertainty, and sustainable ecosystem impacts
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <BookOpen className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="text-2xl font-bold text-white">17</div>
              <div className="text-sm text-white/80">Chapters</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <TrendingUp className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="text-2xl font-bold text-white">303</div>
              <div className="text-sm text-white/80">Pages</div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowCodeDialog(true)}
          variant="outline"
          size="lg"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <Code2 className="w-5 h-5 mr-2" />
          View Source Code
        </Button>
      </div>
      
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>View Source Code</DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>This Vibe APP is built with React, TypeScript, and Tailwind CSS.</p>
              <div className="space-y-2">
                <p className="font-semibold">To view the code:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Desktop:</strong> Click the Dev Mode toggle (code icon) in the top area of the preview</li>
                  <li><strong>Export to GitHub:</strong> Click the GitHub button in the top right to connect and sync this project to your repository</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
