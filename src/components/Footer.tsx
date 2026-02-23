import { Code2, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export const Footer = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  return (
    <>
      <footer className="border-t bg-muted/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">About This App</h3>
              <p className="text-muted-foreground text-sm">
                A Vibe APP reinterpretation of William James' "Rules for Responsible Modeling" by Robert Dickinson.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm justify-start"
                  onClick={() => setShowCodeDialog(true)}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  View Source Code
                </Button>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <div className="space-y-2">
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm justify-start"
                  asChild
                >
                  <a href="https://replit.com/@robertdickinson/SWMM-Docs-Explorer" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    SWMM Docs Explorer
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Vibe APP. Built with React, TypeScript & Tailwind CSS.</p>
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
