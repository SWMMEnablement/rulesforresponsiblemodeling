export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedChapters?: number[];
}

export const glossaryTerms: GlossaryTerm[] = [
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
    term: "GIS",
    definition: "Geographic Information System: Software systems for managing, analyzing, and displaying spatial data. Essential for extracting catchment characteristics, creating model inputs, and visualizing results.",
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
    term: "KGE",
    definition: "Kling-Gupta Efficiency: A balanced objective function combining correlation, bias, and variability into a single metric. Ranges from negative infinity to 1 (perfect). Addresses some limitations of NSE.",
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
    term: "Nash-Sutcliffe Efficiency",
    definition: "Common objective function comparing model predictions to using the mean of observations. NSE=1 is perfect, NSE=0 means model performs no better than mean, NSE<0 means worse than mean.",
    relatedChapters: [9, 12]
  },
  {
    term: "NSE",
    definition: "Nash-Sutcliffe Efficiency: Common objective function comparing model predictions to using the mean of observations. NSE=1 is perfect, NSE=0 means model performs no better than mean.",
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
    term: "Parsimony",
    definition: "The principle advocating use of the simplest model that adequately represents the system, balancing detail against data availability and reducing unnecessary complexity. Also known as Occam's Razor.",
    relatedChapters: [4]
  },
  {
    term: "PBIAS",
    definition: "Percent Bias: Objective function measuring the average tendency of model predictions to be larger or smaller than observations, expressed as a percentage. Zero is ideal.",
    relatedChapters: [9]
  },
  {
    term: "PCSWMM",
    definition: "Professional interface for EPA SWMM developed by CHI, adding GIS connectivity, advanced visualization, automated calibration, and user-friendly tools while maintaining the SWMM computational engine.",
    relatedChapters: [8]
  },
  {
    term: "Return Period",
    definition: "The average time interval between events of a given magnitude or greater. A 100-year storm has a 1% chance of occurring in any given year.",
    relatedChapters: [6, 7]
  },
  {
    term: "RMSE",
    definition: "Root Mean Square Error: Objective function measuring the square root of average squared differences between predictions and observations. Lower values indicate better fit. Sensitive to large errors.",
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
    term: "SWMM",
    definition: "Storm Water Management Model: EPA's dynamic rainfall-runoff simulation model for urban drainage systems. Simulates hydrology, hydraulics, and water quality in storm sewers, combined sewers, and natural drainage.",
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
    definition: "The land area draining to a common outlet point. Also called a catchment or drainage basin.",
    relatedChapters: [1]
  }
];

// Create a lookup map for quick term searching
export const glossaryLookup = new Map<string, GlossaryTerm>(
  glossaryTerms.flatMap(term => {
    const entries: [string, GlossaryTerm][] = [[term.term.toLowerCase(), term]];
    // Add common variations
    if (term.term.includes('(')) {
      const baseTerm = term.term.split('(')[0].trim();
      entries.push([baseTerm.toLowerCase(), term]);
    }
    return entries;
  })
);

// Function to find a term (case-insensitive)
export const findGlossaryTerm = (searchTerm: string): GlossaryTerm | undefined => {
  return glossaryLookup.get(searchTerm.toLowerCase());
};
