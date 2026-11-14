---
name: Rules for Responsible Modeling
file: index.html
version: 2026.1.1
date: 2026-11-14
author: Robert Dickinson
links: {site: "https://rulesforresponsiblemodeling.lovable.app", artifact: none, repo: none}
engines:
  - name: EPA SWMM
    version: 5.2.4
    source: "App declares 5.2.4; original source checkout not retained"
    branch: unknown
    commit: unknown
    compiler: "Emscripten; version and flags not recorded"
    license: "EPA-authored SWMM code is public domain; original build provenance not independently audited"
    binary_sha256: 7a3ac7136a29a629187de122fd529cf690719591e1717471e389ed1113b1304a
units: "Generated models: US customary (CFS, ft, acres, in/hr). Uploaded models retain FLOW_UNITS; cross-app SI conversions not fully audited."
ai_use: "Built with AI assistance in Lovable. AI generated and revised code and educational text. Ask James generates answers from app-written chapter summaries, not verified book text. AI outputs can be wrong and require human review. The complete development-model history is not recorded."
---

# Rules for Responsible Modeling: interactive modeling lessons and browser SWMM experiments

## What it does

An educational companion for people learning and reviewing urban drainage modeling.
Chapter lessons and micro-apps explore assumptions, calibration, uncertainty and reporting.
The Playground runs tutorial, drawn and uploaded SWMM models; the Model Library keeps files in the visitor's browser.
The fictional Fernhollow Brook worked case progresses from synthetic observations through calibration, held-out validation and uncertainty to a downloadable review package.
Ask James answers with citations to app-written summaries, not quotations from the book.

## How it computes

1. Tutorial parameters modify INP text. Model Builder validates a simplified network and writes INP sections. Uploaded INP text is passed to the solver as supplied unless the visitor edits it.
2. A Web Worker loads the bundled WebAssembly engine, writes `/in.inp`, and calls `swmm_run` to create `/out.rpt` and `/out.out` (src/workers/swmmRunner.ts:51-72).
3. Continuity errors are parsed from report sections, not read from unavailable heap views (src/workers/swmmRunner.ts:37-48). Missing values remain unknown. Pending requests time out after 60 seconds (src/lib/swmm/runner.ts:14).
4. The binary parser reads little-endian records, object IDs, reporting times, node depths, inflows, flooding and link flows. It assumes the SWMM5 base-variable layout (src/lib/swmm/outParser.ts:49-169).
5. Flood-volume estimates sum reporting-period flooding rates times the reporting step. This is a sampled integration, not an independently audited solver volume (src/lib/swmm/outParser.ts:172-177).
6. Playground sampling uses mulberry32 master and per-run seeds. Uniform ranges: Manning n [0.011, 0.025), rainfall multiplier [0.7, 1.5), imperviousness [45, 75)% (src/lib/swmm/ensembleSampling.ts:6-10, 13-51).
7. Playground time-series bands select sorted samples at round(q * (N - 1)) for q = 0, 0.1, 0.5, 0.9, 1. They are conditional on supplied parameters, not confidence bounds on truth (src/lib/swmm/outParser.ts:179-196).
8. Worked-case observations come from a hidden parameter set, the same real solver, seeded noise and planted data-quality faults. Calibration and held-out validation are distinct. Targets and storms are illustrative, not field observations (src/lib/workedCase.ts).
9. Full-pipe reference capacity uses Q = (1.486/n) * A * R^(2/3) * sqrt(S) in US units. Surcharged dynamic-wave flow is not limited to this reference capacity (src/lib/workedCase.ts:60-66).

Tutorial OPTIONS (src/lib/swmm/tutorialModel.ts:7-39): FLOW_UNITS CFS, INFILTRATION HORTON, FLOW_ROUTING DYNWAVE, LINK_OFFSETS DEPTH, MIN_SLOPE 0, ALLOW_PONDING NO, SKIP_STEADY_STATE NO; START_DATE and REPORT_START_DATE 01/01/2025, their times 00:00:00, END_DATE 01/01/2025, END_TIME 06:00:00; SWEEP_START 01/01, SWEEP_END 12/31, DRY_DAYS 0; REPORT_STEP 00:05:00, WET_STEP 00:01:00, DRY_STEP 00:05:00, ROUTING_STEP 0:00:15, RULE_STEP 00:00:00; INERTIAL_DAMPING PARTIAL, NORMAL_FLOW_LIMITED BOTH, FORCE_MAIN_EQUATION H-W, VARIABLE_STEP 0.75, LENGTHENING_STEP 0, MIN_SURFAREA 12.557, MAX_TRIALS 8, HEAD_TOLERANCE 0.005, SYS_FLOW_TOL 5, LAT_FLOW_TOL 5, MINIMUM_STEP 0.5, THREADS 1.
Builder options: CFS, HORTON, selected routing, LINK_OFFSETS DEPTH, ALLOW_PONDING NO, VARIABLE_STEP 0.75, MIN_SURFAREA 12.557, THREADS 1; reporting/wet/dry/routing steps are 5 minutes/1 minute/5 minutes/15 seconds (src/lib/swmm/modelBuilder.ts:78-82).
Builder starts/reports on 01/01/2025 at 00:00:00 and ends on the same date at the selected duration (src/lib/swmm/modelBuilder.ts:79-80).
Builder subareas and Horton defaults are fixed in the writer; outfalls are FREE, cross-sections CIRCULAR, offsets zero (src/lib/swmm/modelBuilder.ts:84-96).
No OpenSWMM/SWMM6 engine is bundled. No engine-source line claims are made because the original C checkout is unavailable.

## Inputs and outputs

- Reads SWMM .inp text in Playground and Model Library. Uploaded models are not reverse-engineered into the drawing canvas.
- Builder writes TITLE, OPTIONS, RAINGAGES, SUBCATCHMENTS, SUBAREAS, INFILTRATION, JUNCTIONS, OUTFALLS, CONDUITS, XSECTIONS, TIMESERIES, REPORT, COORDINATES and Polygons. It is not a complete SWMM editor.
- Engine creates .rpt text and binary .out. Charts expose node depths and link flows; exports include CSV, reports and reproducibility/review ZIP packages.
- Model Library stores files in IndexedDB. Learning progress, notes and worked-case sessions use browser storage; clearing it removes local work. No model-library account sync is implemented.
- Worked-case sessions export/import JSON; synthetic observations are regenerated. User-supplied observed-flow CSV is not yet a worked-case input.
- Uploaded FLOW_UNITS is read from binary output. Depth is ft for US flow units and m for SI. Complete conversion correctness across all micro-apps has not been established.
- Ask James sends bounded conversation text and app summary context to the hosted chat service. SWMM simulation is local; chat is not offline.

## Checks

### Mechanical checks for this revision

Command: `bun test tests`, run 2026-11-14. Result: 61 passed, 0 failed, 5,064 assertions across 9 files. This is helper regression coverage, not solver equivalence certification.

- tests/ensembleSampling.test.ts: identical master seeds reproduce samples; individual run seeds reproduce parameters; samples stay within declared ranges.
- tests/modelBuilder.test.ts: generated INP and atomic renaming rules.
- tests/modelLibrary.test.ts and tests/reviewFixes.test.ts: model handling, signed-flow summaries, unknown continuity and seed provenance.
- tests/workedCaseReview83.test.ts: full-pipe capacity approximately 73.4 cfs at n=0.018 and 120.1 cfs at n=0.011; two surcharged 5-minute periods total 10 minutes; flooding-rate example integrates to 900 ft3 (lines 35-51).
- Other test files cover calibration helpers, long-chat trimming, calculator budgets, synthetic observations, sessions and review checks.
- Bundled binary SHA-256 computed with `sha256sum public/wasm/swmm5.wasm`: 7a3ac7136a29a629187de122fd529cf690719591e1717471e389ed1113b1304a.

### Human review

Outside scores and open findings are recorded in src/data/reviewLog.ts and the Review Log page. They are historical reviewer opinions, not verification of this revision. No new human review of this technical summary is claimed.

## What this does not show

1. Original SWMM build commit, compiler version and flags are unknown. The declared version is not a newly established native-versus-WASM benchmark.
2. No native EPA solver equivalence, SWMM6 comparison, engineering approval or field-data validation is claimed.
3. The original 2005 book text and printed page mapping have not been verified. CHI's web version is incomplete and derived from an earlier draft; app paraphrases are not book quotations.
4. The worked case, its gauge, storms, observations, scores and thresholds are fictional/illustrative. Self-consistency does not prove predictive validity on a real catchment.
5. Uncertainty bands omit unmodeled structural and observational errors. A failed coverage check cannot uniquely identify their cause.
6. The output parser assumes a specific binary layout. Large, malformed, pollutant-heavy or unusual uploaded models are not exhaustively tested; the worker timeout also limits long runs.
7. The drawing canvas has a restricted set of SWMM objects; advanced controls, pumps, storage, tidal boundaries and imported geometry need text editing.
8. Cross-app unit standardization, book-source mapping and externally owned token rotation remain open in roadmap.md. This documentation does not fix those items.
9. Full offline operation, durable cloud model storage and an observed-flow CSV workflow are not implemented.
10. The separate essay/Doc-tab and .docx deliverables are not part of this revision. No original build artifact or connected source-repository URL is available to list.

## How to reproduce

1. Use this project source with its lockfile; install dependencies with `bun install`, run `bun test tests`, then `bun run dev`.
2. Run `sha256sum public/wasm/swmm5.wasm` and compare with the front-matter digest.
3. Open /playground, run the tutorial, inspect .rpt continuity and the .out-derived hydrographs. The tutorial is src/lib/swmm/tutorialModel.ts; download its INP from the app.
4. Set an ensemble master seed, run, download the reproducibility package, and regenerate samples with sampleEnsemble(masterSeed, count). Deterministic input samples do not imply timestamps are identical.
5. Open /worked-case, audit the synthetic faults, calibrate, lock parameters, validate on the held-out event, run an ensemble and export the review package. Inputs and illustrative targets are in src/lib/workedCase.ts.
6. Use tests/workedCaseReview83.test.ts to reproduce the capacity, surcharge and flood-integration numbers listed above without a browser.
7. Read /about-author for credits and this embedded summary; /whats-new for development history; /grade-report for reviewer findings.

## Credits and licenses

- Robert Dickinson: interactive application author. App code license: MIT, Copyright (c) 2026 Robert Dickinson; see LICENSE.
- Dr. William James: author of Rules for Responsible Modeling, 4th edition (2005). The book is not redistributed as app-authored text.
- Computational Hydraulics International (CHI): original publication host; [R184 publication page](https://www.chiwater.com/Company/Staff/WJamesWebpage/original/homepage/Research/R184Pweb.html).
- U.S. Environmental Protection Agency: EPA SWMM engine. EPA-authored code is public domain; the exact bundled source checkout and any third-party modifications have not been independently audited.
- Emscripten contributors: WebAssembly compilation tooling. React, Vite, Radix/shadcn, Recharts, Mermaid, Fuse.js, fflate, jsPDF and other dependency contributors: UI, charting, searching and export tools. See package.json and dependency license files for their own terms.
- No Apache-2.0 SWMM6 build or upstream SWMM6 NOTICE applies to this app's declared engine; no substitute NOTICE is invented.

## AI use

Built with AI assistance in Lovable. AI generated and revised code and educational text. Ask James generates answers from app-written chapter summaries, not verified book text. AI outputs can be wrong and require human review. The complete development-model history is not recorded.

## Changes

- 2026.1.1 (2026-11-14): source-traced technical summary, embedded HTML copy, About download/read link, matching AI disclosure and public AI index.
- 2026.1 (history through 2026-11-02): resumable fictional worked case, per-run hydraulics, conditional uncertainty checks and outside Review Log. See src/data/changelog.ts for prior dated milestones; earlier individual version numbers were not recorded.
