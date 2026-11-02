// Saves and restores a Worked Case session (browser storage + JSON export/import).
// Observations are regenerated from the hidden parameters and seeded noise, so only the
// user's decisions and results are stored. NaN/Infinity survive the round trip.
import { safeStorage } from "@/lib/storage";
import type { CaseParams, CaseSample, ContinuityLog, FitMetrics, HydraulicSummary } from "@/lib/workedCase";
import type { CalTrial } from "@/lib/workedCasePackage";

export type ObsKey = "A" | "B" | "C";
export interface Band { lo: number[]; mid: number[]; hi: number[] }
export interface EnsembleResult {
  seed: number;
  samples: CaseSample[];
  designPeaks: number[];
  designDet: number;
  designDetFlow: number[];
  design: Band;
  val: Band;
  coverage: number;
  contErr: number;
  progress: number;
  /** Per-run hydraulic consequences in the design storm (same order as samples). */
  hydraulics: HydraulicSummary[];
  detHydraulics: HydraulicSummary;
}

export interface WorkedCaseSession {
  version: 1;
  fictional: true;
  savedAt: string;
  excluded: Record<ObsKey, number[]>;
  auditConfirmed: boolean;
  params: CaseParams;
  trials: CalTrial[];
  calSims: { A: number[]; B: number[] } | null;
  locked: CaseParams | null;
  validation: { sim: number[]; m: FitMetrics } | null;
  recalibrated: boolean;
  seed: number;
  ensembleSize: number;
  ensemble: EnsembleResult | null;
  contLog: ContinuityLog;
  packaged: boolean;
  revealed: boolean;
}

export const SESSION_KEY = "worked-case-session-v1";
const TAG = "__num:";

export function serializeSession(s: WorkedCaseSession): string {
  return JSON.stringify(s, (_k, v) => (typeof v === "number" && !Number.isFinite(v) ? `${TAG}${v}` : v));
}

const isParams = (p: unknown): p is CaseParams =>
  !!p && typeof p === "object" && ["pctImperv", "widthFactor", "maxInfil"].every((k) => typeof (p as Record<string, unknown>)[k] === "number");

/** Returns a session, or null when the text is not a valid version-1 session. */
export function parseSession(text: string): WorkedCaseSession | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text, (_k, v) => (typeof v === "string" && v.startsWith(TAG) ? Number(v.slice(TAG.length)) : v));
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<WorkedCaseSession>;
  if (s.version !== 1 || !isParams(s.params) || !Array.isArray(s.trials)) return null;
  const ex = s.excluded;
  if (!ex || !(["A", "B", "C"] as const).every((k) => Array.isArray(ex[k]) && ex[k].every((i) => Number.isInteger(i)))) return null;
  if (s.locked !== null && s.locked !== undefined && !isParams(s.locked)) return null;
  return {
    version: 1, fictional: true, savedAt: typeof s.savedAt === "string" ? s.savedAt : new Date().toISOString(),
    excluded: { A: ex.A, B: ex.B, C: ex.C },
    auditConfirmed: !!s.auditConfirmed, params: s.params, trials: s.trials,
    calSims: s.calSims ?? null, locked: s.locked ?? null, validation: s.validation ?? null,
    recalibrated: !!s.recalibrated, seed: typeof s.seed === "number" ? s.seed : 2005,
    ensembleSize: typeof s.ensembleSize === "number" ? s.ensembleSize : 40,
    ensemble: s.ensemble && Array.isArray(s.ensemble.hydraulics) ? s.ensemble : null,
    contLog: s.contLog ?? { runs: 0, unknownRuns: 0, maxKnown: NaN },
    packaged: !!s.packaged, revealed: !!s.revealed,
  };
}

/** A session with nothing done yet is not worth resuming. */
export const hasProgress = (s: WorkedCaseSession | null) =>
  !!s && (s.auditConfirmed || s.trials.length > 0 || s.excluded.A.length + s.excluded.B.length + s.excluded.C.length > 0);

export const loadSession = (): WorkedCaseSession | null => {
  const t = safeStorage.getItem(SESSION_KEY);
  return t ? parseSession(t) : null;
};
export const saveSession = (s: WorkedCaseSession) => safeStorage.setItem(SESSION_KEY, serializeSession(s));
export const clearSession = () => safeStorage.removeItem(SESSION_KEY);

/** Which of the five steps a saved session has reached (0-5), for "Resume" labels. */
export function stepsDone(s: WorkedCaseSession | null): number {
  if (!s) return 0;
  return [s.auditConfirmed, s.trials.length > 0 && !!s.locked, !!s.validation, !!s.ensemble, s.packaged].filter(Boolean).length;
}
