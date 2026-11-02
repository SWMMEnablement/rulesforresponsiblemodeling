import { describe, expect, test } from "bun:test";
import {
  c3CapacityFor, convergenceCheck, coverageDiagnosis, ENSEMBLE_CONDUIT_N, ENSEMBLE_SIZES, hydraulicSummary, reviewChecklist,
  START_PARAMS, summariseEnsembleHydraulics,
} from "../src/lib/workedCase";
import { hasProgress, parseSession, serializeSession, stepsDone, type WorkedCaseSession } from "../src/lib/workedCaseSession";

const session: WorkedCaseSession = {
  version: 1, fictional: true, savedAt: "2026-11-02T00:00:00.000Z",
  excluded: { A: [], B: [60], C: [] }, auditConfirmed: true, params: START_PARAMS, trials: [], calSims: null, locked: null,
  validation: { sim: [1, 2], m: { nse: NaN, peakErrPct: 53.2, volErrPct: 4, timingMin: 5, n: 2 } },
  recalibrated: false, seed: 2005, ensembleSize: 100, ensemble: null,
  contLog: { runs: 0, unknownRuns: 0, maxKnown: NaN }, packaged: false, revealed: false,
};

describe("worked case session is kept", () => {
  test("a saved session round-trips, including NaN values", () => {
    const back = parseSession(serializeSession(session))!;
    expect(back.excluded.B).toEqual([60]);
    expect(back.ensembleSize).toBe(100);
    expect(Number.isNaN(back.validation!.m.nse)).toBe(true);
    expect(Number.isNaN(back.contLog.maxKnown)).toBe(true);
  });
  test("files that are not sessions are rejected", () => {
    expect(parseSession("not json")).toBeNull();
    expect(parseSession(JSON.stringify({ version: 2 }))).toBeNull();
  });
  test("an untouched session is not offered for resume; a confirmed audit is", () => {
    expect(hasProgress({ ...session, auditConfirmed: false, excluded: { A: [], B: [], C: [] } })).toBe(false);
    expect(hasProgress(session)).toBe(true);
    expect(stepsDone(session)).toBe(1);
  });
});

describe("capacity is computed per run", () => {
  test("normal-flow capacity spans about 73-120 cfs across the sampled roughness", () => {
    expect(c3CapacityFor(ENSEMBLE_CONDUIT_N.max)).toBeCloseTo(73.4, 0);
    expect(c3CapacityFor(ENSEMBLE_CONDUIT_N.min)).toBeCloseTo(120.1, 0);
  });
  test("a 100 cfs peak exceeds the rough pipe's capacity but not the smooth pipe's", () => {
    const rough = hydraulicSummary([100], [3], [[0]], 0.018);
    const smooth = hydraulicSummary([100], [3], [[0]], 0.011);
    expect(summariseEnsembleHydraulics([rough, smooth]).aboveOwnCapacity).toBe(0.5);
  });
  test("surcharge minutes count report steps with water above the 4 ft crown", () => {
    const h = hydraulicSummary([1, 1, 1, 1], [3, 4.5, 5, 3.9], [[0, 0, 0, 0]], 0.013);
    expect(h.surchargeMin).toBe(10);
    expect(h.maxHglFt).toBe(106);
  });
  test("flood volume integrates flooding rate over the 5-minute step", () => {
    expect(hydraulicSummary([1], [8], [[0, 2], [1, 0]], 0.013).floodFt3).toBe(900);
  });
});

describe("uncertainty explanation is diagnostic", () => {
  test("poor coverage after a failed validation points first at biased parameters, not only gauge noise", () => {
    const causes = coverageDiagnosis(0.37, { nse: 0.53, peakErrPct: 53.2, volErrPct: 5, timingMin: 5, n: 100 }, 40);
    expect(causes[0].cause).toBe("Biased calibrated parameters");
    expect(causes[0].likely).toBe(true);
    expect(causes.length).toBeGreaterThanOrEqual(5);
  });
  test("good coverage lists no causes", () => {
    expect(coverageDiagnosis(0.9, null, 40)).toEqual([]);
  });
  test("run-count choices include 20, 40, 100 and 200", () => {
    expect([...ENSEMBLE_SIZES]).toEqual([20, 40, 100, 200]);
  });
  test("identical halves are stable; a shifted second half is not", () => {
    const a = Array.from({ length: 20 }, (_, i) => 50 + (i % 10));
    expect(convergenceCheck(a).stable).toBe(true);
    const b = [...Array(10).fill(50), ...Array(10).fill(80)];
    expect(convergenceCheck(b).stable).toBe(false);
  });
  test("unsettled percentiles warn in the reviewer checklist", () => {
    const base = { auditReviewed: true, excludedFlags: 1, totalFlags: 8, calibrationTrials: 3, validated: true, recalibratedAfterValidation: false, validationPassed: true, maxContinuityErrPct: 0.1, ensembleSize: 40, coverage: 0.9 };
    expect(reviewChecklist({ ...base, ensembleStable: false }).find((c) => c.label.startsWith("Ensemble percentiles"))?.status).toBe("warn");
  });
});
