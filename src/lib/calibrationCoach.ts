// Pure maths for the Chapter 8 Calibration Coach micro-app.

/** Synthetic "observed" hourly hydrograph (illustrative, not a gauged record). */
export const OBSERVED = [0, 2, 8, 25, 45, 38, 22, 12, 6, 3, 1, 0];
export const OBSERVED_PEAK_INDEX = OBSERVED.indexOf(Math.max(...OBSERVED));

export interface CoachParams {
  peakScale: number; // multiplies the whole event
  timing: number; // hours; positive = simulated hydrograph arrives later
  baseflow: number; // constant added flow
  recession: number; // falling-limb length factor; >1 = slower recession
}

/** Perfect-fit values: the coach never starts here. */
export const PERFECT_FIT: CoachParams = { peakScale: 1, timing: 0, baseflow: 0, recession: 1 };
/** Deliberately mismatched starting point so the user has something to calibrate. */
export const START_PARAMS: CoachParams = { peakScale: 0.6, timing: 1.5, baseflow: 4, recession: 1.4 };

/** Linear interpolation of the observed series at fractional hour t (0 outside the record). */
export function observedAt(t: number): number {
  if (t < 0 || t > OBSERVED.length - 1) return 0;
  const i = Math.floor(t);
  const f = t - i;
  const next = i + 1 < OBSERVED.length ? OBSERVED[i + 1] : 0;
  return OBSERVED[i] * (1 - f) + next * f;
}

export function simulate(p: CoachParams): number[] {
  const tp = OBSERVED_PEAK_INDEX;
  return OBSERVED.map((_, i) => {
    const local = i - p.timing; // undo the timing shift (fractional shifts interpolate)
    // Recession only reshapes the falling limb: stretch time after the peak.
    const src = local > tp ? tp + (local - tp) / p.recession : local;
    return Math.max(0, observedAt(src) * p.peakScale + p.baseflow);
  });
}

export function nashSutcliffe(observed: number[], simulated: number[]): number {
  const mean = observed.reduce((s, v) => s + v, 0) / observed.length;
  const ssRes = observed.reduce((s, v, i) => s + (v - simulated[i]) ** 2, 0);
  const ssTot = observed.reduce((s, v) => s + (v - mean) ** 2, 0);
  return ssTot > 0 ? 1 - ssRes / ssTot : 0;
}
