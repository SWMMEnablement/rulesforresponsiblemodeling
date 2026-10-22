/** Simplified teaching models, not SWMM engine substitutes. */
export function waterBudget(P: number, impPercent: number, vegPercent: number, infRate: number, temp: number) {
  const imp = impPercent / 100;
  const veg = vegPercent / 100;
  const potentialET = Math.min(P * 0.8, 50 + temp * 30 + veg * 200);
  const actualET = Math.max(0, Math.min(P, potentialET * (1 - imp * 0.7) * (0.5 + veg * 0.5)));
  const available = P - actualET;
  const infiltration = Math.min(available, Math.max(0, available * (infRate / 50) * (1 - imp) * 0.6));
  const totalRunoff = Math.max(0, P - actualET - infiltration);
  return { actualET, infiltration, totalRunoff, baseflow: infiltration * 0.4, deepPercolation: infiltration * 0.6, closure: P - actualET - infiltration - totalRunoff };
}

export const equifinalitySets = [
  { n: 0.010, imp: 50, label: "Low n, Low Imp" },
  { n: 0.013, imp: 56, label: "Mid n, Mid Imp" },
  { n: 0.018, imp: 66, label: "High n, High Imp" },
  { n: 0.020, imp: 70, label: "Very High n, High Imp" },
];
export function equifinalityFlow(n: number, imp: number) {
  return 47 + (0.015 - n) * 800 + (imp - 60) * 0.4;
}

export function runoffCoefficient(params: Record<string, number>, rainfall = 50) {
  if (rainfall <= 0) return 0;
  const imp = params["Imperviousness"] / 100;
  const effective = Math.max(0, rainfall - params["Depression Storage"]);
  const runoff = effective * imp + Math.max(0, effective - params["Infiltration Rate"] * 0.5) * (1 - imp);
  return 100 * runoff / rainfall;
}

export function sensitivityLevel(change: number): "high" | "medium" | "low" {
  return change >= 20 ? "high" : change >= 5 ? "medium" : "low";
}

export function physicalSample(base: number, z: number, percent: number, min: number, max = Infinity) {
  return Math.min(max, Math.max(min, base * (1 + z * percent / 100)));
}