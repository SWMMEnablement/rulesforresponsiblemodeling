import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface GlossaryTerm {
  term: string;
  definition: string;
  relatedChapters?: number[];
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Aleatory Uncertainty",
    definition: "Uncertainty arising from inherent randomness and natural variability in systems that cannot be reduced through better data or knowledge. Examples include precipitation variability, turbulence, and measurement noise.",
    relatedChapters: [2, 3]
  },
  {
    term: "Baseflow",
    definition: "The sustained flow in a stream during dry periods, primarily fed by groundwater discharge. Important for ecosystem health and long-term water availability.",
    relatedChapters: [5, 14]
  },
  {
    term: "Calibration",
    definition: "The process of adjusting model parameters so that model outputs match observed historical data as closely as possible. Should be followed by independent validation.",
    relatedChapters: [5, 9, 12]
  },
  {
    term: "Catchment",
    definition: "The land area that drains water to a common outlet point, such as a stream gauge or drainage inlet. Also called a watershed or drainage basin.",
    relatedChapters: [1, 3, 4]
  },
  {
    term: "CFL Condition",
    definition: "Courant-Friedrichs-Lewy condition: A numerical stability criterion requiring that the computational time step be small enough relative to spatial discretization and flow velocities to ensure stable solutions.",
    relatedChapters: [2]
  },
  {
    term: "Confidence Interval",
    definition: "A range of values that is likely to contain the true value of a parameter or prediction with a specified probability (e.g., 95% confidence). Represents prediction uncertainty.",
    relatedChapters: [2, 16]
  },
  {
    term: "Continuous Simulation",
    definition: "Running a model over extended periods (months to years) to capture temporal dynamics, seasonal variations, water balance, and antecedent conditions. Contrasts with single-event modeling.",
    relatedChapters: [5, 14]
  },
  {
    term: "Defuzzification",
    definition: "Converting fuzzy inference results into crisp numerical values for control actions. Common methods include centroid (center of area) and maximum membership.",
    relatedChapters: [15]
  },
  {
    term: "Design Storm",
    definition: "A synthetic rainfall event with specified return period and characteristics used for infrastructure sizing. May not capture all critical storm behaviors (e.g., movement effects).",
    relatedChapters: [6, 7]
  },
  {
    term: "Deterministic Model",
    definition: "A model that produces the same output for a given set of inputs every time it runs. Does not explicitly include randomness, though uncertainty analysis is still essential.",
    relatedChapters: [1, 2]
  },
  {
    term: "Disaggregation",
    definition: "Converting coarse temporal resolution data (e.g., daily rainfall) into finer resolution (e.g., 5-minute) needed for event-based modeling while preserving statistical properties.",
    relatedChapters: [6]
  },
  {
    term: "Discretization",
    definition: "Dividing continuous space or time into discrete units for computation. Spatial discretization creates subcatchments; temporal discretization defines time steps.",
    relatedChapters: [2, 4]
  },
  {
    term: "Ensemble Forecasting",
    definition: "Running a model multiple times with systematically varied inputs and parameters to generate a range of equally-plausible outcomes, representing prediction uncertainty.",
    relatedChapters: [16]
  },
  {
    term: "Epistemic Uncertainty",
    definition: "Uncertainty arising from incomplete knowledge that can potentially be reduced through better data, measurements, or understanding. Examples include parameter uncertainty and model structural error.",
    relatedChapters: [2, 3]
  },
  {
    term: "Equifinality",
    definition: "The phenomenon where multiple different parameter combinations produce equally good fits to observed data, making it impossible to identify a single 'correct' parameter set and increasing prediction uncertainty.",
    relatedChapters: [4, 12]
  },
  {
    term: "Fuzzy Logic",
    definition: "A reasoning framework allowing partial membership (degrees between 0 and 1) rather than crisp True/False values. Useful for handling imprecise information and incorporating expert knowledge.",
    relatedChapters: [15]
  },
  {
    term: "GIS (Geographic Information System)",
    definition: "Software systems for managing, analyzing, and displaying spatial data. Essential for extracting catchment characteristics, creating model inputs, and visualizing results.",
    relatedChapters: [3, 8]
  },
  {
    term: "Goodness of Fit",
    definition: "A measure of how well model predictions match observed data. Quantified by objective functions such as Nash-Sutcliffe Efficiency, RMSE, or R-squared.",
    relatedChapters: [9, 12]
  },
  {
    term: "Hydrograph",
    definition: "A graph showing flow rate (discharge) versus time at a specific location. Used to visualize runoff response to rainfall events and compare model predictions to observations.",
    relatedChapters: [1, 7]
  },
  {
    term: "Infiltration",
    definition: "The process by which water enters the soil surface. A key process in rainfall-runoff modeling affecting how much precipitation becomes surface runoff.",
    relatedChapters: [1, 5]
  },
  {
    term: "KGE (Kling-Gupta Efficiency)",
    definition: "A balanced objective function combining correlation, bias, and variability into a single metric. Ranges from negative infinity to 1 (perfect). Addresses some limitations of NSE.",
    relatedChapters: [9]
  },
  {
    term: "Manning's Roughness",
    definition: "A coefficient representing the hydraulic roughness of a channel or surface, affecting flow velocity. Higher values indicate rougher surfaces that slow flow.",
    relatedChapters: [1, 12]
  },
  {
    term: "Monte Carlo Simulation",
    definition: "A technique using repeated random sampling to quantify uncertainty by running a model many times with parameters drawn from probability distributions.",
    relatedChapters: [2, 3, 13]
  },
  {
    term: "Multi-Objective Optimization",
    definition: "Calibration approach considering multiple competing performance criteria simultaneously. Produces Pareto-optimal solutions showing trade-offs between objectives.",
    relatedChapters: [9, 12]
  },
  {
    term: "Nash-Sutcliffe Efficiency (NSE)",
    definition: "Common objective function comparing model predictions to using the mean of observations. NSE=1 is perfect, NSE=0 means model performs no better than mean, NSE<0 means worse than mean.",
    relatedChapters: [9, 12]
  },
  {
    term: "Objective Function",
    definition: "A mathematical measure quantifying how well model predictions match observations. Used to guide calibration and assess model performance.",
    relatedChapters: [9, 12]
  },
  {
    term: "Pareto-Optimal Solution",
    definition: "In multi-objective optimization, a solution where improving one objective worsens another. The Pareto set shows trade-offs with no single solution universally best.",
    relatedChapters: [9, 12]
  },
  {
    term: "Parsimony (Occam's Razor)",
    definition: "The principle advocating use of the simplest model that adequately represents the system, balancing detail against data availability and reducing unnecessary complexity.",
    relatedChapters: [4]
  },
  {
    term: "PBIAS (Percent Bias)",
    definition: "Objective function measuring the average tendency of model predictions to be larger or smaller than observations, expressed as a percentage. Zero is ideal.",
    relatedChapters: [9]
  },
  {
    term: "PCSWMM",
    definition: "Professional interface for EPA SWMM developed by CHI, adding GIS connectivity, advanced visualization, automated calibration, and user-friendly tools while maintaining the SWMM computational engine.",
    relatedChapters: [8]
  },
  {
    term: "R² (Coefficient of Determination)",
    definition: "Statistical measure of how well predictions explain the variance in observations. Ranges from 0 to 1, with 1 indicating perfect prediction. Can be misleading if used alone.",
    relatedChapters: [9]
  },
  {
    term: "Return Period",
    definition: "The average time interval between events of a given magnitude or greater. A 100-year storm has a 1% chance of occurring in any given year.",
    relatedChapters: [6, 7]
  },
  {
    term: "RLS (Row Level Security)",
    definition: "Database security feature controlling which rows users can access based on policies. Important for protecting sensitive model data and results.",
    relatedChapters: []
  },
  {
    term: "RMSE (Root Mean Square Error)",
    definition: "Objective function measuring the square root of average squared differences between predictions and observations. Lower values indicate better fit. Sensitive to large errors.",
    relatedChapters: [9]
  },
  {
    term: "Runoff",
    definition: "Water that flows over the land surface toward streams and drainage systems after precipitation. Generated when rainfall exceeds infiltration capacity or soil becomes saturated.",
    relatedChapters: [1, 5]
  },
  {
    term: "Sensitivity Analysis",
    definition: "Systematic investigation of how model outputs respond to changes in input parameters. Identifies critical parameters requiring careful calibration versus those that can use literature values.",
    relatedChapters: [4, 10, 13]
  },
  {
    term: "Split-Sample Validation",
    definition: "Calibrating a model on one time period and testing performance on an independent period to verify predictive capability and guard against overfitting.",
    relatedChapters: [5, 11]
  },
  {
    term: "Stochastic Model",
    definition: "A model explicitly incorporating randomness and producing different outputs for the same inputs across multiple runs. Used for uncertainty analysis and synthetic data generation.",
    relatedChapters: [6]
  },
  {
    term: "Storm Cell",
    definition: "A localized region of intense precipitation within a larger weather system. Storm cell movement affects timing and magnitude of catchment response.",
    relatedChapters: [7]
  },
  {
    term: "Subcatchment",
    definition: "A discrete spatial unit in a distributed hydrological model representing an area with relatively homogeneous characteristics that drains to a common point.",
    relatedChapters: [2, 4]
  },
  {
    term: "SWMM (Storm Water Management Model)",
    definition: "EPA's dynamic rainfall-runoff simulation model for urban drainage systems. Simulates hydrology, hydraulics, and water quality in storm sewers, combined sewers, and natural drainage.",
    relatedChapters: [8]
  },
  {
    term: "Time of Concentration",
    definition: "The time required for water to travel from the hydraulically most distant point in a watershed to the outlet. Critical for understanding catchment response timing.",
    relatedChapters: [7]
  },
  {
    term: "Time Step",
    definition: "The temporal resolution at which model calculations are performed. Must be small enough to capture fastest relevant processes (typically infiltration or routing) for numerical stability.",
    relatedChapters: [2]
  },
  {
    term: "Uncertainty Analysis",
    definition: "Systematic investigation and quantification of all sources of uncertainty affecting model predictions. Essential for responsible modeling and honest communication of reliability.",
    relatedChapters: [2, 3, 16]
  },
  {
    term: "Validation",
    definition: "Testing model performance using independent data not used in calibration to assess predictive capability. Essential for establishing credibility and identifying overfitting.",
    relatedChapters: [5, 11]
  },
  {
    term: "Water Balance",
    definition: "Accounting of all water inputs, outputs, and storage changes in a system. A fundamental check on model consistency: inputs should equal outputs plus change in storage.",
    relatedChapters: [5, 14]
  },
  {
    term: "Watershed",
    definition: "See Catchment. The land area draining to a common outlet point.",
    relatedChapters: [1]
  }
];

const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return glossaryTerms;
    
    const search = searchTerm.toLowerCase();
    return glossaryTerms.filter(
      item => 
        item.term.toLowerCase().includes(search) || 
        item.definition.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  // Group by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-primary-light to-secondary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Modeling Glossary
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive definitions of key terminology used throughout the Rules for Responsible Modeling textbook.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Search Bar */}
        <div className="mb-12">
          <Card className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for terms or definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
            </p>
          </Card>
        </div>

        {/* Quick Jump Navigation */}
        {letters.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <Button
                key={letter}
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.getElementById(`letter-${letter}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {letter}
              </Button>
            ))}
          </div>
        )}

        {/* Terms by Letter */}
        {filteredTerms.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No terms found matching "{searchTerm}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </Card>
        ) : (
          <div className="space-y-12">
            {letters.map(letter => (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-8">
                <h2 className="text-3xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary/20">
                  {letter}
                </h2>
                <div className="space-y-6">
                  {groupedTerms[letter].map(item => (
                    <Card key={item.term} className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {item.term}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {item.definition}
                      </p>
                      {item.relatedChapters && item.relatedChapters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="text-sm text-muted-foreground">Related chapters:</span>
                          {item.relatedChapters.map(chapterNum => (
                            <Link key={chapterNum} to={`/chapter/${chapterNum}`}>
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                Chapter {chapterNum}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-16 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Return to Book Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 px-6 mt-16 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Glossary terms compiled from <em>Rules for Responsible Modeling</em> by William James (4th Edition, 2005)
            <br />
            Published by CHI (Computational Hydraulics International)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Glossary;
