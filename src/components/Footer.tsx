import { Code2, BookOpen, ExternalLink, Github, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const APP_VERSION = "2026.1";
const LAST_UPDATED = "May 30, 2026";
const ISSUES_EMAIL = "robert.dickinson@gmail.com";
const ISSUES_URL = `mailto:${ISSUES_EMAIL}?subject=${encodeURIComponent("Rules for Responsible Modeling — Issue Report")}`;

export const Footer = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  return (
    <>
      <footer className="border-t bg-muted/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About This App</h3>
              <p className="text-muted-foreground text-sm">
                A Vibe APP reinterpretation of William James' "Rules for Responsible Modeling" by Robert Dickinson.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="link" className="h-auto p-0 text-sm justify-start" onClick={() => setShowCodeDialog(true)}>
                  <Code2 className="w-4 h-4 mr-2" />
                  View Source Code
                </Button>
                <Button variant="link" className="h-auto p-0 text-sm justify-start" asChild>
                  <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Report an Issue
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <div className="space-y-2">
                <Button variant="link" className="h-auto p-0 text-sm justify-start" asChild>
                  <a href="https://replit.com/@robertdickinson/SWMM-Docs-Explorer" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    SWMM Docs Explorer
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
                <Button variant="link" className="h-auto p-0 text-sm justify-start" asChild>
                  <a href="https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Original Publication (CHI)
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Vibe APP. Built with React, TypeScript & Tailwind CSS.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>Version {APP_VERSION}</span>
              <span className="hidden md:inline">·</span>
              <span>Updated {LAST_UPDATED}</span>
              <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                <Github className="w-3.5 h-3.5" />
                Report issue
              </a>
            </div>
          </div>
        </div>
      </footer>

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
    </>
  );
};
