// Seeded, reproducible Monte-Carlo sampling for the Playground ensemble.
// The same master seed always yields the same run seeds and parameter sets.

export const ENGINE_VERSION = "EPA SWMM 5.2.4 (WebAssembly)";

export const ENSEMBLE_RANGES = {
  manningN: { dist: "uniform", min: 0.011, max: 0.025 },
  rainfallMultiplier: { dist: "uniform", min: 0.7, max: 1.5 },
  pctImperv: { dist: "uniform", min: 45, max: 75 },
} as const;

/** mulberry32: small, deterministic 32-bit PRNG returning values in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SampledRun {
  index: number;
  seed: number;
  manningN: number;
  rainfallMultiplier: number;
  pctImperv: number;
}

const uni = (r: () => number, min: number, max: number) => min + r() * (max - min);

/** Parameters for one run depend only on that run's seed. */
export function sampleRun(index: number, seed: number): SampledRun {
  const r = mulberry32(seed);
  const R = ENSEMBLE_RANGES;
  return {
    index,
    seed,
    manningN: uni(r, R.manningN.min, R.manningN.max),
    rainfallMultiplier: uni(r, R.rainfallMultiplier.min, R.rainfallMultiplier.max),
    pctImperv: uni(r, R.pctImperv.min, R.pctImperv.max),
  };
}

/** Derive N run seeds from a master seed, then sample each run. */
export function sampleEnsemble(masterSeed: number, n: number): SampledRun[] {
  const master = mulberry32(masterSeed);
  return Array.from({ length: n }, (_, i) => sampleRun(i, Math.floor(master() * 2 ** 31)));
}
