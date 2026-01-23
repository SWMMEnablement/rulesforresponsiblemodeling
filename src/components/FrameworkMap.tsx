import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Gauge, 
  HelpCircle, 
  Database, 
  Settings, 
  Activity, 
  Waves, 
  Brain, 
  BarChart3,
  ArrowRight,
  X
} from "lucide-react";

interface Concept {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  chapters: { number: number; title: string }[];
  connections: string[];
  position: { x: number; y: number };
  color: string;
}

const concepts: Concept[] = [
  {
    id: "optimal-complexity",
    title: "Optimal Complexity",
    shortTitle: "Complexity",
    description: "Balance between model detail and computational efficiency - making things as simple as possible, but not simpler. The 'Goldilocks principle' of modeling.",
    icon: <Gauge className="w-5 h-5" />,
    chapters: [
      { number: 4, title: "Optimal Order of Model Complexity" },
      { number: 3, title: "The Ten Rules" },
      { number: 6, title: "Discretization" }
    ],
    connections: ["data-reliability", "uncertainty", "performance"],
    position: { x: 50, y: 15 },
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "uncertainty",
    title: "Uncertainty Quantification",
    shortTitle: "Uncertainty",
    description: "Understanding and communicating the reliability and confidence levels of model predictions. Essential for responsible decision-making.",
    icon: <HelpCircle className="w-5 h-5" />,
    chapters: [
      { number: 10, title: "Monte Carlo Analysis" },
      { number: 11, title: "Sensitivity Analysis" },
      { number: 17, title: "Philosophy & Ethics" }
    ],
    connections: ["optimal-complexity", "sensitivity", "performance", "data-reliability"],
    position: { x: 85, y: 35 },
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "data-reliability",
    title: "Data Reliability",
    shortTitle: "Data",
    description: "Ensuring input parameters and datasets are well-documented, validated, and appropriately categorized. Garbage in = garbage out.",
    icon: <Database className="w-5 h-5" />,
    chapters: [
      { number: 5, title: "Data Reliability Categories" },
      { number: 7, title: "GIS in Modeling" },
      { number: 8, title: "Calibration" }
    ],
    connections: ["optimal-complexity", "uncertainty", "parameter-opt", "continuous-sim"],
    position: { x: 15, y: 35 },
    color: "from-green-500 to-green-600"
  },
  {
    id: "parameter-opt",
    title: "Parameter Optimization",
    shortTitle: "Optimization",
    description: "Using advanced techniques like genetic algorithms to calibrate models for accurate predictions while avoiding overfitting.",
    icon: <Settings className="w-5 h-5" />,
    chapters: [
      { number: 8, title: "Calibration" },
      { number: 9, title: "Model Validation" },
      { number: 12, title: "Genetic Algorithms" }
    ],
    connections: ["data-reliability", "sensitivity", "performance", "fuzzy-logic"],
    position: { x: 15, y: 65 },
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "sensitivity",
    title: "Sensitivity Analysis",
    shortTitle: "Sensitivity",
    description: "Testing how changes in parameters affect model outputs to understand system behavior and identify critical inputs.",
    icon: <Activity className="w-5 h-5" />,
    chapters: [
      { number: 11, title: "Sensitivity Analysis" },
      { number: 10, title: "Monte Carlo Analysis" },
      { number: 8, title: "Calibration" }
    ],
    connections: ["uncertainty", "parameter-opt", "performance", "optimal-complexity"],
    position: { x: 85, y: 65 },
    color: "from-red-500 to-red-600"
  },
  {
    id: "continuous-sim",
    title: "Continuous Simulation",
    shortTitle: "Continuous",
    description: "Long-term modeling approach for understanding ecosystem impacts, sustainability, and cumulative effects over time.",
    icon: <Waves className="w-5 h-5" />,
    chapters: [
      { number: 15, title: "Continuous Simulation" },
      { number: 16, title: "Ecosystem Impacts" },
      { number: 6, title: "Discretization" }
    ],
    connections: ["data-reliability", "fuzzy-logic", "performance"],
    position: { x: 30, y: 85 },
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: "fuzzy-logic",
    title: "Fuzzy Logic Application",
    shortTitle: "Fuzzy Logic",
    description: "Handling imprecision and uncertainty through fuzzy reasoning techniques when crisp boundaries don't exist.",
    icon: <Brain className="w-5 h-5" />,
    chapters: [
      { number: 13, title: "Fuzzy Reasoning" },
      { number: 14, title: "Adaptive Neuro-Fuzzy" },
      { number: 10, title: "Monte Carlo Analysis" }
    ],
    connections: ["parameter-opt", "continuous-sim", "uncertainty"],
    position: { x: 70, y: 85 },
    color: "from-pink-500 to-pink-600"
  },
  {
    id: "performance",
    title: "Performance Evaluation",
    shortTitle: "Performance",
    description: "Comprehensive metrics and functions to assess model quality, reliability, and fitness for purpose.",
    icon: <BarChart3 className="w-5 h-5" />,
    chapters: [
      { number: 9, title: "Model Validation" },
      { number: 8, title: "Calibration" },
      { number: 3, title: "The Ten Rules" }
    ],
    connections: ["optimal-complexity", "uncertainty", "sensitivity", "parameter-opt", "continuous-sim"],
    position: { x: 50, y: 50 },
    color: "from-yellow-500 to-yellow-600"
  }
];

export const FrameworkMap = () => {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null);

  const getConnectionOpacity = (conceptId: string) => {
    if (!hoveredConcept && !selectedConcept) return 0.15;
    const activeConcept = selectedConcept || concepts.find(c => c.id === hoveredConcept);
    if (!activeConcept) return 0.15;
    if (activeConcept.id === conceptId || activeConcept.connections.includes(conceptId)) {
      return 0.8;
    }
    return 0.1;
  };

  const getNodeOpacity = (conceptId: string) => {
    if (!hoveredConcept && !selectedConcept) return 1;
    const activeConcept = selectedConcept || concepts.find(c => c.id === hoveredConcept);
    if (!activeConcept) return 1;
    if (activeConcept.id === conceptId || activeConcept.connections.includes(conceptId)) {
      return 1;
    }
    return 0.3;
  };

  // Generate connection lines between concepts
  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    const drawnConnections = new Set<string>();

    concepts.forEach(concept => {
      concept.connections.forEach(targetId => {
        const connectionKey = [concept.id, targetId].sort().join("-");
        if (drawnConnections.has(connectionKey)) return;
        drawnConnections.add(connectionKey);

        const target = concepts.find(c => c.id === targetId);
        if (!target) return;

        const isActive = 
          hoveredConcept === concept.id || 
          hoveredConcept === targetId ||
          selectedConcept?.id === concept.id ||
          selectedConcept?.id === targetId;

        lines.push(
          <line
            key={connectionKey}
            x1={`${concept.position.x}%`}
            y1={`${concept.position.y}%`}
            x2={`${target.position.x}%`}
            y2={`${target.position.y}%`}
            stroke="hsl(var(--primary))"
            strokeWidth={isActive ? 3 : 1.5}
            strokeOpacity={getConnectionOpacity(concept.id)}
            strokeDasharray={isActive ? "none" : "6,4"}
            className="transition-all duration-300"
          />
        );
      });
    });

    return lines;
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Framework Map
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore the interconnections between core modeling concepts. Click on any node to see related chapters.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="p-4 md:p-6 relative overflow-hidden bg-card/50 backdrop-blur">
              <div className="relative w-full aspect-[4/3] min-h-[400px]">
                {/* SVG for connections */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  {renderConnections()}
                </svg>

                {/* Concept nodes */}
                {concepts.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(selectedConcept?.id === concept.id ? null : concept)}
                    onMouseEnter={() => setHoveredConcept(concept.id)}
                    onMouseLeave={() => setHoveredConcept(null)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-10
                      ${selectedConcept?.id === concept.id ? 'scale-110 z-20' : 'hover:scale-105'}
                    `}
                    style={{
                      left: `${concept.position.x}%`,
                      top: `${concept.position.y}%`,
                      opacity: getNodeOpacity(concept.id)
                    }}
                  >
                    <div className={`
                      flex flex-col items-center gap-1 p-3 md:p-4 rounded-xl
                      bg-gradient-to-br ${concept.color} text-white
                      shadow-lg hover:shadow-xl
                      ${selectedConcept?.id === concept.id ? 'ring-4 ring-primary/50 ring-offset-2 ring-offset-background' : ''}
                    `}>
                      <div className="p-2 bg-white/20 rounded-lg">
                        {concept.icon}
                      </div>
                      <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                        {concept.shortTitle}
                      </span>
                    </div>
                  </button>
                ))}

                {/* Center label */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="text-xs text-muted-foreground/50 font-medium bg-background/80 px-2 py-1 rounded hidden md:block">
                    Click a node to explore
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-full min-h-[400px] flex flex-col">
              {selectedConcept ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedConcept.color} text-white`}>
                      {selectedConcept.icon}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedConcept(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {selectedConcept.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6">
                    {selectedConcept.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Connected Concepts
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedConcept.connections.map(connId => {
                        const conn = concepts.find(c => c.id === connId);
                        return conn ? (
                          <Badge 
                            key={connId} 
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setSelectedConcept(conn)}
                          >
                            {conn.shortTitle}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Related Chapters
                    </h4>
                    <div className="space-y-2">
                      {selectedConcept.chapters.map(chapter => (
                        <Link 
                          key={chapter.number}
                          to={`/chapter/${chapter.number}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                        >
                          <div>
                            <span className="text-xs text-primary font-medium">
                              Chapter {chapter.number}
                            </span>
                            <p className="text-sm text-foreground">
                              {chapter.title}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Explore the Framework
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Click on any concept node to see its description, connections, and related chapters.
                  </p>
                  <div className="mt-6 text-xs text-muted-foreground">
                    <span className="inline-block w-3 h-0.5 bg-primary/50 mr-2 align-middle"></span>
                    Lines show concept relationships
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {concepts.map(concept => (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${selectedConcept?.id === concept.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 hover:bg-muted text-foreground'
                }
              `}
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${concept.color}`} />
              <span className="text-sm font-medium">{concept.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
