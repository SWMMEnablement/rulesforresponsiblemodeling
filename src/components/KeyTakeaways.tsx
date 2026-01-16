import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface KeyTakeawaysProps {
  takeaways: string[];
  title?: string;
}

export const KeyTakeaways = ({ 
  takeaways, 
  title = "Key Takeaways" 
}: KeyTakeawaysProps) => {
  return (
    <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-3 text-muted-foreground">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-primary text-xl font-bold shrink-0">→</span>
            <span className="leading-relaxed">{takeaway}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

// Pre-defined takeaways for each chapter that can be imported
export const chapterTakeaways: Record<number, string[]> = {
  1: [
    "Models are tools for understanding and decision-making, not absolute truth",
    "Responsible modeling requires transparency about limitations",
    "The goal is insight and informed decisions, not perfect predictions",
    "Define clear objectives before building any model",
    "Choose model complexity appropriate to your data and purpose",
  ],
  2: [
    "Aleatory uncertainty (randomness) cannot be reduced; epistemic uncertainty (knowledge gaps) can",
    "All model inputs carry uncertainty that propagates through predictions",
    "Quantifying uncertainty is essential for honest communication of results",
    "Monte Carlo methods help explore the full range of possible outcomes",
  ],
  3: [
    "Data quality directly limits model reliability - garbage in, garbage out",
    "Always document data sources, processing steps, and known limitations",
    "Gap-filling and interpolation introduce additional uncertainty",
    "Field verification of critical data is worth the investment",
  ],
  4: [
    "Finer discretization isn't always better - it must match data resolution",
    "Subcatchment delineation should reflect dominant flow processes",
    "The parsimony principle: use the simplest model that serves your purpose",
    "Equifinality means multiple parameter sets can fit data equally well",
  ],
  5: [
    "Continuous simulation captures antecedent conditions that event models miss",
    "Long-term water balance provides a fundamental check on model behavior",
    "Baseflow representation is critical for low-flow predictions",
    "Split-sample validation is essential for continuous models",
  ],
  6: [
    "Design storms are convenient but may not represent real storm behavior",
    "Temporal disaggregation introduces uncertainty that must be acknowledged",
    "Return period concepts apply to events, not specific years",
    "Stochastic rainfall generation can reveal system vulnerabilities",
  ],
  7: [
    "Storm movement direction and speed affect catchment response",
    "Stationary storm assumptions may underestimate peak flows",
    "Time of concentration varies with storm characteristics",
    "Spatial rainfall patterns matter for larger catchments",
  ],
  8: [
    "SWMM is a powerful tool but requires careful parameter selection",
    "GIS integration improves data management and visualization",
    "Model building should follow a systematic, documented process",
    "Sensitivity testing reveals which parameters need careful calibration",
  ],
  9: [
    "No single objective function captures all aspects of model performance",
    "Nash-Sutcliffe Efficiency has limitations - consider alternatives like KGE",
    "Visual inspection of hydrographs reveals issues that statistics miss",
    "Multi-objective optimization reveals trade-offs between performance goals",
  ],
  10: [
    "All models contain uncertainty - ignoring it leads to overconfident predictions",
    "Multiple methods exist for uncertainty quantification - choose based on problem",
    "Uncertainty bounds should accompany all predictions shared with stakeholders",
    "Parameter uncertainty is often less important than structural uncertainty",
  ],
  11: [
    "Calibration shows a model can fit data; validation shows it can predict",
    "Never validate on the same data used for calibration",
    "Temporal and spatial validation tests different aspects of model reliability",
    "Poor validation performance may indicate overfitting or structural problems",
  ],
  12: [
    "Manual calibration builds understanding; automated calibration improves efficiency",
    "Global search algorithms avoid getting trapped in local optima",
    "Calibration should target parameters to which outputs are sensitive",
    "Document all calibration decisions for future model users",
  ],
  13: [
    "Sensitivity analysis identifies which parameters matter most",
    "Local sensitivity methods are fast but may miss interactions",
    "Global sensitivity methods capture the full parameter space",
    "Focus calibration effort on high-sensitivity parameters",
  ],
  14: [
    "Genetic algorithms provide robust global optimization for complex parameter spaces",
    "Multi-objective optimization reveals trade-offs between competing goals",
    "Population-based search naturally handles discontinuous response surfaces",
    "Pareto fronts show the range of equally-optimal solutions",
  ],
  15: [
    "Fuzzy logic handles imprecise information that crisp rules cannot",
    "Membership functions encode expert knowledge systematically",
    "Fuzzy inference bridges qualitative understanding and quantitative modeling",
    "Hybrid fuzzy-physical models can improve prediction reliability",
  ],
  16: [
    "Real-time updating improves forecasts as new data arrives",
    "Ensemble forecasting quantifies prediction uncertainty dynamically",
    "Lead time requirements drive model and data system design",
    "Communication of forecast uncertainty is as important as the forecast itself",
  ],
  17: [
    "Modelers have ethical obligations to stakeholders and the public",
    "Transparency about limitations builds trust and credibility",
    "Peer review and documentation enable reproducibility",
    "Professional judgment cannot be replaced by automation",
    "The consequences of modeling decisions can affect lives and livelihoods",
  ],
};
