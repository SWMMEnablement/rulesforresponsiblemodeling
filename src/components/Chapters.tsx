import { 
  BookOpen, Grid3x3, Database, Layers, Waves, 
  Cloud, LineChart, Target, AlertTriangle, 
  TrendingUp, Box, BarChart3, Settings, Brain, 
  Activity, CheckCircle2, Lightbulb
} from "lucide-react";
import { ChapterCard } from "./ChapterCard";

export const Chapters = () => {
  const chapters = [
    {
      number: 1,
      title: "Introduction",
      description: "Understanding models and their role in resolving complex problems",
      icon: BookOpen,
      topics: ["Model Definition", "Design Problems", "Applications"]
    },
    {
      number: 2,
      title: "Discretization & Complexity",
      description: "Breaking down systems into manageable spatial and temporal components",
      icon: Grid3x3,
      topics: ["Spatial Resolution", "Temporal Resolution", "Data Management"]
    },
    {
      number: 3,
      title: "Reliability of Input",
      description: "Managing data quality, uncertainty, and file documentation",
      icon: Database,
      topics: ["Data Categories", "GIS Concepts", "File Management"]
    },
    {
      number: 4,
      title: "Optimal Complexity",
      description: "Finding the balance between detail and computational efficiency",
      icon: Layers,
      topics: ["Complexity Measures", "Data Availability", "Uncertainty"]
    },
    {
      number: 5,
      title: "Continuous Models",
      description: "Long-term modeling for sustainability and ecosystem impacts",
      icon: Waves,
      topics: ["Sustainability", "Ecosystem Processes", "Ethics"]
    },
    {
      number: 6,
      title: "Rain Input Generation",
      description: "Stochastic and disaggregation models for rainfall patterns",
      icon: Cloud,
      topics: ["Stochastic Models", "Disaggregation", "Analysis Techniques"]
    },
    {
      number: 7,
      title: "Dynamic Rain Systems",
      description: "Understanding storm cell kinematics and timing uncertainties",
      icon: Activity,
      topics: ["Storm Velocity", "Timing Error", "Sensitivity"]
    },
    {
      number: 8,
      title: "Decision Support",
      description: "Tools and systems like PCSWMM for practical implementation",
      icon: Target,
      topics: ["PCSWMM", "Software Tools", "Integration"]
    },
    {
      number: 9,
      title: "Objective Functions",
      description: "Measuring and evaluating model performance",
      icon: LineChart,
      topics: ["Response Functions", "Multi-objective", "Statistics"]
    },
    {
      number: 10,
      title: "Uncertainty Analysis",
      description: "Sources of error and methods for quantifying model reliability",
      icon: AlertTriangle,
      topics: ["Error Sources", "Analysis Methods", "Model Reliability"]
    },
    {
      number: 11,
      title: "Sensitivity Analysis",
      description: "Testing how parameters impact model outputs",
      icon: TrendingUp,
      topics: ["Sensitivity Gradients", "Parameter Testing", "Hydrological Models"]
    },
    {
      number: 12,
      title: "State Variable Space",
      description: "Mathematical representation of system states",
      icon: Box,
      topics: ["State Variables", "Sub-spaces", "Mathematical Framework"]
    },
    {
      number: 13,
      title: "Performance Evaluation",
      description: "Comprehensive survey of evaluation functions",
      icon: BarChart3,
      topics: ["Evaluation Metrics", "Function Survey", "Best Practices"]
    },
    {
      number: 14,
      title: "Parameter Optimization",
      description: "Calibration techniques including genetic algorithms",
      icon: Settings,
      topics: ["Genetic Algorithms", "Calibration", "Validation"]
    },
    {
      number: 15,
      title: "Fuzzy Logic",
      description: "Applying fuzzy reasoning to handle imprecision",
      icon: Brain,
      topics: ["Fuzzification", "Defuzzification", "Reasoning"]
    },
    {
      number: 16,
      title: "Real-Time Uncertainty",
      description: "Presenting model reliability and uncertainty continuously",
      icon: Activity,
      topics: ["Parameter Uncertainty", "Error Analysis", "Real-Time Display"]
    },
    {
      number: 17,
      title: "Conclusions",
      description: "Framework for continuous modeling and recommendations",
      icon: CheckCircle2,
      topics: ["Framework", "Recommendations", "Best Practices"]
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Chapter Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of responsible modeling principles and practices
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <div key={chapter.number} style={{ animationDelay: `${index * 0.05}s` }}>
              <ChapterCard {...chapter} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
