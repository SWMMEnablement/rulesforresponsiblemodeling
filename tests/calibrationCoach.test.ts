import { describe, expect, test } from "bun:test";
import { OBSERVED, OBSERVED_PEAK_INDEX, PERFECT_FIT, START_PARAMS, nashSutcliffe, simulate } from "../src/lib/calibrationCoach";

describe("Calibration Coach", () => {
  test("starts with a real mismatch, not NSE = 1.00", () => {
    expect(nashSutcliffe(OBSERVED, simulate(START_PARAMS))).toBeLessThan(0.5);
  });

  test("the perfect-fit parameters reproduce the observed hydrograph", () => {
    expect(nashSutcliffe(OBSERVED, simulate(PERFECT_FIT))).toBeCloseTo(1, 10);
  });

  test("a +0.5 hour timing shift changes the hydrograph", () => {
    const shifted = simulate({ ...PERFECT_FIT, timing: 0.5 });
    expect(shifted).not.toEqual(OBSERVED);
    expect(shifted[OBSERVED_PEAK_INDEX]).toBeCloseTo((25 + 45) / 2, 10);
  });

  test("recession changes only the falling limb, unlike peak scaling", () => {
    const slow = simulate({ ...PERFECT_FIT, recession: 1.5 });
    for (let i = 0; i <= OBSERVED_PEAK_INDEX; i++) expect(slow[i]).toBeCloseTo(OBSERVED[i], 10);
    expect(slow[OBSERVED_PEAK_INDEX + 2]).toBeGreaterThan(OBSERVED[OBSERVED_PEAK_INDEX + 2]);
  });
});
