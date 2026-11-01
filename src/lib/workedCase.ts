// Worked case: "Fernhollow Brook" — a FICTIONAL catchment with SYNTHETIC data.
// Observations are produced by running a hidden "true" parameter set (with a slightly
// different pipe roughness, so no slider setting fits perfectly) and adding seeded
// measurement noise, one logger gap and one sensor spike. Everything here is pure and
// testable; the page runs the real SWMM engine with the INP text these helpers write.
import { mulberry32 } from "@/lib/swmm/ensembleSampling";

export interface CaseParams {
  pctImperv: number;   // directly connected imperviousness, % (all subcatchments)
  widthFactor: number; // multiplier on base subcatchment widths
  maxInfil: number;    // Horton maximum infiltration rate, in/hr
}

export type EventKey = "A" | "B" | "C" | "D";
export interface CaseEvent {
  key: EventKey;
  label: string;
  date: string;
  role: "calibration" | "validation" | "design";
  /** Rain intensity, in/hr, one value per 15 minutes from 0:00. */
  rain: number[];
}

export const RAIN_STEP_MIN = 15;
export const REPORT_STEP_MIN = 5;
export const SIM_HOURS = 10;

export const EVENTS: Record<EventKey, CaseEvent> = {
  A: { key: "A", label: "Event A", date: "12 Apr (made up)", role: "calibration", rain: [0.1, 0.3, 0.6, 1.0, 0.8, 0.5, 0.4, 0.3, 0.2, 0.2, 0.1, 0.1] },
  B: { key: "B", label: "Event B", date: "3 Jun (made up)", role: "calibration", rain: [0.2, 1.2, 2.8, 1.4, 0.6, 0.3, 0.1] },
  C: { key: "C", label: "Event C", date: "21 Sep (made up)", role: "validation", rain: [0.1, 0.2, 0.4, 0.6, 0.4, 0.2, 0.1, 0.1, 0.2, 0.5, 1.0, 0.9, 0.5, 0.3, 0.2, 0.1] },
  D: { key: "D", label: "Design storm", date: "made-up 10-year, 3-hour storm", role: "design", rain: [0.2, 0.3, 0.5, 0.8, 1.5, 4.0, 2.0, 1.0, 0.6, 0.4, 0.3, 0.2] },
};

export const OBSERVED_EVENTS: EventKey[] = ["A", "B", "C"];

/** First estimate from (made-up) land-use maps — deliberately off, as first estimates usually are. */
export const START_PARAMS: CaseParams = { pctImperv: 60, widthFactor: 1.5, maxInfil: 3.5 };
/** The hidden answer used to make the synthetic observations. */
export const TRUTH: CaseParams = { pctImperv: 38, widthFactor: 0.6, maxInfil: 1.8 };
export const MODEL_CONDUIT_N = 0.013;
export const TRUTH_CONDUIT_N = 0.016;

export const PARAM_RANGES: Record<keyof CaseParams, { min: number; max: number; step: number; label: string; unit: string }> = {
  pctImperv: { min: 10, max: 80, step: 1, label: "Imperviousness", unit: "%" },
  widthFactor: { min: 0.25, max: 3, step: 0.05, label: "Width multiplier", unit: "×" },
  maxInfil: { min: 0.5, max: 5, step: 0.1, label: "Max infiltration rate", unit: "in/hr" },
};

const SUBCATCHMENTS = [
  { id: "S1", outlet: "J1", area: 40, width: 1400, slope: 1.2 },
  { id: "S2", outlet: "J2", area: 30, width: 1100, slope: 0.9 },
  { id: "S3", outlet: "J3", area: 25, width: 900, slope: 0.7 },
];
export const TOTAL_AREA_AC = SUBCATCHMENTS.reduce((s, c) => s + c.area, 0);
/** C3 is the gauged pipe (monitoring station FH-1). */
export const GAUGED_LINK = "C3";
export const C3 = { diameterFt: 4, slope: 0.005 };

/** Manning full-pipe capacity of a circular pipe, US units (cfs). */
export function fullPipeCapacity(diameterFt: number, slope: number, n: number): number {
  const area = (Math.PI * diameterFt ** 2) / 4;
  const r = diameterFt / 4;
  return (1.486 / n) * area * r ** (2 / 3) * Math.sqrt(slope);
}
export const C3_CAPACITY_CFS = fullPipeCapacity(C3.diameterFt, C3.slope, MODEL_CONDUIT_N);

const hhmm = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

export function buildCaseInp(p: CaseParams, ev: CaseEvent, opts: { conduitN?: number; rainFactor?: number } = {}): string {
  const n = (opts.conduitN ?? MODEL_CONDUIT_N).toFixed(4);
  const rf = opts.rainFactor ?? 1;
  const rain = [...ev.rain, 0].map((v, i) => `Rain  ${hhmm(i * RAIN_STEP_MIN)}  ${(v * rf).toFixed(4)}`).join("\n");
  const subs = SUBCATCHMENTS.map((s) => `${s.id}  RG1  ${s.outlet}  ${s.area}  ${p.pctImperv.toFixed(2)}  ${(s.width * p.widthFactor).toFixed(1)}  ${s.slope}  0`).join("\n");
  const subareas = SUBCATCHMENTS.map((s) => `${s.id}  0.012  0.15  0.05  0.15  20  OUTLET`).join("\n");
  const infil = SUBCATCHMENTS.map((s) => `${s.id}  ${p.maxInfil.toFixed(3)}  0.3  4  7  0`).join("\n");
  return `[TITLE]
Fernhollow Brook worked case - FICTIONAL catchment, synthetic data - ${ev.label}

[OPTIONS]
FLOW_UNITS           CFS
INFILTRATION         HORTON
FLOW_ROUTING         DYNWAVE
LINK_OFFSETS         DEPTH
ALLOW_PONDING        NO
START_DATE           01/01/2025
START_TIME           00:00:00
REPORT_START_DATE    01/01/2025
REPORT_START_TIME    00:00:00
END_DATE             01/01/2025
END_TIME             ${String(SIM_HOURS).padStart(2, "0")}:00:00
DRY_DAYS             7
REPORT_STEP          00:${String(REPORT_STEP_MIN).padStart(2, "0")}:00
WET_STEP             00:01:00
DRY_STEP             00:05:00
ROUTING_STEP         0:00:10
VARIABLE_STEP        0.75
MINIMUM_STEP         0.5
THREADS              1

[EVAPORATION]
CONSTANT  0.0

[RAINGAGES]
;;Interval equals the time-series spacing
RG1  INTENSITY  ${hhmm(RAIN_STEP_MIN)}  1.0  TIMESERIES Rain

[SUBCATCHMENTS]
;;Name Gage Outlet Area PctImperv Width Slope CurbLen
${subs}

[SUBAREAS]
${subareas}

[INFILTRATION]
${infil}

[JUNCTIONS]
;;Name Elev MaxDepth InitDepth SurDepth Aponded
J1  110  8  0  0  0
J2  105  8  0  0  0
J3  101  8  0  0  0

[OUTFALLS]
OUT1  98  FREE  NO

[CONDUITS]
;;Name From To Length Roughness InOffset OutOffset InitFlow MaxFlow
C1  J1  J2  1000  ${n}  0  0  0  0
C2  J2  J3  800  ${n}  0  0  0  0
C3  J3  OUT1  600  ${n}  0  0  0  0

[XSECTIONS]
C1  CIRCULAR  3    0  0  0  1
C2  CIRCULAR  3.5  0  0  0  1
C3  CIRCULAR  ${C3.diameterFt}  0  0  0  1

[TIMESERIES]
${rain}

[REPORT]
SUBCATCHMENTS ALL
NODES ALL
LINKS ALL
`;
}

export function rainDepthIn(ev: CaseEvent, factor = 1): number {
  return ev.rain.reduce((s, v) => s + v, 0) * (RAIN_STEP_MIN / 60) * factor;
}

// ---------- synthetic observations ----------
const EVENT_SEED: Record<EventKey, number> = { A: 1101, B: 2202, C: 3303, D: 4404 };

/** Turn a "true" simulated flow into made-up observations: noise, a logger gap (A) and a spike (B). */
export function makeObserved(truth: number[], key: EventKey): number[] {
  const r = mulberry32(EVENT_SEED[key]);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  const obs = truth.map((q) => Math.max(0, q * (1 + 0.06 * gauss()) + 0.08 * gauss()));
  if (key === "A") for (let i = 40; i < 47 && i < obs.length; i++) obs[i] = NaN; // logger gap
  if (key === "B") {
    const i = Math.min(obs.length - 1, 60);
    obs[i] = Math.max(obs[i], 1) * 3 + 25; // sensor spike on the recession
  }
  return obs.map((v) => (Number.isNaN(v) ? v : Math.round(v * 100) / 100));
}

// ---------- data audit ----------
export interface AuditFlag { index: number; kind: "gap" | "spike"; note: string }

export function auditSeries(obs: number[]): AuditFlag[] {
  const flags: AuditFlag[] = [];
  obs.forEach((v, i) => {
    if (Number.isNaN(v)) { flags.push({ index: i, kind: "gap", note: "missing record" }); return; }
    const prev = obs[i - 1], next = obs[i + 1];
    if (prev === undefined || next === undefined || Number.isNaN(prev) || Number.isNaN(next)) return;
    const neighbour = Math.max(prev, next);
    if (v > 5 && v > 2 * neighbour) flags.push({ index: i, kind: "spike", note: `${v.toFixed(1)} cfs vs ${neighbour.toFixed(1)} cfs either side` });
  });
  return flags;
}

/** Runoff volume / rainfall volume over the catchment (dimensionless). */
export function runoffRatio(flowCfs: number[], rainIn: number, dtMin = REPORT_STEP_MIN): number {
  const ft3 = flowCfs.reduce((s, v) => s + (Number.isNaN(v) ? 0 : v), 0) * dtMin * 60;
  const rainFt3 = (rainIn / 12) * TOTAL_AREA_AC * 43560;
  return rainFt3 > 0 ? ft3 / rainFt3 : 0;
}

// ---------- fit metrics ----------
export interface FitMetrics { nse: number; peakErrPct: number; volErrPct: number; timingMin: number; n: number }

/** Compare simulated to observed on indices that are present and not excluded. */
export function fitMetrics(obs: number[], sim: number[], exclude: Set<number> = new Set(), dtMin = REPORT_STEP_MIN): FitMetrics {
  const idx: number[] = [];
  for (let i = 0; i < Math.min(obs.length, sim.length); i++) if (!Number.isNaN(obs[i]) && !exclude.has(i)) idx.push(i);
  if (idx.length === 0) return { nse: NaN, peakErrPct: NaN, volErrPct: NaN, timingMin: NaN, n: 0 };
  const mean = idx.reduce((s, i) => s + obs[i], 0) / idx.length;
  let num = 0, den = 0, vo = 0, vs = 0, po = -Infinity, ps = -Infinity, io = 0, is = 0;
  for (const i of idx) {
    num += (obs[i] - sim[i]) ** 2; den += (obs[i] - mean) ** 2;
    vo += obs[i]; vs += sim[i];
    if (obs[i] > po) { po = obs[i]; io = i; }
    if (sim[i] > ps) { ps = sim[i]; is = i; }
  }
  return {
    nse: den > 0 ? 1 - num / den : NaN,
    peakErrPct: po > 0 ? ((ps - po) / po) * 100 : NaN,
    volErrPct: vo > 0 ? ((vs - vo) / vo) * 100 : NaN,
    timingMin: (is - io) * dtMin,
    n: idx.length,
  };
}

/** Illustrative acceptance targets for THIS example only — not a published standard. */
export const TARGETS = { nse: 0.7, peakErrPct: 15, volErrPct: 10, timingMin: 15 };

export function passes(m: FitMetrics) {
  return {
    nse: m.nse >= TARGETS.nse,
    peak: Math.abs(m.peakErrPct) <= TARGETS.peakErrPct,
    volume: Math.abs(m.volErrPct) <= TARGETS.volErrPct,
    timing: Math.abs(m.timingMin) <= TARGETS.timingMin,
  };
}
export const allPass = (m: FitMetrics) => Object.values(passes(m)).every(Boolean);

// ---------- uncertainty ----------
export interface CaseSample extends CaseParams { index: number; seed: number; rainFactor: number }

/** Uniform ranges around the calibrated values; rainfall factor represents gauge error. */
export function sampleCaseEnsemble(center: CaseParams, masterSeed: number, n: number): CaseSample[] {
  const master = mulberry32(masterSeed);
  return Array.from({ length: n }, (_, index) => {
    const seed = Math.floor(master() * 2 ** 31);
    const r = mulberry32(seed);
    const u = (lo: number, hi: number) => lo + r() * (hi - lo);
    const R = PARAM_RANGES;
    return {
      index, seed,
      pctImperv: Math.min(R.pctImperv.max, Math.max(R.pctImperv.min, center.pctImperv * u(0.85, 1.15))),
      widthFactor: center.widthFactor * u(0.7, 1.4),
      maxInfil: Math.max(0.1, center.maxInfil * u(0.7, 1.3)),
      rainFactor: u(0.9, 1.1),
    };
  });
}

export function quantile(values: number[], q: number): number {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const pos = (s.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

/** Share of usable observations that fall inside [lower, upper]. */
export function bandCoverage(obs: number[], lower: number[], upper: number[], exclude: Set<number> = new Set()): number {
  let inside = 0, total = 0;
  obs.forEach((v, i) => {
    if (Number.isNaN(v) || exclude.has(i) || lower[i] === undefined) return;
    total++;
    if (v >= lower[i] - 1e-9 && v <= upper[i] + 1e-9) inside++;
  });
  return total ? inside / total : NaN;
}

// ---------- review checklist ----------
export interface CaseLog {
  auditReviewed: boolean;
  excludedFlags: number;
  totalFlags: number;
  calibrationTrials: number;
  validated: boolean;
  recalibratedAfterValidation: boolean;
  validationPassed: boolean;
  maxContinuityErrPct: number;
  ensembleSize: number;
  coverage: number;
}
export interface CheckItem { label: string; status: "pass" | "warn" | "fail"; detail: string }

export function reviewChecklist(l: CaseLog): CheckItem[] {
  return [
    { label: "Observed data audited before calibration", status: l.auditReviewed ? "pass" : "fail",
      detail: l.auditReviewed ? `${l.excludedFlags} of ${l.totalFlags} flagged records excluded` : "Data audit not confirmed" },
    { label: "Calibrated on more than one event", status: l.calibrationTrials > 0 ? "pass" : "fail",
      detail: `${l.calibrationTrials} calibration trial(s) logged on Events A and B` },
    { label: "Validated on a held-out event", status: l.validated ? (l.validationPassed ? "pass" : "warn") : "fail",
      detail: !l.validated ? "Validation not run" : l.validationPassed ? "Event C met every illustrative target" : "Event C missed at least one target; disclosed in report" },
    { label: "No tuning after seeing validation results", status: l.recalibratedAfterValidation ? "warn" : "pass",
      detail: l.recalibratedAfterValidation ? "Parameters were changed after validation; Event C is no longer independent" : "Validation stayed independent" },
    { label: "Continuity errors small (under 1%)", status: !Number.isFinite(l.maxContinuityErrPct) ? "fail" : l.maxContinuityErrPct < 1 ? "pass" : "warn",
      detail: Number.isFinite(l.maxContinuityErrPct) ? `Largest error ${l.maxContinuityErrPct.toFixed(2)}%` : "No runs yet" },
    { label: "Uncertainty quantified with a recorded seed", status: l.ensembleSize >= 20 ? "pass" : "fail",
      detail: l.ensembleSize ? `${l.ensembleSize} runs` : "Ensemble not run" },
    { label: "Uncertainty band checked against held-out data", status: !Number.isFinite(l.coverage) ? "fail" : l.coverage >= 0.8 ? "pass" : "warn",
      detail: Number.isFinite(l.coverage) ? `${Math.round(l.coverage * 100)}% of Event C observations inside the 5-95% band` : "Not checked" },
  ];
}
