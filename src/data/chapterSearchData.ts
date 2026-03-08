// Static search index for full-text search across all chapter content
export interface ChapterSearchEntry {
  id: string;
  chapter: number;
  title: string;
  section: string;
  content: string;
  type: "concept" | "rule" | "principle" | "definition" | "example";
}

export const chapterSearchData: ChapterSearchEntry[] = [
  // Chapter 1 - Introduction
  { id: "c1-what-is-model", chapter: 1, title: "Introduction", section: "What is a Model?", content: "A model is a simplified representation of a complex system designed to help us understand, predict, and make decisions about real-world phenomena. In hydrological and environmental modeling, we create mathematical representations of water systems to solve practical problems.", type: "definition" },
  { id: "c1-why-model", chapter: 1, title: "Introduction", section: "Why We Model", content: "Models allow us to test hypotheses without expensive field experiments, predict future conditions under various scenarios, optimize designs for infrastructure and management systems, understand complex interactions between system components, and communicate technical concepts to stakeholders.", type: "concept" },
  { id: "c1-responsible", chapter: 1, title: "Introduction", section: "Responsible Modeling", content: "Responsible modeling requires understanding limitations, documenting assumptions, and communicating uncertainty honestly to stakeholders and decision-makers.", type: "principle" },
  { id: "c1-box-quote", chapter: 1, title: "Introduction", section: "All Models Are Wrong", content: "All models are wrong, though some may be said to be useful. George Box's famous axiom reminds us that every model is an approximation of reality.", type: "rule" },

  // Chapter 2 - Understanding Uncertainty
  { id: "c2-epistemic", chapter: 2, title: "Understanding Uncertainty", section: "Epistemic Uncertainty", content: "Epistemic uncertainty arises from lack of knowledge about the system. It can be reduced with better data, models, or understanding. This includes parameter uncertainty, structural uncertainty, and input data uncertainty.", type: "definition" },
  { id: "c2-aleatory", chapter: 2, title: "Understanding Uncertainty", section: "Aleatory Uncertainty", content: "Aleatory uncertainty is due to natural randomness and variability in the system. It cannot be eliminated even with perfect knowledge. Natural rainfall variability is a classic example.", type: "definition" },
  { id: "c2-discretization", chapter: 2, title: "Understanding Uncertainty", section: "Discretization", content: "Discretization is the process of dividing space and time into computational elements such as subcatchments, nodes, and time steps for numerical modeling. The CFL condition is a critical stability criterion.", type: "concept" },
  { id: "c2-cfl", chapter: 2, title: "Understanding Uncertainty", section: "CFL Condition", content: "Courant-Friedrichs-Lewy condition: a numerical stability criterion requiring that the time step be small enough relative to spatial resolution and wave velocity.", type: "definition" },

  // Chapter 3 - Data Quality and Sources
  { id: "c3-data-quality", chapter: 3, title: "Data Quality and Sources", section: "Data Quality", content: "Data quality determines model reliability. Garbage in, gospel out — poor data produces unreliable results that are often presented with unwarranted confidence.", type: "principle" },
  { id: "c3-rain-gauge", chapter: 3, title: "Data Quality and Sources", section: "Rain Gauge Density", content: "Rain gauge density directly affects model accuracy. Sparse gauge networks miss spatial variability in rainfall. One gauge per subcatchment is ideal but rarely achieved.", type: "concept" },
  { id: "c3-data-vintage", chapter: 3, title: "Data Quality and Sources", section: "Data Vintage", content: "Data ages and loses relevance. Land use changes, climate shifts, and infrastructure modifications can make historical data less applicable to current conditions.", type: "concept" },
  { id: "c3-gis", chapter: 3, title: "Data Quality and Sources", section: "GIS Integration", content: "Geographic Information Systems provide spatial data for model construction including elevation, land use, soil types, and drainage infrastructure.", type: "definition" },

  // Chapter 4 - Model Complexity
  { id: "c4-optimal-complexity", chapter: 4, title: "Model Complexity", section: "Optimal Complexity", content: "There exists an optimal level of model complexity beyond which adding detail reduces reliability. The complexity-reliability curve shows diminishing returns and eventual degradation as parameters exceed available calibration data.", type: "rule" },
  { id: "c4-parsimony", chapter: 4, title: "Model Complexity", section: "Principle of Parsimony", content: "Things should be made as simple as possible, but not any simpler. Einstein's principle applies directly to modeling — use the minimum complexity needed to answer the question.", type: "principle" },
  { id: "c4-overparameterization", chapter: 4, title: "Model Complexity", section: "Overparameterization", content: "Having more parameters than can be supported by available calibration data leads to equifinality — multiple parameter sets giving equally good fits but different predictions.", type: "concept" },
  { id: "c4-subcatchments", chapter: 4, title: "Model Complexity", section: "Subcatchment Delineation", content: "The number of subcatchments should be proportional to available data density and purpose. More subcatchments require more data and more calibration effort.", type: "concept" },

  // Chapter 5 - Continuous Simulation
  { id: "c5-continuous", chapter: 5, title: "Continuous Simulation", section: "Continuous vs Event-Based", content: "Continuous simulation models the full water cycle over extended periods including dry weather, capturing antecedent moisture conditions and seasonal variations that event-based models miss.", type: "concept" },
  { id: "c5-antecedent", chapter: 5, title: "Continuous Simulation", section: "Antecedent Conditions", content: "Antecedent moisture conditions before a storm event significantly affect runoff response. Continuous simulation naturally tracks these conditions rather than assuming them.", type: "concept" },
  { id: "c5-long-term", chapter: 5, title: "Continuous Simulation", section: "Long-Term Statistics", content: "Continuous simulation can generate frequency distributions of responses rather than designing for a single event, providing more robust risk assessment.", type: "principle" },

  // Chapter 6 - Rainfall Analysis
  { id: "c6-rainfall", chapter: 6, title: "Rainfall Analysis", section: "Rainfall Data", content: "Rainfall is the primary driver of urban drainage models. The spatial and temporal resolution of rainfall data fundamentally limits model accuracy.", type: "principle" },
  { id: "c6-idf", chapter: 6, title: "Rainfall Analysis", section: "IDF Curves", content: "Intensity-Duration-Frequency curves relate storm characteristics and are used for design storms. However, they represent statistical averages, not actual storm events.", type: "definition" },
  { id: "c6-design-storms", chapter: 6, title: "Rainfall Analysis", section: "Design Storms", content: "Design storms are synthetic rainfall patterns used for engineering design. They may not represent the temporal and spatial variability of real storms.", type: "concept" },

  // Chapter 7 - Storm Spatial Structure
  { id: "c7-spatial", chapter: 7, title: "Storm Spatial Structure", section: "Spatial Variability", content: "Storms have complex spatial structures that a single rain gauge cannot capture. The assumption of uniform rainfall over a catchment introduces systematic errors.", type: "concept" },
  { id: "c7-radar", chapter: 7, title: "Storm Spatial Structure", section: "Radar Rainfall", content: "Weather radar provides spatial rainfall estimates but requires ground-truthing with rain gauges. Radar estimates have their own uncertainties.", type: "concept" },

  // Chapter 8 - Decision Support Systems
  { id: "c8-dss", chapter: 8, title: "Decision Support Systems", section: "Decision Support", content: "Models should serve as decision support tools, not decision-making tools. The modeler and stakeholders must interpret results in context.", type: "principle" },
  { id: "c8-stakeholder", chapter: 8, title: "Decision Support Systems", section: "Stakeholder Communication", content: "Communicating model results and their limitations to non-technical stakeholders is as important as the modeling itself. Translate uncertainty into terms decision-makers understand.", type: "principle" },

  // Chapter 9 - Objective Functions
  { id: "c9-objective", chapter: 9, title: "Objective Functions", section: "Objective Functions", content: "The choice of objective function determines what aspects of system behavior the model will best reproduce. Nash-Sutcliffe efficiency, RMSE, and volume error each emphasize different characteristics.", type: "concept" },
  { id: "c9-rule7", chapter: 9, title: "Objective Functions", section: "Calibration Rule", content: "Rule 7: Calibrate only sensitive parameters, and then only against relevant events for which you have good, short-term observed data. Don't calibrate against long-term averages.", type: "rule" },
  { id: "c9-multi-objective", chapter: 9, title: "Objective Functions", section: "Multi-Objective Calibration", content: "Using multiple objective functions reveals trade-offs in model performance and prevents over-optimizing for one aspect at the expense of others.", type: "concept" },

  // Chapter 10 - Uncertainty Analysis
  { id: "c10-uncertainty", chapter: 10, title: "Uncertainty Analysis", section: "Uncertainty Quantification", content: "Every model result should include an estimate of uncertainty. Monte Carlo simulation, GLUE, and formal Bayesian methods provide frameworks for uncertainty quantification.", type: "principle" },
  { id: "c10-monte-carlo", chapter: 10, title: "Uncertainty Analysis", section: "Monte Carlo Methods", content: "Monte Carlo simulation generates thousands of parameter combinations to map the range of plausible model outputs and quantify prediction uncertainty.", type: "definition" },
  { id: "c10-glue", chapter: 10, title: "Uncertainty Analysis", section: "GLUE Methodology", content: "Generalized Likelihood Uncertainty Estimation identifies behavioral parameter sets that produce acceptable model performance, acknowledging equifinality.", type: "definition" },

  // Chapter 11 - Sensitivity Analysis
  { id: "c11-sensitivity", chapter: 11, title: "Sensitivity Analysis", section: "Sensitivity Analysis", content: "Sensitivity analysis identifies which parameters most influence model outputs. Focus calibration effort on sensitive parameters — adjusting insensitive parameters wastes time and adds noise.", type: "principle" },
  { id: "c11-oat", chapter: 11, title: "Sensitivity Analysis", section: "One-at-a-Time", content: "One-at-a-time sensitivity analysis varies one parameter while holding others fixed. Simple but misses parameter interactions.", type: "concept" },
  { id: "c11-global", chapter: 11, title: "Sensitivity Analysis", section: "Global Methods", content: "Global sensitivity analysis methods like Morris and Sobol explore the full parameter space simultaneously, revealing interactions between parameters.", type: "concept" },

  // Chapter 12 - State Variable Representation
  { id: "c12-state-variables", chapter: 12, title: "State Variable Representation", section: "State Variables", content: "State variables describe the condition of the system at any point in time. Proper representation of state variables is essential for continuous simulation.", type: "definition" },
  { id: "c12-initial-conditions", chapter: 12, title: "State Variable Representation", section: "Initial Conditions", content: "Initial conditions can significantly affect simulation results, especially for short simulations. Use warm-up periods to minimize their influence.", type: "concept" },

  // Chapter 13 - Performance Metrics
  { id: "c13-metrics", chapter: 13, title: "Performance Metrics", section: "Performance Evaluation", content: "Multiple performance metrics should be used to evaluate model performance. No single metric captures all aspects of model behavior.", type: "principle" },
  { id: "c13-nash-sutcliffe", chapter: 13, title: "Performance Metrics", section: "Nash-Sutcliffe Efficiency", content: "Nash-Sutcliffe efficiency compares model predictions to the observed mean. Values near 1 indicate excellent performance; values below 0 indicate the mean is a better predictor.", type: "definition" },
  { id: "c13-visual", chapter: 13, title: "Performance Metrics", section: "Visual Assessment", content: "Statistical metrics should always be accompanied by visual comparison of observed and simulated hydrographs. Statistics can be misleading without graphical context.", type: "principle" },

  // Chapter 14 - Optimization Techniques
  { id: "c14-optimization", chapter: 14, title: "Optimization Techniques", section: "Automatic Calibration", content: "Automated optimization can efficiently search parameter space but may find local optima. Manual calibration and optimization should complement each other.", type: "concept" },
  { id: "c14-equifinality", chapter: 14, title: "Optimization Techniques", section: "Equifinality", content: "Multiple parameter sets can produce equally good fits to observed data but give different predictions. This equifinality problem is fundamental and cannot be eliminated by better optimization.", type: "concept" },

  // Chapter 15 - Fuzzy Logic Applications
  { id: "c15-fuzzy", chapter: 15, title: "Fuzzy Logic Applications", section: "Fuzzy Logic", content: "Fuzzy logic provides a framework for incorporating expert knowledge and linguistic variables into modeling decisions, handling the inherent vagueness of real-world classifications.", type: "concept" },

  // Chapter 16 - Model Error Analysis
  { id: "c16-error", chapter: 16, title: "Model Error Analysis", section: "Error Sources", content: "Model errors arise from input data errors, model structure errors, parameter errors, and numerical errors. Understanding the dominant error source guides improvement efforts.", type: "concept" },
  { id: "c16-precision-illusion", chapter: 16, title: "Model Error Analysis", section: "Precision Illusion", content: "Reporting model results to many significant figures creates an illusion of precision. Results should be reported with appropriate significant figures reflecting actual uncertainty.", type: "principle" },
  { id: "c16-validation", chapter: 16, title: "Model Error Analysis", section: "Split-Sample Validation", content: "Split-sample validation tests model performance on data not used for calibration. Without validation, there is no evidence the model can predict outside calibration conditions.", type: "principle" },

  // Chapter 17 - Rules for Responsible Modeling
  { id: "c17-rule1", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 1: Know Your Purpose", content: "Rule 1: Know your purpose before you start. Define what question the model must answer before selecting software, building the model, or collecting data.", type: "rule" },
  { id: "c17-rule2", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 2: Simple as Possible", content: "Rule 2: Make the model as simple as possible, but not simpler. Match complexity to purpose and data availability. More complex is not more reliable.", type: "rule" },
  { id: "c17-rule3", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 3: Document Everything", content: "Rule 3: Document everything. Every assumption, every data source, every parameter value, every decision. Future users need to understand what was done and why.", type: "rule" },
  { id: "c17-rule4", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 4: Validate", content: "Rule 4: Always validate. A model that has not been tested against independent data has unknown predictive capability. Calibration alone is not sufficient.", type: "rule" },
  { id: "c17-rule5", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 5: Quantify Uncertainty", content: "Rule 5: Quantify uncertainty. Every model prediction should include a statement of confidence. Single-valued predictions without uncertainty bounds are incomplete.", type: "rule" },
  { id: "c17-rule6", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 6: Sensitivity First", content: "Rule 6: Do sensitivity analysis first. Identify which parameters matter before spending time calibrating parameters that don't influence results.", type: "rule" },
  { id: "c17-rule7", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 7: Calibrate Wisely", content: "Rule 7: Calibrate only sensitive parameters, and then only against relevant events for which you have good, short-term observed data.", type: "rule" },
  { id: "c17-rule8", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 8: Communicate Honestly", content: "Rule 8: Communicate results honestly. Tell stakeholders what the model can and cannot do. Don't let precision masquerade as accuracy.", type: "rule" },
  { id: "c17-rule9", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 9: Review and Audit", content: "Rule 9: Subject models to independent review. Peer review catches errors and assumptions that the original modeler cannot see.", type: "rule" },
  { id: "c17-rule10", chapter: 17, title: "Rules for Responsible Modeling", section: "Rule 10: Professional Responsibility", content: "Rule 10: Accept professional responsibility. The modeler is responsible for the model's fitness for purpose, not the software vendor, not the data provider.", type: "rule" },

  // Cross-cutting concepts
  { id: "x-swmm5", chapter: 4, title: "SWMM5", section: "Software Applications", content: "SWMM5 (Storm Water Management Model) is the most widely used urban drainage model. Understanding how James's rules apply to SWMM5 is essential for responsible modeling practice.", type: "example" },
  { id: "x-icm", chapter: 4, title: "ICM", section: "Software Applications", content: "ICM (InfoWorks ICM) provides integrated catchment modeling capabilities. Translation of James's principles to ICM-specific workflows requires understanding both the theory and the software.", type: "example" },
  { id: "x-garbage-gospel", chapter: 3, title: "Data Quality", section: "Garbage In, Gospel Out", content: "Unlike the common 'garbage in, garbage out,' James warns of 'garbage in, gospel out' — where poor data produces results that are treated as authoritative truth because they come from a computer model.", type: "principle" },
  { id: "x-complexity-curve", chapter: 4, title: "Model Complexity", section: "The Complexity Curve", content: "The relationship between model complexity and reliability follows an inverted U-shape. There is an optimal zone where adding complexity improves results, beyond which additional complexity degrades reliability.", type: "concept" },
];
