import { describe, expect, test } from "bun:test";
import { equifinalityFlow, equifinalitySets, physicalSample, runoffCoefficient, sensitivityLevel, waterBudget } from "./modelingMath";
describe("review regression rules", () => {
  test("annual water budget closes across input extremes", () => {
    for (const p of [400, 1000, 2000]) for (const imp of [0, 30, 90]) for (const veg of [0, 50, 100]) for (const rate of [5, 25, 100]) for (const temp of [0, 15, 30]) {
      const b = waterBudget(p, imp, veg, rate, temp);
      expect(b.actualET + b.infiltration + b.totalRunoff).toBeCloseTo(p, 10);
      expect(b.infiltration).toBeGreaterThanOrEqual(0);
      expect(b.baseflow + b.deepPercolation).toBeCloseTo(b.infiltration, 10);
    }
  });
  test("all equifinality presets produce the stated 47 cfs", () => {
    for (const p of equifinalitySets) expect(equifinalityFlow(p.n, p.imp)).toBeCloseTo(47, 10);
  });
  test("runoff coefficient is a volume ratio, not a routing factor", () => {
    const p = { Imperviousness: 50, "Depression Storage": 2.5, "Infiltration Rate": 25, "Manning's n (Conduit)": 0.015, "Subcatchment Width": 500 };
    expect(runoffCoefficient(p)).toBe(82.5);
    expect(runoffCoefficient({ ...p, "Manning's n (Conduit)": 0.03, "Subcatchment Width": 100 })).toBe(82.5);
  });
  test("sensitivity labels use computed changes", () => {
    expect(sensitivityLevel(25)).toBe("high");
    expect(sensitivityLevel(9)).toBe("medium");
    expect(sensitivityLevel(0)).toBe("low");
  });
  test("negative normal tails cannot create negative roughness or slope", () => {
    expect(physicalSample(0.013, -10, 60, 0.001)).toBe(0.001);
    expect(physicalSample(0.02, -10, 40, 0.0001)).toBe(0.0001);
    expect(physicalSample(0.45, 10, 50, 0, 1)).toBe(1);
  });
});