import { FlashcardData } from "@/hooks/useSpacedRepetition";

export const flashcardData: FlashcardData[] = [
  // Chapter 1
  {
    id: "modeling-process",
    term: "The Modeling Process",
    definition: "A systematic approach to hydrological modeling involving problem definition, model selection, data collection, calibration, validation, and documentation.",
    chapter: 1,
  },
  {
    id: "calibration",
    term: "Calibration",
    definition: "The process of adjusting model parameters to match observed data. Should use a subset of available data, leaving independent data for validation.",
    chapter: 1,
  },
  {
    id: "validation",
    term: "Validation",
    definition: "Testing model performance on independent data not used in calibration to assess predictive capability and model credibility.",
    chapter: 1,
  },
  // Chapter 2
  {
    id: "discretization",
    term: "Discretization",
    definition: "The process of dividing space and time into computational elements (subcatchments, nodes, time steps) for numerical modeling.",
    chapter: 2,
  },
  {
    id: "cfl-condition",
    term: "CFL Condition",
    definition: "Courant-Friedrichs-Lewy condition: a numerical stability criterion requiring that the time step be small enough relative to spatial resolution and wave velocity.",
    chapter: 2,
  },
  {
    id: "epistemic-uncertainty",
    term: "Epistemic Uncertainty",
    definition: "Uncertainty due to lack of knowledge about the system. Can be reduced with better data, models, or understanding.",
    chapter: 2,
  },
  {
    id: "aleatory-uncertainty",
    term: "Aleatory Uncertainty",
    definition: "Uncertainty due to natural randomness and variability in the system. Cannot be eliminated even with perfect knowledge.",
    chapter: 2,
  },
  // Chapter 3
  {
    id: "gis",
    term: "GIS (Geographic Information System)",
    definition: "A system for capturing, storing, analyzing, and managing spatial and geographic data. Essential for extracting parameters in distributed hydrological models.",
    chapter: 3,
  },
  {
    id: "quality-control",
    term: "Data Quality Control",
    definition: "Systematic procedures to check data for errors, inconsistencies, and outliers before use in modeling. Includes range checks, temporal consistency, and spatial correlation tests.",
    chapter: 3,
  },
  // Chapter 4
  {
    id: "parsimony",
    term: "Parsimony (Occam's Razor)",
    definition: "The principle that models should be as simple as possible while still achieving their objectives. Simpler models are preferred over complex ones when performance is similar.",
    chapter: 4,
  },
  {
    id: "equifinality",
    term: "Equifinality",
    definition: "The phenomenon where different parameter sets produce similar model performance, making it difficult to identify a unique 'best' parameter set. Increases with model complexity.",
    chapter: 4,
  },
  {
    id: "sensitivity-analysis",
    term: "Sensitivity Analysis",
    definition: "Investigation of how model outputs respond to changes in input parameters. Used to identify critical parameters and simplify models.",
    chapter: 4,
  },
  {
    id: "identifiability",
    term: "Parameter Identifiability",
    definition: "The ability to uniquely determine parameter values from available data. Related to but distinct from sensitivity.",
    chapter: 4,
  },
  // Chapter 5
  {
    id: "continuous-simulation",
    term: "Continuous Simulation",
    definition: "Running models over extended periods to capture seasonal patterns, antecedent conditions, and long-term water balance. Contrasts with single-event modeling.",
    chapter: 5,
  },
  {
    id: "water-balance",
    term: "Water Balance",
    definition: "Accounting of all water entering, leaving, and stored in a system. Inputs - Outputs = Change in Storage. Essential for long-term model credibility.",
    chapter: 5,
  },
  {
    id: "baseflow",
    term: "Baseflow",
    definition: "The portion of streamflow derived from groundwater discharge. Critical for ecosystem health and often poorly represented in event-based models.",
    chapter: 5,
  },
  // Chapter 6
  {
    id: "stochastic-generation",
    term: "Stochastic Rainfall Generation",
    definition: "Using statistical models (e.g., Poisson cluster models) to create synthetic rainfall time series that preserve statistical properties of observed data.",
    chapter: 6,
  },
  {
    id: "disaggregation",
    term: "Temporal Disaggregation",
    definition: "Converting coarse temporal resolution data (e.g., daily) to finer resolution (e.g., hourly) while preserving statistical properties.",
    chapter: 6,
  },
  {
    id: "design-storm",
    term: "Design Storm",
    definition: "A synthetic rainfall event with specified return period and duration used for infrastructure design. Traditional approach being supplemented by stochastic ensembles.",
    chapter: 6,
  },
  // Chapter 7
  {
    id: "critical-storm-velocity",
    term: "Critical Storm Velocity",
    definition: "The storm movement speed that produces maximum runoff peak for a given catchment. Generally related to the inverse of time of concentration.",
    chapter: 7,
  },
  {
    id: "storm-kinematics",
    term: "Storm Kinematics",
    definition: "The study of storm motion (velocity and direction) and its effects on catchment response. Critical for peak flow prediction.",
    chapter: 7,
  },
  // Chapter 8
  {
    id: "pcswmm",
    term: "PCSWMM",
    definition: "A decision support system built on EPA SWMM, adding GIS integration, automated calibration, visualization, and scenario management capabilities.",
    chapter: 8,
  },
  {
    id: "scenario-analysis",
    term: "Scenario Analysis",
    definition: "Systematic comparison of management alternatives to evaluate trade-offs and support decision-making.",
    chapter: 8,
  },
  // Chapter 9
  {
    id: "nash-sutcliffe",
    term: "Nash-Sutcliffe Efficiency (NSE)",
    definition: "Performance metric comparing model predictions to observations. NSE = 1 is perfect, NSE = 0 means model is no better than mean of observations, NSE < 0 means model is worse than mean.",
    chapter: 9,
  },
  {
    id: "rmse",
    term: "RMSE (Root Mean Square Error)",
    definition: "Square root of average squared differences between predicted and observed values. Sensitive to large errors. Lower is better.",
    chapter: 9,
  },
  {
    id: "r-squared",
    term: "R² (Coefficient of Determination)",
    definition: "Proportion of variance in observations explained by the model. Range 0-1. Note: can be high even if model is biased.",
    chapter: 9,
  },
  {
    id: "pbias",
    term: "PBIAS (Percent Bias)",
    definition: "Average tendency of model to over- or under-predict. Positive values indicate underestimation, negative indicate overestimation. Optimal is 0.",
    chapter: 9,
  },
  {
    id: "kge",
    term: "KGE (Kling-Gupta Efficiency)",
    definition: "Composite metric decomposing performance into correlation, bias ratio, and variability ratio. Addresses some NSE limitations.",
    chapter: 9,
  },
  {
    id: "pareto-optimal",
    term: "Pareto-Optimal Solution",
    definition: "A solution where improving one objective necessarily worsens another. Reveals trade-offs in multi-objective optimization.",
    chapter: 9,
  },
  // Chapter 10
  {
    id: "local-sensitivity",
    term: "Local Sensitivity Analysis",
    definition: "One-at-a-time parameter perturbation around a base case. Computationally efficient but doesn't capture interactions.",
    chapter: 10,
  },
  {
    id: "global-sensitivity",
    term: "Global Sensitivity Analysis",
    definition: "Variance-based methods exploring entire parameter space. Captures interactions but computationally expensive.",
    chapter: 10,
  },
  {
    id: "sobol-indices",
    term: "Sobol Indices",
    definition: "Variance-based sensitivity measures decomposing output variance into contributions from individual parameters and their interactions.",
    chapter: 10,
  },
  {
    id: "morris-screening",
    term: "Morris Screening",
    definition: "Efficient global sensitivity method using elementary effects to identify influential parameters before detailed analysis.",
    chapter: 10,
  },
  // Chapter 11
  {
    id: "systematic-error",
    term: "Systematic Error",
    definition: "Consistent bias in model predictions (e.g., always over-predicting peaks). Can often be corrected through calibration.",
    chapter: 11,
  },
  {
    id: "random-error",
    term: "Random Error",
    definition: "Unpredictable variations in model predictions around true values. Cannot be eliminated through calibration.",
    chapter: 11,
  },
  {
    id: "cross-validation",
    term: "Cross-Validation",
    definition: "Partitioning data into multiple subsets for iterative calibration and validation. Useful when data is limited.",
    chapter: 11,
  },
  // Chapter 12
  {
    id: "gradient-based",
    term: "Gradient-Based Optimization",
    definition: "Optimization using derivatives to find local optima efficiently. Fast but can get stuck in local minima.",
    chapter: 12,
  },
  {
    id: "genetic-algorithm",
    term: "Genetic Algorithm",
    definition: "Global optimization inspired by natural selection. Uses populations, crossover, and mutation to explore parameter space.",
    chapter: 12,
  },
  {
    id: "regularization",
    term: "Regularization",
    definition: "Constraining optimization to prevent overfitting by penalizing extreme or physically unrealistic parameter values.",
    chapter: 12,
  },
  // Chapter 13
  {
    id: "monte-carlo",
    term: "Monte Carlo Simulation",
    definition: "Repeated model runs with randomly sampled parameter/input values to quantify output uncertainty through ensemble statistics.",
    chapter: 13,
  },
  {
    id: "latin-hypercube",
    term: "Latin Hypercube Sampling",
    definition: "Stratified sampling ensuring even coverage of parameter space. More efficient than pure random sampling for uncertainty analysis.",
    chapter: 13,
  },
  {
    id: "confidence-interval",
    term: "Confidence Interval",
    definition: "Range within which the true value is expected to lie with specified probability (e.g., 95%). Quantifies prediction uncertainty.",
    chapter: 13,
  },
  // Chapter 14
  {
    id: "environmental-flows",
    term: "Environmental Flows",
    definition: "Water quantity, timing, and quality required to sustain freshwater ecosystems and human livelihoods dependent on them.",
    chapter: 14,
  },
  {
    id: "flow-duration-curve",
    term: "Flow Duration Curve",
    definition: "Plot showing percentage of time that flow exceeds given values. Useful for assessing low-flow conditions affecting ecosystems.",
    chapter: 14,
  },
  {
    id: "ecosystem-services",
    term: "Ecosystem Services",
    definition: "Benefits people obtain from ecosystems (water purification, flood regulation, habitat). Affected by hydrological changes.",
    chapter: 14,
  },
  // Chapter 15
  {
    id: "fuzzy-sets",
    term: "Fuzzy Sets",
    definition: "Sets where elements have degrees of membership (0 to 1) rather than binary inclusion/exclusion. Handles imprecise information.",
    chapter: 15,
  },
  {
    id: "membership-function",
    term: "Membership Function",
    definition: "Function defining degree of membership in a fuzzy set for each value. Examples: triangular, trapezoidal, Gaussian.",
    chapter: 15,
  },
  {
    id: "defuzzification",
    term: "Defuzzification",
    definition: "Converting fuzzy output back to crisp value for decision-making. Methods include centroid, maximum, and mean of maximum.",
    chapter: 15,
  },
  {
    id: "linguistic-variables",
    term: "Linguistic Variables",
    definition: "Variables described by words rather than numbers (e.g., 'high', 'medium', 'low'). Useful for encoding expert knowledge.",
    chapter: 15,
  },
  // Chapter 16
  {
    id: "ensemble-forecasting",
    term: "Ensemble Forecasting",
    definition: "Running multiple forecasts with varied parameters/inputs to quantify prediction uncertainty in real-time operations.",
    chapter: 16,
  },
  {
    id: "bayesian-updating",
    term: "Bayesian Updating",
    definition: "Revising probability distributions as new observations arrive, improving forecast accuracy in real-time.",
    chapter: 16,
  },
  {
    id: "forecast-uncertainty",
    term: "Forecast Uncertainty",
    definition: "Combined uncertainty from parameters, inputs, and model structure in real-time predictions. Should be displayed alongside forecasts.",
    chapter: 16,
  },
  // Chapter 17
  {
    id: "responsible-modeling",
    term: "Responsible Modeling",
    definition: "Framework emphasizing transparency, honesty about limitations, stakeholder engagement, and ethical consideration of long-term impacts.",
    chapter: 17,
  },
  {
    id: "model-transparency",
    term: "Model Transparency",
    definition: "Clear documentation and communication of model assumptions, limitations, uncertainties, and appropriate use cases.",
    chapter: 17,
  },
];