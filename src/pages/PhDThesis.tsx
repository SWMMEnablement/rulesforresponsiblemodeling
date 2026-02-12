import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Globe, Calendar, Layers, Database, Code, AlertTriangle, CheckSquare, Package, Download } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PhDThesis = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="outline" className="mb-3">Ancillary Project</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-3">MD Insight Explorer</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Interactive web viewer for Allan Goyen's PhD dissertation: <em>"Spatial and Temporal Effects on Urban Rainfall/Runoff Modelling"</em> (UTS, 2000)
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://md-insight-explorer.lovable.app" target="_blank" rel="noopener noreferrer">
              <Button variant="default" className="gap-2">
                <Globe className="w-4 h-4" /> Visit Live App
              </Button>
            </a>
            <a href="https://lovable.dev/projects/fdf6e6ea-1b7e-4b30-a505-ba44d472c792" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Lovable Project
              </Button>
            </a>
            <a href="/md-insight-explorer-handover.md" download="MD-INSIGHT-EXPLORER-HANDOVER.md">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Download Markdown
              </Button>
            </a>
          </div>
        </div>

        {/* Overview */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            MD Insight Explorer renders a large Markdown document (~22,703 lines) with full navigation, search, data visualizations, an interactive Mapbox map, and multi-format export. It is a purely frontend application with no backend, database, or authentication.
          </p>
        </Card>

        {/* Tech Stack */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Tech Stack
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: "Framework", value: "React ^18.3.1" },
              { label: "Build Tool", value: "Vite" },
              { label: "Language", value: "TypeScript (strict)" },
              { label: "Styling", value: "Tailwind CSS + HSL tokens" },
              { label: "UI", value: "shadcn/ui (Radix)" },
              { label: "Markdown", value: "react-markdown + remark-gfm" },
              { label: "Charts", value: "Recharts" },
              { label: "Maps", value: "Mapbox GL JS" },
              { label: "Routing", value: "react-router-dom v6" },
            ].map((item) => (
              <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Components */}
        <Accordion type="multiple" className="mb-8">
          <AccordionItem value="components">
            <AccordionTrigger className="text-xl font-bold">
              <span className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" /> Key Components
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {[
                  { name: "DissertationViewer.tsx", lines: 287, desc: "Main orchestrator — tabs, search, export, sidebar navigation" },
                  { name: "TableOfContents.tsx", lines: 156, desc: "Parses MD headings & HTML TOC tables into collapsible tree" },
                  { name: "TablesAndFigures.tsx", lines: 251, desc: "Extracts & indexes all tables/figures with line navigation" },
                  { name: "DataVisualization.tsx", lines: 284, desc: "Recharts-based rainfall, runoff, surface composition, storm events" },
                  { name: "CatchmentMap.tsx", lines: 354, desc: "Mapbox GL interactive satellite map of Giralang catchment" },
                  { name: "BackgroundInfo.tsx", lines: 202, desc: "Static research context cards and historical timeline" },
                ].map((comp) => (
                  <Card key={comp.name} className="p-4 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold text-foreground">{comp.name}</span>
                      <Badge variant="secondary">{comp.lines} lines</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comp.desc}</p>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data">
            <AccordionTrigger className="text-xl font-bold">
              <span className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Data Sources
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Data</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Source</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Location</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    {[
                      ["Dissertation text", "Static Markdown file", "public/dissertation.md"],
                      ["Chart data", "Hardcoded in component", "DataVisualization.tsx"],
                      ["Map coordinates", "Hardcoded in component", "CatchmentMap.tsx"],
                      ["Background info", "Hardcoded in component", "BackgroundInfo.tsx"],
                      ["TOC structure", "Parsed at runtime", "TableOfContents.tsx"],
                      ["Tables/Figures", "Parsed at runtime", "TablesAndFigures.tsx"],
                    ].map(([data, source, loc]) => (
                      <tr key={data} className="border-b border-muted">
                        <td className="py-2 font-medium">{data}</td>
                        <td className="py-2 text-muted-foreground">{source}</td>
                        <td className="py-2 font-mono text-xs">{loc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="limitations">
            <AccordionTrigger className="text-xl font-bold">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" /> Known Limitations
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pt-2">
                {[
                  "DissertationViewer.tsx (287 lines) should be split into smaller components",
                  "Line-based scrolling uses rough 24px/line estimate",
                  "No dark mode toggle exposed in UI (next-themes installed)",
                  "All visualization data is hardcoded, not derived from the dissertation",
                  "Search uses regex on 22K lines with no debounce",
                  "HTML export wraps raw markdown in <pre> instead of rendering",
                  "No PDF export capability",
                  "Mapbox token is hardcoded in source",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="migration">
            <AccordionTrigger className="text-xl font-bold">
              <span className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" /> Migration Checklist
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pt-2">
                {[
                  "Copy all files in src/components/ (including ui/)",
                  "Copy src/pages/Index.tsx",
                  "Copy public/dissertation.md",
                  "Copy src/index.css and tailwind.config.ts",
                  "Copy src/lib/utils.ts and src/hooks/",
                  "Install all npm dependencies",
                  "Replace Mapbox token in CatchmentMap.tsx",
                  "Update OG image URLs in index.html",
                  "Verify vite.config.ts path alias configuration",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Map Stations */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Monitoring Stations</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Catchment Outlet Gauge", type: "Flow Meter", pipe: "1800mm" },
              { name: "Rainfall Gauge - Gundulu Place", type: "Rain Gauge", pipe: "—" },
              { name: "Rainfall Gauge - Chuculba Crescent", type: "Rain Gauge", pipe: "—" },
              { name: "12 Roof Micro-Catchment", type: "Flow Meter", pipe: "300mm" },
              { name: "14 Lot Micro-Catchment", type: "Flow Meter", pipe: "450mm" },
              { name: "Rural/Urban Interface", type: "Flow Meter", pipe: "900mm" },
            ].map((s) => (
              <div key={s.name} className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{s.type}</Badge>
                  {s.pipe !== "—" && <Badge variant="secondary" className="text-xs">{s.pipe}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Generated: 2026-02-12 | MD Insight Explorer Handover
        </p>
      </div>
      
      <Footer />
    </div>
  );
};

export default PhDThesis;
