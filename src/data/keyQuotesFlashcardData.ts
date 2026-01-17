import { FlashcardData } from "@/hooks/useSpacedRepetition";

export const keyQuotesFlashcardData: FlashcardData[] = [
  {
    id: "quote-ch1",
    term: "Chapter 1: Purpose of Modeling",
    definition: "The purpose of modeling is not to predict the future perfectly, but to inform decisions about future actions. A model that helps you make better decisions is valuable, even if its predictions contain uncertainty.",
    chapter: 1,
  },
  {
    id: "quote-ch2",
    term: "Chapter 2: Discretization Error",
    definition: "Discretization error is often the largest source of model uncertainty, yet it is frequently overlooked in favor of parameter uncertainty. The choice of spatial and temporal resolution should be treated with the same rigor as parameter calibration.",
    chapter: 2,
  },
  {
    id: "quote-ch3",
    term: "Chapter 3: Data Quality",
    definition: "Garbage in, garbage out is an oversimplification. The real challenge is that imperfect data, when carefully characterized and properly propagated through uncertainty analysis, can still support sound decisions. Unknown data quality is far more dangerous than known imperfection.",
    chapter: 3,
  },
  {
    id: "quote-ch4",
    term: "Chapter 4: Optimal Complexity",
    definition: "There exists an optimal order of model complexity for any given application. Below this optimum, the model fails to capture essential physics. Above it, parameter uncertainty overwhelms any gain in structural accuracy. Finding this optimum requires systematic evaluation, not intuition.",
    chapter: 4,
  },
  {
    id: "quote-ch5",
    term: "Chapter 5: Continuous Simulation",
    definition: "Continuous simulation is not merely running single events back-to-back. It fundamentally changes how we think about antecedent conditions, inter-event processes, and long-term system behavior. The calibration requirements are also fundamentally different.",
    chapter: 5,
  },
  {
    id: "quote-ch6",
    term: "Chapter 6: Rainfall Uncertainty",
    definition: "Rainfall is typically the largest source of uncertainty in urban drainage modeling, yet modelers often spend more effort on hydraulic parameters than on rainfall characterization. A sophisticated routing model fed with poor rainfall input produces poor results elegantly.",
    chapter: 6,
  },
  {
    id: "quote-ch7",
    term: "Chapter 7: Storm Spatial Structure",
    definition: "Urban watersheds are often smaller than individual storm cells. This means the spatial structure and movement of rainfall across the catchment can dramatically affect peak flows—sometimes more than total rainfall depth.",
    chapter: 7,
  },
  {
    id: "quote-ch8",
    term: "Chapter 8: Decision Support Systems",
    definition: "A decision support system is more than a model with a pretty interface. It is a framework that integrates data management, modeling, analysis, and communication into a coherent workflow that supports the entire decision-making process.",
    chapter: 8,
  },
  {
    id: "quote-ch9",
    term: "Chapter 9: Objective Functions",
    definition: "The choice of objective function is itself a modeling decision that deserves careful consideration. Different objectives will lead to different 'optimal' parameter sets, and no single metric captures all aspects of model performance.",
    chapter: 9,
  },
  {
    id: "quote-ch10",
    term: "Chapter 10: Uncertainty Communication",
    definition: "Uncertainty is not a weakness to be hidden—it is an inherent characteristic of all models that should be quantified and communicated. Decision-makers deserve to know the confidence they should place in model predictions.",
    chapter: 10,
  },
  {
    id: "quote-ch11",
    term: "Chapter 11: Sensitivity Analysis",
    definition: "Sensitivity analysis is not merely a diagnostic tool—it is fundamental to responsible modeling. It tells us where to focus our calibration efforts, which data to collect, and how confident we can be in our predictions.",
    chapter: 11,
  },
  {
    id: "quote-ch12",
    term: "Chapter 12: State Variable Space",
    definition: "State variable representation provides a unified framework for understanding model behavior. It reveals how different parts of the system interact, where instabilities may arise, and what combinations of conditions lead to extreme outcomes.",
    chapter: 12,
  },
  {
    id: "quote-ch13",
    term: "Chapter 13: Performance Metrics",
    definition: "Performance evaluation functions are not neutral—they embody value judgments about what aspects of model behavior matter most. A high Nash-Sutcliffe efficiency does not guarantee a model is fit for purpose.",
    chapter: 13,
  },
  {
    id: "quote-ch14",
    term: "Chapter 14: Optimization Limits",
    definition: "Optimization is a powerful tool, but it is not magic. A well-optimized poor model will still give poor predictions. Optimization should follow, not replace, careful model construction.",
    chapter: 14,
  },
  {
    id: "quote-ch15",
    term: "Chapter 15: Fuzzy Logic",
    definition: "Fuzzy logic excels where traditional crisp models struggle—in situations where expert knowledge is available but precise mathematical relationships are not. It provides a bridge between human reasoning and computational models.",
    chapter: 15,
  },
  {
    id: "quote-ch16",
    term: "Chapter 16: Model Error",
    definition: "Model error is not a sign of failure—it is an inherent characteristic of all models. The responsible approach is not to minimize error at any cost, but to characterize it honestly and communicate it effectively.",
    chapter: 16,
  },
  {
    id: "quote-ch17",
    term: "Chapter 17: Rules as Lessons",
    definition: "The rules for responsible modeling are not arbitrary constraints—they are lessons learned from decades of practice. Each rule addresses a common failure mode that has led to poor decisions, wasted resources, or damaged credibility.",
    chapter: 17,
  },
];
