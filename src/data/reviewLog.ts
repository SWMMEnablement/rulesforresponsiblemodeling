// Dated outside reviews and open findings. Scores belong to the reviewers, not to the app.
export interface OutsideReview {
  date: string;
  reviewer: string;
  score?: string;
  scope: string;
  findings: string[];
}

export const REVIEWS: OutsideReview[] = [
  {
    date: "2026-11-02", reviewer: "Outside tough-grade review", score: "83/100 (B)",
    scope: "Current source and the published app on desktop with small bundled models. Large networks and mobile not tested.",
    findings: [
      "Worked case lost its progress when you left the page.",
      "Ensemble compared every run with one fixed pipe capacity although roughness varied.",
      "Low band coverage was blamed on gauge noise alone.",
      "A SWMM panel said the reporting step must not exceed the wet-weather step.",
      "Chapter passages were presented as James quotations without page references.",
      "This page showed a fixed 94/100 self-grade and a 99% content-fidelity claim.",
    ],
  },
  {
    date: "2026-11-01", reviewer: "Outside review", score: "85/100",
    scope: "Source code; the reviewer could not open the preview.",
    findings: ["Continuity shown as 0% when SWMM gave none.", "Package seed could differ from the seed used.", "Ask James answers needed clickable sources."],
  },
  {
    date: "2026-11-01", reviewer: "Outside accuracy review", score: "80/100",
    scope: "Source code and the published site.",
    findings: ["Simulator scores and autopsies needed illustrative labels.", "Ensembles were not reproducible.", "No end-to-end worked case."],
  },
  {
    date: "2026-10-22", reviewer: "Outside quality review",
    scope: "Full app, 39 findings.",
    findings: ["Playground could not run.", "Calculator mathematics errors.", "Invented quotations and unverified links."],
  },
  {
    date: "2026-05-29", reviewer: "Outside UX review",
    scope: "Home page and navigation.",
    findings: ["No main call to action.", "Hidden navigation on desktop.", "No visible progress."],
  },
];

export interface OpenFinding { finding: string; blocker: string }
export const OPEN_FINDINGS: OpenFinding[] = [
  { finding: "Page references to the 4th edition for each chapter", blocker: "Needs the printed 2005 edition." },
  { finding: "Chapter paraphrases checked against the book's wording", blocker: "Needs the printed 2005 edition; until then they are labelled as paraphrases." },
  { finding: "Chapter and topic mapping verified against the book", blocker: "Needs the printed 2005 edition." },
  { finding: "InfoWorks ICM tool names checked against specific versions", blocker: "Needs version-specific ICM documentation; panels carry a version caveat." },
  { finding: "One unit system across all micro-apps", blocker: "Waiting for the owner's choice of SI, US customary or a selector." },
  { finding: "Worked case for your own model and observed-flow file", blocker: "Not built yet." },
  { finding: "Mobile use and large-network performance", blocker: "Not yet reviewed." },
];

/** The date the automatic checks below were last run and counted. */
export const CHECKS_AS_OF = "2026-11-02";
export const CHECKS_PASSING = 61;
