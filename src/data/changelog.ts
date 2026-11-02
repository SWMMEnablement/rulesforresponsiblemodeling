// Release history, newest first. Dates come from the project's change history.
export type ChangeKind = "feature" | "tool" | "content" | "fix" | "accuracy";

export interface ChangeItem { kind: ChangeKind; text: string; link?: string }
export interface Release { date: string; title: string; summary: string; items: ChangeItem[] }

export const CHANGELOG: Release[] = [
  {
    date: "2026-11-02",
    title: "Worked case you can resume, and clearer hydraulics",
    summary: "Fixes from an outside review that graded the app 83/100.",
    items: [
      { kind: "feature", text: "Worked case saves automatically, resumes where you left off, and can export, import or start over.", link: "/worked-case" },
      { kind: "accuracy", text: "Worked case checks each run against its own pipe capacity and reports surcharge time, peak water level and flooding.", link: "/worked-case" },
      { kind: "accuracy", text: "Low uncertainty-band coverage lists possible causes; percentiles are labelled as conditional; choose 20-200 runs with a convergence check.", link: "/worked-case" },
      { kind: "accuracy", text: "SWMM and ICM advice corrected: the reporting step is separate from the wet-weather step, gauge and terrain rules are qualified, and ICM tool names carry a version caveat." },
      { kind: "accuracy", text: "Chapter \"James on...\" passages are labelled as app-written paraphrases." },
      { kind: "accuracy", text: "The fixed self-grade is replaced by a dated Review Log of outside reviews and open findings.", link: "/grade-report" },
      { kind: "feature", text: "Home page leads with Start the worked case, then Learn, Experiment and Review my model.", link: "/" },
    ],
  },
  {
    date: "2026-11-01",
    title: "Accuracy review and reproducible runs",
    summary: "Fixes from an outside review that graded the app 80/100, plus two monitoring fixes.",
    items: [
      { kind: "fix", text: "Worked case: a missing continuity result shows as unknown and fails review instead of counting as 0%.", link: "/worked-case" },
      { kind: "fix", text: "Worked case: the review package records the seed that actually produced the ensemble.", link: "/worked-case" },
      { kind: "accuracy", text: "Ask James cites the app's chapter summaries with clickable links and says they are summaries, not quotes from William James." },
      { kind: "fix", text: "Model Library and Builder tables show maximum, minimum (reverse) and largest flow with units.", link: "/model-library" },
      { kind: "feature", text: "Worked Case, SWMM Playground and Model Library now have their own cards on the home page.", link: "/" },
      { kind: "accuracy", text: "Simulator scores, comparison rules of thumb and Model Autopsies are labelled as illustrative.", link: "/model-autopsies" },
      { kind: "accuracy", text: "Original-publication links note that the CHI web page is incomplete and comes from a 1993 draft." },
      { kind: "fix", text: "Calibration Coach starts out of tune, timing moves in quarter hours, and recession has its own effect.", link: "/micro-apps" },
      { kind: "feature", text: "Playground ensembles use a master seed and download a full reproducibility package.", link: "/playground" },
      { kind: "accuracy", text: "The quiz badge is described as a lesson completion badge with its issuer and scope." },
      { kind: "fix", text: "Ask James keeps working in long conversations." },
      { kind: "fix", text: "Renaming a node in the Model Builder can no longer merge two nodes." },
      { kind: "feature", text: "This What's New page.", link: "/whats-new" },
      { kind: "content", text: "Worked case (made-up data): audit observations, calibrate, validate on a held-out storm, run an uncertainty ensemble and download a review package.", link: "/worked-case" },
      { kind: "feature", text: "Model Library: upload and keep several .inp files in your browser and run any of them on the real engine.", link: "/model-library" },
    ],
  },
  {
    date: "2026-10-22",
    title: "Model Builder and a full quality pass",
    summary: "Draw or upload your own SWMM model, plus fixes for 39 reported issues.",
    items: [
      { kind: "feature", text: "Model Builder: drag junctions, outfalls, rain areas and pipes, or upload your own .inp file, then run it on the real engine.", link: "/playground" },
      { kind: "fix", text: "Playground engine, tutorial model input and storm timing repaired; the full 3.1-inch storm now runs." },
      { kind: "fix", text: "Menu, chapter header overlap, note editing, dark-mode diagrams, flashcards and chat sizing fixed." },
      { kind: "accuracy", text: "Water budget, equifinality and sensitivity calculators corrected and covered by automatic checks." },
      { kind: "accuracy", text: "Unverified blog links and invented quotations removed; app-written takeaways labelled as paraphrases." },
    ],
  },
  {
    date: "2026-05-31",
    title: "SWMM Playground with the real engine",
    summary: "EPA SWMM 5.2.4 runs directly in the browser.",
    items: [
      { kind: "feature", text: "Playground with sliders for roughness, imperviousness and rainfall, plus scenario presets.", link: "/playground" },
      { kind: "feature", text: "Hydrograph charts of node depths and pipe flows with exact hover values." },
      { kind: "feature", text: "Monte Carlo ensembles with min–max and 10–90% bands, run comparison and CSV export." },
    ],
  },
  {
    date: "2026-05-29",
    title: "Homepage redesign from UX review",
    summary: "Clearer starting point, visible search and a better footer.",
    items: [
      { kind: "feature", text: "Main call to action, visible search, path previews and resume-where-you-left-off on the homepage.", link: "/" },
      { kind: "feature", text: "SWMM5/ICM translation panels and Model Autopsies promoted on the homepage." },
      { kind: "feature", text: "Footer with version, date and an email link for reporting issues." },
      { kind: "content", text: "Rule of the Week quote restyled for easier reading." },
    ],
  },
  {
    date: "2026-04-01",
    title: "All 17 micro-apps",
    summary: "One hands-on mini tool per chapter.",
    items: [
      { kind: "tool", text: "First eight micro-apps (Mar 31), including Crystal Ball Test, Storm Chopper and Legacy Saver.", link: "/micro-apps" },
      { kind: "tool", text: "Final nine (Apr 1), including Calibration Coach, Scope Creep Detector and Peer Review Simulator.", link: "/micro-apps" },
      { kind: "feature", text: "Micro-Apps added to the main menu." },
      { kind: "feature", text: "Find Your Path quiz and crash protection for private browsing (Mar 29–30)." },
    ],
  },
  {
    date: "2026-03-09",
    title: "Progress tracking and cross-reference",
    summary: "See how far you've come and how the rules connect.",
    items: [
      { kind: "feature", text: "My Progress page (Mar 8).", link: "/progress" },
      { kind: "feature", text: "Share-a-rule links (Mar 8)." },
      { kind: "feature", text: "Cross-reference matrix linking rules and chapters.", link: "/cross-reference" },
    ],
  },
  {
    date: "2026-02-23",
    title: "Animations and visual explainers",
    summary: "Animated explainers for the book's core ideas.",
    items: [
      { kind: "content", text: "Animations page: uncertainty funnel, calibration dance, equifinality, precision illusion and more.", link: "/animations" },
      { kind: "feature", text: "Grade Report page.", link: "/grade-report" },
    ],
  },
  {
    date: "2026-02-22",
    title: "Practitioner tools",
    summary: "Interactive tools for working modelers.",
    items: [
      { kind: "tool", text: "Complexity vs. Reliability Simulator and model comparison tool." },
      { kind: "content", text: "Model Autopsies of failure scenarios.", link: "/model-autopsies" },
      { kind: "feature", text: "Responsibility quiz and completion badge.", link: "/responsibility-quiz" },
      { kind: "content", text: "SWMM5 / InfoWorks ICM translation panels and office poster series." },
    ],
  },
  {
    date: "2026-02-12",
    title: "Goyen PhD Thesis",
    summary: "A companion page on the Goyen thesis.",
    items: [{ kind: "content", text: "Goyen PhD Thesis page.", link: "/phd-thesis" }],
  },
  {
    date: "2026-01-23",
    title: "Code Library and templates",
    summary: "Ready-to-use scripts and project templates.",
    items: [
      { kind: "content", text: "Code Library of Ruby and Python scripts.", link: "/code-library" },
      { kind: "tool", text: "Project templates, framework map and Rule of the Week." },
    ],
  },
  {
    date: "2026-01-21",
    title: "Ask James AI assistant",
    summary: "Ask modeling questions in plain language.",
    items: [
      { kind: "feature", text: "Ask James chat assistant." },
      { kind: "feature", text: "Search across the whole app." },
      { kind: "tool", text: "Checklist generator, framework diagnostic and case vignettes." },
    ],
  },
  {
    date: "2026-01-17",
    title: "Calculators and study aids",
    summary: "The biggest single day of building.",
    items: [
      { kind: "tool", text: "Sensitivity, Monte Carlo and water balance calculators." },
      { kind: "content", text: "Key Quotes page with flashcards, mind map and practical exercises.", link: "/key-quotes" },
      { kind: "feature", text: "Command palette (Ctrl/Cmd + K) and printable PDF reference card." },
      { kind: "content", text: "Software examples with searchable Ruby scripts." },
    ],
  },
  {
    date: "2026-01-16",
    title: "Reading pathways",
    summary: "Guided routes through the book.",
    items: [
      { kind: "feature", text: "Reading pathways for students, practitioners and more." },
      { kind: "feature", text: "Hover definitions for glossary terms and chapter key takeaways." },
    ],
  },
  {
    date: "2025-11-26",
    title: "Dark mode and shortcuts",
    summary: "Comfort features.",
    items: [
      { kind: "feature", text: "Dark mode and keyboard shortcuts (press ?)." },
      { kind: "content", text: "Abbreviations search (Dec 27)." },
    ],
  },
  {
    date: "2025-11-12",
    title: "All 17 chapters",
    summary: "The full book in interactive form.",
    items: [
      { kind: "content", text: "Chapters 1–17 with diagrams and quizzes." },
      { kind: "feature", text: "Bookmarks, chapter notes, flashcards, glossary and study guide.", link: "/study-guide" },
      { kind: "content", text: "About the Author and Resources pages." },
    ],
  },
  {
    date: "2025-11-10",
    title: "First version",
    summary: "The project begins.",
    items: [{ kind: "content", text: "Homepage, chapter list, key concepts and the modeling process overview." }],
  },
];
