import { describe, expect, test } from "bun:test";
import {
  auditSeries, bandCoverage, buildCaseInp, C3_CAPACITY_CFS, EVENTS, fitMetrics, makeObserved, reviewChecklist,
  sampleCaseEnsemble, START_PARAMS, TRUTH,
} from "../src/lib/workedCase";

const base = { auditReviewed: true, excludedFlags: 1, totalFlags: 8, calibrationTrials: 3, validated: true, recalibratedAfterValidation: false, validationPassed: true, maxContinuityErrPct: 0.1, ensembleSize: 40, coverage: 0.9 };

describe("worked case", () => {
  test("the case is labelled fictional inside every model file", () => {
    expect(buildCaseInp(START_PARAMS, EVENTS.A)).toContain("FICTIONAL catchment");
  });
  test("C3 full-flow capacity follows Manning for a 4 ft pipe at 0.5%", () => {
    expect(C3_CAPACITY_CFS).toBeCloseTo(101.6, 1);
  });
  test("observations are reproducible and contain a gap in A and a spike in B", () => {
    const truth = Array.from({ length: 119 }, (_, i) => 20 * Math.exp(-(((i - 30) / 12) ** 2)));
    expect(makeObserved(truth, "A")).toEqual(makeObserved(truth, "A"));
    expect(auditSeries(makeObserved(truth, "A")).filter((f) => f.kind === "gap").length).toBe(7);
    expect(auditSeries(makeObserved(truth, "B")).some((f) => f.kind === "spike" && f.index === 60)).toBe(true);
  });
  test("metrics skip missing and excluded records", () => {
    const obs = [0, 10, NaN, 100, 0];
    const sim = [0, 10, 50, 20, 0];
    expect(fitMetrics(obs, sim, new Set([3])).n).toBe(3);
    expect(fitMetrics(obs, sim, new Set([3])).nse).toBe(1);
  });
  test("peak timing is measured in minutes at the 5-minute report step", () => {
    expect(fitMetrics([0, 5, 1, 0], [0, 1, 1, 5]).timingMin).toBe(10);
  });
  test("same seed gives the same ensemble; a different seed does not", () => {
    expect(sampleCaseEnsemble(TRUTH, 2005, 5)).toEqual(sampleCaseEnsemble(TRUTH, 2005, 5));
    expect(sampleCaseEnsemble(TRUTH, 2006, 5)[0].seed).not.toBe(sampleCaseEnsemble(TRUTH, 2005, 5)[0].seed);
  });
  test("ensemble samples stay inside the stated ranges", () => {
    for (const s of sampleCaseEnsemble(TRUTH, 7, 200)) {
      expect(s.pctImperv / TRUTH.pctImperv).toBeGreaterThanOrEqual(0.85 - 1e-9);
      expect(s.pctImperv / TRUTH.pctImperv).toBeLessThanOrEqual(1.15 + 1e-9);
      expect(s.rainFactor).toBeGreaterThanOrEqual(0.9);
      expect(s.rainFactor).toBeLessThanOrEqual(1.1);
    }
  });
  test("band coverage ignores missing observations", () => {
    expect(bandCoverage([1, NaN, 5], [0, 0, 0], [2, 2, 2])).toBe(0.5);
  });
  test("re-tuning after validation is flagged in the review", () => {
    const item = reviewChecklist({ ...base, recalibratedAfterValidation: true }).find((c) => c.label.startsWith("No tuning"));
    expect(item?.status).toBe("warn");
  });
  test("skipping validation fails the review item", () => {
    const item = reviewChecklist({ ...base, validated: false }).find((c) => c.label.startsWith("Validated"));
    expect(item?.status).toBe("fail");
  });
});

describe("worked case ensemble roughness", () => {
  test("pipe roughness is sampled between 0.011 and 0.018", () => {
    for (const s of sampleCaseEnsemble(TRUTH, 11, 200)) {
      expect(s.conduitN).toBeGreaterThanOrEqual(0.011);
      expect(s.conduitN).toBeLessThanOrEqual(0.018);
    }
  });
});
