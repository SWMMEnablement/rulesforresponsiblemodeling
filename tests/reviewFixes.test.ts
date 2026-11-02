import { describe, expect, test } from "bun:test";
import { addContinuity, convergenceCheck, hydraulicSummary, summariseEnsembleHydraulics, EMPTY_CONTINUITY, reviewChecklist, runContinuityErr, sampleCaseEnsemble, START_PARAMS, worstContinuity } from "../src/lib/workedCase";
import { buildReadme } from "../src/lib/workedCasePackage";
import { flowStats, summarizeRun } from "../src/lib/swmm/modelLibrary";
import { citedSources, findSources } from "../src/lib/chatSources";

const base = { auditReviewed: true, excludedFlags: 1, totalFlags: 8, calibrationTrials: 3, validated: true, recalibratedAfterValidation: false, validationPassed: true, maxContinuityErrPct: 0.1, ensembleSize: 40, coverage: 0.9 };
const contItem = (l: Parameters<typeof reviewChecklist>[0]) => reviewChecklist(l).find((c) => c.label.startsWith("Continuity"))!;

describe("missing continuity is unknown, never 0%", () => {
  test("a missing value from SWMM stays unknown", () => {
    expect(runContinuityErr(NaN, 0.2)).toBeNaN();
    expect(runContinuityErr(-0.3, 0.2)).toBeCloseTo(0.3, 10);
  });
  test("one unknown run makes the worst case unknown", () => {
    expect(worstContinuity([0.1, NaN, 0.2])).toBeNaN();
  });
  test("an unknown run fails the continuity check even when known runs are small", () => {
    const log = addContinuity(EMPTY_CONTINUITY, [0.1, NaN]);
    expect(log.unknownRuns).toBe(1);
    expect(contItem({ ...base, maxContinuityErrPct: log.maxKnown, continuityUnknownRuns: log.unknownRuns }).status).toBe("fail");
  });
  test("all-known small errors still pass", () => {
    expect(contItem({ ...base, continuityUnknownRuns: 0 }).status).toBe("pass");
  });
});

describe("review package seed", () => {
  test("the report records the seed it was given and that seed reproduces the samples", () => {
    const samples = sampleCaseEnsemble(START_PARAMS, 777, 5);
    const readme = buildReadme({
      times: [], observed: { A: [], B: [], C: [] }, excluded: { A: [], B: [], C: [] }, trials: [], final: START_PARAMS,
      validation: { nse: 1, peakErrPct: 0, volErrPct: 0, timingMin: 0, n: 1 }, recalibratedAfterValidation: false, seed: 777,
      samples, designPeaks: [1, 2, 3, 4, 5], designDeterministicPeak: 3, p5: 1, p50: 3, p95: 5, exceedProb: 0, coverage: 1, checklist: [], createdAt: "x",
      hydraulics: [], detHydraulics: hydraulicSummary([3], [2], [[0]], 0.013), hydraulicStats: summariseEnsembleHydraulics([]),
      convergence: convergenceCheck([1, 2, 3, 4, 5]), coverageCauses: [],
    });
    expect(readme).toContain("master seed **777**");
    expect(sampleCaseEnsemble(START_PARAMS, 777, 5)).toEqual(samples);
  });
});

describe("reverse flow", () => {
  test("an all-negative series reports its minimum and magnitude, not zero", () => {
    const s = flowStats(new Float32Array([-1, -5, -2]));
    expect(s.max).toBe(-1);
    expect(s.min).toBe(-5);
    expect(s.absMax).toBe(5);
  });
  test("library summary keeps the signed largest-magnitude flow", () => {
    const r = summarizeRun({ ok: true, durationMs: 1, massBal: { runoffErr: 0, flowErr: 0 } },
      { links: ["L1", "L2"], linkFlow: [new Float32Array([1, 2]), new Float32Array([-4, -1])], nodeFlooding: [], flowUnits: "CFS" });
    expect(r.peakFlow).toBe(-4);
    expect(r.peakFlowLink).toBe("L2");
  });
});

describe("Ask James sources", () => {
  test("a question about aleatory uncertainty finds the Chapter 2 summary with a link", () => {
    const s = findSources("What is aleatory uncertainty?");
    const hit = s.find((x) => x.id === "c2-aleatory");
    expect(hit).toBeDefined();
    expect(hit!.url).toBe("/chapter/2");
    expect(s.every((x) => x.kind === "app-summary")).toBe(true);
    expect(s.length).toBeLessThanOrEqual(4);
  });
  test("only sources marked in the answer count as cited", () => {
    const s = findSources("calibration validation uncertainty");
    expect(citedSources("Use held-out data [1].", s).map((x) => x.n)).toEqual([1]);
    expect(citedSources("No markers here.", s)).toEqual([]);
  });
});
