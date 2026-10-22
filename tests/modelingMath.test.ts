import { describe, expect, test } from "bun:test";
import { equifinalityFlow, equifinalitySets, physicalSample, runoffCoefficient, sensitivityLevel, waterBudget } from "../src/lib/modelingMath";
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
import { TUTORIAL_INP, applyParams, DEFAULT_PARAMS } from "../src/lib/swmm/tutorialModel";
import { parseSwmmOut } from "../src/lib/swmm/outParser";
test("tutorial storm delivers 3.1 inches over matching 30-minute intervals", () => {
  const values = [...TUTORIAL_INP.matchAll(/\nDesignStorm\s+\d+:\d+\s+([\d.]+)/g)].map(m => Number(m[1]));
  expect(values).toHaveLength(7);
  expect(values.reduce((a, b) => a + b * 0.5, 0)).toBeCloseTo(3.1, 10);
  expect(TUTORIAL_INP).toMatch(/RG1\s+INTENSITY 0:30/);
  const doubled = applyParams(TUTORIAL_INP, { ...DEFAULT_PARAMS, rainfallMultiplier: 2 });
  expect([...doubled.matchAll(/\nDesignStorm\s+\d+:\d+\s+([\d.]+)/g)].reduce((sum, m) => sum + Number(m[1]) * 0.5, 0)).toBeCloseTo(6.2, 10);
});
test("binary chart timestamps begin at the first report-step end", () => {
  const b = new ArrayBuffer(112); const d = new DataView(b);
  d.setInt32(0, 516114522, true);
  d.setFloat64(28, 40000, true); d.setInt32(36, 300, true);
  d.setFloat64(40, 40000 + 300 / 86400, true);
  d.setInt32(88, 28, true); d.setInt32(96, 40, true); d.setInt32(100, 1, true); d.setInt32(108, 516114522, true);
  // One period with no objects still includes fifteen system variables.
  const full = new ArrayBuffer(132); const f = new DataView(full);
  new Uint8Array(full).set(new Uint8Array(b).slice(0, 88));
  f.setInt32(108, 28, true); f.setInt32(116, 40, true); f.setInt32(120, 1, true); f.setInt32(128, 516114522, true);
  expect(parseSwmmOut(full).times[0]).toBe(300);
});
