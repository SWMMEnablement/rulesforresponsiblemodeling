// Builds the downloadable review package for the worked case (pure text files + zip).
import { strToU8, zipSync } from "fflate";
import { ENGINE_VERSION } from "@/lib/swmm/ensembleSampling";
import {
  buildCaseInp, C3_CAPACITY_CFS, EVENTS, OBSERVED_EVENTS, PARAM_RANGES, TARGETS, TOTAL_AREA_AC, TRUTH,
  type CaseParams, type CaseSample, type CheckItem, type EventKey, type FitMetrics,
} from "@/lib/workedCase";

export interface CalTrial { trial: number; at: string; params: CaseParams; A: FitMetrics; B: FitMetrics; contErr: number; afterValidation: boolean }
export interface PackageInput {
  times: number[];
  observed: Record<"A" | "B" | "C", number[]>;
  excluded: Record<"A" | "B" | "C", number[]>;
  trials: CalTrial[];
  final: CaseParams;
  validation: FitMetrics;
  recalibratedAfterValidation: boolean;
  seed: number;
  samples: CaseSample[];
  designPeaks: number[];
  designDeterministicPeak: number;
  p5: number; p50: number; p95: number;
  exceedProb: number;
  coverage: number;
  checklist: CheckItem[];
  createdAt: string;
}

const f = (v: number, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "n/a");
const pct = (v: number) => `${f(v, 1)}%`;
const paramLine = (p: CaseParams) =>
  (Object.keys(PARAM_RANGES) as (keyof CaseParams)[]).map((k) => `${PARAM_RANGES[k].label} ${f(p[k], k === "pctImperv" ? 0 : 2)} ${PARAM_RANGES[k].unit}`).join(", ");
const metricRow = (name: string, m: FitMetrics) => `| ${name} | ${f(m.nse)} | ${pct(m.peakErrPct)} | ${pct(m.volErrPct)} | ${m.timingMin} min |`;

export function buildReadme(x: PackageInput): string {
  const last = x.trials[x.trials.length - 1];
  const icon = { pass: "PASS", warn: "WARN", fail: "FAIL" } as const;
  return `# Review package - Fernhollow Brook worked case

> **FICTIONAL EXAMPLE.** Fernhollow Brook, its gauge FH-1 and every number in this package are made up for teaching.
> The "observed" flows were created by running a hidden parameter set and adding noise, a logger gap and a sensor spike.
> Acceptance targets are illustrative choices for this example, not a published standard.

Created: ${x.createdAt}
Engine: ${ENGINE_VERSION}

## 1. Question
What is the peak flow in pipe C3 (gauge FH-1) for the made-up 10-year, 3-hour design storm (${f(EVENTS.D.rain.reduce((s, v) => s + v, 0) / 4)} in), and how likely is it to exceed the pipe's full-flow capacity of ${f(C3_CAPACITY_CFS, 1)} cfs?

## 2. Answer
- Calibrated model peak: **${f(x.designDeterministicPeak, 1)} cfs**
- Uncertainty range (5th-95th percentile of ${x.samples.length} runs): **${f(x.p5, 1)} to ${f(x.p95, 1)} cfs** (median ${f(x.p50, 1)})
- Share of runs above full-flow capacity: **${Math.round(x.exceedProb * 100)}%**

## 3. Catchment and model
Three subcatchments (${TOTAL_AREA_AC} acres total) draining through pipes C1-C3 to an outfall. SWMM dynamic wave routing, Horton infiltration, 5-minute reporting.
Calibrated parameters: imperviousness, subcatchment width multiplier, Horton maximum infiltration rate. Pipe roughness was held at 0.013.

## 4. Observed data and audit
| Event | Role | Rain (in) | Records | Excluded |
|---|---|---|---|---|
${OBSERVED_EVENTS.map((k) => `| ${EVENTS[k].label} (${EVENTS[k].date}) | ${EVENTS[k].role} | ${f(EVENTS[k].rain.reduce((s, v) => s + v, 0) / 4)} | ${x.observed[k].length} | ${x.excluded[k].length ? x.excluded[k].map((i) => `#${i}`).join(", ") : "none"} |`).join("\n")}

Missing records are never used. Excluded records are listed above with their index in data/observed.csv.

## 5. Calibration (Events A and B)
${x.trials.length} trial(s) are logged in results/calibration-log.csv.
Final parameters: ${paramLine(x.final)}

| Event | NSE | Peak error | Volume error | Peak timing |
|---|---|---|---|---|
${last ? `${metricRow("A", last.A)}\n${metricRow("B", last.B)}` : "| - | - | - | - | - |"}

Illustrative targets: NSE >= ${TARGETS.nse}, |peak error| <= ${TARGETS.peakErrPct}%, |volume error| <= ${TARGETS.volErrPct}%, |timing| <= ${TARGETS.timingMin} min.

## 6. Validation (Event C, held out)
| Event | NSE | Peak error | Volume error | Peak timing |
|---|---|---|---|---|
${metricRow("C", x.validation)}
${x.recalibratedAfterValidation ? "\n**Disclosure:** parameters were changed after the validation result was seen, so Event C is no longer an independent test.\n" : "\nParameters were locked before Event C was run and not changed afterwards.\n"}
## 7. Uncertainty
${x.samples.length} runs, master seed **${x.seed}**. Each run draws, uniformly: imperviousness x0.85-1.15, width x0.7-1.4, max infiltration x0.7-1.3 around the calibrated values, and a rainfall factor 0.9-1.1 for gauge error.
${Math.round(x.coverage * 100)}% of usable Event C observations fall inside the 5-95% band.
Re-running with the same seed reproduces every sample (results/ensemble.csv).

## 8. Reviewer checklist
${x.checklist.map((c) => `- [${icon[c.status]}] ${c.label} - ${c.detail}`).join("\n")}

## 9. Limitations
- One rain gauge; real storms vary across the catchment.
- Three events cannot cover every season or antecedent condition.
- Parameter ranges for the ensemble are judgement calls; pipe roughness and model structure were not varied.
- The uncertainty band covers parameter and rainfall uncertainty only.

## 10. Files
- model/*.inp - calibrated SWMM input for each event and the design storm
- data/observed.csv - made-up observations (blank = missing)
- results/calibration-log.csv, results/ensemble.csv, results/metrics.json
- answer-key.md - the hidden parameters used to make the data (only possible because the data are synthetic)
`;
}

export function buildReviewZip(x: PackageInput): Uint8Array {
  const obsCsv = ["time_h,event_A_cfs,event_A_excluded,event_B_cfs,event_B_excluded,event_C_cfs,event_C_excluded",
    ...x.times.map((t, i) => [t.toFixed(4), ...OBSERVED_EVENTS.flatMap((k) => {
      const v = x.observed[k][i];
      return [Number.isNaN(v) || v === undefined ? "" : v.toString(), x.excluded[k].includes(i) ? "1" : "0"];
    })].join(","))].join("\n");
  const logCsv = ["trial,timestamp,pct_imperv,width_factor,max_infil_in_hr,A_nse,A_peak_err_pct,A_vol_err_pct,A_timing_min,B_nse,B_peak_err_pct,B_vol_err_pct,B_timing_min,max_continuity_err_pct,after_validation",
    ...x.trials.map((t) => [t.trial, t.at, t.params.pctImperv, t.params.widthFactor, t.params.maxInfil,
      t.A.nse, t.A.peakErrPct, t.A.volErrPct, t.A.timingMin, t.B.nse, t.B.peakErrPct, t.B.volErrPct, t.B.timingMin, t.contErr, t.afterValidation ? 1 : 0].join(","))].join("\n");
  const ensCsv = ["run,seed,pct_imperv,width_factor,max_infil_in_hr,rain_factor,design_peak_cfs",
    ...x.samples.map((s, i) => [s.index + 1, s.seed, s.pctImperv.toFixed(3), s.widthFactor.toFixed(4), s.maxInfil.toFixed(4), s.rainFactor.toFixed(4), f(x.designPeaks[i], 3)].join(","))].join("\n");
  const metrics = {
    fictional: true, engine: ENGINE_VERSION, createdAt: x.createdAt, finalParams: x.final, targets: TARGETS,
    calibration: x.trials[x.trials.length - 1] ?? null, validation: x.validation, recalibratedAfterValidation: x.recalibratedAfterValidation,
    uncertainty: { seed: x.seed, runs: x.samples.length, p5: x.p5, p50: x.p50, p95: x.p95, exceedProb: x.exceedProb, coverage: x.coverage, capacityCfs: C3_CAPACITY_CFS },
    checklist: x.checklist,
  };
  const answer = `# Answer key (synthetic data only)

The observations were generated with:
- ${paramLine(TRUTH)}
- Pipe roughness 0.016 (the model uses 0.013, so no slider setting fits perfectly)

Your calibrated values: ${paramLine(x.final)}

With real data there is no answer key - which is why validation and uncertainty matter.
`;
  const files: Record<string, Uint8Array> = {
    "README.md": strToU8(buildReadme(x)),
    "answer-key.md": strToU8(answer),
    "data/observed.csv": strToU8(obsCsv),
    "results/calibration-log.csv": strToU8(logCsv),
    "results/ensemble.csv": strToU8(ensCsv),
    "results/metrics.json": strToU8(JSON.stringify(metrics, null, 2)),
  };
  (["A", "B", "C", "D"] as EventKey[]).forEach((k) => {
    files[`model/${k === "D" ? "design-storm" : `event-${k}`}.inp`] = strToU8(buildCaseInp(x.final, EVENTS[k]));
  });
  return zipSync({ "fernhollow-review-package": files });
}

