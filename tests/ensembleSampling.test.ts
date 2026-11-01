import { describe, expect, test } from "bun:test";
import { ENSEMBLE_RANGES, sampleEnsemble, sampleRun } from "../src/lib/swmm/ensembleSampling";

describe("reproducible ensemble sampling", () => {
  test("the same master seed reproduces identical runs", () => {
    expect(sampleEnsemble(2026, 20)).toEqual(sampleEnsemble(2026, 20));
  });

  test("different master seeds give different parameter sets", () => {
    expect(sampleEnsemble(2026, 20)).not.toEqual(sampleEnsemble(2027, 20));
  });

  test("a recorded run seed alone regenerates that run's parameters", () => {
    const runs = sampleEnsemble(42, 20);
    for (const r of runs) expect(sampleRun(r.index, r.seed)).toEqual(r);
  });

  test("samples stay inside the stated ranges", () => {
    for (const r of sampleEnsemble(7, 500)) {
      expect(r.manningN).toBeGreaterThanOrEqual(ENSEMBLE_RANGES.manningN.min);
      expect(r.manningN).toBeLessThan(ENSEMBLE_RANGES.manningN.max);
      expect(r.rainfallMultiplier).toBeGreaterThanOrEqual(0.7);
      expect(r.rainfallMultiplier).toBeLessThan(1.5);
      expect(r.pctImperv).toBeGreaterThanOrEqual(45);
      expect(r.pctImperv).toBeLessThan(75);
    }
  });
});
