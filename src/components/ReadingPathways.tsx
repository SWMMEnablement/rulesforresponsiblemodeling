import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Shield,
  Compass,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";

interface Pathway {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  chapters: {
    number: number;
    title: string;
    focus: string;
  }[];
}

const pathways: Pathway[] = [
  {
    id: "student",
    title: "Student Path",
    description: "Foundation-first approach for newcomers to hydrological modeling. Builds concepts progressively from basics to advanced topics.",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    estimatedTime: "8-10 hours",
    chapters: [
      { number: 1, title: "Introduction", focus: "Core concepts & philosophy" },
      { number: 2, title: "Data & Uncertainty", focus: "Understanding model inputs" },
      { number: 4, title: "Discretization", focus: "Spatial representation basics" },
      { number: 5, title: "Continuous Modeling", focus: "Time-series fundamentals" },
      { number: 9, title: "Objective Functions", focus: "Measuring model performance" },
      { number: 10, title: "Uncertainty Analysis", focus: "Quantifying reliability" },
      { number: 11, title: "Verification", focus: "Building confidence" },
      { number: 17, title: "Ethics", focus: "Professional responsibility" },
    ],
  },
  {
    id: "practitioner",
    title: "Practitioner Review",
    description: "Quick refresher for experienced modelers. Focuses on best practices, common pitfalls, and advanced optimization techniques.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
    estimatedTime: "4-5 hours",
    chapters: [
      { number: 3, title: "Data Preparation", focus: "Quality assurance tips" },
      { number: 8, title: "SWMM Modeling", focus: "Software best practices" },
      { number: 12, title: "Calibration", focus: "Advanced techniques" },
      { number: 13, title: "Sensitivity Analysis", focus: "Parameter importance" },
      { number: 14, title: "Genetic Algorithms", focus: "Automated optimization" },
      { number: 16, title: "Forecast Updating", focus: "Real-time applications" },
    ],
  },
  {
    id: "ethics",
    title: "Ethics & Uncertainty Deep Dive",
    description: "Explore the philosophical and ethical dimensions of modeling. Essential for anyone communicating results to stakeholders.",
    icon: <Shield className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    estimatedTime: "3-4 hours",
    chapters: [
      { number: 1, title: "Introduction", focus: "Rules for responsible modeling" },
      { number: 2, title: "Data & Uncertainty", focus: "Types of uncertainty" },
      { number: 10, title: "Uncertainty Analysis", focus: "Quantification methods" },
      { number: 15, title: "Fuzzy Logic", focus: "Handling imprecision" },
      { number: 17, title: "Ethics", focus: "Professional standards" },
    ],
  },
  {
    id: "comprehensive",
    title: "Comprehensive Journey",
    description: "Complete cover-to-cover reading for thorough understanding. Recommended for those building deep expertise.",
    icon: <Compass className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    estimatedTime: "15-20 hours",
    chapters: [
      { number: 1, title: "Introduction", focus: "Foundation concepts" },
      { number: 2, title: "Data & Uncertainty", focus: "Input fundamentals" },
      { number: 3, title: "Data Preparation", focus: "Processing techniques" },
      { number: 4, title: "Discretization", focus: "Spatial modeling" },
      { number: 5, title: "Continuous Modeling", focus: "Long-term simulation" },
      { number: 6, title: "Rainfall Analysis", focus: "Storm characterization" },
      { number: 7, title: "Storm Movement", focus: "Spatial rainfall" },
      { number: 8, title: "SWMM Modeling", focus: "Software application" },
      { number: 9, title: "Objective Functions", focus: "Performance metrics" },
      { number: 10, title: "Uncertainty Analysis", focus: "Error quantification" },
      { number: 11, title: "Verification", focus: "Model testing" },
      { number: 12, title: "Calibration", focus: "Parameter adjustment" },
      { number: 13, title: "Sensitivity Analysis", focus: "Parameter studies" },
      { number: 14, title: "Genetic Algorithms", focus: "Optimization" },
      { number: 15, title: "Fuzzy Logic", focus: "Expert systems" },
      { number: 16, title: "Forecast Updating", focus: "Real-time modeling" },
      { number: 17, title: "Ethics", focus: "Professional practice" },
    ],
  },
];

interface ReadingPathwaysProps {
  compact?: boolean;
}

export const ReadingPathways = ({ compact = false }: ReadingPathwaysProps) => {
  if (compact) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pathways.map((pathway) => (
          <Card
            key={pathway.id}
            className="p-4 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pathway.color} flex items-center justify-center text-white`}
              >
                {pathway.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  {pathway.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {pathway.estimatedTime}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {pathway.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              {pathway.chapters.length} chapters
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Choose Your Learning Path
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Different readers have different goals. Select a pathway that matches
          your experience level and learning objectives.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {pathways.map((pathway) => (
          <Card
            key={pathway.id}
            className="p-6 hover:shadow-xl transition-all border-l-4"
            style={{
              borderLeftColor: `var(--${pathway.id === "student" ? "blue" : pathway.id === "practitioner" ? "emerald" : pathway.id === "ethics" ? "purple" : "amber"}-500, hsl(var(--primary)))`,
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pathway.color} flex items-center justify-center text-white shadow-lg`}
              >
                {pathway.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {pathway.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pathway.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {pathway.chapters.length} chapters
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{pathway.description}</p>

            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-foreground">
                Reading Order:
              </h4>
              <div className="flex flex-wrap gap-2">
                {pathway.chapters.map((chapter, index) => (
                  <Link key={chapter.number} to={`/chapter/${chapter.number}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    >
                      {index + 1}. Ch {chapter.number}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Link to={`/chapter/${pathway.chapters[0].number}`}>
                <Button className="w-full group">
                  Start This Path
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
