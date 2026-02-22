import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileDown, Printer } from "lucide-react";

interface Poster {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

const posters: Poster[] = [
  { id: 1, title: "All Models Are Wrong", subtitle: "But Some Are Useful", description: "Box quote + the 7-step modeling process graphic. A daily reminder that models inform decisions — they don't predict perfectly.", color: "from-primary/20 to-primary/5" },
  { id: 2, title: "The Complexity Curve", subtitle: "Reliability vs. Complexity", description: "The iconic reliability vs. complexity chart with Dr. James's annotations. Shows the danger zone where adding detail reduces reliability.", color: "from-secondary/20 to-secondary/5" },
  { id: 3, title: "The 8 Core Concepts", subtitle: "Framework Map", description: "The interconnected framework of responsible modeling as a wall poster. Complexity → Uncertainty → Data → Optimization → Sensitivity.", color: "from-accent/20 to-accent/5" },
  { id: 4, title: "10 Rules for Responsible Modeling", subtitle: "Quick Reference", description: "The top 10 rules, one sentence each. Designed for quick glance reference during modeling sessions.", color: "from-primary/15 to-secondary/5" },
  { id: 5, title: "The Checklist", subtitle: "40-Item Reference", description: "The complete 40-item checklist as a wall-mounted reference. Phase-specific, downloadable, and ready to print.", color: "from-secondary/15 to-primary/5" },
];

export const OfficePosterSeries = () => {
  const handleDownload = (poster: Poster) => {
    // Generate a simple text-based poster content for download
    const content = `
═══════════════════════════════════════════════
  ${poster.title.toUpperCase()}
  ${poster.subtitle}
═══════════════════════════════════════════════

${poster.description}

Based on "Rules for Responsible Modeling"
by Dr. William James

rulesforresponsiblemodeling.lovable.app
═══════════════════════════════════════════════
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poster-${poster.id}-${poster.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Printer className="w-7 h-7 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Office Poster Series</h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Five downloadable posters for engineering offices. Print them, tape them to monitors, and keep James's rules visible.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posters.map((poster) => (
          <div key={poster.id} className={`rounded-xl bg-gradient-to-br ${poster.color} border border-border p-5 flex flex-col`}>
            <Badge variant="outline" className="w-fit mb-3 text-xs">Poster #{poster.id}</Badge>
            <h3 className="text-lg font-bold text-foreground mb-1">{poster.title}</h3>
            <p className="text-sm font-medium text-primary mb-2">{poster.subtitle}</p>
            <p className="text-xs text-muted-foreground flex-1 mb-4">{poster.description}</p>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => handleDownload(poster)}>
              <FileDown className="w-4 h-4" /> Download
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
